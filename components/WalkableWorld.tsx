"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRapier,
} from "@react-three/rapier";
import { Image as DreiImage, Text } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { RapierRigidBody } from "@react-three/rapier";
import type { ThreeEvent } from "@react-three/fiber";
import { projects } from "@/data/projects";
import { skillGroups } from "@/data/skills";

const ROOM_SPACING = 18;
const ROOM_NAMES = ["ENTRANCE PLAZA", "IDENTITY GALLERY", "PROJECT MUSEUM", "AI LABORATORY", "EXPERIENCE CENTER", "RESUME CENTER", "CONTACT CENTER"];
const INTERACTION_DATA = [
  ...projects.map((project, index) => ({
    id: `project-${index}`,
    title: project.name,
    description: project.description,
    detail: `PROJECT · ${project.category}\nSTATUS · ${project.status}\nSTACK · ${project.stack.join(" · ")}`,
    href: project.github || project.live,
    hrefLabel: project.github ? "OPEN REPOSITORY" : project.live ? "OPEN PROJECT" : "",
    room: 2,
    offset: index,
  })),
  {
    id: "entrance-door",
    title: "ENTRANCE GATE",
    description: "A pair of physical sliding doors mark the entrance to the connected portfolio world. Interact with the center panel to open or close the gate.",
    detail: "MAIN ENTRANCE · SLIDING GLASS AND TITANIUM ASSEMBLY",
    href: "",
    hrefLabel: "",
    room: 0,
    offset: 0,
  },
  {
    id: "profile",
    image: "/portfolio-assets/portrait.jpeg",
    title: "PROFILE",
    description: "Ashish Mewada is an AI engineer focused on applied machine learning and product-minded software.",
    detail: "ELIX STUDIO · ML ENGINEER · CURRENT\nPATREX · ONE-MONTH INTERNSHIP\nB.TECH COMPUTER SCIENCE · EXPECTED 2028\nBHOPAL, INDIA",
    href: "",
    hrefLabel: "",
    room: 1,
    offset: 0,
  },
  {
    id: "ai-lab",
    title: "AI SYSTEMS LAB",
    description: "A physical map of the systems I build: language models connected to retrieval, graphs, and tools.",
    detail: "LLM → RETRIEVAL → LANGGRAPH → MCP TOOLS\nPython · PyTorch · RAG · LangGraph · MCP",
    href: "",
    hrefLabel: "",
    room: 3,
    offset: 0,
  },
  {
    id: "ai-llm",
    title: "LLM INFERENCE",
    description: "A conceptual view of language-model inference: prompts become tokens, context is assembled, and output is generated one token at a time.",
    detail: "PROMPT → TOKENS → CONTEXT WINDOW → INFERENCE → RESPONSE",
    href: "",
    hrefLabel: "",
    room: 3,
    offset: 1,
  },
  {
    id: "ai-rag",
    title: "RETRIEVAL PIPELINE",
    description: "A retrieval-augmented generation flow, from document preparation and embeddings through vector search, context assembly, and a grounded response.",
    detail: "INGEST → CHUNK → EMBED → RETRIEVE → GROUND → GENERATE",
    href: "",
    hrefLabel: "",
    room: 3,
    offset: 2,
  },
  {
    id: "ai-mcp",
    title: "MCP TOOL INFRASTRUCTURE",
    description: "A conceptual client and server layout showing how an AI application can discover and call tools through a structured protocol.",
    detail: "AI CLIENT → MCP CLIENT → MCP SERVER → TOOLS / RESOURCES",
    href: "",
    hrefLabel: "",
    room: 3,
    offset: 3,
  },
  {
    id: "ai-langgraph",
    title: "LANGGRAPH WORKFLOW",
    description: "A stateful agent workflow with explicit nodes, conditional transitions, human review, and a clear completion path.",
    detail: "START → PLAN → ACT → REVIEW → COMPLETE",
    href: "",
    hrefLabel: "",
    room: 3,
    offset: 4,
  },
  {
    id: "ai-ml",
    title: "MACHINE LEARNING",
    description: "A simplified model view that connects input data, learned representations, and a prediction output.",
    detail: "DATA → FEATURES → MODEL → PREDICTION",
    href: "",
    hrefLabel: "",
    room: 3,
    offset: 5,
  },
  {
    id: "experience-elix",
    title: "ELIX STUDIO",
    description: "Current Machine Learning Engineer role at Elix Studio. Detailed technical contributions were not included in the supplied portfolio information.",
    detail: "CURRENT POSITION · MACHINE LEARNING ENGINEER",
    href: "",
    hrefLabel: "",
    room: 4,
    offset: 0,
  },
  {
    id: "experience-patrex",
    title: "PATREX",
    description: "One-month internship experience at Patrex. Further role details were not included in the supplied portfolio information.",
    detail: "INTERNSHIP · ONE MONTH",
    href: "",
    hrefLabel: "",
    room: 4,
    offset: 1,
  },
  {
    id: "education",
    title: "ORIENTAL COLLEGE OF TECHNOLOGY",
    description: "Undergraduate studies in Computer Science and Engineering at Oriental College of Technology.",
    detail: "B.TECH · COMPUTER SCIENCE AND ENGINEERING\nEXPECTED GRADUATION · 2028",
    href: "",
    hrefLabel: "",
    room: 4,
    offset: 2,
  },
  {
    id: "resume",
    title: "RESUME TERMINAL",
    description: "View, download, or print the current portfolio resume.",
    detail: "RESUME · PDF · /resume.pdf",
    href: "/resume.pdf",
    hrefLabel: "OPEN PDF",
    room: 5,
    offset: 0,
  },
  {
    id: "contact",
    title: "CONTACT TERMINAL",
    description: "Send a message or connect using email, LinkedIn, or GitHub.",
    detail: "EMAIL · LINKEDIN · GITHUB",
    href: "",
    hrefLabel: "",
    room: 6,
    offset: 0,
  },
];

type JoystickInput = { x: number; z: number };

type WalkableWorldProps = {
  started: boolean;
  paused: boolean;
  reducedMotion: boolean;
  joystick: JoystickInput;
  sprintEnabled: boolean;
  destination: number | null;
  resetToken: number;
  jumpToken: number;
  interactToken: number;
  gateOpen: boolean;
  pixelRatio: number;
  onGateApproach: () => void;
  onRoomChange: (room: number) => void;
  onInteraction: (id: string) => void;
  onLookTarget: (title: string | null) => void;
  onPointerLockChange: (locked: boolean) => void;
};

function WorldArchitecture() {
  const rooms = useMemo(
    () => ROOM_NAMES.map((_, index) => -index * ROOM_SPACING),
    [],
  );
  const frames = useMemo(
    () => Array.from({ length: 35 }, (_, index) => 7 - index * 3.7),
    [],
  );

  return (
    <group>
      <mesh position={[0, -0.36, -54]} receiveShadow>
        <boxGeometry args={[18, 0.72, 130]} />
        <meshPhysicalMaterial color="#272b30" metalness={0.42} roughness={0.28} clearcoat={0.42} clearcoatRoughness={0.32} />
      </mesh>
      <CuboidCollider position={[0, -0.36, -54]} args={[9, 0.36, 65]} />
      {[-9, 9].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.55, -54]} receiveShadow castShadow>
            <boxGeometry args={[0.6, 5.9, 130]} />
            <meshPhysicalMaterial color="#25282c" metalness={0.3} roughness={0.72} />
          </mesh>
          <CuboidCollider position={[x, 2.55, -54]} args={[0.3, 2.95, 65]} />
          <mesh position={[x > 0 ? 8.62 : -8.62, 2.1, -54]}>
            <boxGeometry args={[0.06, 0.05, 130]} />
            <meshBasicMaterial color="#8796a5" />
          </mesh>
        </group>
      ))}
      {[11, -119].map((z) => (
        <group key={z}>
          <mesh position={[0, 2.55, z]} castShadow receiveShadow>
            <boxGeometry args={[18, 5.9, 0.6]} />
            <meshPhysicalMaterial color="#25282c" metalness={0.3} roughness={0.72} />
          </mesh>
          <CuboidCollider position={[0, 2.55, z]} args={[9, 2.95, 0.3]} />
        </group>
      ))}
      {frames.map((z) => (
        <group key={z}>
          <mesh position={[0, 5.05, z]} castShadow receiveShadow>
            <boxGeometry args={[18, 0.38, 0.45]} />
            <meshPhysicalMaterial color="#454a50" metalness={0.75} roughness={0.28} />
          </mesh>
          <mesh position={[0, 4.86, z]} rotation={[Math.PI / 2, 0, 0]}>
            <boxGeometry args={[16.8, 0.025, 0.03]} />
            <meshBasicMaterial color="#c6d0da" />
          </mesh>
          {[-8.5, 8.5].map((x) => (
            <mesh key={x} position={[x, 4.9, z]} castShadow>
              <boxGeometry args={[0.72, 0.4, 0.72]} />
              <meshPhysicalMaterial color="#737980" metalness={0.82} roughness={0.24} />
            </mesh>
          ))}
        </group>
      ))}
      {rooms.map((z, index) => (
        <group key={z}>
          {[-5.6, 5.6].map((x) => (
            <group key={x}>
              <mesh position={[x, 2.35, z - 9]} castShadow receiveShadow>
                <boxGeometry args={[6.8, 4.7, 0.4]} />
                <meshPhysicalMaterial color={index % 2 ? "#373a3d" : "#44474a"} metalness={0.36} roughness={0.68} />
              </mesh>
              <CuboidCollider position={[x, 2.35, z - 9]} args={[3.4, 2.35, 0.2]} />
            </group>
          ))}
          <mesh position={[0, 4.9, z - 9]} castShadow receiveShadow>
            <boxGeometry args={[4.8, 0.36, 0.52]} />
            <meshPhysicalMaterial color="#777d80" metalness={0.82} roughness={0.25} />
          </mesh>
          <CuboidCollider position={[0, 4.9, z - 9]} args={[2.4, 0.18, 0.26]} />
          {[-2.4, 2.4].map((x) => (
            <mesh key={x} position={[x, 2.35, z - 9]}>
              <boxGeometry args={[0.16, 4.7, 0.48]} />
              <meshPhysicalMaterial color="#8a9295" metalness={0.82} roughness={0.24} />
            </mesh>
          ))}
          {[-7.5, 7.5].map((x) => (
            <group key={x}>
              <mesh position={[x, 1.4, z - 9]} castShadow receiveShadow>
                <boxGeometry args={[1, 2.8, 0.7]} />
                <meshPhysicalMaterial color="#656a70" metalness={0.66} roughness={0.3} />
              </mesh>
              <CuboidCollider position={[x, 1.4, z - 9]} args={[0.5, 1.4, 0.35]} />
            </group>
          ))}
          <Text
            position={[0, 3.76, z - 8.67]}
            fontSize={0.19}
            color="#c4d0dc"
            letterSpacing={0.18}
            anchorX="center"
          >
            {`0${index + 1}  /  ${ROOM_NAMES[index]}`}
          </Text>
          <mesh position={[0, 0.015, z - 8.65]}>
            <boxGeometry args={[3.2, 0.03, 0.07]} />
          <meshBasicMaterial color="#9cb3c2" />
          </mesh>
        <pointLight position={[0, 4.2, z]} color={["#f0dfbf", "#e8e5df", "#e0e3e5", "#cfdfed", "#ece0c9", "#f0dcba", "#d9e3e6"][index]} intensity={2.2} distance={15} />
        <pointLight position={[-7.2, 2.9, z - 3]} color="#a9b6c0" intensity={0.58} distance={10} />
        <pointLight position={[7.2, 2.9, z - 3]} color="#cbbfa8" intensity={0.48} distance={10} />
        </group>
      ))}
      {rooms.slice(0, -1).map((z) => (
        <mesh key={z} position={[0, 0.012, z - 9]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.1, 2.2, 48]} />
          <meshBasicMaterial color="#b3c1cd" transparent opacity={0.3} />
        </mesh>
      ))}
      <mesh position={[0, 5.35, -54]} receiveShadow>
        <boxGeometry args={[18, 0.35, 130]} />
        <meshPhysicalMaterial color="#1b1e22" metalness={0.42} roughness={0.54} />
      </mesh>
      <CuboidCollider position={[0, 5.35, -54]} args={[9, 0.175, 65]} />
      {Array.from({ length: 16 }, (_, index) => {
        const x = -7.5 + index;
        return (
          <mesh key={x} position={[x, 5.05, -54]}>
            <boxGeometry args={[0.025, 0.025, 128]} />
            <meshBasicMaterial color="#777e83" transparent opacity={0.22} />
          </mesh>
        );
      })}
    </group>
  );
}

function InteractiveDisplay({
  id,
  title,
  subtitle,
  image,
  position,
  rotation = [0, 0, 0],
  onInteraction,
}: {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  onInteraction: (id: string) => void;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (ref.current) ref.current.userData.interactionId = id;
  }, [id]);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onInteraction(id);
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 1.82, 0.2]} />
        <meshStandardMaterial color="#17212c" metalness={0.75} roughness={0.25} />
      </mesh>
      <CuboidCollider position={[0, 0, -0.08]} args={[1.6, 0.91, 0.1]} />
      {image ? (
        <DreiImage
          ref={ref}
          url={image}
          scale={[2.98, 1.6]}
          position={[0, 0, 0.025]}
          toneMapped={false}
          onClick={handleClick}
          onPointerOver={() => { document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = "auto"; }}
        />
      ) : (
        <>
          <mesh
            ref={ref}
            onClick={handleClick}
            onPointerOver={() => { document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { document.body.style.cursor = "auto"; }}
          >
            <planeGeometry args={[2.98, 1.6]} />
            <meshBasicMaterial color="#0a111a" />
          </mesh>
          <mesh position={[0, 0.72, 0.012]}>
            <boxGeometry args={[2.98, 0.025, 0.025]} />
            <meshBasicMaterial color="#65e5f2" />
          </mesh>
          <Text position={[-1.28, 0.38, 0.02]} fontSize={0.2} color="#f4f6fb" anchorX="left" maxWidth={2.55}>
            {title}
          </Text>
          <Text position={[-1.28, -0.04, 0.02]} fontSize={0.095} color="#9aa7b8" anchorX="left" maxWidth={2.55}>
            {subtitle}
          </Text>
          <Text position={[-1.28, -0.56, 0.02]} fontSize={0.09} color="#65e5f2" anchorX="left">
            PRESS E / CLICK TO INSPECT
          </Text>
        </>
      )}
    </group>
  );
}

function NeuralModel({ onInteraction }: { onInteraction: (id: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const propagation = useRef<THREE.Mesh>(null);
  const positions = useMemo(
    () => [
      [-1.4, 0.2, 0], [-0.8, 1.1, 0.2], [-0.65, -0.8, -0.2],
      [0, 0.6, 0.3], [0.1, -0.4, 0.1], [0.8, 1, -0.2],
      [0.85, -0.7, 0.2], [1.45, 0.2, 0], [0, 0, 0],
    ] as [number, number, number][],
    [],
  );
  const links = useMemo(() => {
    const values: number[] = [];
    [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [3, 5], [4, 6], [5, 7], [6, 7], [3, 8], [4, 8], [8, 7]].forEach(([a, b]) => {
      values.push(...positions[a], ...positions[b]);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(values, 3));
    return geometry;
  }, [positions]);
  const signalPath = useMemo(
    () => new THREE.CatmullRomCurve3([positions[0], positions[3], positions[8], positions[5], positions[7]].map((point) => new THREE.Vector3(...point))),
    [positions],
  );
  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.18;
    if (propagation.current) propagation.current.position.copy(signalPath.getPoint((state.clock.elapsedTime * 0.16) % 1));
  });

  return (
    <group ref={group} position={[0, 1.95, -ROOM_SPACING * 3]}>
      <lineSegments geometry={links}>
        <lineBasicMaterial color="#b9cbd3" transparent opacity={0.54} />
      </lineSegments>
      {positions.map((point, index) => (
        <mesh
          key={index}
          ref={(mesh) => { if (mesh) mesh.userData.interactionId = "ai-lab"; }}
          position={point}
          scale={index === 8 ? 0.22 : 0.11}
          castShadow
          onClick={(event) => { event.stopPropagation(); onInteraction("ai-lab"); }}
          onPointerOver={() => { document.body.style.cursor = "pointer"; }}
          onPointerOut={() => { document.body.style.cursor = "auto"; }}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshPhysicalMaterial color={index === 8 ? "#d3d9d8" : "#8e9ba2"} emissive={index === 8 ? "#39494d" : "#20292e"} emissiveIntensity={0.6} metalness={0.68} roughness={0.24} clearcoat={0.5} />
        </mesh>
      ))}
      <mesh ref={propagation} scale={0.075}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#e6edf0" />
      </mesh>
      <mesh>
        <torusGeometry args={[2, 0.013, 8, 96]} />
        <meshBasicMaterial color="#a7b9c0" transparent opacity={0.24} />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.3, 0.2]}>
        <torusGeometry args={[2.25, 0.012, 8, 96]} />
        <meshBasicMaterial color="#d4c7a9" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function SlidingDoorPanel({ side, open }: { side: -1 | 1; open: boolean }) {
  const body = useRef<RapierRigidBody>(null);
  useFrame((_, delta) => {
    const panel = body.current;
    if (!panel) return;
    const position = panel.translation();
    const targetX = side * (open ? 3.55 : 1.08);
    panel.setNextKinematicTranslation({
      x: THREE.MathUtils.damp(position.x, targetX, 5, delta),
      y: position.y,
      z: position.z,
    });
  });

  return (
    <RigidBody ref={body} type="kinematicPosition" colliders={false} position={[side * 1.08, 1.82, -2.4]}>
      <CuboidCollider args={[1.1, 1.8, 0.16]} />
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.16, 3.58, 0.25]} />
        <meshPhysicalMaterial color="#7c858b" metalness={0.78} roughness={0.2} transmission={0.28} thickness={0.18} clearcoat={0.9} />
      </mesh>
      <mesh position={[side * -0.56, 0, 0.14]}>
        <boxGeometry args={[0.035, 3.2, 0.025]} />
        <meshBasicMaterial color="#d4dce1" transparent opacity={0.6} />
      </mesh>
    </RigidBody>
  );
}

function ServerRack({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 2.4, 0.95]} />
        <meshPhysicalMaterial color="#252a2d" metalness={0.78} roughness={0.34} clearcoat={0.45} />
      </mesh>
      <CuboidCollider position={[0, 1.2, 0]} args={[0.625, 1.2, 0.475]} />
      {[0.47, 0.99, 1.51, 2.03].map((height, index) => (
        <group key={height} position={[0, height, 0.49]}>
          <mesh>
            <boxGeometry args={[0.96, 0.42, 0.035]} />
            <meshStandardMaterial color="#41474a" metalness={0.7} roughness={0.35} />
          </mesh>
          <mesh position={[0.35, 0, 0.025]}>
            <sphereGeometry args={[0.025, 8, 8]} />
            <meshBasicMaterial color={index % 2 ? "#d5dbc9" : "#a3bcc4"} />
          </mesh>
          <mesh position={[0.27, 0, 0.025]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#646b6d" />
          </mesh>
          <mesh position={[-0.08, 0, 0.025]}>
            <boxGeometry args={[0.42, 0.025, 0.015]} />
            <meshBasicMaterial color="#8f999d" transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[1.38, 0.08, 1.08]} />
        <meshPhysicalMaterial color="#9aa0a0" metalness={0.82} roughness={0.22} />
      </mesh>
    </group>
  );
}

function RoomDisplays({ onInteraction, gateOpen }: { onInteraction: (id: string) => void; gateOpen: boolean }) {
  const gateSensor = useRef<THREE.Mesh>(null);
  useEffect(() => {
    if (gateSensor.current) gateSensor.current.userData.interactionId = "entrance-door";
  }, []);

  return (
    <group>
      <group>
        <mesh position={[-2.35, 2.2, -2.4]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 4.4, 0.62]} />
          <meshPhysicalMaterial color="#777e82" metalness={0.83} roughness={0.26} />
        </mesh>
        <mesh position={[2.35, 2.2, -2.4]} castShadow receiveShadow>
          <boxGeometry args={[0.42, 4.4, 0.62]} />
          <meshPhysicalMaterial color="#777e82" metalness={0.83} roughness={0.26} />
        </mesh>
        <mesh position={[0, 4.28, -2.4]} castShadow receiveShadow>
          <boxGeometry args={[5.1, 0.42, 0.72]} />
          <meshPhysicalMaterial color="#777e82" metalness={0.83} roughness={0.26} />
        </mesh>
        <mesh ref={gateSensor} position={[0, 1.82, -2.17]} onClick={(event) => { event.stopPropagation(); onInteraction("entrance-door"); }}>
          <planeGeometry args={[4.3, 3.5]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <mesh position={[0, 2.1, -2.02]} onClick={(event) => { event.stopPropagation(); onInteraction("entrance-door"); }}>
          <boxGeometry args={[0.22, 0.52, 0.12]} />
          <meshStandardMaterial color="#d0d4d6" emissive="#53616b" emissiveIntensity={0.24} metalness={0.8} roughness={0.25} />
        </mesh>
        <Text position={[0, 4.63, -2.02]} fontSize={0.105} color="#d8e0e4" anchorX="center" letterSpacing={0.18}>
          THE ASHISH MEWADA EXPERIENCE
        </Text>
        <SlidingDoorPanel side={-1} open={gateOpen} />
        <SlidingDoorPanel side={1} open={gateOpen} />
      </group>
      <mesh position={[0, 2.05, -4.8]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 3.9, 0.22]} />
        <meshStandardMaterial color="#101722" metalness={0.72} roughness={0.28} emissive="#0b1528" emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 0.12, -4.65]}>
        <boxGeometry args={[7.4, 0.025, 0.035]} />
        <meshBasicMaterial color="#65e5f2" />
      </mesh>
      <Text position={[0, 2.75, -4.65]} fontSize={0.48} color="#f4f6fb" anchorX="center">
        ASHISH MEWADA
      </Text>
      <Text position={[0, 2.26, -4.65]} fontSize={0.17} color="#c5d4df" letterSpacing={0.16} anchorX="center">
        AGENTIC AI ENGINEER  ·  BHOPAL, INDIA
      </Text>
      <Text position={[0, 1.75, -4.65]} fontSize={0.16} color="#b4bfce" anchorX="center">
        BUILDING INTELLIGENT SYSTEMS THAT THINK, REASON & ACT.
      </Text>
      <mesh position={[3.25, 1.68, -4.55]}>
        <boxGeometry args={[1.55, 2.15, 0.15]} />
        <meshPhysicalMaterial color="#4c5258" metalness={0.84} roughness={0.24} />
      </mesh>
      <DreiImage url="/portfolio-assets/portrait.jpeg" scale={[1.35, 1.8]} position={[3.25, 1.7, -4.46]} toneMapped={false} />
      <Text position={[3.25, 0.48, -4.44]} fontSize={0.07} color="#c5d4df" anchorX="center">
        ASHISH MEWADA · PROFILE PHOTO
      </Text>
      <mesh position={[-3.05, 1.05, -4.55]}>
        <torusGeometry args={[0.8, 0.018, 8, 80]} />
        <meshBasicMaterial color="#65e5f2" />
      </mesh>
      <mesh position={[-3.05, 1.05, -4.55]}>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshStandardMaterial color="#172a45" emissive="#174783" emissiveIntensity={1.1} metalness={0.7} roughness={0.2} wireframe />
      </mesh>
      <Text position={[0, 2.8, -ROOM_SPACING]} fontSize={0.31} color="#f4f6fb" anchorX="center">
        NOT JUST MODELS.
      </Text>
      <Text position={[0, 2.34, -ROOM_SPACING]} fontSize={0.22} color="#65e5f2" anchorX="center">
        SYSTEMS AROUND THEM.
      </Text>
      <Text position={[0, 1.9, -ROOM_SPACING]} fontSize={0.12} color="#aab5c4" anchorX="center" maxWidth={7} textAlign="center">
        I connect models to useful context, reliable tools, and verifiable outcomes.
      </Text>
      <InteractiveDisplay id="profile" title="ENGINEERING APPROACH" subtitle="Applied ML · LLM systems · Product-minded software" position={[-8.35, 1.8, -ROOM_SPACING]} rotation={[0, Math.PI / 2, 0]} onInteraction={onInteraction} />
      <InteractiveDisplay id="profile" title="WHAT I BUILD" subtitle="RAG pipelines · Tool-using agents · AI products" position={[8.35, 1.8, -ROOM_SPACING]} rotation={[0, -Math.PI / 2, 0]} onInteraction={onInteraction} />
      {projects.map((project, index) => (
        <group key={project.name} position={[0, 0, -ROOM_SPACING * 2]}>
          {index < 2 ? (
            <InteractiveDisplay id={`project-${index}`} title={project.name} subtitle={`${project.category} · CONCEPT ART`} image={project.image} position={[-3.15, 2.25, -index * 4.1]} onInteraction={onInteraction} />
          ) : (
            <InteractiveDisplay id={`project-${index}`} title={project.name} subtitle={`${project.category} · CONCEPT ART`} image={project.image} position={[3.15, 2.25, -(index - 2) * 4.1]} onInteraction={onInteraction} />
          )}
          <mesh position={[index % 2 === 0 ? -3.15 : 3.15, 0.48, -(index < 2 ? index : index - 2) * 4.1]}>
            <boxGeometry args={[2.75, 0.12, 0.12]} />
            <meshStandardMaterial color="#333e4b" metalness={0.85} roughness={0.2} />
          </mesh>
          <mesh position={[index % 2 === 0 ? -3.15 : 3.15, 0.92, -(index < 2 ? index : index - 2) * 4.1]}>
            <boxGeometry args={[2.58, 0.018, 0.035]} />
            <meshBasicMaterial color="#65e5f2" />
          </mesh>
        </group>
      ))}
      <NeuralModel onInteraction={onInteraction} />
      <Text position={[0, 4.25, -ROOM_SPACING * 3]} fontSize={0.22} color="#d6dde3" anchorX="center" letterSpacing={0.12}>AI RESEARCH LABORATORY</Text>
      <Text position={[0, 3.88, -ROOM_SPACING * 3]} fontSize={0.1} color="#98a7b3" anchorX="center">MODELS · RETRIEVAL · WORKFLOWS · TOOLS</Text>
      {[-1, 1].flatMap((side) => [-52, -57].map((z) => (
        <ServerRack key={`${side}-${z}`} position={[side * 6.65, 0, z]} rotation={[0, side < 0 ? Math.PI / 2 : -Math.PI / 2, 0]} />
      )))}
      {skillGroups.flatMap((group, groupIndex) => group.technologies.slice(0, 3).map((technology, itemIndex) => (
        <Text key={technology} position={[-3.4 + itemIndex * 1.7, 0.8 - groupIndex * 0.55, -ROOM_SPACING * 3 + 0.1]} fontSize={0.09} color="#aab5c4" anchorX="center">
          {technology.toUpperCase()}
        </Text>
      )))}
      <InteractiveDisplay id="ai-llm" title="LLM INFERENCE" subtitle="Tokens · context · generation" position={[-8.35, 1.8, -ROOM_SPACING * 3 + 2.6]} rotation={[0, Math.PI / 2, 0]} onInteraction={onInteraction} />
      <InteractiveDisplay id="ai-rag" title="RAG PIPELINE" subtitle="Ingest · retrieve · ground" position={[8.35, 1.8, -ROOM_SPACING * 3 + 2.6]} rotation={[0, -Math.PI / 2, 0]} onInteraction={onInteraction} />
      <InteractiveDisplay id="ai-mcp" title="MCP INFRASTRUCTURE" subtitle="Clients · servers · tools" position={[-8.35, 1.8, -ROOM_SPACING * 3 - 3]} rotation={[0, Math.PI / 2, 0]} onInteraction={onInteraction} />
      <InteractiveDisplay id="ai-langgraph" title="LANGGRAPH WORKFLOW" subtitle="State · transitions · review" position={[8.35, 1.8, -ROOM_SPACING * 3 - 3]} rotation={[0, -Math.PI / 2, 0]} onInteraction={onInteraction} />
      <InteractiveDisplay id="ai-ml" title="MACHINE LEARNING" subtitle="Data · features · prediction" position={[0, 1.55, -ROOM_SPACING * 3 + 4.7]} onInteraction={onInteraction} />
      <InteractiveDisplay id="ai-lab" title="SYSTEMS MAP" subtitle="Explore the connected AI concepts" position={[0, 1.8, -ROOM_SPACING * 3 - 8.6]} rotation={[0, Math.PI, 0]} onInteraction={onInteraction} />
      <InteractiveDisplay id="experience-elix" title="ELIX STUDIO" subtitle="CURRENT · MACHINE LEARNING ENGINEER" position={[-4.5, 1.8, -ROOM_SPACING * 4 - 1]} onInteraction={onInteraction} />
      <InteractiveDisplay id="experience-patrex" title="PATREX" subtitle="INTERNSHIP · ONE MONTH" position={[0, 1.8, -ROOM_SPACING * 4 - 1]} onInteraction={onInteraction} />
      <InteractiveDisplay id="education" title="ORIENTAL COLLEGE" subtitle="B.TECH CSE · EXPECTED 2028" position={[4.5, 1.8, -ROOM_SPACING * 4 - 1]} onInteraction={onInteraction} />
      <InteractiveDisplay id="resume" title="RESUME TERMINAL" subtitle="Open PDF · Download · Print" position={[-8.35, 1.8, -ROOM_SPACING * 5]} rotation={[0, Math.PI / 2, 0]} onInteraction={onInteraction} />
      <InteractiveDisplay id="contact" title="LET'S BUILD TOGETHER" subtitle="Email · LinkedIn · GitHub" position={[8.35, 1.8, -ROOM_SPACING * 6]} rotation={[0, -Math.PI / 2, 0]} onInteraction={onInteraction} />
    </group>
  );
}

function Atmosphere() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 320;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      const seed = index * 12.9898;
      values[index * 3] = Math.sin(seed) * 8.1;
      values[index * 3 + 1] = Math.cos(seed * 1.71) * 4.1 + 1.5;
      values[index * 3 + 2] = -((index * 0.37) % 124) + 7;
    }
    return values;
  }, []);
  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y += delta * 0.002;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#d3d9dc" size={0.018} transparent opacity={0.24} depthWrite={false} />
    </points>
  );
}

type PlayerProps = Pick<
  WalkableWorldProps,
  "started" | "paused" | "reducedMotion" | "joystick" | "sprintEnabled" | "destination" | "resetToken" | "jumpToken" | "interactToken" | "onGateApproach" | "onRoomChange" | "onInteraction" | "onLookTarget" | "onPointerLockChange"
>;

function Player({
  started,
  paused,
  reducedMotion,
  joystick,
  sprintEnabled,
  destination,
  resetToken,
  jumpToken,
  interactToken,
  onGateApproach,
  onRoomChange,
  onInteraction,
  onLookTarget,
  onPointerLockChange,
}: PlayerProps) {
  const body = useRef<RapierRigidBody>(null);
  const { camera: activeCamera, gl, scene } = useThree();
  const camera = useRef(activeCamera);
  const cameraPosition = useRef(new THREE.Vector3());
  const { rapier, world } = useRapier();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const keys = useRef(new Set<string>());
  const yaw = useRef(0);
  const pitch = useRef(0);
  const dragPointer = useRef<number | null>(null);
  const lastTouchPosition = useRef({ x: 0, y: 0 });
  const lastInteraction = useRef(false);
  const lastJump = useRef(false);
  const jumpQueued = useRef(false);
  const previousJumpToken = useRef(jumpToken);
  const previousInteractToken = useRef(interactToken);
  const interactionQueued = useRef(false);
  const destinationRef = useRef<number | null>(destination);
  const lastRoom = useRef(-1);
  const previousHint = useRef<string | null>(null);
  const gateApproachTriggered = useRef(false);
  const callbackRef = useRef(onInteraction);
  const gateApproachCallbackRef = useRef(onGateApproach);
  const roomCallbackRef = useRef(onRoomChange);
  const lookCallbackRef = useRef(onLookTarget);

  useEffect(() => { destinationRef.current = destination; }, [destination]);
  useEffect(() => { callbackRef.current = onInteraction; }, [onInteraction]);
  useEffect(() => { gateApproachCallbackRef.current = onGateApproach; }, [onGateApproach]);
  useEffect(() => { roomCallbackRef.current = onRoomChange; }, [onRoomChange]);
  useEffect(() => { lookCallbackRef.current = onLookTarget; }, [onLookTarget]);
  useEffect(() => {
    if (jumpToken !== previousJumpToken.current) {
      previousJumpToken.current = jumpToken;
      jumpQueued.current = true;
    }
  }, [jumpToken]);
  useEffect(() => {
    if (interactToken !== previousInteractToken.current) {
      previousInteractToken.current = interactToken;
      interactionQueued.current = true;
    }
  }, [interactToken]);

  const reset = useCallback(() => {
    if (!body.current) return;
    body.current.setTranslation({ x: 0, y: 1.2, z: 0 }, true);
    body.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    yaw.current = 0;
    pitch.current = 0;
  }, []);

  useEffect(() => {
    if (resetToken > 0) reset();
  }, [reset, resetToken]);
  useEffect(() => {
    if (started) {
      yaw.current = 0;
      pitch.current = 0;
    }
  }, [started]);

  useEffect(() => {
    const element = gl.domElement;
    const onLockChange = () => onPointerLockChange(document.pointerLockElement === element);
    const onMouseMove = (event: MouseEvent) => {
      if (document.pointerLockElement !== element && dragPointer.current === null) return;
      yaw.current -= event.movementX * 0.0024;
      pitch.current = THREE.MathUtils.clamp(pitch.current - event.movementY * 0.0024, -1.35, 1.35);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || document.pointerLockElement === element) return;
      dragPointer.current = event.pointerId;
      element.setPointerCapture(event.pointerId);
    };
    const onPointerUp = (event: PointerEvent) => {
      if (dragPointer.current === event.pointerId) dragPointer.current = null;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      if (["KeyW", "KeyA", "KeyS", "KeyD", "Space", "ShiftLeft", "ShiftRight", "KeyE"].includes(event.code)) {
        event.preventDefault();
        keys.current.add(event.code);
      }
    };
    const onKeyUp = (event: KeyboardEvent) => { keys.current.delete(event.code); };
    const clearInput = () => {
      keys.current.clear();
      dragPointer.current = null;
      jumpQueued.current = false;
    };
    element.addEventListener("pointerlockchange", onLockChange);
    document.addEventListener("mousemove", onMouseMove);
    element.addEventListener("pointerdown", onPointerDown);
    element.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", clearInput);
    document.addEventListener("visibilitychange", clearInput);
    return () => {
      element.removeEventListener("pointerlockchange", onLockChange);
      document.removeEventListener("mousemove", onMouseMove);
      element.removeEventListener("pointerdown", onPointerDown);
      element.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", clearInput);
      document.removeEventListener("visibilitychange", clearInput);
    };
  }, [gl, onPointerLockChange]);

  useEffect(() => {
    const element = gl.domElement;
    const onTouchMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || dragPointer.current !== event.pointerId) return;
      const deltaX = event.clientX - lastTouchPosition.current.x;
      const deltaY = event.clientY - lastTouchPosition.current.y;
      lastTouchPosition.current = { x: event.clientX, y: event.clientY };
      yaw.current -= deltaX * 0.003;
      pitch.current = THREE.MathUtils.clamp(pitch.current - deltaY * 0.003, -1.35, 1.35);
    };
    const onTouchStart = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        dragPointer.current = event.pointerId;
        lastTouchPosition.current = { x: event.clientX, y: event.clientY };
      }
    };
    const onTouchEnd = (event: PointerEvent) => {
      if (event.pointerType === "touch" && dragPointer.current === event.pointerId) dragPointer.current = null;
    };
    element.addEventListener("pointerdown", onTouchStart);
    element.addEventListener("pointermove", onTouchMove);
    element.addEventListener("pointerup", onTouchEnd);
    element.addEventListener("pointercancel", onTouchEnd);
    return () => {
      element.removeEventListener("pointerdown", onTouchStart);
      element.removeEventListener("pointermove", onTouchMove);
      element.removeEventListener("pointerup", onTouchEnd);
      element.removeEventListener("pointercancel", onTouchEnd);
    };
  }, [gl]);

  useFrame((state, delta) => {
    if (!body.current) return;
    const playerBody = body.current;
    const position = playerBody.translation();
    const velocity = playerBody.linvel();
    if (position.z > -0.25) gateApproachTriggered.current = false;
    if (started && !paused && position.z < -0.8 && !gateApproachTriggered.current) {
      gateApproachTriggered.current = true;
      gateApproachCallbackRef.current();
    }
    const room = THREE.MathUtils.clamp(Math.round(-position.z / ROOM_SPACING), 0, ROOM_NAMES.length - 1);
    if (room !== lastRoom.current) {
      lastRoom.current = room;
      roomCallbackRef.current(room);
    }

    if (!started && !reducedMotion) {
      yaw.current = Math.sin(state.clock.elapsedTime * 0.16) * 0.22;
      pitch.current = Math.sin(state.clock.elapsedTime * 0.11) * 0.025;
    }
    camera.current.rotation.order = "YXZ";
    camera.current.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    cameraPosition.current.set(position.x, position.y + 0.48, position.z);
    camera.current.position.lerp(cameraPosition.current, 1 - Math.exp(-delta * (reducedMotion ? 30 : 14)));

    const inputX = (keys.current.has("KeyD") ? 1 : 0) - (keys.current.has("KeyA") ? 1 : 0) + joystick.x;
    const inputZ = (keys.current.has("KeyS") ? 1 : 0) - (keys.current.has("KeyW") ? 1 : 0) + joystick.z;
    let moveX = inputX;
    let moveZ = inputZ;
    if (destinationRef.current !== null) {
      const targetZ = -destinationRef.current * ROOM_SPACING;
      const remaining = targetZ - position.z;
      if (Math.abs(remaining) > 1.25) {
        moveX = 0;
        moveZ = Math.sign(remaining);
      } else {
        destinationRef.current = null;
      }
    }
    const magnitude = Math.hypot(moveX, moveZ);
    if (magnitude > 1) { moveX /= magnitude; moveZ /= magnitude; }
    const forwardX = -Math.sin(yaw.current);
    const forwardZ = -Math.cos(yaw.current);
    const rightX = Math.cos(yaw.current);
    const rightZ = -Math.sin(yaw.current);
    const speed = keys.current.has("ShiftLeft") || keys.current.has("ShiftRight") || sprintEnabled ? 7 : 4.2;
    const wantedX = (forwardX * -moveZ + rightX * moveX) * speed;
    const wantedZ = (forwardZ * -moveZ + rightZ * moveX) * speed;

    const groundRay = new rapier.Ray({ x: position.x, y: position.y - 0.78, z: position.z }, { x: 0, y: -1, z: 0 });
    const groundHit = world.castRay(groundRay, 0.48, true, undefined, undefined, undefined, playerBody);
    const grounded = groundHit !== null;
    const jumpPressed = keys.current.has("Space") || jumpQueued.current;
    if (position.y < -8) reset();
    if (started && !paused) {
      if (jumpPressed && !lastJump.current && grounded) jumpQueued.current = false;
      playerBody.setLinvel({
        x: THREE.MathUtils.damp(velocity.x, wantedX, 13, delta),
        y: jumpPressed && !lastJump.current && grounded ? 5.2 : velocity.y,
        z: THREE.MathUtils.damp(velocity.z, wantedZ, 13, delta),
      }, true);
    } else {
      playerBody.setLinvel({ x: 0, y: velocity.y, z: 0 }, true);
    }
    lastJump.current = keys.current.has("Space");

    const interactPressed = keys.current.has("KeyE") || interactionQueued.current;
    if (interactPressed && !lastInteraction.current && started && !paused) {
      raycaster.setFromCamera(new THREE.Vector2(0, 0), camera.current);
      const hit = raycaster.intersectObjects(scene.children, true).find((intersection) => intersection.object.userData.interactionId);
      const id = hit?.object.userData.interactionId as string | undefined;
      if (id && hit && hit.distance < 5) callbackRef.current(id);
    }
    interactionQueued.current = false;
    lastInteraction.current = keys.current.has("KeyE");

    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera.current);
    const hit = raycaster.intersectObjects(scene.children, true).find((intersection) => intersection.object.userData.interactionId && intersection.distance < 5);
    const nextHint = hit?.object.userData.interactionId as string | undefined;
    if ((nextHint ?? null) !== previousHint.current) {
      previousHint.current = nextHint ?? null;
      const item = INTERACTION_DATA.find((interaction) => interaction.id === nextHint);
      lookCallbackRef.current(item?.title ?? null);
    }
  });

  return (
    <>
      <RigidBody
        ref={body}
        type="dynamic"
        position={[0, 1.2, 0]}
        colliders={false}
        enabledRotations={[false, false, false]}
        linearDamping={0.8}
        canSleep={false}
        ccd
        name="player"
      >
        <CapsuleCollider args={[0.52, 0.32]} friction={0.1} restitution={0} />
      </RigidBody>
    </>
  );
}

export default function WalkableWorld({
  started,
  paused,
  reducedMotion,
  joystick,
  sprintEnabled,
  destination,
  resetToken,
  jumpToken,
  interactToken,
  onGateApproach,
  gateOpen,
  pixelRatio,
  onRoomChange,
  onInteraction,
  onLookTarget,
  onPointerLockChange,
}: WalkableWorldProps) {
  return (
    <Canvas
      dpr={[pixelRatio, Math.min(pixelRatio + 0.2, 1.5)]}
      shadows={{ type: THREE.PCFShadowMap }}
      camera={{ position: [0, 1.7, 0], fov: 72, near: 0.1, far: 125 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#080b11");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        scene.fog = new THREE.FogExp2("#080b11", 0.014);
      }}
    >
      <ambientLight color="#d9d5cb" intensity={0.38} />
      <directionalLight position={[1, 8, 3]} color="#f2eee4" intensity={1.55} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={12} shadow-camera-bottom={-12} />
      <Physics gravity={[0, -9.81, 0]} timeStep="vary" colliders={false}>
        <WorldArchitecture />
        <RoomDisplays onInteraction={onInteraction} gateOpen={gateOpen} />
        <Atmosphere />
        <Player
          started={started}
          paused={paused}
          reducedMotion={reducedMotion}
          joystick={joystick}
          sprintEnabled={sprintEnabled}
          destination={destination}
          resetToken={resetToken}
          jumpToken={jumpToken}
          interactToken={interactToken}
          onGateApproach={onGateApproach}
          onRoomChange={onRoomChange}
          onInteraction={onInteraction}
          onLookTarget={onLookTarget}
          onPointerLockChange={onPointerLockChange}
        />
      </Physics>
    </Canvas>
  );
}

export { INTERACTION_DATA, ROOM_NAMES };
