import {
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

import {
  useAuth,
} from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        formData
      );

      login(
        res.data.user,
        res.data.token
      );

      toast.success(
        "Login successful"
      );

      const role =
        res.data.user.role;

      if (role === "client") {
        navigate(
          "/client/dashboard"
        );
      }

      else if (
        role === "moderator"
      ) {
        navigate(
          "/moderator/dashboard"
        );
      }

      else if (
        role === "admin" ||
        role === "super_admin"
      ) {
        navigate(
          "/admin/dashboard"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-[400px]"
      >
        <h1 className="text-2xl font-bold mb-4">
          Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

        <button
          className="bg-black text-white px-4 py-2 w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;