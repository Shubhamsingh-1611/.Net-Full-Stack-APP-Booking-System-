import { useMemo, useRef, useState } from "react";
import {
  CANCEL_NOTICE,
  DEFAULT_INDUSTRIES,
  JOB_STATUSES,
  READ_ONLY_FIELDS,
} from "../utils/D1Constant.js";
import { calculateAge, normalizeSgMobile, validateD1 } from "../utils/D1Validations.js";
import { CheckboxBlock, ReadOnlyField, SelectField, TextField } from "../utils/D1Fields.jsx";

const btn =
  "h-9 w-full rounded-sm px-[22px] text-[12.5px] font-medium uppercase tracking-wide text-white " +
  "hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto";

const INITIAL = {
  preferredMobile: "",
  confirmMobile: "",
  preferredEmail: "",
  confirmEmail: "",
  jobStatus: "",
  industry: "",
  emergencyName: "",
  emergencyRelation: "",
  emergencyMobile: "",
  agreement: false,
  declaration: false,
};

// Order used to focus the first invalid field on submit.
const FIELD_ORDER = [
  "preferredMobile",
  "confirmMobile",
  "preferredEmail",
  "confirmEmail",
  "jobStatus",
  "industry",
  "emergencyName",
  "emergencyRelation",
  "emergencyMobile",
  "agreement",
  "declaration",
];

/**
 * Form D1 – client intake form.
 *
 * Props
 *  - student:   SIMS data (fullName, piNumber, dob or age, ethnicity, gender, ...).
 *               Shown read-only; never editable by the client.
 *  - industries: optional list of industries (admin-maintained in the backend).
 *  - onSubmit(payload): called with cleaned values once validation passes.
 *  - onCancel(): called when the client clicks Cancel.
 *  - submitting: disables the buttons while a request is in flight.
 */
export default function FormD1({
  student = {},
  industries = DEFAULT_INDUSTRIES,
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const [values, setValues] = useState(INITIAL);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showCancelNotice, setShowCancelNotice] = useState(false);
  const formRef = useRef(null);

  const errors = useMemo(() => validateD1(values, student), [values, student]);

  const visibleError = (key) =>
    submitted || touched[key] ? errors[key] : undefined;

  const handleChange = (key, val) => {
    setValues((prev) => ({ ...prev, [key]: val }));
    setShowCancelNotice(false);
  };
  
  const handleBlur = (key) => setTouched((prev) => ({ ...prev, [key]: true }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const firstBad = FIELD_ORDER.find((k) => errors[k]);
    if (firstBad) {
      formRef.current?.querySelector(`#${firstBad}`)?.focus();
      return;
    }

   onSubmit?.({
  piNumber: student.piNumber,
  preferredMobile: normalizeSgMobile(values.preferredMobile),
  preferredEmail: values.preferredEmail.trim(),
  jobStatus: values.jobStatus === "Working",   // check your JOB_STATUSES value
  industryWorkingAt: values.industry,
  emergencyContactPerson: values.emergencyName.trim(),
  relationshipToClient: values.emergencyRelation.trim(),
  emergencyContactMobile: normalizeSgMobile(values.emergencyMobile),
  isClientAgreement: values.agreement,
  isDeclaration: values.declaration,
});
  };

  // Cancel keeps the form exactly as it was and shows the BRD-specified notice.
  const handleCancel = () => {
    setShowCancelNotice(true);
    onCancel?.();
  };

  const readOnlyValues = {
    ...student,
    age: student.age ?? calculateAge(student.dob),
  };

  const today = new Date().toLocaleDateString("en-SG", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const shared = { onChange: handleChange, onBlur: handleBlur };

  return (
    <section className="max-w-[100%] font-[Poppins,'Segoe_UI',system-ui,sans-serif] text-neutral-700">
      <h1 className="mb-6 border-b-[3px] border-[#1b3556] pb-2 text-[22px] font-medium text-neutral-800">
        Form D1
      </h1>

      <form ref={formRef} className="bg-neutral-100 px-3 pb-5 pt-6" onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 gap-x-3.5 gap-y-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {READ_ONLY_FIELDS.map((f) => (
            <ReadOnlyField
              key={f.key}
              id={`ro-${f.key}`}
              label={f.label}
              value={readOnlyValues[f.key]}
            />
          ))}

          <TextField
            id="preferredMobile"
            label="Preferred Mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="+65 6248 9777"
            value={values.preferredMobile}
            error={visibleError("preferredMobile")}
            {...shared}
          />
          <TextField
            id="confirmMobile"
            label="Confirm Preferred Mobile Number"
            type="tel"
            inputMode="numeric"
            placeholder="+65 6248 9777"
            value={values.confirmMobile}
            error={visibleError("confirmMobile")}
            {...shared}
          />
          <TextField
            id="preferredEmail"
            label="Preferred Email"
            type="email"
            autoComplete="email"
            placeholder="example@suss.com"
            value={values.preferredEmail}
            error={visibleError("preferredEmail")}
            {...shared}
          />
          <TextField
            id="confirmEmail"
            label="Confirm Preferred Email"
            type="email"
            placeholder="example@suss.com"
            value={values.confirmEmail}
            error={visibleError("confirmEmail")}
            {...shared}
          />
          <SelectField
            id="jobStatus"
            label="Job Status (Working / Not-Working)"
            options={JOB_STATUSES}
            value={values.jobStatus}
            error={visibleError("jobStatus")}
            {...shared}
          />
          <SelectField
            id="industry"
            label="Industry Working At"
            options={industries}
            value={values.industry}
            error={visibleError("industry")}
            {...shared}
          />
          <TextField
            id="emergencyName"
            label="Preferred Emergency Person"
            placeholder="Name"
            maxLength={255}
            value={values.emergencyName}
            error={visibleError("emergencyName")}
            {...shared}
          />
          <TextField
            id="emergencyRelation"
            label="Relationship To Client"
            placeholder="Relationship To Client"
            maxLength={255}
            value={values.emergencyRelation}
            error={visibleError("emergencyRelation")}
            {...shared}
          />
          <TextField
            id="emergencyMobile"
            label="Emergency Contact Person's Mobile"
            type="tel"
            inputMode="numeric"
            placeholder="+65 6248 1234"
            value={values.emergencyMobile}
            error={visibleError("emergencyMobile")}
            {...shared}
          />
        </div>

        <CheckboxBlock
          id="agreement"
          title="Client/Counsellor Agreement"
          checked={values.agreement}
          onChange={handleChange}
          error={visibleError("agreement")}
        >
          <p>
            By signing up for counselling/life coaching with C-three, I understand
            and will abide by the following:
          </p>
          <ul>
            <li>Be punctual for all my sessions</li>
            <li>
              Notify C-three in advance if I am unable to make, or will be late,
              for my sessions
            </li>
            <li>Treat my counsellor/life-coach with respect</li>
            <li>
              Understand that interaction with my counsellor/life-coach is
              restricted to within sessions or related to my sessions
            </li>
            <li>Not record any of our sessions, audio or visual</li>
          </ul>
        </CheckboxBlock>

        <CheckboxBlock
          id="declaration"
          title="Declaration"
          checked={values.declaration}
          onChange={handleChange}
          error={visibleError("declaration")}
        >
          <p>
            I, {student.fullName || "NAME OF STUDENT"} (student PI No{" "}
            {student.piNumber ? `(${student.piNumber})` : "(XXXXXXXXX)"}), declare
            that all of the above information given is true and accurate to the
            best of my knowledge.
          </p>
          <p>
            I understand that all communication between the counsellor/life coach
            and I are deemed confidential. However the counsellor/life coach is
            bound by law and professional code of ethics to disclose information
            about the sessions or their contents:
          </p>
          <ul>
            <li>
              In circumstances which would result in clear danger to me, others,
              and/or to the property of SUSS
            </li>
            <li>When required by law</li>
          </ul>
        </CheckboxBlock>

        <p className="mb-2.5 mt-5 text-[13px]">Date: {today}</p>

        {showCancelNotice && (
          <p
            role="status"
            className="mb-3 border-l-[3px] border-amber-500 bg-amber-50 px-3 py-2.5 text-[13px] text-amber-900"
          >
            {CANCEL_NOTICE}
          </p>
        )}

        <div className="flex flex-col gap-1 sm:flex-row">
          <button type="submit" className={`${btn} bg-[#1b3556]`} disabled={submitting}>
            Next
          </button>
          <button
            type="button"
            className={`${btn} bg-neutral-700`}
            onClick={handleCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}