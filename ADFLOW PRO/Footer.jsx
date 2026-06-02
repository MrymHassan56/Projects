import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-10 py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between items-center text-sm">
        <p>© 2026 AdFlow Pro</p>
        <div className="flex gap-4">
          <Link to="/terms">Terms</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;