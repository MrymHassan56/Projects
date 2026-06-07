import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await api.get("/packages");
        setPackages(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <p className="uppercase tracking-[0.3em] text-sm text-gray-600">Packages</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3">Choose the package that fits your listing</h1>
            <p className="mt-4 text-gray-700 max-w-3xl mx-auto text-lg leading-8">
              Every campaign uses a package-based visibility model, helping sellers choose between discovery, boosted ranking, and homepage exposure.
            </p>

            <div className="mt-8 flex justify-center gap-3 flex-wrap">
              <Link to="/contact" className="bg-black text-white px-5 py-3 rounded-lg font-semibold">
                Talk to Support
              </Link>
              <Link to="/ads" className="border border-gray-300 px-5 py-3 rounded-lg font-semibold text-gray-800">
                Browse Ads
              </Link>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
            <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
              <h2 className="text-2xl font-bold">Why packages matter</h2>
              <p className="mt-3 text-gray-700 leading-7">
                Packages control the visibility and ranking strength of your listing. Premium options unlock featured placement and homepage exposure, while entry packages are ideal for faster discovery.
              </p>
              <div className="mt-6 space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Improve ranking and campaign visibility</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Showcase premium listings to more buyers</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>Keep your ad lifecycle aligned with payment and moderation</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`rounded-2xl p-6 border shadow ${pkg.isFeatured ? "bg-black text-white border-black" : "bg-white border-gray-100"}`}
                >
                  <p className={`text-sm uppercase ${pkg.isFeatured ? "text-gray-200" : "text-gray-500"}`}>{pkg.name}</p>
                  <h2 className="text-2xl font-bold mt-3">{pkg.label}</h2>
                  <p className="text-4xl font-bold my-4">PKR {pkg.price}</p>
                  <ul className={`space-y-2 text-sm ${pkg.isFeatured ? "text-gray-100" : "text-gray-700"}`}>
                    <li>Duration: {pkg.durationDays} days</li>
                    <li>Featured placement: {pkg.isFeatured ? "Yes" : "No"}</li>
                    <li>Homepage visibility: {pkg.homepageVisibility ? "Yes" : "No"}</li>
                    <li>Weight: {pkg.weight}</li>
                  </ul>
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

export default PackagesPage;
