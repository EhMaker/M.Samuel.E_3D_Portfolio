/**
 * CameraController — GSAP-powered camera state manager.
 *
 * Handles forward zoom (to a mesh target) and return zoom
 * (back to the exact camera state before the section opened).
 *
 * Camera state is stored as THREE.Vector3 clones — never references.
 * Works with any number of entry points; no hardcoded return position.
 *
 * Props:
 *   zooming          – true to start forward zoom toward `target`
 *   returning        – true to animate back to the saved state
 *   target           – THREE.Vector3 destination for forward zoom
 *   onZoomComplete   – called when the forward zoom finishes
 *   onReturnComplete – called when the return zoom finishes
 *
 * Must be rendered INSIDE a <Canvas>.
 */

import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";

/* Duration for both forward and return animations (matched) */
const ANIM_DURATION = 1.4;

const CameraController = ({
  zooming,
  returning,
  target,
  onZoomComplete,
  onReturnComplete,
}) => {
  const { camera, controls } = useThree();

  /* ── Saved camera state (cloned, never references) ──────── */
  const savedPos = useRef(new THREE.Vector3());
  const savedTarget = useRef(new THREE.Vector3());
  const tlRef = useRef(null);

  /* ── Forward zoom to a mesh / hotspot target ────────────── */
  useEffect(() => {
    if (!zooming || !target) return;

    /* Kill any running animation first */
    if (tlRef.current) tlRef.current.kill();

    /* Save current camera state as CLONES */
    savedPos.current = camera.position.clone();
    if (controls) {
      savedTarget.current = controls.target.clone();
      controls.enabled = false;
    }

    /* Proxy object for GSAP to tween */
    const proxy = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      tx: controls ? controls.target.x : 0,
      ty: controls ? controls.target.y : 0,
      tz: controls ? controls.target.z : 0,
    };

    /* Look-at point sits slightly behind the mesh target
       so the camera "peers into" the object */
    const lookDest = {
      x: target.x,
      y: target.y - 0.2,
      z: target.z - 1,
    };

    const tl = gsap.timeline({
      onUpdate: () => {
        camera.position.set(proxy.px, proxy.py, proxy.pz);
        if (controls) {
          controls.target.set(proxy.tx, proxy.ty, proxy.tz);
          controls.update();
        } else {
          camera.lookAt(proxy.tx, proxy.ty, proxy.tz);
        }
      },
      onComplete: () => onZoomComplete?.(),
    });

    /* Camera position tween */
    tl.to(
      proxy,
      {
        px: target.x,
        py: target.y,
        pz: target.z,
        duration: ANIM_DURATION,
        ease: "power2.inOut",
      },
      0,
    );

    /* Look-at target tween */
    tl.to(
      proxy,
      {
        tx: lookDest.x,
        ty: lookDest.y,
        tz: lookDest.z,
        duration: ANIM_DURATION,
        ease: "power2.inOut",
      },
      0,
    );

    tlRef.current = tl;

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [zooming, target]);

  /* ── Return zoom to saved camera state ──────────────────── */
  useEffect(() => {
    if (!returning) return;

    /* Kill any running animation first */
    if (tlRef.current) tlRef.current.kill();

    if (controls) controls.enabled = false;

    /* Start from wherever the camera currently is */
    const proxy = {
      px: camera.position.x,
      py: camera.position.y,
      pz: camera.position.z,
      tx: controls ? controls.target.x : 0,
      ty: controls ? controls.target.y : 0,
      tz: controls ? controls.target.z : 0,
    };

    const tl = gsap.timeline({
      onUpdate: () => {
        camera.position.set(proxy.px, proxy.py, proxy.pz);
        if (controls) {
          controls.target.set(proxy.tx, proxy.ty, proxy.tz);
          controls.update();
        } else {
          camera.lookAt(proxy.tx, proxy.ty, proxy.tz);
        }
      },
      onComplete: () => {
        /* Snap to exact saved values — no drift */
        camera.position.copy(savedPos.current);
        if (controls) {
          controls.target.copy(savedTarget.current);
          controls.enabled = true;
          controls.update();
        }
        onReturnComplete?.();
      },
    });

    /* Position return tween */
    tl.to(
      proxy,
      {
        px: savedPos.current.x,
        py: savedPos.current.y,
        pz: savedPos.current.z,
        duration: ANIM_DURATION,
        ease: "power2.inOut",
      },
      0,
    );

    /* Target return tween */
    tl.to(
      proxy,
      {
        tx: savedTarget.current.x,
        ty: savedTarget.current.y,
        tz: savedTarget.current.z,
        duration: ANIM_DURATION,
        ease: "power2.inOut",
      },
      0,
    );

    tlRef.current = tl;

    return () => {
      if (tlRef.current) tlRef.current.kill();
    };
  }, [returning]);

  return null;
};

export default CameraController;
