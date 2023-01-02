import { ZodIssue } from "zod";

export interface FormFieldProps {
  name: string;
  label: string;
  children: React.ReactNode;
  helperText?: string;
  error?: ZodIssue;
}
export const FormField = ({
  name,
  label,
  children,
  error,
}: FormFieldProps): JSX.Element => {
  return (
    <div className="col-span-3 sm:col-span-2">
      <label htmlFor={name} className="block font-medium text-slate-700">
        {label}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm">{children}</div>
      {error && <p className="text-red-600">{error.message}</p>}
    </div>
  );
};
