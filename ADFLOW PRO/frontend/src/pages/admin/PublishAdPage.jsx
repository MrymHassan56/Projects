import {
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

const PublishAdPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      publishNow: true,
      publishAt: "",
      isFeatured: false,
      adminBoost: 0,
    });

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      await api.patch(
        `/admin/ads/${id}/publish`,
        formData
      );

      toast.success(
        "Ad published successfully"
      );

      navigate(
        "/admin/dashboard"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl">

      <h1 className="text-3xl font-bold mb-6">

        Publish Ad

      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="publishNow"
            checked={
              formData.publishNow
            }
            onChange={
              handleChange
            }
          />

          <label>
            Publish Immediately
          </label>

        </div>

        {!formData.publishNow && (
          <input
            type="datetime-local"
            name="publishAt"
            className="w-full border p-3 rounded"
            value={
              formData.publishAt
            }
            onChange={
              handleChange
            }
          />
        )}

        <div className="flex items-center gap-3">

          <input
            type="checkbox"
            name="isFeatured"
            checked={
              formData.isFeatured
            }
            onChange={
              handleChange
            }
          />

          <label>
            Featured Ad
          </label>

        </div>

        <input
          type="number"
          name="adminBoost"
          placeholder="Admin Boost"
          className="w-full border p-3 rounded"
          value={
            formData.adminBoost
          }
          onChange={
            handleChange
          }
        />

        <button
          className="bg-black text-white px-6 py-3 rounded"
        >
          Publish Ad
        </button>

      </form>
    </div>
  );
};

export default PublishAdPage;