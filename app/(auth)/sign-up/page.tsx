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
import { useRouter } from "next/navigation"


const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required and cannot be empty." }),
    // email: z.string().email({ message: "Invalid email format. Please provide a valid email address." }),
    mobileNo: z.string().min(10, { message: "Mobile number must be of 10 digits." }).max(10),
    password: z.string().min(8, { message: "Password must be at least 8 characters long." }),
    meterId: z.string().min(1, { message: "Meter ID is required and cannot be empty." }),
})

export default function SignUpPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      mobileNo:"",
      password:"",
      meterId:"",
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async ()=> {
        await axios.post("/api/auth/sign-up", values)
            .then((data) => {
                console.log(data);
                toast.success("Register Successful!!")
                router.push(`/${data.data.id}`)
            })
            .catch((error) => {
                console.log(error);
                toast.error(`${error.response.data}`) 
            })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your complete name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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

        <FormField
          control={form.control}
          name="meterId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meter Id</FormLabel>
              <FormControl>
                <Input placeholder="Enter your meter Id" {...field} />
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
