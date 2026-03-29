import { School, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Header } from "../components/Header";
import { SCHOOL_INFO } from "../data/sampleData";

const STORAGE_KEY = "school_settings";
const LOGO_KEY = "school_logo";
const SIG_KEY = "school_signature";

export interface SchoolSettings {
  name: string;
  affiliation: string;
  email: string;
  yearEstablished: string;
  principal: string;
  logoUrl: string;
  signatureUrl: string;
}

export function getSchoolSettings(): SchoolSettings {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const base = {
      name: SCHOOL_INFO.name,
      affiliation: SCHOOL_INFO.affiliation,
      email: SCHOOL_INFO.email,
      yearEstablished: String(SCHOOL_INFO.yearEstablished),
      principal: SCHOOL_INFO.principal,
      logoUrl: localStorage.getItem(LOGO_KEY) || "",
      signatureUrl: localStorage.getItem(SIG_KEY) || "",
    };
    if (!saved) return base;
    return { ...base, ...JSON.parse(saved) };
  } catch {
    return {
      name: SCHOOL_INFO.name,
      affiliation: SCHOOL_INFO.affiliation,
      email: SCHOOL_INFO.email,
      yearEstablished: String(SCHOOL_INFO.yearEstablished),
      principal: SCHOOL_INFO.principal,
      logoUrl: "",
      signatureUrl: "",
    };
  }
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Settings() {
  const initial = getSchoolSettings();
  const [name, setName] = useState(initial.name);
  const [affiliation, setAffiliation] = useState(initial.affiliation);
  const [email, setEmail] = useState(initial.email);
  const [year, setYear] = useState(initial.yearEstablished);
  const [principal, setPrincipal] = useState(initial.principal);
  const [logoUrl, setLogoUrl] = useState(initial.logoUrl);
  const [signatureUrl, setSignatureUrl] = useState(initial.signatureUrl);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const sigInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const settings: SchoolSettings = {
      name,
      affiliation,
      email,
      yearEstablished: year,
      principal,
      logoUrl,
      signatureUrl,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    localStorage.setItem(LOGO_KEY, logoUrl);
    localStorage.setItem(SIG_KEY, signatureUrl);
    window.dispatchEvent(new Event("school-settings-updated"));
    toast.success("Settings saved successfully!");
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await readFileAsBase64(file);
      setLogoUrl(base64);
      localStorage.setItem(LOGO_KEY, base64);
      toast.success("Logo uploaded!");
    } catch {
      toast.error("Failed to upload logo.");
    }
    e.target.value = "";
  };

  const handleSigUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await readFileAsBase64(file);
      setSignatureUrl(base64);
      localStorage.setItem(SIG_KEY, base64);
      toast.success("Signature uploaded!");
    } catch {
      toast.error("Failed to upload signature.");
    }
    e.target.value = "";
  };

  return (
    <div className="page">
      <Header title="School Settings" />
      <div className="card settings-card">
        {/* Logo Section */}
        <div className="settings-logo">
          <div className="logo-placeholder">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="School Logo"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            ) : (
              <School size={48} />
            )}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              data-ocid="settings.upload_button"
              onClick={() => logoInputRef.current?.click()}
            >
              <Upload size={14} style={{ marginRight: 4 }} />
              Upload School Logo
            </button>
            {logoUrl && (
              <button
                type="button"
                className="btn-secondary"
                data-ocid="settings.delete_button"
                onClick={() => {
                  setLogoUrl("");
                  localStorage.removeItem(LOGO_KEY);
                  toast.success("Logo removed.");
                }}
                style={{ color: "#ef4444" }}
              >
                <X size={14} style={{ marginRight: 4 }} />
                Remove Logo
              </button>
            )}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleLogoUpload}
          />
        </div>

        {/* Form Fields */}
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="school-name">School Name</label>
            <input
              id="school-name"
              data-ocid="settings.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="affiliation">Affiliation Code</label>
            <input
              id="affiliation"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="year">Established Year</label>
            <input
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="principal">Principal Name</label>
            <input
              id="principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
            />
          </div>

          {/* Signature Section */}
          <div className="form-group">
            <label htmlFor="sig-upload-btn">
              Teacher / Principal Signature
            </label>
            {signatureUrl && (
              <div style={{ marginBottom: 8 }}>
                <img
                  src={signatureUrl}
                  alt="Signature"
                  style={{
                    maxHeight: 60,
                    border: "1px solid #e5e7eb",
                    borderRadius: 4,
                    padding: 4,
                    background: "#fff",
                  }}
                />
              </div>
            )}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                id="sig-upload-btn"
                type="button"
                className="btn-secondary"
                data-ocid="settings.upload_button"
                onClick={() => sigInputRef.current?.click()}
              >
                <Upload size={14} style={{ marginRight: 4 }} />
                {signatureUrl ? "Replace Signature" : "Upload Signature"}
              </button>
              {signatureUrl && (
                <button
                  type="button"
                  className="btn-secondary"
                  data-ocid="settings.delete_button"
                  onClick={() => {
                    setSignatureUrl("");
                    localStorage.removeItem(SIG_KEY);
                    toast.success("Signature removed.");
                  }}
                  style={{ color: "#ef4444" }}
                >
                  <X size={14} style={{ marginRight: 4 }} />
                  Remove
                </button>
              )}
            </div>
            <input
              ref={sigInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleSigUpload}
            />
          </div>

          <button
            type="button"
            className="btn-primary"
            data-ocid="settings.submit_button"
            style={{ marginTop: 16 }}
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
