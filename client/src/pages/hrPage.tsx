import React, { useState, useRef } from "react";
import MainLayout from "../components/mainLayout";
import { trpc } from "../utils/trpcSetup";
import Modal from "../components/modal";
import { parse } from "papaparse";
import { toast } from "react-toastify";
import upIcon from "../components/images/up.svg";
import downIcon from "../components/images/down.svg";
import PolicyDetails from "../components/policyDetails";

interface Dependent {
  id: number;
  name: string;
  age: number;
  relation: string;
  employeeId: number;
}
interface Employee {
  id?: number;
  name: string;
  age: number;
  email: string;
  contactNumber: string;
  dependents: Dependent[];
}

function HRPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [isBulkUploadModalOpen, setBulkUploadModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [form, setForm] = useState({
    name: "",
    age: 0,
    email: "",
    contactNumber: "",
    dependents: [],
  });
  const [fileSelected, setFileSelected] = useState(false);
  const [parsedEmployees, setParsedEmployees] = useState<Employee[]>([]);

  const {
    data: employees,
    isLoading,
    refetch,
  } = trpc.hr.listAllEmployees.useQuery();
  const addEmployee = trpc.hr.addEmployee.useMutation();
  const deleteEmployee = trpc.hr.deleteEmployee.useMutation();
  const uploadEmployees = trpc.hr.uploadEmployees.useMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      if (event.target.files[0].type !== "text/csv") {
        toast.error("Only CSV files are allowed.");
        return;
      }
      setFileSelected(true);
      parseFile(event.target.files[0]);
    }
  };

  const parseFile = (file: File) => {
    parse(file, {
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error("Error reading the CSV file.");
          setBulkUploadModalOpen(false);
          return;
        }
        if (results.data.length > 501) {
          toast.error("The file cannot have more than 500 employees.");
          setBulkUploadModalOpen(false);
          return;
        }
        const headers = results.data[0] as string[];
        const requiredHeaders = ["Name", "Age", "Email", "Contact Number"];
        if (headers && !requiredHeaders.every((h) => headers.includes(h))) {
          toast.error("CSV headers do not match the required format.");
          setBulkUploadModalOpen(false);
          return;
        }
        const employees = results.data.slice(1).map((row: any) => ({
          name: row[0] || "",
          age: parseInt(row[1], 10) || 0,
          email: row[2] || "",
          contactNumber: row[3] || "",
          dependents: [],
        }));

        console.log(employees);

        const validEmployees = employees.filter(
          (emp) => emp.name && !isNaN(emp.age) && emp.email && emp.contactNumber
        );

        if (validEmployees.length !== employees.length) {
          toast.error("Some records were invalid and have been omitted.");
        }
        setParsedEmployees(validEmployees);
        setFileSelected(false);
        if (validEmployees.length > 0) {
          toast.success("File parsed successfully. Click on Upload.");
        } else {
          toast.error("No valid records to upload.");
          setBulkUploadModalOpen(false);
        }
      },
      // header: true,
      skipEmptyLines: true,
    });
  };

  const handleFileUpload = () => {
    uploadEmployees.mutate(
      { employees: parsedEmployees },
      {
        onSuccess: () => {
          toast.success("File uploaded!");
          refetch();
          setParsedEmployees([]);
          setFileSelected(false);
        },
        onError: (error) => {
          toast.error("Error in file upload!");
          console.error("Error uploading employees:", error);
        },
      }
    );
    setBulkUploadModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployeeClick = () => {
    if (!form.name || form.age <= 0 || !form.email || !form.contactNumber) {
      toast.error("Please fill all fields correctly.");
      return;
    }
    const payload = {
      ...form,
      age: Number(form.age),
    };

    addEmployee.mutate(payload, {
      onSuccess: () => {
        refetch();
        toast.success("Successfully added!");

        setShowDetailsPanel(false);
        setForm({
          name: "",
          age: 0,
          email: "",
          contactNumber: "",
          dependents: [],
        });
      },
    });
  };

  const handleDeleteEmployeeClick = (employeeId: number) => {
    deleteEmployee.mutate(
      { employeeId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Successfully deleted!");
          setSelectedEmployee(null);
        },
      }
    );
  };

  const bulkUploadModal = (
    <Modal
      isOpen={isBulkUploadModalOpen}
      onClose={() => {
        setBulkUploadModalOpen(false);
        setFileSelected(false);
        setParsedEmployees([]);
      }}
    >
      <h2 className="heading" style={{ marginTop: "1.5rem", fontSize: "25px" }}>
        Bulk Import*
      </h2>
      <div className="bulk-data">
        <h3 style={{ marginBottom: "1rem" }}>General Guidelines -</h3>
        <ul>
          <li className="list">
            The .csv file must contain only the following headers: Name, Age,
            Email, Contact Number, case sensitive
          </li>
          <li className="list">
            The file cannot have more than 500 employees at one time.
          </li>
          <li className="list">
            Relations allowed - Self, Spouse, Mother, Father, Son, Daughter
          </li>
        </ul>
        <div className="btn-div">
          <input
            type="file"
            ref={fileRef}
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            className="btn1"
            onClick={() => {
              console.log("Button clicked");
              fileRef.current?.click();
            }}
            disabled={fileSelected || parsedEmployees.length > 0}
          >
            Browse Files
          </button>
          <button
            className="btn1"
            onClick={handleFileUpload}
            disabled={parsedEmployees.length === 0}
          >
            Upload data
          </button>
        </div>
      </div>
    </Modal>
  );

  const mainContent = (
    <div className="content-div">
      {employees?.map((employee) => (
        <div
          className="list-box"
          key={employee.id}
          style={{
            margin: "0.3rem 0",
            borderColor:
              selectedEmployee === employee ? "#27378c" : "rgb(230, 233, 230)",
          }}
          onClick={() => setSelectedEmployee(employee)}
        >
          <div className="pic">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              fill="currentColor"
              className="bi bi-person"
              viewBox="0 0 16 16"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
          </div>
          <div className="details">
            <div className="name">{employee.name}</div>

            <div className="more">
              Emp. ID : {employee.id} | {employee.email}
            </div>
          </div>
          <div className="delete">
            <img
              onClick={() => handleDeleteEmployeeClick(employee.id)}
              src="/trash.svg"
              alt="delete"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const rightContent = selectedEmployee !== null && (
    <div className="emp-details">
      <h1 className="heading">Employee Details</h1>
      <div className="box">
        <div
          className="dropdown"
          style={{ height: showDropdown ? "auto" : "100%" }}
        >
          Group Health Insurance
          <img
            src={showDropdown ? upIcon : downIcon}
            alt="icon"
            onClick={() => {
              setShowDropdown(!showDropdown);
            }}
          />
        </div>
        {showDropdown && (
          <div className="detailing">
            <p
              className="data-part"
              style={{ fontSize: "1.1rem", color: "#444444" }}
            >
              Dependents:
            </p>
            <div
              className="list-box"
              style={{ margin: "0.3rem 0", cursor: "default" }}
              key={selectedEmployee.id}
            >
              <div className="pic">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  fill="currentColor"
                  className="bi bi-person"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                </svg>
              </div>

              <div className="details">
                <div className="name">{selectedEmployee.name}</div>

                <div className="more">Age: {selectedEmployee.age}</div>
              </div>
            </div>
            {selectedEmployee.dependents &&
              selectedEmployee.dependents.length > 0 &&
              selectedEmployee.dependents.map((dependent) => (
                <div
                  className="list-box"
                  style={{ margin: "0.3rem 0", cursor: "default" }}
                  key={dependent.id}
                >
                  <div className="pic">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      fill="currentColor"
                      className="bi bi-person"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                    </svg>
                  </div>
                  <div className="details">
                    <div className="name">Name: {dependent.name}</div>
                    <div className="more">
                      Age: {dependent.age} | Relation: {dependent.relation}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );

  if (isLoading)
    return (
      <div className="main">
        <div className="loader"></div>
      </div>
    );
  if (!employees) return <div className="main">No employees found</div>;

  return (
    <MainLayout
      headerTitle="HR Dashboard"
      headerActions={
        <>
          <button className="btn1" onClick={() => setShowDetailsPanel(true)}>
            Add Employee
          </button>
          <button className="btn1" onClick={() => setBulkUploadModalOpen(true)}>
            Bulk Import
          </button>
        </>
      }
      mainContent={mainContent}
      rightContent={rightContent}
    >
      {bulkUploadModal}
      <div className={`fly-in-panel ${showDetailsPanel ? "open" : ""}`}>
        <div className="header">
          <h2 className="heading" id="main-head">
            Add an Employee
          </h2>
          <div
            className="btndiv"
            style={{ position: "absolute", right: "2rem" }}
          >
            <button className="btn1" onClick={handleAddEmployeeClick}>
              Submit
            </button>
            <button className="btn1" onClick={() => setShowDetailsPanel(false)}>
              Cancel
            </button>
          </div>
        </div>
        <div className="cont-div">
          <div id="add-employee-form-div">
            <form id="add-employee-form">
              <input
                name="name"
                id="name"
                placeholder="Name"
                required
                value={form.name}
                className="myinput2"
                onChange={handleFormChange}
              />
              <input
                name="age"
                id="age"
                required
                placeholder="Age"
                className="myinput2"
                type="number"
                value={form.age}
                onChange={handleFormChange}
              />
              <input
                name="email"
                id="email"
                required
                className="myinput2"
                placeholder="Email"
                value={form.email}
                onChange={handleFormChange}
              />
              <input
                name="contactNumber"
                id="contactNumber"
                className="myinput2"
                required
                placeholder="Contact Number"
                value={form.contactNumber}
                onChange={handleFormChange}
              />
            </form>
          </div>
          <div className="policy-details">
            <PolicyDetails />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default HRPage;
