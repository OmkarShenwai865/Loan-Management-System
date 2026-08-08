"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-sm font-medium">{value ?? "-"}</span>
    </div>
  );
}

export default function LeadDetailPage() {
  const params = useParams();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    apiFetch(`/leads/${params.id}/`, { auth: true })
      .then(setLead)
      .catch((err) => setError(err.message));
  }, [params?.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!lead) return <p className="text-slate-400">Loading...</p>;

  const isEligible = lead.bre_status === "ELIGIBLE";

  return (
    <div>
      <Link href="/admin/leads" className="text-sm text-blue-600 hover:underline">
        &larr; Back to Leads
      </Link>

      <div className="flex items-center justify-between mt-3 mb-6">
        <h1 className="text-2xl font-semibold">
          {lead.full_name} <span className="text-slate-400 font-normal">#{lead.id}</span>
        </h1>
        <span
          className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
            isEligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {lead.bre_status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Customer Details</h2>
          <Row label="Mobile Number" value={lead.mobile_number} />
          <Row label="Email" value={lead.email} />
          <Row label="Date of Birth" value={lead.date_of_birth} />
          <Row label="City" value={lead.city} />
          <Row label="Pincode" value={lead.pincode} />
          <Row label="Consent Given" value={lead.consent_given ? "Yes" : "No"} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Loan Details</h2>
          <Row label="Loan Type" value={lead.loan_type} />
          <Row label="Employment Type" value={lead.employment_type} />
          <Row label="Monthly Income" value={`₹${lead.monthly_income}`} />
          <Row label="Loan Amount Required" value={`₹${lead.loan_amount_required}`} />
          <Row label="Property Value" value={`₹${lead.property_value}`} />
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">
            Credit Score & BRE Outcome
          </h2>
          <Row label="Current Credit Score" value={lead.credit_score ?? "N/A"} />
          <Row label="BRE Status" value={lead.bre_status} />
          {lead.rejection_reasons?.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-slate-700 mb-1">Rejection Reason(s):</p>
              <ul className="list-disc list-inside text-sm text-red-600 space-y-0.5">
                {lead.rejection_reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">
            Credit Score Fetch History
          </h2>
          {lead.credit_score_history?.length ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-1">Provider</th>
                  <th className="py-1">Score</th>
                  <th className="py-1">Status</th>
                  <th className="py-1">Fetched At</th>
                </tr>
              </thead>
              <tbody>
                {lead.credit_score_history.map((rec) => (
                  <tr key={rec.id} className="border-t border-slate-100">
                    <td className="py-1.5">{rec.provider}</td>
                    <td className="py-1.5">{rec.score ?? "-"}</td>
                    <td className="py-1.5">{rec.status}</td>
                    <td className="py-1.5 text-slate-500">
                      {new Date(rec.fetched_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-400">No fetch history.</p>
          )}
        </div>
      </div>
    </div>
  );
}
