import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const termsSections = [
  {
    title: "Account and listing responsibilities",
    content:
      "Users must provide accurate listing information, valid contact details, and lawful payment references. Misleading content, fraud, or suspicious media may result in rejection or suspension.",
  },
  {
    title: "Review and publishing",
    content:
      "All ads are reviewed before publication. Moderators evaluate content quality and compliance, while admins verify payment and publish approved listings.",
  },
  {
    title: "Packages and visibility",
    content:
      "Packages determine visibility, duration, and featured placement. Expired ads are hidden automatically once their active period ends.",
  },
  {
    title: "Platform rights",
    content:
      "AdFlow Pro reserves the right to suspend accounts that abuse the platform, submit fraudulent payment information, or violate marketplace policies.",
  },
];

const TermsPage = () => (
  <>
    <Navbar />
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="uppercase tracking-[0.3em] text-sm text-gray-600">Terms</p>
        <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Terms of Service</h1>
        <p className="text-gray-700 text-lg leading-8 max-w-3xl">
          These terms define how sellers, moderators, and admins interact with AdFlow Pro and how listings move through the marketplace workflow.
        </p>

        <div className="mt-10 space-y-4">
          {termsSections.map((section) => (
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

export default TermsPage;
