import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Coffee } from "lucide-react";
import { useAdmin } from "../useAdmin";

export default function AdminLogin() {
  const { login } = useAdmin();
  const navigate = useNavigate();
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
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f4f0] text-[#000000b2]" style={{ fontFamily: "'Commissioner', sans-serif" }}>
      <header className="h-[100px] bg-[#152e20] px-6 py-6 flex items-center justify-center">
        <div className="flex h-[70px] w-[194px] items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full">
            <Coffee size={24} strokeWidth={1.8} className="text-[#d27b5a]" />
          </div>
          <h1 className="text-[21px] font-black leading-none text-white" style={{ fontFamily: "'Fraunces', serif" }}>
            Brew &amp; Co.
          </h1>
        </div>
      </header>

      <main className="flex flex-col items-center px-6 pb-12">
        <div className="mt-[63px] flex flex-col items-center">
          <div className="flex size-[138px] items-center justify-center rounded-[18px]">
            <Coffee size={75} strokeWidth={1.5} className="text-[#d27b5a]" />
          </div>
          <h2 className="mt-0 text-[40px] font-black leading-[49px] text-[#152e20]" style={{ fontFamily: "'Fraunces', serif" }}>
            Brew &amp; Co.
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-[63px] flex w-full max-w-[372px] flex-col gap-[14px]">
          {error && (
            <div className="rounded-[7px] bg-[#fce9e5] px-[14px] py-3 text-xs text-[#8d3024]" role="alert">
              {error}
            </div>
          )}

          <label className="sr-only" htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[47px] rounded-[7px] border-0 bg-white px-[14px] text-xs text-[#000000b2] outline-none placeholder:text-[#000000b2] focus:ring-2 focus:ring-[#d27b5a]"
            required
          />

          <label className="sr-only" htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-[47px] rounded-[7px] border-0 bg-white px-[14px] text-xs tracking-[0.23em] text-[#000000b2] outline-none placeholder:text-[#000000b2] focus:ring-2 focus:ring-[#d27b5a]"
            required
          />

          <button
            type="submit"
            disabled={submitting}
            className="h-[47px] rounded-[7px] border border-[#d27b5a] bg-transparent text-sm font-medium tracking-[0.23em] text-[#000000b2] transition-colors hover:bg-[#d27b5a]/10 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Login"}
          </button>

          <div className="mt-1 flex items-center gap-1 text-[10px] font-extralight tracking-[0.23em] text-[#000000b2]">
            <span>You don’t have an account?</span>
            <span className="font-normal">Sign up</span>
          </div>
        </form>
      </main>
    </div>
  );
}
