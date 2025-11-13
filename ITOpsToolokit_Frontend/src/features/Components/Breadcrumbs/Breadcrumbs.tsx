import React from "react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  name: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't render breadcrumbs on the home page
  if (pathnames.length === 0) {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = pathnames.map((segment, index) => {
    const path = "/" + pathnames.slice(0, index + 1).join("/");

    // Split on hyphens, then capitalize manually
    const words = segment.split("-").map((word) => {
      if (word.toLowerCase() === "ai") {
        return "AI"; // Keep AI fully capitalized
      }
      // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1);
    });

    const name = words.join(" ");

    return { name, path };
  });

  return (
    <nav aria-label="breadcrumb">
      <ol className='body_p_font fw-bold m-0' style={{ display: "flex", gap: "8px", listStyle: "none", padding: 0 }}>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path}>
            {index > 0 && <span className="text-white"> / </span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-white">{crumb.name}</span>
            ) : (
              <Link to={crumb.path} className="text-white">
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;