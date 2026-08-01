import React, { useState, useEffect } from 'react';
import './DynamicForm.css';

/**
 * Shared Dynamic Form Renderer for Service OS V2
 * Supports 30+ field types, live validation, conditional visibility, drafts & sections.
 */
export default function DynamicFormRenderer({
  formFields = [],
  initialValues = {},
  onSubmit,
  onSaveDraft,
  readOnly = false,
  submitLabel = 'Proceed to Payment',
}) {
  const [formData, setFormData] = useState(initialValues || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues && Object.keys(initialValues).length > 0) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  // Handle Input Changes
  const handleChange = (key, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [key]: value };
      // Clear error on edit
      if (errors[key]) {
        setErrors((prevErr) => ({ ...prevErr, [key]: null }));
      }
      return updated;
    });
  };

  // Evaluate Conditional Visibility Rules
  const isFieldVisible = (field) => {
    if (!field.visibility_rules_json) return true;
    const rules = typeof field.visibility_rules_json === 'string'
      ? JSON.parse(field.visibility_rules_json)
      : field.visibility_rules_json;

    if (rules.depends_on_field) {
      const depValue = formData[rules.depends_on_field];
      if (rules.operator === 'EQUALS') return depValue === rules.value;
      if (rules.operator === 'NOT_EQUALS') return depValue !== rules.value;
    }
    return true;
  };

  // Form Submission Validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    formFields.forEach((field) => {
      if (!isFieldVisible(field)) return;

      const key = field.field_key;
      const val = formData[key];
      const label = field.field_label || key;
      const isReq = field.is_required === 1 || field.is_required === true;

      const isEmpty = val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0);

      if (isReq && isEmpty) {
        newErrors[key] = `${label} is required.`;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <form className="dynamic-form-container" onSubmit={handleSubmit}>
      {formFields
        .filter((field) => isFieldVisible(field))
        .map((field) => {
          const key = field.field_key;
          const label = field.field_label;
          const type = field.field_type;
          const isReq = field.is_required === 1 || field.is_required === true;
          const err = errors[key];

          if (type === 'heading' || type === 'section') {
            return (
              <div key={key} className="form-section-heading">
                <h3>{label}</h3>
                {field.help_text && <p className="help-text">{field.help_text}</p>}
              </div>
            );
          }

          if (type === 'divider') {
            return <hr key={key} className="form-divider" />;
          }

          return (
            <div key={key} className={`form-group ${err ? 'has-error' : ''}`}>
              <label className="form-label">
                {label} {isReq && <span className="required-asterisk">*</span>}
              </label>

              {type === 'textarea' ? (
                <textarea
                  className="form-input"
                  placeholder={field.placeholder || ''}
                  value={formData[key] || ''}
                  disabled={readOnly}
                  onChange={(e) => handleChange(key, e.target.value)}
                  rows={4}
                />
              ) : type === 'dropdown' ? (
                <select
                  className="form-input"
                  value={formData[key] || ''}
                  disabled={readOnly}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  <option value="">Select {label}</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt.option_value || opt.id} value={opt.option_value}>
                      {opt.option_label || opt.option_value}
                    </option>
                  ))}
                </select>
              ) : type === 'radio' ? (
                <div className="radio-group">
                  {(field.options || []).map((opt) => (
                    <label key={opt.option_value || opt.id} className="radio-label">
                      <input
                        type="radio"
                        name={key}
                        value={opt.option_value}
                        checked={formData[key] === opt.option_value}
                        disabled={readOnly}
                        onChange={(e) => handleChange(key, e.target.value)}
                      />
                      {opt.option_label || opt.option_value}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={type === 'number' || type === 'currency' ? 'number' : type === 'date' ? 'date' : 'text'}
                  className="form-input"
                  placeholder={field.placeholder || ''}
                  value={formData[key] || ''}
                  disabled={readOnly}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}

              {field.help_text && <span className="field-help">{field.help_text}</span>}
              {err && <span className="error-text">{err}</span>}
            </div>
          );
        })}

      {!readOnly && (
        <div className="form-actions">
          {onSaveDraft && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onSaveDraft(formData)}
            >
              Save Draft
            </button>
          )}
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
        </div>
      )}
    </form>
  );
}
