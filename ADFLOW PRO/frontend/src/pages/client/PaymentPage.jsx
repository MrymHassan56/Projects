import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    method: "easypaisa",
    transactionRef: "",
    senderName: "",
    screenshotUrl: "",
  });

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get("/client/dashboard");
        const currentAd = res.data.data.find((item) => item._id === id);
        setAd(currentAd);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAd();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/client/payments", { ...formData, adId: id });
      toast.success("Payment submitted");
      navigate("/client/my-ads");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-2">Submit Payment</h1>
      <p className="text-gray-700 mb-6">Provide transaction details for <span className="font-semibold">{ad?.title || "your ad"}</span>.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="number" name="amount" placeholder="Amount" className="w-full border p-3 rounded" value={formData.amount} onChange={handleChange} />
        <select name="method" className="w-full border p-3 rounded" value={formData.method} onChange={handleChange}>
          <option value="easypaisa">Easypaisa</option>
          <option value="jazzcash">JazzCash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="other">Other</option>
        </select>
        <input type="text" name="transactionRef" placeholder="Transaction Reference" className="w-full border p-3 rounded" value={formData.transactionRef} onChange={handleChange} />
        <input type="text" name="senderName" placeholder="Sender Name" className="w-full border p-3 rounded" value={formData.senderName} onChange={handleChange} />
        <input type="text" name="screenshotUrl" placeholder="Screenshot URL" className="w-full border p-3 rounded" value={formData.screenshotUrl} onChange={handleChange} />

        <button className="bg-black text-white px-6 py-3 rounded">Submit Payment</button>
      </form>
    </div>
  );
};

export default PaymentPage;