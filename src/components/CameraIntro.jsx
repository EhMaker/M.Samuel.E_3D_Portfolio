/**
 * CameraIntro — cinematic GSAP-powered camera fly-in.
 *
 * Starts the camera high above and behind the scene (bird's-eye),
 * then sweeps it down in a curved arc to the default viewing position.
 * OrbitControls are locked during the animation and re-enabled after.
 *
 * Props:
 *   playing    – boolean, true to start the animation
 *   onComplete – callback fired when the intro finishes
 *
 * Must be rendered INSIDE a <Canvas>.
 */

import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";

/* ── target values (must match the Canvas defaults) ────────── */
const FINAL_POS = { x: -4, y: 0.2, z: 3.0 };
const FINAL_TARGET = { x: -0.7, y: 0.0, z: 0.5 };

/* ── starting values (camera is CREATED here via Canvas props) */
const START_POS = { x: 2, y: 12, z: 10 };
const START_TARGET = { x: 0, y: 0, z: 0 };

const CameraIntro = ({ playing, readyPromise, onComplete }) => {
  const { camera, controls } = useThree();
  const tlRef = useRef(null);
  const cancelledRef = useRef(false);
  const initializedRef = useRef(false);

  /* Ensure camera + controls target are synced to the start position
     on the very first render frame (before any visible output).
     This runs inside the render loop so there is zero flash. */
  useFrame(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    camera.position.set(START_POS.x, START_POS.y, START_POS.z);
    camera.lookAt(START_TARGET.x, START_TARGET.y, START_TARGET.z);

    if (controls) {
      controls.target.set(START_TARGET.x, START_TARGET.y, START_TARGET.z);
      controls.enabled = false;
      controls.update();
    }
  });

  useEffect(() => {
    if (!playing) return;

    /* ── Responsive pull-back: same viewing angle, more distance on mobile ── */
    const isMobile = window.innerWidth < 768;
    const pullBack = isMobile ? 2.2 : 1.8;
    const finalPos = {
      x: FINAL_TARGET.x + (FINAL_POS.x - FINAL_TARGET.x) * pullBack,
      y: FINAL_TARGET.y + (FINAL_POS.y - FINAL_TARGET.y) * pullBack,
      z: FINAL_TARGET.z + (FINAL_POS.z - FINAL_TARGET.z) * pullBack,
    };

    cancelledRef.current = false;
    const ctrl = controls;

    /* Lock controls while the intro plays */
    if (ctrl) {
      ctrl.enabled = false;
    }

    /* ── Wait for the ready promise before starting GSAP ── */
    const startAnimation = () => {
      if (cancelledRef.current) return;

      const proxy = {
        cx: START_POS.x,
        cy: START_POS.y,
        cz: START_POS.z,
        tx: START_TARGET.x,
        ty: START_TARGET.y,
        tz: START_TARGET.z,
        arc: 0,
      };

      const tl = gsap.timeline({
        onUpdate: () => {
          const arcOffset = Math.sin(proxy.arc * Math.PI) * 3;
          camera.position.set(
            proxy.cx + arcOffset * 0.6,
            proxy.cy,
            proxy.cz + arcOffset * 0.4,
          );
          if (ctrl) {
            ctrl.target.set(proxy.tx, proxy.ty, proxy.tz);
            ctrl.update();
          } else {
            camera.lookAt(proxy.tx, proxy.ty, proxy.tz);
          }
        },
        onComplete: () => {
          camera.position.set(finalPos.x, finalPos.y, finalPos.z);
          if (ctrl) {
            ctrl.target.set(FINAL_TARGET.x, FINAL_TARGET.y, FINAL_TARGET.z);
            ctrl.enabled = true;
            ctrl.update();
          }
          onComplete?.();
        },
      });

      tl.to(
        proxy,
        {
          cx: finalPos.x,
          cy: finalPos.y,
          cz: finalPos.z,
          arc: 1,
          duration: 2.8,
          ease: "power2.inOut",
        },
        0,
      );

      tl.to(
        proxy,
        {
          tx: FINAL_TARGET.x,
          ty: FINAL_TARGET.y,
          tz: FINAL_TARGET.z,
          duration: 2.2,
          ease: "power3.out",
        },
        0.3,
      );

      tlRef.current = tl;
    };

    /* Await the readyPromise (if provided) so the GSAP animation
       only fires after the welcome screen has fully resolved. */
    if (readyPromise && typeof readyPromise.then === "function") {
      readyPromise.then(startAnimation);
    } else {
      // Fallback: no promise — start immediately
      startAnimation();
    }

    return () => {
      cancelledRef.current = true;
      if (tlRef.current) tlRef.current.kill(); // cleanup if unmounted mid-animation
    };
  }, [playing, camera, controls, onComplete]);

  return null; // purely imperative — no rendered output
};

export default CameraIntro;
