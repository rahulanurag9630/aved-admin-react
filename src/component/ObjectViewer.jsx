// GLBViewer.js
import React from "react";

function ObjectViewer({ url }) {
    return (
        <model-viewer
            style={{ height: "50vh", width: "50vw" }}
            src={
                url ||
                "http://res.cloudinary.com/dxbatrtqt/image/upload/v1736857590/nzrswkxmd6oz6bagozy5.glb"
            }
            allow="*"
            ar
            ar-modes="webxr scene-viewer quick-look"
            camera-controls
            // poster={loading3d}
            shadow-intensity="1"
        // ref={(ref) => {
        //   modelRef.current = ref;
        // }}
        ></model-viewer>
    );
}

// A reusable component to load the GLB file

export default ObjectViewer;
