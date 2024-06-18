import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Overview" },
  { href: "/about", label: "About" },
  { href: "/for-clinicians", label: "Clinicians" },
  { href: "/locations", label: "Locations" },
  { href: "/patient-guide", label: "Patients" },
  { href: "/security", label: "Security" },
  { href: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2 font-semibold text-brand-900" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm text-white">CF</span>
          <span className="whitespace-nowrap">CareFlow Hospital</span>
        </Link>
        <nav className="hidden gap-6 text-sm font-medium text-slate-600 lg:flex" aria-label="Main">
          {links.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              end
              className={({ isActive }) => (isActive ? "text-brand-600" : "hover:text-brand-600")}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="whitespace-nowrap rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-brand-600/25 hover:bg-brand-500"
          >
            Staff console
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-slate-200/80 bg-white px-4 py-2 sm:px-6 lg:hidden" aria-label="Mobile">
          {links.map((l) => (
            <Link
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
