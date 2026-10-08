"use client";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
export default function InquiryForm({ career = false }) {
  const [message, setMessage] = useState("");
  const fields = career
    ? [
        { name: "name", label: "Name", required: true },
        {
          name: "email",
          label: "Email address",
          type: "email",
          required: true,
        },
        { name: "education", label: "Education" },
        { name: "jobType", label: "Job type" },
        { name: "location", label: "Current location" },
        { name: "salary", label: "Expected salary" },
        {
          name: "summary",
          label: "Summary of skills & experience",
          textarea: true,
          required: true,
        },
      ]
    : [
        { name: "name", label: "Name" },
        {
          name: "email",
          label: "Email address",
          type: "email",
          required: true,
        },
        { name: "message", label: "Message", textarea: true, required: true },
      ];
  function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = fields
      .map((field) => `${field.label}: ${form.get(field.name) || "—"}`)
      .join("\n\n");
    const subject = career
      ? `Career enquiry from ${form.get("name")}`
      : `Website enquiry from ${form.get("name") || "a visitor"}`;
    const url = `mailto:contact@ugicorpgroup.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
    setMessage(
      "Your email app will open with the completed message. Please send it there to contact US GLOBAL IMPEX.",
    );
  }
  return (
    <form className="inquiry-form" onSubmit={submit}>
      <div className="form-grid">
        {fields.map((field) => (
          <label key={field.name} className={field.textarea ? "wide" : ""}>
            <span>
              {field.label}
              {field.required && " *"}
            </span>
            {field.textarea ? (
              <textarea name={field.name} rows={5} required={field.required} />
            ) : (
              <input
                name={field.name}
                type={field.type || "text"}
                required={field.required}
              />
            )}
          </label>
        ))}
      </div>
      <button className="button" type="submit">
        {career ? "Prepare application" : "Prepare message"}{" "}
        <ArrowRight size={18} />
      </button>
      <p className="form-note">
        This opens your email app. No information is submitted to this website.
      </p>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
    </form>
  );
}
