import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Edit3, Printer, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import {
  type Teacher,
  getTeacherById,
  updateTeacher,
} from "../data/teacherData";

const blankForm: Omit<Teacher, "id"> = {
  name: "",
  designation: "",
  qualification: "",
  subject: "",
  classAssigned: "",
  phone: "",
  email: "",
  accountNumber: "",
  bankName: "",
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
  address: "",
  district: "",
  state: "",
  nationality: "Indian",
  pinCode: "",
  employeeId: "",
  active: true,
  photo: undefined,
};

const labelStyle: React.CSSProperties = {
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#475569",
  display: "block",
  marginBottom: 3,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  borderRadius: 8,
  border: "1px solid #D1D5DB",
  fontSize: "0.88rem",
  boxSizing: "border-box",
  outline: "none",
};

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        padding: "5px 0",
        borderBottom: "1px solid #e2e8f0",
      }}
    >
      <span
        style={{
          fontWeight: 700,
          fontSize: "0.82rem",
          color: "#1e3a5f",
          minWidth: 160,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <span style={{ color: "#374151", fontSize: "0.82rem" }}>
        : {value || "—"}
      </span>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  sub,
  color,
}: { icon: string; title: string; sub: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
        paddingBottom: 6,
        borderBottom: `2px solid ${color}`,
      }}
    >
      <span style={{ fontSize: "1.4rem" }}>{icon}</span>
      <div>
        <div
          style={{
            fontWeight: 800,
            fontSize: "0.85rem",
            color: "#1e3a5f",
            lineHeight: 1.1,
          }}
        >
          {title}
        </div>
        <div style={{ fontWeight: 700, fontSize: "0.75rem", color }}>{sub}</div>
      </div>
    </div>
  );
}

export default function TeacherProfile() {
  const params = useParams({ strict: false }) as { teacherId?: string };
  const teacherId = Number(params.teacherId);
  const navigate = useNavigate();

  const [teacher, setTeacher] = useState<Teacher | null>(
    () => getTeacherById(teacherId) ?? null,
  );
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<Teacher, "id">>(blankForm);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = getTeacherById(teacherId);
    setTeacher(t ?? null);
  }, [teacherId]);

  if (!teacher) {
    return (
      <div className="page">
        <Header title="Teacher Profile" />
        <div style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF" }}>
          Teacher not found.
        </div>
      </div>
    );
  }

  function openEdit() {
    if (!teacher) return;
    setForm({ ...teacher });
    setEditing(true);
  }

  function handleFormChange(
    field: keyof Omit<Teacher, "id">,
    value: string | boolean,
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function saveEdit() {
    if (!teacher) return;
    const updated: Teacher = { ...form, id: teacher.id };
    updateTeacher(updated);
    setTeacher(updated);
    setEditing(false);
  }

  function toggleActive() {
    if (!teacher) return;
    const updated = { ...teacher, active: !teacher.active };
    updateTeacher(updated);
    setTeacher(updated);
  }

  function handleProfilePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !teacher) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const photo = ev.target?.result as string;
      const updated = { ...teacher, photo };
      updateTeacher(updated);
      setTeacher(updated);
    };
    reader.readAsDataURL(file);
  }

  const textFields: [keyof Omit<Teacher, "id">, string, string][] = [
    ["name", "Full Name", "text"],
    ["designation", "Designation (Pad)", "text"],
    ["qualification", "Qualification", "text"],
    ["subject", "Subject", "text"],
    ["classAssigned", "Class Assigned", "text"],
    ["employeeId", "Employee ID", "text"],
    ["phone", "Mobile Number", "text"],
    ["email", "Email ID", "email"],
    ["address", "Full Address", "text"],
    ["district", "District (Zila)", "text"],
    ["state", "State (Rajya)", "text"],
    ["pinCode", "PIN Code", "text"],
    ["dob", "Date of Birth", "date"],
    ["joiningDate", "Joining Date", "date"],
    ["fatherName", "Father's Name", "text"],
    ["motherName", "Mother's Name", "text"],
    ["nationality", "Nationality", "text"],
    ["aadharNumber", "Aadhar Number", "text"],
    ["bankName", "Bank Name", "text"],
    ["branchName", "Branch Name", "text"],
    ["accountNumber", "Account Number", "text"],
    ["ifscCode", "IFSC Code", "text"],
  ];

  return (
    <div className="page">
      <Header title="Teacher Profile" />

      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
        className="no-print"
      >
        <button
          type="button"
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => navigate({ to: "/teachers" })}
        >
          <ArrowLeft size={15} /> Back to Teachers
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={openEdit}
        >
          <Edit3 size={15} /> Edit / Customize
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => window.print()}
        >
          <Printer size={15} /> Print
        </button>
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "0.85rem",
            background: teacher.active ? "#FEE2E2" : "#DCFCE7",
            color: teacher.active ? "#DC2626" : "#16A34A",
          }}
          onClick={toggleActive}
        >
          {teacher.active ? "Mark Inactive" : "Mark Active"}
        </button>
      </div>

      {/* ===== PROFILE CARD (matches uploaded format) ===== */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #cbd5e1",
          borderRadius: 10,
          overflow: "hidden",
          maxWidth: 960,
          margin: "0 auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Top title bar */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #2563eb 100%)",
            padding: "14px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 900,
              fontSize: "1.35rem",
              letterSpacing: 1,
            }}
          >
            SHIKSHAK PROFILE / TEACHER PROFILE
          </div>
        </div>

        {/* Photo + Name row */}
        <div
          style={{
            background: "#eaf3fb",
            display: "flex",
            alignItems: "center",
            gap: 0,
            borderBottom: "none",
          }}
        >
          {/* Photo box */}
          <div style={{ padding: "18px 20px", flexShrink: 0 }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div
                style={{
                  width: 110,
                  height: 130,
                  border: "2px solid #94a3b8",
                  background: "#dbeafe",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  borderRadius: 4,
                }}
              >
                {teacher.photo ? (
                  <img
                    src={teacher.photo}
                    alt={teacher.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", padding: "0 6px" }}>
                    <div style={{ fontSize: "2.5rem", color: "#64748b" }}>
                      👤
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: "#64748b",
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      PAHCHAN PATRA PHOTO / PASSPORT SIZE PHOTO
                    </div>
                  </div>
                )}
              </div>
              <label
                htmlFor="profile-photo-input"
                className="no-print"
                style={{
                  position: "absolute",
                  bottom: 4,
                  right: 4,
                  background: "#2563eb",
                  borderRadius: "50%",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  border: "2px solid #fff",
                }}
              >
                <Camera size={12} color="#fff" />
              </label>
              <input
                id="profile-photo-input"
                ref={photoRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleProfilePhotoChange}
              />
            </div>
          </div>

          {/* Name + designation */}
          <div style={{ flex: 1, padding: "18px 24px" }}>
            <div
              style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                color: "#1e3a5f",
                lineHeight: 1.2,
              }}
            >
              SHIKSHAK KA NAAM: {teacher.name.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: "1.05rem",
                fontWeight: 800,
                color: "#1e3a5f",
                marginTop: 6,
              }}
            >
              PAD: {teacher.designation.toUpperCase()}
            </div>
            <div style={{ marginTop: 8 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 14px",
                  borderRadius: 999,
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  background: teacher.active ? "#DCFCE7" : "#FEE2E2",
                  color: teacher.active ? "#16A34A" : "#DC2626",
                }}
              >
                {teacher.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Dark blue icon bar */}
        <div
          style={{
            background: "#1e3a5f",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span style={{ color: "#fff", fontSize: "1rem" }}>🪪</span>
          <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>|</span>
          <span style={{ color: "#fff", fontSize: "1rem" }}>✉️</span>
          <span style={{ color: "#94a3b8", fontSize: "0.9rem" }}>|</span>
          <span style={{ color: "#fff", fontSize: "1rem" }}>👤</span>
        </div>

        {/* 3-column info grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0,
            background: "#fff",
          }}
        >
          {/* Column 1: Personal Info */}
          <div
            style={{ padding: "16px 18px", borderRight: "1px solid #e2e8f0" }}
          >
            <SectionHeader
              icon="📚"
              title="VYAKTI-GAT JANKARI"
              sub="PERSONAL INFO"
              color="#2563eb"
            />
            <Row
              label="Father's Name (Pita Ka Naam)"
              value={teacher.fatherName}
            />
            <Row label="DOB (Janm Tithi)" value={teacher.dob} />
            <Row label="Gender (Ling)" value={teacher.gender} />
            <Row
              label="Marital Status (Vivahit Sthiti)"
              value={teacher.maritalStatus}
            />
            <Row label="Caste/Category (Jati/Varg)" value={teacher.caste} />
            <Row
              label="Nationality (Rashtriyata)"
              value={teacher.nationality || "Indian"}
            />
            <Row label="Aadhar Number" value={teacher.aadharNumber} />
          </div>

          {/* Column 2: Contact & Address */}
          <div
            style={{ padding: "16px 18px", borderRight: "1px solid #e2e8f0" }}
          >
            <SectionHeader
              icon="📍"
              title="SAMHARK AUR PATA"
              sub="CONTACT & ADDRESS"
              color="#16a34a"
            />
            <Row label="Mobile Number" value={teacher.phone} />
            <Row label="Email ID" value={teacher.email} />
            <Row label="Full Address (Pura Pata)" value={teacher.address} />
            <Row label="District (Zila)" value={teacher.district} />
            <Row label="State (Rajya)" value={teacher.state} />
            <Row label="PIN Code" value={teacher.pinCode} />
          </div>

          {/* Column 3: Job & Bank */}
          <div style={{ padding: "16px 18px" }}>
            <SectionHeader
              icon="💰"
              title="NUKRI AUR BANK DETAILS"
              sub="JOB & BANK DETAILS"
              color="#f59e0b"
            />
            <Row label="Designation (Pad)" value={teacher.designation} />
            <Row label="Qualification" value={teacher.qualification} />
            <Row
              label="Joining Date (Niyukti Tithi)"
              value={teacher.joiningDate}
            />
            <Row label="Employee ID" value={teacher.employeeId} />
            {/* Bank sub-section */}
            <div
              style={{
                marginTop: 12,
                paddingTop: 8,
                borderTop: "2px solid #f59e0b",
              }}
            >
              <div
                style={{
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  color: "#1e3a5f",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>💰</span> BANK DETAILS
              </div>
              <Row label="Bank Name" value={teacher.bankName} />
              <Row label="Branch Name" value={teacher.branchName} />
              <Row label="Account Number" value={teacher.accountNumber} />
              <Row label="IFSC Code" value={teacher.ifscCode} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            background: "linear-gradient(90deg, #1e3a5f 60%, #f59e0b 100%)",
            padding: "8px 20px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              color: "#fff",
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Sunrise Public School &mdash; Teacher Profile Card
          </span>
        </div>
      </div>

      {/* Edit / Customize Modal */}
      {editing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.6)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflowY: "auto",
            padding: "2rem 1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "1.5rem",
              width: "100%",
              maxWidth: 700,
              boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
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
                Edit / Customize Teacher Profile
              </h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
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
              {textFields.map(([field, label, type]) => (
                <div key={field}>
                  <label htmlFor={`edit-${field}`} style={labelStyle}>
                    {label}
                  </label>
                  <input
                    id={`edit-${field}`}
                    type={type}
                    value={(form[field] as string) || ""}
                    onChange={(e) => handleFormChange(field, e.target.value)}
                    style={inputStyle}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="edit-gender" style={labelStyle}>
                  Gender (Ling)
                </label>
                <select
                  id="edit-gender"
                  value={form.gender}
                  onChange={(e) => handleFormChange("gender", e.target.value)}
                  style={inputStyle}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-caste" style={labelStyle}>
                  Caste (Jati/Varg)
                </label>
                <select
                  id="edit-caste"
                  value={form.caste}
                  onChange={(e) => handleFormChange("caste", e.target.value)}
                  style={inputStyle}
                >
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-marital" style={labelStyle}>
                  Marital Status (Vivahit Sthiti)
                </label>
                <select
                  id="edit-marital"
                  value={form.maritalStatus}
                  onChange={(e) =>
                    handleFormChange("maritalStatus", e.target.value)
                  }
                  style={inputStyle}
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
                onClick={() => setEditing(false)}
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

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .sidebar, header { display: none !important; }
          .page { padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
