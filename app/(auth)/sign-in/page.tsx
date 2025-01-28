"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

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
import { useTransition } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  mobileNo: z.string().min(10, { message: "Mobile number must be of 10 digits." }).max(10),
  meterId: z.string().min(1, { message: "Meter ID is required and cannot be empty." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
});

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNo: "",
      meterId: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      await axios
        .post("/api/auth/sign-in", values)
        .then((data) => {
          toast.success("Login Successful!!");
          router.push(`/${data.data.userData.userId}`);
        })
        .catch((error) => {
          console.log(error);
          const errorMessage = error?.response?.data || "Some Error occurred";
          toast.error(`${errorMessage}`);
        });
    });
  }

  return isPending ? (
    <div className="flex items-center justify-center font-bold text-4xl w-full h-full">
      Loading....
    </div>
  ) : (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
        <FormField
          control={form.control}
          name="mobileNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your mobile no" {...field} className="p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="meterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meter Id</FormLabel>
              <FormControl>
                <Input placeholder="Enter your meter Id" {...field} className="p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your password here" {...field} className="p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit"
          disabled={isPending}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none w-full"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
