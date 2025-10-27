import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import createMatrixClient from "@/lib/matrix/createMatrixClient";
import useSessionStore from "@/stores/useSessionStore";
import { useForm } from "react-hook-form";
import { useState } from "react";

type UseLoginFormOptions = {
  homeserver?: string;
  canSubmit?: boolean;
  isHsLoading?: boolean;
  isHsError?: boolean;
  isHsValid?: boolean | null;
};

function useLoginForm(options: UseLoginFormOptions = {}) {
  const { homeserver, canSubmit, isHsLoading, isHsError, isHsValid } = options;

  const FormSchema = z
    .object({
      username: z
        .string()
        .nonempty({ message: "Username/email field should not be empty." }),
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

  const addClientData = useSessionStore((state) => state.addClientData);
  const setActiveClient = useSessionStore((state) => state.setActiveClient);

  const [submitError, setSubmitError] = useState<string | null>(null);

  async function onSubmit(
    data: z.infer<typeof FormSchema> & { homeserver: string }
  ) {
    setSubmitError(null);

    try {
      const baseUrl = data.homeserver.startsWith("http")
        ? data.homeserver
        : `https://${data.homeserver}`;
      const client = createMatrixClient({
        baseUrl,
      });
      const loginRequestParams = {
        identifier: {
          type: "m.id.user",
          user: data.username,
        },
        type: "m.login.password",
        password: data.password,
      };
      const loginResponse = await client.loginRequest(loginRequestParams);
      console.log(loginResponse);
      addClientData({
        baseUrl: client.baseUrl,
        userId: client.getUserId() ?? undefined,
        accessToken: client.getAccessToken() ?? undefined,
        refreshToken: client.getRefreshToken() ?? undefined,
      });
      setActiveClient(client);
    } catch (error) {
      console.error("Login error:", error);
      setSubmitError(
        "Login failed. Please check your credentials or try again."
      );
      return;
    }
  }

  const blocked =
    !canSubmit ||
    !homeserver ||
    !!isHsLoading ||
    !!isHsError ||
    isHsValid === false;

  const handleSubmit = form.handleSubmit((data) => {
    if (blocked) return;
    return onSubmit({ ...data, homeserver: homeserver ?? "" });
  });

  return {
    form,
    onSubmit,
    blocked,
    handleSubmit,
    submitError,
  };
}

export default useLoginForm;
