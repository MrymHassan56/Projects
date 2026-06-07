import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdCard from "../../components/AdCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const HomePage = () => {
  const [featuredAds, setFeaturedAds] = useState([]);
  const [packages, setPackages] = useState([]);
  const [question, setQuestion] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adsRes, packagesRes, questionRes, categoriesRes] = await Promise.all([
          api.get("/ads"),
          api.get("/packages"),
          api.get("/questions/random"),
          api.get("/categories"),
        ]);

        setFeaturedAds((adsRes.data.data.ads || []).slice(0, 6));
        setPackages(packagesRes.data.data);
        setQuestion(questionRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-black to-zinc-800 text-white p-10 rounded-[28px] mb-10 shadow-lg">
            <p className="uppercase tracking-[0.3em] text-sm text-gray-200">Sponsored Listing Marketplace</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">Run a moderated, payment-verified ad campaign with confidence.</h1>
            <p className="text-lg text-gray-100 max-w-3xl leading-8">
              Create drafts, review listings, verify payments, and publish with package-driven visibility, automation, and external media normalization.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/ads" className="bg-white text-black px-5 py-3 rounded-lg font-semibold">Explore Ads</Link>
              <Link to="/packages" className="border border-white px-5 py-3 rounded-lg font-semibold">View Packages</Link>
              <Link to="/contact" className="border border-white px-5 py-3 rounded-lg font-semibold">Contact Support</Link>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { title: "Workflow ready", body: "Drafts, moderation, payment verification, and scheduling are all covered." },
              { title: "External media", body: "Public URLs are normalized safely for previews and thumbnails." },
              { title: "Automation", body: "Scheduled publishing, expiry handling, and heartbeat logging are built in." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                <h2 className="font-bold text-lg">{item.title}</h2>
                <p className="mt-2 text-gray-700 leading-7">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
              <h2 className="text-2xl font-bold mb-3">Browse by category</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link key={category._id} to={`/categories/${category.slug}`} className="bg-black text-white px-4 py-2 rounded-lg">
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
              <h2 className="text-2xl font-bold mb-3">Learning question</h2>
              {question ? (
                <>
                  <p className="text-gray-700 leading-7">{question.question}</p>
                  <p className="mt-3 font-semibold">Answer: {question.answer}</p>
                </>
              ) : (
                <p className="text-gray-700">Loading learning prompt...</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-3xl font-bold">Featured Ads</h2>
              <Link to="/ads" className="text-blue-600 font-semibold">View all</Link>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : featuredAds.length ? (
              <div className="grid md:grid-cols-3 gap-6">
                {featuredAds.map((ad) => (
                  <AdCard key={ad._id} ad={ad} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow">No featured ads are available right now.</div>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-end mb-4">
              <h2 className="text-3xl font-bold">Packages</h2>
              <Link to="/packages" className="text-blue-600 font-semibold">See all packages</Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div key={pkg._id} className="bg-white rounded-2xl p-6 shadow border border-gray-100">
                  <p className="text-sm uppercase text-gray-500">{pkg.name}</p>
                  <h3 className="text-2xl font-bold mt-2">{pkg.label}</h3>
                  <p className="text-3xl font-bold my-4">PKR {pkg.price}</p>
                  <p className="text-gray-700">{pkg.durationDays} days · weight {pkg.weight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HomePage;