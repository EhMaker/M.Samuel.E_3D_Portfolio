import React from "react";

/**
 * ContactSection — futuristic Contact & Credibility overlay.
 *
 * Renders as a full-screen modal with interactive 3D-style icons
 * for Email, GitHub, LinkedIn, and a Resume download button.
 *
 * Props:
 *   onClose – callback to dismiss the overlay
 */

/* ── SVG icon components ─────────────────────────────────── */
const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-7 h-7"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-7 h-7"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ResumeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-7 h-7"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="12" y1="18" x2="12" y2="12" />
    <polyline points="9 15 12 18 15 15" />
  </svg>
);

/* ── Contact items config ────────────────────────────────── */
const contactItems = [
  {
    label: "Email",
    ariaLabel: "Send email to monsamuel38@gmail.com",
    href: "mailto:monsamuel38@gmail.com",
    external: false,
    icon: <EmailIcon />,
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/40",
    hoverBorder: "hover:border-cyan-400/60",
    description: "monsamuel38@gmail.com",
  },
  {
    label: "GitHub",
    ariaLabel: "Open GitHub profile in new tab",
    href: "https://github.com/EhMaker",
    external: true,
    icon: <GitHubIcon />,
    color: "from-gray-400 to-gray-200",
    glow: "shadow-gray-400/30",
    hoverBorder: "hover:border-gray-400/60",
    description: "github.com/EhMaker",
  },
  {
    label: "LinkedIn",
    ariaLabel: "Open LinkedIn profile in new tab",
    href: "https://www.linkedin.com/in/ehmaker001/",
    external: true,
    icon: <LinkedInIcon />,
    color: "from-blue-500 to-blue-400",
    glow: "shadow-blue-500/40",
    hoverBorder: "hover:border-blue-400/60",
    description: "linkedin.com/in/ehmaker001",
  },
  {
    label: "Resume",
    ariaLabel: "Download resume PDF",
    href: `${import.meta.env.BASE_URL}Document/M.Samuel%20Resume_Feb.pdf`,
    external: false,
    download: "M.Samuel_Resume.pdf",
    icon: <ResumeIcon />,
    color: "from-emerald-400 to-cyan-400",
    glow: "shadow-emerald-400/40",
    hoverBorder: "hover:border-emerald-400/60",
    description: "Download my CV",
  },
];

const ContactSection = ({ onClose }) => {
  return (
    <section
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Contact and credibility"
    >
      <div className="relative w-full max-w-md mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close contact section"
          className="absolute -top-2 -right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/80 border border-gray-600/40 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-lg font-bold"
        >
          &times;
        </button>

        {/* Card */}
        <div className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
          {/* Header */}
          <header className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-wide mb-1">
              Let's Connect
            </h2>
            <p className="text-gray-400 text-xs tracking-wide">
              Available for freelance &amp; collaboration
            </p>
            {/* Decorative line */}
            <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </header>

          {/* Contact grid */}
          <nav className="grid grid-cols-2 gap-4" aria-label="Contact methods">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.ariaLabel}
                {...(item.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                {...(item.download ? { download: item.download } : {})}
                className={`group relative flex flex-col items-center gap-2.5 p-5 rounded-xl
                  bg-gray-800/40 border border-gray-700/40 ${item.hoverBorder}
                  transition-all duration-300 ease-out
                  hover:bg-gray-800/70 hover:shadow-xl hover:${item.glow}
                  hover:-translate-y-1 hover:scale-[1.03]
                  active:scale-[0.98]`}
                style={{ perspective: "600px" }}
              >
                {/* Icon circle with gradient bg */}
                <div
                  className={`flex items-center justify-center w-14 h-14 rounded-full
                    bg-gradient-to-br ${item.color} text-white
                    shadow-lg ${item.glow}
                    transition-all duration-300
                    group-hover:shadow-xl group-hover:scale-110
                    group-hover:rotate-[5deg]`}
                >
                  {item.icon}
                </div>

                {/* Label */}
                <span className="text-sm font-bold text-white tracking-wide">
                  {item.label}
                </span>

                {/* Description */}
                <span className="text-[10px] text-gray-400 text-center leading-snug group-hover:text-gray-300 transition-colors">
                  {item.description}
                </span>

                {/* Subtle corner glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
              </a>
            ))}
          </nav>

          {/* Footer tagline */}
          <p className="text-center text-gray-500 text-[10px] mt-6 tracking-wider uppercase">
            Built with purpose &amp; precision
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
