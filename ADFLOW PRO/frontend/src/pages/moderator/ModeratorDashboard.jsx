import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import api from "../../services/api";

import LoadingSpinner from "../../components/LoadingSpinner";

const ModeratorDashboard = () => {
  const [ads, setAds] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get(
        "/moderator/review-queue"
      );

      setAds(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h1 className="text-3xl font-bold mb-6">

        Review Queue

      </h1>

      <div className="overflow-x-auto">

        <table className="w-full border-collapse">

          <thead>

            <tr className="bg-black text-white">

              <th className="p-3">
                Title
              </th>

              <th className="p-3">
                Category
              </th>

              <th className="p-3">
                City
              </th>

              <th className="p-3">
                User
              </th>

              <th className="p-3">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {ads.map((ad) => (
              <tr
                key={ad._id}
                className="border-b"
              >

                <td className="p-3">
                  {ad.title}
                </td>

                <td className="p-3">
                  {
                    ad.category?.name
                  }
                </td>

                <td className="p-3">
                  {ad.city?.name}
                </td>

                <td className="p-3">
                  {
                    ad.user
                      ?.fullName
                  }
                </td>

                <td className="p-3">

                  <Link
                    to={`/moderator/review/${ad._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Review
                  </Link>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ModeratorDashboard;