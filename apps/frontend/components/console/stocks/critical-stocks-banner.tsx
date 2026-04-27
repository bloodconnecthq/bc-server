import { Alert } from "@heroui/react";

interface Department {
  department: string;
  capital: string;
  stocks: Record<string, number>;
}

export function CriticalStocksBanner({
  departments,
}: {
  departments: Department[];
}) {
  const criticalGroups = departments.flatMap((d) =>
    Object.entries(d.stocks)
      .filter(([, v]) => v < 10)
      .map(([g]) => `${g} (${d.department})`)
  );

  return (
    <Alert status="danger">
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>
          {departments.length} département{departments.length > 1 ? "s" : ""} en état critique
        </Alert.Title>
        <Alert.Description>
          {criticalGroups.length > 0
            ? `Groupes urgents : ${criticalGroups.join(", ")}`
            : `${departments.map((d) => d.department).join(", ")} — stocks insuffisants`}
        </Alert.Description>
      </Alert.Content>
    </Alert>
  );
}