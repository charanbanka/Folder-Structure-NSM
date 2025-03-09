import React, { useState, useEffect } from "react";
import CircularProgressLoader from "../circularProgress";

const MyIframeComponent = ({ link }) => {
  const [iframeError, setIframeError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const iframe = document.getElementById("myIframeid");
    if (iframe) iframe.onerror = () => setIframeError(true);
  }, []);

  const handleIframeLoad = () => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (!link) {
    return (
      <div className="mt40 p-1 text-danger">Link Inavlid or Not Provided</div>
    );
  }

  return (
    <div className="mt40">
      {loading && <CircularProgressLoader align={"center"} />}
      {iframeError ? (
        <div className="p-1 text-danger">Unable to load content.</div>
      ) : (
        <iframe
          id="myIframeid"
          src={link}
          width="100%"
          height="600px"
          onLoad={handleIframeLoad}
          onError={() => setIframeError(true)}
          style={{ display: loading ? "none" : "block" }}
          allow="camera; microphone"
        ></iframe>
      )}
    </div>
  );
};

export default MyIframeComponent;
