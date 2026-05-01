"use client";

import { useState, useEffect } from "react";
import UploadVideo from "./UploadVideo";
import { negative } from "zod/v4";

const EMOTION_EMOJI: Record<string, string> = {
  anger: "😠",
  disjust: "🤢",
  fear: "😨",
  joy: "😄" ,
  neutral: "😐",
  sadness: "😢",
  surprise: "😲",
}
const SENTIMENT_EMOJI: Record<string, string> = {
  negative: "👎",
  neutral: "😐",
  positive: "👍",
}


interface InferenceProps {
  quota: {
    secretKey: string;
  };
}

export type Ananlysis = {
  utternces: Array<{
    start_time: number;
    end_time: number;
    text: string;
    emotions: Array<{lable: string; confidence: number}>;
    sentiments : Array<{lable: string; confidence: number}>;
  }>;
}

export function Inference({ quota }: InferenceProps) {
  const [analysis, setAnalysis] = useState<Ananlysis | null>(
    {
      utternces: [
        {
          start_time: 0,
          end_time: 5,
          text: "Hello everyone, welcome to today's presentation.",
          emotions: [
            { lable: "joy", confidence: 0.72 },
            { lable: "neutral", confidence: 0.25 },
          ],
          sentiments: [
            { lable: "positive", confidence: 0.68 },
            { lable: "neutral", confidence: 0.20 },
          ],
        },
        {
          start_time: 5,
          end_time: 10,
          text: "I'm really excited to share this new product with you all.",
          emotions: [
            { lable: "joy", confidence: 0.85 },
            { lable: "surprise", confidence: 0.12 },
          ],
          sentiments: [
            { lable: "positive", confidence: 0.91 },
          ],
        },
        {
          start_time: 10,
          end_time: 15,
          text: "However, we did encounter some challenges during development.",
          emotions: [
            { lable: "fear", confidence: 0.34 },
            { lable: "sadness", confidence: 0.28 },
            { lable: "neutral", confidence: 0.35 },
          ],
          sentiments: [
            { lable: "negative", confidence: 0.45 },
            { lable: "neutral", confidence: 0.40 },
          ],
        },
        {
          start_time: 15,
          end_time: 20,
          text: "The team worked really hard to overcome these obstacles.",
          emotions: [
            { lable: "joy", confidence: 0.55 },
            { lable: "neutral", confidence: 0.30 },
          ],
          sentiments: [
            { lable: "positive", confidence: 0.62 },
            { lable: "neutral", confidence: 0.25 },
          ],
        },
        {
          start_time: 20,
          end_time: 25,
          text: "Thank you for your attention.",
          emotions: [
            { lable: "neutral", confidence: 0.65 },
            { lable: "joy", confidence: 0.30 },
          ],
          sentiments: [
            { lable: "positive", confidence: 0.58 },
            { lable: "neutral", confidence: 0.35 },
          ],
        },
      ],
    }
  );



  const getAverageScore = () => {
    if(!analysis?.utternces.length) return null;

    // Agregate all score 
     const emotionScores: Record<string, number[]> = {};
     const sentimentScores: Record<string, number[]> = {};

      analysis.utternces.forEach((utterene)=>{
        utterene.emotions.forEach((emotion)=>{    
          if(!emotionScores[emotion.lable]) emotionScores[emotion.lable] = [];
          emotionScores[emotion.lable]!.push(emotion.confidence);

        })
        utterene.sentiments.forEach((sentiment)=>{    
          if(!sentimentScores[sentiment.lable]) sentimentScores[sentiment.lable] = [];
          sentimentScores[sentiment.lable]!.push(sentiment.confidence);

        })
      })

      //Calculate average
      const avgEmotions = Object.entries(emotionScores).map(
        ([lable, scores])=>({
          lable,
          confidence: scores.reduce((a,b)=>a+b,0)/scores.length,
        }),
      ); 
      const avgSentiments = Object.entries(sentimentScores).map(
        ([lable, scores])=>({
          lable,
          confidence: scores.reduce((a,b)=>a+b,0)/scores.length,
        }),
      ); 
      // sort by confidence ,get top score
      const topEmotion = avgEmotions.sort((a,b)=>b.confidence - a.confidence)[0];
      const topSentiment = avgSentiments.sort((a,b)=>b.confidence - a.confidence)[0];

      return {
        topEmotion: topEmotion,
        topSentiment: topSentiment,
      };
       

  };
   
  const averages = getAverageScore();
  return (
    <div className="flex h-fit w-full flex-col gap-3 md:w-1/2">
      <h2 className="text-lg font-medium text-slate-800">Inference</h2>
      <UploadVideo onAnalysis={setAnalysis} apiKey={quota.secretKey} />
      <h2 className="mt-2 text-sm text-slate-800">Overall Analysis</h2>
      {true ? (
        <div className="flex h-fit w-full flex-wrap items-center justify-center gap-4 rounded-xl border border-gray-200 p-4 sm:gap-8 sm:px-6">
          <div className="flex flex-col items-center">
            <span className="text-sm">Primary emotions</span>
            <span className="text-[40px]">{EMOTION_EMOJI[averages?.topEmotion?.lable!]}</span>
            <span className="text-sm text-gray-500">{averages?.topEmotion?.confidence.toFixed(3)}({(averages?.topEmotion?.confidence! * 100).toFixed(2)}%)</span>


          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">Primary sentiments</span>
            <span className="text-[40px]">{SENTIMENT_EMOJI[averages?.topSentiment?.lable!]}</span>
            <span className="text-sm text-gray-500">{averages?.topSentiment?.confidence}({(averages?.topSentiment?.confidence! * 100).toFixed(2)}%)</span>


          </div>
        </div>
      ) :(
        <div className=" flex h-32 w-full items-center justify-center rounded-xl border border-dashed">
          <span className="text-sm text-gray-400">Upload a video to see overall analysis</span>
        </div>
      )}
      
      

    </div>
  );
}
