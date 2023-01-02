import { ChangeEventHandler, useCallback, useState } from "react";
import { z, AnyZodObject } from "zod";

export const useForm = <Z extends AnyZodObject>(scheme: Z) => {
  type Scheme = z.infer<typeof scheme>;
  const [values, setValues] = useState<Scheme>({});
  const [errors, setErrors] = useState<z.ZodError>();
  const register = useCallback(
    (key: keyof Scheme) => {
      const onChange: ChangeEventHandler<
        HTMLInputElement | HTMLTextAreaElement
      > = (e) => {
        setValues((prev) => ({ ...prev, [key]: e.target.value }));
      };
      const value = values?.[key] ?? "";
      const error = errors?.issues.find((issue) =>
        issue.path.find((path) => path === key)
      );
      return { onChange, value, name: key, error };
    },
    [values, errors]
  );
  const handleSubmit = useCallback(
    (submitHandler: (value: Scheme) => Promise<void>) =>
      async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = scheme.safeParse(values);
        if (result.success) {
          await submitHandler(result.data);
        } else {
          setErrors(result.error);
        }
      },
    [values, scheme]
  );
  return { register, handleSubmit, errors };
};
