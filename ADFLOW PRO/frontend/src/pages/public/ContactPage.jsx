import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const contactMethods = [
  {
    title: "Email Support",
    detail: "araj426@adflowpro.com",
    icon: "✉️",
    description: "For onboarding help, payment questions, and moderation updates.",
  },
  {
    title: "Phone Support",
    detail: "+92 306 111 0000",
    icon: "📞",
    description: "Reach a live team member during business hours for urgent issues.",
  },
  {
    title: "Business Hours",
    detail: "Mon–Fri · 9:00 AM to 6:00 PM",
    icon: "🕒",
    description: "Weekend requests receive a response within 24 hours.",
  },
];

const helpTopics = [
  "Payment verification and invoice follow-up",
  "Package selection or ad promotion questions",
  "Moderation status and review timelines",
  "Marketplace policy or account concerns",
];

const ContactPage = () => (
  <>
    <Navbar />
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-600">Contact</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Need help with AdFlow Pro?</h1>
            <p className="text-gray-700 text-lg leading-8">
              Our support team helps clients manage listings, understand moderation status, and resolve payment or publishing issues quickly.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="mailto:araj426@adflowpro.com"
                className="bg-black text-white px-5 py-3 rounded-lg font-semibold"
              >
                Email Support
              </a>
              <Link
                to="/faq"
                className="border border-gray-300 px-5 py-3 rounded-lg font-semibold text-gray-800"
              >
                Read FAQ
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold">How we can help</h2>
            <ul className="mt-4 space-y-3 text-gray-700">
              {helpTopics.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {contactMethods.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow border border-gray-100">
              <div className="text-3xl">{item.icon}</div>
              <h2 className="font-bold text-lg mt-4">{item.title}</h2>
              <p className="mt-3 font-semibold text-gray-900">{item.detail}</p>
              <p className="mt-2 text-gray-700 text-sm leading-6">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mt-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold">Support promise</h2>
            <p className="mt-3 text-gray-700 leading-7">
              AdFlow Pro is designed to keep sellers informed at every stage of the ad lifecycle. If you need clarification on status changes, document requirements, or next steps, our support team is ready to help.
            </p>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default ContactPage;
