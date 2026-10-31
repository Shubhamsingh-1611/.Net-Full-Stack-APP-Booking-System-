import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Link, useLocation } from "react-router-dom";
import { findStudentByEmail } from "../data/students.js";
import { DEFAULT_INDUSTRIES, JOB_STATUSES } from "../utils/D1Constant.js";
import { calculateAge, validateD1 } from "../utils/D1Validations.js";
import { SelectField, TextField } from "../utils/D1Fields.jsx";

const PROFILE_FIELDS = [
  ["Full Name", "fullName"],
  ["Age (as of this year)", "age"],
  ["PI Number", "piNumber"],
  ["Ethnicity", "ethnicity"],
  ["Gender", "gender"],
  ["Nationality", "nationality"],
  ["Marital Status", "maritalStatus"],
  ["Highest Qualification", "highestQualification"],
  ["Enrolment Year/Sem", "enrolmentYearSem"],
  ["School", "school"],
  ["Study Mode", "studyMode"],
  ["Program Name", "programName"],
  ["Program Code", "programCode"],
  ["Program Level", "programLevel"],
  ["Student Status", "studentStatus"],
  ["Semester Intake", "semesterIntake"],
  ["My Mail", "email"],
  ["Mobile Number", "mobileNumber"],
  ["Address", "address"],
  ["Postal Code", "postalCode"],
];

const CONTACT_FIELDS = [
  ["Preferred Mobile", "preferredMobile", "tel"],
  ["Confirm Preferred Mobile Number", "confirmMobile", "tel"],
  ["Preferred Email", "preferredEmail", "email"],
  ["Confirm Preferred Email", "confirmEmail", "email"],
  ["Preferred Emergency Person", "emergencyContactPerson", "text"],
  ["Relationship To Client", "relationshipToClient", "text"],
  ["Emergency Person's Mobile", "emergencyContactMobile", "tel"],
];

const VALIDATION_KEYS = {
  preferredMobile: "preferredMobile",
  confirmMobile: "confirmMobile",
  preferredEmail: "preferredEmail",
  confirmEmail: "confirmEmail",
  jobStatus: "jobStatus",
  industryWorkingAt: "industry",
  emergencyContactPerson: "emergencyName",
  relationshipToClient: "emergencyRelation",
  emergencyContactMobile: "emergencyMobile",
};

export default function Profile() {
  const { accounts, instance } = useMsal();
  const location = useLocation();
  const account = instance.getActiveAccount() ?? accounts[0];
  const claims = account?.idTokenClaims ?? {};
  const email =
    claims.email ?? claims.preferred_username ?? account?.username ?? "";
  const studentRecord = location.state?.student ?? findStudentByEmail(email);
  const student = studentRecord
    ? {
        ...studentRecord,
        age: studentRecord.age ?? calculateAge(studentRecord.dob),
        email: studentRecord.email ?? email,
      }
    : null;
  const submission = location.state?.submission ?? {};
  const initialContact = {
    preferredMobile: submission.preferredMobile ?? "",
    confirmMobile: submission.preferredMobile ?? "",
    preferredEmail: submission.preferredEmail ?? "",
    confirmEmail: submission.preferredEmail ?? "",
    jobStatus:
      submission.jobStatus === undefined
        ? ""
        : submission.jobStatus
          ? "Working"
          : "Not Working",
    industryWorkingAt: submission.industryWorkingAt ?? "",
    emergencyContactPerson: submission.emergencyContactPerson ?? "",
    relationshipToClient: submission.relationshipToClient ?? "",
    emergencyContactMobile: submission.emergencyContactMobile ?? "",
  };
  const [contact, setContact] = useState(initialContact);
  const [saved, setSaved] = useState(false);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const validationValues = {
    ...contact,
    industry: contact.industryWorkingAt,
    emergencyName: contact.emergencyContactPerson,
    emergencyRelation: contact.relationshipToClient,
    emergencyMobile: contact.emergencyContactMobile,
    agreement: true,
    declaration: true,
  };
  const errors = validateD1(validationValues, student);
  const visibleError = (name) =>
    submitted || touched[name] ? errors[VALIDATION_KEYS[name]] : undefined;

  const handleContactChange = (name, value) => {
    setContact((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const handleContactBlur = (name) =>
    setTouched((current) => ({ ...current, [name]: true }));

  const handleSave = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setSaved(true);
  };

  if (!student) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p role="alert" className="text-red-800">
          No profile is configured for this account.
        </p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white font-[Poppins,'Segoe_UI',system-ui,sans-serif] text-[#111827]">
      <header className="flex min-h-[100px] items-center justify-between gap-6 bg-[#fafafa] px-3 py-4">
        <div className="flex items-center gap-3 text-[#123b69]">
          <span className="text-[30px] font-bold leading-none tracking-tight">
            <span className="text-[#e31937]">S</span>USS
          </span>
          <span className="h-10 w-px bg-[#123b69]" />
          <span className="max-w-40 text-[12px] font-bold uppercase leading-[1.15]">
            C-Three
            <br />
            Counselling &amp;
            <br />
            Life Coaching
          </span>
        </div>
        <div className="flex items-start gap-2 text-right text-[#526174]">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mt-0.5 h-4 w-4 fill-current"
          >
            <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
          </svg>
          <div className="max-w-[260px] text-sm">
            <div className="break-all">{email}</div>
            <div>Student</div>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-100px)] flex-col md:flex-row">
        <aside className="w-full shrink-0 bg-[#fafafa] md:w-[280px]">
          <nav
            aria-label="Student portal"
            className="flex gap-1 overflow-x-auto px-3 py-3 md:flex-col md:gap-0 md:px-0 md:py-2"
          >
            <Link
              to="/profile"
              aria-current="page"
              className="shrink-0 px-3 py-3 text-sm text-red-600 md:px-5"
            >
              Profile
            </Link>
            {[
              "Services",
              "Manage Bookings",
              "FAQ",
              "Instructions on how to book",
              "Sign Out",
              "About",
            ].map((item) => (
              <span
                key={item}
                className="shrink-0 px-3 py-3 text-sm text-[#111827] md:px-5"
              >
                {item}
              </span>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-4 pb-10 pt-5 md:px-0">
          <div className="w-full max-w-[988px]">
          {location.state?.submissionSucceeded && (
            <p
              role="status"
              className="mb-5 border-l-4 border-green-700 bg-green-50 p-3 text-sm text-green-800"
            >
              Your D1 form has been submitted successfully.
            </p>
          )}

          <section aria-labelledby="personal-details-heading">
            <h1
              id="personal-details-heading"
              className="border-b-[5px] border-[#00466a] px-2.5 pb-2 text-[25px] font-normal text-[#4d4d4d]"
            >
              Personal Details
            </h1>
            <dl className="grid grid-cols-1 gap-x-5 gap-y-12 bg-[#fafafa] px-5 py-8 sm:grid-cols-2 lg:grid-cols-3">
              {PROFILE_FIELDS.map(([label, key]) => (
                <div key={key} className="min-w-0">
                  <dt className="mb-3 px-2.5 text-sm text-[#38506a]">
                    {label}
                  </dt>
                  <dd className="m-0 truncate border border-[#c9c9c9] bg-[#e6e6e6] px-2.5 py-2 text-base text-[#111827]">
                    {student[key] || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="contact-details-heading" className="mt-10">
            <h2
              id="contact-details-heading"
              className="border-b-[5px] border-[#00466a] px-2.5 pb-2 text-[25px] font-normal text-[#4d4d4d]"
            >
              Contact Details
            </h2>
            <form
              className="bg-neutral-100 px-3 pb-5 pt-6"
              onSubmit={handleSave}
              noValidate
            >
              <div className="grid grid-cols-1 gap-x-3.5 gap-y-[22px] sm:grid-cols-2 lg:grid-cols-3">
                {CONTACT_FIELDS.slice(0, 4).map(([label, name, type]) => (
                  <TextField
                    key={name}
                    id={name}
                    label={label}
                    type={type}
                    required
                    value={contact[name]}
                    onChange={handleContactChange}
                    onBlur={handleContactBlur}
                    error={visibleError(name)}
                  />
                ))}
                <SelectField
                    id="jobStatus"
                    label="Job Status"
                    value={contact.jobStatus}
                    options={JOB_STATUSES}
                    onChange={handleContactChange}
                    onBlur={handleContactBlur}
                    error={visibleError("jobStatus")}
                  />
                <SelectField
                    id="industryWorkingAt"
                    label="Industry Working At"
                    value={contact.industryWorkingAt}
                    options={DEFAULT_INDUSTRIES}
                    onChange={handleContactChange}
                    onBlur={handleContactBlur}
                    error={visibleError("industryWorkingAt")}
                  />
                {CONTACT_FIELDS.slice(4).map(([label, name, type]) => (
                  <TextField
                    key={name}
                    id={name}
                    label={label}
                    type={type}
                    required
                    value={contact[name]}
                    onChange={handleContactChange}
                    onBlur={handleContactBlur}
                    error={visibleError(name)}
                  />
                ))}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-1">
                <button
                  type="submit"
                  className="h-9 min-w-[115px] rounded-sm bg-[#00466a] px-[22px] text-[12.5px] font-medium uppercase tracking-wide text-white hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContact(initialContact);
                    setTouched({});
                    setSubmitted(false);
                    setSaved(false);
                  }}
                  className="h-9 min-w-[115px] rounded-sm bg-[#555] px-[22px] text-[12.5px] font-medium uppercase tracking-wide text-white hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  CANCEL
                </button>
                {saved && (
                  <span role="status" className="ml-3 text-sm text-green-800">
                    Changes saved for this session.
                  </span>
                )}
              </div>
              <p className="mt-10 text-sm text-[#526174]">
                To learn more about how to use this booking portal, please{" "}
                <a href="#help" className="ml-2 text-[#0074b8] hover:underline">
                  Click here
                </a>
              </p>
            </form>
          </section>
          </div>
        </main>
      </div>
    </div>
  );
}
