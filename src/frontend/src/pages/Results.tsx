import { Edit2, Plus, Printer, Trash2, X } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import { sampleClasses, sampleStudents } from "../data/sampleData";
import { getSchoolSettings } from "./Settings";

interface SubjectMarks {
  fa1: number; // 10
  sa1: number; // 30
  fa2: number; // 10
  fa3: number; // 10
  sa2: number; // 30
  acbw: number; // 10
}

interface StudentResult {
  studentId: number;
  subject: string;
  marks: SubjectMarks;
}

interface CoScholastic {
  area: string;
  term1: string;
  term2: string;
}

const DEFAULT_SUBJECTS = [
  "HINDI",
  "ENGLISH",
  "MATHS",
  "SCIENCE",
  "SOCIAL STUDIES",
];

const DEFAULT_CO_SCHOLASTIC: CoScholastic[] = [
  { area: "GAME", term1: "A", term2: "B" },
  { area: "CONFIDENCE", term1: "A", term2: "B" },
  { area: "UNIFORM", term1: "A", term2: "B" },
  { area: "DISCIPLINE", term1: "C", term2: "B+" },
  { area: "REGULARITY & PUNCTUALITY", term1: "C", term2: "B+" },
  { area: "P.T", term1: "C", term2: "A+" },
];

const GRADE_SCALE = [
  { min: 91, max: 100, grade: "A1" },
  { min: 81, max: 90, grade: "A2" },
  { min: 71, max: 80, grade: "B1" },
  { min: 61, max: 70, grade: "B2" },
  { min: 51, max: 60, grade: "C1" },
  { min: 41, max: 50, grade: "C2" },
  { min: 33, max: 40, grade: "D" },
  { min: 21, max: 32, grade: "E1" },
  { min: 0, max: 20, grade: "E2" },
];

function calcGrade(pct: number): string {
  for (const g of GRADE_SCALE) {
    if (pct >= g.min && pct <= g.max) return g.grade;
  }
  return "E2";
}

function getDefaultMarks(): SubjectMarks {
  return { fa1: 0, sa1: 0, fa2: 0, fa3: 0, sa2: 0, acbw: 0 };
}

function generateSampleResults(
  students: typeof sampleStudents,
  subjects: string[],
): StudentResult[] {
  const results: StudentResult[] = [];
  for (const s of students) {
    for (const sub of subjects) {
      results.push({
        studentId: s.id,
        subject: sub,
        marks: {
          fa1: Math.floor(Math.random() * 10),
          sa1: Math.floor(Math.random() * 30),
          fa2: Math.floor(Math.random() * 10),
          fa3: Math.floor(Math.random() * 10),
          sa2: Math.floor(Math.random() * 30),
          acbw: Math.floor(Math.random() * 10),
        },
      });
    }
  }
  return results;
}

const initialResults = generateSampleResults(sampleStudents, DEFAULT_SUBJECTS);

export default function Results() {
  const settings = getSchoolSettings();
  const [classId, setClassId] = useState(1);
  const [examName, setExamName] = useState("Annual Exam 2024-25");
  const [academicSession, setAcademicSession] = useState("2024-25");
  const [results, setResults] = useState<StudentResult[]>(initialResults);
  const [subjects, setSubjects] = useState<string[]>(DEFAULT_SUBJECTS);
  const [coScholastic, setCoScholastic] = useState<CoScholastic[]>(
    DEFAULT_CO_SCHOLASTIC,
  );
  const [printStudent, setPrintStudent] = useState<number | null>(null);
  const [showSubjectEditor, setShowSubjectEditor] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [editSubjectIdx, setEditSubjectIdx] = useState<number | null>(null);
  const [editSubjectVal, setEditSubjectVal] = useState("");
  const [editStudent, setEditStudent] = useState<number | null>(null);
  const [editMarks, setEditMarks] = useState<Record<string, SubjectMarks>>({});
  const [teacherRemarks, setTeacherRemarks] = useState(
    "Good performance. Keep it up!",
  );
  const [promotedTo, setPromotedTo] = useState("");
  const [reopenDate, setReopenDate] = useState("");
  const [showCustomize, setShowCustomize] = useState(false);

  const students = sampleStudents.filter((s) => s.classId === classId);
  const cls = sampleClasses.find((c) => c.id === classId);

  const getResult = (sid: number, subj: string): StudentResult | undefined =>
    results.find((r) => r.studentId === sid && r.subject === subj);

  const getMarks = (sid: number, subj: string): SubjectMarks =>
    getResult(sid, subj)?.marks ?? getDefaultMarks();

  const term1Total = (m: SubjectMarks) => m.fa1 + m.sa1 + m.fa2;
  const term2Total = (m: SubjectMarks) => m.fa3 + m.sa2 + m.acbw;
  const grandTotal = (m: SubjectMarks) => term1Total(m) + term2Total(m);

  const studentGrandTotal = (sid: number) =>
    subjects.reduce((acc, sub) => acc + grandTotal(getMarks(sid, sub)), 0);

  const maxGrandTotal = subjects.length * 100;

  const studentPct = (sid: number) =>
    maxGrandTotal > 0
      ? Math.round((studentGrandTotal(sid) / maxGrandTotal) * 100)
      : 0;

  const openEdit = (sid: number) => {
    const marks: Record<string, SubjectMarks> = {};
    for (const sub of subjects) {
      marks[sub] = { ...getMarks(sid, sub) };
    }
    setEditMarks(marks);
    setEditStudent(sid);
  };

  const saveEdit = () => {
    if (editStudent === null) return;
    const updated = results.filter((r) => r.studentId !== editStudent);
    for (const sub of subjects) {
      updated.push({
        studentId: editStudent,
        subject: sub,
        marks: editMarks[sub] ?? getDefaultMarks(),
      });
    }
    setResults(updated);
    setEditStudent(null);
  };

  const printCard = (sid: number) => {
    setPrintStudent(sid);
    setTimeout(() => {
      window.print();
      setPrintStudent(null);
    }, 100);
  };

  const addSubject = () => {
    const name = newSubjectName.trim().toUpperCase();
    if (name && !subjects.includes(name)) {
      setSubjects([...subjects, name]);
      setNewSubjectName("");
    }
  };

  const removeSubject = (idx: number) =>
    setSubjects(subjects.filter((_, i) => i !== idx));

  const startEditSubject = (idx: number) => {
    setEditSubjectIdx(idx);
    setEditSubjectVal(subjects[idx]);
  };

  const saveEditSubject = () => {
    if (editSubjectIdx === null) return;
    const val = editSubjectVal.trim().toUpperCase();
    if (val) {
      const updated = [...subjects];
      updated[editSubjectIdx] = val;
      setSubjects(updated);
    }
    setEditSubjectIdx(null);
  };

  const ps = printStudent
    ? sampleStudents.find((s) => s.id === printStudent)
    : null;
  const editStudentObj = editStudent
    ? sampleStudents.find((s) => s.id === editStudent)
    : null;

  return (
    <div className="page">
      <Header title="Results" />

      {/* ===== PRINT REPORT CARD ===== */}
      {ps && (
        <div
          className="print-only"
          style={{
            fontFamily: "Arial, sans-serif",
            fontSize: 12,
            color: "#000",
            background: "#fff",
            padding: 20,
          }}
        >
          {/* Header */}
          <div style={{ border: "2px solid #000", borderBottom: "none" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 16px",
                borderBottom: "1px solid #000",
              }}
            >
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  style={{
                    height: 80,
                    width: 80,
                    objectFit: "contain",
                    marginRight: 16,
                  }}
                  alt="logo"
                />
              )}
              <div style={{ flex: 1, textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  {settings.name || "SCHOOL NAME HERE"}
                </div>
                <div style={{ fontSize: 12, marginTop: 2 }}>
                  {settings.affiliation || "School Address Here"}
                </div>
                <div style={{ fontSize: 11, marginTop: 1 }}>
                  Ph: N/A | Email: {settings.email || "N/A"}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color: "#c00",
                    marginTop: 2,
                  }}
                >
                  Academic Session: {academicSession}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    marginTop: 4,
                    letterSpacing: 2,
                    borderTop: "1px solid #000",
                    paddingTop: 4,
                  }}
                >
                  REPORT CARD
                </div>
              </div>
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  style={{
                    height: 80,
                    width: 80,
                    objectFit: "contain",
                    marginLeft: 16,
                    opacity: 0.6,
                  }}
                  alt="seal"
                />
              )}
            </div>

            {/* Class / Session Row */}
            <div style={{ display: "flex", borderBottom: "1px solid #000" }}>
              <div
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  fontWeight: "bold",
                  background: "#f0f0f0",
                  borderRight: "1px solid #000",
                }}
              >
                Class : {cls?.name} {cls?.section}
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "6px 10px",
                  fontWeight: "bold",
                  background: "#f0f0f0",
                  textAlign: "right",
                }}
              >
                Exam : {examName}
              </div>
            </div>

            {/* Student Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                borderBottom: "1px solid #000",
              }}
            >
              <div
                style={{ padding: "4px 10px", borderRight: "1px solid #aaa" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 130,
                    fontWeight: 600,
                  }}
                >
                  NAME OF STUDENT
                </span>{" "}
                : {ps.name}
              </div>
              <div style={{ padding: "4px 10px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 130,
                    fontWeight: 600,
                  }}
                >
                  ROLL NO.
                </span>{" "}
                : {ps.rollNo}
              </div>
              <div
                style={{ padding: "4px 10px", borderRight: "1px solid #aaa" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 130,
                    fontWeight: 600,
                  }}
                >
                  FATHER'S NAME
                </span>{" "}
                : {ps.fatherName || "N/A"}
              </div>
              <div style={{ padding: "4px 10px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 130,
                    fontWeight: 600,
                  }}
                >
                  DATE OF BIRTH
                </span>{" "}
                : {ps.dob || "N/A"}
              </div>
              <div
                style={{ padding: "4px 10px", borderRight: "1px solid #aaa" }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 130,
                    fontWeight: 600,
                  }}
                >
                  MOTHER'S NAME
                </span>{" "}
                : {ps.motherName || "N/A"}
              </div>
              <div style={{ padding: "4px 10px" }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 130,
                    fontWeight: 600,
                  }}
                >
                  ATTENDANCE
                </span>{" "}
                : {"N/A"}
              </div>
              <div
                style={{
                  padding: "4px 10px",
                  gridColumn: "1 / -1",
                  borderTop: "1px solid #aaa",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 130,
                    fontWeight: 600,
                  }}
                >
                  ADDRESS
                </span>{" "}
                : {ps.address || "N/A"}
              </div>
            </div>

            {/* Marks Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              }}
            >
              <thead>
                <tr style={{ background: "#ddd" }}>
                  <th
                    rowSpan={3}
                    style={{
                      border: "1px solid #000",
                      padding: "4px 6px",
                      width: 120,
                    }}
                  >
                    Scholastic
                  </th>
                  <th
                    colSpan={4}
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      background: "#cde",
                    }}
                  >
                    Term I (50)
                  </th>
                  <th
                    colSpan={4}
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      background: "#dce",
                    }}
                  >
                    Term II (50)
                  </th>
                  <th
                    colSpan={2}
                    style={{
                      border: "1px solid #000",
                      padding: "4px",
                      background: "#edc",
                    }}
                  >
                    Overall
                  </th>
                </tr>
                <tr style={{ background: "#eee" }}>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    FA-1
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    SA-1
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    FA-2
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    Total
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    FA-3
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    SA-2
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    AC+BW
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    Total
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    Grand Total
                  </th>
                  <th style={{ border: "1px solid #000", padding: "3px 4px" }}>
                    Grade
                  </th>
                </tr>
                <tr
                  style={{ background: "#f5f5f5", fontSize: 10, color: "#555" }}
                >
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    10
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    30
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    10
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    50
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    10
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    30
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    10
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    50
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }}>
                    100
                  </th>
                  <th style={{ border: "1px solid #000", padding: "2px" }} />
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => {
                  const m = getMarks(ps.id, sub);
                  const t1 = term1Total(m);
                  const t2 = term2Total(m);
                  const gt = grandTotal(m);
                  const pct = gt;
                  const grade = calcGrade(pct);
                  return (
                    <tr key={sub}>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px 6px",
                          fontWeight: 600,
                        }}
                      >
                        {sub}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {m.fa1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {m.sa1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {m.fa2}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {t1}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {m.fa3}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {m.sa2}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                        }}
                      >
                        {m.acbw}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {t2}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {gt}
                      </td>
                      <td
                        style={{
                          border: "1px solid #000",
                          padding: "4px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      >
                        {grade}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Overall Summary */}
            {(() => {
              const tot = studentGrandTotal(ps.id);
              const maxTot = subjects.length * 100;
              const pct = maxTot > 0 ? Math.round((tot / maxTot) * 100) : 0;
              return (
                <div
                  style={{
                    display: "flex",
                    border: "1px solid #000",
                    borderTop: "none",
                    background: "#f9f9f9",
                  }}
                >
                  <div
                    style={{
                      flex: 2,
                      padding: "8px 12px",
                      fontWeight: "bold",
                      fontSize: 14,
                      borderRight: "1px solid #000",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    OVERALL MARKS{" "}
                    <span
                      style={{
                        border: "1px solid #000",
                        padding: "3px 12px",
                        background: "#fff",
                      }}
                    >
                      {tot}/{maxTot}
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 2,
                      padding: "8px 12px",
                      fontWeight: "bold",
                      fontSize: 14,
                      borderRight: "1px solid #000",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    PERCENTAGE{" "}
                    <span
                      style={{
                        border: "1px solid #000",
                        padding: "3px 12px",
                        background: "#fff",
                      }}
                    >
                      {pct} %
                    </span>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontWeight: "bold",
                      fontSize: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    RESULT{" "}
                    <span
                      style={{
                        border: "1px solid #000",
                        padding: "3px 12px",
                        background: pct >= 33 ? "#e0f5e0" : "#fde",
                        color: pct >= 33 ? "green" : "red",
                      }}
                    >
                      {pct >= 33 ? "Pass" : "Fail"}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Co-Scholastic Areas */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
                marginTop: 0,
              }}
            >
              <thead>
                <tr style={{ background: "#eee" }}>
                  <th
                    colSpan={3}
                    style={{
                      border: "1px solid #000",
                      padding: "5px 8px",
                      textAlign: "left",
                    }}
                  >
                    Co-Scholastic Areas : (5 Points Grading Scale A,A+,B,B+,C)
                  </th>
                  <th style={{ border: "1px solid #000", padding: "5px 8px" }}>
                    Term I
                  </th>
                  <th style={{ border: "1px solid #000", padding: "5px 8px" }}>
                    Term II
                  </th>
                </tr>
              </thead>
              <tbody>
                {coScholastic.map((co) => (
                  <tr key={co.area}>
                    <td
                      colSpan={3}
                      style={{
                        border: "1px solid #000",
                        padding: "5px 10px",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {co.area}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {co.term1}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "5px",
                        textAlign: "center",
                      }}
                    >
                      {co.term2}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f0f0f0", fontSize: 10 }}>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    A+ = Excellent
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    A = Very Good
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    B+ = Average Result
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    B = Need Encouragement
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    C = Need Attention
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Attendance Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 11,
              }}
            >
              <thead>
                <tr style={{ background: "#eee" }}>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "5px 8px",
                      textAlign: "left",
                    }}
                  >
                    ATTENDANCE:
                  </th>
                  <th
                    colSpan={2}
                    style={{ border: "1px solid #000", padding: "5px 8px" }}
                  >
                    TERM I
                  </th>
                  <th
                    colSpan={2}
                    style={{ border: "1px solid #000", padding: "5px 8px" }}
                  >
                    TERM II
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 8px",
                      fontWeight: 600,
                    }}
                  >
                    TOTAL WORKING DAYS:
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      border: "1px solid #000",
                      padding: "4px 8px",
                      textAlign: "center",
                    }}
                  >
                    100
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      border: "1px solid #000",
                      padding: "4px 8px",
                      textAlign: "center",
                    }}
                  >
                    100
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 8px",
                      fontWeight: 600,
                    }}
                  >
                    TOTAL ATTENDANCE:
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      border: "1px solid #000",
                      padding: "4px 8px",
                      textAlign: "center",
                    }}
                  >
                    80
                  </td>
                  <td
                    colSpan={2}
                    style={{
                      border: "1px solid #000",
                      padding: "4px 8px",
                      textAlign: "center",
                    }}
                  >
                    85
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Promoted / Reopen */}
            <div
              style={{
                padding: "8px 12px",
                borderTop: "1px solid #000",
                fontSize: 12,
              }}
            >
              Promoted to Class :{" "}
              <strong>{promotedTo || "____________"}</strong>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; SCHOOL WILL RE-OPEN ON :{" "}
              <strong>
                {reopenDate || ".................................."}
              </strong>
            </div>

            {/* Remarks & Signatures */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderTop: "1px solid #000",
              }}
            >
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px 12px",
                      width: "30%",
                      fontWeight: "bold",
                      verticalAlign: "top",
                    }}
                  >
                    CLASS TEACHER'S REMARKS
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px 12px",
                      verticalAlign: "top",
                    }}
                  >
                    {teacherRemarks}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "12px",
                      verticalAlign: "bottom",
                    }}
                  >
                    <div style={{ fontSize: 20, fontWeight: "bold" }}>DATE</div>
                    <div
                      style={{
                        fontSize: 12,
                        borderBottom: "1px dashed #000",
                        paddingBottom: 2,
                      }}
                    >
                      {new Date().toLocaleDateString("en-IN")}
                    </div>
                  </td>
                  <td style={{ border: "1px solid #000", padding: "8px 12px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        height: 70,
                      }}
                    >
                      <div style={{ textAlign: "center" }}>
                        <div style={{ height: 40 }} />
                        <div
                          style={{
                            borderTop: "1px solid #000",
                            paddingTop: 4,
                            fontWeight: 600,
                          }}
                        >
                          SIGNATURE OF CLASS TEACHER
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        {settings.signatureUrl ? (
                          <img
                            src={settings.signatureUrl}
                            style={{ height: 40, objectFit: "contain" }}
                            alt="sign"
                          />
                        ) : (
                          <div style={{ height: 40 }} />
                        )}
                        <div
                          style={{
                            borderTop: "1px solid #000",
                            paddingTop: 4,
                            fontWeight: 600,
                          }}
                        >
                          SIGNATURE OF PRINCIPAL
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Rules */}
          <div style={{ marginTop: 16, fontSize: 11 }}>
            <div style={{ fontWeight: "bold", marginBottom: 6 }}>Rules:</div>
            <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
              <li>
                The students are expected to keep this card neat and clean.
              </li>
              <li>
                In case the card is lost the duplicate card will be issued on
                payment of extra report card fee.
              </li>
              <li>
                Promotion will be granted on the weight of both examinations. To
                pass the monthly tests is also compulsory.
              </li>
              <li>
                For any complaint at any point, kindly contact personally.
              </li>
            </ol>
          </div>

          {/* Grading Scale */}
          <div style={{ marginTop: 14, fontSize: 11 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>
              Instructions
            </div>
            <div style={{ marginBottom: 4 }}>
              Grading scale for scholastic areas: Grades are awarded on a
              8-point grading scale as follows-
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr style={{ background: "#ddd" }}>
                  <th style={{ border: "1px solid #000", padding: "4px 8px" }}>
                    Marks Range in (%)
                  </th>
                  {GRADE_SCALE.map((g) => (
                    <th
                      key={g.grade}
                      style={{ border: "1px solid #000", padding: "4px 6px" }}
                    >
                      {g.min}-{g.max}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "4px 8px",
                      fontWeight: "bold",
                    }}
                  >
                    Grade
                  </td>
                  {GRADE_SCALE.map((g) => (
                    <td
                      key={g.grade}
                      style={{
                        border: "1px solid #000",
                        padding: "4px 6px",
                        fontWeight: "bold",
                      }}
                    >
                      {g.grade}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== SUBJECT EDITOR MODAL ===== */}
      {showSubjectEditor && (
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
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              minWidth: 380,
              maxWidth: 480,
              width: "90%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Subjects Manage Karen</h3>
              <button
                type="button"
                onClick={() => setShowSubjectEditor(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            {subjects.map((sub, idx) => (
              <div
                key={sub}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  padding: "6px 10px",
                  border: "1px solid #eee",
                  borderRadius: 8,
                }}
              >
                {editSubjectIdx === idx ? (
                  <>
                    <input
                      value={editSubjectVal}
                      onChange={(e) => setEditSubjectVal(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEditSubject()}
                      style={{
                        flex: 1,
                        padding: "4px 8px",
                        border: "1px solid #ddd",
                        borderRadius: 6,
                      }}
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={saveEditSubject}
                      style={{ padding: "4px 12px", fontSize: 12 }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setEditSubjectIdx(null)}
                      style={{ padding: "4px 10px", fontSize: 12 }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, fontSize: 14 }}>{sub}</span>
                    <button
                      type="button"
                      className="icon-action"
                      onClick={() => startEditSubject(idx)}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      className="icon-action"
                      onClick={() => removeSubject(idx)}
                      style={{ color: "#e53e3e" }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, margin: "16px 0" }}>
              <input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSubject()}
                placeholder="Naya subject naam"
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={addSubject}
              >
                <Plus size={14} style={{ marginRight: 4 }} />
                Add
              </button>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: "100%" }}
              onClick={() => setShowSubjectEditor(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ===== CUSTOMIZE MODAL ===== */}
      {showCustomize && (
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
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              minWidth: 420,
              maxWidth: 560,
              width: "90%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Report Card Customize</h3>
              <button
                type="button"
                onClick={() => setShowCustomize(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="cust-exam">Exam Name</label>
              <input
                id="cust-exam"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label htmlFor="cust-session">Academic Session</label>
              <input
                value={academicSession}
                onChange={(e) => setAcademicSession(e.target.value)}
                placeholder="e.g. 2024-25"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label htmlFor="cust-promoted">Promoted to Class</label>
              <input
                value={promotedTo}
                onChange={(e) => setPromotedTo(e.target.value)}
                placeholder="e.g. Class 2"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label htmlFor="cust-reopen">School Re-open Date</label>
              <input
                value={reopenDate}
                onChange={(e) => setReopenDate(e.target.value)}
                placeholder="e.g. 01-07-2025"
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              />
            </div>
            <div className="form-group" style={{ marginTop: 12 }}>
              <label htmlFor="cust-remarks">Teacher Remarks (default)</label>
              <textarea
                value={teacherRemarks}
                onChange={(e) => setTeacherRemarks(e.target.value)}
                rows={3}
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #ddd",
                  borderRadius: 8,
                  resize: "vertical",
                }}
              />
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Co-Scholastic Areas
              </div>
              {coScholastic.map((co, idx) => (
                <div
                  key={co.area}
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginTop: 8,
                  }}
                >
                  <input
                    value={co.area}
                    onChange={(e) => {
                      const u = [...coScholastic];
                      u[idx] = { ...u[idx], area: e.target.value };
                      setCoScholastic(u);
                    }}
                    style={{
                      flex: 2,
                      padding: "5px 8px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      fontSize: 12,
                    }}
                  />
                  <input
                    value={co.term1}
                    onChange={(e) => {
                      const u = [...coScholastic];
                      u[idx] = { ...u[idx], term1: e.target.value };
                      setCoScholastic(u);
                    }}
                    placeholder="T1"
                    style={{
                      width: 50,
                      padding: "5px 8px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      textAlign: "center",
                    }}
                  />
                  <input
                    value={co.term2}
                    onChange={(e) => {
                      const u = [...coScholastic];
                      u[idx] = { ...u[idx], term2: e.target.value };
                      setCoScholastic(u);
                    }}
                    placeholder="T2"
                    style={{
                      width: 50,
                      padding: "5px 8px",
                      border: "1px solid #ddd",
                      borderRadius: 6,
                      textAlign: "center",
                    }}
                  />
                  <button
                    type="button"
                    className="icon-action"
                    onClick={() =>
                      setCoScholastic(coScholastic.filter((_, i) => i !== idx))
                    }
                    style={{ color: "#e53e3e" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: 8 }}
                onClick={() =>
                  setCoScholastic([
                    ...coScholastic,
                    { area: "NEW AREA", term1: "A", term2: "A" },
                  ])
                }
              >
                <Plus size={14} /> Add Area
              </button>
            </div>
            <button
              type="button"
              className="btn-primary"
              style={{ width: "100%", marginTop: 20 }}
              onClick={() => setShowCustomize(false)}
            >
              Save & Close
            </button>
          </div>
        </div>
      )}

      {/* ===== EDIT MARKS MODAL ===== */}
      {editStudent !== null && editStudentObj && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              minWidth: 560,
              maxWidth: 700,
              width: "95%",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3 style={{ margin: 0 }}>Edit Marks: {editStudentObj.name}</h3>
              <button
                type="button"
                onClick={() => setEditStudent(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr style={{ background: "#f5f5f5" }}>
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "left",
                      border: "1px solid #ddd",
                    }}
                  >
                    Subject
                  </th>
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      background: "#cde",
                    }}
                  >
                    FA-1
                    <br />
                    <span style={{ fontSize: 10, color: "#666" }}>/10</span>
                  </th>
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      background: "#cde",
                    }}
                  >
                    SA-1
                    <br />
                    <span style={{ fontSize: 10, color: "#666" }}>/30</span>
                  </th>
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      background: "#cde",
                    }}
                  >
                    FA-2
                    <br />
                    <span style={{ fontSize: 10, color: "#666" }}>/10</span>
                  </th>
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      background: "#dce",
                    }}
                  >
                    FA-3
                    <br />
                    <span style={{ fontSize: 10, color: "#666" }}>/10</span>
                  </th>
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      background: "#dce",
                    }}
                  >
                    SA-2
                    <br />
                    <span style={{ fontSize: 10, color: "#666" }}>/30</span>
                  </th>
                  <th
                    style={{
                      padding: "6px 8px",
                      textAlign: "center",
                      border: "1px solid #ddd",
                      background: "#dce",
                    }}
                  >
                    AC+BW
                    <br />
                    <span style={{ fontSize: 10, color: "#666" }}>/10</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((sub) => (
                  <tr key={sub} style={{ borderBottom: "1px solid #eee" }}>
                    <td
                      style={{
                        padding: "6px 8px",
                        border: "1px solid #ddd",
                        fontWeight: 600,
                      }}
                    >
                      {sub}
                    </td>
                    {(
                      [
                        "fa1",
                        "sa1",
                        "fa2",
                        "fa3",
                        "sa2",
                        "acbw",
                      ] as (keyof SubjectMarks)[]
                    ).map((key) => (
                      <td
                        key={key}
                        style={{ padding: "4px 6px", border: "1px solid #ddd" }}
                      >
                        <input
                          type="number"
                          min={0}
                          max={key === "sa1" || key === "sa2" ? 30 : 10}
                          value={editMarks[sub]?.[key] ?? 0}
                          onChange={(e) =>
                            setEditMarks((prev) => ({
                              ...prev,
                              [sub]: {
                                ...(prev[sub] ?? getDefaultMarks()),
                                [key]: Number(e.target.value),
                              },
                            }))
                          }
                          style={{
                            width: "100%",
                            padding: "4px",
                            border: "1px solid #ddd",
                            borderRadius: 4,
                            textAlign: "center",
                            fontSize: 12,
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 20,
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditStudent(null)}
              >
                Cancel
              </button>
              <button type="button" className="btn-primary" onClick={saveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MAIN TABLE ===== */}
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
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowCustomize(true)}
          >
            <Edit2 size={16} /> Customize
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowSubjectEditor(true)}
          >
            <Plus size={16} /> Subjects
          </button>
        </div>
        <div className="card">
          <table className="data-table" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                <th>Student</th>
                {subjects.map((s) => (
                  <th key={s}>{s}</th>
                ))}
                <th>Total</th>
                <th>%</th>
                <th>Result</th>
                <th>Edit</th>
                <th>Print</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => {
                const tot = studentGrandTotal(s.id);
                const pct = studentPct(s.id);
                return (
                  <tr key={s.id}>
                    <td className="font-medium">{s.name}</td>
                    {subjects.map((sub) => {
                      const m = getMarks(s.id, sub);
                      return <td key={sub}>{grandTotal(m)}/100</td>;
                    })}
                    <td>
                      <strong>
                        {tot}/{maxGrandTotal}
                      </strong>
                    </td>
                    <td>{pct}%</td>
                    <td
                      style={{
                        color: pct >= 33 ? "green" : "red",
                        fontWeight: 600,
                      }}
                    >
                      {pct >= 33 ? "Pass" : "Fail"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-action"
                        onClick={() => openEdit(s.id)}
                        title="Edit marks"
                      >
                        <Edit2 size={15} />
                      </button>
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
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
