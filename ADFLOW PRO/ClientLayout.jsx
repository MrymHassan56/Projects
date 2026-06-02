import {
  Link,
  Outlet,
} from "react-router-dom";

import Navbar from "../components/Navbar";

const ClientLayout = () => {
  return (
    <>
      <Navbar />

      <div className="flex min-h-screen">

        <aside className="w-64 bg-black text-white p-5">

          <h2 className="text-2xl font-bold mb-6">

            Client Panel

          </h2>

          <div className="flex flex-col gap-4">

            <Link to="/client/dashboard">
              Dashboard
            </Link>

            <Link to="/client/create-ad">
              Create Ad
            </Link>

            <Link to="/client/my-ads">
              My Ads
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

export default ClientLayout;