import { HospitalSettingsMembers } from "@/components/hospital/settings/members";
import { HospitalSettingsProfile } from "@/components/hospital/settings/profile";
import { HospitalSettingsSecurity } from "@/components/hospital/settings/security";
import { HospitalSettingsThresholds } from "@/components/hospital/settings/thresholds";

export default function HospitalSettingsPage() {
    return (
        <div className="space-y-6 max-">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Gérez les informations et préférences de votre établissement
                </p>
            </div>

            <div className="space-y-6 max-w-3xl mx-auto">
                <HospitalSettingsProfile />
                <HospitalSettingsThresholds />
                <HospitalSettingsMembers />
                <HospitalSettingsSecurity />
            </div>
        </div>
    );
}