import React, { useEffect, useState } from 'react';

const navItems = [
  { label: 'Products', href: '#products' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Why CEIS AI', href: '#why' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-transparent backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2" onClick={closeMenu}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-white">
              ⚙
            </div>
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
              CEIS AI
            </span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Sign In
            </button>
            <a
              href="#products"
              className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-105 hover:from-cyan-600 hover:to-blue-700"
              onClick={closeMenu}
            >
              Get Started
            </a>
          </div>

          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="text-slate-300 hover:text-white md:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="space-y-2 border-t border-white/5 pb-4 pt-4 md:hidden" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block py-2 text-sm font-medium text-slate-300 transition-colors hover:text-cyan-400"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 border-t border-white/5 pt-4">
              <button
                type="button"
                className="flex-1 rounded-lg border border-slate-600 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
              >
                Sign In
              </button>
              <a
                href="#products"
                className="flex-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-2 text-center text-sm font-medium text-white"
                onClick={closeMenu}
              >
                Get Started
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
