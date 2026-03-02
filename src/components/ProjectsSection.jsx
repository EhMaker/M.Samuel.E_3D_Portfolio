import React, { useEffect, useRef, useState } from "react";

/**
 * ProjectsSection — futuristic projects overlay with physics-based animations.
 *
 * Animation logic (MANDATORY counter-motion):
 *   Odd rows  → container from RIGHT (100vw→0), children from LEFT (-60px→0)
 *   Even rows → container from LEFT (-100vw→0), children from RIGHT (60px→0)
 *   Container: slower, heavier (1.3s). Children: faster, lighter (0.9s).
 *   Both animate simultaneously with spring overshoot.
 *
 * Props:
 *   projects – array of project objects
 *   onClose  – callback to dismiss the overlay
 */

/* ── Keyframes: container (heavy) and children (light) ───── */
const animStyles = `
/* ─ ROW CONTAINERS (heavy, massive feel) ──────────────── */

/* Odd rows: container enters from RIGHT */
@keyframes rowFromRight {
  0%   { transform: translateX(100vw); }
  55%  { transform: translateX(-18px); }
  75%  { transform: translateX(8px); }
  88%  { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

/* Even rows: container enters from LEFT */
@keyframes rowFromLeft {
  0%   { transform: translateX(-100vw); }
  55%  { transform: translateX(18px); }
  75%  { transform: translateX(-8px); }
  88%  { transform: translateX(3px); }
  100% { transform: translateX(0); }
}

/* ─ INNER ELEMENTS (light, counter-direction) ─────────── */

/* Odd rows: children counter from LEFT */
@keyframes childFromLeft {
  0%   { opacity: 0; transform: translateX(-60px); }
  30%  { opacity: 0.6; }
  55%  { opacity: 1; transform: translateX(8px); }
  75%  { transform: translateX(-4px); }
  100% { opacity: 1; transform: translateX(0); }
}

/* Even rows: children counter from RIGHT */
@keyframes childFromRight {
  0%   { opacity: 0; transform: translateX(60px); }
  30%  { opacity: 0.6; }
  55%  { opacity: 1; transform: translateX(-8px); }
  75%  { transform: translateX(4px); }
  100% { opacity: 1; transform: translateX(0); }
}
`;

/* ── Single project card ─────────────────────────────────── */
const ProjectCard = ({ project, index, rowIndex, visible }) => {
  const isOddRow = rowIndex % 2 === 0; // 0-indexed: row 0 = "row 1" (odd)
  const childAnim = isOddRow ? "childFromLeft" : "childFromRight";
  const stagger = rowIndex * 0.12;

  return (
    <article
      className="group relative flex flex-col bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95
        border border-gray-700/30 hover:border-cyan-500/40
        rounded-2xl p-6 transition-all duration-300 ease-out
        hover:shadow-xl hover:shadow-cyan-500/10
        hover:-translate-y-1 hover:scale-[1.02]
        active:scale-[0.98]"
      style={{
        opacity: visible ? undefined : 0,
        animation: visible
          ? `${childAnim} 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${stagger}s both`
          : "none",
      }}
    >
      {/* Corner glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-transparent" />

      {/* Number + Title */}
      <div className="flex items-start gap-3 mb-4">
        <span className="text-cyan-500/30 text-3xl font-black leading-none select-none tracking-tight">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-white tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
            {project.name}
          </h3>
          <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed tracking-wide">
            {project.description}
          </p>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1 mb-5">
        <DetailBlock label="The Problem" text={project.problem} />
        <DetailBlock label="My Solution" text={project.solution} />
        <DetailBlock label="My Role" text={project.role} />
        <div className="space-y-1.5">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="flex gap-3 mt-auto pt-4 border-t border-gray-700/30">
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Live demo of ${project.name}`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl
              bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold tracking-wide
              shadow-lg shadow-cyan-500/20
              hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/30
              hover:scale-[1.04] active:scale-[0.97]
              transition-all duration-300"
          >
            Live Demo ↗
          </a>
        )}
        {project.links.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Source code of ${project.name}`}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl
              border border-gray-600/60 text-gray-300 text-[11px] font-bold tracking-wide
              hover:border-cyan-500/50 hover:text-cyan-300
              hover:scale-[1.04] active:scale-[0.97]
              transition-all duration-300"
          >
            Source Code ↗
          </a>
        )}
      </div>
    </article>
  );
};

/* ── Detail sub-block ────────────────────────────────────── */
const DetailBlock = ({ label, text }) => (
  <div className="space-y-1.5">
    <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
      {label}
    </h4>
    <p className="text-gray-300 text-xs leading-relaxed tracking-wide">
      {text}
    </p>
  </div>
);

/* ── Animated row wrapper (counter-motion container) ─────── */
const AnimatedRow = ({ children, rowIndex, visible }) => {
  const isOddRow = rowIndex % 2 === 0; // 0-indexed: row 0 = "row 1" (odd)
  const containerAnim = isOddRow ? "rowFromRight" : "rowFromLeft";
  const stagger = rowIndex * 0.12;

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 gap-5 will-change-transform"
      style={{
        transform: visible
          ? undefined
          : isOddRow
            ? "translateX(100vw)"
            : "translateX(-100vw)",
        animation: visible
          ? `${containerAnim} 1.3s cubic-bezier(0.22, 1, 0.36, 1) ${stagger}s both`
          : "none",
        overflow: "visible",
      }}
    >
      {children}
    </div>
  );
};

/* ── Main component ──────────────────────────────────────── */
const ProjectsSection = ({ projects, onClose }) => {
  const scrollRef = useRef(null);
  const [visible, setVisible] = useState(false);

  /* Trigger entrance animations after mount */
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  /* Group projects into rows of 2 */
  const rows = [];
  for (let i = 0; i < projects.length; i += 2) {
    rows.push(projects.slice(i, i + 2));
  }

  return (
    <section
      className="absolute inset-0 z-20 overflow-y-auto bg-black/70 backdrop-blur-md"
      style={{ overflowX: "hidden" }}
      role="dialog"
      aria-modal="true"
      aria-label="Projects showcase"
      ref={scrollRef}
    >
      {/* Inject counter-motion keyframes */}
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

        {/* Header — matches Contact design */}
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

        {/* Project rows — container + children animate in OPPOSITE directions */}
        <div className="space-y-5">
          {rows.map((row, rowIdx) => (
            <AnimatedRow key={rowIdx} rowIndex={rowIdx} visible={visible}>
              {row.map((project, colIdx) => (
                <ProjectCard
                  key={project.name}
                  project={project}
                  index={rowIdx * 2 + colIdx}
                  rowIndex={rowIdx}
                  visible={visible}
                />
              ))}
            </AnimatedRow>
          ))}
        </div>

        {/* Footer tagline */}
        <p className="text-center text-gray-500 text-[10px] mt-10 tracking-wider uppercase">
          Built with purpose &amp; precision
        </p>
      </div>
    </section>
  );
};

export default ProjectsSection;
