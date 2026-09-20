import "./InspectionSummary.css";

function InspectionSummary({ result }) {
  if (!result) return null;

  const { analysis } = result;
  const status = analysis.inspection_status;

  const statusClass =
    status === "PASS" ? "pass"
    : status === "FAIL" ? "fail"
    : "review";

  return (
    <div className="insp-summary animate-fade-in">
      <div className="insp-summary__stats">
        <div className="insp-stat">
          <span className="insp-stat__value mono">{analysis.total_defects}</span>
          <span className="insp-stat__label">Total Defects</span>
        </div>
        <div className="insp-stat">
          <span className="insp-stat__value mono">{analysis.highest_confidence}%</span>
          <span className="insp-stat__label">Peak Confidence</span>
        </div>
        <div className="insp-stat">
          <span className="insp-stat__value mono">{analysis.average_confidence}%</span>
          <span className="insp-stat__label">Avg Confidence</span>
        </div>
        <div className={`insp-stat insp-stat--status insp-stat--${statusClass}`}>
          <span className="insp-stat__value mono">{status}</span>
          <span className="insp-stat__label">Inspection Result</span>
        </div>
      </div>

      <div className="insp-summary__meta">
        <div className="insp-meta-row">
          <span className="insp-meta-key mono">ID</span>
          <span className="insp-meta-val mono">{analysis.inspection_id}</span>
        </div>
        <div className="insp-meta-row">
          <span className="insp-meta-key mono">Timestamp</span>
          <span className="insp-meta-val mono">{analysis.timestamp}</span>
        </div>
        <div className="insp-meta-row">
          <span className="insp-meta-key mono">Model</span>
          <span className="insp-meta-val mono">YOLOv8</span>
        </div>
        <div className="insp-meta-row">
          <span className="insp-meta-key mono">File</span>
          <span className="insp-meta-val mono">{analysis.filename}</span>
        </div>
      </div>
    </div>
  );
}

export default InspectionSummary;
