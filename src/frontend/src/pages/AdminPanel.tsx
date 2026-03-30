import { useNavigate } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  Download,
  Eye,
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
import { type Teacher, getTeachers, saveTeachers } from "../data/teacherData";
import { getSchoolSettings } from "./Settings";

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
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>(() => getTeachers());
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
    const updated = teachers.map((t) =>
      t.id === id ? { ...t, active: !t.active } : t,
    );
    saveTeachers(updated);
    setTeachers(updated);
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
    const dateStr = new Date().toISOString().split("T")[0];

    let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets>`;

    const sheets = ["School Info", "Students", "Classes", "Fees"];
    for (const sheet of sheets) {
      html += `<x:ExcelWorksheet><x:Name>${sheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>`;
    }
    html +=
      "</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>";

    html += `
<table>
  <tr><td colspan="2" style="font-weight:bold;font-size:14pt;background:#4F46E5;color:#fff">School Information</td></tr>
  <tr><td style="font-weight:bold">School Name</td><td>${settings.name || ""}</td></tr>
  <tr><td style="font-weight:bold">Principal</td><td>${settings.principal || ""}</td></tr>
  <tr><td style="font-weight:bold">Mobile</td><td>${settings.phone || ""}</td></tr>
  <tr><td style="font-weight:bold">Exported On</td><td>${new Date().toLocaleString()}</td></tr>
</table>
<br/>`;

    html += `
<table>
  <tr><td colspan="9" style="font-weight:bold;font-size:14pt;background:#0F766E;color:#fff">Students Data</td></tr>
  <tr style="background:#CCFBF1;font-weight:bold">
    <td>#</td>
    <td>Name</td>
    <td>Roll No</td>
    <td>Class</td>
    <td>Date of Birth</td>
    <td>Father Name</td>
    <td>Mother Name</td>
    <td>Phone</td>
    <td>Address</td>
  </tr>`;
    for (let i = 0; i < sampleStudents.length; i++) {
      const s = sampleStudents[i];
      const cls = sampleClasses.find((c) => c.id === s.classId);
      const clsName = cls ? `${cls.name}-${cls.section}` : "";
      html += `
  <tr style="background:${i % 2 === 0 ? "#F0FDFA" : "#fff"}">
    <td>${i + 1}</td>
    <td>${s.name}</td>
    <td>${s.rollNo}</td>
    <td>${clsName}</td>
    <td>${s.dob}</td>
    <td>${s.fatherName}</td>
    <td>${s.motherName}</td>
    <td>${s.phone}</td>
    <td>${s.address}</td>
  </tr>`;
    }
    html += "</table><br/>";

    html += `
<table>
  <tr><td colspan="3" style="font-weight:bold;font-size:14pt;background:#92400E;color:#fff">Classes</td></tr>
  <tr style="background:#FEF3C7;font-weight:bold">
    <td>#</td>
    <td>Class Name</td>
    <td>Section</td>
    <td>Total Students</td>
  </tr>`;
    for (let i = 0; i < sampleClasses.length; i++) {
      const c = sampleClasses[i];
      const count = sampleStudents.filter((s) => s.classId === c.id).length;
      html += `
  <tr style="background:${i % 2 === 0 ? "#FFFBEB" : "#fff"}">
    <td>${i + 1}</td>
    <td>${c.name}</td>
    <td>${c.section}</td>
    <td>${count}</td>
  </tr>`;
    }
    html += "</table><br/>";

    html += `
<table>
  <tr><td colspan="6" style="font-weight:bold;font-size:14pt;background:#7C3AED;color:#fff">Fees Data</td></tr>
  <tr style="background:#EDE9FE;font-weight:bold">
    <td>#</td>
    <td>Student Name</td>
    <td>Class</td>
    <td>Fee Type</td>
    <td>Total Due</td>
    <td>Amount Paid</td>
    <td>Status</td>
  </tr>`;
    for (let i = 0; i < sampleFees.length; i++) {
      const f = sampleFees[i];
      const student = sampleStudents.find((s) => s.id === f.studentId);
      const cls = student
        ? sampleClasses.find((c) => c.id === student.classId)
        : null;
      const clsName = cls ? `${cls.name}-${cls.section}` : "";
      html += `
  <tr style="background:${i % 2 === 0 ? "#F5F3FF" : "#fff"}">
    <td>${i + 1}</td>
    <td>${student?.name || ""}</td>
    <td>${clsName}</td>
    <td>${f.feeType}</td>
    <td>${f.totalDue}</td>
    <td>${f.amountPaid}</td>
    <td>${f.isPaid ? "Paid" : "Pending"}</td>
  </tr>`;
    }
    html += "</table>";

    html += "</body></html>";

    const blob = new Blob([html], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `school-backup-${dateStr}.xls`;
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
            flexWrap: "wrap",
          }}
        >
          <UserCheck size={18} color="#6366F1" />
          <h2 className="card-title" style={{ margin: 0, flex: 1 }}>
            Teacher / Staff Management
          </h2>
          <button
            type="button"
            className="btn-primary"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 14px",
              fontSize: "0.82rem",
            }}
            onClick={() => navigate({ to: "/teachers" })}
            data-ocid="admin.teachers.open_modal_button"
          >
            <PlusCircle size={14} /> Manage Teachers
          </button>
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
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.78rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          background: "#EFF6FF",
                          color: "#3B82F6",
                          border: "1px solid #BFDBFE",
                        }}
                        onClick={() => navigate({ to: `/teacher/${t.id}` })}
                        data-ocid={`admin.teacher.view_button.${i + 1}`}
                      >
                        <Eye size={12} /> View
                      </button>
                      <button
                        type="button"
                        className={t.active ? "btn-secondary" : "btn-primary"}
                        style={{
                          padding: "4px 10px",
                          fontSize: "0.78rem",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                        onClick={() => toggleTeacher(t.id)}
                        data-ocid={`admin.teacher.toggle.${i + 1}`}
                      >
                        {t.active ? (
                          <>
                            <UserX size={12} />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserCheck size={12} />
                            Activate
                          </>
                        )}
                      </button>
                    </div>
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
          as an Excel file (.xls).
        </p>
        <button
          type="button"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          onClick={downloadBackup}
          data-ocid="admin.backup.download_button"
        >
          <Download size={16} /> Download Data Backup (Excel)
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
