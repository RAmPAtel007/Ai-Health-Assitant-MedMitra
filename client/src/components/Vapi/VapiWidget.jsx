import React, { useEffect } from "react";
import "./VapiWidget.css";

export default function VapiWidget() {
  // 1. Load the Vapi Script
  useEffect(() => {
    if (document.getElementById("vapi-script")) return;

    const script = document.createElement("script");
    script.id = "vapi-script";
    script.src = "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
    script.async = true;
    script.onload = () => console.log("✅ Vapi script loaded");
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {/* 2. Render the Real Vapi Widgets 
        We removed the wrapper that was hiding them. 
        Now the default Vapi bubbles will appear.
      */}
      
      <vapi-widget
        public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"
        assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"
        mode="chat"
        theme="dark"
        title="Chat with Medmitra"
        position="bottom-right"
      ></vapi-widget>

      <vapi-widget
        public-key="62ff7d1e-8f8c-4ef8-8aaf-2244c3d76eb4"
        assistant-id="74f2e57b-87d3-419f-8c88-daad57c4ec05"
        mode="voice"
        theme="dark"
        title="Talk with Medmitra"
        position="bottom-left"
      ></vapi-widget>
    </>
  );
}