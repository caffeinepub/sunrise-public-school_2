import { Edit2, Plus, Printer, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import { sampleClasses } from "../data/sampleData";
import { loadStudents } from "../data/studentStore";
import { getSchoolSettings } from "./Settings";

interface ExamRow {
  id: number;
  day: string;
  date: string;
  subject: string;
  time: string;
}

const defaultSchedule: ExamRow[] = [
  {
    id: 1,
    day: "Thursday",
    date: "26-02-2026",
    subject: "P.T",
    time: "09:00 AM to 12:00 PM",
  },
  {
    id: 2,
    day: "Friday",
    date: "27-02-2026",
    subject: "Social Science",
    time: "09:00 AM to 12:00 PM",
  },
  {
    id: 3,
    day: "Friday",
    date: "06-03-2026",
    subject: "Maths",
    time: "09:00 AM to 12:00 PM",
  },
  {
    id: 4,
    day: "Tuesday",
    date: "10-03-2026",
    subject: "Science",
    time: "09:00 AM to 12:00 PM",
  },
  {
    id: 5,
    day: "Wednesday",
    date: "11-03-2026",
    subject: "Sanskrit/Urdu & Hindi",
    time: "09:00 AM to 12:00 PM",
  },
  {
    id: 6,
    day: "Friday",
    date: "13-03-2026",
    subject: "Hindi",
    time: "09:00 AM to 12:00 PM",
  },
  {
    id: 7,
    day: "Saturday",
    date: "14-03-2026",
    subject: "Computer & G.K.",
    time: "09:00 AM to 12:00 PM",
  },
  {
    id: 8,
    day: "Tuesday",
    date: "17-03-2026",
    subject: "English",
    time: "09:00 AM to 12:00 PM",
  },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface NoteItem {
  id: number;
  text: string;
}
const defaultNotes: NoteItem[] = [
  {
    id: 1,
    text: "In case of any discrepancy between the entries in the datesheet issued and in the School record, the School record shall be final.",
  },
  {
    id: 2,
    text: "Students must bring their own lunch to school. Students must come in proper school uniform.",
  },
  {
    id: 3,
    text: "Students must bring the 'Admit Card' and show it to the invigilator(s) on duty and should preserve it for future requirements.",
  },
  {
    id: 4,
    text: "Mobile Phone, Calculator, Digital Watch or any Electronic Device is NOT ALLOWED.",
  },
  {
    id: 5,
    text: "Arrive at the School at least 15 minutes before the start of the examination. It is compulsory to carry the school ID card.",
  },
  {
    id: 6,
    text: "Maintain discipline and follow the instructions given by the invigilator.",
  },
  {
    id: 7,
    text: "Ensure that you use the washroom before arriving for your exam as you will not be permitted to leave during the first hour.",
  },
  {
    id: 8,
    text: "Normally, you are required to answer questions using blue or black ink. Make sure you bring some spare pens with you.",
  },
  {
    id: 9,
    text: "Keep your eyes on your own paper. Remember, copying is cheating!",
  },
  {
    id: 10,
    text: "All school fees must be cleared up to the month of March before appearing in the examination. Students with pending fees will not be allowed to sit in the examination.",
  },
];

function formatDob(dob: string | undefined): string {
  if (!dob) return "___";
  const parts = dob.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dob;
}

export default function AdmitCards() {
  const settings = getSchoolSettings();
  const [students] = useState(loadStudents);
  const [classId, setClassId] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [examTitle, setExamTitle] = useState("Final Examination");
  const [session, setSession] = useState("Session 2025-26");
  const [schedule, setSchedule] = useState<ExamRow[]>(defaultSchedule);
  const [showEditor, setShowEditor] = useState(false);
  const [nextId, setNextId] = useState(9);
  const [notes, setNotes] = useState<NoteItem[]>(defaultNotes);
  const [nextNoteId, setNextNoteId] = useState(11);
  const [editNoteIdx, setEditNoteIdx] = useState<number | null>(null);
  const [editNoteText, setEditNoteText] = useState("");
  const [newNoteText, setNewNoteText] = useState("");

  const classStudents = students.filter((s) => s.classId === classId);
  const cls = sampleClasses.find((c) => c.id === classId);
  const student = selectedStudent
    ? students.find((s) => s.id === selectedStudent)
    : null;

  const printCard = () => window.print();

  const addRow = () => {
    setSchedule([
      ...schedule,
      {
        id: nextId,
        day: "Monday",
        date: "",
        subject: "",
        time: "09:00 AM to 12:00 PM",
      },
    ]);
    setNextId(nextId + 1);
  };
  const removeRow = (id: number) =>
    setSchedule(schedule.filter((r) => r.id !== id));
  const updateRow = (id: number, field: keyof ExamRow, value: string) =>
    setSchedule(
      schedule.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );

  const startEditNote = (id: number) => {
    const n = notes.find((n) => n.id === id);
    if (!n) return;
    setEditNoteIdx(id);
    setEditNoteText(n.text);
  };
  const saveNote = () => {
    if (editNoteIdx === null) return;
    setNotes(
      notes.map((n) =>
        n.id === editNoteIdx ? { ...n, text: editNoteText } : n,
      ),
    );
    setEditNoteIdx(null);
  };
  const removeNote = (id: number) => setNotes(notes.filter((n) => n.id !== id));
  const addNote = () => {
    if (!newNoteText.trim()) return;
    setNotes([...notes, { id: nextNoteId, text: newNoteText.trim() }]);
    setNextNoteId(nextNoteId + 1);
    setNewNoteText("");
  };

  const AdmitCardContent = () => (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: 13,
        color: "#000",
        background: "#fff",
        border: "2px solid #000",
        padding: "12px 16px",
        maxWidth: 780,
        margin: "0 auto",
      }}
    >
      {/* School Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "2px solid #000",
          paddingBottom: 10,
          marginBottom: 6,
        }}
      >
        {settings.logoUrl && (
          <img
            src={settings.logoUrl}
            style={{
              height: 70,
              width: 70,
              objectFit: "contain",
              marginRight: 12,
              flexShrink: 0,
            }}
            alt="logo"
          />
        )}
        <div style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "#003366",
              letterSpacing: 1,
            }}
          >
            {settings.name}
          </div>
          {settings.affiliation && (
            <div style={{ fontSize: 12 }}>
              Affiliation No. {settings.affiliation}
            </div>
          )}
          {settings.phone && (
            <div style={{ fontSize: 12 }}>Mobile : {settings.phone}</div>
          )}
          {settings.email && (
            <div style={{ fontSize: 12 }}>Email : {settings.email}</div>
          )}
        </div>
      </div>

      {/* Card Title */}
      <div style={{ textAlign: "center", margin: "6px 0 4px" }}>
        <div
          style={{
            fontWeight: "bold",
            fontSize: 14,
            textDecoration: "underline",
          }}
        >
          Examination Admit Card
        </div>
        <div style={{ fontSize: 12 }}>
          ({session} &nbsp;:&nbsp; {examTitle})
        </div>
      </div>

      {/* Roll + Class + Photo + Full Student Info */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          margin: "8px 0 0",
          borderTop: "1px solid #000",
          borderLeft: "1px solid #000",
          borderRight: "1px solid #000",
          padding: 0,
        }}
      >
        {/* Left: student details */}
        <div style={{ flex: 1, padding: "8px 10px" }}>
          {/* Row 1: Roll Number big */}
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 13 }}>Roll Number : </span>
            <span style={{ fontWeight: "bold", fontSize: 20, marginLeft: 4 }}>
              {student?.rollNo ?? "___"}
            </span>
            <span style={{ marginLeft: 32, fontSize: 13 }}>Class : </span>
            <span style={{ fontWeight: "bold", fontSize: 20, marginLeft: 4 }}>
              {cls ? cls.name.replace("Class ", "") : "___"}
            </span>
          </div>
          {/* Row 2: Name */}
          <div style={{ marginBottom: 4 }}>
            <span
              style={{ fontSize: 13, minWidth: 140, display: "inline-block" }}
            >
              Student's Name :
            </span>
            <strong style={{ textTransform: "uppercase", fontSize: 13 }}>
              {student?.name ?? "___________________________"}
            </strong>
          </div>
          {/* Row 3: Admission No + DOB */}
          <div style={{ display: "flex", gap: 24, marginBottom: 4 }}>
            <div>
              <span style={{ fontSize: 12 }}>Admission No : </span>
              <strong style={{ fontSize: 12 }}>
                {student?.admissionNo ?? "___"}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: 12 }}>Date of Birth : </span>
              <strong style={{ fontSize: 12 }}>
                {formatDob(student?.dob)}
              </strong>
            </div>
          </div>
          {/* Row 4: Father + Mother */}
          <div style={{ display: "flex", gap: 24, marginBottom: 4 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12 }}>Father's Name : </span>
              <strong style={{ fontSize: 12, textTransform: "uppercase" }}>
                {student?.fatherName ?? "___"}
              </strong>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12 }}>Mother's Name : </span>
              <strong style={{ fontSize: 12, textTransform: "uppercase" }}>
                {student?.motherName ?? "___"}
              </strong>
            </div>
          </div>
          {/* Row 5: Phone + Address */}
          <div style={{ display: "flex", gap: 24, marginBottom: 4 }}>
            <div>
              <span style={{ fontSize: 12 }}>Phone : </span>
              <strong style={{ fontSize: 12 }}>
                {student?.phone ?? "___"}
              </strong>
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12 }}>Address : </span>
              <strong style={{ fontSize: 12 }}>
                {student?.address ?? "___"}
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Photo box */}
        <div
          style={{
            borderLeft: "1px solid #000",
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minWidth: 90,
          }}
        >
          <div
            style={{
              border: "1px solid #aaa",
              width: 70,
              height: 85,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "#888",
              overflow: "hidden",
              background: "#f8f8f8",
            }}
          >
            {student?.photoUrl ? (
              <img
                src={student.photoUrl}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                alt="Student"
              />
            ) : (
              <span style={{ textAlign: "center", padding: 4 }}>Photo</span>
            )}
          </div>
        </div>
      </div>

      {/* Divider below student info */}
      <div style={{ borderBottom: "1px solid #000", marginBottom: 8 }} />

      {/* Schedule Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: 8,
          fontSize: 13,
        }}
      >
        <thead>
          <tr style={{ background: "#e8e8e8" }}>
            <th style={thStyle}>Day</th>
            <th style={thStyle}>Exam. Date</th>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Timing</th>
            <th style={thStyle}>Checked By</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((row) => (
            <tr key={row.id}>
              <td style={tdStyle}>{row.day}</td>
              <td style={tdStyle}>{row.date}</td>
              <td style={tdStyle}>{row.subject}</td>
              <td style={tdStyle}>{row.time}</td>
              <td style={tdStyle}>&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* General Instructions */}
      <div
        style={{
          border: "1px solid #000",
          padding: "6px 10px",
          marginBottom: 8,
          fontSize: 12,
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 4,
            fontSize: 13,
          }}
        >
          General /Exam Instructions for Students
        </div>
        <ol style={{ margin: "0 0 0 18px", padding: 0 }}>
          {notes.map((n) => (
            <li key={n.id} style={{ marginBottom: 2 }}>
              {n.text}
            </li>
          ))}
        </ol>
      </div>

      {/* Footer signatures */}
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
      >
        <tbody>
          <tr>
            {[
              "Date of Issue",
              "Sign's Parents",
              "Class Teacher Sign",
              "Rechecked By",
              "Principal",
            ].map((label) => (
              <td
                key={label}
                style={{
                  border: "1px solid #000",
                  padding: "4px 8px",
                  width: "20%",
                }}
              >
                {label}
                <br />
                <br />
                ___________
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="page">
      <Header title="Admit Cards" />

      {/* Print only version */}
      {student && (
        <div className="print-only printable" style={{ padding: 16 }}>
          <AdmitCardContent />
        </div>
      )}

      {/* Customize Modal */}
      {showEditor && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            className="card"
            style={{
              width: "100%",
              maxWidth: 720,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 24,
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setShowEditor(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
            <h3 style={{ marginBottom: 16, fontWeight: 600 }}>
              Customize Admit Card
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 16,
              }}
            >
              <div className="form-group">
                <label htmlFor="exam-title">Exam Title</label>
                <input
                  id="exam-title"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder="e.g. Final Examination"
                />
              </div>
              <div className="form-group">
                <label htmlFor="session-input">Session</label>
                <input
                  id="session-input"
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  placeholder="e.g. Session 2025-26"
                />
              </div>
            </div>

            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              Exam Schedule
            </div>
            <table className="data-table" style={{ marginBottom: 12 }}>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Timing</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <select
                        value={row.day}
                        onChange={(e) =>
                          updateRow(row.id, "day", e.target.value)
                        }
                        className="select-input"
                        style={{ width: 110 }}
                      >
                        {DAYS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        value={row.date}
                        onChange={(e) =>
                          updateRow(row.id, "date", e.target.value)
                        }
                        placeholder="DD-MM-YYYY"
                        style={{ width: 110 }}
                      />
                    </td>
                    <td>
                      <input
                        value={row.subject}
                        onChange={(e) =>
                          updateRow(row.id, "subject", e.target.value)
                        }
                        placeholder="Subject"
                        style={{ width: 140 }}
                      />
                    </td>
                    <td>
                      <input
                        value={row.time}
                        onChange={(e) =>
                          updateRow(row.id, "time", e.target.value)
                        }
                        placeholder="09:00 AM to 12:00 PM"
                        style={{ width: 170 }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-action"
                        onClick={() => removeRow(row.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              type="button"
              className="btn-secondary"
              onClick={addRow}
              style={{ marginBottom: 24 }}
            >
              <Plus size={14} /> Add Subject
            </button>

            <div style={{ fontWeight: 600, marginBottom: 6 }}>
              General Instructions
            </div>
            {notes.map((n, idx) => (
              <div
                key={n.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span style={{ minWidth: 22, color: "#888", fontWeight: 600 }}>
                  {idx + 1}.
                </span>
                {editNoteIdx === n.id ? (
                  <>
                    <input
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ padding: "4px 12px", fontSize: 13 }}
                      onClick={saveNote}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: "4px 10px", fontSize: 13 }}
                      onClick={() => setEditNoteIdx(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: 13 }}>{n.text}</span>
                    <button
                      type="button"
                      className="icon-action"
                      onClick={() => startEditNote(n.id)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-action"
                      onClick={() => removeNote(n.id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 10,
                marginBottom: 20,
              }}
            >
              <input
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add new instruction..."
                style={{ flex: 1 }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addNote();
                }}
              />
              <button type="button" className="btn-secondary" onClick={addNote}>
                <Plus size={14} /> Add
              </button>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowEditor(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="no-print">
        <div className="page-actions">
          <select
            value={classId}
            onChange={(e) => {
              setClassId(Number(e.target.value));
              setSelectedStudent(null);
            }}
            className="select-input"
          >
            {sampleClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
          <select
            value={selectedStudent ?? ""}
            onChange={(e) => setSelectedStudent(Number(e.target.value))}
            className="select-input"
          >
            <option value="">Select Student</option>
            {classStudents.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Roll: {s.rollNo})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowEditor(true)}
          >
            <Edit2 size={16} /> Customize
          </button>
          {selectedStudent && (
            <button type="button" className="btn-primary" onClick={printCard}>
              <Printer size={16} /> Print Admit Card
            </button>
          )}
        </div>

        {student ? (
          <div style={{ padding: "0 28px 28px", overflowX: "auto" }}>
            <AdmitCardContent />
          </div>
        ) : (
          <div className="card empty-state">
            <p>
              Select a class and student to preview and print the admit card.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #000",
  padding: "5px 8px",
  textAlign: "left",
  fontWeight: "bold",
  background: "#e8e8e8",
  fontSize: 13,
};
const tdStyle: React.CSSProperties = {
  border: "1px solid #000",
  padding: "4px 8px",
  fontSize: 13,
};
