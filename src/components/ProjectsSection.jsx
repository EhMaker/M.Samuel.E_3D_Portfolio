import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * ProjectsSection — Contact-Section-consistent design language.
 *
 * Uses the same bg-gradient-to-br, border border-cyan-500/20, rounded-2xl,
 * shadow-2xl shadow-cyan-500/5 pattern as the Contact overlay, ensuring
 * visual consistency across the entire portfolio.
 *
 * Props:
 *   projects – array of project objects
 *   onClose  – callback to dismiss the overlay
 */

/* ── Keyframes ───────────────────────────────────────────── */
const animStyles = `
@keyframes cardFadeUp {
  0%   { opacity: 0; transform: translateY(30px) scale(0.96); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes detailSlideUp {
  0%   { opacity: 0; transform: translateY(50px) scale(0.94); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes detailSlideDown {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(40px) scale(0.95); }
}
@keyframes backdropFadeIn {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes sectionReveal {
  0%   { opacity: 0; transform: translateY(16px); }
  100% { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes slideFadeIn {
  0%   { opacity: 0; transform: scale(0.97); }
  100% { opacity: 1; transform: scale(1); }
}
`;

/* ─────────────────────────────────────────────────────────── */
/*  Image Slider                                               */
/* ─────────────────────────────────────────────────────────── */
const ImageSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const touchStartX = useRef(null);

  const validImages = images.filter((_, i) => !imgErrors[i]);
  const validIndices = images.map((_, i) => i).filter((i) => !imgErrors[i]);

  if (!images.length) return null;

  const currentValid = validIndices.indexOf(current);
  const effectiveCurrent = currentValid === -1 ? 0 : currentValid;

  const goTo = (idx) => setCurrent(validIndices[idx] ?? 0);
  const prev = () =>
    goTo((effectiveCurrent - 1 + validImages.length) % validImages.length);
  const next = () => goTo((effectiveCurrent + 1) % validImages.length);

  const handleImgError = (idx) => {
    setImgErrors((p) => ({ ...p, [idx]: true }));
    if (validIndices.length > 1) {
      const nxt = validIndices.find((i) => i !== idx);
      if (nxt !== undefined) setCurrent(nxt);
    }
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  if (!validImages.length) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden
        bg-gray-950/50 border border-cyan-500/10 group/slider"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Counter badge */}
      <div
        className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full
        bg-gray-900/80 border border-gray-700/40 text-[10px] text-gray-400 tracking-wide backdrop-blur-sm"
      >
        {effectiveCurrent + 1} / {validImages.length}
      </div>

      {/* Image viewport */}
      <div className="relative w-full aspect-video">
        {images.map(
          (src, i) =>
            !imgErrors[i] && (
              <img
                key={src}
                src={import.meta.env.BASE_URL + src.replace(/^\//, "")}
                alt={`Screenshot ${i + 1}`}
                onError={() => handleImgError(i)}
                className={`absolute inset-0 w-full h-full object-contain transition-all duration-500 ease-out ${
                  current === i
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
                style={{
                  animation:
                    current === i
                      ? "slideFadeIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both"
                      : "none",
                }}
                draggable={false}
              />
            ),
        )}
        {validImages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs">
            No screenshots available
          </div>
        )}
      </div>

      {/* Arrows */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
              rounded-full bg-gray-900/70 border border-gray-600/30 text-gray-300
              opacity-0 group-hover/slider:opacity-100 transition-all duration-300
              hover:bg-gray-800/90 hover:border-cyan-500/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-110
              active:scale-95 backdrop-blur-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next screenshot"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center
              rounded-full bg-gray-900/70 border border-gray-600/30 text-gray-300
              opacity-0 group-hover/slider:opacity-100 transition-all duration-300
              hover:bg-gray-800/90 hover:border-cyan-500/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20 hover:scale-110
              active:scale-95 backdrop-blur-sm"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {validImages.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === effectiveCurrent
                  ? "w-5 h-1.5 bg-cyan-400 shadow-sm shadow-cyan-400/40"
                  : "w-1.5 h-1.5 bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/*  Project Card (grid thumbnail)                              */
/* ─────────────────────────────────────────────────────────── */
const ProjectCard = ({ project, index, visible, onClick }) => {
  const stagger = index * 0.1;

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className="group relative flex flex-col cursor-pointer
        bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95
        border border-cyan-500/20 hover:border-cyan-500/50
        rounded-2xl p-5 sm:p-6 transition-all duration-500 ease-out
        shadow-2xl shadow-cyan-500/5
        hover:shadow-cyan-500/15 hover:-translate-y-2 hover:scale-[1.03]
        active:scale-[0.97]"
      style={{
        opacity: visible ? undefined : 0,
        animation: visible
          ? `cardFadeUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${stagger}s both`
          : "none",
      }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, rgba(6,182,212,0.04) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s linear infinite",
        }}
      />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-transparent" />

      {/* Number + Title */}
      <div className="flex items-start gap-3 mb-3">
        <span className="text-cyan-500/25 text-4xl font-black leading-none select-none tracking-tight transition-colors duration-500 group-hover:text-cyan-500/50">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wide group-hover:text-cyan-300 transition-colors duration-300 leading-snug">
            {project.name}
          </h3>
          <p className="text-gray-400 text-[11px] sm:text-xs mt-1 leading-relaxed tracking-wide line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>

      {/* Tech pills */}
      <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
        {project.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded-full
              bg-cyan-500/10 text-cyan-300/80 border border-cyan-500/15
              tracking-wide transition-all duration-300
              group-hover:bg-cyan-500/15 group-hover:border-cyan-500/30 group-hover:text-cyan-200"
          >
            {tech}
          </span>
        ))}
        {project.technologies.length > 4 && (
          <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-semibold rounded-full bg-gray-700/40 text-gray-400 border border-gray-600/20 tracking-wide">
            +{project.technologies.length - 4}
          </span>
        )}
      </div>

      {/* CTA hint */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-700/20">
        <span className="text-[10px] text-gray-500 tracking-wider uppercase transition-colors duration-300 group-hover:text-cyan-400/70">
          Click to view details
        </span>
        <svg
          className="w-3 h-3 text-gray-600 group-hover:text-cyan-400/70 transition-colors duration-300 ml-auto"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </article>
  );
};

/* ─────────────────────────────────────────────────────────── */
/*  Detail Section Block                                       */
/* ─────────────────────────────────────────────────────────── */
const DetailBlock = ({ label, children, delay = 0 }) => (
  <div
    className="space-y-3 rounded-xl bg-gray-800/20 border border-gray-700/20 p-4 sm:p-5"
    style={{
      animation: `sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
    }}
  >
    <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
      {label}
    </h4>
    <div className="w-8 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
    {children}
  </div>
);

/* ─────────────────────────────────────────────────────────── */
/*  Project Detail View (full-screen overlay)                  */
/* ─────────────────────────────────────────────────────────── */
const ProjectDetail = ({ project, index, onBack }) => {
  const [closing, setClosing] = useState(false);

  const handleBack = useCallback(() => {
    setClosing(true);
    setTimeout(() => onBack(), 350);
  }, [onBack]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Details for ${project.name}`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={handleBack}
        style={{ animation: "backdropFadeIn 0.3s ease-out both" }}
      />

      {/* Centered wrapper — wider variant matching contact pattern */}
      <div
        className="relative z-10 w-full max-w-3xl mx-4 my-6 sm:my-12"
        style={{
          animation: closing
            ? "detailSlideDown 0.35s cubic-bezier(0.55, 0, 1, 0.45) both"
            : "detailSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        {/* Main card — same pattern as ContactSection */}
        <div
          className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95
          border border-cyan-500/20 rounded-2xl shadow-2xl shadow-cyan-500/5 overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

          <div className="p-6 sm:p-8 space-y-8">
            {/* ─── Section 1: Header ─── */}
            <header
              style={{
                animation:
                  "sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                    bg-gray-800/60 border border-gray-600/40 text-gray-400 text-[11px] tracking-wide
                    hover:text-cyan-300 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20
                    transition-all duration-300"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back to projects
                </button>
              </div>

              <div className="flex items-start gap-4">
                <span className="text-cyan-500/20 text-5xl sm:text-6xl font-black leading-none select-none tracking-tight shrink-0">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide leading-tight">
                    {project.name}
                  </h2>
                </div>
              </div>

              {/* Decorative line */}
              <div className="mt-5 w-full h-px bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent" />
            </header>

            {/* ─── Section 2: Description ─── */}
            <DetailBlock label="About This Project" delay={0.12}>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed tracking-wide">
                {project.description}
              </p>
            </DetailBlock>

            {/* ─── Section 3: Screenshots ─── */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div
                style={{
                  animation:
                    "sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.18s both",
                }}
              >
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400 mb-3">
                  Screenshots
                </h4>
                <div className="w-8 h-px bg-gradient-to-r from-cyan-500/60 to-transparent mb-4" />
                <div className="rounded-2xl overflow-hidden border border-cyan-500/10 bg-gray-950/40">
                  <ImageSlider images={project.screenshots} />
                </div>
              </div>
            )}

            {/* ─── Section 4: Problem ─── */}
            {project.problem && (
              <DetailBlock label="The Problem" delay={0.22}>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed tracking-wide">
                  {project.problem}
                </p>
              </DetailBlock>
            )}

            {/* ─── Section 5: Solution ─── */}
            {project.solution && (
              <DetailBlock label="My Solution" delay={0.26}>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed tracking-wide">
                  {project.solution}
                </p>
              </DetailBlock>
            )}

            {/* ─── Section 6: Technologies ─── */}
            <DetailBlock label="Technologies Used" delay={0.3}>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, i) => (
                  <span
                    key={tech}
                    className="px-3 py-1 text-[10px] sm:text-[11px] font-semibold rounded-full
                      bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wide
                      hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
                    style={{
                      animation: `sectionReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${0.35 + i * 0.03}s both`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </DetailBlock>

            {/* ─── Section 7: My Role ─── */}
            {project.role && (
              <DetailBlock label="My Role" delay={0.34}>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed tracking-wide">
                  {project.role}
                </p>
              </DetailBlock>
            )}

            {/* ─── Links ─── */}
            <div
              className="flex flex-wrap gap-3 pt-6 border-t border-gray-700/30"
              style={{
                animation:
                  "sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.4s both",
              }}
            >
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live demo of ${project.name}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold tracking-wide
                    shadow-lg shadow-cyan-500/25
                    hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/35
                    hover:scale-[1.04] active:scale-[0.97]
                    transition-all duration-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                  Live Demo
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source code of ${project.name}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                    border border-gray-600/60 text-gray-300 text-xs font-bold tracking-wide
                    hover:border-cyan-500/50 hover:text-cyan-300 hover:shadow-lg hover:shadow-cyan-500/10
                    hover:scale-[1.04] active:scale-[0.97]
                    transition-all duration-300"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                  Source Code
                </a>
              )}
            </div>

            {/* Footer tagline */}
            <p className="text-center text-gray-500 text-[10px] tracking-wider uppercase pt-2">
              Built with purpose &amp; precision
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────── */
/*  Main ProjectsSection (grid overlay)                        */
/* ─────────────────────────────────────────────────────────── */
const ProjectsSection = ({ projects, onClose }) => {
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCardClick = useCallback((idx) => setSelectedIdx(idx), []);
  const handleBack = useCallback(() => setSelectedIdx(null), []);

  return (
    <section
      className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto bg-black/70 backdrop-blur-md"
      style={{ overflowX: "hidden" }}
      role="dialog"
      aria-modal="true"
      aria-label="Projects showcase"
      ref={scrollRef}
    >
      <style>{animStyles}</style>

      {/* Centered wrapper — contact-section-consistent */}
      <div className="relative w-full max-w-5xl mx-4 my-8 sm:my-12">
        {/* Close button — same style as contact close */}
        <button
          onClick={onClose}
          aria-label="Close projects section"
          className="absolute -top-2 -right-2 z-30 w-9 h-9 flex items-center justify-center
            rounded-full bg-gray-800/80 border border-gray-600/40 text-gray-400
            hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20
            transition-all duration-300 text-lg font-bold"
        >
          &times;
        </button>

        {/* Card container — same gradient/border/shadow as ContactSection */}
        <div
          className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95
          border border-cyan-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/5"
        >
          {/* Header */}
          <header className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-white tracking-wide mb-1">
              Projects
            </h2>
            <p className="text-gray-400 text-xs tracking-wide max-w-md mx-auto">
              A selection of work that reflects my passion for building
              meaningful, well-crafted digital experiences.
            </p>
            <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
          </header>

          {/* Card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.name}
                project={project}
                index={idx}
                visible={visible}
                onClick={() => handleCardClick(idx)}
              />
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-[10px] mt-8 tracking-wider uppercase">
            Built with purpose &amp; precision
          </p>
        </div>
      </div>

      {/* Detail overlay */}
      {selectedIdx !== null && (
        <ProjectDetail
          project={projects[selectedIdx]}
          index={selectedIdx}
          onBack={handleBack}
        />
      )}
    </section>
  );
};

export default ProjectsSection;
