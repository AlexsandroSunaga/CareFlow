
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import {
  Activity,
  BarChart3,
  Building2,
  ClipboardList,
  FileStack,
  FlaskConical,
  LayoutDashboard,
  Pill,
  Scan,
  Share2,
  Shield,
  Stethoscope,
  Users,
  Wallet,
} from "lucide-react";
import { clearToken } from "@/api/client";

const sections = [
  {
    title: "Operations",
    items: [
      { href: "/console", label: "Command center", icon: LayoutDashboard },
      { href: "/console/scheduling", label: "Scheduling", icon: ClipboardList },
      { href: "/console/front-desk", label: "Front desk & arrivals", icon: Activity },
      { href: "/console/beds", label: "ADT & bed board", icon: Building2 },
      { href: "/console/discharge", label: "Discharge planning", icon: ClipboardList },
    ],
  },
  {
    title: "Clinical",
    items: [
      { href: "/console/cases", label: "Cases (de-identified)", icon: Stethoscope },
      { href: "/console/intake", label: "Intake & documents", icon: FileStack },
      { href: "/console/labs", label: "Laboratory", icon: FlaskConical },
      { href: "/console/imaging", label: "Radiology / imaging", icon: Scan },
      { href: "/console/pharmacy", label: "Pharmacy", icon: Pill },
    ],
  },
  {
    title: "Insights",
    items: [
      { href: "/console/analytics", label: "Operational analytics", icon: BarChart3 },
      { href: "/console/reports", label: "Report catalog", icon: FileStack },
    ],
  },
  {
    title: "Administration",
    items: [
      { href: "/console/departments", label: "Departments & units", icon: Building2 },
      { href: "/console/staff", label: "Staff directory", icon: Users },
      { href: "/console/billing", label: "Revenue & claims", icon: Wallet },
      { href: "/console/compliance", label: "Compliance & audit", icon: Shield },
      { href: "/console/fhir", label: "FHIR / interoperability", icon: Share2 },
    ],
  },
];

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const path = useLocation().pathname;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
        <div className="border-b border-slate-100 px-5 py-5">
          <p className="font-semibold text-brand-800">CareFlow Hospital</p>
          <p className="text-xs text-slate-500">Enterprise staff console</p>
        </div>
        <nav className="space-y-6 p-4 text-sm">
          {sections.map((sec) => (
            <div key={sec.title}>
              <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{sec.title}</p>
              <ul className="space-y-0.5">
                {sec.items.map((item) => {
                  const active = path === item.href || (item.href !== "/console" && path.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={clsx(
                          "flex items-center gap-2 rounded-lg px-2 py-2",
                          active ? "bg-brand-50 text-brand-800" : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            clearToken();
            window.location.href = "/console/login";
          }}
          className="mx-4 mb-6 w-[calc(100%-2rem)] rounded-lg border border-slate-200 py-2 text-sm text-slate-600"
        >
          Sign out
        </button>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-6 py-3 text-sm text-slate-500">
          Demo hospital · RBAC enabled · PHI-safe lists
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
