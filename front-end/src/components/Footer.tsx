import { Link } from 'react-router-dom';
const Footer = () => {
    return (
        <footer className="border-t border-border py-8 px-6">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground text-sm">Pollinkr</span>
                <span>Built for feedback that means something.</span>
                <div className="flex gap-5">
                    <Link to="/login" className="hover:text-foreground transition-colors">Sign in</Link>
                    <Link to="/register" className="hover:text-foreground transition-colors">Register</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer
