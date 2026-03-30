import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface HeaderProps {
  title: string;
  teacherName?: string;
}

const sampleNotifications = [
  {
    id: 1,
    text: "New student Aarav Sharma added to Class 5-A",
    time: "10 min ago",
    read: false,
  },
  {
    id: 2,
    text: "Fees pending reminder: 5 students have unpaid fees",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    text: "Attendance marked for Class 10-C today",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 4,
    text: "Result cards updated for Mid Term exam",
    time: "Yesterday",
    read: true,
  },
  {
    id: 5,
    text: "Parent-Teacher Meeting scheduled for 5th April",
    time: "2 days ago",
    read: true,
  },
];

export function Header({ title, teacherName = "Teacher" }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { clear, identity } = useInternetIdentity();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handleSettingsNav() {
    setProfileOpen(false);
    navigate({ to: "/settings" });
  }

  function handleLogout() {
    setProfileOpen(false);
    clear();
  }

  function hoverIn(e: React.MouseEvent<HTMLButtonElement>, color: string) {
    e.currentTarget.style.background = color;
  }

  function hoverOut(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.style.background = "none";
  }

  const principalShort = identity
    ? `${identity.getPrincipal().toString().slice(0, 8)}...`
    : null;

  return (
    <header className="main-header no-print">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-right">
        {/* Notification Bell */}
        <div ref={notifRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              setNotifOpen((o) => !o);
              setProfileOpen(false);
            }}
            data-ocid="header.notification.button"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </button>

          {notifOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 320,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                border: "1px solid #E2E8F0",
                zIndex: 1000,
                overflow: "hidden",
              }}
              data-ocid="header.notification.popover"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 16px",
                  borderBottom: "1px solid #F1F5F9",
                  background: "#F8FAFC",
                }}
              >
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "#1E293B",
                  }}
                >
                  Notifications
                </span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#6366F1",
                        fontSize: "0.78rem",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#94A3B8",
                      padding: 2,
                    }}
                    data-ocid="header.notification.close_button"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom: "1px solid #F8FAFC",
                      background: n.read ? "#fff" : "#EEF2FF",
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                    }}
                  >
                    {!n.read && (
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#6366F1",
                          flexShrink: 0,
                          marginTop: 5,
                        }}
                      />
                    )}
                    {n.read && <span style={{ width: 8, flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "#334155",
                          lineHeight: 1.4,
                        }}
                      >
                        {n.text}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#94A3B8",
                          marginTop: 3,
                        }}
                      >
                        {n.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Teacher Profile */}
        <div ref={profileRef} style={{ position: "relative" }}>
          <button
            type="button"
            className="user-chip"
            style={{
              cursor: "pointer",
              border: "none",
              background: "transparent",
              padding: 0,
            }}
            onClick={() => {
              setProfileOpen((o) => !o);
              setNotifOpen(false);
            }}
            data-ocid="header.profile.button"
          >
            <div className="avatar">{teacherName[0]}</div>
            <span>{teacherName}</span>
          </button>

          {profileOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 10px)",
                right: 0,
                width: 220,
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                border: "1px solid #E2E8F0",
                zIndex: 1000,
                overflow: "hidden",
              }}
              data-ocid="header.profile.popover"
            >
              {/* Profile Info */}
              <div
                style={{
                  padding: "14px 16px",
                  borderBottom: "1px solid #F1F5F9",
                  background: "#F8FAFC",
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    marginBottom: 8,
                  }}
                >
                  {teacherName[0]}
                </div>
                <div
                  style={{
                    fontWeight: 700,
                    color: "#1E293B",
                    fontSize: "0.9rem",
                  }}
                >
                  {teacherName}
                </div>
                <div style={{ color: "#64748B", fontSize: "0.78rem" }}>
                  Teacher / Staff
                </div>
                {principalShort && (
                  <div
                    style={{
                      color: "#94A3B8",
                      fontSize: "0.72rem",
                      marginTop: 2,
                      fontFamily: "monospace",
                    }}
                  >
                    {principalShort}
                  </div>
                )}
              </div>

              {/* Menu Items */}
              <div style={{ padding: "6px 0" }}>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#374151",
                    fontSize: "0.87rem",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => hoverIn(e, "#F8FAFC")}
                  onMouseLeave={hoverOut}
                  data-ocid="header.profile.settings_button"
                  onClick={handleSettingsNav}
                >
                  <Settings size={15} color="#6366F1" />
                  Settings
                </button>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "9px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#EF4444",
                    fontSize: "0.87rem",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => hoverIn(e, "#FFF5F5")}
                  onMouseLeave={hoverOut}
                  data-ocid="header.profile.logout_button"
                  onClick={handleLogout}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
