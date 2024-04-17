import React, { useState } from "react";
import MainLayout from "../components/mainLayout";
import { trpc } from "../utils/trpcSetup";
import Modal from "../components/modal";
import { decodeJWT } from "../utils/jwt";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Dependent {
  id: number;
  name: string;
  age: number;
  relation: string;
  employeeId: number;
}

function EmployeePage() {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: 0, relation: "" });
  const [editMode, setEditMode] = useState(false);
  const [selectedDependent, setSelectedDependent] = useState<Dependent | null>(
    null
  );

  const jwtToken = localStorage.getItem("jwtToken");
  const decodedToken = jwtToken ? decodeJWT(jwtToken) : null;
  const email = decodedToken?.email;

  const {
    data: employee,
    isLoading,
    refetch,
  } = trpc.employee.getEmployee.useQuery({ email: email });
  const addDependent = trpc.employee.addDependent.useMutation();
  const updateDependent = trpc.employee.updateDependent.useMutation();
  const deleteDependent = trpc.employee.deleteDependent.useMutation();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    setEditMode(false);
    setForm({ name: "", age: 0, relation: "" });
    setModalOpen(true);
  };

  const handleEditClick = (dependent: Dependent) => {
    setEditMode(true);
    setForm(dependent);
    setSelectedDependent(dependent);
    setModalOpen(true);
  };

  const handleDeleteClick = (dependentId: number) => {
    deleteDependent.mutate(
      { dependentId },
      {
        onSuccess: () => {
          refetch();
          toast.success("Deletion successful");
          setSelectedDependent(null);
        },
      }
    );
  };

  const submitForm = () => {
    const employeeId = employee?.id;
    if (!employee || !employeeId) {
      toast.error("Employee details not available.");
      return;
    }

    const payload = {
      ...form,
      age: Number(form.age),
      email: employee?.email
    };
    if (editMode && selectedDependent) {
      updateDependent.mutate(
        {
          dependentId: selectedDependent.id,
          updates: { ...payload },
        },
        {
          onSuccess: () => {
            refetch();
            setModalOpen(false);
            toast.success("Successfully updated!");
          },
        }
      );
    } else {
      addDependent.mutate(
        { ...payload, employeeId },
        {
          onSuccess: () => {
            refetch();
            toast.success("Successfully added!");
            setModalOpen(false);
            setForm({ name: "", age: 0, relation: "" });
          },
        }
      );
    }
  };

  const employeeActions = (
    <button className="btn1" onClick={handleAddClick}>
      Add Dependent
    </button>
  );

  const mainContent = (
    <div className="content-div">
      {employee?.dependents.map((dependent) => (
        <div
          className="list-box"
          style={{ margin: "0.5rem 0" }}
          key={dependent.id}
          onClick={() => setSelectedDependent(dependent)}
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
            <div className="name">{dependent.name}</div>

            <div className="more">Relation: {dependent.relation}</div>
          </div>
          <div className="delete">
            <img
              className="edit"
              src="/edit.svg"
              alt="edit"
              onClick={() => handleEditClick(dependent)}
            />
            <img
              onClick={() => handleDeleteClick(employee.id)}
              src="/trash.svg"
              alt="delete"
            />
          </div>
        </div>
      ))}
    </div>
  );

  const rightContent = selectedDependent !== null && (
    <div emp-details>
      <h1 className="heading">Dependent Details:</h1>
      <div className="box">
        <p className="data-part">
          <strong>Name: </strong> {selectedDependent.name}
        </p>
        <p className="data-part">
          <strong>Age: </strong> {selectedDependent.age}
        </p>
        <p className="data-part">
          <strong>Relation: </strong> {selectedDependent.relation}
        </p>
      </div>
    </div>
  );

  if (isLoading)
    return (
      <div className="main">
        <div className="loader"></div>
      </div>
    );
  if (!employee) {
    setTimeout(() => {
      localStorage.removeItem("jwtToken");
      navigate("/login", { replace: true });
    }, 5000);
    return (
      <div className="main" style={{ fontSize: "2rem" }}>
        Employee not found. Kindly Contact HR. Redirecting to Login screen...
      </div>
    );
  }

  return (
    <MainLayout
      headerTitle="Employee Dashboard"
      headerActions={employeeActions}
      mainContent={mainContent}
      rightContent={rightContent}
    >
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
        >
          <h2
            className="heading"
            style={{ margin: "1rem", marginTop: "2rem", fontSize: "25px" }}
          >
            {editMode ? "Update Dependent" : "Add a dependent"}
          </h2>
          <input
            name="name"
            placeholder="Name"
            required
            className="myinput1"
            value={form.name}
            onChange={handleFormChange}
          />
          <input
            name="age"
            required
            placeholder="Age"
            className="myinput1"
            type="number"
            value={form.age}
            onChange={handleFormChange}
          />
          <input
            name="relation"
            required
            placeholder="Relation"
            className="myinput1"
            value={form.relation}
            onChange={handleFormChange}
          />
          <button className="btn1" type="submit">
            Submit
          </button>
        </form>
      </Modal>
    </MainLayout>
  );
}

export default EmployeePage;
