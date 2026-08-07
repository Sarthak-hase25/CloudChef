import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { PAGE_TITLES, formatTitle } from "../../design-system/tokens";

/**
 * PageTitle — sets the document <title> dynamically per route.
 * Place this once inside BrowserRouter.
 *
 * Examples:
 *   /dashboard  → "Dashboard • CloudKitchen AI"
 *   /inventory  → "Inventory • CloudKitchen AI"
 *   /ai/demand  → "Demand Forecast • CloudKitchen AI"
 */
export function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Strip leading slash and match
    const key = pathname.replace(/^\//, "") || "dashboard";
    const label = PAGE_TITLES[key];
    document.title = label ? formatTitle(label) : formatTitle("CloudKitchen AI");
  }, [pathname]);

  return null; // Renders nothing
}

/**
 * usePageTitle — hook for manually setting the title in a component.
 * Usage: usePageTitle("Inventory");
 */
export function usePageTitle(title) {
  useEffect(() => {
    const prev = document.title;
    document.title = formatTitle(title);
    return () => { document.title = prev; };
  }, [title]);
}
