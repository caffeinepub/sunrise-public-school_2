import { Edit2 } from "lucide-react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import {
  type SStudent,
  sampleClasses,
  sampleStudents,
} from "../data/sampleData";

const emptyStudent: Omit<SStudent, "id"> = {
  name: "",
  rollNo: 0,
  classId: 1,
  dob: "",
  fatherName: "",
  motherName: "",
  phone: "",
  address: "",
  admissionNo: "",
  photoUrl: "",
};

const fields: Array<[string, keyof Omit<SStudent, "id">, string]> = [
  ["Name", "name", "text"],
  ["Admission No", "admissionNo", "text"],
  ["Roll No", "rollNo", "number"],
  ["Date of Birth", "dob", "date"],
  ["Father's Name", "fatherName", "text"],
  ["Mother's Name", "motherName", "text"],
  ["Phone", "phone", "text"],
  ["Address", "address", "text"],
];

export default function Students() {
  const [students, setStudents] = useState<SStudent[]>(sampleStudents);
  const [editing, setEditing] = useState<SStudent | null>(null);
  const [form, setForm] = useState<Omit<SStudent, "id">>(emptyStudent);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState(0);

  const cls = (id: number) => sampleClasses.find((c) => c.id === id);
  const filtered = filter
    ? students.filter((s) => s.classId === filter)
    : students;

  const openAdd = () => {
    setEditing(null);
    setForm(emptyStudent);
    setShowForm(true);
  };
  const openEdit = (s: SStudent) => {
    setEditing(s);
    setForm({ ...s });
    setShowForm(true);
  };
  const save = () => {
    if (editing)
      setStudents(
        students.map((s) =>
          s.id === editing.id ? { ...form, id: editing.id } : s,
        ),
      );
    else setStudents([...students, { ...form, id: Date.now() }]);
    setShowForm(false);
  };

  return (
    <div className="page">
      <Header title="Students" />
      <div className="page-actions">
        <select
          value={filter}
          onChange={(e) => setFilter(Number(e.target.value))}
          className="select-input"
        >
          <option value={0}>All Classes</option>
          {sampleClasses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} - {c.section}
            </option>
          ))}
        </select>
        <button type="button" className="btn-primary" onClick={openAdd}>
          <Plus size={16} /> Add Student
        </button>
      </div>
      {showForm && (
        <div className="card form-card">
          <h3>{editing ? "Edit Student" : "Add New Student"}</h3>
          <div className="form-grid">
            {fields.map(([label, key, type]) => (
              <div key={key} className="form-group">
                <label htmlFor={`field-${key}`}>{label}</label>
                <input
                  id={`field-${key}`}
                  type={type}
                  value={form[key] as string}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]:
                        type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </div>
            ))}
            <div className="form-group">
              <label htmlFor="field-classId">Class</label>
              <select
                id="field-classId"
                value={form.classId}
                onChange={(e) =>
                  setForm({ ...form, classId: Number(e.target.value) })
                }
                className="select-input"
              >
                {sampleClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.section}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-primary" onClick={save}>
              {editing ? "Update" : "Add"} Student
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowForm(false)}
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
              <th>Adm No</th>
              <th>Name</th>
              <th>Roll</th>
              <th>Class</th>
              <th>Father</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id}>
                <td>{s.admissionNo}</td>
                <td className="font-medium">{s.name}</td>
                <td>{s.rollNo}</td>
                <td>
                  {cls(s.classId)?.name} {cls(s.classId)?.section}
                </td>
                <td>{s.fatherName}</td>
                <td>{s.phone}</td>
                <td>
                  <button
                    type="button"
                    className="icon-action"
                    onClick={() => openEdit(s)}
                  >
                    <Edit2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer">
          Showing {filtered.length} of {students.length} students
        </div>
      </div>
    </div>
  );
}
