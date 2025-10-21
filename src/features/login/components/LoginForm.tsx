"use client";

import PasswordInput from "@/components/PasswordInput";
import useLoginForm from "../hooks/useLoginForm";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Link from "next/link";

export function LoginForm() {
  const { form, onSubmit } = useLoginForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 flex flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="m-0">
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="m-0">
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </Form>
  );
}
