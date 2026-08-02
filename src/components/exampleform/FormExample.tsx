
"use client";
import { useLoginUserMutation } from "@/services/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type formdata = {
    email: string;
    password: string;
    remember?: boolean;
};

export default function FormExampleComponent() {
    // calling login custom hook
    const [loginRequest,{data: loginResponse, isError}] = useLoginUserMutation();
    // 1. declare object using with useForm
    const{
        register,
         handleSubmit,
         reset,
         setError
    } = useForm<formdata>({
        // set default values
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        }

    });

    // 3 create handle submit to track values from input form
    const onSubmit = (data: formdata) => {
       try{
         loginRequest(
            {
                email: data?.email,
                password: data?.password,
            })
            if(loginResponse?.token){
                toast("you have login successfully") 
            }else{
                toast.error("you have login again") 
            }

       }catch(error){
        console.error("Error during login:", error);
        setError("email", { type: "manual", message: "Login failed. Please try again." });
       }
        
        // console.log("Submitted data:", data?.email);
        // console.log("Submitted password:", data?.password);
        // console.log("Submitted remember:", data?.remember);
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" {...register("email")} className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" {...register("password")} className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Submit
                </button>
            </form>
        </div>
    )
}