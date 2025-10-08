import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

function useLoginForm() {
  const FormSchema = z
    .object({
      username: z
        .string()
        .nonempty({ message: "Username should not be empty." }),
      password: z
        .string()
        .nonempty({ message: "Password should not be empty." }),
    })
    .required();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return { form, onSubmit };
}

export default useLoginForm;
