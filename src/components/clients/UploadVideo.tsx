"use-client";

import { useState } from "react";
import { DiVim } from "react-icons/di";
import { FiUpload } from "react-icons/fi";
import { set } from "zod/v4";
import type { Ananlysis } from "./Inference";

interface UploadVideoProps {
  apiKey: string;
  onAnalysis: (analysis: Ananlysis) => void;
}

function UploadVideo({ apiKey, onAnalysis }: UploadVideoProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "analysing">(
    "idle",
  );
 
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setStatus("uploading");
      setError(null);
      const fileType = `.${file.name.split(".").pop()}`;

      // 1. Get upload URL
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileType: fileType }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error?.error || "Failed to get upload URL");
      }

      const { url, fileId, key } = await res.json();

      // 2. Upload file to S3
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file.type,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload file");
      }

      setStatus("analysing");

      // 3. Analyze video
      const analysisRes = await fetch("/api/sentiment-inference", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });
      if (!analysisRes.ok) {
        const error = await analysisRes.json();
        throw new Error(error?.error || "Failed to analyze video");
      }

      const analysis = await analysisRes.json();
      console.log("Analysis result:", analysis);
      onAnalysis(analysis);

      setStatus("idle");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    }
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-10">
        <input
          type="file"
          accept="video/quicktime,video/mp4,video/avi"
          className="hidden"
          id="video-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              handleUpload(file);
            }
          }}
        />
        <label
          htmlFor="video-upload"
          className="flex h-20 w-full cursor-pointer flex-col items-center"
        >
          <FiUpload className="h-8 w-8 text-gray-500" />
          <h3 className="text-md mt-2 w-30 text-slate-800">
            {status === "uploading"
              ? "Uploading..."
              : status === "analysing"
                ? "Analysing..."
                : "Upload a Video"}
          </h3>
          <p className="text-center text-xs text-gray-500">
            Get started with sentiment direction by uploading a video
          </p>
        </label>
      </div>
      {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
  );
}

export default UploadVideo;
