import clsx from "clsx";
import { Drop } from "iconsax-reactjs";

interface StockBadgeProps {
  disponible: number;
  necessaire: number;
}

export function StockBadge({ disponible, necessaire }: StockBadgeProps) {
  const ok = disponible >= necessaire;
  return (
    <span className={clsx(
      "inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium border",
      ok
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-red-50 text-red-700 border-red-200"
    )}>
      <Drop size={9} variant="Bold" />
      {disponible} poche{disponible > 1 ? "s" : ""}
      {ok ? " disponibles" : " — insuffisant"}
    </span>
  );
}
