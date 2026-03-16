"use client";

import AuthLayout from "@/components/auth/auth-layout";
import StepEmail from "@/components/auth/signin/step-email";
import StepOTP from "@/components/auth/signin/step-otp";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
    const searchParams = useSearchParams();
    const step = searchParams.get("step") || "1";

    return (
        <AuthLayout>
            {step === "1" && <StepEmail />}
            {step === "2" && <StepOTP />}
        </AuthLayout>
    );
}
