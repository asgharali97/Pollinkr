import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  return (
    <header className="relative z-50 px-4 py-2 max-[480px]:px-2">
      <div className="mx-auto flex max-w-xl sm:max-w-3xl md:max-w-4xl  items-center justify-between rounded-2xl py-2 pl-6 pr-2 shadow-m ring-1 ring-black/5">
        <span className="text-base font-semibold tracking-tight max-[480px]:text-sm">Pollinkr</span>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground min-[901px]:flex">
          <a href="#how" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#how" className="transition-colors hover:text-foreground">Features</a>
          <a href="#cta" className="transition-colors hover:text-foreground">Pricing</a>
        </nav>
        <div className="flex items-center gap-3 max-[900px]:gap-2">
          <Link
            to="/login"
            className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm text-white shadow-l transition-colors hover:bg-primary/90 max-[900px]:px-3 max-[900px]:py-1.5 max-[900px]:text-xs max-[480px]:px-2.5"
          >
            Sign up
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="hidden size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-black/5 max-[900px]:inline-flex max-[480px]:size-8"
          >
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/70 px-6 backdrop-blur-md min-[901px]:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <nav
            id="mobile-navigation"
            aria-label="Main navigation"
            className="flex flex-col items-center gap-8 text-center text-xl font-medium"
            onClick={(event) => event.stopPropagation()}
          >
            <a href="#how" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-muted-foreground">How it works</a>
            <a href="#how" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-muted-foreground">Features</a>
            <a href="#cta" onClick={() => setMenuOpen(false)} className="transition-colors hover:text-muted-foreground">Pricing</a>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar
