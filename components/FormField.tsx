interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
      </label>

      {children}

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export const inputClassName =
  "w-full rounded-2xl border border-line bg-cream/50 px-4 py-3 text-sm text-ink focus:border-carrot focus:outline-none";
