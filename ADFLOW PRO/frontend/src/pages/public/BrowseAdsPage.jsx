import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AdCard from "../../components/AdCard";
import LoadingSpinner from "../../components/LoadingSpinner";

const BrowseAdsPage = () => {
  const [ads, setAds] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    city: "",
    sort: "rank",
    page: 1,
  });

  useEffect(() => {
    const fetchTaxonomy = async () => {
      try {
        const [categoryRes, cityRes] = await Promise.all([api.get("/categories"), api.get("/cities")]);
        setCategories(categoryRes.data.data);
        setCities(cityRes.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTaxonomy();
  }, []);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const res = await api.get("/ads", { params: filters });
        setAds(res.data.data.ads || []);
        setPagination(res.data.data.pagination || { page: 1, pages: 1 });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [filters]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
  };

  const changePage = (direction) => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, prev.page + direction),
    }));
  };

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-[28px] p-6 shadow border border-gray-100 mb-6">
            <div className="flex flex-wrap justify-between gap-4 items-end mb-5">
              <div>
                <p className="uppercase tracking-[0.3em] text-sm text-gray-600">Browse Ads</p>
                <h1 className="text-3xl md:text-4xl font-bold mt-3">Find the right listing faster</h1>
                <p className="text-gray-700 mt-2 max-w-2xl">
                  Search by text, category, city, and ranking preference to surface the most relevant ads instantly.
                </p>
              </div>
              <div className="text-sm text-gray-600">Page {pagination.page} of {pagination.pages}</div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <input
                type="text"
                name="search"
                placeholder="Search ads"
                className="border border-gray-200 p-3 rounded-lg"
                value={filters.search}
                onChange={handleChange}
              />

              <select name="category" value={filters.category} onChange={handleChange} className="border border-gray-200 p-3 rounded-lg">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select name="city" value={filters.city} onChange={handleChange} className="border border-gray-200 p-3 rounded-lg">
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>

              <select name="sort" value={filters.sort} onChange={handleChange} className="border border-gray-200 p-3 rounded-lg">
                <option value="rank">Best Match</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : ads.length ? (
            <>
              <div className="grid md:grid-cols-3 gap-6">
                {ads.map((ad) => (
                  <AdCard key={ad._id} ad={ad} />
                ))}
              </div>

              <div className="flex justify-between mt-8 items-center">
                <button
                  onClick={() => changePage(-1)}
                  disabled={pagination.page <= 1}
                  className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>
                <p className="text-gray-700">Page {pagination.page} of {pagination.pages}</p>
                <button
                  onClick={() => changePage(1)}
                  disabled={pagination.page >= pagination.pages}
                  className="bg-black text-white px-4 py-2 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow border border-gray-100">No active ads match your filters.</div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BrowseAdsPage;