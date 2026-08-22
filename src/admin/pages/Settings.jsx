import AdminLayout from "../components/AdminLayout";

export default function AdminSettings() {
  return (
    <AdminLayout title="Settings" subtitle="Admin console preferences">
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft p-8">
        <h2 className="text-lg font-display font-semibold text-ink mb-2">Admin Settings</h2>
        <p className="text-ink-light mb-6">
          This page is a placeholder for future admin settings such as store hours,
          theme defaults, notification preferences, and account management.
        </p>

        <div className="space-y-4 max-w-xl">
          <div className="flex items-center justify-between py-3 border-b border-cream-100">
            <div>
              <p className="font-medium text-ink">Email notifications</p>
              <p className="text-xs text-ink-light">Receive alerts for new reservations and messages</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-sage relative">
              <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-cream-100">
            <div>
              <p className="font-medium text-ink">Dark mode default</p>
              <p className="text-xs text-ink-light">Use dark theme for admin panel by default</p>
            </div>
            <div className="w-11 h-6 rounded-full bg-cream-200 relative">
              <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white" />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
