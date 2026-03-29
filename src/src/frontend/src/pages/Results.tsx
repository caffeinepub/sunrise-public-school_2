import { Plus, Printer } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import {
  type SResult,
  sampleClasses,
  sampleResults,
  sampleStudents,
} from "../data/sampleData";
import { getSchoolSettings } from "./Settings";

const subjects = [
  "Mathematics",
  "Science",
  "English",
  "Hindi",
  "Social Studies",
];

export default function Results() {
  const settings = getSchoolSettings();
  const [classId, setClassId] = useState(1);
  const [examName, setExamName] = useState("Mid Term");
  const [results, setResults] = useState<SResult[]>(sampleResults);
  const [printStudent, setPrintStudent] = useState<number | null>(null);
  const [form, setForm] = useState({
    studentId: 1,
    subject: subjects[0],
    marksObtained: 0,
    totalMarks: 100,
  });
  const [showAdd, setShowAdd] = useState(false);

  const students = sampleStudents.filter((s) => s.classId === classId);
  const cls = sampleClasses.find((c) => c.id === classId);

  const getResult = (sid: number, subj: string) =>
    results.find(
      (r) =>
        r.studentId === sid && r.subject === subj && r.examName === examName,
    );

  const calcTotal = (sid: number) =>
    results
      .filter((r) => r.studentId === sid && r.examName === examName)
      .reduce((a, r) => a + r.marksObtained, 0);

  const addResult = () => {
    setResults([...results, { ...form, examName }]);
    setShowAdd(false);
  };

  const printCard = (sid: number) => {
    setPrintStudent(sid);
    setTimeout(() => {
      window.print();
      setPrintStudent(null);
    }, 100);
  };

  const ps = printStudent
    ? sampleStudents.find((s) => s.id === printStudent)
    : null;
  const psResults = ps
    ? results.filter((r) => r.studentId === ps.id && r.examName === examName)
    : [];
  const psTotal = psResults.reduce((a, r) => a + r.marksObtained, 0);
  const psMax = psResults.reduce((a, r) => a + r.totalMarks, 0);

  return (
    <div className="page">
      <Header title="Results" />
      {ps && (
        <div className="print-only printable report-card">
          <div className="rc-header">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                style={{ height: 60, objectFit: "contain" }}
                alt="logo"
              />
            )}
            <h2>{settings.name}</h2>
            <p>
              {settings.affiliation} | Est. {settings.yearEstablished} |{" "}
              {settings.email}
            </p>
            <h3>Report Card - {examName}</h3>
          </div>
          <div className="rc-info">
            <div>
              <strong>Name:</strong> {ps.name}
            </div>
            <div>
              <strong>Adm No:</strong> {ps.admissionNo}
            </div>
            <div>
              <strong>Class:</strong> {cls?.name} {cls?.section}
            </div>
            <div>
              <strong>Roll:</strong> {ps.rollNo}
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Marks Obtained</th>
                <th>Total Marks</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {psResults.map((r) => (
                <tr key={r.subject}>
                  <td>{r.subject}</td>
                  <td>{r.marksObtained}</td>
                  <td>{r.totalMarks}</td>
                  <td>
                    {r.marksObtained >= 90
                      ? "A+"
                      : r.marksObtained >= 80
                        ? "A"
                        : r.marksObtained >= 70
                          ? "B"
                          : r.marksObtained >= 60
                            ? "C"
                            : "D"}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{psTotal}</strong>
                </td>
                <td>
                  <strong>{psMax}</strong>
                </td>
                <td>
                  <strong>
                    {psMax > 0 ? Math.round((psTotal / psMax) * 100) : 0}%
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
          <div className="rc-footer">
            <div>Teacher Signature: ___________</div>
            <div>
              Principal Signature:{" "}
              {settings.signatureUrl ? (
                <img
                  src={settings.signatureUrl}
                  style={{
                    height: 40,
                    objectFit: "contain",
                    verticalAlign: "middle",
                  }}
                  alt="signature"
                />
              ) : (
                "___________"
              )}
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
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="select-input"
          >
            {["Mid Term", "Final Exam", "Unit Test"].map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowAdd(!showAdd)}
          >
            <Plus size={16} /> Add Result
          </button>
        </div>
        {showAdd && (
          <div className="card form-card">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="res-student">Student</label>
                <select
                  id="res-student"
                  value={form.studentId}
                  onChange={(e) =>
                    setForm({ ...form, studentId: Number(e.target.value) })
                  }
                  className="select-input"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="res-subject">Subject</label>
                <select
                  id="res-subject"
                  value={form.subject}
                  onChange={(e) =>
                    setForm({ ...form, subject: e.target.value })
                  }
                  className="select-input"
                >
                  {subjects.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="res-marks">Marks Obtained</label>
                <input
                  id="res-marks"
                  type="number"
                  value={form.marksObtained}
                  onChange={(e) =>
                    setForm({ ...form, marksObtained: Number(e.target.value) })
                  }
                />
              </div>
              <div className="form-group">
                <label htmlFor="res-total">Total Marks</label>
                <input
                  id="res-total"
                  type="number"
                  value={form.totalMarks}
                  onChange={(e) =>
                    setForm({ ...form, totalMarks: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-primary" onClick={addResult}>
                Save Result
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                {subjects.map((s) => (
                  <th key={s}>{s}</th>
                ))}
                <th>Total</th>
                <th>%</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="font-medium">{s.name}</td>
                  {subjects.map((sub) => (
                    <td key={sub}>
                      {getResult(s.id, sub)?.marksObtained ?? "-"}
                    </td>
                  ))}
                  <td>
                    <strong>{calcTotal(s.id)}</strong>
                  </td>
                  <td>
                    {Math.round(
                      (calcTotal(s.id) / (subjects.length * 100)) * 100,
                    )}
                    %
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-action"
                      onClick={() => printCard(s.id)}
                    >
                      <Printer size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
