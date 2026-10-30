// Validation rules follow BRD section 2.5.1 and "Form D1 Validations".

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Strips spaces/dashes and a leading +65 / 65 so only the 8 digits remain. */
export function normalizeSgMobile(value = "") {
  let s = String(value).replace(/[\s\-()]/g, "");
  if (s.startsWith("+65")) s = s.slice(3);
  else if (/^65\d{8}$/.test(s)) s = s.slice(2);
  return s;
}

/** 8 digits, starting with 3, 8 or 9. */
export function isValidSgMobile(value) {
  return /^[389]\d{7}$/.test(normalizeSgMobile(value));
}

export function isValidEmail(value = "") {
  return EMAIL_RE.test(value.trim());
}

/** Age by year + month difference, as described in the BRD. */
export function calculateAge(dob, today = new Date()) {
  if (!dob) return "";
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return "";
  let years = today.getFullYear() - d.getFullYear();
  if (today.getMonth() < d.getMonth()) years -= 1;
  return years;
}

export const MSG = {
  preferredMobileEmpty:
    "Please enter a valid Singapore-registered mobile number starting with '3', '8' or '9'",
  preferredMobileInvalid:
    "Please enter a valid Singapore-registered mobile number starting with '3', '8' or '9'",
  confirmMobileEmpty: "Please confirm by re-typing the same mobile number as above.",
  confirmMobileMismatch: "Mobile Number does not match",
  preferredEmailEmpty:
    "Please key in your preferred email address for us to contact you.",
  preferredEmailInvalid: "Invalid Email Address.",
  confirmEmailEmpty: "Please confirm by re-typing the same email address as above.",
  confirmEmailMismatch: "Email address should be same.",
  jobStatus: "Please select 'Working' or 'Not Working'",
  industry: "Please select from the list.",
  emergencyName:
    "Please input the name of person for us to contact in case of an Emergency.",
  emergencyRelation:
    "Please state the relationship of the Emergency Contact Person with you.",
  emergencyMobileEmpty:
    "Please input the mobile number of the Emergency Contact Person",
  emergencyMobileInvalid:
    "Please enter a valid Singapore-registered mobile number starting with '3', '8' or '9'",
  // The two messages below are not in the BRD text; confirm wording with your team.
  emergencySameAsPreferred:
    "Emergency contact number must be different from your preferred mobile number.",
  emergencySameAsSims:
    "Emergency contact number must be different from your registered mobile number.",
  agreement: "Please accept the Client/Counsellor Agreement to continue.",
  declaration: "Please accept the Declaration to continue.",
};

export function validateD1(values, student = {}) {
  const e = {};
  const v = (k) => (values[k] ?? "").toString().trim();

  // Preferred mobile
  if (!v("preferredMobile")) e.preferredMobile = MSG.preferredMobileEmpty;
  else if (!isValidSgMobile(v("preferredMobile")))
    e.preferredMobile = MSG.preferredMobileInvalid;

  // Confirm mobile
  if (!v("confirmMobile")) e.confirmMobile = MSG.confirmMobileEmpty;
  else if (
    normalizeSgMobile(v("confirmMobile")) !== normalizeSgMobile(v("preferredMobile"))
  )
    e.confirmMobile = MSG.confirmMobileMismatch;

  // Preferred email
  if (!v("preferredEmail")) e.preferredEmail = MSG.preferredEmailEmpty;
  else if (!isValidEmail(v("preferredEmail")))
    e.preferredEmail = MSG.preferredEmailInvalid;

  // Confirm email
  if (!v("confirmEmail")) e.confirmEmail = MSG.confirmEmailEmpty;
  else if (v("confirmEmail").toLowerCase() !== v("preferredEmail").toLowerCase())
    e.confirmEmail = MSG.confirmEmailMismatch;

  if (!v("jobStatus")) e.jobStatus = MSG.jobStatus;
  if (!v("industry")) e.industry = MSG.industry;

  if (!v("emergencyName")) e.emergencyName = MSG.emergencyName;
  else if (v("emergencyName").length > 255) e.emergencyName = "Maximum 255 characters.";

  if (!v("emergencyRelation")) e.emergencyRelation = MSG.emergencyRelation;
  else if (v("emergencyRelation").length > 255)
    e.emergencyRelation = "Maximum 255 characters.";

  // Emergency mobile
  if (!v("emergencyMobile")) e.emergencyMobile = MSG.emergencyMobileEmpty;
  else if (!isValidSgMobile(v("emergencyMobile")))
    e.emergencyMobile = MSG.emergencyMobileInvalid;
  else if (
    normalizeSgMobile(v("emergencyMobile")) === normalizeSgMobile(v("preferredMobile"))
  )
    e.emergencyMobile = MSG.emergencySameAsPreferred;
  else if (
    student.mobileNumber &&
    normalizeSgMobile(v("emergencyMobile")) === normalizeSgMobile(student.mobileNumber)
  )
    e.emergencyMobile = MSG.emergencySameAsSims;

  if (!values.agreement) e.agreement = MSG.agreement;
  if (!values.declaration) e.declaration = MSG.declaration;

  return e;
}