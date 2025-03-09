import React, { useState } from "react";
import axios from "axios";
import { MdCloudUpload } from "react-icons/md";
import { SiGoogledocs } from "react-icons/si";
import { FaRegFilePdf } from "react-icons/fa";

function getIconByFileType(extension) {
  if (extension.includes("doc"))
    return <SiGoogledocs size="40px" color="blue" />;
  if (extension.includes("pdf"))
    return <FaRegFilePdf size="40px" color="red" />;
  return <MdCloudUpload size="40px" color="gray" />;
}

function FileUpload({
  uploadUrl,
  onUploadComplete,
  onCancel,
  buttonText = "Upload",
  data = {},
}) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadProgress(0);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder_id", data.folder_id);

    try {
      setUploading(true);
      setMessage("");

      const response = await axios.post(uploadUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setMessage("Upload successful!");
      if (onUploadComplete) onUploadComplete(response.data);
    } catch (error) {
      setMessage("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="menu-file-upload-container">
      <span>Browse document</span>
      <div className="menu-file-upload-wrapper">
        <input type="file" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.txt,.docx,.docs" />
        <div className="menu-file-preview">
          {file ? (
            getIconByFileType(file.name.split(".").pop())
          ) : (
            <MdCloudUpload size="50px" />
          )}
          {file && (
            <div>
              <strong>{file.name}</strong>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="menu-progress-bar">
          <div
            className="menu-progress-fill"
            style={{ width: `${uploadProgress}%` }}
          />
          <div
            className="d-flex flex-end"
            style={{ textAlign: "right", marginTop: "10px" }}
          >
            {uploadProgress}% upload completed
          </div>
        </div>
      )}

      {message && <p className="menu-upload-message">{message}</p>}

      {/* Buttons */}
      <div className="menu-divider" />
      <div className="d-flex flex-end align-center gap-10">
        <button className="btn" onClick={onCancel} disabled={uploading}>
          Cancel
        </button>
        <button
          className={`btn btn-primary ${uploading && "disabled"}`}
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : buttonText}
        </button>
      </div>
    </div>
  );
}

export default FileUpload;
