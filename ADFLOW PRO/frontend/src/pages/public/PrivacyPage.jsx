import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const privacySections = [
  {
    title: "Information we collect",
    content:
      "AdFlow Pro stores account details, listing information, payment references, and moderation history so the marketplace can operate safely and transparently.",
  },
  {
    title: "How we use data",
    content:
      "Payment screenshots and transaction references are used only for verification and audit purposes. Public ad pages share listing information and seller contact details needed for discovery.",
  },
  {
    title: "Data protection",
    content:
      "Access to sensitive data is restricted to authorized team members. We apply role-based controls to keep payment verification and moderation records protected.",
  },
  {
    title: "Your choices",
    content:
      "Users may request updates to their profile or account data and can contact support for deletion requests or additional privacy questions.",
  },
];

const PrivacyPage = () => (
  <>
    <Navbar />
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="uppercase tracking-[0.3em] text-sm text-gray-600">Privacy</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Privacy Policy</h1>
        <p className="text-gray-700 text-lg leading-8 max-w-3xl">
          AdFlow Pro is built to protect user data while keeping the marketplace functional for sellers, moderators, and admins.
        </p>

        <div className="mt-10 space-y-4">
          {privacySections.map((section) => (
            <div key={section.title} className="bg-white rounded-2xl p-6 shadow border border-gray-100">
              <h2 className="text-xl font-bold">{section.title}</h2>
              <p className="mt-3 text-gray-700 leading-7">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default PrivacyPage;
