import { Form } from "lucide-react";

import { useForm } from "react-hook-form";

type FormValues = {
    email: string;
    password: string;
    remember?: boolean;
};

export default function FormExampleComponent() {
    const{
        register,
         handleSubmit,
         reset,
         setError
    } = useForm<FormValues>({
        // set default values
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        }

    });

    // 3 create handle submit to track values from input form
    const onSubmit = (data: FormValues) => {
        console.log("Submitted data:", data?.email);
        console.log("Submitted data:", data?.password);
        console.log("Submitted data:", data?.remember);
    }

    return (
        <div>
            <form action="" onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" {...register("email")} />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" {...register("password")} />
                <label htmlFor="remember">
                    <input type="checkbox" id="remember" {...register("remember")} />
                    Remember me
                </label>
                <button type="submit">Submit</button>

            </form>
        </div>
    )
}