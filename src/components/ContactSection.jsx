import React, { useCallback, useState } from "react";
import emailjs from "@emailjs/browser";

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

const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID ||
  import.meta.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID ||
  import.meta.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY =
  import.meta.env.VITE_EMAILJS_PUBLIC_KEY ||
  import.meta.env.EMAILJS_PUBLIC_KEY;
const FORM_ANIM_MS = 260;

/* ── Contact items config ────────────────────────────────── */
const contactItems = [
  {
    label: "Email",
    ariaLabel: "Open message form",
    action: "open-form",
    icon: <EmailIcon />,
    color: "from-cyan-500 to-blue-500",
    glow: "shadow-cyan-500/40",
    hoverBorder: "hover:border-cyan-400/60",
    description: "Send me a message",
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
  const [formOpen, setFormOpen] = useState(false);
  const [formClosing, setFormClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);

  const openForm = useCallback(() => {
    setStatus(null);
    setErrors({});
    setFormOpen(true);
    setFormClosing(false);
  }, []);

  const closeForm = useCallback(() => {
    if (isSubmitting) return;
    setFormClosing(true);
    window.setTimeout(() => {
      setFormOpen(false);
      setFormClosing(false);
    }, FORM_ANIM_MS);
  }, [isSubmitting]);

  const handleFieldChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      return { ...prev, [name]: "" };
    });
  }, []);

  const validateForm = useCallback(() => {
    const nextErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();

    if (!trimmedName) nextErrors.name = "Name is required.";
    if (!trimmedEmail) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!trimmedMessage) nextErrors.message = "Message is required.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setStatus({
        type: "error",
        text: "Please complete all required fields correctly.",
      });
      return false;
    }
    return true;
  }, [formData.email, formData.message, formData.name]);

  const buildWhatsAppMessage = useCallback(() => {
    const lines = [
      "Hello Monday Samuel,",
      "",
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      "",
      "Message:",
      formData.message.trim(),
    ];
    return lines.join("\n");
  }, [formData.email, formData.message, formData.name]);

  const handleEmailSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (isSubmitting) return;
      if (!validateForm()) return;

      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        setStatus({
          type: "error",
          text: "Email service is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to the project-root .env.local file, then restart the dev server.",
        });
        return;
      }

      setIsSubmitting(true);
      setStatus(null);

      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name.trim(),
            from_email: formData.email.trim(),
            reply_to: formData.email.trim(),
            message: formData.message.trim(),
            to_name: "Monday Samuel",
          },
          { publicKey: EMAILJS_PUBLIC_KEY },
        );

        setStatus({
          type: "success",
          text: "Message sent successfully. Thank you for reaching out.",
        });
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
      } catch {
        setStatus({
          type: "error",
          text: "Message failed to send. Please try again or use WhatsApp.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, isSubmitting, validateForm],
  );

  const handleWhatsAppSend = useCallback(
    (event) => {
      event.preventDefault();
      if (isSubmitting) return;
      if (!validateForm()) return;

      const encodedMessage = encodeURIComponent(buildWhatsAppMessage());
      window.open(
        `https://wa.me/2348110182535?text=${encodedMessage}`,
        "_blank",
        "noopener,noreferrer",
      );
      setStatus({
        type: "success",
        text: "Opening WhatsApp with your message.",
      });
    },
    [buildWhatsAppMessage, isSubmitting, validateForm],
  );

  return (
    <section
      className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Contact and credibility"
    >
      <style>{`
        @keyframes contactFormOverlayIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes contactFormOverlayOut {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes contactFormCardIn {
          0% { opacity: 0; transform: translateY(20px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes contactFormCardOut {
          0% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(16px) scale(0.98); }
        }
      `}</style>

      <div className="relative w-full max-w-md mx-4">
        <button
          onClick={onClose}
          aria-label="Close contact section"
          className="absolute -top-2 -right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/80 border border-gray-600/40 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-lg font-bold"
        >
          &times;
        </button>

        <div className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
          <header className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-wide mb-1">
              Let's Connect
            </h2>
            <p className="text-gray-400 text-xs tracking-wide">
              Available for freelance &amp; collaboration
            </p>
            <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </header>

          <nav className="grid grid-cols-2 gap-4" aria-label="Contact methods">
            {contactItems.map((item) => {
              const cardClass = `group relative flex flex-col items-center gap-2.5 p-5 rounded-xl
                  bg-gray-800/40 border border-gray-700/40 ${item.hoverBorder}
                  transition-all duration-300 ease-out
                  hover:bg-gray-800/70 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.03]
                  active:scale-[0.98]`;

              if (item.action === "open-form") {
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={openForm}
                    aria-label={item.ariaLabel}
                    className={cardClass}
                    style={{ perspective: "600px" }}
                  >
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
                    <span className="text-sm font-bold text-white tracking-wide">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-gray-400 text-center leading-snug group-hover:text-gray-300 transition-colors">
                      {item.description}
                    </span>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
                  </button>
                );
              }

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.ariaLabel}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  {...(item.download ? { download: item.download } : {})}
                  className={cardClass}
                  style={{ perspective: "600px" }}
                >
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
                  <span className="text-sm font-bold text-white tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-gray-400 text-center leading-snug group-hover:text-gray-300 transition-colors">
                    {item.description}
                  </span>
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
                </a>
              );
            })}
          </nav>

          <p className="text-center text-gray-500 text-[10px] mt-6 tracking-wider uppercase">
            Built with purpose &amp; precision
          </p>
        </div>

        {formOpen && (
          <div
            className="absolute inset-0 z-30 flex items-center justify-center p-2 sm:p-3"
            style={{
              animation: formClosing
                ? `contactFormOverlayOut ${FORM_ANIM_MS}ms ease both`
                : `contactFormOverlayIn ${FORM_ANIM_MS}ms ease both`,
            }}
          >
            <div
              className="absolute inset-0 rounded-2xl bg-black/75 backdrop-blur-sm"
              onClick={closeForm}
            />

            <section
              className="relative z-10 w-full rounded-2xl bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-cyan-500/20 p-5 sm:p-6 shadow-2xl shadow-cyan-500/5"
              role="dialog"
              aria-modal="true"
              aria-label="Send message"
              style={{
                animation: formClosing
                  ? `contactFormCardOut ${FORM_ANIM_MS}ms cubic-bezier(0.55, 0, 1, 0.45) both`
                  : `contactFormCardIn ${FORM_ANIM_MS}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
              }}
            >
              <button
                type="button"
                onClick={closeForm}
                aria-label="Close message form"
                className="absolute -top-2 -right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800/90 border border-gray-600/40 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-base font-bold"
              >
                &times;
              </button>

              <header className="mb-4">
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide mb-1">
                  Send a Message
                </h3>
                <p className="text-gray-400 text-xs tracking-wide">
                  Fill the form below and send by Email or WhatsApp.
                </p>
                <div className="mt-3 w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              </header>

              {status && (
                <div
                  className={`mb-4 rounded-xl border px-3 py-2 text-xs leading-relaxed ${
                    status.type === "success"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                      : "border-rose-500/30 bg-rose-500/10 text-rose-200"
                  }`}
                  role="status"
                >
                  {status.text}
                </div>
              )}

              <form
                className="space-y-4"
                onSubmit={handleEmailSubmit}
                noValidate
              >
                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-gray-200 tracking-wide"
                    htmlFor="contact-name"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFieldChange}
                    placeholder="Your full name"
                    className={`w-full rounded-xl border bg-gray-900/60 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-cyan-500/60 ${
                      errors.name ? "border-rose-500/50" : "border-gray-700/50"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.name && (
                    <p className="text-[11px] text-rose-300">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-gray-200 tracking-wide"
                    htmlFor="contact-email"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange}
                    placeholder="you@example.com"
                    className={`w-full rounded-xl border bg-gray-900/60 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-cyan-500/60 ${
                      errors.email ? "border-rose-500/50" : "border-gray-700/50"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.email && (
                    <p className="text-[11px] text-rose-300">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    className="text-xs font-semibold text-gray-200 tracking-wide"
                    htmlFor="contact-message"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleFieldChange}
                    placeholder="Tell me about your project or idea..."
                    rows={5}
                    className={`w-full resize-none rounded-xl border bg-gray-900/60 px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-all duration-300 focus:border-cyan-500/60 ${
                      errors.message
                        ? "border-rose-500/50"
                        : "border-gray-700/50"
                    }`}
                    disabled={isSubmitting}
                    required
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-300">
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send via Email"}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-cyan-500/40 text-cyan-300 text-xs font-bold tracking-wide hover:border-cyan-400/70 hover:text-cyan-200 hover:shadow-lg hover:shadow-cyan-500/15 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={isSubmitting}
                  >
                    Send via WhatsApp
                  </button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
