import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import api from "../../services/api";

const PaymentsPage = () => {
  const navigate = useNavigate();
  const [payments, setPayments] =
    useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments =
    async () => {
      try {
        const res = await api.get(
          "/admin/payment-queue"
        );

        setPayments(
          res.data.data
        );
      } catch (error) {
        console.log(error);
      }
    };

  const verifyPayment =
    async (id, action, adId) => {
      try {
        await api.patch(
          `/admin/payments/${id}/verify`,
          {
            action,
          }
        );

        toast.success(
          `Payment ${action}d`
        );

        if (action === "verify" && adId) {
          navigate(`/admin/publish/${adId}`);
          return;
        }

        fetchPayments();
      } catch (error) {
        toast.error(
          error.response?.data?.message
        );
      }
    };

  return (
    <div className="bg-white p-6 rounded-lg shadow">

      <h1 className="text-3xl font-bold mb-6">

        Payment Queue

      </h1>

      <table className="w-full">

        <thead>

          <tr className="bg-black text-white">

            <th className="p-3">
              Ad
            </th>

            <th className="p-3">
              User
            </th>

            <th className="p-3">
              Amount
            </th>

            <th className="p-3">
              Method
            </th>

            <th className="p-3">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {payments.map(
            (payment) => (
              <tr
                key={payment._id}
                className="border-b"
              >

                <td className="p-3">

                  {
                    payment.ad
                      ?.title
                  }

                </td>

                <td className="p-3">

                  {
                    payment.user
                      ?.fullName
                  }

                </td>

                <td className="p-3">

                  PKR {
                    payment.amount
                  }

                </td>

                <td className="p-3">

                  {
                    payment.method
                  }

                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() =>
                      verifyPayment(
                        payment._id,
                        "verify",
                        payment.ad?._id
                      )
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Verify
                  </button>

                  <button
                    onClick={() =>
                      verifyPayment(
                        payment._id,
                        "reject"
                      )
                    }
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>

                  <Link
                    to={`/admin/publish/${payment.ad?._id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Publish
                  </Link>

                </td>

              </tr>
            )
          )}

        </tbody>

      </table>
    </div>
  );
};

export default PaymentsPage;