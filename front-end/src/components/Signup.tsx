import { useState } from "react";
import { Link } from "react-router-dom";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

const Signup = () => {
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
                        Create an account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Start collecting responses in under a minute.
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 flex flex-col">
                        <label className="text-md font-normal">Full Name</label>
                        <input type="text" placeholder="John Doe" className="border py-2 px-4 rounded-xl shadow-s outline-none" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-md font-normal">Email</label>
                        <input type="email" placeholder="jhondoe@gmail.com" className="border py-2 px-4 rounded-xl shadow-s outline-none" />
                    </div>
                    <div className="space-y-2 flex flex-col">
                        <label className="text-md font-normal">Password</label>
                        <input type="password" placeholder="*******" className="border py-2 px-4 rounded-xl shadow-s outline-none " />
                    </div>
                    <div className="flex justify-center w-full mt-6">
                    <button type="submit" className="py-2 px-4 rounded-xl cursor-pointer bg-primary/90 shadow-l text-white">Create account</button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?
                    <Link
                        to="/login"
                        className="text-muted-foreground font-medium hover:underline underline-offset-4 hover:text-foreground ml-1 transition-all"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup
