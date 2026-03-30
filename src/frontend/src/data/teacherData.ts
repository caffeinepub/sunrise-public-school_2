export interface Teacher {
  id: number;
  name: string;
  designation: string;
  qualification: string;
  subject: string;
  classAssigned: string;
  phone: string;
  accountNumber: string;
  branchName: string;
  ifscCode: string;
  aadharNumber: string;
  caste: string;
  gender: string;
  maritalStatus: string;
  dob: string;
  joiningDate: string;
  fatherName: string;
  motherName: string;
  active: boolean;
  photo?: string;
}

export const sampleTeachers: Teacher[] = [
  {
    id: 1,
    name: "Mrs. Sunita Sharma",
    designation: "Senior Teacher",
    qualification: "M.Sc, B.Ed",
    subject: "Mathematics",
    classAssigned: "Class 5-A",
    phone: "9811001001",
    accountNumber: "35901234567890",
    branchName: "SBI Main Branch, Lucknow",
    ifscCode: "SBIN0001234",
    aadharNumber: "2341 5678 9012",
    caste: "General",
    gender: "Female",
    maritalStatus: "Married",
    dob: "1985-06-14",
    joiningDate: "2010-07-01",
    fatherName: "Shri Ram Prasad Sharma",
    motherName: "Smt. Kamla Sharma",
    active: true,
  },
  {
    id: 2,
    name: "Mr. Rajesh Verma",
    designation: "Assistant Teacher",
    qualification: "B.Sc, B.Ed",
    subject: "Science",
    classAssigned: "Class 8-B",
    phone: "9811001002",
    accountNumber: "12340056789012",
    branchName: "PNB City Branch, Kanpur",
    ifscCode: "PUNB0056700",
    aadharNumber: "3456 7890 1234",
    caste: "OBC",
    gender: "Male",
    maritalStatus: "Married",
    dob: "1982-03-22",
    joiningDate: "2008-06-15",
    fatherName: "Shri Mahesh Verma",
    motherName: "Smt. Savitri Verma",
    active: true,
  },
  {
    id: 3,
    name: "Mrs. Priya Joshi",
    designation: "Head Teacher",
    qualification: "M.A (English), B.Ed",
    subject: "English",
    classAssigned: "Class 10-C",
    phone: "9811001003",
    accountNumber: "50780012345678",
    branchName: "Bank of Baroda, Varanasi",
    ifscCode: "BARB0VARASI",
    aadharNumber: "4567 8901 2345",
    caste: "General",
    gender: "Female",
    maritalStatus: "Married",
    dob: "1979-11-05",
    joiningDate: "2005-04-01",
    fatherName: "Shri Dinesh Joshi",
    motherName: "Smt. Rekha Joshi",
    active: true,
  },
  {
    id: 4,
    name: "Mr. Anil Tiwari",
    designation: "Assistant Teacher",
    qualification: "M.A (Hindi), B.Ed",
    subject: "Hindi",
    classAssigned: "Class 5-A",
    phone: "9811001004",
    accountNumber: "20100098765432",
    branchName: "Allahabad Bank, Agra",
    ifscCode: "ALLA0210034",
    aadharNumber: "5678 9012 3456",
    caste: "General",
    gender: "Male",
    maritalStatus: "Unmarried",
    dob: "1990-08-30",
    joiningDate: "2016-07-01",
    fatherName: "Shri Suresh Tiwari",
    motherName: "Smt. Geeta Tiwari",
    active: false,
  },
  {
    id: 5,
    name: "Mrs. Kavita Rai",
    designation: "Assistant Teacher",
    qualification: "M.A (History), B.Ed",
    subject: "Social Studies",
    classAssigned: "Class 8-B",
    phone: "9811001005",
    accountNumber: "60310056781234",
    branchName: "Union Bank, Prayagraj",
    ifscCode: "UBIN0560310",
    aadharNumber: "6789 0123 4567",
    caste: "SC",
    gender: "Female",
    maritalStatus: "Married",
    dob: "1987-01-17",
    joiningDate: "2012-01-15",
    fatherName: "Shri Vinod Rai",
    motherName: "Smt. Usha Rai",
    active: true,
  },
];

const STORAGE_KEY = "school_teachers";

export function getTeachers(): Teacher[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Teacher[];
  } catch {
    // ignore
  }
  return sampleTeachers;
}

export function saveTeachers(teachers: Teacher[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
}

export function getTeacherById(id: number): Teacher | undefined {
  return getTeachers().find((t) => t.id === id);
}

export function updateTeacher(updated: Teacher): void {
  const teachers = getTeachers().map((t) =>
    t.id === updated.id ? updated : t,
  );
  saveTeachers(teachers);
}

export function addTeacher(teacher: Omit<Teacher, "id">): Teacher {
  const teachers = getTeachers();
  const newId =
    teachers.length > 0 ? Math.max(...teachers.map((t) => t.id)) + 1 : 1;
  const newTeacher = { ...teacher, id: newId };
  saveTeachers([...teachers, newTeacher]);
  return newTeacher;
}
