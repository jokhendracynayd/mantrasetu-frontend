import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X } from "lucide-react";
import type { RootState } from "@/store/store";
import Logo from "@/components/Common/Logo";
import SearchBar from "./SearchBar";
import LanguageSelector from "./LanguageSelector";
import ServicesDropdown from "./ServicesDropdown";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import logoImage from "../../../assets/image2.png";



interface HeaderProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export default function Header({ isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const userRole = (user?.role || "USER") as "USER" | "PANDIT" | "ADMIN" | "SUPER_ADMIN";
  const isPandit = userRole === "PANDIT";
  const isAdmin = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        {/* Desktop & Mobile Header */}
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
            <img src={logoImage} alt="MantraSetu Logo" className="h-16 w-auto md:scale-[1.3]" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>

            <Link
              to="/services"
              className="font-medium text-foreground hover:text-primary transition-colors relative group"
            >
              Services
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
            </Link>
            {/* <ServicesDropdown userRole={userRole} /> */}

            {isAuthenticated && (
              <>
                <Link
                  to="/bookings"
                  className="font-medium text-foreground hover:text-primary transition-colors relative group"
                >
                  My Bookings
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>

                {/* Pandit-specific Navigation */}
                {isPandit && (
                  <>
                    <Link
                      to="/pandit/dashboard"
                      className="font-medium text-foreground hover:text-primary transition-colors relative group"
                    >
                      Dashboard
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                    <Link
                      to="/pandit/bookings"
                      className="font-medium text-foreground hover:text-primary transition-colors relative group"
                    >
                      Manage Bookings
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                    <Link
                      to="/pandit/earnings"
                      className="font-medium text-foreground hover:text-primary transition-colors relative group"
                    >
                      Earnings
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                  </>
                )}

                {/* Admin-specific Navigation */}
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="font-medium text-foreground hover:text-primary transition-colors relative group"
                    >
                      Admin Dashboard
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                    <Link
                      to="/admin/users"
                      className="font-medium text-foreground hover:text-primary transition-colors relative group"
                    >
                      Users
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                    <Link
                      to="/admin/pandits"
                      className="font-medium text-foreground hover:text-primary transition-colors relative group"
                    >
                      Pandits
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                    <Link
                      to="/admin/analytics"
                      className="font-medium text-foreground hover:text-primary transition-colors relative group"
                    >
                      Analytics
                      <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                    </Link>
                  </>
                )}

                <Link
                  to="/contact"
                  className="font-medium text-foreground hover:text-primary transition-colors relative group"
                >
                  Contact
                  <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              </>
            )}

            {!isAuthenticated && (
              <Link
                to="/contact"
                className="font-medium text-foreground hover:text-primary transition-colors relative group"
              >
                Contact
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <LanguageSelector />
            <UserMenu isAuthenticated={isAuthenticated} userRole={userRole} />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMenuOpen}
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        onClose={() => setIsMenuOpen(false)}
      />
    </header>
  );
}

