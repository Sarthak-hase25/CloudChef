import { useState, useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ErrorBoundary } from "../ui/ErrorBoundary";
import { useRealtime } from "../../hooks/useRealtime";

const MOBILE_BREAKPOINT = 768;

export default function Layout() {
  // Initialize global real-time SSE connection
  useRealtime();

  // Start open on desktop, closed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= MOBILE_BREAKPOINT
  );

  // Auto open/close based on resize
  useEffect(() => {
    let rafId;
    const handleResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (window.innerWidth >= MOBILE_BREAKPOINT) {
          setSidebarOpen(true);
        } else {
          setSidebarOpen(false);
        }
      });
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const openSidebar  = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  return (
    <div className="flex h-dvh overflow-hidden bg-surface-900">
      {/* Sidebar — handles its own backdrop */}
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <Header onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />

        {/* Page content with error boundary per page */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto overflow-x-hidden stable-scrollbar"
          tabIndex={-1}
          aria-label="Main content"
        >
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
