import { Plus } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import { type SClass, sampleClasses, sampleStudents } from "../data/sampleData";

export default function Classes() {
  const [classes, setClasses] = useState<SClass[]>(sampleClasses);
  const [form, setForm] = useState({ name: "", section: "" });
  const [showForm, setShowForm] = useState(false);

  const addClass = () => {
    if (!form.name || !form.section) return;
    setClasses([
      ...classes,
      { id: Date.now(), name: form.name, section: form.section },
    ]);
    setForm({ name: "", section: "" });
    setShowForm(false);
  };

  return (
    <div className="page">
      <Header title="Classes" />
      <div className="page-actions">
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={16} /> Add Class
        </button>
      </div>
      {showForm && (
        <div className="card form-card">
          <h3>Create New Class</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class-name">Class Name</label>
              <input
                id="class-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Class 7"
              />
            </div>
            <div className="form-group">
              <label htmlFor="class-section">Section</label>
              <input
                id="class-section"
                value={form.section}
                onChange={(e) => setForm({ ...form, section: e.target.value })}
                placeholder="e.g. A"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-primary" onClick={addClass}>
              Create Class
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
      <div className="class-grid">
        {classes.map((c) => {
          const count = sampleStudents.filter((s) => s.classId === c.id).length;
          return (
            <div key={c.id} className="class-card card">
              <div className="class-badge">
                {c.name[c.name.length - 1]}
                {c.section}
              </div>
              <div className="class-info">
                <div className="class-name">
                  {c.name} - {c.section}
                </div>
                <div className="class-count">{count} Students</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
