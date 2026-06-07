import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/LoadingSpinner";

const placeholder = "https://via.placeholder.com/800x500?text=Preview+Unavailable";

const AdDetailsPage = () => {
  const { slug } = useParams();
  const [ad, setAd] = useState(null);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await api.get(`/ads/${slug}`);
        setAd(res.data.data.ad);
        setMedia(res.data.data.media);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <img
            src={media[0]?.thumbnailUrl || placeholder}
            alt={ad.title}
            className="w-full h-[420px] object-cover rounded mb-6"
          />

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-black text-white px-3 py-1 rounded text-sm">{ad.package?.label || "Package pending"}</span>
            {ad.isFeatured && <span className="bg-yellow-400 text-black px-3 py-1 rounded text-sm">Featured</span>}
          </div>

          <h1 className="text-4xl font-bold mb-3">{ad.title}</h1>
          <p className="text-2xl font-bold mb-4">PKR {ad.price}</p>
          <p className="mb-6 text-gray-700">{ad.description}</p>

          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
            <p><strong>Category:</strong> {ad.category?.name}</p>
            <p><strong>City:</strong> {ad.city?.name}</p>
            <p><strong>Seller:</strong> {ad.user?.fullName}</p>
            <p><strong>Contact:</strong> {ad.contactPhone}</p>
            <p><strong>Expiry:</strong> {ad.expireAt ? new Date(ad.expireAt).toLocaleString() : "Scheduled"}</p>
            <p><strong>Package:</strong> {ad.package?.label || "Not selected"}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => alert("Report submitted for moderation review.")} className="bg-red-600 text-white px-4 py-2 rounded">
              Report Ad
            </button>
            <a href="/ads" className="bg-gray-200 px-4 py-2 rounded">Back to Explore</a>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold mb-3">Media previews</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {media.length ? media.map((item) => (
                <img key={item._id} src={item.thumbnailUrl || placeholder} alt={item.originalUrl} className="w-full h-40 object-cover rounded border" />
              )) : <img src={placeholder} alt="Preview unavailable" className="w-full h-40 object-cover rounded border" />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdDetailsPage;