import { FiActivity } from "react-icons/fi";
import "./Header.css";

function Header({ apiStatus }) {
  return (
    <header className="cs-header">
      <div className="cs-header__inner">

        <div className="cs-header__brand">
          <div className="cs-header__logo">
            <FiActivity size={18} />
          </div>
          <div>
            <div className="cs-header__title">CircuitSentinel</div>
            <div className="cs-header__sub">AI Vision Inspection System</div>
          </div>
        </div>

        <div className="cs-header__meta">
          <div className="cs-header__meta-item">
            <span className="cs-header__meta-label">Model</span>
            <span className="cs-header__meta-value mono">YOLOv8</span>
          </div>
          <div className="cs-header__meta-item">
            <span className="cs-header__meta-label">Status</span>
            <span className={`cs-header__status-dot ${apiStatus === 'online' ? 'online' : apiStatus === 'offline' ? 'offline' : 'checking'}`} />
            <span className="cs-header__meta-value mono">
              {apiStatus === 'online' ? 'ONLINE' : apiStatus === 'offline' ? 'OFFLINE' : 'CHECKING'}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Header;
