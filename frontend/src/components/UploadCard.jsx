import {
    FiSearch,
    FiRefreshCw,
    FiLoader,
    FiDownload,
    FiCheckCircle,
    FiUploadCloud
} from "react-icons/fi";
import { toast } from "react-toastify";
import WebcamCapture from "./WebcamCapture";
import { useState, useRef } from "react";
import api from "../services/api";
import DetectionTable from "./DetectionTable";
import "./UploadCard.css";
import SummaryCards from "./SummaryCards";
import UploadBox from "./UploadBox";
import InspectionReport from "./InspectionReport";


function UploadCard() {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
    

    const handleReset = () => {

    setFile(null);

    setPreview(null);

    setResult(null);

    setLoading(false);
    
    if(fileInputRef.current){

        fileInputRef.current.value="";

    }

  };
  
  const handleCapture = async (imageSrc) => {

    setPreview(imageSrc);

    // Convert Base64 to Blob
    const response = await fetch(imageSrc);

    const blob = await response.blob();

    // Create File object
    const capturedFile = new File(
        [blob],
        "captured_pcb.jpg",
        {
            type: "image/jpeg",
        }
    );

    setFile(capturedFile);

};


    const handleUpload = async () => {
  if (!file) {
   toast.error("Please select an image first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    setLoading(true);

    const response = await api.post("/predict", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
      

    setResult(response.data);
    toast.success("PCB analyzed successfully.");
  } catch (error) {
    console.error(error);
   toast.error("Prediction failed.");
  } finally {
    setLoading(false);
  }
};

  return (
  
      <div className="upload-card">
          
          <h2 className="upload-title">
    <FiUploadCloud className="upload-title-icon" />Upload PCB Image
          </h2>
     

        <UploadBox

    file={file}

    onFileChange={(e)=>{

        const selectedFile=e.target.files[0];

        setFile(selectedFile);

        if(selectedFile){

            setPreview(URL.createObjectURL(selectedFile));

        }

    }}

/>
{showWebcam && (
    <WebcamCapture
        onCapture={handleCapture}
        onClose={() => setShowWebcam(false)}
    />
      )}


{!showWebcam && (
<button
    onClick={() => setShowWebcam(true)} className="open-webcam-btn"
>
    📷 Open Webcam
</button>
)}

<button
            onClick={handleUpload}
            className="detect-btn"
            disabled={loading}
      >
     {loading ? (
        <>
            <FiLoader className="spin" />
            {" "}Analyzing PCB...
        </>
        ) : (
        <>
            <FiSearch />
            {" "}Analyze PCB
                  </>
            )}
          </button>
          
     
      

{preview && (
        <div className="comparison">
    {/* Original Image */}
    <div className="image-card">
      <h3 className="image-title">Original Image</h3>

     <img
    src={preview}
    alt="Original"
    className="preview-image"
    />
    </div>

    {/* Detection Result */}
    {result && (
      <div className="image-card">
       <h3 className="image-title">
            Detection Result
        </h3>

       <img
        src={result.result_image_url}
        alt="Prediction"
        className="result-image"
        />
      </div>
    )}
  </div>
          )}
          
          

{result && (
              <div className="result-section">
                    <SummaryCards result={result} />
                  <h3>
                      Prediction Completed
    <FiCheckCircle
        style={{
            color: "#22c55e",
            marginLeft: 8,
            verticalAlign: "middle"
        }}
    />
        </h3>


    <InspectionReport
    analysis={result.analysis}
    detections={result.detections}
    imageUrl={result.result_image_url}
    />
    <DetectionTable detections={result.detections} />
                  
    <div className="action-buttons">
    <button
    className="reset-btn"
    onClick={handleReset}
                      >
                          <>
    <FiRefreshCw />
    {" "}Analyze Another
    </>
</button>

    <a
        href={result.result_image_url}
        download
        className="download-btn"
    >
        <>
    <FiDownload />
    {" "}Download Result
    </>
                      </a>
</div>

  </div>
)}
    </div>
  );
}

export default UploadCard;

