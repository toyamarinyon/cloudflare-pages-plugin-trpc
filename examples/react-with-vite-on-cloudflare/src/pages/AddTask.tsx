import { useCallback } from "react";
import { Button } from "../components/Button";
import { InputTextField } from "../components/FormField";
import { Page } from "../components/Page";
import { useForm } from "../hooks/useForm";
import { trpc } from "../trpcUtil";
import { CreateTaskPayload, createTaskScheme } from "../model/task";
import { useRouter } from "../router";

export const AddTask = (): JSX.Element => {
  const { router } = useRouter();
  const { mutateAsync, isLoading } = trpc.tasks.create.useMutation();
  const { register, handleSubmit } = useForm(createTaskScheme);
  const submit = useCallback(
    async (data: CreateTaskPayload) => {
      await mutateAsync(data);
      router.push("/")

    },
    [mutateAsync, router]
  );

  return (
    <Page title="Add task">
      <form className="space-y-6" onSubmit={handleSubmit(submit)}>
        <div className="space-y-3">
          <InputTextField label="Title" {...register("title")} />
          <InputTextField
            label="Description"
            {...register("description")}
            multiline
          />
        </div>
        <Button type="submit" fullWidth loading={isLoading}>
          Add task
        </Button>
      </form>
    </Page>
  );
};
