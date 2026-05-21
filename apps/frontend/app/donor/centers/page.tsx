import { CentersPageClient } from "@/components/donor/center-page-client";


export default function CentersPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Centres de collecte</h1>
        <p className="text-sm text-gray-500 mt-1">
          Trouvez le centre de don le plus proche de chez vous
        </p>
      </div>
      <CentersPageClient />
    </div>
  );
}