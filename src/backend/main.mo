import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat32 "mo:core/Nat32";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  type SchoolInfo = {
    name : Text;
    affiliation : Text;
    email : Text;
    yearEstablished : Nat;
    logoUrl : Text;
    principal : Text;
  };

  type Teacher = {
    name : Text;
    subject : Text;
    signature : Text;
  };

  type Student = {
    name : Text;
    rollNo : Nat;
    classId : Nat;
    dob : [Nat8];
    fatherName : Text;
    motherName : Text;
    phone : Text;
    address : Text;
    photoUrl : Text;
    admissionNo : Text;
  };

  type Class = {
    id : Nat;
    name : Text;
    section : Text;
  };

  type AttendanceStatus = {
    #present;
    #absent;
    #late;
  };

  type AttendanceRecord = {
    studentId : Nat;
    date : [Nat8];
    status : AttendanceStatus;
  };

  type ExamResult = {
    studentId : Nat;
    subject : Text;
    marksObtained : Nat;
    totalMarks : Nat;
    examName : Text;
  };

  type FeeType = {
    #tuition;
    #admission;
    #transport;
    #other : Text;
  };

  type FeeRecord = {
    studentId : Nat;
    amountPaid : Nat;
    totalDue : Nat;
    date : [Nat8];
    receiptNo : Text;
    feeType : FeeType;
    isPaid : Bool;
  };

  type AdmitCard = {
    studentId : Nat;
    examSchedule : Text; // JSON or serialized schedule
  };

  type UserProfile = {
    name : Text;
    role : Text; // "admin", "teacher", "parent", etc.
    email : Text;
  };

  type UserRole = AccessControl.UserRole;
  type AccessControlState = AccessControl.AccessControlState;

  // Persistent State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let teachers = Map.empty<Principal, Teacher>();
  let students = Map.empty<Nat, Student>();
  let classes = Map.empty<Nat, Class>();
  let attendances = Map.empty<Nat, [AttendanceRecord]>();
  let results = Map.empty<Nat, [ExamResult]>();
  let fees = Map.empty<Nat, [FeeRecord]>();
  let admitCards = Map.empty<Nat, AdmitCard>();

  var nextStudentId = 1;
  var nextClassId = 1;
  var nextReceiptNo = 1;

  module Student {
    public func compare(student1 : Student, student2 : Student) : Order.Order {
      Text.compare(student1.name, student2.name);
    };
  };

  module Class {
    public func compare(class1 : Class, class2 : Class) : Order.Order {
      Text.compare(class1.name, class2.name);
    };
  };

  // User Profile Management (Required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // School Info (public - basic information)
  public query func getSchoolInfo() : async SchoolInfo {
    {
      name = "Sunrise Public School";
      affiliation = "123456";
      email = "info@sunrise.edu";
      yearEstablished = 1998;
      logoUrl = "https://sunrise.edu/logo.png";
      principal = "Mrs. Sharma";
    };
  };

  // Teacher Management
  public shared ({ caller }) func registerTeacher(teacher : Teacher) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can register as teachers");
    };
    teachers.add(caller, teacher);
  };

  public shared ({ caller }) func updateTeacher(teacher : Teacher) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can update teacher profiles");
    };
    if (not teachers.containsKey(caller)) {
      Runtime.trap("Teacher profile not found");
    };
    teachers.add(caller, teacher);
  };

  public query ({ caller }) func getTeacher(teacherId : Principal) : async ?Teacher {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view teacher profiles");
    };
    teachers.get(teacherId);
  };

  public query ({ caller }) func listTeachers() : async [(Principal, Teacher)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can list teachers");
    };
    teachers.entries().toArray();
  };

  // Classes
  public shared ({ caller }) func createClass(name : Text, section : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can create classes");
    };

    let classId = nextClassId;
    nextClassId += 1;

    let newClass : Class = {
      id = classId;
      name;
      section;
    };

    classes.add(classId, newClass);
    classId;
  };

  public query ({ caller }) func listClasses() : async [Class] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can list classes");
    };
    classes.values().toArray().sort();
  };

  public query ({ caller }) func getClass(classId : Nat) : async ?Class {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view class details");
    };
    classes.get(classId);
  };

  // Students
  public shared ({ caller }) func addStudent(student : Student) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add students");
    };

    let studentId = nextStudentId;
    nextStudentId += 1;

    let newStudent : Student = {
      student with
      rollNo = studentId;
    };

    students.add(studentId, newStudent);
    studentId;
  };

  public shared ({ caller }) func updateStudent(studentId : Nat, student : Student) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update students");
    };
    if (not students.containsKey(studentId)) { 
      Runtime.trap("Student not found");
    };
    students.add(studentId, student);
  };

  public query ({ caller }) func getStudent(studentId : Nat) : async Student {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view student details");
    };
    switch (students.get(studentId)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
  };

  public query ({ caller }) func listStudentsByClass(classId : Nat) : async [Student] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can list students");
    };
    students.values().toArray().filter<Student>(func(student) { student.classId == classId }).sort();
  };

  public query ({ caller }) func listAllStudents() : async [Student] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can list students");
    };
    students.values().toArray().sort();
  };

  // Attendance
  public shared ({ caller }) func markAttendance(studentId : Nat, status : AttendanceStatus) : async () {
    // Allow both admins and teachers to mark attendance
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can mark attendance");
    };
    if (not AccessControl.isAdmin(accessControlState, caller) and not teachers.containsKey(caller)) {
      Runtime.trap("Unauthorized: Only admins and teachers can mark attendance");
    };

    let record : AttendanceRecord = {
      studentId;
      date = [];
      status;
    };
    switch (attendances.get(studentId)) {
      case (null) { attendances.add(studentId, [record]) };
      case (?existing) { 
        attendances.add(studentId, existing.concat([record]));
      };
    };
  };

  public query ({ caller }) func getAttendance(studentId : Nat) : async [AttendanceRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };
    switch (attendances.get(studentId)) {
      case (null) { [] };
      case (?records) { records };
    };
  };

  public query ({ caller }) func getAttendanceByClassAndDate(classId : Nat, date : [Nat8]) : async [(Nat, AttendanceStatus)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view attendance");
    };
    
    let classStudents = students.entries().toArray().filter(func(tuple) { tuple.1.classId == classId });
    
    classStudents.map<(Nat, Student), (Nat, AttendanceStatus)>(
      func((studentId, _) : (Nat, Student)) : (Nat, AttendanceStatus) {
        switch (attendances.get(studentId)) {
          case (null) { (studentId, #absent) };
          case (?records) {
            let todayRecord = records.find(func(r : AttendanceRecord) : Bool { r.date == date });
            switch (todayRecord) {
              case (null) { (studentId, #absent) };
              case (?record) { (studentId, record.status) };
            };
          };
        };
      }
    );
  };

  // Results
  public shared ({ caller }) func addExamResult(result : ExamResult) : async () {
    // Allow both admins and teachers to add results
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can add results");
    };
    if (not AccessControl.isAdmin(accessControlState, caller) and not teachers.containsKey(caller)) {
      Runtime.trap("Unauthorized: Only admins and teachers can add exam results");
    };

    switch (results.get(result.studentId)) {
      case (null) { results.add(result.studentId, [result]) };
      case (?existing) { 
        results.add(result.studentId, existing.concat([result]));
      };
    };
  };

  public query ({ caller }) func getStudentResults(studentId : Nat) : async [ExamResult] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view results");
    };
    switch (results.get(studentId)) {
      case (null) { [] };
      case (?studentResults) { studentResults };
    };
  };

  public query ({ caller }) func getResultSummary(studentId : Nat, examName : Text) : async {
    totalMarks : Nat;
    obtainedMarks : Nat;
    percentage : Float;
    results : [ExamResult];
  } {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view result summaries");
    };

    switch (results.get(studentId)) {
      case (null) { 
        { totalMarks = 0; obtainedMarks = 0; percentage = 0.0; results = [] };
      };
      case (?allResults) {
        let examResults = allResults.filter(func(r : ExamResult) : Bool { r.examName == examName });
        var totalMarks = 0;
        var obtainedMarks = 0;
        
        for (result in examResults.values()) {
          totalMarks += result.totalMarks;
          obtainedMarks += result.marksObtained;
        };
        
        let percentage = if (totalMarks > 0) {
          obtainedMarks.toFloat() / totalMarks.toFloat() * 100.0;
        } else {
          0.0;
        };
        
        { totalMarks; obtainedMarks; percentage; results = examResults };
      };
    };
  };

  // Fees
  public shared ({ caller }) func recordFeePayment(studentId : Nat, amountPaid : Nat, totalDue : Nat, feeType : FeeType) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can record fees");
    };

    let receiptNo = nextReceiptNo.toText();
    nextReceiptNo += 1;

    let feeRecord : FeeRecord = {
      studentId;
      amountPaid;
      totalDue;
      date = [];
      receiptNo;
      feeType;
      isPaid = (totalDue <= amountPaid);
    };

    switch (fees.get(studentId)) {
      case (null) { fees.add(studentId, [feeRecord]) };
      case (?existing) { 
        fees.add(studentId, existing.concat([feeRecord]));
      };
    };
  };

  public shared ({ caller }) func updatePaymentStatus(studentId : Nat, receiptNo : Text, isPaid : Bool) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };
    switch (fees.get(studentId)) {
      case (null) { Runtime.trap("Fee record not found") };
      case (?feeRecords) {
        let updatedRecords = feeRecords.map(
          func(fee : FeeRecord) : FeeRecord { 
            if (fee.receiptNo == receiptNo) {
              { fee with isPaid };
            } else { 
              fee;
            };
          }
        );
        fees.add(studentId, updatedRecords);
      };
    };
  };

  public query ({ caller }) func getStudentFees(studentId : Nat) : async [FeeRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view fee records");
    };
    switch (fees.get(studentId)) {
      case (null) { [] };
      case (?feeRecords) { feeRecords };
    };
  };

  // Admit Cards
  public shared ({ caller }) func generateAdmitCard(studentId : Nat, examSchedule : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can generate admit cards");
    };
    let admitCard : AdmitCard = {
      studentId;
      examSchedule;
    };
    admitCards.add(studentId, admitCard);
  };

  public query ({ caller }) func getAdmitCard(studentId : Nat) : async AdmitCard {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can view admit cards");
    };
    switch (admitCards.get(studentId)) {
      case (null) { Runtime.trap("Admit card not found") };
      case (?admitCard) { admitCard };
    };
  };
};
