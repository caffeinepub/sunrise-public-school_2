import { Check, Edit2, Phone, Printer, X } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import {
  type SFee,
  sampleClasses,
  sampleFees,
  sampleStudents,
} from "../data/sampleData";
import { getSchoolSettings } from "./Settings";

const FEE_TYPES = [
  "Tuition",
  "Admission",
  "Exam",
  "Transport",
  "Hostel",
  "Library",
  "Sports",
  "Other",
];

export default function Fees() {
  const settings = getSchoolSettings();
  const [fees, setFees] = useState<SFee[]>(sampleFees);
  const [classId, setClassId] = useState(0);
  const [printFee, setPrintFee] = useState<SFee | null>(null);
  const [editFee, setEditFee] = useState<SFee | null>(null);
  const [editType, setEditType] = useState("");
  const [editTotal, setEditTotal] = useState("");
  const [editPaid, setEditPaid] = useState("");
  const [callStudent, setCallStudent] = useState<{
    name: string;
    phone: string;
  } | null>(null);

  const filtered = classId
    ? sampleStudents
        .filter((s) => s.classId === classId)
        .map((s) => fees.find((f) => f.studentId === s.id)!)
        .filter(Boolean)
    : fees;

  const student = (id: number) => sampleStudents.find((s) => s.id === id);
  const cls = (sid: number) => {
    const s = student(sid);
    return s ? sampleClasses.find((c) => c.id === s.classId) : null;
  };

  const markPaid = (feeId: number) =>
    setFees(
      fees.map((f) =>
        f.id === feeId ? { ...f, isPaid: true, amountPaid: f.totalDue } : f,
      ),
    );

  const openEdit = (fee: SFee) => {
    setEditFee(fee);
    setEditType(fee.feeType);
    setEditTotal(String(fee.totalDue));
    setEditPaid(String(fee.amountPaid));
  };

  const saveEdit = () => {
    if (!editFee) return;
    const totalDue = Number(editTotal) || 0;
    const amountPaid = Number(editPaid) || 0;
    setFees(
      fees.map((f) =>
        f.id === editFee.id
          ? {
              ...f,
              feeType: editType,
              totalDue,
              amountPaid,
              isPaid: amountPaid >= totalDue && totalDue > 0,
            }
          : f,
      ),
    );
    setEditFee(null);
  };

  const printReceipt = (fee: SFee) => {
    setPrintFee(fee);
    setTimeout(() => {
      window.print();
      setPrintFee(null);
    }, 100);
  };
  const pf = printFee ? student(printFee.studentId) : null;

  const handleCall = (fee: SFee) => {
    const s = student(fee.studentId);
    if (!s) return;
    if (s.phone) {
      setCallStudent({ name: s.name, phone: s.phone });
    }
  };

  return (
    <div className="page">
      <Header title="Fees Management" />
      {pf && printFee && (
        <div className="print-only printable receipt">
          <div className="rc-header">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                style={{ height: 60, objectFit: "contain" }}
                alt="logo"
              />
            )}
            <h2>{settings.name}</h2>
            <h3>Fee Receipt</h3>
          </div>
          <div className="rc-info">
            <div>
              <strong>Receipt No:</strong> {printFee.receiptNo}
            </div>
            <div>
              <strong>Student:</strong> {pf.name}
            </div>
            <div>
              <strong>Class:</strong> {cls(pf.id)?.name} {cls(pf.id)?.section}
            </div>
            <div>
              <strong>Fee Type:</strong> {printFee.feeType}
            </div>
            <div>
              <strong>Amount Paid:</strong> ₹{printFee.amountPaid}
            </div>
            <div>
              <strong>Total Due:</strong> ₹{printFee.totalDue}
            </div>
            <div>
              <strong>Status:</strong> {printFee.isPaid ? "PAID" : "PENDING"}
            </div>
            <div>
              <strong>Date:</strong> {printFee.date}
            </div>
          </div>
          <div className="rc-footer">
            <div>Cashier Signature: ___________</div>
            <div>Principal: {settings.principal}</div>
          </div>
        </div>
      )}

      {/* Edit Fee Modal */}
      {editFee && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="card"
            style={{ width: 360, padding: 24, position: "relative" }}
          >
            <button
              type="button"
              onClick={() => setEditFee(null)}
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
              Edit Fee - {student(editFee.studentId)?.name}
            </h3>
            <div className="form-group">
              <label htmlFor="edit-fee-type">Fee Type</label>
              <select
                id="edit-fee-type"
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="select-input"
                style={{ width: "100%" }}
              >
                {FEE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="edit-total-due">Total Fee Due (₹)</label>
              <input
                id="edit-total-due"
                type="number"
                value={editTotal}
                onChange={(e) => setEditTotal(e.target.value)}
                min={0}
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-amount-paid">Amount Paid (₹)</label>
              <input
                id="edit-amount-paid"
                type="number"
                value={editPaid}
                onChange={(e) => setEditPaid(e.target.value)}
                min={0}
              />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                type="button"
                className="btn-primary"
                onClick={saveEdit}
                style={{ flex: 1 }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditFee(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Call Confirmation Modal */}
      {callStudent && (
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
            className="card"
            style={{
              width: 340,
              padding: 28,
              textAlign: "center",
              position: "relative",
            }}
          >
            <button
              type="button"
              onClick={() => setCallStudent(null)}
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
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#22c55e22",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Phone size={26} color="#16a34a" />
            </div>
            <h3 style={{ fontWeight: 600, marginBottom: 6 }}>
              Fee Reminder Call
            </h3>
            <p style={{ color: "#555", marginBottom: 4, fontSize: 15 }}>
              {callStudent.name}
            </p>
            <p
              style={{
                color: "#333",
                fontWeight: 600,
                fontSize: 18,
                marginBottom: 16,
              }}
            >
              📞 {callStudent.phone}
            </p>
            <p style={{ color: "#888", fontSize: 13, marginBottom: 20 }}>
              Click "Call Now" to dial this number. The student/parent will
              receive a fees pending reminder.
            </p>
            <a
              href={`tel:${callStudent.phone}`}
              style={{
                display: "block",
                background: "#16a34a",
                color: "#fff",
                padding: "10px 0",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                marginBottom: 8,
              }}
              onClick={() => setCallStudent(null)}
            >
              📞 Call Now
            </a>
            <button
              type="button"
              className="btn-secondary"
              style={{ width: "100%" }}
              onClick={() => setCallStudent(null)}
            >
              Cancel
            </button>
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
            <option value={0}>All Classes</option>
            {sampleClasses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} - {c.section}
              </option>
            ))}
          </select>
        </div>
        <div className="fees-summary">
          <div className="stat-card">
            <div className="stat-num">
              ₹
              {fees
                .filter((f) => f.isPaid)
                .reduce((a, f) => a + f.amountPaid, 0)
                .toLocaleString()}
            </div>
            <div className="stat-label">Collected</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              ₹
              {fees
                .filter((f) => !f.isPaid)
                .reduce((a, f) => a + f.totalDue, 0)
                .toLocaleString()}
            </div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              {fees.filter((f) => f.isPaid).length}
            </div>
            <div className="stat-label">Paid</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">
              {fees.filter((f) => !f.isPaid).length}
            </div>
            <div className="stat-label">Due</div>
          </div>
        </div>
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Receipt No</th>
                <th>Student</th>
                <th>Class</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((f) => {
                const s = student(f.studentId);
                return (
                  <tr key={f.id}>
                    <td>{f.receiptNo}</td>
                    <td className="font-medium">{s?.name}</td>
                    <td>
                      {cls(f.studentId)?.name} {cls(f.studentId)?.section}
                    </td>
                    <td>{f.feeType}</td>
                    <td>₹{f.amountPaid}</td>
                    <td>₹{f.totalDue}</td>
                    <td>
                      {f.isPaid ? (
                        <span className="badge-green">Paid</span>
                      ) : (
                        <span className="badge-red">Pending</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="icon-action"
                        title="Edit Fee"
                        onClick={() => openEdit(f)}
                      >
                        <Edit2 size={15} />
                      </button>
                      {!f.isPaid && (
                        <>
                          <button
                            type="button"
                            className="icon-action"
                            title="Mark Paid"
                            onClick={() => markPaid(f.id)}
                          >
                            <Check size={15} />
                          </button>
                          <button
                            type="button"
                            className="icon-action"
                            title="Call for Fee Reminder"
                            onClick={() => handleCall(f)}
                            style={{ color: "#16a34a" }}
                          >
                            <Phone size={15} />
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        className="icon-action"
                        title="Print"
                        onClick={() => printReceipt(f)}
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
