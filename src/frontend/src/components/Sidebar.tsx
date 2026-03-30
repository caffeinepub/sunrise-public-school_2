import { Link, useLocation } from "@tanstack/react-router";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
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
  { to: "/admin", label: "Admin Panel", icon: ShieldCheck },
] as const;

export function Sidebar() {
  const location = useLocation();
  const { clear } = useInternetIdentity();
  const [schoolName, setSchoolName] = useState(() => getSchoolSettings().name);
  const [settings, setSettings] = useState(() => getSchoolSettings());
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const s = getSchoolSettings();
      setSchoolName(s.name);
      setSettings(s);
    };
    window.addEventListener("storage", refresh);
    window.addEventListener("school-settings-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("school-settings-updated", refresh);
    };
  }, []);

  return (
    <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
      {/* Toggle Button */}
      <button
        type="button"
        className="sidebar-toggle"
        onClick={() => setCollapsed((v) => !v)}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        data-ocid="sidebar.toggle"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-icon">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          ) : (
            (schoolName[0] ?? "S")
          )}
        </div>
        {!collapsed && (
          <div className="brand-text">
            <div className="brand-name">{schoolName}</div>
            <div className="brand-sub">Management System</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`nav-item${active ? " active" : ""}${collapsed ? " collapsed" : ""}`}
              title={collapsed ? label : undefined}
              data-ocid={`sidebar.${label.toLowerCase().replace(/ /g, "_")}.link`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <button
        type="button"
        onClick={() => clear()}
        className={`sidebar-logout${collapsed ? " collapsed" : ""}`}
        title={collapsed ? "Logout" : undefined}
        data-ocid="sidebar.logout_button"
      >
        <LogOut size={18} />
        {!collapsed && <span>Logout</span>}
      </button>
    </aside>
  );
}
