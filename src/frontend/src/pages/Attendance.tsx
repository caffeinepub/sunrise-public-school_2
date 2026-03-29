import { CheckCircle, Clock, Printer, XCircle } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import {
  type SAttendance,
  sampleAttendance,
  sampleClasses,
  sampleStudents,
} from "../data/sampleData";

const STATUS_CONFIG = {
  present: {
    label: "Present",
    color: "#16a34a",
    bg: "#dcfce7",
    border: "#16a34a",
    icon: CheckCircle,
  },
  late: {
    label: "Late",
    color: "#b45309",
    bg: "#fef3c7",
    border: "#b45309",
    icon: Clock,
  },
  absent: {
    label: "Absent",
    color: "#dc2626",
    bg: "#fee2e2",
    border: "#dc2626",
    icon: XCircle,
  },
} as const;

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [classId, setClassId] = useState(1);
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState<SAttendance[]>(sampleAttendance);

  const students = sampleStudents.filter((s) => s.classId === classId);
  const cls = sampleClasses.find((c) => c.id === classId);

  const getStatus = (sid: number): SAttendance["status"] =>
    records.find((r) => r.studentId === sid && r.date === date)?.status ??
    "present";

  const mark = (sid: number, status: SAttendance["status"]) => {
    setRecords((r) => {
      const existing = r.findIndex(
        (x) => x.studentId === sid && x.date === date,
      );
      if (existing >= 0) {
        const n = [...r];
        n[existing] = { studentId: sid, date, status };
        return n;
      }
      return [...r, { studentId: sid, date, status }];
    });
  };

  const markAll = (status: SAttendance["status"]) => {
    for (const s of students) {
      mark(s.id, status);
    }
  };

  const present = students.filter((s) => getStatus(s.id) === "present").length;
  const late = students.filter((s) => getStatus(s.id) === "late").length;
  const absent = students.filter((s) => getStatus(s.id) === "absent").length;

  return (
    <div className="page">
      <Header title="Attendance" />

      {/* Print-only header */}
      <div className="print-only" style={{ padding: "16px 24px 0" }}>
        <h2 style={{ margin: 0 }}>Attendance Sheet</h2>
        <p style={{ margin: "4px 0" }}>
          {cls?.name} {cls?.section} | Date: {date} | Present: {present}/
          {students.length}
        </p>
      </div>

      <div className="no-print">
        <div className="page-actions">
          <select
            value={classId}
            onChange={(e) => setClassId(Number(e.target.value))}
            className="select-input"
          >
            {sampleClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="date-input"
          />
          {/* Mark All buttons */}
          <button
            type="button"
            className="btn-secondary"
            style={{ color: "#16a34a", borderColor: "#16a34a" }}
            onClick={() => markAll("present")}
          >
            <CheckCircle size={15} /> Sab Present
          </button>
          <button
            type="button"
            className="btn-secondary"
            style={{ color: "#dc2626", borderColor: "#dc2626" }}
            onClick={() => markAll("absent")}
          >
            <XCircle size={15} /> Sab Absent
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print
          </button>
        </div>

        {/* Summary bar */}
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "0 24px 16px",
            flexWrap: "wrap",
          }}
        >
          {(
            [
              { key: "present", count: present },
              { key: "late", count: late },
              { key: "absent", count: absent },
            ] as const
          ).map(({ key, count }) => {
            const cfg = STATUS_CONFIG[key];
            return (
              <div
                key={key}
                style={{
                  background: cfg.bg,
                  border: `1px solid ${cfg.border}`,
                  color: cfg.color,
                  borderRadius: 8,
                  padding: "6px 16px",
                  fontWeight: 600,
                  fontSize: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <cfg.icon size={16} />
                {cfg.label}: {count}
              </div>
            );
          })}
          <div
            style={{
              color: "#666",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            Total: {students.length}
          </div>
        </div>
      </div>

      <div className="card printable">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>Roll</th>
              <th>Student Name</th>
              <th style={{ width: 80 }} className="no-print">
                Photo
              </th>
              <th>Attendance Status</th>
              <th className="print-only" style={{ width: 80 }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const st = getStatus(s.id);
              const cfg = STATUS_CONFIG[st];
              return (
                <tr
                  key={s.id}
                  style={{
                    background:
                      st === "absent"
                        ? "#fff5f5"
                        : st === "late"
                          ? "#fffbeb"
                          : undefined,
                  }}
                >
                  <td style={{ fontWeight: 600 }}>{s.rollNo}</td>
                  <td className="font-medium">
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      {s.photoUrl && (
                        <img
                          src={s.photoUrl}
                          alt={s.name}
                          style={{
                            width: 30,
                            height: 36,
                            objectFit: "cover",
                            borderRadius: 3,
                            border: "1px solid #ddd",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      {s.name}
                    </div>
                  </td>
                  {/* Photo column hidden on print */}
                  <td className="no-print" />
                  {/* Attendance buttons -- no-print */}
                  <td className="no-print">
                    <div style={{ display: "flex", gap: 6 }}>
                      {(
                        Object.entries(STATUS_CONFIG) as [
                          SAttendance["status"],
                          (typeof STATUS_CONFIG)[keyof typeof STATUS_CONFIG],
                        ][]
                      ).map(([status, c]) => {
                        const active = st === status;
                        return (
                          <button
                            key={status}
                            type="button"
                            onClick={() => mark(s.id, status)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 4,
                              padding: "5px 12px",
                              borderRadius: 6,
                              fontSize: 13,
                              fontWeight: active ? 700 : 400,
                              cursor: "pointer",
                              border: `1.5px solid ${active ? c.border : "#d1d5db"}`,
                              background: active ? c.bg : "#fff",
                              color: active ? c.color : "#6b7280",
                              transition: "all 0.15s",
                            }}
                          >
                            <c.icon size={14} />
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  {/* Print only: show text status */}
                  <td
                    className="print-only"
                    style={{ fontWeight: 700, color: cfg.color }}
                  >
                    {cfg.label}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
