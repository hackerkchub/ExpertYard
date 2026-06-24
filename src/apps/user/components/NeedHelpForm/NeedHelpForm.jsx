import React, { useState } from "react";
import { submitNeedHelpApi } from "../../../../shared/api/userApi/lead.api";
import { buildTrackingPayload } from "../../../../shared/utils/leadTracking";
import { useAuth } from "../../../../shared/context/UserAuthContext";
import "./NeedHelpForm.css";

const initialForm = {
  user_name: "",
  user_phone: "",
  user_email: "",
  city: "",
  area: "",
  requirement: "",
  preferred_mode: "any",
  contact_consent: false,
};

export default function NeedHelpForm({ categoryId, subcategoryId, categoryName, sourcePage }) {
  const { user } = useAuth();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    user_name:
      [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
      user?.name ||
      "",
    user_phone: user?.phone || "",
    user_email: user?.email || "",
    city: user?.city || "",
    area: user?.area || "",
  }));
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!form.contact_consent) {
      setMessage("Please allow contact sharing so verified experts can support you.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = buildTrackingPayload({
        user,
        sourcePage,
        actionLabel: "Need Help Submit",
        extra: {
          ...form,
          category_id: categoryId,
          subcategory_id: subcategoryId || null,
          can_show_contact_to_expert: form.contact_consent,
        },
      });

      const response = await submitNeedHelpApi(payload);
      setMessage(
        response.data?.message ||
          "Your request has been submitted. Verified experts will connect with you soon."
      );
      setForm((current) => ({
        ...initialForm,
        user_name: current.user_name,
        user_phone: current.user_phone,
        user_email: current.user_email,
        city: current.city,
      }));
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="need-help-form">
      <div className="need-help-form__header">
        <h2>Need help choosing an expert?</h2>
        <p>{categoryName ? `Share your ${categoryName} requirement.` : "Share your requirement."}</p>
      </div>

      <form onSubmit={handleSubmit} className="need-help-form__grid">
        <input value={form.user_name} onChange={(e) => update("user_name", e.target.value)} placeholder="Name" required />
        <input value={form.user_phone} onChange={(e) => update("user_phone", e.target.value)} placeholder="Mobile number" required />
        <input value={form.user_email} onChange={(e) => update("user_email", e.target.value)} placeholder="Email address" type="email" />
        <input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="City" required />
        <input value={form.area} onChange={(e) => update("area", e.target.value)} placeholder="Area (optional)" />
        <select value={form.preferred_mode} onChange={(e) => update("preferred_mode", e.target.value)}>
          <option value="any">Any contact mode</option>
          <option value="chat">Chat</option>
          <option value="call">Call</option>
          <option value="video">Video</option>
        </select>
        <textarea
          value={form.requirement}
          onChange={(e) => update("requirement", e.target.value)}
          placeholder="Describe your problem or requirement"
          required
        />
        <label className="need-help-form__consent">
          <input
            type="checkbox"
            checked={form.contact_consent}
            onChange={(e) => update("contact_consent", e.target.checked)}
          />
          <span>I agree to share my contact details with verified experts for consultation support.</span>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {message && <p className="need-help-form__message">{message}</p>}
    </section>
  );
}
