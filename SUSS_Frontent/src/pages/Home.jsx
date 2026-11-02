import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import FormD1 from "../pages/FormD1.jsx";
import { checkD1Exists, submitD1 } from "../services/api.js";
import { findStudentByEmail } from "../data/students.js";
import { useNavigate } from "react-router-dom";
import StudentPortalLayout from "../components/StudentPortalLayout.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { accounts, instance } = useMsal();
  const account = instance.getActiveAccount() ?? accounts[0];
  const claims = account?.idTokenClaims ?? {};
  const email =
    claims.email ??
    claims.preferred_username ??
    account?.username ??
    "";
  const isClient = Array.isArray(claims.roles) && claims.roles.includes("Client");

  const [student, setStudent] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [studentError, setStudentError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    async function loadStudent() {
      setLoadingStudent(true);
      setStudentError("");

      const demoStudent = findStudentByEmail(email);
      if (!demoStudent) {
        if (isCurrent) {
          setStudentError(
            `No demo student is configured for ${email || "this account"}. Add the login email to src/data/students.js.`
          );
          setLoadingStudent(false);
        }
        return;
      }

      setStudent(demoStudent);
      if (isClient) {
        try {
          const alreadySubmitted = await checkD1Exists();
          if (!isCurrent) return;
          if (alreadySubmitted) {
            navigate("/profile", {
              replace: true,
              state: { student: demoStudent, d1AlreadyExists: true },
            });
            return;
          }
        } catch (error) {
          if (isCurrent) {
            setStudentError(
              error instanceof Error
                ? error.message
                : "Unable to check whether Form D1 has been submitted. Please try again."
            );
            setLoadingStudent(false);
          }
          return;
        }
      }

      if (isCurrent) setLoadingStudent(false);
    }

    loadStudent();
    return () => {
      isCurrent = false;
    };
  }, [email, isClient, navigate]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError("");

    try {
      await submitD1(payload);
      navigate("/profile", {
        replace: true,
        state: { student, submission: payload, submissionSucceeded: true },
      });
    } catch (error) {
      console.log(error.message);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit Form D1. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingStudent) {
    return (
      <StudentPortalLayout>
        <p role="status" className="text-neutral-700">
          Loading student details...
        </p>
      </StudentPortalLayout>
    );
  }

  if (studentError) {
    return (
      <StudentPortalLayout>
        <p role="alert" className="border-l-[3px] border-red-700 bg-red-50 px-3 py-2.5 text-[13px] text-red-800">
          {studentError}
        </p>
      </StudentPortalLayout>
    );
  }

  return (
    <StudentPortalLayout>
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
    </StudentPortalLayout>
  );
}