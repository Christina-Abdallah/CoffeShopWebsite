import { Coffee } from "lucide-react";

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-ink/5 bg-cream-soft py-10 dark:border-cream/10 dark:bg-forest-deep">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2 font-display text-lg font-semibold">
          <Coffee size={20} className="text-forest dark:text-clay-light" />
          Brew &amp; Co.
        </div>
        <p className="text-sm text-ink/60 dark:text-cream-soft/60">
          &copy; {new Date().getFullYear()} Brew &amp; Co. Locally roasted, always fresh.
        </p>
        <div className="flex gap-4 text-ink/60 dark:text-cream-soft/60">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="transition-colors hover:text-clay"
          >
            <InstagramIcon width={20} height={20} />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="transition-colors hover:text-clay"
          >
            <FacebookIcon width={20} height={20} />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="transition-colors hover:text-clay"
          >
            <TwitterIcon width={20} height={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
// import { Coffee } from "lucide-react";

//  export default function Footer() {
//    return (
//      <footer className="border-t border-ink/5 bg-cream-soft py-10 dark:border-cream/10 dark:bg-forest-deep">
//        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center md:flex-row md:justify-between md:text-left">
//          <div className="flex items-center gap-2 font-display text-lg font-semibold">
//            <Coffee size={20} className="text-forest dark:text-clay-light" />
//            Brew &amp; Co.
//          </div>
//          <p className="text-sm text-ink/60 dark:text-cream-soft/60">
//            &copy; {new Date().getFullYear()} Brew &amp; Co. Locally roasted, always fresh.
//          </p>
//          <div className="flex gap-4 text-sm font-medium text-ink/60 dark:text-cream-soft/60">
//            <a href="#" className="transition-colors hover:text-clay">Instagram</a>
//            <a href="#" className="transition-colors hover:text-clay">Facebook</a>
//            <a href="#" className="transition-colors hover:text-clay">Twitter</a>
//          </div>
//        </div>
//      </footer>
//    );
//  }