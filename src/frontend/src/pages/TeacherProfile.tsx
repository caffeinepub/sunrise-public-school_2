import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Banknote,
  BookOpen,
  Camera,
  Edit3,
  Lock,
  Phone,
  Printer,
  User,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header";
import {
  type Teacher,
  getTeacherById,
  updateTeacher,
} from "../data/teacherData";

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        padding: "0.5rem 0",
        borderBottom: "1px solid #F1F5F9",
        alignItems: "flex-start",
      }}
    >
      <span
        style={{
          color: "#64748B",
          fontSize: "0.82rem",
          fontWeight: 600,
          minWidth: 160,
          flexShrink: 0,
          paddingTop: 2,
        }}
      >
        {label}
      </span>
      <span style={{ color: "#1E293B", fontSize: "0.9rem", flex: 1 }}>
        {value || "—"}
      </span>
    </div>
  );
}

const blankForm: Omit<Teacher, "id"> = {
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
  photo: undefined,
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

  const initials = teacher.name
    .split(" ")
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="page">
      <Header title="Teacher Profile" />

      {/* Action Bar */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
        className="no-print"
      >
        <button
          type="button"
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => navigate({ to: "/admin" })}
          data-ocid="teacher_profile.back_button"
        >
          <ArrowLeft size={15} /> Back to Admin
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={openEdit}
          data-ocid="teacher_profile.edit_button"
        >
          <Edit3 size={15} /> Edit Profile
        </button>
        <button
          type="button"
          className="btn-secondary"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={() => window.print()}
          data-ocid="teacher_profile.print_button"
        >
          <Printer size={15} /> Print
        </button>
        <button
          type="button"
          className={teacher.active ? "btn-secondary" : "btn-primary"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: teacher.active ? "#FEE2E2" : undefined,
            color: teacher.active ? "#DC2626" : undefined,
          }}
          onClick={toggleActive}
          data-ocid="teacher_profile.toggle"
        >
          {teacher.active ? "Mark Inactive" : "Mark Active"}
        </button>
      </div>

      {/* Profile Header Card */}
      <div
        className="card"
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {/* Photo via label */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <label
            htmlFor="profile-photo-input"
            style={{ cursor: "pointer", display: "block" }}
            title="Click to change photo"
          >
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                overflow: "hidden",
                border: "3px solid #E0E7FF",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {teacher.photo ? (
                <img
                  src={teacher.photo}
                  alt={teacher.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
            </div>
          </label>
          <label
            htmlFor="profile-photo-input"
            className="no-print"
            style={{
              position: "absolute",
              bottom: 4,
              right: 4,
              background: "#6366F1",
              borderRadius: "50%",
              width: 26,
              height: 26,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              border: "2px solid #fff",
            }}
          >
            <Camera size={13} color="#fff" />
          </label>
          <input
            id="profile-photo-input"
            ref={photoRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleProfilePhotoChange}
            data-ocid="teacher_profile.upload_button"
          />
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#1E293B",
            }}
          >
            {teacher.name}
          </h2>
          <div style={{ color: "#6366F1", fontWeight: 600, marginTop: 2 }}>
            {teacher.designation}
          </div>
          <div style={{ color: "#64748B", fontSize: "0.88rem", marginTop: 2 }}>
            {teacher.subject} &bull; {teacher.classAssigned}
          </div>
          <div style={{ marginTop: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "2px 12px",
                borderRadius: 999,
                fontSize: "0.78rem",
                fontWeight: 600,
                background: teacher.active ? "#DCFCE7" : "#FEE2E2",
                color: teacher.active ? "#16A34A" : "#DC2626",
              }}
            >
              {teacher.active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {/* Personal Info */}
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <User size={16} color="#6366F1" />
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              Personal Information
            </h3>
          </div>
          <InfoRow label="Full Name" value={teacher.name} />
          <InfoRow label="Date of Birth" value={teacher.dob} />
          <InfoRow label="Gender" value={teacher.gender} />
          <InfoRow label="Caste" value={teacher.caste} />
          <InfoRow label="Marital Status" value={teacher.maritalStatus} />
          <InfoRow label="Father's Name" value={teacher.fatherName} />
          <InfoRow label="Mother's Name" value={teacher.motherName} />
        </div>

        {/* Professional Info */}
        <div className="card">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <BookOpen size={16} color="#10B981" />
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              Professional Information
            </h3>
          </div>
          <InfoRow label="Designation" value={teacher.designation} />
          <InfoRow label="Qualification" value={teacher.qualification} />
          <InfoRow label="Subject" value={teacher.subject} />
          <InfoRow label="Class Assigned" value={teacher.classAssigned} />
          <InfoRow label="Joining Date" value={teacher.joiningDate} />
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              padding: "0.5rem 0",
              alignItems: "center",
            }}
          >
            <Phone size={13} color="#64748B" />
            <span
              style={{ color: "#64748B", fontSize: "0.82rem", fontWeight: 600 }}
            >
              Mobile:
            </span>
            <span style={{ color: "#1E293B", fontSize: "0.9rem" }}>
              {teacher.phone}
            </span>
          </div>
        </div>

        {/* Bank & Identity */}
        <div className="card" style={{ borderLeft: "4px solid #F59E0B" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Banknote size={16} color="#F59E0B" />
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "#1E293B",
              }}
            >
              Bank & Identity Details
            </h3>
            <span
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.72rem",
                color: "#F59E0B",
                fontWeight: 600,
              }}
            >
              <Lock size={11} /> Confidential
            </span>
          </div>
          <div
            style={{
              background: "#FFFBEB",
              borderRadius: 8,
              padding: "0.75rem",
              border: "1px solid #FDE68A",
            }}
          >
            <InfoRow label="Account Number" value={teacher.accountNumber} />
            <InfoRow label="Branch Name" value={teacher.branchName} />
            <InfoRow label="IFSC Code" value={teacher.ifscCode} />
            <InfoRow label="Aadhar Number" value={teacher.aadharNumber} />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
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
          data-ocid="teacher_profile.modal"
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
                Edit Teacher Profile
              </h3>
              <button
                type="button"
                onClick={() => setEditing(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                data-ocid="teacher_profile.close_button"
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
                  ["name", "Full Name", "text"],
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
                ] as [keyof Omit<Teacher, "id">, string, string][]
              ).map(([field, label, type]) => (
                <div key={field}>
                  <label htmlFor={`edit-${field}`} style={labelStyle}>
                    {label}
                  </label>
                  <input
                    id={`edit-${field}`}
                    type={type}
                    value={(form[field] as string) || ""}
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
                    data-ocid={`teacher_profile.${field}.input`}
                  />
                </div>
              ))}

              <div>
                <label htmlFor="edit-gender" style={labelStyle}>
                  Gender
                </label>
                <select
                  id="edit-gender"
                  value={form.gender}
                  onChange={(e) => handleFormChange("gender", e.target.value)}
                  style={selectStyle}
                  data-ocid="teacher_profile.gender.select"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-caste" style={labelStyle}>
                  Caste
                </label>
                <select
                  id="edit-caste"
                  value={form.caste}
                  onChange={(e) => handleFormChange("caste", e.target.value)}
                  style={selectStyle}
                  data-ocid="teacher_profile.caste.select"
                >
                  <option>General</option>
                  <option>OBC</option>
                  <option>SC</option>
                  <option>ST</option>
                </select>
              </div>

              <div>
                <label htmlFor="edit-marital" style={labelStyle}>
                  Marital Status
                </label>
                <select
                  id="edit-marital"
                  value={form.maritalStatus}
                  onChange={(e) =>
                    handleFormChange("maritalStatus", e.target.value)
                  }
                  style={selectStyle}
                  data-ocid="teacher_profile.marital_status.select"
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
                data-ocid="teacher_profile.cancel_button"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={saveEdit}
                data-ocid="teacher_profile.save_button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .sidebar, .main-content > *:first-child { display: none !important; }
        }
      `}</style>
    </div>
  );
}
