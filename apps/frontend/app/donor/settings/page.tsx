import { SettingsProfile } from "@/components/donor/settings-profile";
import { SettingsSecurity } from "@/components/donor/settings-security";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Gérez votre profil et vos préférences
                </p>
            </div>

            <div className="mx-auto max-w-2xl space-y-4">
                <SettingsProfile />
                {/* <SettingsSecurity /> */}
            </div>
        </div>
    );
}