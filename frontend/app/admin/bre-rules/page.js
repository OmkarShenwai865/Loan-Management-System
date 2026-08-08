"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { getRole } from "@/lib/auth";
import BreHeader from "@/components/bre/BreHeader";
import BreInfoBanner from "@/components/bre/BreInfoBanner";
import RuleFormCard from "@/components/bre/RuleFormCard";
import RulesTablePanel from "@/components/bre/RulesTablePanel";
import EditRuleModal from "@/components/bre/EditRuleModal";
import DeleteRuleDialog from "@/components/bre/DeleteRuleDialog";
import Toast from "@/components/ui/Toast";

export default function BreRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRule, setEditingRule] = useState(null);
  const [deletingRule, setDeletingRule] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const isSuperAdmin = getRole() === "SUPER_ADMIN";

  function loadRules() {
    setLoading(true);
    apiFetch("/bre/rules/?page_size=100", { auth: true })
      .then((res) => setRules(res.results ?? res))
      .catch((err) => showToast(err.message || "Could not load rules.", "error"))
      .finally(() => setLoading(false));
  }

  useEffect(loadRules, []);

  function showToast(message, type = "success") {
    setToast({ message, type });
  }

  function handleAddNew() {
    document.getElementById("rule-form-card")?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("name")?.focus();
  }

  function handleCreated() {
    loadRules();
    showToast("Business Rule created successfully.");
  }

  function handleUpdated() {
    setEditingRule(null);
    loadRules();
    showToast("Business Rule updated successfully.");
  }

  async function handleDeleteConfirm() {
    setDeleting(true);
    try {
      await apiFetch(`/bre/rules/${deletingRule.id}/`, { method: "DELETE", auth: true });
      setDeletingRule(null);
      loadRules();
      showToast("Business Rule deleted successfully.");
    } catch (err) {
      showToast(err.message || "Could not delete rule.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <BreHeader onAddNew={handleAddNew} />
      <BreInfoBanner />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="lg:col-span-2">
          <RuleFormCard onCreated={handleCreated} onError={(msg) => showToast(msg, "error")} />
        </div>
        <div className="lg:col-span-3">
          <RulesTablePanel
            rules={rules}
            loading={loading}
            isSuperAdmin={isSuperAdmin}
            onEdit={setEditingRule}
            onDeleteRequest={setDeletingRule}
          />
        </div>
      </div>

      <EditRuleModal
        open={!!editingRule}
        rule={editingRule}
        onClose={() => setEditingRule(null)}
        onUpdated={handleUpdated}
        onError={(msg) => showToast(msg, "error")}
      />

      <DeleteRuleDialog
        open={!!deletingRule}
        rule={deletingRule}
        onClose={() => setDeletingRule(null)}
        onConfirm={handleDeleteConfirm}
        deleting={deleting}
      />

      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "success" })} />
    </div>
  );
}
