const students = [
  {
    email: "Client@singhofficial1611gmail.onmicrosoft.com",
    fullName: "Sample Student",
    dob: "1996-04-01",
    piNumber: "0000000",
    ethnicity: "South Asian",
    gender: "Male",
    nationality: "Singaporean",
    maritalStatus: "Single",
    highestQualification: "—",
    enrolmentYearSem: "—",
    school: "—",
    studyMode: "Full Time",
    programName: "—",
    programCode: "—",
    studentStatus: "Active",
    semesterIntake: "—",
    mobileNumber: "+65 6248 1600",
    address: "—",
    postalCode: "000000",
  },
];

export function findStudentByEmail(email) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return undefined;

  return students.find(
    (student) => student.email.trim().toLowerCase() === normalizedEmail
  );
}
