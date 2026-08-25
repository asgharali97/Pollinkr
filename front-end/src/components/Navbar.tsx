import { Link } from 'react-router-dom'

const Navbar = () => {

  return (
    <header
      className="py-2"
    >
      <div className="rounded-2xl shadow-m shadow-black/5 ring-1 ring-black/5 max-w-4xl mx-auto pl-6 pr-2 py-2 flex items-center justify-between">
        <span className="text-base font-semibold tracking-tight">Pollinkr</span>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#how" className="hover:text-foreground transition-colors">Features</a>
          <a href="#cta" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <button className='bg-primary shadow-l text-white py-2 px-4 rounded-lg cursor-pointer hover:bg-primary/90'>Sign up</button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar
