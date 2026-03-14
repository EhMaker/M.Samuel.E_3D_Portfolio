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
import * as THREE from "three";
import scifiComputerRoom from "../assets/public/sci-fi_computer_room.glb";

/* Eagerly preload the GLB so it downloads while the WelcomeLoader plays */
useGLTF.preload(scifiComputerRoom);

const projects = [
  {
    name: "AFROCRIB Restaurant Ordering & Management Platform",
    description:
      "AFROCRIB is a modern restaurant web application designed to deliver a smooth digital food-ordering experience. It combines a visually engaging storefront with customer authentication, cart and checkout flows, a user dashboard, and an admin panel for managing menu items, features, and blog content.",
    problem:
      "Many food businesses struggle with presenting their menu professionally online, managing customer access, and updating content quickly without depending on complex systems. The need was to create a simple but polished platform that could showcase meals, support customer interaction, and make basic content management easier.",
    solution:
      "This project solves that by providing a responsive multi-page restaurant website with a complete customer journey; from discovering meals to adding items to cart and checking out. It also includes secure authentication, a protected user dashboard, and an admin interface that allows menu and content updates in a practical, lightweight way.",
    technologies: [
      "HTML5",
      "CSS3",
      "Vanilla JavaScript",
      "Supabase Authentication",
      "Supabase SQL setup",
      "LocalStorage",
      "Font Awesome",
      "Responsive Web Design",
    ],
    role: "Full-Stack Developer. Handled all aspects of design, frontend development, backend setup, and deployment.",
    links: {
      demo: "https://ehmaker.github.io/AfroCrib-Restaurant/index.html",
      repo: "https://github.com/EhMaker/AfroCrib-Restaurant",
    },
    screenshots: [
      "/screenshots/afrocrib/HeroSection.png",
      "/screenshots/afrocrib/featureSection.png",
      "/screenshots/afrocrib/MenuSection.png",
      "/screenshots/afrocrib/CartPage.png",
      "/screenshots/afrocrib/DeliverySection.png",
      "/screenshots/afrocrib/AdminDashboard.png",
      "/screenshots/afrocrib/CustomerDashboard.png",
      "/screenshots/afrocrib/FooterSection.png",
    ],
  },
  {
    name: "Class Manager Mobile App",
    description:
      "A role-based mobile classroom management app built to improve how lecturers and students interact in an academic environment. The app provides a structured digital space for classroom coordination, with separate experiences for lecturers and students, and a foundation for features like authentication, learning materials, live session updates, and attendance reporting.",
    problem:
      "Classroom communication and coordination are often spread across multiple channels, making it difficult for lecturers to manage sessions efficiently and for students to stay updated with materials, attendance, and live class activity. This creates delays, confusion, and unnecessary administrative stress.",
    solution:
      "Class Manager brings key classroom activities into one mobile platform. It is designed to give lecturers a central place to manage academic interactions, while giving students quick access to important learning information through a simple and organized interface. The app uses a scalable backend structure to support secure access, role-based navigation, and future classroom automation features.",
    technologies: [
      "Flutter",
      "Dart",
      "Firebase Core",
      "Firebase Authentication",
      "Cloud Firestore",
      "Provider",
      "Local Auth",
      "Connectivity Plus",
      "WiFi IoT",
      "Android Intent Plus",
    ],
    role: "Designed and developed the application as an end-to-end mobile project. This included planning the app structure, building the Flutter interface, setting up Firebase integration, and creating the foundation for role-based user flows for both lecturers and students.",
    links: { demo: "#", repo: "https://github.com/sammy/3d-portfolio" },
    screenshots: [
      "/screenshots/classmanager/WelcomePage.png",
      "/screenshots/classmanager/Loginpage.png",
      "/screenshots/classmanager/SignupPage.png",
      "/screenshots/classmanager/StudentDashboard.png",
      "/screenshots/classmanager/LecturerDashboard.png",
      "/screenshots/classmanager/Join_course_page.png",
      "/screenshots/classmanager/Course_Detail_Page.png",
      "/screenshots/classmanager/Student_detecting_Session.png",
      "/screenshots/classmanager/Attendance_Session.png",
    ],
  },
  {
    name: "MovieTray",
    description:
      "A modern movie discovery web application that helps users search, filter, and explore films in a clean, responsive interface. It also supports trailer viewing and a favorites feature, making it easier for users to discover and revisit movies they care about.",
    problem:
      "Finding movies online can be overwhelming when users are presented with too much information and too little personalization. Many platforms make it difficult to quickly narrow results, preview content, and keep track of interesting titles.This project was built to solve that by creating a simpler and more focused movie browsing experience with search, filtering, trailer access, and favorites management.",
    solution:
      "CineScope provides a user-friendly interface for movie exploration by combining: Search and filtering for faster movie discovery, Movie cards for clean content presentation, Trailer viewing for quick previews, Favorites functionality for saving preferred movies, API-driven movie data. The result is a responsive and visually engaging application that improves the movie discovery process while keeping the experience intuitive and enjoyable.",
    technologies: [
      "React",
      "Vite",
      "JavaScript(JSX)",
      "Context API",
      "CSS3",
      "API Integration",
      "ESLint",
    ],
    role: "Solo Developer — handled full design, development, deployment, and user testing.",
    links: {
      demo: "https://ehmaker.github.io/movie-searchengine/#/",
      repo: "https://github.com/EhMaker/movie-searchengine",
    },
    screenshots: [
      "/screenshots/Movietray/HomePage.png",
      "/screenshots/Movietray/FavoritesPage.png",
      "/screenshots/Movietray/Screenshot_1.png",
    ],
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
  const interactionLockRef = React.useRef(false);

  const monitorTarget = React.useMemo(
    () => new THREE.Vector3(-1.3, 0.35, 1.9),
    [],
  );
  const posterTarget = React.useMemo(
    () => new THREE.Vector3(-1.4, 0.7, 1.2),
    [],
  );
  const keyboardTarget = React.useMemo(
    () => new THREE.Vector3(-1.12, 0.2, 1.82),
    [],
  );

  const beginZoomToSection = useCallback(
    (target, action) => {
      if (
        interactionLockRef.current ||
        zooming ||
        returning ||
        introPlaying ||
        !introComplete ||
        showAbout ||
        showSkills ||
        showProjects ||
        showContact
      ) {
        return;
      }
      interactionLockRef.current = true;
      setZoomTarget(target);
      setZoomAction(action);
      setZooming(true);
    },
    [
      zooming,
      returning,
      introPlaying,
      introComplete,
      showAbout,
      showSkills,
      showProjects,
      showContact,
    ],
  );

  const handleMonitorClick = useCallback(() => {
    audio.playClickSound();
    beginZoomToSection(monitorTarget, "projects");
  }, [beginZoomToSection, monitorTarget]);

  const handlePosterClick = useCallback(() => {
    audio.playClickSound();
    beginZoomToSection(posterTarget, "about");
  }, [beginZoomToSection, posterTarget]);

  const handleKeyboardClick = useCallback(() => {
    audio.playClickSound();
    beginZoomToSection(keyboardTarget, "skills");
  }, [beginZoomToSection, keyboardTarget]);

  const handleZoomComplete = useCallback(() => {
    setZooming(false);
    zoomedInRef.current = true;
    interactionLockRef.current = false;
    if (zoomAction === "projects") {
      setShowProjects(true);
    } else if (zoomAction === "about") {
      setShowAbout(true);
    } else if (zoomAction === "skills") {
      setShowSkills(true);
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
      interactionLockRef.current = true;
      setReturning(true);
      zoomedInRef.current = false;
    } else {
      interactionLockRef.current = false;
    }
  }, []);

  /* Called when the camera finishes animating back to the saved state */
  const handleReturnComplete = useCallback(() => {
    setReturning(false);
    interactionLockRef.current = false;
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

  const overlayAnimStyles = `
@keyframes skillsOverlayFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes skillsCardSlideUp {
  0% { opacity: 0; transform: translateY(18px) scale(0.98); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
`;

  return (
    <section className="w-full h-screen relative">
      <style>{overlayAnimStyles}</style>

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
          style={{ animation: "skillsOverlayFadeIn 0.35s ease-out both" }}
          role="dialog"
          aria-modal="true"
          aria-label="My skills"
        >
          <div
            className="relative w-full max-w-2xl mx-4"
            style={{
              animation:
                "skillsCardSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
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
                    {[
                      "React",
                      "HTML",
                      "CSS",
                      "Tailwind CSS",
                      "Three.js",
                      "JavaScript",
                      "Flutter",
                    ].map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 tracking-wide"
                      >
                        {s}
                      </span>
                    ))}
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
                    {["Python", "Firebase", "Supabase", "Node.js"].map((s) => (
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
            onKeyboardClick={handleKeyboardClick}
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
