import { Link, useLocation } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { getSchoolSettings } from "../pages/Settings";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/classes", label: "Classes", icon: GraduationCap },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: ClipboardCheck },
  { to: "/results", label: "Results", icon: Award },
  { to: "/fees", label: "Fees", icon: CreditCard },
  { to: "/admit-cards", label: "Admit Cards", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const [schoolName, setSchoolName] = useState(() => getSchoolSettings().name);

  useEffect(() => {
    const refresh = () => setSchoolName(getSchoolSettings().name);
    window.addEventListener("storage", refresh);
    window.addEventListener("school-settings-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("school-settings-updated", refresh);
    };
  }, []);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">{schoolName[0] ?? "S"}</div>
        <div>
          <div className="brand-name">{schoolName}</div>
          <div className="brand-sub">Management System</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`nav-item ${active ? "active" : ""}`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {active && <span className="active-badge">Active</span>}
            </Link>
          );
        })}
      </nav>
      <button type="button" onClick={() => clear()} className="sidebar-logout">
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
