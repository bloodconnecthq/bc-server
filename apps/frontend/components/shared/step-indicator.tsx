
const STEPS = [
    { number: 1, label: "Identité" },
    { number: 2, label: "Informations" },
    
];


export default function StepIndicator({ currentStep }: { currentStep: number }) {
    return (
        <div className="relative flex items-center justify-between w-full mb-8">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 z-0">
                <div
                    className={`w-full border-t-2 border-dashed transition-all duration-300 ${
                        currentStep > 1 ? "border-gray-300" : "border-gray-200"
                    }`}
                />
            </div>

            {STEPS.map((step) => (
                <div key={step.number} className="relative z-10 flex flex-col items-center gap-1">
                    <div
                        className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                            currentStep === step.number
                                ? "bg-primary text-white"
                                : currentStep > step.number
                                ? "bg-primary text-white"
                                : "bg-gray-100 text-gray-400"
                        }`}
                    >
                        {step.number}
                    </div>
                </div>
            ))}
        </div>
    );
}