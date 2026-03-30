import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Eye,
  Phone,
  PlusCircle,
  Search,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import {
  type Teacher,
  addTeacher,
  getTeachers,
  saveTeachers,
} from "../data/teacherData";

const blankForm = {
  name: "",
  designation: "",
  qualification: "",
  subject: "",
  classAssigned: "",
  phone: "",
  accountNumber: "",
  branchName: "",
  ifscCode: "",
  aadharNumber: "",
  caste: "General",
  gender: "Male",
  maritalStatus: "Married",
  dob: "",
  joiningDate: "",
  fatherName: "",
  motherName: "",
  active: true,
  photo: undefined as string | undefined,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#475569",
  display: "block",
  marginBottom: 3,
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  borderRadius: 8,
  border: "1px solid #D1D5DB",
  fontSize: "0.88rem",
  boxSizing: "border-box",
  outline: "none",
};

export default function TeachersList() {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState<Teacher[]>(() => getTeachers());
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ ...blankForm });

  const filtered = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.designation.toLowerCase().includes(search.toLowerCase()),
  );

  function handleFormChange(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddTeacher() {
    if (!form.name.trim()) return;
    const added = addTeacher(form);
    setTeachers(getTeachers());
    setShowAdd(false);
    setForm({ ...blankForm });
    navigate({ to: `/teacher/${added.id}` });
  }

  function toggleActive(id: number) {
    const updated = teachers.map((t) =>
      t.id === id ? { ...t, active: !t.active } : t,
    );
    saveTeachers(updated);
    setTeachers(updated);
  }

  const initials = (name: string) =>
    name
      .split(" ")
      .filter((w) => /^[A-Za-z]/.test(w))
      .slice(0, 2)
      .map((w) => w[0])
      .join("");

  const avatarGradients = [
    "linear-gradient(135deg,#6366F1,#8B5CF6)",
    "linear-gradient(135deg,#0EA5E9,#22D3EE)",
    "linear-gradient(135deg,#10B981,#34D399)",
    "linear-gradient(135deg,#F59E0B,#FCD34D)",
    "linear-gradient(135deg,#EF4444,#F87171)",
  ];

  return (
    <div className="page">
      <Header title="Teachers" />

      {/* Top bar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#94A3B8",
            }}
          />
          <input
            type="text"
            placeholder="Search by name, subject, designation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              borderRadius: 10,
              border: "1px solid #E2E8F0",
              fontSize: "0.9rem",
              outline: "none",
              boxSizing: "border-box",
              background: "#F8FAFC",
            }}
            data-ocid="teachers.search_input"
          />
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => setShowAdd(true)}
          data-ocid="teachers.add_button"
        >
          <PlusCircle size={15} /> Add New Teacher
        </button>
      </div>

      {/* Grid */}
      {filtered.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF" }}
          data-ocid="teachers.empty_state"
        >
          No teachers found.
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {filtered.map((t, i) => (
          <div
            key={t.id}
            className="card"
            data-ocid={`teachers.item.${i + 1}`}
            style={{
              transition: "box-shadow 0.2s, transform 0.15s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 8px 30px rgba(99,102,241,0.15)";
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.boxShadow = "";
              (e.currentTarget as HTMLDivElement).style.transform = "";
            }}
          >
            {/* Status badge */}
            <span
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                padding: "2px 10px",
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 600,
                background: t.active ? "#DCFCE7" : "#FEE2E2",
                color: t.active ? "#16A34A" : "#DC2626",
              }}
            >
              {t.active ? "Active" : "Inactive"}
            </span>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "0.5rem",
                paddingBottom: "0.75rem",
              }}
            >
              {/* Photo */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: avatarGradients[i % avatarGradients.length],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                  border: "3px solid #E0E7FF",
                }}
              >
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initials(t.name)
                )}
              </div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#1E293B",
                  textAlign: "center",
                  marginBottom: 2,
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  color: "#6366F1",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  marginBottom: 2,
                }}
              >
                {t.designation}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#64748B",
                  fontSize: "0.8rem",
                  marginBottom: 2,
                }}
              >
                <BookOpen size={12} />
                {t.subject}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "#64748B",
                  fontSize: "0.8rem",
                  marginBottom: "1rem",
                }}
              >
                <Phone size={12} />
                {t.phone}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{
                    padding: "5px 14px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  onClick={() => navigate({ to: `/teacher/${t.id}` })}
                  data-ocid={`teachers.view_button.${i + 1}`}
                >
                  <Eye size={13} /> View Profile
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{
                    padding: "5px 12px",
                    fontSize: "0.8rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    background: t.active ? "#FEE2E2" : "#DCFCE7",
                    color: t.active ? "#DC2626" : "#16A34A",
                    border: "none",
                  }}
                  onClick={() => toggleActive(t.id)}
                  data-ocid={`teachers.toggle.${i + 1}`}
                >
                  {t.active ? <UserX size={13} /> : <UserCheck size={13} />}
                  {t.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Modal */}
      {showAdd && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.55)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "2rem 1rem",
          }}
          data-ocid="teachers.modal"
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "1.5rem",
              width: "100%",
              maxWidth: 640,
              boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>
                Add New Teacher
              </h3>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                data-ocid="teachers.close_button"
              >
                <X size={20} color="#64748B" />
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
              }}
            >
              {(
                [
                  ["name", "Full Name *", "text"],
                  ["designation", "Designation", "text"],
                  ["qualification", "Qualification", "text"],
                  ["subject", "Subject", "text"],
                  ["classAssigned", "Class Assigned", "text"],
                  ["phone", "Mobile Number", "text"],
                  ["dob", "Date of Birth", "date"],
                  ["joiningDate", "Joining Date", "date"],
                  ["fatherName", "Father's Name", "text"],
                  ["motherName", "Mother's Name", "text"],
                  ["accountNumber", "Account Number", "text"],
                  ["branchName", "Branch Name", "text"],
                  ["ifscCode", "IFSC Code", "text"],
                  ["aadharNumber", "Aadhar Number", "text"],
                ] as [string, string, string][]
              ).map(([field, label, type]) => (
                <div key={field}>
                  <label htmlFor={`add-${field}`} style={labelStyle}>
                    {label}
                  </label>
                  <input
                    id={`add-${field}`}
                    type={type}
                    value={
                      (form as unknown as Record<string, string>)[field] || ""
                    }
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    style={{
                      width: "100%",
                      padding: "7px 10px",
                      borderRadius: 8,
                      border: "1px solid #D1D5DB",
                      fontSize: "0.88rem",
                      boxSizing: "border-box",
                      outline: "none",
                    }}
                    data-ocid={`teachers.add_${field}.input`}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="add-gender" style={labelStyle}>
                  Gender
                </label>
                <select
                  id="add-gender"
                  value={form.gender}
                  onChange={(e) => handleFormChange("gender", e.target.value)}
                  style={selectStyle}
                  data-ocid="teachers.add_gender.select"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="add-caste" style={labelStyle}>
                  Caste
                </label>
                <select
                  id="add-caste"
                  value={form.caste}
                  onChange={(e) => handleFormChange("caste", e.target.value)}
                  style={selectStyle}
                  data-ocid="teachers.add_caste.select"
                >
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                </select>
              </div>

              <div>
                <label htmlFor="add-marital" style={labelStyle}>
                  Marital Status
                </label>
                <select
                  id="add-marital"
                  value={form.maritalStatus}
                  onChange={(e) =>
                    handleFormChange("maritalStatus", e.target.value)
                  }
                  style={selectStyle}
                  data-ocid="teachers.add_marital_status.select"
                >
                  <option>Married</option>
                  <option>Unmarried</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                marginTop: "1.25rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowAdd(false)}
                data-ocid="teachers.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleAddTeacher}
                data-ocid="teachers.submit_button"
              >
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
