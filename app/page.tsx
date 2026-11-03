export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#08090d",
      color: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "10%",
      fontFamily: "Arial, sans-serif"
    }}>
      <p style={{ color: "#888" }}>
        AI ENGINEER / GENERATIVE AI DEVELOPER
      </p>

      <h1 style={{ fontSize: "clamp(48px, 9vw, 110px)" }}>
        Hi, Im Ashish.
      </h1>

      <h2 style={{ color: "#aaa" }}>
        Building Intelligent Systems That Think, Reason & Act.
      </h2>

      <p style={{ color: "#888", maxWidth: "600px" }}>
        I build AI-powered applications using Python, LLMs,
        RAG, LangGraph, MCP and modern web technologies.
      </p>

      <a
        href="#projects"
        style={{
          color: "white",
          marginTop: "30px",
          textDecoration: "none"
        }}
      >
        Explore My Work →
      </a>

      <section id="projects" style={{ marginTop: "100px" }}>
        <h2>Featured Projects</h2>
        <p>PATREXO — Agentic Business Operations</p>
        <p>KARYA AI — Sovereign Agentic AI Workbench</p>
        <p>OGI RIDE — Smart College Transport Platform</p>
      </section>
    </main>
  );
}