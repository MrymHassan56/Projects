import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";

const COLORS = ["#111827", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics/summary");
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const revenueData = useMemo(() => {
    if (!data?.revenue?.byPackage) return [];

    return data.revenue.byPackage.map((item) => ({
      name: item._id || "Unknown",
      revenue: item.total || 0,
    }));
  }, [data]);

  const categoryData = useMemo(() => {
    if (!data?.breakdown?.byCategory) return [];

    return data.breakdown.byCategory
      .filter((item) => item.name)
      .map((item) => ({ name: item.name, count: item.count }));
  }, [data]);

  const cityData = useMemo(() => {
    if (!data?.breakdown?.byCity) return [];

    return data.breakdown.byCity
      .filter((item) => item.name)
      .map((item) => ({ name: item.name, count: item.count }));
  }, [data]);

  const healthData = useMemo(() => {
    if (!data?.systemHealth) return [];

    return data.systemHealth.map((item) => ({
      source: item.source,
      status: item.status,
      responseMs: item.responseMs,
    }));
  }, [data]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
      <p className="text-gray-700 mb-6">Track listings, payment verification, system health, and marketplace performance.</p>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold">Total Listings</h2>
          <p className="text-4xl mt-3">{data?.listings?.total || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold">Active Ads</h2>
          <p className="text-4xl mt-3">{data?.listings?.active || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold">Revenue</h2>
          <p className="text-4xl mt-3">PKR {data?.revenue?.total || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-bold">Clients</h2>
          <p className="text-4xl mt-3">{data?.users?.totalClients || 0}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Revenue by Package</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Approval vs Rejection</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  dataKey="value"
                  data={[
                    { name: "Approval Rate", value: data?.operations?.approvalRate || 0 },
                    { name: "Rejection Rate", value: data?.operations?.rejectionRate || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {[
                    { name: "Approval Rate", value: data?.operations?.approvalRate || 0 },
                    { name: "Rejection Rate", value: data?.operations?.rejectionRate || 0 },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Ads by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Ads by City</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">System Health</h2>
        <div className="space-y-3">
          {healthData.length ? healthData.map((item) => (
            <div key={`${item.source}-${item.responseMs}`} className="flex justify-between border-b py-2">
              <div>
                <p className="font-semibold">{item.source}</p>
                <p className="text-sm text-gray-600">{item.status}</p>
              </div>
              <p className="text-sm text-gray-700">{item.responseMs} ms</p>
            </div>
          )) : <p className="text-gray-600">No system health logs yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;