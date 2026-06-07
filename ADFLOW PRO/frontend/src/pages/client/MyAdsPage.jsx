import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const MyAdsPage = () => {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await api.get("/client/dashboard");
      setAds(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitForReview = async (id) => {
    try {
      await api.patch(`/client/ads/${id}/submit`);
      toast.success("Ad submitted successfully");
      fetchAds();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const deleteAd = async (id) => {
    try {
      await api.delete(`/client/ads/${id}`);
      toast.success("Ad deleted successfully");
      fetchAds();
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const actionLabel = (ad) => {
    if (ad.status === "draft") return "Submit for Review";
    if (ad.status === "moderator_approved") return "Choose Package";
    if (ad.status === "payment_pending") return "Submit Payment";
    if (ad.status === "payment_submitted") return "Awaiting Admin Verification";
    if (ad.status === "payment_verified") return "Ready to Publish";
    return "View Status";
  };

  const actionPath = (ad) => {
    if (ad.status === "draft") return null;
    if (ad.status === "moderator_approved") return `/client/package/${ad._id}`;
    if (ad.status === "payment_pending") return `/client/payment/${ad._id}`;
    return `/client/my-ads`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-2">My Ads</h1>
      <p className="text-gray-700 mb-6">Track each listing through draft, review, payment, and publishing stages.</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black text-white">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Package</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id} className="border-b">
                <td className="p-3">{ad.title}</td>
                <td className="p-3">{ad.status.replace(/_/g, " ")}</td>
                <td className="p-3">{ad.package?.label || "Not selected"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {ad.status === "draft" ? (
                      <>
                        <button onClick={() => submitForReview(ad._id)} className="bg-blue-600 text-white px-4 py-2 rounded">
                          Submit
                        </button>
                        <Link to={`/client/edit-ad/${ad._id}`} className="bg-yellow-500 text-black px-4 py-2 rounded">
                          Edit
                        </Link>
                        <button onClick={() => deleteAd(ad._id)} className="bg-red-600 text-white px-4 py-2 rounded">
                          Delete
                        </button>
                      </>
                    ) : (
                      <Link to={actionPath(ad)} className="bg-gray-800 text-white px-4 py-2 rounded">
                        {actionLabel(ad)}
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAdsPage;