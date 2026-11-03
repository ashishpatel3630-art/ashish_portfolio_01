"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap } from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  AudioLines,
  Expand,
  Map as MapIcon,
  Move,
  Pause,
  Play,
  RotateCcw,
  SlidersHorizontal,
  VolumeX,
  X,
} from "lucide-react";
import { INTERACTION_DATA, ROOM_NAMES } from "@/components/WalkableWorld";

const WalkableWorld = dynamic(() => import("@/components/WalkableWorld"), {
  ssr: false,
  loading: () => (
    <div role="status" className="fixed inset-0 grid place-items-center bg-[#080b11] font-mono text-[10px] uppercase tracking-[0.25em] text-white/55">
      Building the world…
    </div>
  ),
});

type JoystickInput = { x: number; z: number };
type Interaction = (typeof INTERACTION_DATA)[number] & { image?: string };

export default function WorldPortfolio({ hasResume }: { hasResume: boolean }) {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [room, setRoom] = useState(0);
  const [destination, setDestination] = useState<number | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const [jumpToken, setJumpToken] = useState(0);
  const [interactToken, setInteractToken] = useState(0);
  const [mapOpen, setMapOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [sprintEnabled, setSprintEnabled] = useState(false);
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const [quality, setQuality] = useState<"performance" | "balanced" | "high">("balanced");
  const [audioVolume, setAudioVolume] = useState(0.4);
  const [interaction, setInteraction] = useState<Interaction | null>(null);
  const [lookTarget, setLookTarget] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [joystick, setJoystick] = useState<JoystickInput>({ x: 0, z: 0 });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [formMessage, setFormMessage] = useState("");
  const [status, setStatus] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const ambience = useRef<OscillatorNode | null>(null);
  const ambienceGain = useRef<GainNode | null>(null);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const pointerPreference = window.matchMedia("(pointer: coarse)");
    const updateDeviceMode = () => {
      const coarse = pointerPreference.matches;
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      setIsCoarsePointer(coarse);
      if (coarse || navigator.hardwareConcurrency <= 4 || (memory !== undefined && memory <= 4)) setQuality("performance");
    };
    updateDeviceMode();
    pointerPreference.addEventListener("change", updateDeviceMode);
    return () => pointerPreference.removeEventListener("change", updateDeviceMode);
  }, []);

  useEffect(() => {
    if (!interaction || reducedMotion || !panelRef.current) return;
    gsap.fromTo(panelRef.current, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out" });
  }, [interaction, reducedMotion]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const editing = target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if (editing && event.code !== "Escape") return;
      if (event.code === "Escape" && interaction) {
        setInteraction(null);
        setPaused(false);
        setFormState("idle");
        setFormMessage("");
        return;
      }
      if (event.code === "Escape" && started && !interaction) {
        setPaused((current) => !current);
        if (document.pointerLockElement) document.exitPointerLock();
      }
      if (event.code === "KeyR" && started && !interaction) {
        setDestination(null);
        setResetToken((token) => token + 1);
        setRoom(0);
        setStatus("Position reset to the entrance.");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [interaction, started]);

  const toggleSound = useCallback(() => {
    if (soundEnabled) {
      ambienceGain.current?.gain.setTargetAtTime(0, audioContext.current?.currentTime ?? 0, 0.15);
      setSoundEnabled(false);
      return;
    }
    try {
      const context = audioContext.current ?? new AudioContext();
      audioContext.current = context;
      if (!ambience.current) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = 52;
        gain.gain.value = 0;
        oscillator.connect(gain);
        gain.connect(context.destination);
        oscillator.start();
        ambience.current = oscillator;
        ambienceGain.current = gain;
      }
      void context.resume();
      ambienceGain.current?.gain.setTargetAtTime(0.012 * audioVolume, context.currentTime, 0.4);
      setSoundEnabled(true);
    } catch {
      setStatus("Ambient audio is not available in this browser.");
    }
  }, [audioVolume, soundEnabled]);

  useEffect(() => () => {
    ambience.current?.stop();
    void audioContext.current?.close();
  }, []);

  const moveTo = useCallback((index: number) => {
    setDestination(index);
    if (index > 0) setGateOpen(true);
    setPaused(false);
    setMapOpen(false);
    setInteraction(null);
    setStatus(`Walking to ${ROOM_NAMES[index].toLowerCase()}.`);
    if (!started) setStarted(true);
  }, [started]);

  const begin = useCallback(() => {
    setStarted(true);
    setPaused(false);
    setStatus("Explore the world. Click and drag to look around.");
    if (!window.matchMedia("(pointer: coarse)").matches) {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        const result = canvas.requestPointerLock();
        if (result instanceof Promise) {
          void result.catch(() => setStatus("Pointer lock was blocked. Click and drag to look around."));
        }
      }
    }
  }, []);

  const activateInteraction = useCallback((id: string) => {
    if (id === "entrance-door") {
      setGateOpen((current) => !current);
      setStatus(gateOpen ? "Entrance gate closed." : "Entrance gate opening.");
      return;
    }
    const next = INTERACTION_DATA.find((item) => item.id === id);
    if (!next) return;
    setPaused(true);
    setInteraction(next);
    setFormState("idle");
    setFormMessage("");
  }, [gateOpen]);

  const closeInteraction = useCallback(() => {
    setInteraction(null);
    setPaused(false);
    setFormState("idle");
    setFormMessage("");
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setStatus("Fullscreen is unavailable in this browser.");
    }
  }, []);

  const setVolume = (value: number) => {
    setAudioVolume(value);
    const context = audioContext.current;
    if (context && ambienceGain.current) {
      ambienceGain.current.gain.setTargetAtTime(soundEnabled ? 0.012 * value : 0, context.currentTime, 0.12);
    }
  };

  const pixelRatio = quality === "performance" ? 0.85 : quality === "high" ? 1.35 : 1.05;

  const submitContact = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setFormState("sending");
    setFormMessage("");
    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      subject: String(data.get("subject") ?? ""),
      message: String(data.get("message") ?? ""),
      website: String(data.get("website") ?? ""),
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Message could not be sent.");
      setFormState("sent");
      setFormMessage("Message sent. Thanks for reaching out.");
      form.reset();
    } catch (error) {
      setFormState("error");
      setFormMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  };

  const activePaused = paused || interaction !== null;

  return (
    <main className="fixed inset-0 isolate overflow-hidden bg-[#080b11] text-[#f4f6fb]">
      <div className="absolute inset-0 touch-none">
        <WalkableWorld
          started={started}
          paused={activePaused}
          reducedMotion={reducedMotion}
          joystick={joystick}
          sprintEnabled={sprintEnabled}
          destination={destination}
          resetToken={resetToken}
          jumpToken={jumpToken}
          interactToken={interactToken}
          gateOpen={gateOpen}
          pixelRatio={pixelRatio}
          onGateApproach={() => setGateOpen(true)}
          onRoomChange={(nextRoom) => {
            setRoom(nextRoom);
            if (destination === nextRoom) {
              setDestination(null);
              setStatus(`Arrived at ${ROOM_NAMES[nextRoom].toLowerCase()}.`);
            }
          }}
          onInteraction={activateInteraction}
          onLookTarget={setLookTarget}
          onPointerLockChange={setLocked}
        />
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 sm:p-6">
        <button type="button" onClick={() => moveTo(0)} className="pointer-events-auto text-left font-extrabold tracking-[-0.09em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#65e5f2]" aria-label="Walk to the entrance">
          AM<span className="text-[#65e5f2]">.</span>
          <span className="ml-3 hidden font-mono text-[9px] font-normal tracking-[0.18em] text-white/45 sm:inline">IMMERSIVE PORTFOLIO</span>
        </button>
        <div className="pointer-events-auto flex items-center gap-0.5 border border-white/10 bg-[#0b1018]/75 p-0.5 backdrop-blur-md sm:gap-1 sm:p-1">
          <button type="button" onClick={() => { setMapOpen((value) => !value); setSettingsOpen(false); }} className="grid h-8 w-8 place-items-center text-white/70 hover:text-white sm:h-9 sm:w-9" aria-label="Toggle navigation map" aria-expanded={mapOpen}><MapIcon size={16} /></button>
          <button type="button" onClick={toggleSound} className="grid h-8 w-8 place-items-center text-white/70 hover:text-white sm:h-9 sm:w-9" aria-label={soundEnabled ? "Mute ambient sound" : "Play ambient sound"}>{soundEnabled ? <AudioLines size={16} /> : <VolumeX size={16} />}</button>
          <button type="button" onClick={() => setReducedMotion((value) => !value)} className={`grid h-8 w-8 place-items-center sm:h-9 sm:w-9 ${reducedMotion ? "text-[#65e5f2]" : "text-white/70 hover:text-white"}`} aria-label={reducedMotion ? "Disable reduced motion" : "Enable reduced motion"} aria-pressed={reducedMotion}><Move size={16} /></button>
          <button type="button" onClick={() => { setSettingsOpen((value) => !value); setMapOpen(false); }} className="grid h-8 w-8 place-items-center text-white/70 hover:text-white sm:h-9 sm:w-9" aria-label="Open sound and quality settings" aria-expanded={settingsOpen}><SlidersHorizontal size={16} /></button>
          <button type="button" onClick={toggleFullscreen} className="grid h-8 w-8 place-items-center text-white/70 hover:text-white sm:h-9 sm:w-9" aria-label="Toggle fullscreen"><Expand size={16} /></button>
        </div>
      </header>

      <div className="pointer-events-none absolute left-4 top-[4.5rem] z-10 border-l border-[#65e5f2] pl-3 sm:left-6">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">CURRENT ZONE</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-white/85">0{room + 1} / {ROOM_NAMES[room]}</p>
      </div>

      {mapOpen && (
          <nav aria-label="World navigation map" className="absolute right-4 top-[4.5rem] z-30 max-h-[calc(100dvh-6rem)] w-[min(18rem,calc(100vw-2rem))] overflow-y-auto border border-white/10 bg-[#0b1018]/95 p-3 shadow-2xl backdrop-blur-xl sm:right-6">
          <p className="mb-2 px-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/40">Choose a room · the player walks there</p>
          {ROOM_NAMES.map((name, index) => (
            <button type="button" key={name} onClick={() => moveTo(index)} aria-current={room === index ? "location" : undefined} className="flex w-full items-center justify-between px-2 py-2.5 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white">
              <span><span className="mr-3 text-[#65e5f2]">0{index + 1}</span>{name}</span>
              {room === index && <span className="h-1.5 w-1.5 rounded-full bg-[#65e5f2]" />}
            </button>
          ))}
          <p className="mt-2 border-t border-white/10 pt-2 font-mono text-[8px] text-white/35">ALTERNATIVE NAVIGATION · NO MANUAL MOVEMENT REQUIRED</p>
        </nav>
      )}

      {settingsOpen && (
        <section aria-label="World settings" className="absolute right-4 top-[4.5rem] z-30 max-h-[calc(100dvh-6rem)] w-[min(18rem,calc(100vw-2rem))] overflow-y-auto border border-white/10 bg-[#0b1018]/95 p-4 shadow-2xl backdrop-blur-xl sm:right-6">
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/60">
            Ambient volume <span className="text-[#65e5f2]">{Math.round(audioVolume * 100)}%</span>
            <input aria-label="Ambient volume" type="range" min="0" max="1" step="0.05" value={audioVolume} onChange={(event) => setVolume(Number(event.target.value))} className="accent-[#b8c8d3]" />
          </label>
          <label className="mt-5 grid gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-white/60">
            Rendering quality
            <select value={quality} onChange={(event) => setQuality(event.target.value as "performance" | "balanced" | "high")} className="border border-white/10 bg-[#111923] px-3 py-2 text-white/80 outline-none focus:border-[#a9bbc8]">
              <option value="performance">Performance</option><option value="balanced">Balanced</option><option value="high">High detail</option>
            </select>
          </label>
          <p className="mt-3 font-mono text-[8px] leading-5 text-white/35">Touch devices and low-memory systems start in performance mode.</p>
        </section>
      )}

      {!started && (
        <section className="absolute inset-0 z-20 grid grid-cols-[minmax(0,1fr)] place-items-center overflow-y-auto bg-[#080b11]/58 px-4 py-4 backdrop-blur-[2px] sm:px-5 sm:py-8" aria-labelledby="welcome-title">
          <div className="my-auto grid w-[calc(100vw-2rem)] min-w-0 max-w-5xl grid-cols-[minmax(0,1fr)] gap-5 border border-white/10 bg-[#0b1018]/85 p-5 shadow-2xl backdrop-blur-xl sm:w-full sm:gap-7 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center sm:p-10">
            <div className="min-w-0">
            <p className="font-mono text-[9px] uppercase tracking-[0.23em] text-[#c5d4df]">The Ashish Mewada Experience · Bhopal, India</p>
            <div className="mt-4 flex items-center gap-3 sm:hidden">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden border border-white/15 bg-[#131c29]">
                <Image src="/portfolio-assets/portrait.jpeg" alt="" fill sizes="56px" className="object-cover" />
              </div>
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#65e5f2]">AI engineer</p>
                <p className="mt-1 text-sm font-semibold">Ashish Mewada</p>
              </div>
            </div>
            <h1 id="welcome-title" className="mt-4 max-w-2xl break-words text-[clamp(2rem,9vw,2.5rem)] font-semibold leading-[0.98] tracking-[-0.065em] sm:mt-5 sm:text-5xl lg:text-6xl">Explore the world<br />behind the systems.</h1>
            <p className="mt-4 max-w-xl break-words text-[13px] leading-6 text-white/65 sm:mt-5 sm:text-sm sm:leading-7">Building intelligent systems that think, reason &amp; act. Walk through connected spaces for projects, AI systems, professional experience, and more.</p>
            <div className="mt-7 grid gap-2 font-mono text-[9px] uppercase tracking-[0.1em] text-white/50 sm:grid-cols-2">
              <span>WASD / MOVE</span><span>MOUSE / LOOK · CLICK-DRAG FALLBACK</span>
              <span>SPACE / JUMP · SHIFT / SPRINT</span><span>E / INSPECT · ESC / PAUSE · R / RESET</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4 sm:mt-8">
              <button type="button" onClick={begin} className="inline-flex min-h-11 items-center gap-3 bg-[#65e5f2] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.13em] text-[#061017] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                Start exploring <ArrowUpRight size={15} />
              </button>
              <span className="max-w-sm font-mono text-[8px] uppercase tracking-[0.12em] leading-5 text-white/45">Camera reveal runs quietly · start any time to skip · touch controls available</span>
            </div>
            </div>
            <div className="relative hidden aspect-[4/5] overflow-hidden border border-white/10 bg-[#131c29] sm:block">
              <Image src="/portfolio-assets/portrait.jpeg" alt="Portrait of Ashish Mewada" fill priority sizes="220px" className="object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080b11] via-[#080b11]/80 to-transparent px-4 pb-4 pt-12">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#65e5f2]">AI engineer · Bhopal, India</p>
                <p className="mt-1 text-sm font-semibold text-white">Ashish Mewada</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {started && !paused && !interaction && lookTarget && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 z-10 -translate-x-1/2 border border-[#65e5f2]/40 bg-[#081018]/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.13em] text-white/85 backdrop-blur">
          E / CLICK · {lookTarget}
        </div>
      )}

      {started && (
        <>
          {!isCoarsePointer && <div className="pointer-events-none absolute bottom-14 left-6 z-10 hidden items-center gap-4 border border-white/10 bg-[#0b1018]/75 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/55 backdrop-blur sm:flex">
            <span className="text-[#65e5f2]">{locked ? "MOUSE LOCKED" : "MOUSE DRAG / LOOK"}</span>
            <span><kbd className="mr-1 border border-white/15 px-1 py-0.5 text-white/80">WASD</kbd> Move</span>
            <span><kbd className="mr-1 border border-white/15 px-1 py-0.5 text-white/80">SPACE</kbd> Jump</span>
            <span><kbd className="mr-1 border border-white/15 px-1 py-0.5 text-white/80">SHIFT</kbd> Sprint</span>
            <span><kbd className="mr-1 border border-white/15 px-1 py-0.5 text-white/80">E</kbd> Inspect</span>
            <span><kbd className="mr-1 border border-white/15 px-1 py-0.5 text-white/80">ESC</kbd> Pause</span>
          </div>}
          <button type="button" onClick={() => { setDestination(null); setResetToken((token) => token + 1); setRoom(0); setStatus("Position reset to the entrance."); }} className="absolute bottom-4 right-4 z-10 grid h-10 w-10 place-items-center border border-white/10 bg-[#0b1018]/75 text-white/60 hover:text-white sm:bottom-6 sm:right-6" aria-label="Reset position"><RotateCcw size={15} /></button>
          {isCoarsePointer && <TouchJoystick onMove={setJoystick} />}
          {isCoarsePointer && <div className="absolute bottom-[5.2rem] right-4 z-10 flex flex-col gap-2 [@media(max-height:500px)]:bottom-2 [@media(max-height:500px)]:right-2 [@media(max-height:500px)]:flex-row">
            <button type="button" onClick={() => setJumpToken((token) => token + 1)} className="h-11 w-11 rounded-full border border-white/20 bg-[#0b1018]/80 font-mono text-[8px] text-white [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9" aria-label="Jump">JUMP</button>
            <button type="button" onClick={() => setInteractToken((token) => token + 1)} className="h-11 w-11 rounded-full border border-white/20 bg-[#0b1018]/80 font-mono text-[8px] text-white [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9" aria-label="Interact with the object in view">USE</button>
            <button type="button" onClick={() => setSprintEnabled((value) => !value)} className={`h-11 w-11 rounded-full border font-mono text-[8px] [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9 ${sprintEnabled ? "border-[#dce4e8] bg-[#dce4e8] text-[#111820]" : "border-white/20 bg-[#0b1018]/80 text-white"}`} aria-label="Toggle sprint" aria-pressed={sprintEnabled}>RUN</button>
            <button type="button" onClick={() => setPaused(true)} className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-[#0b1018]/80 text-white [@media(max-height:500px)]:h-9 [@media(max-height:500px)]:w-9" aria-label="Pause world"><Pause size={15} /></button>
          </div>}
        </>
      )}

      {paused && !interaction && (
        <section className="absolute inset-0 z-20 grid place-items-center bg-[#080b11]/62 px-4 backdrop-blur-sm" aria-labelledby="pause-title">
          <div className="w-full max-w-sm border border-white/10 bg-[#0b1018]/95 p-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#65e5f2]">Exploration paused</p>
            <h2 id="pause-title" className="mt-3 text-3xl font-semibold tracking-[-0.05em]">Take a moment.</h2>
            <div className="mt-6 grid gap-2">
              <button type="button" onClick={() => { setPaused(false); if (!window.matchMedia("(pointer: coarse)").matches) document.querySelector("canvas")?.requestPointerLock(); }} className="flex items-center justify-between bg-[#65e5f2] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.12em] text-[#061017]"><span>Resume exploring</span><Play size={14} /></button>
              <button type="button" onClick={() => { setPaused(false); setMapOpen(true); }} className="flex items-center justify-between border border-white/10 px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-white/75"><span>Open navigation map</span><MapIcon size={14} /></button>
              <button type="button" onClick={() => { setDestination(null); setResetToken((token) => token + 1); setRoom(0); setPaused(false); }} className="flex items-center justify-between border border-white/10 px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.12em] text-white/75"><span>Reset to entrance</span><RotateCcw size={14} /></button>
            </div>
          </div>
        </section>
      )}

      {interaction && (
        <section className="absolute inset-0 z-30 grid place-items-center overflow-y-auto bg-[#05080d]/66 px-4 py-4 backdrop-blur-sm sm:py-8" role="dialog" aria-modal="true" aria-labelledby="interaction-title" onKeyDown={(event) => { if (event.key === "Escape") closeInteraction(); }}>
          <div ref={panelRef} className="max-h-[calc(100dvh-2rem)] w-full max-w-xl overflow-y-auto border border-white/10 bg-[#0b1018]/95 p-4 shadow-2xl sm:max-h-[90vh] sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#65e5f2]">World terminal / {ROOM_NAMES[interaction.room]}</p>
                <h2 id="interaction-title" className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">{interaction.title}</h2>
              </div>
              <button type="button" onClick={closeInteraction} className="grid h-9 w-9 shrink-0 place-items-center border border-white/10 text-white/70 hover:text-white" aria-label="Close terminal"><X size={16} /></button>
            </div>
            {interaction.image && (
              <div className="relative mt-6 aspect-[12/7] overflow-hidden border border-white/10 bg-[#111a26]">
                <Image src={interaction.image} alt={`${interaction.title} concept visualization`} fill sizes="(max-width: 640px) 100vw, 640px" className="object-cover" />
              </div>
            )}
            <p className="mt-5 text-sm leading-7 text-white/65">{interaction.description}</p>
            <p className="mt-5 whitespace-pre-line border-l border-[#65e5f2]/60 pl-4 font-mono text-[10px] leading-6 text-white/55">{interaction.detail}</p>
            {interaction.id.startsWith("project-") && <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.1em] text-white/35">Concept artwork created for this portfolio · not a live product screenshot</p>}
            {interaction.id === "profile" && <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.1em] text-white/35">Personal profile photograph</p>}
            {interaction.id === "resume" && (hasResume ? <div className="mt-6 flex flex-wrap gap-2"><a href="/resume.pdf" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-[#65e5f2] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#061017]">Open PDF <ArrowUpRight size={13} /></a><a href="/resume.pdf" download className="border border-white/15 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/75">Download PDF</a><a href="/resume.pdf#toolbar=1&navpanes=0" target="_blank" rel="noreferrer" className="border border-white/15 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/75">Open to print</a></div> : <p className="mt-5 border border-amber-200/20 bg-amber-200/[0.04] p-3 font-mono text-[9px] leading-5 text-amber-100/80">No valid resume PDF is available. Replace public/resume.pdf with the approved PDF to enable open, download, and print.</p>)}
            {interaction.id === "contact" && <ContactForm state={formState} message={formMessage} onSubmit={submitContact} />}
            {interaction.href && interaction.id !== "resume" && <a href={interaction.href} target={interaction.href.startsWith("http") ? "_blank" : undefined} rel={interaction.href.startsWith("http") ? "noreferrer" : undefined} className="mt-6 inline-flex items-center gap-2 border border-white/20 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/80 transition-colors hover:border-[#65e5f2] hover:text-[#65e5f2]">{interaction.hrefLabel}<ArrowUpRight size={13} /></a>}
            {interaction.id === "contact" && <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.1em] text-white/55"><a className="hover:text-[#65e5f2]" href="mailto:ashishpatel3630@gmail.com">Email</a><a className="hover:text-[#65e5f2]" href="https://linkedin.com/in/ashish-mewada-0499ba379" target="_blank" rel="noreferrer">LinkedIn</a><a className="hover:text-[#65e5f2]" href="https://github.com/ashishpatel3630-art" target="_blank" rel="noreferrer">GitHub</a></div>}
          </div>
        </section>
      )}

      <p role="status" aria-live="polite" className="pointer-events-none absolute bottom-4 left-1/2 z-10 max-w-[75vw] -translate-x-1/2 truncate font-mono text-[8px] text-white/45 sm:bottom-6">{status}</p>
      <div className="sr-only" aria-live="polite">{ROOM_NAMES[room]} room</div>
    </main>
  );
}

function TouchJoystick({ onMove }: { onMove: (input: JoystickInput) => void }) {
  const [stick, setStick] = useState({ x: 0, y: 0 });

  const update = (event: React.PointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const radius = bounds.width * 0.34;
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / radius));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / radius));
    setStick({ x: x * radius, y: y * radius });
    onMove({ x, z: y });
  };

  return (
      <div className="absolute bottom-[5.2rem] left-4 z-10 [@media(max-height:500px)]:bottom-2 [@media(max-height:500px)]:left-2">
    <button
      type="button"
      aria-label="Virtual movement joystick. Drag in a direction to move."
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event);
      }}
      onPointerMove={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event); }}
      onPointerUp={(event) => { event.currentTarget.releasePointerCapture(event.pointerId); setStick({ x: 0, y: 0 }); onMove({ x: 0, z: 0 }); }}
      onPointerCancel={() => { setStick({ x: 0, y: 0 }); onMove({ x: 0, z: 0 }); }}
      onLostPointerCapture={() => { setStick({ x: 0, y: 0 }); onMove({ x: 0, z: 0 }); }}
      className="relative grid h-28 w-28 touch-none place-items-center rounded-full border border-white/20 bg-[#0b1018]/55 shadow-2xl backdrop-blur-sm [@media(max-height:500px)]:h-20 [@media(max-height:500px)]:w-20"
    >
      <span className="pointer-events-none absolute inset-3 rounded-full border border-white/10" />
      <span className="pointer-events-none absolute h-12 w-12 rounded-full border border-white/25 bg-[#dce4e8]/15 shadow-[0_0_24px_rgba(200,220,230,0.12)]" style={{ transform: `translate(${stick.x}px, ${stick.y}px)` }} />
    </button>
    <p className="mt-1 text-center font-mono text-[8px] uppercase tracking-[0.15em] text-white/45">Move</p>
    </div>
  );
}

function ContactForm({
  state,
  message,
  onSubmit,
}: {
  state: "idle" | "sending" | "sent" | "error";
  message: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-7 grid gap-3">
      <label className="grid gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/55">
        Your name
        <input name="name" required minLength={2} maxLength={100} autoComplete="name" className="border border-white/15 bg-white/[0.03] px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#65e5f2]" />
      </label>
      <label className="grid gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/55">
        Email
        <input name="email" type="email" required maxLength={254} autoComplete="email" className="border border-white/15 bg-white/[0.03] px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#65e5f2]" />
      </label>
      <label className="grid gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/55">
        Subject
        <input name="subject" required minLength={3} maxLength={140} className="border border-white/15 bg-white/[0.03] px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#65e5f2]" />
      </label>
      <label className="grid gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-white/55">
        Message
        <textarea name="message" required minLength={10} maxLength={5000} rows={4} className="resize-y border border-white/15 bg-white/[0.03] px-3 py-2.5 font-sans text-sm normal-case tracking-normal text-white outline-none focus:border-[#65e5f2]" />
      </label>
      <label className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        Leave this field empty
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button type="submit" disabled={state === "sending"} className="mt-1 inline-flex w-max items-center gap-2 bg-[#65e5f2] px-4 py-3 font-mono text-[9px] uppercase tracking-[0.12em] text-[#061017] disabled:cursor-wait disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Send message"} <ArrowUpRight size={13} />
      </button>
      {message && <p role="status" className={`font-mono text-[9px] leading-5 ${state === "error" ? "text-rose-300" : "text-[#65e5f2]"}`}>{message}</p>}
    </form>
  );
}
