import {
  useState,
} from "react";

import { useNavigate } from
  "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      fullName: "",
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
      await api.post(
        "/auth/register",
        formData
      );

      toast.success(
        "Account created successfully"
      );

      navigate("/login");
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
          Register
        </h1>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="w-full border p-2 mb-3"
          onChange={handleChange}
        />

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
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;