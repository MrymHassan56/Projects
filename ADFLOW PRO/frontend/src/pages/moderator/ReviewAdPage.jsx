import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

import LoadingSpinner from "../../components/LoadingSpinner";

const ReviewAdPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [ad, setAd] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [note, setNote] =
    useState("");

  useEffect(() => {
    fetchAd();
  }, []);

  const fetchAd = async () => {
    try {
      const res = await api.get(
        `/moderator/ads/${id}`
      );

      setAd(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReview =
    async (action) => {
      try {
        await api.patch(
          `/moderator/ads/${id}/review`,
          {
            action,
            note,
          }
        );

        toast.success(
          `Ad ${action}d successfully`
        );

        navigate(
          "/moderator/dashboard"
        );
      } catch (error) {
        toast.error(
          error.response?.data?.message
        );
      }
    };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h1 className="text-4xl font-bold mb-6">

        Review Ad

      </h1>

      <img
        src={
          ad.media?.[0]
            ?.thumbnailUrl
        }
        alt={ad.title}
        className="w-full h-[400px] object-cover rounded mb-6"
      />

      <div className="space-y-4">

        <div>

          <h2 className="text-2xl font-bold">

            {ad.title}

          </h2>

          <p className="text-xl mt-2">

            PKR {ad.price}
          </p>

        </div>

        <div>

          <h3 className="font-bold text-lg">

            Description

          </h3>

          <p className="text-gray-700 mt-2">

            {ad.description}

          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <div>

            <strong>
              Category:
            </strong>{" "}

            {
              ad.category
                ?.name
            }

          </div>

          <div>

            <strong>
              City:
            </strong>{" "}

            {ad.city?.name}

          </div>

          <div>

            <strong>
              Seller:
            </strong>{" "}

            {
              ad.user
                ?.fullName
            }

          </div>

          <div>

            <strong>
              Contact:
            </strong>{" "}

            {
              ad.contactPhone
            }

          </div>

        </div>

        <div>

          <h3 className="font-bold mb-2">

            Moderation Note

          </h3>

          <textarea
            placeholder="Add moderation note..."
            className="w-full border p-3 rounded h-32"
            value={note}
            onChange={(e) =>
              setNote(
                e.target.value
              )
            }
          />

        </div>

        <div className="flex gap-4 pt-4">

          <button
            onClick={() =>
              handleReview(
                "approve"
              )
            }
            className="bg-green-600 text-white px-6 py-3 rounded"
          >
            Approve
          </button>

          <button
            onClick={() =>
              handleReview(
                "reject"
              )
            }
            className="bg-red-600 text-white px-6 py-3 rounded"
          >
            Reject
          </button>

        </div>

      </div>
    </div>
  );
};

export default ReviewAdPage;