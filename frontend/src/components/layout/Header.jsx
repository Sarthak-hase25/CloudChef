import { useState, useRef, useEffect } from "react";
import { Menu, Bell, Search, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick, sidebarOpen }) {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const searchRef = useRef(null);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setSearchVal("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const avatar = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header
      className="
        h-[60px] flex items-center gap-2 sm:gap-4
        px-3 sm:px-5
        border-b border-white/[0.06]
        bg-surface-800/80 backdrop-blur-md
        shrink-0 z-30
      "
      role="banner"
    >
      {/* Hamburger */}
      <button
        onClick={onMenuClick}
        className="btn-icon flex-shrink-0"
        aria-label={sidebarOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={sidebarOpen}
        aria-controls="main-navigation"
      >
        <Menu size={20} aria-hidden="true" />
      </button>

      {/* Search bar — hidden on xs, visible on sm+ */}
      <div className="flex-1 max-w-sm hidden sm:block">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search orders, menu, inventory..."
            className="input-sm pl-9 w-full"
            aria-label="Search"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile search icon */}
      <button
        className="btn-icon sm:hidden flex-shrink-0"
        onClick={() => setSearchOpen((v) => !v)}
        aria-label="Toggle search"
        aria-expanded={searchOpen}
      >
        {searchOpen ? <X size={18} /> : <Search size={18} />}
      </button>

      {/* Mobile search expand */}
      {searchOpen && (
        <div className="absolute top-[60px] left-0 right-0 z-50 px-4 py-3 bg-surface-800/95 backdrop-blur-md border-b border-white/[0.06] sm:hidden">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              aria-hidden="true"
            />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search..."
              className="input pl-9 w-full"
              aria-label="Search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Right side */}
      <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-shrink-0">
        {/* Notifications */}
        <button
          className="btn-icon relative"
          aria-label="Notifications (3 unread)"
        >
          <Bell size={18} aria-hidden="true" />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface-800"
            aria-hidden="true"
          />
        </button>

        {/* User avatar */}
        <button
          className="
            w-9 h-9 rounded-xl
            bg-brand-500/20 border border-brand-500/30
            flex items-center justify-center
            text-brand-400 font-bold text-sm
            hover:bg-brand-500/30 transition-colors
            flex-shrink-0
          "
          aria-label={`User menu for ${user?.name || "User"}`}
          aria-haspopup="menu"
        >
          {avatar}
        </button>
      </div>
    </header>
  );
}
