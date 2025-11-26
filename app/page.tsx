"use client";

import { useState } from "react";
import ServiceBusParser from "./parser";

const App = () => {
  const [xmlInput, setXmlInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<string>("");

  const handleTransform = () => {
    try {
      const parser = new ServiceBusParser();
      const result = parser.parseXML(xmlInput);
      setJsonOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error("Error transforming XML:", error);
      setJsonOutput("Error transforming XML. Please check your input.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(jsonOutput)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Service Bus Emulator Config Generator
      </h1>
      <p className="max-w-5xl text-lg text-gray-700 mb-6">
        Export your Service Bus entities using Service Bus Explorer and save the
        file. Copy the contents of the saved XML file and paste it into the left
        box. Click &quot;Transform&quot; to generate a JSON configuration file
        that can be used to set up Service Bus emulator queues and topics.
      </p>
      <div className="w-full max-w-7xl grid grid-cols-2 gap-6">
        {/* XML Input Section */}
        <div className="flex flex-col">
          <label
            htmlFor="xml-input"
            className="text-xl font-semibold text-gray-900 mb-3"
          >
            XML Input
          </label>
          <textarea
            id="xml-input"
            className="w-full h-[500px] p-5 text-black text-lg border border-gray-400 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your XML here..."
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
          />
        </div>

        {/* JSON Output Section */}
        <div className="flex flex-col">
          <label
            htmlFor="json-output"
            className="text-xl font-semibold text-gray-900 mb-3"
          >
            JSON Output
          </label>
          <div className="relative">
            <pre
              id="json-output"
              className="w-full h-[500px] p-5 text-black text-lg bg-gray-50 border border-gray-400 rounded-lg shadow-lg overflow-auto"
            >
              {jsonOutput || "The transformed JSON will appear here."}
            </pre>
            {jsonOutput && (
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Copy
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleTransform}
        className="mt-4 px-8 py-3 bg-blue-700 text-white text-lg rounded-lg hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Transform
      </button>
      <p className="text-black mt-6">
        Disclaimer: This tool is for development purposes and my own personal
        use only. Use it at your own risk.
      </p>
    </div>
  );
};
export default App;
