import { Bell, Search } from "lucide-react";

interface HeaderProps {
  title: string;
  teacherName?: string;
}

export function Header({ title, teacherName = "Teacher" }: HeaderProps) {
  return (
    <header className="main-header no-print">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
      </div>
      <div className="header-right">
        <div className="search-box">
          <Search size={16} />
          <input placeholder="Search..." />
        </div>
        <button type="button" className="icon-btn">
          <Bell size={18} />
          <span className="badge">3</span>
        </button>
        <div className="user-chip">
          <div className="avatar">{teacherName[0]}</div>
          <span>{teacherName}</span>
        </div>
      </div>
    </header>
  );
}
