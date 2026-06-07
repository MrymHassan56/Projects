import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const SelectPackagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesRes, dashboardRes] = await Promise.all([api.get("/packages"), api.get("/client/dashboard")]);
        setPackages(packagesRes.data.data);
        setAd(dashboardRes.data.data.find((item) => item._id === id));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  const selectPackage = async (packageId) => {
    try {
      await api.patch(`/client/ads/${id}/package`, { packageId });
      toast.success("Package selected");
      navigate(`/client/payment/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-4xl font-bold">Select Package</h1>
        <p className="text-gray-700 mt-2">You are selecting a package for <span className="font-semibold">{ad?.title || "your ad"}</span>.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg._id} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-3">{pkg.label}</h2>
            <p className="text-4xl font-bold mb-4">PKR {pkg.price}</p>
            <div className="space-y-2 mb-6 text-gray-700">
              <p>Duration: {pkg.durationDays} days</p>
              <p>Featured: {pkg.isFeatured ? "Yes" : "No"}</p>
              <p>Homepage: {pkg.homepageVisibility ? "Yes" : "No"}</p>
            </div>
            <button onClick={() => selectPackage(pkg._id)} className="bg-black text-white px-6 py-3 rounded w-full">
              Select
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectPackagePage;