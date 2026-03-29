export interface SClass {
  id: number;
  name: string;
  section: string;
}
export interface SStudent {
  id: number;
  name: string;
  rollNo: number;
  classId: number;
  dob: string;
  fatherName: string;
  motherName: string;
  phone: string;
  address: string;
  admissionNo: string;
  photoUrl: string;
}
export interface SAttendance {
  studentId: number;
  date: string;
  status: "present" | "absent" | "late";
}
export interface SResult {
  studentId: number;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
}
export interface SFee {
  id: number;
  studentId: number;
  feeType: string;
  amountPaid: number;
  totalDue: number;
  date: string;
  receiptNo: string;
  isPaid: boolean;
}

export const SCHOOL_INFO = {
  name: "Sunrise Public School",
  affiliation: "AFF-2024-SR",
  email: "info@sunrisepublicschool.edu",
  yearEstablished: 2001,
  principal: "Dr. Rajesh Kumar",
  logoUrl: "",
};

export const sampleClasses: SClass[] = [
  { id: 1, name: "Class 5", section: "A" },
  { id: 2, name: "Class 8", section: "B" },
  { id: 3, name: "Class 10", section: "C" },
];

export const sampleStudents: SStudent[] = [
  {
    id: 1,
    name: "Aarav Sharma",
    rollNo: 1,
    classId: 1,
    dob: "2014-03-15",
    fatherName: "Ramesh Sharma",
    motherName: "Sunita Sharma",
    phone: "9876543210",
    address: "12 MG Road, Delhi",
    admissionNo: "ADM001",
    photoUrl: "",
  },
  {
    id: 2,
    name: "Priya Singh",
    rollNo: 2,
    classId: 1,
    dob: "2014-07-22",
    fatherName: "Vijay Singh",
    motherName: "Meena Singh",
    phone: "9876543211",
    address: "45 Park Street, Delhi",
    admissionNo: "ADM002",
    photoUrl: "",
  },
  {
    id: 3,
    name: "Arjun Patel",
    rollNo: 3,
    classId: 1,
    dob: "2014-01-10",
    fatherName: "Suresh Patel",
    motherName: "Kavita Patel",
    phone: "9876543212",
    address: "78 Lake View, Delhi",
    admissionNo: "ADM003",
    photoUrl: "",
  },
  {
    id: 4,
    name: "Sneha Gupta",
    rollNo: 4,
    classId: 1,
    dob: "2014-09-05",
    fatherName: "Anil Gupta",
    motherName: "Pooja Gupta",
    phone: "9876543213",
    address: "23 Rose Garden, Delhi",
    admissionNo: "ADM004",
    photoUrl: "",
  },
  {
    id: 5,
    name: "Rohit Kumar",
    rollNo: 5,
    classId: 1,
    dob: "2014-11-18",
    fatherName: "Rakesh Kumar",
    motherName: "Anita Kumar",
    phone: "9876543214",
    address: "56 Sunflower Colony, Delhi",
    admissionNo: "ADM005",
    photoUrl: "",
  },
  {
    id: 6,
    name: "Kavya Verma",
    rollNo: 1,
    classId: 2,
    dob: "2011-04-20",
    fatherName: "Deepak Verma",
    motherName: "Rekha Verma",
    phone: "9876543215",
    address: "90 Green Park, Delhi",
    admissionNo: "ADM006",
    photoUrl: "",
  },
  {
    id: 7,
    name: "Harsh Mishra",
    rollNo: 2,
    classId: 2,
    dob: "2011-08-14",
    fatherName: "Rajiv Mishra",
    motherName: "Shobha Mishra",
    phone: "9876543216",
    address: "34 Civil Lines, Delhi",
    admissionNo: "ADM007",
    photoUrl: "",
  },
  {
    id: 8,
    name: "Diya Joshi",
    rollNo: 3,
    classId: 2,
    dob: "2011-12-30",
    fatherName: "Mahesh Joshi",
    motherName: "Usha Joshi",
    phone: "9876543217",
    address: "67 Lajpat Nagar, Delhi",
    admissionNo: "ADM008",
    photoUrl: "",
  },
  {
    id: 9,
    name: "Vivek Yadav",
    rollNo: 4,
    classId: 2,
    dob: "2011-06-08",
    fatherName: "Satish Yadav",
    motherName: "Geeta Yadav",
    phone: "9876543218",
    address: "11 Rohini, Delhi",
    admissionNo: "ADM009",
    photoUrl: "",
  },
  {
    id: 10,
    name: "Ananya Tiwari",
    rollNo: 5,
    classId: 2,
    dob: "2011-02-25",
    fatherName: "Pankaj Tiwari",
    motherName: "Sunita Tiwari",
    phone: "9876543219",
    address: "88 Dwarka, Delhi",
    admissionNo: "ADM010",
    photoUrl: "",
  },
  {
    id: 11,
    name: "Kiran Mehta",
    rollNo: 1,
    classId: 3,
    dob: "2009-05-12",
    fatherName: "Ashok Mehta",
    motherName: "Lata Mehta",
    phone: "9876543220",
    address: "22 Vasant Vihar, Delhi",
    admissionNo: "ADM011",
    photoUrl: "",
  },
  {
    id: 12,
    name: "Ravi Pandey",
    rollNo: 2,
    classId: 3,
    dob: "2009-09-19",
    fatherName: "Vinod Pandey",
    motherName: "Asha Pandey",
    phone: "9876543221",
    address: "55 Janakpuri, Delhi",
    admissionNo: "ADM012",
    photoUrl: "",
  },
  {
    id: 13,
    name: "Nisha Chauhan",
    rollNo: 3,
    classId: 3,
    dob: "2009-07-03",
    fatherName: "Sunil Chauhan",
    motherName: "Puja Chauhan",
    phone: "9876543222",
    address: "77 Pitampura, Delhi",
    admissionNo: "ADM013",
    photoUrl: "",
  },
  {
    id: 14,
    name: "Aditya Saxena",
    rollNo: 4,
    classId: 3,
    dob: "2009-11-27",
    fatherName: "Hemant Saxena",
    motherName: "Ritu Saxena",
    phone: "9876543223",
    address: "33 Mayur Vihar, Delhi",
    admissionNo: "ADM014",
    photoUrl: "",
  },
  {
    id: 15,
    name: "Pooja Rawat",
    rollNo: 5,
    classId: 3,
    dob: "2009-03-08",
    fatherName: "Dinesh Rawat",
    motherName: "Kamla Rawat",
    phone: "9876543224",
    address: "99 Noida Sector 18, UP",
    admissionNo: "ADM015",
    photoUrl: "",
  },
];

const today = new Date().toISOString().split("T")[0];
export const sampleAttendance: SAttendance[] = sampleStudents.map((s) => ({
  studentId: s.id,
  date: today,
  status: s.id % 5 === 0 ? "absent" : s.id % 7 === 0 ? "late" : "present",
}));

export const sampleResults: SResult[] = [
  ...sampleStudents.flatMap((s) => [
    {
      studentId: s.id,
      examName: "Mid Term",
      subject: "Mathematics",
      marksObtained: 75 + ((s.id * 3) % 25),
      totalMarks: 100,
    },
    {
      studentId: s.id,
      examName: "Mid Term",
      subject: "Science",
      marksObtained: 70 + ((s.id * 5) % 28),
      totalMarks: 100,
    },
    {
      studentId: s.id,
      examName: "Mid Term",
      subject: "English",
      marksObtained: 65 + ((s.id * 7) % 30),
      totalMarks: 100,
    },
    {
      studentId: s.id,
      examName: "Mid Term",
      subject: "Hindi",
      marksObtained: 80 + ((s.id * 2) % 20),
      totalMarks: 100,
    },
    {
      studentId: s.id,
      examName: "Mid Term",
      subject: "Social Studies",
      marksObtained: 72 + ((s.id * 4) % 22),
      totalMarks: 100,
    },
  ]),
];

export const sampleFees: SFee[] = sampleStudents.map((s, i) => ({
  id: i + 1,
  studentId: s.id,
  feeType: "Tuition",
  amountPaid: i % 3 === 0 ? 0 : 5000,
  totalDue: 5000,
  date: today,
  receiptNo: `RCP${String(i + 1).padStart(4, "0")}`,
  isPaid: i % 3 !== 0,
}));
