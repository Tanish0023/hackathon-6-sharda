"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useTransition } from "react"
import toast from "react-hot-toast"


const formSchema = z.object({
    mobileNo: z.string().min(10, { message: "Mobile number must be of 10 digits." }).max(10),
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
})

export default function SignUpPage() {
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobileNo:"",
      password:"",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async ()=> {
        await axios.post("/api/auth/sign-in", values)
            .then((data) => {
                toast.success("Login Successful!!")
            })
            .catch((error) => {
                toast.error(`${error.response.data}`) 
            })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mobileNo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your mobile no" {...field} />
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
                <Input placeholder="Enter your password here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
    
        <Button 
            type="submit"
            disabled={isPending}
        >
            Submit
        </Button>
      </form>
    </Form>
  )
}
