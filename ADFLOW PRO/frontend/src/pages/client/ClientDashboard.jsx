import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [ads, setAds] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [adsRes, notificationsRes] = await Promise.all([
          api.get("/client/dashboard"),
          api.get("/notifications"),
        ]);

        setAds(adsRes.data.data);
        setNotifications(notificationsRes.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDashboard();
  }, []);

  const markNotificationRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications((current) => current.map((item) => (item._id === id ? { ...item, isRead: true } : item)));
    } catch (error) {
      console.log(error);
    }
  };

  const totalAds = ads.length;
  const publishedAds = ads.filter((ad) => ad.status === "published").length;
  const pendingAds = ads.filter((ad) => ["draft", "submitted", "payment_pending", "payment_submitted"].includes(ad.status)).length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold">Welcome, {user?.fullName}</h1>
          <p className="text-gray-700 mt-2">Review your active listings, package selections, and payment progress.</p>
        </div>

        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Total Ads</h2>
          <p className="text-4xl mt-3">{totalAds}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Published Ads</h2>
          <p className="text-4xl mt-3">{publishedAds}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Pending Ads</h2>
          <p className="text-4xl mt-3">{pendingAds}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Workflow shortcuts</h2>
            <Link to="/client/create-ad" className="bg-black text-white px-4 py-2 rounded">Create New Ad</Link>
          </div>
          <ul className="space-y-3 text-gray-700">
            <li>1. Draft the ad and add normalized media URLs.</li>
            <li>2. Submit for moderator review.</li>
            <li>3. Select a package and submit payment proof.</li>
            <li>4. Admin verifies payment and publishes the listing.</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <span className="text-sm text-gray-500">{notifications.filter((item) => !item.isRead).length} unread</span>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((item) => (
              <div key={item._id} className={`border rounded p-3 ${item.isRead ? "bg-gray-50" : "bg-blue-50"}`}>
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-700">{item.message}</p>
                  </div>
                  {!item.isRead && (
                    <button onClick={() => markNotificationRead(item._id)} className="bg-black text-white px-3 py-1 rounded text-sm">
                      Mark read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;