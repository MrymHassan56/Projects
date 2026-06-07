import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdCard from "../../components/AdCard";

const CategoryPage = () => {
  const { slug } = useParams();
  const [ads, setAds] = useState([]);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/ads?category=${slug}`);
        setAds(res.data.data.ads || []);
        setCategory({ name: slug.replace(/-/g, " ") });
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [slug]);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-[28px] p-6 md:p-8 shadow border border-gray-100 mb-8">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-600">Category</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3">{category?.name || slug}</h1>
            <p className="mt-3 text-gray-700 text-lg leading-8 max-w-3xl">
              Explore active listings in this category and jump back into the broader marketplace anytime.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/ads" className="bg-black text-white px-5 py-3 rounded-lg font-semibold">
                Browse All Ads
              </Link>
              <Link to="/packages" className="border border-gray-300 px-5 py-3 rounded-lg font-semibold text-gray-800">
                View Packages
              </Link>
            </div>
          </div>

          {ads.length ? (
            <div className="grid md:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <AdCard key={ad._id} ad={ad} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">No active ads found for this category.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;