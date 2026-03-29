import { CheckSquare, CreditCard, GraduationCap, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Header } from "../components/Header";
import {
  SCHOOL_INFO,
  sampleAttendance,
  sampleClasses,
  sampleFees,
  sampleStudents,
} from "../data/sampleData";

const attData = [
  { date: "Mon", pct: 94 },
  { date: "Tue", pct: 96 },
  { date: "Wed", pct: 92 },
  { date: "Thu", pct: 97 },
  { date: "Fri", pct: 95 },
  { date: "Sat", pct: 89 },
];

export default function Dashboard() {
  const present = sampleAttendance.filter((a) => a.status === "present").length;
  const attPct = Math.round((present / sampleAttendance.length) * 100);
  const feesCollected = sampleFees
    .filter((f) => f.isPaid)
    .reduce((s, f) => s + f.amountPaid, 0);
  const feesDue = sampleFees.reduce((s, f) => s + f.totalDue, 0);
  const feesPct = Math.round((feesCollected / feesDue) * 100);

  const pieData = [
    { name: "Collected", value: feesCollected },
    { name: "Pending", value: feesDue - feesCollected },
  ];

  const recentStudents = sampleStudents.slice(-5).reverse();
  const cls = (id: number) => sampleClasses.find((c) => c.id === id);

  return (
    <div className="page">
      <Header title="Dashboard Overview" teacherName="Teacher" />
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#EEF2FF" }}>
            <Users size={22} color="#4F46E5" />
          </div>
          <div>
            <div className="stat-num">{sampleStudents.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#F0FDF4" }}>
            <CheckSquare size={22} color="#16A34A" />
          </div>
          <div>
            <div className="stat-num">{attPct}%</div>
            <div className="stat-label">Today's Attendance</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#FFF7ED" }}>
            <CreditCard size={22} color="#EA580C" />
          </div>
          <div>
            <div className="stat-num">
              ₹{(feesCollected / 1000).toFixed(0)}K
            </div>
            <div className="stat-label">Fees Collected ({feesPct}%)</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: "#F0F9FF" }}>
            <GraduationCap size={22} color="#0284C7" />
          </div>
          <div>
            <div className="stat-num">{sampleClasses.length}</div>
            <div className="stat-label">Total Classes</div>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <h3 className="card-title">Attendance Trends (This Week)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6EAF0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="pct"
                stroke="#1F3A5F"
                fill="#E8EFF8"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card chart-card">
          <h3 className="card-title">Fee Collection Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                dataKey="value"
              >
                <Cell fill="#1F3A5F" />
                <Cell fill="#22C55E" />
              </Pie>
              <Legend />
              <Tooltip
                formatter={(v: number) => `₹${(v / 1000).toFixed(1)}K`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Recent Students</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Adm No</th>
              <th>Name</th>
              <th>Class</th>
              <th>Father</th>
              <th>Phone</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentStudents.map((s) => (
              <tr key={s.id}>
                <td>{s.admissionNo}</td>
                <td className="font-medium">{s.name}</td>
                <td>
                  {cls(s.classId)?.name} {cls(s.classId)?.section}
                </td>
                <td>{s.fatherName}</td>
                <td>{s.phone}</td>
                <td>
                  <span className="badge-green">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
