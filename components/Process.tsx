const steps = [
  {
    number: "01",
    title: "DISCOVER",
    description: "Understand the problem, user context and the operational constraints that matter."
  },
  {
    number: "02",
    title: "ARCHITECT",
    description: "Design scalable systems, workflows and interfaces before engineering begins."
  },
  {
    number: "03",
    title: "ENGINEER",
    description: "Build the intelligence layers, backend systems and product interactions."
  },
  {
    number: "04",
    title: "INTEGRATE",
    description: "Connect tools, APIs, models and external systems into a reliable workflow."
  },
  {
    number: "05",
    title: "EVALUATE",
    description: "Test reliability, quality, performance and edge cases across real usage."
  },
  {
    number: "06",
    title: "ITERATE",
    description: "Refine the product through measurement, feedback and continuous improvement."
  }
];

export default function Process() {
  return (
    <section className="process-section">
      <div className="section-wrap">
        <div className="section-label">
          <span>05</span>
          <span>ENGINEERING PROCESS</span>
          <i />
        </div>

        <div className="process-header">
          <h2>
            From problem
            <br />
            <span>to production.</span>
          </h2>
        </div>

        <div className="process-grid">
          {steps.map((step) => (
            <div className="process-item" key={step.number}>
              <span className="process-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
