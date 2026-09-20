import "./AnalysisState.css";

const STAGES = [
  { label: "Image Preprocessing",   key: "prep" },
  { label: "Model Initialization",  key: "init" },
  { label: "Object Detection",      key: "detect" },
  { label: "Defect Classification", key: "classify" },
  { label: "Report Generation",     key: "report" },
];

function AnalysisState({ preview }) {
  return (
    <div className="analysis-state animate-fade-in">
      <div className="analysis-state__viewer">
        {preview && (
          <img src={preview} alt="PCB being analyzed" className="analysis-state__img" />
        )}
        <div className="analysis-state__scan" />
        <div className="analysis-state__vignette" />
        <div className="analysis-state__label mono">ANALYZING</div>
      </div>

      <div className="analysis-state__stages">
        <div className="analysis-state__stages-title mono">INSPECTION PIPELINE</div>
        {STAGES.map((stage, i) => (
          <StageRow key={stage.key} label={stage.label} index={i} total={STAGES.length} />
        ))}
      </div>
    </div>
  );
}

function StageRow({ label, index, total }) {
  const delay = index * 0.55;
  const state = index < total - 2 ? "done" : index === total - 2 ? "active" : "pending";

  return (
    <div
      className={`analysis-stage analysis-stage--${state}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="analysis-stage__label">{label}</span>
      <span className={`analysis-stage__indicator mono`}>
        {state === "done"   ? "✓" : state === "active" ? "●" : "—"}
      </span>
    </div>
  );
}

export default AnalysisState;
