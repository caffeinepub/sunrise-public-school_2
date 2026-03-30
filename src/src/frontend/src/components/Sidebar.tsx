import { useLocation, useNavigate } from "@tanstack/react-router";
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
  User,
  Users,
  X,
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
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settings, setSettings] = useState(() => getSchoolSettings());

  useEffect(() => {
    const refresh = () => setSettings(getSchoolSettings());
    window.addEventListener("storage", refresh);
    window.addEventListener("school-settings-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("school-settings-updated", refresh);
    };
  }, []);

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <>
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarWidth,
          minWidth: sidebarWidth,
          transition: "width 0.3s ease, min-width 0.3s ease",
          background: "#0b1f2e",
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          flexShrink: 0,
          position: "relative",
          overflow: "visible",
          zIndex: 10,
        }}
      >
        {/* Toggle Button */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute",
            top: 22,
            right: -14,
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "white",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 20,
            color: "#374151",
            padding: 0,
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: collapsed ? "16px 16px" : "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            justifyContent: collapsed ? "center" : "flex-start",
            minHeight: 72,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              background: "#22c55e",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 18,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            {settings.logoUrl ? (
              <img
                src={settings.logoUrl}
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            ) : (
              (settings.name?.[0] ?? "S")
            )}
          </div>
          {!collapsed && (
            <div style={{ overflow: "hidden", flex: 1 }}>
              <div
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 13,
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {settings.name}
              </div>
              <div style={{ color: "#a8b3c2", fontSize: 11 }}>
                Management System
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav
          style={{
            flex: 1,
            padding: "12px 8px",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <a
                key={to}
                href={to}
                title={collapsed ? label : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  navigate({ to });
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? "10px" : "9px 12px",
                  borderRadius: 8,
                  color: active ? "white" : "#a8b3c2",
                  textDecoration: "none",
                  fontSize: 14,
                  background: active ? "#1c344b" : "transparent",
                  borderLeft: active
                    ? "3px solid #22c55e"
                    : "3px solid transparent",
                  justifyContent: collapsed ? "center" : "flex-start",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "#1c344b";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "white";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    (e.currentTarget as HTMLAnchorElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLAnchorElement).style.color =
                      "#a8b3c2";
                  }
                }}
              >
                <Icon size={18} style={{ flexShrink: 0 }} />
                {!collapsed && <span>{label}</span>}
              </a>
            );
          })}

          {/* School Profile */}
          <button
            type="button"
            title={collapsed ? "School Profile" : undefined}
            onClick={() => setProfileOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: collapsed ? "10px" : "9px 12px",
              borderRadius: 8,
              color: "#a8b3c2",
              background: "none",
              border: "3px solid transparent",
              fontSize: 14,
              cursor: "pointer",
              justifyContent: collapsed ? "center" : "flex-start",
              whiteSpace: "nowrap",
              width: "100%",
              marginTop: 8,
              transition: "background 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#1c344b";
              (e.currentTarget as HTMLButtonElement).style.color = "white";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
              (e.currentTarget as HTMLButtonElement).style.color = "#a8b3c2";
            }}
          >
            <User size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span>School Profile</span>}
          </button>
        </nav>

        {/* Logout */}
        <button
          type="button"
          title={collapsed ? "Logout" : undefined}
          onClick={() => clear()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: collapsed ? "16px" : "16px 24px",
            color: "#a8b3c2",
            background: "none",
            border: "none",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            cursor: "pointer",
            fontSize: 14,
            justifyContent: collapsed ? "center" : "flex-start",
            whiteSpace: "nowrap",
            width: "100%",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#a8b3c2";
          }}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* School Profile Slide Panel */}
      {profileOpen && (
        <>
          <div
            role="presentation"
            onClick={() => setProfileOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setProfileOpen(false);
            }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "fixed",
              top: 0,
              left: sidebarWidth,
              width: 300,
              height: "100vh",
              background: "#112233",
              zIndex: 50,
              padding: 24,
              boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
              overflowY: "auto",
              transition: "left 0.3s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <span style={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                School Profile
              </span>
              <button
                type="button"
                onClick={() => setProfileOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#a8b3c2",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: "#22c55e",
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 700,
                  color: "white",
                  overflow: "hidden",
                }}
              >
                {settings.logoUrl ? (
                  <img
                    src={settings.logoUrl}
                    alt="logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: 16,
                    }}
                  />
                ) : (
                  (settings.name?.[0] ?? "S")
                )}
              </div>
              <div
                style={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: 17,
                  textAlign: "center",
                }}
              >
                {settings.name}
              </div>
              <div style={{ color: "#a8b3c2", fontSize: 13 }}>
                School Management System
              </div>
            </div>

            {[
              { label: "Principal", value: settings.principal || "Not set" },
              { label: "Email", value: settings.email || "Not set" },
              {
                label: "Affiliation No.",
                value: settings.affiliation || "Not set",
              },
              {
                label: "Est. Year",
                value: settings.yearEstablished || "Not set",
              },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    color: "#a8b3c2",
                    fontSize: 10,
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {label}
                </div>
                <div style={{ color: "white", fontSize: 14 }}>{value}</div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => {
                setProfileOpen(false);
                navigate({ to: "/settings" });
              }}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "10px",
                background: "#22c55e",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Edit School Settings
            </button>
          </div>
        </>
      )}
    </>
  );
}
