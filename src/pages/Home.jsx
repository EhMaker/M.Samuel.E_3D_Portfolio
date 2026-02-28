import React, { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import Loader from "../components/Loader";
import CameraController from "../components/CameraController";
import CameraIntro from "../components/CameraIntro";
import ScifiRoom from "../models/ScifiRoom";
import WelcomeLoader from "../components/WelcomeLoader";
import audio from "../utils/audioManager";
import sammyPhoto from "../assets/Sammy1.jpg";
import * as THREE from "three";

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
    links: { demo: "#", repo: "https://github.com/sammy/3d-portfolio" },
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
    links: { demo: "#", repo: "https://github.com/sammy/ecommerce-dashboard" },
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
    links: { demo: "#", repo: "https://github.com/sammy/task-manager" },
  },
];

const Home = () => {
  const [sceneReady, setSceneReady] = useState(false);
  const [introPlaying, setIntroPlaying] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [zooming, setZooming] = useState(false);
  const [returning, setReturning] = useState(false);
  const [zoomTarget, setZoomTarget] = useState(null);
  const [zoomAction, setZoomAction] = useState(null);
  const zoomedInRef = React.useRef(false);

  const monitorTarget = new THREE.Vector3(-1.3, 0.35, 1.9);
  const posterTarget = new THREE.Vector3(-1.4, 0.7, 1.2);

  const handleMonitorClick = useCallback(() => {
    audio.playClickSound();
    setZoomTarget(monitorTarget);
    setZoomAction("projects");
    setZooming(true);
  }, []);

  const handlePosterClick = useCallback(() => {
    audio.playClickSound();
    setZoomTarget(posterTarget);
    setZoomAction("about");
    setZooming(true);
  }, []);

  const handleZoomComplete = useCallback(() => {
    setZooming(false);
    zoomedInRef.current = true;
    if (zoomAction === "projects") {
      setShowProjects(true);
    } else if (zoomAction === "about") {
      setShowAbout(true);
    }
  }, [zoomAction]);

  /* Unified close handler — hides overlay, then returns camera if it zoomed in */
  const handleCloseSection = useCallback(() => {
    audio.playClickSound();
    setShowAbout(false);
    setShowSkills(false);
    setShowProjects(false);
    if (zoomedInRef.current) {
      setReturning(true);
      zoomedInRef.current = false;
    }
  }, []);

  /* Called when the camera finishes animating back to the saved state */
  const handleReturnComplete = useCallback(() => {
    setReturning(false);
  }, []);

  /* Promise that resolves when the WelcomeLoader fully finishes.
     CameraIntro awaits this before starting the GSAP timeline,
     ensuring the loader's fade-out is complete first. */
  const introPromiseRef = React.useRef(null);
  const [introReady, setIntroReady] = useState(false);

  const handleWelcomeComplete = useCallback(() => {
    // Create a promise that resolves after a short settle delay
    const p = new Promise((resolve) => {
      // Small extra pause so the DOM has fully removed the overlay
      setTimeout(resolve, 100);
    });
    introPromiseRef.current = p;
    setSceneReady(true); // hide the loader overlay
    setIntroReady(true); // signal CameraIntro that the promise exists
    audio.startSceneMusic(); // begin looping background music as scene appears
    setIntroPlaying(true); // mark intro as active (locks controls)
  }, []);

  /* Called when the GSAP camera intro finishes */
  const handleIntroComplete = useCallback(() => {
    setIntroPlaying(false);
    setIntroComplete(true);
  }, []);

  return (
    <section className="w-full h-screen relative">
      {/* Welcome / Loading overlay — sits ABOVE the Canvas */}
      {!sceneReady && <WelcomeLoader onComplete={handleWelcomeComplete} />}

      {/* About Me Overlay */}
      {showAbout && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900/90 border border-cyan-500/30 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl shadow-cyan-500/10 text-white relative">
            <button
              onClick={handleCloseSection}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-4 text-cyan-400">About Me</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              Hi, I'm Sammy! I'm a passionate developer who loves building
              creative and immersive web experiences. I specialize in front-end
              development with React, Three.js, and modern web technologies.
            </p>
            <p className="text-gray-300 leading-relaxed">
              I enjoy transforming ideas into interactive 3D experiences and
              crafting beautiful user interfaces. Feel free to explore my
              portfolio and reach out if you'd like to collaborate!
            </p>
          </div>
        </div>
      )}

      {/* Skills Overlay */}
      {showSkills && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gray-900/90 border border-cyan-500/30 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl shadow-cyan-500/10 text-white relative">
            <button
              onClick={handleCloseSection}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-6 text-cyan-400">My Skills</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Frontend */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 border-b border-cyan-500/20 pb-2">
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "HTML", "CSS", "JavaScript", "Flutter"].map(
                    (s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                      >
                        {s}
                      </span>
                    ),
                  )}
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Responsive interfaces &amp; cross-platform mobile experiences.
                </p>
              </div>

              {/* Backend / Cloud */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 border-b border-cyan-500/20 pb-2">
                  Backend / Cloud
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "Firebase", "Supabase"].map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Scalable services, real-time data &amp; authentication.
                </p>
              </div>

              {/* Architecture & Concepts */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 border-b border-cyan-500/20 pb-2">
                  Architecture
                </h3>
                <ul className="space-y-1.5">
                  {[
                    "API-driven development",
                    "Clean client–server design",
                    "State management patterns",
                    "Secure auth flows",
                    "Responsive & adaptive UI",
                  ].map((c) => (
                    <li
                      key={c}
                      className="flex items-start gap-1.5 text-gray-300 text-xs leading-relaxed"
                    >
                      <span className="text-cyan-400 mt-0.5">▸</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Overlay */}
      {showProjects && (
        <div className="absolute inset-0 z-20 overflow-y-auto bg-black/70 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-6 py-12 relative">
            <button
              onClick={handleCloseSection}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors z-10"
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold mb-2 text-cyan-400">Projects</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-xl">
              A selection of work that reflects my passion for building
              meaningful, well-crafted digital experiences.
            </p>
            <div className="space-y-8">
              {projects.map((project, index) => (
                <article
                  key={index}
                  className="group bg-gray-900/80 border border-gray-700/40 hover:border-cyan-500/30 rounded-2xl p-6 transition-all duration-500 shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <span className="text-cyan-500/40 text-4xl font-black leading-none select-none">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 mt-4">
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
                        The Problem
                      </h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {project.problem}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
                        My Solution
                      </h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {project.solution}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
                        My Role
                      </h4>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {project.role}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-cyan-400/70">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700/40">
                    {project.links.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-bold tracking-wide shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
                      >
                        Live Demo ↗
                      </a>
                    )}
                    {project.links.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-gray-600 text-gray-300 text-[11px] font-bold tracking-wide hover:border-cyan-500/50 hover:text-cyan-300 transition-all duration-300"
                      >
                        Source Code ↗
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <Canvas
        className="w-full h-screen bg-black"
        camera={{
          near: 0.1,
          far: 1000,
          position: [2, 12, 10],
          fov: 35,
        }}
        gl={{ alpha: false }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={1.5} />
          <OrbitControls
            enableZoom
            enablePan
            enableRotate
            enabled={!zooming && !returning && !introPlaying && introComplete}
          />
          <CameraIntro
            playing={introPlaying}
            readyPromise={introPromiseRef.current}
            onComplete={handleIntroComplete}
          />
          <CameraController
            zooming={zooming}
            returning={returning}
            target={zoomTarget}
            onZoomComplete={handleZoomComplete}
            onReturnComplete={handleReturnComplete}
          />
          <ScifiRoom
            onPosterClick={handlePosterClick}
            onMonitorClick={handleMonitorClick}
            onKeyboardClick={() => {
              audio.playClickSound();
              setShowSkills(true);
            }}
            hideCard={
              showAbout ||
              showSkills ||
              showProjects ||
              zooming ||
              returning ||
              introPlaying ||
              !introComplete
            }
            position={[-0.7, 0, 0.5]}
            // scale={scifiRoomScale}
            // rotation={[0, Math.PI / 12, 0]}
          />
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Home;
