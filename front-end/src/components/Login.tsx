import { useState } from "react";
import { Link } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const Login = () => {
    const [show, setShow] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // wire up later
    };

    return (
        <div className="w-full max-w-sm p-2 rounded-[20px] shadow-s shadow-black/5 ring-1 ring-black/5 bg-background">
            <div className="w-full h-full p-5 rounded-xl shadow-m shadow-black/10 ring-1 ring-black/10  bg-card">
                <div className="mb-6">
                    <Link
                        to="/"
                        className="text-sm font-semibold tracking-tight text-foreground block mb-4"
                    >
                        Pollinkr
                    </Link>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground mb-2">
                        Welcome back
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 flex flex-col">
                        <label className="text-md font-normal">Email</label>
                        <input type="email" placeholder="jhondoe@gmail.com" className="border py-2 px-4 rounded-xl shadow-s outline-none" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-md font-normal">Password</label>
                        <input type="password" placeholder="*******" className="border py-2 px-4 rounded-xl shadow-s outline-none " />
                    </div>
                    <div className="flex justify-center w-full mt-6">
                        <button type="submit" className="py-2 px-4 rounded-xl cursor-pointer bg-primary/90 shadow-l text-white">Sign in</button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    No account?
                    <Link
                        to="/Signup"
                        className="text-muted-foreground font-medium hover:underline underline-offset-4 hover:text-foreground ml-1 transition-all"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login
