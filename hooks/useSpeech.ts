"use client";

import { useState, useEffect } from "react";

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  const speak = (text: string) => {
    if (!isSupported || !text) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    // Strip markdown formatting for cleaner audio narration
    const cleanText = text
      .replace(/#+\s+/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`{1,3}[^`]*`{1,3}/g, "code block")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\$\$[\s\S]*?\$\$/g, "mathematical equation")
      .replace(/\$[^$]*\$/g, "equation");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    if (isSupported) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return { isSpeaking, isSupported, speak, stop };
}
