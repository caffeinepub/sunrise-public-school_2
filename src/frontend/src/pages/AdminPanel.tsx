import {
  Activity,
  Bell,
  Download,
  Phone,
  PlusCircle,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import { sampleClasses, sampleFees, sampleStudents } from "../data/sampleData";
import { getSchoolSettings } from "./Settings";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  classAssigned: string;
  phone: string;
  active: boolean;
}

const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: "Mrs. Sunita Sharma",
    subject: "Mathematics",
    classAssigned: "Class 5-A",
    phone: "9811001001",
    active: true,
  },
  {
    id: 2,
    name: "Mr. Rajesh Verma",
    subject: "Science",
    classAssigned: "Class 8-B",
    phone: "9811001002",
    active: true,
  },
  {
    id: 3,
    name: "Mrs. Priya Joshi",
    subject: "English",
    classAssigned: "Class 10-C",
    phone: "9811001003",
    active: true,
  },
  {
    id: 4,
    name: "Mr. Anil Tiwari",
    subject: "Hindi",
    classAssigned: "Class 5-A",
    phone: "9811001004",
    active: false,
  },
  {
    id: 5,
    name: "Mrs. Kavita Rai",
    subject: "Social Studies",
    classAssigned: "Class 8-B",
    phone: "9811001005",
    active: true,
  },
];

interface Announcement {
  id: number;
  title: string;
  text: string;
  date: string;
}

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Annual Sports Day",
    text: "Annual Sports Day will be held on 15th April 2026. All students must participate.",
    date: "2026-03-25",
  },
  {
    id: 2,
    title: "Parent-Teacher Meeting",
    text: "PTM scheduled for 5th April 2026. Parents are requested to collect report cards.",
    date: "2026-03-28",
  },
];

const activityLog = [
  {
    id: 1,
    time: "Today 10:32 AM",
    action: "Student Aarav Sharma added to Class 5-A",
    type: "add",
  },
  {
    id: 2,
    time: "Today 10:15 AM",
    action: "Fees updated for Class 8-B students",
    type: "update",
  },
  {
    id: 3,
    time: "Today 09:50 AM",
    action: "Attendance marked for Class 10-C",
    type: "update",
  },
  {
    id: 4,
    time: "Yesterday 04:20 PM",
    action: "Student Pooja Rawat record deleted",
    type: "delete",
  },
  {
    id: 5,
    time: "Yesterday 03:45 PM",
    action: "Result card updated for Ravi Pandey",
    type: "update",
  },
  {
    id: 6,
    time: "Yesterday 02:10 PM",
    action: "New class Class 12-D created",
    type: "add",
  },
  {
    id: 7,
    time: "Yesterday 01:30 PM",
    action: "Admit cards generated for Class 10-C",
    type: "add",
  },
  {
    id: 8,
    time: "Mar 28, 11:00 AM",
    action: "Fee receipt issued to Kiran Mehta",
    type: "update",
  },
  {
    id: 9,
    time: "Mar 28, 10:20 AM",
    action: "Teacher Mrs. Kavita Rai marked active",
    type: "update",
  },
  {
    id: 10,
    time: "Mar 27, 03:00 PM",
    action: "School settings updated (logo changed)",
    type: "update",
  },
];

export default function AdminPanel() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const totalStudents = sampleStudents.length;
  const totalClasses = sampleClasses.length;
  const totalDue = sampleFees.reduce((s, f) => s + f.totalDue, 0);
  const totalPaid = sampleFees.reduce((s, f) => s + f.amountPaid, 0);
  const feePercent =
    totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;
  const pendingCount = sampleFees.filter((f) => !f.isPaid).length;

  function toggleTeacher(id: number) {
    setTeachers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
    );
  }

  function postAnnouncement() {
    if (!newTitle.trim() || !newText.trim()) return;
    const now = new Date().toISOString().split("T")[0];
    setAnnouncements((prev) => [
      {
        id: Date.now(),
        title: newTitle.trim(),
        text: newText.trim(),
        date: now,
      },
      ...prev,
    ]);
    setNewTitle("");
    setNewText("");
  }

  function deleteAnnouncement(id: number) {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  }

  function downloadBackup() {
    const settings = getSchoolSettings();
    const data = {
      settings,
      sampleStudents,
      sampleClasses,
      sampleFees,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `school-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="page">
      <Header title="Admin Panel" />

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#EFF6FF" }}>
            <ShieldCheck size={22} color="#3B82F6" />
          </div>
          <div>
            <div className="stat-num">{totalStudents}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#F0FDF4" }}>
            <Activity size={22} color="#22C55E" />
          </div>
          <div>
            <div className="stat-num">{totalClasses}</div>
            <div className="stat-label">Total Classes</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FFF7ED" }}>
            <Download size={22} color="#F97316" />
          </div>
          <div>
            <div className="stat-num">{feePercent}%</div>
            <div className="stat-label">Fee Collection</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FFF1F2" }}>
            <Bell size={22} color="#F43F5E" />
          </div>
          <div>
            <div className="stat-num">{pendingCount}</div>
            <div className="stat-label">Pending Fees</div>
          </div>
        </div>
      </div>

      {/* Teacher Management */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <UserCheck size={18} color="#6366F1" />
          <h2 className="card-title" style={{ margin: 0 }}>
            Teacher / Staff Management
          </h2>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table" data-ocid="admin.teacher.table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Subject</th>
                <th>Class Assigned</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <tr key={t.id} data-ocid={`admin.teacher.row.${i + 1}`}>
                  <td>{i + 1}</td>
                  <td>{t.name}</td>
                  <td>{t.subject}</td>
                  <td>{t.classAssigned}</td>
                  <td>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                      }}
                    >
                      <Phone size={13} />
                      {t.phone}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        background: t.active ? "#DCFCE7" : "#FEE2E2",
                        color: t.active ? "#16A34A" : "#DC2626",
                      }}
                    >
                      {t.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={t.active ? "btn-secondary" : "btn-primary"}
                      style={{
                        padding: "4px 12px",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                      onClick={() => toggleTeacher(t.id)}
                      data-ocid={`admin.teacher.toggle.${i + 1}`}
                    >
                      {t.active ? (
                        <>
                          <UserX size={13} />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <UserCheck size={13} />
                          Activate
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <Bell size={18} color="#F59E0B" />
          <h2 className="card-title" style={{ margin: 0 }}>
            Notice Board / Announcements
          </h2>
        </div>
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: 10,
            padding: "1rem",
            marginBottom: "1.25rem",
            border: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
              fontWeight: 600,
              marginBottom: "0.5rem",
              color: "#374151",
            }}
          >
            Post New Announcement
          </div>
          <input
            type="text"
            placeholder="Announcement Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #D1D5DB",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              outline: "none",
              boxSizing: "border-box",
            }}
            data-ocid="admin.announcement.input"
          />
          <textarea
            placeholder="Write announcement text here..."
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #D1D5DB",
              marginBottom: "0.75rem",
              fontSize: "0.9rem",
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
            }}
            data-ocid="admin.announcement.textarea"
          />
          <button
            type="button"
            className="btn-primary"
            style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
            onClick={postAnnouncement}
            data-ocid="admin.announcement.submit_button"
          >
            <PlusCircle size={15} /> Post Announcement
          </button>
        </div>
        {announcements.length === 0 && (
          <div
            style={{ textAlign: "center", color: "#9CA3AF", padding: "1rem" }}
            data-ocid="admin.announcement.empty_state"
          >
            No announcements yet.
          </div>
        )}
        {announcements.map((a, i) => (
          <div
            key={a.id}
            data-ocid={`admin.announcement.item.${i + 1}`}
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: 10,
              padding: "0.9rem 1rem",
              marginBottom: "0.75rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "1rem",
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontWeight: 700,
                  color: "#92400E",
                  marginBottom: "0.2rem",
                }}
              >
                {a.title}
              </div>
              <div
                style={{
                  color: "#78350F",
                  fontSize: "0.88rem",
                  marginBottom: "0.35rem",
                }}
              >
                {a.text}
              </div>
              <div style={{ color: "#A16207", fontSize: "0.78rem" }}>
                {a.date}
              </div>
            </div>
            <button
              type="button"
              onClick={() => deleteAnnouncement(a.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#EF4444",
                padding: 4,
              }}
              title="Delete announcement"
              data-ocid={`admin.announcement.delete_button.${i + 1}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Data Backup */}
      <div className="card" style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "0.75rem",
          }}
        >
          <Download size={18} color="#10B981" />
          <h2 className="card-title" style={{ margin: 0 }}>
            Data Backup
          </h2>
        </div>
        <p
          style={{ color: "#6B7280", fontSize: "0.9rem", marginBottom: "1rem" }}
        >
          Export all school data including students, classes, fees, and settings
          as a JSON file.
        </p>
        <button
          type="button"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={downloadBackup}
          data-ocid="admin.backup.download_button"
        >
          <Download size={16} /> Download Data Backup (JSON)
        </button>
      </div>

      {/* Activity Log */}
      <div className="card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <Activity size={18} color="#8B5CF6" />
          <h2 className="card-title" style={{ margin: 0 }}>
            Recent Activity Log
          </h2>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}
        >
          {activityLog.map((log, i) => (
            <div
              key={log.id}
              data-ocid={`admin.activity.item.${i + 1}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 0.8rem",
                borderRadius: 8,
                background: "#F9FAFB",
                border: "1px solid #F3F4F6",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background:
                    log.type === "add"
                      ? "#22C55E"
                      : log.type === "delete"
                        ? "#EF4444"
                        : "#3B82F6",
                }}
              />
              <span style={{ flex: 1, color: "#374151", fontSize: "0.88rem" }}>
                {log.action}
              </span>
              <span
                style={{
                  color: "#9CA3AF",
                  fontSize: "0.78rem",
                  whiteSpace: "nowrap",
                }}
              >
                {log.time}
              </span>
              <span
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  background:
                    log.type === "add"
                      ? "#DCFCE7"
                      : log.type === "delete"
                        ? "#FEE2E2"
                        : "#DBEAFE",
                  color:
                    log.type === "add"
                      ? "#16A34A"
                      : log.type === "delete"
                        ? "#DC2626"
                        : "#1D4ED8",
                }}
              >
                {log.type.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
