import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname === "/admin";

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 group"
              data-ocid="nav-logo"
            >
              <div className="flex items-center justify-center">
                <img
                  src="/assets/images/logo.png"
                  alt="CodeBlooded logo"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">
                CODEX_LETHALIS
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-6"
              data-ocid="nav-desktop"
            >
              <NavLink to="/" label="Home" />
              <NavLink to="/join" label="Join Now" highlight />
              <Link
                to="/admin"
                className={`text-xs transition-colors duration-200 ml-2 ${isAdmin ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                data-ocid="nav-admin-link"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              type="button"
              aria-label="Toggle menu"
              data-ocid="nav-mobile-toggle"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div
            className="md:hidden border-t border-border bg-card px-4 py-3 flex flex-col gap-2"
            data-ocid="nav-mobile"
          >
            <MobileNavLink
              to="/"
              label="Home"
              onClick={() => setMenuOpen(false)}
            />
            <MobileNavLink
              to="/join"
              label="Join Now"
              onClick={() => setMenuOpen(false)}
            />
            <Link
              to="/admin"
              className="text-sm text-muted-foreground hover:text-foreground py-2 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-border py-8"
        data-ocid="footer"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/assets/images/logo.png"
              alt="CodeBlooded logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-display font-semibold text-sm">
              CODEX_LETHALIS
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({
  to,
  label,
  highlight,
  active,
}: {
  to: string;
  label: string;
  highlight?: boolean;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        highlight
          ? "btn-primary text-sm px-4 py-2"
          : `text-sm font-medium transition-colors duration-200 ${
              active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`
      }
      data-ocid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({
  to,
  label,
  onClick,
}: {
  to: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      className="text-sm font-medium py-2 text-foreground hover:text-primary transition-colors"
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
