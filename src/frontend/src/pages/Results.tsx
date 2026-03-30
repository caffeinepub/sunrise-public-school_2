import {
  Edit2,
  FileSpreadsheet,
  Lock,
  Plus,
  Printer,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
// XLSX loaded via CDN in index.html
declare const XLSX: {
  utils: {
    book_new: () => unknown;
    aoa_to_sheet: (data: unknown[][]) => { "!cols"?: unknown[] };
    book_append_sheet: (wb: unknown, ws: unknown, name: string) => void;
    sheet_to_json: <T>(ws: unknown, opts?: { defval?: unknown }) => T[];
  };
  writeFile: (wb: unknown, name: string) => void;
  read: (
    data: Uint8Array,
    opts: { type: string },
  ) => { SheetNames: string[]; Sheets: Record<string, unknown> };
};
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

const DEFAULT_TEMPLATE_COLUMNS = [
  { key: "roll_no", label: "Roll Number", enabled: true },
  { key: "subject", label: "Subject", enabled: true },
  { key: "half_yearly", label: "Half Yearly", enabled: true },
  { key: "annual", label: "Annual", enabled: true },
  { key: "max_marks", label: "Maximum Marks", enabled: true },
  { key: "obtain_marks", label: "Obtain Marks", enabled: true },
  { key: "total", label: "Total", enabled: true },
  { key: "grade", label: "Grade", enabled: true },
  { key: "remark", label: "Remark", enabled: true },
  { key: "sport", label: "Sport", enabled: true },
  { key: "skill", label: "Skill", enabled: true },
  { key: "computer", label: "Computer", enabled: true },
  { key: "urdu_sanskrit", label: "Urdu/Sanskrit", enabled: true },
  { key: "pt", label: "PT", enabled: true },
];

function getTemplateColumns() {
  try {
    const stored = localStorage.getItem("excelTemplateColumns");
    if (stored) return JSON.parse(stored);
  } catch {}
  return DEFAULT_TEMPLATE_COLUMNS;
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
  const [showImportExcel, setShowImportExcel] = useState(false);
  const [showAdminTemplateModal, setShowAdminTemplateModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState("");
  const [adminPinError, setAdminPinError] = useState("");
  const [adminVerified, setAdminVerified] = useState(
    () => localStorage.getItem("adminSessionActive") === "true",
  );
  const [templateColumns, setTemplateColumns] =
    useState<{ key: string; label: string; enabled: boolean }[]>(
      getTemplateColumns,
    );
  const [showTemplateConfigure, setShowTemplateConfigure] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importPreview, setImportPreview] = useState<Record<string, unknown>[]>(
    [],
  );
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const [importedExtras, setImportedExtras] = useState<
    Record<
      number,
      {
        remark?: string;
        sport?: string;
        skill?: string;
        computer?: string;
        urdu_sanskrit?: string;
        pt?: string;
      }
    >
  >({});
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      {/* ===== IMPORT EXCEL MODAL ===== */}
      {showImportExcel && (
        // biome-ignore lint/a11y/useKeyWithClickEvents: modal overlay
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
          onClick={() => setShowImportExcel(false)}
          data-ocid="results.modal"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              width: "min(700px, 95vw)",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FileSpreadsheet size={20} /> Excel se Result Import Karen
              </h3>
              <button
                type="button"
                onClick={() => setShowImportExcel(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                }}
                data-ocid="results.close_button"
              >
                <X size={20} />
              </button>
            </div>

            <div
              style={{
                background: "#f0f7ff",
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
                fontSize: 13,
                color: "#1a5276",
              }}
            >
              <strong>📋 Excel File Format (Expected Columns):</strong>
              <div style={{ marginTop: 6, lineHeight: 1.8 }}>
                <strong>Roll Number</strong> (required) |{" "}
                <strong>Subject</strong> (required) |{" "}
                <strong>Half Yearly</strong> | <strong>Annual</strong> |{" "}
                <strong>Maximum Marks</strong> | <strong>Obtain Marks</strong> |{" "}
                <strong>Total</strong> | <strong>Grade</strong> |{" "}
                <strong>Remark</strong> | <strong>Sport</strong> |{" "}
                <strong>Skill</strong> | <strong>Computer</strong> |{" "}
                <strong>Urdu/Sanskrit</strong> | <strong>PT</strong>
              </div>
              <div style={{ marginTop: 6, color: "#7d6608" }}>
                ⚠️ Roll Number class ke students ke roll numbers se match karna
                chahiye.
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 16,
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  const enabledCols = templateColumns.filter((c) => c.enabled);
                  const headerRow = enabledCols.map((c) => c.label);
                  const sampleValues: Record<string, unknown> = {
                    roll_no: students[0]?.rollNo ?? 1,
                    subject: "HINDI",
                    half_yearly: 40,
                    annual: 60,
                    max_marks: 100,
                    obtain_marks: 78,
                    total: 78,
                    grade: "B1",
                    remark: "Pass",
                    sport: "A",
                    skill: "B",
                    computer: 85,
                    urdu_sanskrit: 72,
                    pt: "A",
                  };
                  const wsData = [
                    headerRow,
                    ...students.map((s) =>
                      enabledCols.map((c) =>
                        c.key === "roll_no"
                          ? s.rollNo
                          : (sampleValues[c.key] ?? ""),
                      ),
                    ),
                  ];
                  const wb = XLSX.utils.book_new();
                  const ws = XLSX.utils.aoa_to_sheet(wsData);
                  ws["!cols"] = wsData[0].map(() => ({ wch: 15 }));
                  XLSX.utils.book_append_sheet(wb, ws, "Results");
                  XLSX.writeFile(wb, "sample_result_template.xlsx");
                }}
                data-ocid="results.secondary_button"
              >
                📥 Sample Template Download Karen
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminPinInput("");
                  setAdminPinError("");
                  if (adminVerified) {
                    setTemplateColumns(getTemplateColumns());
                    setShowTemplateConfigure(true);
                  } else {
                    setShowAdminTemplateModal(true);
                  }
                }}
                data-ocid="results.admin_template.open_modal_button"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #D97706",
                  background: "#FFFBEB",
                  color: "#92400E",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                }}
              >
                <Lock size={14} /> Admin: Template Customize Karen
              </button>
              <label
                className="btn-primary"
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                data-ocid="results.upload_button"
              >
                <Upload size={15} /> Excel File Choose Karen
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImportFile(file);
                    setImportError("");
                    setImportSuccess("");
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      try {
                        const data = new Uint8Array(
                          evt.target?.result as ArrayBuffer,
                        );
                        const wb = XLSX.read(data, { type: "array" });
                        const ws = wb.Sheets[wb.SheetNames[0]];
                        const rows = XLSX.utils.sheet_to_json<
                          Record<string, unknown>
                        >(ws, { defval: "" });
                        if (rows.length === 0) {
                          setImportError("File mein koi data nahi mila.");
                          return;
                        }
                        const required: string[] = ["Roll Number", "Subject"];
                        const missing = required.filter(
                          (c) => !(c in (rows[0] as object)),
                        );
                        if (missing.length > 0) {
                          setImportError(
                            `Required columns nahi milein: ${missing.join(", ")}`,
                          );
                          return;
                        }
                        setImportPreview(rows.slice(0, 10));
                        setImportError("");
                      } catch {
                        setImportError(
                          "File parse karne mein error aayi. Please valid .xlsx file use karein.",
                        );
                      }
                    };
                    reader.readAsArrayBuffer(file);
                  }}
                  data-ocid="results.input"
                />
              </label>
            </div>

            {importFile && (
              <div style={{ marginBottom: 8, fontSize: 13, color: "#555" }}>
                📄 Selected: <strong>{importFile.name}</strong>
              </div>
            )}

            {importError && (
              <div
                style={{
                  background: "#fdecea",
                  border: "1px solid #e53935",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 12,
                  color: "#c62828",
                  fontSize: 13,
                }}
                data-ocid="results.error_state"
              >
                ❌ {importError}
              </div>
            )}
            {importSuccess && (
              <div
                style={{
                  background: "#e8f5e9",
                  border: "1px solid #43a047",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 12,
                  color: "#2e7d32",
                  fontSize: 13,
                }}
                data-ocid="results.success_state"
              >
                ✅ {importSuccess}
              </div>
            )}

            {importPreview.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 13 }}>
                  Preview (first {importPreview.length} rows):
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      borderCollapse: "collapse",
                      width: "100%",
                      fontSize: 12,
                    }}
                  >
                    <thead>
                      <tr style={{ background: "#f5f5f5" }}>
                        {Object.keys(importPreview[0]).map((col) => (
                          <th
                            key={col}
                            style={{
                              border: "1px solid #ddd",
                              padding: "4px 8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importPreview.map((row) => (
                        <tr
                          key={(() => {
                            const rk = "Roll Number";
                            const sk = "Subject";
                            return String(row[rk]) + String(row[sk]);
                          })()}
                        >
                          {Object.entries(row).map(([colKey, val]) => (
                            <td
                              key={colKey}
                              style={{
                                border: "1px solid #ddd",
                                padding: "4px 8px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
                marginTop: 8,
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowImportExcel(false)}
                data-ocid="results.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={
                  !importFile || importPreview.length === 0 || !!importError
                }
                onClick={() => {
                  if (!importFile) return;
                  const reader = new FileReader();
                  reader.onload = (evt) => {
                    try {
                      const data = new Uint8Array(
                        evt.target?.result as ArrayBuffer,
                      );
                      const wb = XLSX.read(data, { type: "array" });
                      const ws = wb.Sheets[wb.SheetNames[0]];
                      const rows = XLSX.utils.sheet_to_json<
                        Record<string, unknown>
                      >(ws, { defval: "" });

                      const studentsByRoll: Record<
                        number,
                        (typeof students)[0]
                      > = {};
                      for (const s of students) studentsByRoll[s.rollNo] = s;

                      const newResults: StudentResult[] = [
                        ...results.filter(
                          (r) => !students.some((s) => s.id === r.studentId),
                        ),
                      ];
                      const newSubjects = [...subjects];
                      const newExtras: Record<
                        number,
                        {
                          remark?: string;
                          sport?: string;
                          skill?: string;
                          computer?: string;
                          urdu_sanskrit?: string;
                          pt?: string;
                        }
                      > = { ...importedExtras };
                      let unmatched = 0;

                      for (const row of rows) {
                        const rollNoKey = "Roll Number";
                        const subjectKey = "Subject";
                        const rollNo = Number(row[rollNoKey]);
                        const subject = String(row[subjectKey] || "")
                          .trim()
                          .toUpperCase();
                        if (!rollNo || !subject) continue;
                        const student = studentsByRoll[rollNo];
                        if (!student) {
                          unmatched++;
                          continue;
                        }

                        if (!newSubjects.includes(subject))
                          newSubjects.push(subject);

                        const halfYearlyKey = "Half Yearly";
                        const annualKey = "Annual";
                        const halfYearly = Number(row[halfYearlyKey] ?? 0);
                        const annual = Number(row[annualKey] ?? 0);

                        const existingIdx = newResults.findIndex(
                          (r) =>
                            r.studentId === student.id && r.subject === subject,
                        );
                        const marks: SubjectMarks = {
                          fa1: 0,
                          sa1: halfYearly,
                          fa2: 0,
                          fa3: 0,
                          sa2: annual,
                          acbw: 0,
                        };
                        if (existingIdx >= 0)
                          newResults[existingIdx] = {
                            studentId: student.id,
                            subject,
                            marks,
                          };
                        else
                          newResults.push({
                            studentId: student.id,
                            subject,
                            marks,
                          });

                        newExtras[student.id] = {
                          ...newExtras[student.id],
                          remark: String(row.Remark ?? ""),
                          sport: String(row.Sport ?? ""),
                          skill: String(row.Skill ?? ""),
                          computer: String(row.Computer ?? ""),
                          urdu_sanskrit: String(row["Urdu/Sanskrit"] ?? ""),
                          pt: String(row.PT ?? ""),
                        };
                      }

                      setResults(newResults);
                      setSubjects(newSubjects);
                      setImportedExtras(newExtras);
                      setImportSuccess(
                        `Import successful! ${rows.length} rows import kiye gaye.${unmatched > 0 ? ` ${unmatched} rows skip kiye gaye (roll number match nahi hua).` : ""}`,
                      );
                      setImportPreview([]);
                      setImportFile(null);
                    } catch {
                      setImportError(
                        "Import karte waqt error aayi. Please file check karein.",
                      );
                    }
                  };
                  reader.readAsArrayBuffer(importFile);
                }}
                data-ocid="results.confirm_button"
              >
                ✅ Import Confirm Karen
              </button>
            </div>
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

                    {/* Admin PIN Verify Modal */}
                    {showAdminTemplateModal && (
                      <div
                        data-ocid="results.admin_template.modal"
                        role="presentation"
                        style={{
                          position: "fixed",
                          inset: 0,
                          background: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1000,
                        }}
                        onClick={() => setShowAdminTemplateModal(false)}
                        onKeyDown={(e) =>
                          e.key === "Escape" && setShowAdminTemplateModal(false)
                        }
                      >
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: "2rem",
                            width: "100%",
                            maxWidth: 420,
                            position: "relative",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            data-ocid="results.admin_template.close_button"
                            onClick={() => setShowAdminTemplateModal(false)}
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <X size={20} />
                          </button>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: "1.2rem",
                            }}
                          >
                            <Lock size={20} color="#D97706" />
                            <h2
                              style={{
                                margin: 0,
                                fontSize: "1.1rem",
                                fontWeight: 700,
                              }}
                            >
                              Admin Verification
                            </h2>
                          </div>
                          <p
                            style={{
                              color: "#6B7280",
                              fontSize: "0.9rem",
                              marginBottom: "1rem",
                            }}
                          >
                            Template customize karne ke liye Admin PIN darj
                            karein.
                          </p>
                          <input
                            type="password"
                            placeholder="Admin PIN darj karein"
                            value={adminPinInput}
                            onChange={(e) => {
                              setAdminPinInput(e.target.value);
                              setAdminPinError("");
                            }}
                            data-ocid="results.admin_template.input"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                const correctPin =
                                  localStorage.getItem("adminPIN") ||
                                  "admin123";
                                if (adminPinInput === correctPin) {
                                  setAdminVerified(true);
                                  localStorage.setItem(
                                    "adminSessionActive",
                                    "true",
                                  );
                                  setShowAdminTemplateModal(false);
                                  setTemplateColumns(getTemplateColumns());
                                  setShowTemplateConfigure(true);
                                } else {
                                  setAdminPinError(
                                    "Galat PIN. Admin se sampark karein.",
                                  );
                                }
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "0.6rem 0.8rem",
                              borderRadius: 8,
                              border: adminPinError
                                ? "1.5px solid #EF4444"
                                : "1.5px solid #D1D5DB",
                              marginBottom: "0.5rem",
                              fontSize: "1rem",
                              boxSizing: "border-box",
                            }}
                          />
                          {adminPinError && (
                            <p
                              data-ocid="results.admin_template.error_state"
                              style={{
                                color: "#EF4444",
                                fontSize: "0.85rem",
                                marginBottom: "0.75rem",
                              }}
                            >
                              {adminPinError}
                            </p>
                          )}
                          <button
                            type="button"
                            data-ocid="results.admin_template.confirm_button"
                            onClick={() => {
                              const correctPin =
                                localStorage.getItem("adminPIN") || "admin123";
                              if (adminPinInput === correctPin) {
                                setAdminVerified(true);
                                localStorage.setItem(
                                  "adminSessionActive",
                                  "true",
                                );
                                setShowAdminTemplateModal(false);
                                setTemplateColumns(getTemplateColumns());
                                setShowTemplateConfigure(true);
                              } else {
                                setAdminPinError(
                                  "Galat PIN. Admin se sampark karein.",
                                );
                              }
                            }}
                            style={{
                              width: "100%",
                              padding: "0.65rem",
                              borderRadius: 8,
                              background: "#D97706",
                              color: "#fff",
                              border: "none",
                              fontWeight: 700,
                              fontSize: "1rem",
                              cursor: "pointer",
                            }}
                          >
                            Verify Karen
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Template Configure Modal */}
                    {showTemplateConfigure && (
                      <div
                        data-ocid="results.template_configure.modal"
                        role="presentation"
                        style={{
                          position: "fixed",
                          inset: 0,
                          background: "rgba(0,0,0,0.5)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1000,
                        }}
                        onClick={() => setShowTemplateConfigure(false)}
                        onKeyDown={(e) =>
                          e.key === "Escape" && setShowTemplateConfigure(false)
                        }
                      >
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: 12,
                            padding: "2rem",
                            width: "100%",
                            maxWidth: 520,
                            maxHeight: "85vh",
                            overflowY: "auto",
                            position: "relative",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            data-ocid="results.template_configure.close_button"
                            onClick={() => setShowTemplateConfigure(false)}
                            style={{
                              position: "absolute",
                              top: 12,
                              right: 12,
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            <X size={20} />
                          </button>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              marginBottom: "0.3rem",
                            }}
                          >
                            <Lock size={18} color="#D97706" />
                            <h2
                              style={{
                                margin: 0,
                                fontSize: "1.05rem",
                                fontWeight: 700,
                              }}
                            >
                              Excel Template Columns Customize Karen
                            </h2>
                          </div>
                          <p
                            style={{
                              color: "#6B7280",
                              fontSize: "0.82rem",
                              marginBottom: "1.2rem",
                            }}
                          >
                            Columns enable/disable karein, naam badlein, ya
                            order change karein.
                          </p>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "0.5rem",
                              marginBottom: "1.2rem",
                            }}
                          >
                            {templateColumns.map((col, idx) => (
                              <div
                                key={col.key}
                                data-ocid={`results.template_configure.item.${idx + 1}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                  padding: "0.5rem 0.75rem",
                                  borderRadius: 8,
                                  background: col.enabled
                                    ? "#FFFBEB"
                                    : "#F9FAFB",
                                  border: `1.5px solid ${col.enabled ? "#FDE68A" : "#E5E7EB"}`,
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={col.enabled}
                                  data-ocid={`results.template_configure.checkbox.${idx + 1}`}
                                  onChange={(e) => {
                                    const updated = [...templateColumns];
                                    updated[idx] = {
                                      ...updated[idx],
                                      enabled: e.target.checked,
                                    };
                                    setTemplateColumns(updated);
                                  }}
                                  style={{
                                    width: 16,
                                    height: 16,
                                    cursor: "pointer",
                                    accentColor: "#D97706",
                                  }}
                                />
                                <input
                                  type="text"
                                  value={col.label}
                                  data-ocid={`results.template_configure.input.${idx + 1}`}
                                  onChange={(e) => {
                                    const updated = [...templateColumns];
                                    updated[idx] = {
                                      ...updated[idx],
                                      label: e.target.value,
                                    };
                                    setTemplateColumns(updated);
                                  }}
                                  style={{
                                    flex: 1,
                                    padding: "0.3rem 0.5rem",
                                    borderRadius: 6,
                                    border: "1px solid #D1D5DB",
                                    fontSize: "0.88rem",
                                  }}
                                />
                                <div
                                  style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                  }}
                                >
                                  <button
                                    type="button"
                                    disabled={idx === 0}
                                    onClick={() => {
                                      if (idx === 0) return;
                                      const updated = [...templateColumns];
                                      [updated[idx - 1], updated[idx]] = [
                                        updated[idx],
                                        updated[idx - 1],
                                      ];
                                      setTemplateColumns(updated);
                                    }}
                                    style={{
                                      padding: "1px 5px",
                                      border: "1px solid #D1D5DB",
                                      borderRadius: 4,
                                      background: "#fff",
                                      cursor:
                                        idx === 0 ? "not-allowed" : "pointer",
                                      fontSize: 10,
                                    }}
                                  >
                                    ▲
                                  </button>
                                  <button
                                    type="button"
                                    disabled={
                                      idx === templateColumns.length - 1
                                    }
                                    onClick={() => {
                                      if (idx === templateColumns.length - 1)
                                        return;
                                      const updated = [...templateColumns];
                                      [updated[idx], updated[idx + 1]] = [
                                        updated[idx + 1],
                                        updated[idx],
                                      ];
                                      setTemplateColumns(updated);
                                    }}
                                    style={{
                                      padding: "1px 5px",
                                      border: "1px solid #D1D5DB",
                                      borderRadius: 4,
                                      background: "#fff",
                                      cursor:
                                        idx === templateColumns.length - 1
                                          ? "not-allowed"
                                          : "pointer",
                                      fontSize: 10,
                                    }}
                                  >
                                    ▼
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              gap: 8,
                              flexWrap: "wrap",
                            }}
                          >
                            <button
                              type="button"
                              data-ocid="results.template_configure.save_button"
                              onClick={() => {
                                localStorage.setItem(
                                  "excelTemplateColumns",
                                  JSON.stringify(templateColumns),
                                );
                                setShowTemplateConfigure(false);
                              }}
                              style={{
                                flex: 1,
                                padding: "0.6rem",
                                borderRadius: 8,
                                background: "#D97706",
                                color: "#fff",
                                border: "none",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              💾 Save Changes
                            </button>
                            <button
                              type="button"
                              data-ocid="results.template_configure.secondary_button"
                              onClick={() =>
                                setTemplateColumns([
                                  ...DEFAULT_TEMPLATE_COLUMNS,
                                ])
                              }
                              style={{
                                padding: "0.6rem 1rem",
                                borderRadius: 8,
                                background: "#F3F4F6",
                                color: "#374151",
                                border: "1px solid #D1D5DB",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              data-ocid="results.template_configure.delete_button"
                              onClick={() => {
                                localStorage.removeItem("adminSessionActive");
                                setAdminVerified(false);
                                setShowTemplateConfigure(false);
                              }}
                              style={{
                                padding: "0.6rem 1rem",
                                borderRadius: 8,
                                background: "#FEF2F2",
                                color: "#EF4444",
                                border: "1px solid #FECACA",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              Admin Logout
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setShowImportExcel(true);
              setImportFile(null);
              setImportPreview([]);
              setImportError("");
              setImportSuccess("");
            }}
            data-ocid="results.open_modal_button"
          >
            <FileSpreadsheet size={16} /> Import Excel
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
