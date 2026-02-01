const steps = [
  "Choose Expert",
  "Instant Connect",
  "Secure Chat",
  "Get Solution",
];

export default function HowItWorks() {
  return (
    <section className="section-howitworks">
      <h2>How It Works</h2>
      <div className="steps">
        {steps.map((step, i) => (
          <div className="step-card" key={i}>
            <div className="step-num">{i + 1}</div>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
