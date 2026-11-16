import { GeneralSettings } from "@/components/settings/GeneralSettings";

// Phones see only the Settings list here (from the layout); desktop opens General beside it.
export default function SettingsPage() {
  return (
    <div className="hidden flex-1 lg:flex">
      <GeneralSettings />
    </div>
  );
}
