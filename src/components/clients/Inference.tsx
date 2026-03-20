"use client"

import UploadVideo from "./UploadVideo"

interface InferenceProps{
  quota:{
    secretKey:string,
  }
}

export function Inference({quota} :InferenceProps){
  return  <div className="flex h-fit w-full flex-col gap-3 md:w-1/2">
    <h2 className="text-lg font-medium text-slate-800">Inference</h2>
    <UploadVideo apiKey={quota.secretKey}/>
   


    </div>
}