import React from "react";
import { Link } from "react-router-dom";

const projects = [
  {
    name: "3D Portfolio Website",
    description:
      "An immersive, interactive portfolio built with Three.js and React, featuring a sci-fi themed 3D environment.",
    problem:
      "Traditional portfolio websites lack engagement and fail to showcase creative development skills in an interactive way.",
    solution:
      "Built a fully interactive 3D room that users can explore, with clickable objects that reveal different sections — creating a memorable, gamified portfolio experience.",
    technologies: [
      "React",
      "Three.js",
      "React Three Fiber",
      "Tailwind CSS",
      "Vite",
    ],
    role: "Full-Stack Developer — designed the 3D scene, implemented interactive meshes, camera animations, and responsive UI overlays.",
    links: {
      demo: "#",
      repo: "https://github.com/sammy/3d-portfolio",
    },
  },
  {
    name: "E-Commerce Dashboard",
    description:
      "A real-time analytics dashboard for tracking sales, inventory, and customer insights.",
    problem:
      "Business owners struggled to get a unified view of their store metrics across multiple platforms.",
    solution:
      "Created a centralized dashboard with real-time data visualization, filtering, and export capabilities — reducing decision-making time by 40%.",
    technologies: ["React", "Node.js", "Chart.js", "MongoDB", "Express"],
    role: "Frontend Lead — built the UI components, data visualization charts, and integrated REST APIs.",
    links: {
      demo: "#",
      repo: "https://github.com/sammy/ecommerce-dashboard",
    },
  },
  {
    name: "Task Management App",
    description:
      "A collaborative task manager with real-time updates, drag-and-drop boards, and team features.",
    problem:
      "Small teams needed a lightweight, intuitive project management tool without the complexity of enterprise solutions.",
    solution:
      "Built a Kanban-style board with real-time sync, role-based access, and smart notifications — adopted by 3 teams within the first month.",
    technologies: ["React", "Firebase", "Tailwind CSS", "Framer Motion"],
    role: "Solo Developer — handled full design, development, deployment, and user testing.",
    links: {
      demo: "#",
      repo: "https://github.com/sammy/task-manager",
    },
  },
];

function Projects() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050510] via-[#0a0a2e] to-[#050510] text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium mb-8 transition-colors"
        >
          ← Back to Scene
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            Projects
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl">
          A selection of work that reflects my passion for building meaningful,
          well-crafted digital experiences.
        </p>
      </div>

      {/* Project Cards */}
      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-10">
        {projects.map((project, index) => (
          <article
            key={index}
            className="group bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/80 border border-gray-700/40 hover:border-cyan-500/30 rounded-2xl p-8 transition-all duration-500 shadow-lg hover:shadow-cyan-500/10"
          >
            {/* Project Number + Name */}
            <div className="flex items-start gap-4 mb-5">
              <span className="text-cyan-500/40 text-5xl font-black leading-none select-none">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {project.name}
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  {project.description}
                </p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {/* The Problem */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70">
                  The Problem
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {project.problem}
                </p>
              </div>

              {/* My Solution */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70">
                  My Solution
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {project.solution}
                </p>
              </div>

              {/* My Role */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70">
                  My Role
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {project.role}
                </p>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-[11px] font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700/40">
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold tracking-wide shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 hover:shadow-cyan-400/30 transition-all duration-300"
                >
                  Live Demo ↗
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl border border-gray-600 text-gray-300 text-xs font-bold tracking-wide hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300"
                >
                  Source Code ↗
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Projects;
