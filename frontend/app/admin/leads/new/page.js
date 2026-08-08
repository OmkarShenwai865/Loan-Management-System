"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/lib/axiosClient";
import { loanApplicationDefaults, loanApplicationSchema } from "@/lib/schemas/loanApplicationSchema";
import PageHeader from "@/components/loan-application/PageHeader";
import CustomerDetailsCard from "@/components/loan-application/CustomerDetailsCard";
import LoanDetailsCard from "@/components/loan-application/LoanDetailsCard";
import ConsentCard from "@/components/loan-application/ConsentCard";
import EvaluateButton from "@/components/loan-application/EvaluateButton";
import EligibilitySummaryPanel from "@/components/loan-application/EligibilitySummaryPanel";
import Toast from "@/components/ui/Toast";

export default function NewLoanApplicationPage() {
  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loanApplicationSchema),
    defaultValues: loanApplicationDefaults,
    mode: "onTouched",
  });

  const [panelState, setPanelState] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  async function onSubmit(data) {
    setPanelState("loading");

    try {
      const response = await apiClient.post("/leads/", data);
      setResult(response.data);
      setSubmittedValues(data);
      setPanelState("success");
      setToastMessage("Application evaluated successfully.");
    } catch (err) {
      if (!err.response) {
        setErrorType("network");
        setErrorMessage(null);
        setPanelState("error");
        return;
      }

      const { status, data: responseData } = err.response;

      if (status === 409) {
        setErrorType("duplicate");
        setErrorMessage(null);
        setPanelState("error");
        return;
      }

      if (status === 400 && responseData?.errors) {
        Object.entries(responseData.errors).forEach(([field, messages]) => {
          setError(field, { message: Array.isArray(messages) ? messages[0] : String(messages) });
        });
        setPanelState("idle");
        return;
      }

      setErrorType("generic");
      setErrorMessage(responseData?.message);
      setPanelState("error");
    }
  }

  function handleRetry() {
    handleSubmit(onSubmit)();
  }

  return (
    <div>
      <PageHeader />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
          <div className="lg:col-span-3 space-y-6">
            <CustomerDetailsCard register={register} errors={errors} disabled={isSubmitting} />
            <LoanDetailsCard register={register} control={control} errors={errors} disabled={isSubmitting} />
            <ConsentCard register={register} error={errors.consent_given?.message} disabled={isSubmitting} />
            <EvaluateButton loading={isSubmitting} />
          </div>

          <div className="lg:col-span-2">
            <EligibilitySummaryPanel
              state={panelState}
              result={result}
              formValues={submittedValues}
              errorType={errorType}
              errorMessage={errorMessage}
              onRetry={errorType === "network" ? handleRetry : undefined}
            />
          </div>
        </div>
      </form>

      <Toast message={toastMessage} onClose={() => setToastMessage("")} />
    </div>
  );
}
