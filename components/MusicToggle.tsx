"use client";
import { useEffect, useState } from "react";

export default function MusicToggle() {
  const [playMusic, setPlayMusic] = useState(false); // Default to false to respect autoplay policy initially, or true if we handle failure gracefully
  // Let's stick to true but handle catch as existing code does. 
  // Actually, better to start false or check user interaction? 
  // Existing code starts true. Let's keep it true but make sure we handle the "not allowed" case.
  
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  useEffect(() => {
    const bgm = document.getElementById("bgm") as HTMLAudioElement | null;
    if (!bgm) return;
    
    // Attempt to play if state says so
    if (playMusic) {
      const playPromise = bgm.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Auto-play prevented:", error);
          // If autoplay prevented, we might want to set state to false to match reality,
          // OR just leave it true and wait for user interaction to unlock it.
          // Better: set to false so UI shows "off" and user clicks to turn "on".
          setPlayMusic(false);
        });
      }
    } else {
      bgm.pause();
    }
  }, [playMusic]);

  // Handle user interaction to unlock audio context if needed
  const toggleMusic = () => {
    setPlayMusic((prev) => !prev);
  };

  return (
    <div 
      className={`music-icon ${playMusic ? "music-playing" : ""}`} 
      onClick={toggleMusic}
    >
      <img
        src={`${basePath}/音乐.svg`}
        alt="music toggle"
      />
      {!playMusic && <div className="music-slash" />}
    </div>
  );
}

