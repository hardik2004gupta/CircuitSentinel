import { useRef, useState } from "react";
import { FiUploadCloud, FiX, FiImage } from "react-icons/fi";
import "./UploadZone.css";

function UploadZone({ file, onFileChange, onRemove }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onFileChange(dropped);
  };

  const handleChange = (e) => {
    const selected = e.target.files[0];
    if (selected) onFileChange(selected);
  };

  if (file) {
    return (
      <div className="upload-zone upload-zone--selected animate-fade-in">
        <div className="upload-zone__file">
          <FiImage size={20} className="upload-zone__file-icon" />
          <div className="upload-zone__file-info">
            <span className="upload-zone__file-name">{file.name}</span>
            <span className="upload-zone__file-size mono">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <button
            className="upload-zone__remove"
            onClick={onRemove}
            aria-label="Remove file"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone ${dragging ? "upload-zone--drag" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload PCB image"
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <div className="upload-zone__content">
        <div className="upload-zone__icon">
          <FiUploadCloud size={28} />
        </div>
        <div className="upload-zone__text">
          <span className="upload-zone__primary">
            {dragging ? "Release to upload" : "Drop PCB image here"}
          </span>
          <span className="upload-zone__secondary">
            or click to browse
          </span>
        </div>
        <div className="upload-zone__formats mono">
          JPG · JPEG · PNG
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        onChange={handleChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}

export default UploadZone;
