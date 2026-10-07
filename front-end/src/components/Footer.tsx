import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="px-6 border-t border-border border-dashed py-8">
      <div className="max-w-xl sm:max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground text-sm">Pollinkr</span>
        <span>Built for feedback that means something.</span>
        <div className="flex gap-5">
          <Link to="/login" className="hover:text-foreground transition-colors">
            Sign in
          </Link>
          <Link
            to="/Signup"
            className="hover:text-foreground transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
