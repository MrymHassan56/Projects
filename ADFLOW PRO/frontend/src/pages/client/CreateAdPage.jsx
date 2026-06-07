import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const CreateAdPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    city: "",
    price: "",
    contactPhone: "",
    mediaUrls: [""],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes, cityRes] = await Promise.all([api.get("/categories"), api.get("/cities")]);
        setCategories(categoryRes.data.data);
        setCities(cityRes.data.data);

        if (isEditing) {
          const dashboardRes = await api.get("/client/dashboard");
          const currentAd = dashboardRes.data.data.find((item) => item._id === id);

          if (currentAd) {
            setFormData({
              title: currentAd.title,
              description: currentAd.description,
              category: currentAd.category?._id || currentAd.category,
              city: currentAd.city?._id || currentAd.city,
              price: currentAd.price || "",
              contactPhone: currentAd.contactPhone || "",
              mediaUrls: (currentAd.media || []).map((item) => item.originalUrl || ""),
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (index, value) => {
    const updatedMedia = [...formData.mediaUrls];
    updatedMedia[index] = value;
    setFormData({ ...formData, mediaUrls: updatedMedia });
  };

  const addMediaField = () => {
    setFormData({ ...formData, mediaUrls: [...formData.mediaUrls, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await api.patch(`/client/ads/${id}`, formData);
        toast.success("Ad updated successfully");
      } else {
        const res = await api.post("/client/ads", formData);
        toast.success("Ad created successfully");
        navigate(`/client/package/${res.data.data._id}`);
        return;
      }

      navigate("/client/my-ads");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-2">{isEditing ? "Edit Draft" : "Create New Ad"}</h1>
      <p className="text-gray-700 mb-6">Start with a draft, then select a package and add payment proof to move the ad through moderation and publishing.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Ad Title" className="w-full border p-3 rounded" value={formData.title} onChange={handleChange} />
        <textarea name="description" placeholder="Description" className="w-full border p-3 rounded h-40" value={formData.description} onChange={handleChange} />

        <select name="category" className="w-full border p-3 rounded" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select name="city" className="w-full border p-3 rounded" value={formData.city} onChange={handleChange}>
          <option value="">Select City</option>
          {cities.map((city) => (
            <option key={city._id} value={city._id}>{city.name}</option>
          ))}
        </select>

        <input type="number" name="price" placeholder="Price" className="w-full border p-3 rounded" value={formData.price} onChange={handleChange} />
        <input type="text" name="contactPhone" placeholder="Phone Number" className="w-full border p-3 rounded" value={formData.contactPhone} onChange={handleChange} />

        <div>
          <h2 className="font-bold mb-2">Media URLs</h2>
          {formData.mediaUrls.map((url, index) => (
            <input
              key={index}
              type="text"
              placeholder="Paste a public image or YouTube URL"
              className="w-full border p-3 rounded mb-2"
              value={url}
              onChange={(e) => handleMediaChange(index, e.target.value)}
            />
          ))}
          <button type="button" onClick={addMediaField} className="bg-gray-300 px-4 py-2 rounded">Add More Media</button>
        </div>

        <button className="bg-black text-white px-6 py-3 rounded">{isEditing ? "Save Changes" : "Create and Continue"}</button>
      </form>
    </div>
  );
};

export default CreateAdPage;