import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import FormD1 from "../pages/FormD1.jsx";
import { submitD1 } from "../services/api.js";
import { findStudentByEmail } from "../data/students.js";

export default function Home() {
  const { accounts, instance } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0];
  const claims = account?.idTokenClaims ?? {};
  const email =
    claims.email ??
    claims.preferred_username ??
    account?.username ??
    "";

  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [studentError, setStudentError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    function loadStudent() {
      setLoadingStudent(true);
      setStudentError("");

      const demoStudent = findStudentByEmail(email);
      if (!demoStudent) {
        setStudentError(
          `No demo student is configured for ${email || "this account"}. Add the login email to src/data/students.js.`
        );
        setLoadingStudent(false);
        return;
      }

      setStudent(demoStudent);
      setLoadingStudent(false);
    }

    loadStudent();
  }, [email]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      await submitD1(payload);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit Form D1. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="mb-3 text-2xl font-semibold text-neutral-800">
          Form D1 submitted
        </h1>
        <p role="status" className="text-neutral-700">
          Your D1 form has been submitted successfully.
        </p>
      </main>
    );
  }

  if (loadingStudent) {
    return (
      <p role="status" className="p-6 text-neutral-700">
        Loading student details...
      </p>
    );
  }

  if (studentError) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p role="alert" className="border-l-[3px] border-red-700 bg-red-50 px-3 py-2.5 text-[13px] text-red-800">
          {studentError}
        </p>
      </main>
    );
  }

  return (
    <main>
      {submitError && (
        <p
          role="alert"
          className="mb-4 border-l-[3px] border-red-700 bg-red-50 px-3 py-2.5 text-[13px] text-red-800"
        >
          {submitError}
        </p>
      )}
      <FormD1
        student={student}
        onSubmit={handleSubmit}
        onCancel={() => setSubmitError("")}
        submitting={submitting}
      />
    </main>
  );
}