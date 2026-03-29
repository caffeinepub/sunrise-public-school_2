import { Edit2, Plus, Printer, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import { sampleClasses, sampleStudents } from "../data/sampleData";
import { getSchoolSettings } from "./Settings";

interface ExamRow {
  id: number;
  date: string;
  day: string;
  subject: string;
  time: string;
}

const defaultSchedule: ExamRow[] = [
  {
    id: 1,
    date: "2026-04-10",
    day: "Friday",
    subject: "Mathematics",
    time: "9:00 AM - 12:00 PM",
  },
  {
    id: 2,
    date: "2026-04-12",
    day: "Sunday",
    subject: "Science",
    time: "9:00 AM - 12:00 PM",
  },
  {
    id: 3,
    date: "2026-04-14",
    day: "Tuesday",
    subject: "English",
    time: "9:00 AM - 12:00 PM",
  },
  {
    id: 4,
    date: "2026-04-16",
    day: "Thursday",
    subject: "Hindi",
    time: "9:00 AM - 12:00 PM",
  },
  {
    id: 5,
    date: "2026-04-18",
    day: "Saturday",
    subject: "Social Studies",
    time: "9:00 AM - 12:00 PM",
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

export default function AdmitCards() {
  const settings = getSchoolSettings();
  const [classId, setClassId] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [examTitle, setExamTitle] = useState("Annual Examination 2026");
  const [schedule, setSchedule] = useState<ExamRow[]>(defaultSchedule);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [nextId, setNextId] = useState(6);

  const students = sampleStudents.filter((s) => s.classId === classId);
  const cls = sampleClasses.find((c) => c.id === classId);
  const student = selectedStudent
    ? sampleStudents.find((s) => s.id === selectedStudent)
    : null;

  const printCard = () => window.print();

  const addRow = () => {
    setSchedule([
      ...schedule,
      {
        id: nextId,
        date: "",
        day: "Monday",
        subject: "",
        time: "9:00 AM - 12:00 PM",
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

  return (
    <div className="page">
      <Header title="Admit Cards" />
      {student && (
        <div className="print-only printable admit-card">
          <div className="ac-header">
            <div className="ac-school">
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  style={{ height: 60, objectFit: "contain" }}
                  alt="logo"
                />
              )}
              <h2>{settings.name}</h2>
              <p>
                Affiliation: {settings.affiliation} | Est.{" "}
                {settings.yearEstablished}
              </p>
              <p>
                {settings.email} | Principal: {settings.principal}
              </p>
            </div>
            <h3>ADMIT CARD - {examTitle}</h3>
          </div>
          <div className="ac-info">
            <div>
              <strong>Name:</strong> {student.name}
            </div>
            <div>
              <strong>Admission No:</strong> {student.admissionNo}
            </div>
            <div>
              <strong>Class:</strong> {cls?.name} - {cls?.section}
            </div>
            <div>
              <strong>Roll No:</strong> {student.rollNo}
            </div>
            <div>
              <strong>Father:</strong> {student.fatherName}
            </div>
            <div>
              <strong>DOB:</strong> {student.dob}
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Subject</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((e) => (
                <tr key={e.id}>
                  <td>{e.date}</td>
                  <td>{e.day}</td>
                  <td>{e.subject}</td>
                  <td>{e.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="ac-footer">
            <div>Student Signature: ___________</div>
            <div>Controller of Examinations: ___________</div>
          </div>
          <div className="ac-note">
            Note: This admit card must be produced at the examination hall.
            Mobile phones are not allowed.
          </div>
        </div>
      )}

      {/* Schedule Editor Modal */}
      {showScheduleEditor && (
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
              maxWidth: 680,
              maxHeight: "90vh",
              overflowY: "auto",
              padding: 24,
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setShowScheduleEditor(false)}
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

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label htmlFor="exam-title">Exam Title</label>
              <input
                id="exam-title"
                value={examTitle}
                onChange={(e) => setExamTitle(e.target.value)}
                placeholder="e.g. Annual Examination 2026"
              />
            </div>

            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              Exam Schedule
            </div>
            <table className="data-table" style={{ marginBottom: 12 }}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Subject</th>
                  <th>Time</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="date"
                        value={row.date}
                        onChange={(e) =>
                          updateRow(row.id, "date", e.target.value)
                        }
                        style={{ width: 130 }}
                      />
                    </td>
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
                        value={row.subject}
                        onChange={(e) =>
                          updateRow(row.id, "subject", e.target.value)
                        }
                        placeholder="Subject"
                        style={{ width: 130 }}
                      />
                    </td>
                    <td>
                      <input
                        value={row.time}
                        onChange={(e) =>
                          updateRow(row.id, "time", e.target.value)
                        }
                        placeholder="9:00 AM - 12:00 PM"
                        style={{ width: 160 }}
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-action"
                        title="Remove"
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
              style={{ marginBottom: 16 }}
            >
              <Plus size={14} style={{ marginRight: 4 }} /> Add Subject
            </button>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowScheduleEditor(false)}
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
            onChange={(e) => setClassId(Number(e.target.value))}
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
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (Roll: {s.rollNo})
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowScheduleEditor(true)}
          >
            <Edit2 size={16} /> Customize
          </button>
          {selectedStudent && (
            <button type="button" className="btn-primary" onClick={printCard}>
              <Printer size={16} /> Print Admit Card
            </button>
          )}
        </div>
        {student && (
          <div className="card admit-preview">
            <div className="ac-header">
              <div className="ac-school">
                {settings.logoUrl && (
                  <img
                    src={settings.logoUrl}
                    style={{ height: 50, objectFit: "contain" }}
                    alt="logo"
                  />
                )}
                <h2>{settings.name}</h2>
                <p>
                  {settings.affiliation} | Est. {settings.yearEstablished}
                </p>
              </div>
              <h3>ADMIT CARD - {examTitle}</h3>
            </div>
            <div className="ac-info">
              <div>
                <strong>Name:</strong> {student.name}
              </div>
              <div>
                <strong>Admission No:</strong> {student.admissionNo}
              </div>
              <div>
                <strong>Class:</strong> {cls?.name} - {cls?.section}
              </div>
              <div>
                <strong>Roll No:</strong> {student.rollNo}
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Day</th>
                  <th>Subject</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((e) => (
                  <tr key={e.id}>
                    <td>{e.date}</td>
                    <td>{e.day}</td>
                    <td>{e.subject}</td>
                    <td>{e.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!student && (
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
