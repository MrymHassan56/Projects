import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const faqs = [
  {
    question: "How do I publish an ad?",
    answer: "Create a draft, submit it for review, select a package, upload payment proof, and wait for admin verification.",
  },
  {
    question: "Can I use external media?",
    answer: "Yes. AdFlow Pro accepts public image URLs, GitHub raw links, and YouTube URLs with automatic thumbnail generation.",
  },
  {
    question: "When do ads expire?",
    answer: "Ads expire automatically based on the selected package duration and are hidden from public search once the expiry is reached.",
  },
  {
    question: "Who approves listings?",
    answer: "A moderator reviews the listing first, then an admin verifies payment and publishes the ad.",
  },
  {
    question: "Can I edit a draft after creating it?",
    answer: "Yes. Draft ads can be updated and deleted from your client dashboard before they are submitted for review.",
  },
  {
    question: "How are notifications handled?",
    answer: "You receive in-app notifications for moderation decisions, payment verification, and ad expiry reminders.",
  },
];

const supportTopics = [
  "How to submit and publish an ad",
  "Editing, deleting, and managing drafts",
  "Package and payment status",
  "Notification and expiry reminders",
];

const FAQPage = () => (
  <>
    <Navbar />
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
          <div>
            <p className="uppercase tracking-[0.3em] text-sm text-gray-600">FAQ</p>
            <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-4">Frequently asked questions</h1>
            <p className="text-gray-700 text-lg leading-8">
              Find quick answers about creating ads, package selection, moderation, and managing listings through the full AdFlow Pro workflow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="bg-black text-white px-5 py-3 rounded-lg font-semibold"
              >
                Contact Support
              </Link>
              <Link
                to="/packages"
                className="border border-gray-300 px-5 py-3 rounded-lg font-semibold text-gray-800"
              >
                View Packages
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-xl font-bold">Helpful topics</h2>
            <ul className="mt-4 space-y-3 text-gray-700">
              {supportTopics.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((item) => (
            <div key={item.question} className="bg-white rounded-2xl p-6 shadow border border-gray-100">
              <h2 className="text-lg font-bold">{item.question}</h2>
              <p className="mt-3 text-gray-700 leading-7">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </>
);

export default FAQPage;
