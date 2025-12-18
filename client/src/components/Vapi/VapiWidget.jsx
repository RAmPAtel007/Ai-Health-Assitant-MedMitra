import { useEffect } from "react";

const VapiWidget = () => {
  useEffect(() => {
    if (document.getElementById("vapi-manual-container")) return;

    const container = document.createElement("div");
    container.id = "vapi-manual-container";
    
    Object.assign(container.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "999999", 
      pointerEvents: "none", 
    });

    container.innerHTML = `
      <style>
        vapi-widget {
          pointer-events: auto !important; 
          visibility: visible !important;
          opacity: 1 !important;
        }
      </style>

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
    `;

    document.body.appendChild(container);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};

export default VapiWidget;