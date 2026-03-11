import React, { useEffect, useRef, useState, useCallback } from "react";

/**
 * ProjectsSection — compact card grid → cinematic detail view.
 *
 * Cards show only the essentials (number, title, short description, tech pills).
 * Clicking a card opens a focused detail view with smooth animations,
 * dimmed background, and a clean modern layout for full project info.
 *
 * Props:
 *   projects – array of project objects
 *   onClose  – callback to dismiss the overlay
 */

/* ── Keyframes ───────────────────────────────────────────── */
const animStyles = `
/* Card entrance: staggered fade-up */
@keyframes cardFadeUp {
  0%   { opacity: 0; transform: translateY(40px) scale(0.95); }
  60%  { opacity: 1; transform: translateY(-4px) scale(1.01); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* Detail view entrance */
@keyframes detailSlideUp {
  0%   { opacity: 0; transform: translateY(60px) scale(0.92); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* Detail view exit */
@keyframes detailSlideDown {
  0%   { opacity: 1; transform: translateY(0) scale(1); }
  100% { opacity: 0; transform: translateY(40px) scale(0.95); }
}

/* Backdrop fade */
@keyframes backdropFadeIn {
  0%   { opacity: 0; }
  100% { opacity: 1; }
}

/* Section reveal for detail blocks */
@keyframes sectionReveal {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Subtle shimmer on card hover */
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Slider image transitions */
@keyframes slideFadeIn {
  0%   { opacity: 0; transform: scale(0.97); }
  100% { opacity: 1; transform: scale(1); }
}
`;

/* ── Image Slider for project screenshots ────────────────── */
const ImageSlider = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState({});
  const touchStartX = useRef(null);

  // Filter out images that failed to load
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
    setImgErrors((prev) => ({ ...prev, [idx]: true }));
    // Move to next valid image
    if (validIndices.length > 1) {
      const nextValid = validIndices.find((i) => i !== idx);
      if (nextValid !== undefined) setCurrent(nextValid);
    }
  };

  // Touch/swipe support
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    touchStartX.current = null;
  };

  if (!validImages.length) return null;

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-gray-950/60 border border-gray-700/30 group/slider"
      style={{
        animation:
          "sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Label */}
      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
        <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
          Screenshots
        </h4>
        <span className="text-[10px] text-gray-500 tracking-wide">
          {effectiveCurrent + 1} / {validImages.length}
        </span>
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

        {/* Placeholder when all images fail */}
        {validImages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-xs tracking-wide">
            No screenshots available
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous screenshot"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
              rounded-full bg-gray-900/70 border border-gray-600/30 text-gray-300
              opacity-0 group-hover/slider:opacity-100 transition-all duration-300
              hover:bg-gray-800 hover:border-cyan-500/50 hover:text-cyan-300 hover:scale-110
              active:scale-95"
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
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
              rounded-full bg-gray-900/70 border border-gray-600/30 text-gray-300
              opacity-0 group-hover/slider:opacity-100 transition-all duration-300
              hover:bg-gray-800 hover:border-cyan-500/50 hover:text-cyan-300 hover:scale-110
              active:scale-95"
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

      {/* Dot indicators */}
      {validImages.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 py-3">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to screenshot ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === effectiveCurrent
                  ? "w-5 h-1.5 bg-cyan-400"
                  : "w-1.5 h-1.5 bg-gray-600 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Compact project card (summary only) ─────────────────── */
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
        border border-gray-700/30 hover:border-cyan-500/50
        rounded-2xl p-5 sm:p-6 transition-all duration-500 ease-out
        hover:shadow-2xl hover:shadow-cyan-500/15
        hover:-translate-y-2 hover:scale-[1.03]
        active:scale-[0.97] active:shadow-cyan-500/5"
      style={{
        opacity: visible ? undefined : 0,
        animation: visible
          ? `cardFadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${stagger}s both`
          : "none",
      }}
    >
      {/* Hover shimmer overlay */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, rgba(6,182,212,0.04) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 2s linear infinite",
        }}
      />

      {/* Corner accent glow */}
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

      {/* Tech pills (max 4 shown on card) */}
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

      {/* "View details" hint */}
      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-700/20">
        <span className="text-[10px] text-gray-500 tracking-wider uppercase transition-colors duration-300 group-hover:text-cyan-400/70">
          A click to view details
        </span>
      </div>
    </article>
  );
};

/* ── Detail section block ────────────────────────────────── */
const DetailBlock = ({ label, text, icon, delay = 0 }) => (
  <div
    className="space-y-2"
    style={{
      animation: `sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
    }}
  >
    <h4 className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </h4>
    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed tracking-wide">
      {text}
    </p>
  </div>
);

/* ── Expanded project detail view ────────────────────────── */
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
      {/* Dimmed backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={handleBack}
        style={{ animation: "backdropFadeIn 0.3s ease-out both" }}
      />

      {/* Detail card */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 my-8 sm:my-16"
        style={{
          animation: closing
            ? "detailSlideDown 0.35s cubic-bezier(0.55, 0, 1, 0.45) both"
            : "detailSlideUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <div className="bg-gradient-to-br from-gray-900/98 via-gray-900/95 to-gray-950/98 border border-cyan-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/10">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

          <div className="p-6 sm:p-8">
            {/* Back button */}
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 mb-6 text-gray-400 text-xs tracking-wide
                hover:text-cyan-300 transition-all duration-300 group/back"
            >
              Back to projects
            </button>

            {/* Header */}
            <header
              className="mb-8"
              style={{
                animation:
                  "sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both",
              }}
            >
              <div className="flex items-start gap-4 mb-3">
                <span className="text-cyan-500/20 text-5xl sm:text-6xl font-black leading-none select-none tracking-tight">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide leading-tight">
                    {project.name}
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm mt-2 leading-relaxed tracking-wide">
                    {project.description}
                  </p>
                </div>
              </div>
              {/* Decorative line */}
              <div className="mt-5 w-full h-px bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent" />
            </header>

            {/* Screenshot slider */}
            {project.screenshots && project.screenshots.length > 0 && (
              <div className="mb-8">
                <ImageSlider images={project.screenshots} />
              </div>
            )}

            {/* Content grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <DetailBlock
                label="The Problem"
                text={project.problem}
                delay={0.15}
              />
              <DetailBlock
                label="My Solution"
                text={project.solution}
                delay={0.2}
              />
              <DetailBlock label="My Role" text={project.role} delay={0.25} />

              {/* Technologies */}
              <div
                className="space-y-2"
                style={{
                  animation:
                    "sectionReveal 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both",
                }}
              >
                <h4 className="flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-cyan-400/80">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-full
                        bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wide
                        hover:bg-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300"
                      style={{
                        animation: `sectionReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) ${0.35 + i * 0.04}s both`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links */}
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
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl
                    bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold tracking-wide
                    shadow-lg shadow-cyan-500/25
                    hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/35
                    hover:scale-[1.04] active:scale-[0.97]
                    transition-all duration-300"
                >
                  Live Demo
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Source code of ${project.name}`}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl
                    border border-gray-600/60 text-gray-300 text-xs font-bold tracking-wide
                    hover:border-cyan-500/50 hover:text-cyan-300
                    hover:scale-[1.04] active:scale-[0.97]
                    transition-all duration-300"
                >
                  Source Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ──────────────────────────────────────── */
const ProjectsSection = ({ projects, onClose }) => {
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  /* Trigger entrance animations after mount */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleCardClick = useCallback((idx) => {
    setSelectedIdx(idx);
  }, []);

  const handleBack = useCallback(() => {
    setSelectedIdx(null);
  }, []);

  return (
    <section
      className="absolute inset-0 z-20 overflow-y-auto bg-black/70 backdrop-blur-md"
      style={{ overflowX: "hidden" }}
      role="dialog"
      aria-modal="true"
      aria-label="Projects showcase"
      ref={scrollRef}
    >
      {/* Inject keyframes */}
      <style>{animStyles}</style>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close projects section"
          className="fixed top-8 right-4 sm:absolute sm:top-2 sm:-right-2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/80 border border-gray-600/40 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-lg font-bold"
        >
          &times;
        </button>

        {/* Header */}
        <header className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-white tracking-wide mb-1">
            Projects
          </h2>
          <p className="text-gray-400 text-xs tracking-wide max-w-md mx-auto">
            A selection of work that reflects my passion for building
            meaningful, well-crafted digital experiences.
          </p>
          {/* Decorative line */}
          <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
        </header>

        {/* Card grid — compact summaries */}
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

        {/* Footer tagline */}
        <p className="text-center text-gray-500 text-[10px] mt-10 tracking-wider uppercase">
          Built with purpose &amp; precision
        </p>
      </div>

      {/* Detail view overlay (when a card is selected) */}
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
