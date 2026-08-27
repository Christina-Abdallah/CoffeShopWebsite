import { Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f4f0] text-black">
      <header className="flex h-[100px] w-full items-center justify-center bg-[#152e20] px-6 py-6">
        <div className="flex h-[70px] items-center gap-3 text-white">
          <Coffee size={36} strokeWidth={1.8} className="text-[#d27b5a]" />
          <span className="text-[21px] font-black leading-none" style={{ fontFamily: "'Fraunces', serif" }}>
            Brew &amp; Co.
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1221px] flex-1 flex-col items-center justify-center gap-12 px-6 py-16 md:flex-row md:items-center md:gap-[72px] md:translate-y-[16px]">
        <div className="flex w-full max-w-[623px] flex-col items-center text-center md:items-center">
          <h1 className="m-0 w-full text-[clamp(56px,6.67vw,96px)] font-extrabold leading-none" style={{ fontFamily: "'Rubik', sans-serif" }}>
            404 - ERROR
          </h1>

          <h2 className="mb-0 mt-[23px] w-full text-[clamp(28px,2.78vw,40px)] font-semibold uppercase leading-tight tracking-[0.1em]" style={{ fontFamily: "'Rubik', sans-serif" }}>
            Page Not Found
          </h2>

          <p className="mb-0 mt-[23px] w-full text-[clamp(20px,2.22vw,32px)] font-light leading-tight tracking-[0.2em]" style={{ fontFamily: "'Rubik', sans-serif" }}>
            Your search results are broken
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-[23px] rounded-[58px] border border-[#d27b5a] bg-transparent px-[50px] py-5 text-[20px] font-medium leading-6 transition-colors hover:bg-[#d27b5a] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#d27b5a] focus:ring-offset-2"
            style={{ fontFamily: "'Rubik', sans-serif" }}
          >
            Back To Home
          </button>
        </div>

        <div className="flex h-[260px] w-full max-w-[497px] shrink-0 items-center justify-center md:h-[328px]">
          <img
            src="/brokencoffee.png"
            alt=""
            className="h-full w-full object-contain"
          />
        </div>
      </main>
    </div>
  );
}