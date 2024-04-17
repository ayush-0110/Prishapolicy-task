import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./utils/trpcSetup";
import { httpBatchLink } from "@trpc/client";
import AuthPage from "./pages/authPage";
import EmployeePage from "./pages/employeePage";
import HRPage from "./pages/hrPage";
import { decodeJWT } from "./utils/jwt";

function Authenticate() {
  const navigate = useNavigate();

  const token = localStorage.getItem("jwtToken");
  useEffect(() => {
    console.log(token);
    if (token) {
      const user = decodeJWT(token);
      const currentTime = Date.now() / 1000;

      if (user && user.role && user.exp > currentTime) {
        console.log(user);

        if (user.role === "HR_MANAGER") {
          navigate("/hr");
        } else if (user.role === "EMPLOYEE") {
          navigate("/employee");
        }
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, token]);

  return null;
}

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:4000/trpc",

          async headers() {
            const token = localStorage.getItem("jwtToken");
            return { authorization: token ? `Bearer ${token}` : "" };
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Authenticate />
          <ToastContainer position="top-center" />
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/employee" element={<EmployeePage />} />
            <Route path="/hr" element={<HRPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
