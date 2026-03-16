import { Warning2 } from "iconsax-reactjs";

interface Alert {
  group: string;
  message: string;
}

export function AlertsBanner({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div className="flex items-start gap-3">
        <Warning2 size={18} color="#dc2626" variant="Bold" className="mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700 mb-1">
            {alerts.length} alerte{alerts.length > 1 ? "s" : ""} de stock critique
          </p>
          <div className="flex flex-wrap gap-2">
            {alerts.map((alert) => (
              <span
                key={alert.group}
                className="inline-flex items-center gap-1.5 text-xs text-red-700 bg-red-100 px-3 py-1 rounded-full"
              >
                <span className="font-bold">{alert.group}</span>
                <span>·</span>
                {alert.message}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}