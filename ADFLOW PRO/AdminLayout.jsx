import {
  Link,
  Outlet,
} from "react-router-dom";

import Navbar from "../components/Navbar";

const AdminLayout = () => {
  return (
    <>
      <Navbar />

      <div className="flex min-h-screen">

        <aside className="w-64 bg-black text-white p-5">

          <h2 className="text-2xl font-bold mb-6">

            Admin Panel

          </h2>

          <div className="flex flex-col gap-4">

            <Link to="/admin/dashboard">
              Dashboard
            </Link>

            <Link to="/admin/payments">
              Payments
            </Link>

          </div>

        </aside>

        <main className="flex-1 p-6 bg-gray-100">

          <Outlet />

        </main>
      </div>
    </>
  );
};

export default AdminLayout;