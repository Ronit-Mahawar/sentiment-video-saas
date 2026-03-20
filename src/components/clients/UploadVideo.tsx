"use-client"

import { useState } from "react"
import { DiVim } from "react-icons/di";
import { FiUpload } from "react-icons/fi";

interface UploadVideoProps{
  apiKey:string,
}

function UploadVideo({apiKey}:UploadVideoProps){
  const [state,setState]= useState<"idle"| "uploading" | "analysing">("idle")

  const [error,setError] = useState<string | null>("hello")

  const handleUpload=async (file:File) => {};

  return <div className="flex w-full flex-col gap-2 ">
    <div className="flex cursor-pointer flex-col items-center justify-center  gap-2 rounded-xl border border-dashed border-gray-300 p-10 ">
       <input type="file" accept="video/mov,video/mp4,video/avi" className="hidden" id="video-upload"  onChange={(e) => {
        const file = e.target.files?.[0];
        if(file){
          handleUpload(file)
        }
       }} />
      <label htmlFor="video-upload" className="flex cursor-pointer h-20 w-full flex-col items-center ">
        <FiUpload className="h-8 w-8 text-gray-500" />
        <h3 className=" text-md w-30 mt-2 text-slate-800">{status=== "uploading" ? "Uploading..." : status=== "analysing" ? "Analysing..." : "Upload a Video"}</h3>
        <p className="text-xs text-center text-gray-500">Get started with sentiment direction by uploading a video</p>
      </label>
      

    </div>
    {error && <div className="text-xs text-red-500">{error}</div>}
    </div>
}

export default UploadVideo;
