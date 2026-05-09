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
  utterances: Array<{
    start_time: number;
    end_time: number;
    text: string;
    emotions: Array<{label: string; confidence: number}>;
    sentiments : Array<{label: string; confidence: number}>;
  }>;
}

export function Inference({ quota }: InferenceProps) {
  const [analysis, setAnalysis] = useState<Ananlysis | null>(
    {
      utterances: [
        {
          start_time: 0,
          end_time: 5,
          text: "Hello everyone, welcome to today's presentation.",
          emotions: [
            { label: "joy", confidence: 0.72 },
            { label: "neutral", confidence: 0.25 },
          ],
          sentiments: [
            { label: "positive", confidence: 0.68 },
            { label: "neutral", confidence: 0.20 },
          ],
        },
        {
          start_time: 5,
          end_time: 10,
          text: "I'm really excited to share this new product with you all.",
          emotions: [
            { label: "joy", confidence: 0.85 },
            { label: "surprise", confidence: 0.12 },
          ],
          sentiments: [
            { label: "positive", confidence: 0.91 },
          ],
        },
        {
          start_time: 10,
          end_time: 15,
          text: "However, we did encounter some challenges during development.",
          emotions: [
            { label: "fear", confidence: 0.34 },
            { label: "sadness", confidence: 0.28 },
            { label: "neutral", confidence: 0.35 },
          ],
          sentiments: [
            { label: "negative", confidence: 0.45 },
            { label: "neutral", confidence: 0.40 },
          ],
        },
        {
          start_time: 15,
          end_time: 20,
          text: "The team worked really hard to overcome these obstacles.",
          emotions: [
            { label: "joy", confidence: 0.55 },
            { label: "neutral", confidence: 0.30 },
          ],
          sentiments: [
            { label: "positive", confidence: 0.62 },
            { label: "neutral", confidence: 0.25 },
          ],
        },
        {
          start_time: 20,
          end_time: 25,
          text: "Thank you for your attention.",
          emotions: [
            { label: "neutral", confidence: 0.65 },
            { label: "joy", confidence: 0.30 },
          ],
          sentiments: [
            { label: "positive", confidence: 0.58 },
            { label: "neutral", confidence: 0.35 },
          ],
        },
      ],
    }
  );



  const getAverageScore = () => {
    if(!analysis?.utterances.length) return null;

    // Agregate all score 
     const emotionScores: Record<string, number[]> = {};
     const sentimentScores: Record<string, number[]> = {};

      analysis.utterances.forEach((utterance)=>{
        utterance.emotions.forEach((emotion)=>{    
          if(!emotionScores[emotion.label]) emotionScores[emotion.label] = [];
          emotionScores[emotion.label]!.push(emotion.confidence);

        })
        utterance.sentiments.forEach((sentiment)=>{    
          if(!sentimentScores[sentiment.label]) sentimentScores[sentiment.label] = [];
          sentimentScores[sentiment.label]!.push(sentiment.confidence);

        })
      })

      //Calculate average
      const avgEmotions = Object.entries(emotionScores).map(
        ([label, scores])=>({
          label,
          confidence: scores.reduce((a,b)=>a+b,0)/scores.length,
        }),
      ); 
      const avgSentiments = Object.entries(sentimentScores).map(
        ([label, scores])=>({
          label,
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
      {averages ? (
        <div className="flex h-fit w-full flex-wrap items-center justify-center gap-4 rounded-xl border border-gray-200 p-4 sm:gap-8 sm:px-6">
          <div className="flex flex-col items-center">
            <span className="text-sm">Primary emotions</span>
            <span className="text-[40px]">{EMOTION_EMOJI[averages?.topEmotion?.label!]}</span>
            <span className="text-sm text-gray-500">{averages?.topEmotion?.confidence.toFixed(3)}({(averages?.topEmotion?.confidence! * 100).toFixed(2)}%)</span>


          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm">Primary sentiments</span>
            <span className="text-[40px]">{SENTIMENT_EMOJI[averages?.topSentiment?.label!]}</span>
            <span className="text-sm text-gray-500">{averages?.topSentiment?.confidence}({(averages?.topSentiment?.confidence! * 100).toFixed(2)}%)</span>


          </div>
        </div>
      ) :(
        <div className=" flex h-32 w-full items-center justify-center rounded-xl border border-dashed">
          <span className="text-sm text-gray-400">Upload a video to see overall analysis</span>
        </div>
      )}
      <h2 className="mt-2 text-sm text-slate-800">Analysis of Utterances</h2>
      {analysis ? (
        <div className="flex flex-col gap-2">
          {analysis?.utterances.map((utterance, i) => {
            return (
              <div
                key={
                  utterance.start_time.toString() +
                  utterance.end_time.toString()
                }
                className="flex h-fit w-full flex-wrap justify-between gap-8 rounded-xl border border-gray-200 px-6 py-4 sm:gap-4"
              >
                {/* Time and text */}
                <div className="flex w-full max-w-24 flex-col justify-center">
                  <div className="text-sm font-semibold">
                    {Number(utterance.start_time).toFixed(1)} -{" "}
                    {Number(utterance.end_time).toFixed(1)}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {utterance.text}
                  </div>
                </div>

                {/* Emotions */}
                <div className="flex w-full max-w-48 flex-col gap-2">
                  <span className="text-sm font-medium">Emotions</span>
                  {utterance.emotions.map((emo, i) => {
                    return (
                      <div key={emo.label} className="flex items-center gap-2">
                        <span className="w-16 whitespace-nowrap text-xs text-gray-500">
                          {EMOTION_EMOJI[emo.label]} {emo.label}
                        </span>
                        <div className="flex-1">
                          <div className="h-1 w-full rounded-full bg-gray-100">
                            <div
                              style={{ width: `${emo.confidence * 100}%` }}
                              className="h-1 rounded-full bg-gray-800"
                            ></div>
                          </div>
                          <span className="w-8 text-right text-xs">
                            {(emo.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sentiments */}
                <div className="flex w-full max-w-48 flex-col gap-2">
                  <span className="text-sm font-medium">Sentiments</span>
                  {utterance.sentiments.map((sentiment, i) => {
                    return (
                      <div
                        key={sentiment.label}
                        className="flex items-center gap-2"
                      >
                        <span className="w-16 whitespace-nowrap text-xs text-gray-500">
                          {SENTIMENT_EMOJI[sentiment.label]} {sentiment.label}
                        </span>
                        <div className="flex-1">
                          <div className="h-1 w-full rounded-full bg-gray-100">
                            <div
                              style={{
                                width: `${sentiment.confidence * 100}%`,
                              }}
                              className="h-1 rounded-full bg-gray-800"
                            ></div>
                          </div>
                          <span className="w-8 text-right text-xs">
                            {(sentiment.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) :(
        <div className=" flex h-32 w-full items-center justify-center rounded-xl border border-dashed">
          <span className="text-sm text-gray-400">Upload a video to see analysis results</span>
        </div>
      )}

      

    </div>
  );
}
