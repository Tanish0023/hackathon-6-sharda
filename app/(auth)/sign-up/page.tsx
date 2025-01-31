"use client";

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
import { useTransition, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required and cannot be empty." }),
  mobileNo: z
    .string()
    .min(10, { message: "Mobile number must be of 10 digits." })
    .max(10),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." }),
  meterId: z
    .string()
    .min(1, { message: "Meter ID is required and cannot be empty." }),
});

export default function SignUpPage() {
  const [isPending, startTransition] = useTransition();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobileNo: "",
      password: "",
      meterId: "",
    },
  });

  // Wrapper for geolocation
  const getLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error)
      );
    });
  };

  // Add location
  async function addLocation() {
    try {
      const position = await getLocation();
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      toast.success("Location added successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to get your current location.");
    }
  }

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!latitude || !longitude) {
      toast.error("Please add your location before submitting the form.");
      return;
    }

    const value = { ...values, longitude, latitude };
    startTransition(async () => {
      await axios
        .post("/api/auth/sign-up", value)
        .then((data) => {
          console.log(data.data.userData.userId);
          
          toast.success("Registration Successful!");
          router.replace(`/${data.data.userData.userId}`);
        })
        .catch((error) => {
          const errorMessage = error?.response?.data || "An error occurred.";
          toast.error(errorMessage);
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your complete name"
                  {...field}
                  className="p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mobileNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your mobile no"
                  {...field}
                  className="p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
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
                <Input
                  type="password"
                  placeholder="Enter your password here"
                  {...field}
                  className="p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
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
                <Input
                  placeholder="Enter your meter Id"
                  {...field}
                  className="p-3 border rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          onClick={addLocation}
          disabled={isPending}
          type="button"
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
        >
          Add Location
        </Button>
        <br />
        <br />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
