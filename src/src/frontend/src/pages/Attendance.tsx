import { Printer } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import {
  type SAttendance,
  sampleAttendance,
  sampleClasses,
  sampleStudents,
} from "../data/sampleData";

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];
  const [classId, setClassId] = useState(1);
  const [date, setDate] = useState(today);
  const [records, setRecords] = useState<SAttendance[]>(sampleAttendance);

  const students = sampleStudents.filter((s) => s.classId === classId);
  const cls = sampleClasses.find((c) => c.id === classId);

  const getStatus = (sid: number) =>
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

  const present = students.filter((s) => getStatus(s.id) === "present").length;

  return (
    <div className="page">
      <Header title="Attendance" />
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
        <button
          type="button"
          className="btn-outline"
          onClick={() => window.print()}
        >
          <Printer size={16} /> Print
        </button>
      </div>
      <div className="card printable">
        <div className="print-header">
          <h2>Sunrise Public School</h2>
          <p>
            Attendance Sheet - {cls?.name} {cls?.section} | Date: {date}
          </p>
          <p>
            Present: {present}/{students.length}
          </p>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Roll</th>
              <th>Name</th>
              <th>Present</th>
              <th>Late</th>
              <th>Absent</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const st = getStatus(s.id);
              return (
                <tr key={s.id}>
                  <td>{s.rollNo}</td>
                  <td className="font-medium">{s.name}</td>
                  {(["present", "late", "absent"] as const).map((status) => (
                    <td key={status}>
                      <input
                        type="radio"
                        name={`att-${s.id}`}
                        checked={st === status}
                        onChange={() => mark(s.id, status)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
