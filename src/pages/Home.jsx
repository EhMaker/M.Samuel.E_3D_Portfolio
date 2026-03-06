import React, { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CameraController from "../components/CameraController";
import CameraIntro from "../components/CameraIntro";
import ContactSection from "../components/ContactSection";
import ProjectsSection from "../components/ProjectsSection";
import ScifiRoom from "../models/ScifiRoom";
import WelcomeLoader from "../components/WelcomeLoader";
import audio from "../utils/audioManager";
import sammyPhoto from "../assets/Sammy1.jpg";
import * as THREE from "three";
import scifiComputerRoom from "../assets/public/sci-fi_computer_room.glb";

/* Eagerly preload the GLB so it downloads while the WelcomeLoader plays */
useGLTF.preload(scifiComputerRoom);

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
  const [showContact, setShowContact] = useState(false);
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
    setShowContact(false);
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
        <section
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="About me"
        >
          <div className="relative w-full max-w-md mx-4">
            {/* Close button */}
            <button
              onClick={handleCloseSection}
              aria-label="Close about section"
              className="absolute -top-2 -right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/80 border border-gray-600/40 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-lg font-bold"
            >
              &times;
            </button>

            {/* Card */}
            <div className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
              {/* Header */}
              <header className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-white tracking-wide mb-1">
                  About Me
                </h2>
                <p className="text-gray-400 text-xs tracking-wide">
                  Developer &amp; creative technologist
                </p>
                {/* Decorative line */}
                <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              </header>

              {/* Bio */}
              <div className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed tracking-wide">
                  I’m a resourceful developer who enjoys building real-world
                  systems that solve practical problems, especially in education
                  and productivity. My work focuses on clean architecture,
                  secure authentication, and scalable solutions.
                </p>
                <p className="text-gray-300 text-sm leading-relaxed tracking-wide">
                  I turn ideas into interactive web and mobile applications
                  while crafting intuitive and visually appealing user
                  interfaces. Feel free to explore my portfolio, and don’t
                  hesitate to reach out if you'd like to collaborate.
                </p>
              </div>

              {/* Footer tagline */}
              <p className="text-center text-gray-500 text-[10px] mt-6 tracking-wider uppercase">
                Crafting the future, one pixel at a time
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Skills Overlay */}
      {showSkills && (
        <section
          className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label="My skills"
        >
          <div className="relative w-full max-w-2xl mx-4">
            {/* Close button */}
            <button
              onClick={handleCloseSection}
              aria-label="Close skills section"
              className="absolute -top-2 -right-2 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-gray-800/80 border border-gray-600/40 text-gray-400 hover:text-white hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 text-lg font-bold"
            >
              &times;
            </button>

            {/* Card */}
            <div className="bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-950/95 border border-cyan-500/20 rounded-2xl p-8 shadow-2xl shadow-cyan-500/5">
              {/* Header */}
              <header className="text-center mb-8">
                <h2 className="text-2xl font-extrabold text-white tracking-wide mb-1">
                  My Skills
                </h2>
                <p className="text-gray-400 text-xs tracking-wide">
                  Technologies &amp; concepts I work with
                </p>
                {/* Decorative line */}
                <div className="mt-4 mx-auto w-16 h-0.5 rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              </header>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Frontend */}
                <div
                  className="group relative flex flex-col items-center gap-3 p-5 rounded-xl
                    bg-gray-800/40 border border-gray-700/40 hover:border-cyan-400/60
                    transition-all duration-300 ease-out
                    hover:bg-gray-800/70 hover:shadow-xl hover:shadow-cyan-500/15
                    hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 border-b border-cyan-500/20 pb-2 w-full text-center">
                    Frontend
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {["React", "HTML", "CSS", "JavaScript", "Flutter"].map(
                      (s) => (
                        <span
                          key={s}
                          className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wide"
                        >
                          {s}
                        </span>
                      ),
                    )}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed tracking-wide text-center">
                    Responsive interfaces &amp; cross-platform mobile
                    experiences.
                  </p>
                </div>

                {/* Backend / Cloud */}
                <div
                  className="group relative flex flex-col items-center gap-3 p-5 rounded-xl
                    bg-gray-800/40 border border-gray-700/40 hover:border-blue-400/60
                    transition-all duration-300 ease-out
                    hover:bg-gray-800/70 hover:shadow-xl hover:shadow-blue-500/15
                    hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 border-b border-cyan-500/20 pb-2 w-full text-center">
                    Backend / Cloud
                  </h3>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {["Python", "Firebase", "Supabase"].map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 tracking-wide"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed tracking-wide text-center">
                    Scalable services, real-time data &amp; authentication.
                  </p>
                </div>

                {/* Architecture & Concepts */}
                <div
                  className="group relative flex flex-col items-center gap-3 p-5 rounded-xl
                    bg-gray-800/40 border border-gray-700/40 hover:border-emerald-400/60
                    transition-all duration-300 ease-out
                    hover:bg-gray-800/70 hover:shadow-xl hover:shadow-emerald-500/15
                    hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-transparent" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400/70 border-b border-cyan-500/20 pb-2 w-full text-center">
                    Architecture
                  </h3>
                  <ul className="space-y-1.5 w-full">
                    {[
                      "API-driven development",
                      "Clean client–server design",
                      "State management patterns",
                      "Secure auth flows",
                      "Responsive & adaptive UI",
                    ].map((c) => (
                      <li
                        key={c}
                        className="flex items-start gap-1.5 text-gray-300 text-xs leading-relaxed tracking-wide"
                      >
                        <span className="text-cyan-400 mt-0.5">▸</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Footer tagline */}
              <p className="text-center text-gray-500 text-[10px] mt-6 tracking-wider uppercase">
                Always learning, always building
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Projects Overlay */}
      {showProjects && (
        <ProjectsSection projects={projects} onClose={handleCloseSection} />
      )}

      {/* Contact & Credibility Overlay */}
      {showContact && (
        <ContactSection
          onClose={() => {
            audio.playClickSound();
            setShowContact(false);
          }}
        />
      )}

      <Canvas
        className="w-full h-screen bg-black"
        camera={{
          near: 0.1,
          far: 1000,
          position: [2, 12, 10],
          fov: 35,
        }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        gl={{
          alpha: false,
          powerPreference: "high-performance",
          antialias: false,
        }}
      >
        <Suspense fallback={null}>
          {/* ── Key light — warm top-down theatre spotlight ── */}
          <directionalLight position={[1, 1, 1]} intensity={1.5} />
          <pointLight
            position={[-0.7, 3, 1]}
            intensity={8}
            distance={10}
            decay={2}
            color="#ffeedd"
          />

          {/* ── Cool cyan front fill — face & desk illumination ── */}
          <pointLight
            position={[0.5, 1.2, 3]}
            intensity={4}
            distance={8}
            decay={2}
            color="#66ccff"
          />

          {/* ── Deep blue rim light — back-left edge separation ── */}
          <pointLight
            position={[-3, 2, -1]}
            intensity={6}
            distance={10}
            decay={2}
            color="#3344ff"
          />

          {/* ── Warm amber kicker — back-right for depth ── */}
          <pointLight
            position={[2, 1.5, -1.5]}
            intensity={5}
            distance={9}
            decay={2}
            color="#ff9944"
          />

          {/* ── Soft magenta under-glow — theatre stage feel ── */}
          <pointLight
            position={[-0.7, -0.3, 1.5]}
            intensity={3}
            distance={6}
            decay={2}
            color="#cc44aa"
          />

          {/* ── Subtle cyan top accent — overhead wash ── */}
          <pointLight
            position={[0, 4, 0]}
            intensity={5}
            distance={12}
            decay={2}
            color="#44eeff"
          />

          {/* ── Dim warm ambient to lift shadows slightly ── */}
          <ambientLight intensity={0.7} color="#ffd6aa" />

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
            onContactClick={() => {
              setShowContact(true);
            }}
            hideCard={
              showAbout ||
              showSkills ||
              showProjects ||
              showContact ||
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
