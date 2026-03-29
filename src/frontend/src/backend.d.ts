import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Class {
    id: bigint;
    name: string;
    section: string;
}
export interface FeeRecord {
    studentId: bigint;
    date: Uint8Array;
    feeType: FeeType;
    isPaid: boolean;
    totalDue: bigint;
    amountPaid: bigint;
    receiptNo: string;
}
export interface SchoolInfo {
    principal: string;
    yearEstablished: bigint;
    name: string;
    email: string;
    logoUrl: string;
    affiliation: string;
}
export interface AdmitCard {
    studentId: bigint;
    examSchedule: string;
}
export type FeeType = {
    __kind__: "other";
    other: string;
} | {
    __kind__: "transport";
    transport: null;
} | {
    __kind__: "tuition";
    tuition: null;
} | {
    __kind__: "admission";
    admission: null;
};
export interface ExamResult {
    totalMarks: bigint;
    studentId: bigint;
    subject: string;
    marksObtained: bigint;
    examName: string;
}
export interface AttendanceRecord {
    status: AttendanceStatus;
    studentId: bigint;
    date: Uint8Array;
}
export interface Teacher {
    signature: string;
    subject: string;
    name: string;
}
export interface UserProfile {
    name: string;
    role: string;
    email: string;
}
export interface Student {
    dob: Uint8Array;
    name: string;
    motherName: string;
    photoUrl: string;
    classId: bigint;
    fatherName: string;
    address: string;
    admissionNo: string;
    phone: string;
    rollNo: bigint;
}
export enum AttendanceStatus {
    present = "present",
    late = "late",
    absent = "absent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addExamResult(result: ExamResult): Promise<void>;
    addStudent(student: Student): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClass(name: string, section: string): Promise<bigint>;
    generateAdmitCard(studentId: bigint, examSchedule: string): Promise<void>;
    getAdmitCard(studentId: bigint): Promise<AdmitCard>;
    getAttendance(studentId: bigint): Promise<Array<AttendanceRecord>>;
    getAttendanceByClassAndDate(classId: bigint, date: Uint8Array): Promise<Array<[bigint, AttendanceStatus]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClass(classId: bigint): Promise<Class | null>;
    getResultSummary(studentId: bigint, examName: string): Promise<{
        totalMarks: bigint;
        results: Array<ExamResult>;
        obtainedMarks: bigint;
        percentage: number;
    }>;
    getSchoolInfo(): Promise<SchoolInfo>;
    getStudent(studentId: bigint): Promise<Student>;
    getStudentFees(studentId: bigint): Promise<Array<FeeRecord>>;
    getStudentResults(studentId: bigint): Promise<Array<ExamResult>>;
    getTeacher(teacherId: Principal): Promise<Teacher | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllStudents(): Promise<Array<Student>>;
    listClasses(): Promise<Array<Class>>;
    listStudentsByClass(classId: bigint): Promise<Array<Student>>;
    listTeachers(): Promise<Array<[Principal, Teacher]>>;
    markAttendance(studentId: bigint, status: AttendanceStatus): Promise<void>;
    recordFeePayment(studentId: bigint, amountPaid: bigint, totalDue: bigint, feeType: FeeType): Promise<void>;
    registerTeacher(teacher: Teacher): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updatePaymentStatus(studentId: bigint, receiptNo: string, isPaid: boolean): Promise<void>;
    updateStudent(studentId: bigint, student: Student): Promise<void>;
    updateTeacher(teacher: Teacher): Promise<void>;
}
