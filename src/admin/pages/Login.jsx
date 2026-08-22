import { useState } from "react";
import { useAdmin } from "../useAdmin";

export default function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("admin@brewco.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center">
            <span className="text-cream font-display font-bold text-lg">B</span>
          </div>
          <div>
            <h1 className="text-xl font-display font-semibold text-ink">Brew & Co.</h1>
            <p className="text-sm text-ink-light">Admin Console</p>
          </div>
        </div>

        <h2 className="text-2xl font-display font-semibold text-ink mb-2">Welcome back</h2>
        <p className="text-ink-light mb-6">Sign in to manage your café.</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-light text-rose text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-ink focus:border-clay focus:ring-1 focus:ring-clay outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-2.5 text-ink focus:border-clay focus:ring-1 focus:ring-clay outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-forest text-cream py-3 font-medium hover:bg-forest-light transition disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
