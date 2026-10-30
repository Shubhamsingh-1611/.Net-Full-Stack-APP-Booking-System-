// Dropdown values come from BRD section 2.5.1 (Form D1). Industries are
// admin-maintained in the real system, so prefer loading them from your API
// and pass them in via the `industries` prop.
export const DEFAULT_INDUSTRIES = [
  "Advertising and Marketing",
  "Aerospace",
  "Agriculture",
  "Computer and technology",
  "Construction",
  "Education",
  "Energy",
  "Entertainment",
  "Fashion",
  "Finance and Economic",
  "Food and Beverage",
  "Healthcare",
  "Hospitality",
  "Manufacturing",
  "Media and news",
  "Pharmaceutical",
  "Telecommunication",
  "Transportation",
];

export const JOB_STATUSES = ["Working", "Not Working"];

export const CANCEL_NOTICE =
  "Please fill Form D1 to use C-three Services or exit system";

// Read-only fields, in the order they appear on screen (SIMS-populated).
export const READ_ONLY_FIELDS = [
  { key: "fullName", label: "Full Name" },
  { key: "age", label: "Age" },
  { key: "piNumber", label: "PI Number" },
  { key: "ethnicity", label: "Ethnicity" },
  { key: "gender", label: "Gender" },
  { key: "nationality", label: "Nationality" },
  { key: "maritalStatus", label: "Marital Status" },
  { key: "highestQualification", label: "Highest Qualification" },
  { key: "enrolmentYearSem", label: "Enrollment Year/Sem" },
  { key: "school", label: "School" },
  { key: "studyMode", label: "Study Mode" },
  { key: "programName", label: "Program Name" },
  { key: "programCode", label: "Program Code" },
  { key: "studentStatus", label: "Student Status" },
  { key: "semesterIntake", label: "Semester Intake" },
  { key: "mobileNumber", label: "Mobile Number" },
  { key: "email", label: "My Mail" },
  { key: "address", label: "Address" },
  { key: "postalCode", label: "Postal Code" },
];