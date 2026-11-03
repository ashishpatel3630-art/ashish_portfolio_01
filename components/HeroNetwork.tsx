"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const nodePositions: [number, number, number][] = [
  [-2.4, 1.2, 0],
  [-1.4, 2.1, -0.5],
  [-0.5, 1.15, 0.6],
  [0.55, 2, -0.25],
  [1.8, 1.1, 0.1],
  [2.4, -0.1, -0.5],
  [1.35, -1.1, 0.5],
  [0.2, -1.85, -0.2],
  [-1.1, -1.2, 0.4],
  [-2.35, -0.3, -0.2],
  [-0.35, 0.05, 0],
  [1.15, 0.15, -0.65],
  [-1.3, 0.25, 0.9],
];

const connections = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
  [8, 9], [9, 0], [1, 10], [2, 10], [3, 10], [6, 11], [10, 11],
  [8, 12], [9, 12], [10, 12], [0, 12], [4, 11], [7, 11],
] as const;

function NetworkStructure({ reducedMotion }: { reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const lineGeometry = useMemo(() => {
    const positions = new Float32Array(
      connections.flatMap(([from, to]) => [
        ...nodePositions[from],
        ...nodePositions[to],
      ]),
    );
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    return geometry;
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.055;
    groupRef.current.rotation.x = THREE.MathUtils.damp(
      groupRef.current.rotation.x,
      state.pointer.y * 0.12,
      2,
      delta,
    );
    groupRef.current.rotation.z = THREE.MathUtils.damp(
      groupRef.current.rotation.z,
      -state.pointer.x * 0.08,
      2,
      delta,
    );
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#6b9dff"
          transparent
          opacity={0.42}
          depthWrite={false}
        />
      </lineSegments>

      {nodePositions.map((position, index) => (
        <mesh key={index} position={position} scale={index === 10 ? 0.16 : 0.07}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={index === 10 ? "#65e5f2" : index % 3 === 0 ? "#6b9dff" : "#f5f5f2"}
            transparent
            opacity={index === 10 ? 1 : 0.82}
          />
        </mesh>
      ))}

      <mesh>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial
          color="#6b9dff"
          wireframe
          transparent
          opacity={0.13}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2.8, 0.2, 0.15]}>
        <torusGeometry args={[1.05, 0.006, 8, 100]} />
        <meshBasicMaterial color="#65e5f2" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function HeroNetwork({
  reducedMotion,
}: {
  reducedMotion: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <Canvas
        camera={{ position: [0, 0, 7.5], fov: 42 }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <NetworkStructure reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}
