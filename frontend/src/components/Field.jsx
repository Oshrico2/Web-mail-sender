import { useId } from "react";

export function Field({ label, optional, hint, error, children, id }) {
  const autoId = useId();
  const fieldId = id || autoId;
  const child =
    typeof children === "function"
      ? children({ id: fieldId, "aria-invalid": error ? true : undefined })
      : children;
  return (
    <div className="field">
      <label className="field__label" htmlFor={fieldId}>
        {label} {optional && <em>(רשות)</em>}
      </label>
      {child}
      {error ? (
        <span className="field__error" role="alert">
          {error}
        </span>
      ) : (
        hint && <span className="field__hint">{hint}</span>
      )}
    </div>
  );
}

export function TextInput({ label, optional, hint, error, ...props }) {
  return (
    <Field label={label} optional={optional} hint={hint} error={error}>
      {(a11y) => <input className="input" {...a11y} {...props} />}
    </Field>
  );
}

export function Switch({ label, description, checked, onChange, name, disabled }) {
  return (
    <label className="switch">
      <span className="switch__text">
        <b>{label}</b>
        {description && <span>{description}</span>}
      </span>
      <input
        type="checkbox"
        role="switch"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}
