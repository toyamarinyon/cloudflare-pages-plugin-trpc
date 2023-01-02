import { ChangeEventHandler, useCallback } from "react";
import { ZodIssue } from "zod";
import { FormField, FormFieldProps } from "./FormField";

type Props = Omit<FormFieldProps, "children"> & {
  multiline?: boolean;
  value: string;
  placeholder?: string;
  onChange?: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: ZodIssue
};

export const InputTextField = ({ multiline, ...props }: Props): JSX.Element => {
  const { name, label, onChange, error } = props;
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange?.(e);
    },
    [onChange]
  );
  return (
    <FormField name={name} label={label} error={error}>
      {/* <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
          http://
        </span> */}
      {multiline ? (
        <textarea
          id={props.name}
          name={props.name}
          rows={3}
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder={props.placeholder}
          onChange={handleChange}
        />
      ) : (
        <input
          type="text"
          name={props.name}
          id={props.name}
          className="block w-full flex-1 rounded-md border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder={props.placeholder}
          onChange={handleChange}
        />
      )}
    </FormField>
  );
};
