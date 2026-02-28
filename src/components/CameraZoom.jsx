import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const CameraZoom = ({ zooming, target, onZoomComplete }) => {
  const { camera } = useThree();
  const progress = useRef(0);
  const startPos = useRef(null);
  const startLookAt = useRef(null);

  useFrame((_, delta) => {
    if (!zooming || !target) {
      progress.current = 0;
      startPos.current = null;
      return;
    }

    if (!startPos.current) {
      startPos.current = camera.position.clone();
      startLookAt.current = new THREE.Vector3(0, 0, 0);
    }

    progress.current += delta * 0.6; // speed of zoom
    const t = Math.min(progress.current, 1);
    // Smooth easing (ease-in-out)
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    camera.position.lerpVectors(startPos.current, target, ease);
    camera.lookAt(
      THREE.MathUtils.lerp(startLookAt.current.x, target.x, ease),
      THREE.MathUtils.lerp(startLookAt.current.y, target.y - 0.2, ease),
      THREE.MathUtils.lerp(startLookAt.current.z, target.z - 1, ease),
    );

    if (t >= 1 && onZoomComplete) {
      onZoomComplete();
    }
  });

  return null;
};

export default CameraZoom;
