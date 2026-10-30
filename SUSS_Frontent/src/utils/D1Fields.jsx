const inputBase =
  "box-border h-9 w-full rounded-sm border px-2.5 text-[13px] text-neutral-700 " +
  "placeholder:text-neutral-400 focus-visible:outline focus-visible:outline-2 " +
  "focus-visible:outline-offset-1 focus-visible:outline-blue-600 focus-visible:border-blue-600";

const inputState = (error) =>
  error ? "border-red-700 bg-white" : "border-neutral-300 bg-white";

/** Grey, non-editable field for data that comes from SIMS. */
export function ReadOnlyField({ id, label, value }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs text-neutral-500" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        value={value ?? ""}
        readOnly
        tabIndex={-1}
        className="box-border h-9 w-full cursor-default rounded-sm border border-neutral-200 bg-neutral-200 px-2.5 text-[13px] text-neutral-600 focus:outline-none"
      />
    </div>
  );
}

function FieldShell({ id, label, required, error, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label className="text-xs text-neutral-500" htmlFor={id}>
        {label}
        {required && (
          <span className="text-red-700" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="m-0 text-[11.5px] leading-snug text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  required = true,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  autoComplete,
}) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <input
        id={id}
        name={id}
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(id, e.target.value)}
        onBlur={() => onBlur(id)}
        className={`${inputBase} ${inputState(error)}`}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  options,
  required = true,
  placeholder = "Select",
}) {
  return (
    <FieldShell id={id} label={label} required={required} error={error}>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(id, e.target.value)}
          onBlur={() => onBlur(id)}
          className={`${inputBase} ${inputState(error)} appearance-none pr-8 ${
            value ? "" : "text-neutral-400"
          }`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="text-neutral-700">
              {o}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 fill-neutral-500"
        >
          <path d="M5.5 7.5 10 12l4.5-4.5-1.1-1.1L10 9.8 6.6 6.4z" />
        </svg>
      </div>
    </FieldShell>
  );
}

export function CheckboxBlock({ id, checked, onChange, error, title, children }) {
  return (
    <div className="mt-6 text-[13px] leading-relaxed">
      <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2 font-semibold">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(id, e.target.checked)}
          className="h-[15px] w-[15px] accent-[#1b3556]"
        />
        <span>{title}</span>
      </label>
      {error && (
        <p id={`${id}-error`} role="alert" className="m-0 mt-1 text-[11.5px] text-red-700">
          {error}
        </p>
      )}
      <div className="[&_li]:mb-1 [&_p]:my-2.5 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-[22px]">
        {children}
      </div>
    </div>
  );
}