import clsx from "clsx"

function XedoBusinessIcon({className}: {className?: string}) {
    return (
        <div className={clsx("flex items-center gap-2", className)}>
            <img src="/icons/logo.png" alt="Logo Icon" className="w-20" />

            <span className="text-xs bg-gray-[#B1B3B6] border border-0.5 px-2 py-0.5 rounded-full text-foreground/30">
                Business
            </span>
        </div>
    )
}

export default XedoBusinessIcon