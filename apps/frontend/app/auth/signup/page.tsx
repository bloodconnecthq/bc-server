import AuthLayout from "@/components/auth/auth-layout";
import SignUpForm from "@/components/auth/signup-form";


export const metadata = {
    title: "Xèdo Business - Sign Up",
}

export default function SignUpPage() {
    return (
        <AuthLayout>
            <SignUpForm/>
        </AuthLayout>
    );
}
