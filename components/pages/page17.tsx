"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page17.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page17() {
  const PAGE_NUMBER = 17;
  const { appendNextPage } = usePageManager();
  const [showHint, setShowHint] = useState(false);
  const [capsuleOpened, setCapsuleOpened] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);
    setCapsuleOpened(false);
    setIsWarping(false);

    let t = 100;

    const rowDelay = 300;
    const stepDelay = 80;

    const row1 = document.querySelectorAll(".emoji-row-1 .emoji");
    row1.forEach((_, i) => {
      reveal(`.emoji-row-1 .emoji:nth-child(${i + 1})`, t + i * stepDelay);
    });

    t += rowDelay;
    const row2 = document.querySelectorAll(".emoji-row-2 .emoji");
    row2.forEach((_, i) => {
      reveal(`.emoji-row-2 .emoji:nth-child(${i + 1})`, t + i * stepDelay);
    });

    t += row2.length * stepDelay + 200;

    const step = 200;
    reveal(".October_face", (t += step));
    reveal(".page18-cta", (t += step));
    reveal(".PlayButton", (t += step));

    const hintTimer = setTimeout(() => setShowHint(true), t + 800);
    addTimer(hintTimer);
  }

  const handleCapsuleClick = () => {
    if (capsuleOpened) return; 
    setCapsuleOpened(true);
    
    // 1. Show Pause Button -> Wait -> 2. Trigger Warp -> Wait -> 3. Navigate
    const warpTimer = setTimeout(() => {
      setIsWarping(true);
      
      const navTimer = setTimeout(() => {
        appendNextPage(PAGE_NUMBER, true);
        
        // Cleanup after transition
        const cleanupTimer = setTimeout(() => {
             setIsWarping(false);
             setCapsuleOpened(false);
        }, 1000);
        addTimer(cleanupTimer);

      }, 800); // Wait for flash to fill screen
      addTimer(navTimer);

    }, 500); // Short delay to see the pause button change
    addTimer(warpTimer);
  };

  const emojiFiles = [
    "Laugh.png",
    "Pain.png",
    "Hello.png",
    "Bored.png",
    "Laugh.png",
    "Pain.png",
    "Bored.png",
    "Star.png",
    "To tears.png",
    "Birthday.png",
    "Bored.png",
    "Star.png",
    "To tears.png",
    "Birthday.png",
  ];

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ backgroundImage: 'url("imgs/page17/background.png")' }}>
        <div className={styles.topArea}>
          <div className={`emoji-row-1 ${styles.topEmojiRow}`}>
            {Array.from({ length: 6 }).map((_, i) => {
              const file = emojiFiles[i % emojiFiles.length];
              const isFacemask = file === "facemask.png";
              return (
                <div
                  key={`r1-${i}`}
                  className={`emoji hide fromLeft ${styles.bigEmoji} ${isFacemask ? styles.facemask : ""}`}
                >
                  <Image
                    src={`imgs/page17/${encodeURIComponent(file)}`}
                    alt={file}
                    width={64}
                    height={64}
                    priority={isFacemask}
                  />
                </div>
              );
            })}
          </div>

          <div className={`emoji-row-2 ${styles.topEmojiRow}`}>
            {Array.from({ length: 6 }).map((_, i) => {
              const file = emojiFiles[(i + 6) % emojiFiles.length];
              const isFacemask = file === "facemask.png";
              return (
                <div
                  key={`r2-${i}`}
                  className={`emoji hide fromLeft ${styles.bigEmoji} ${isFacemask ? styles.facemask : ""}`}
                >
                  <Image src={`imgs/page17/${encodeURIComponent(file)}`} alt={file} width={64} height={64} />
                </div>
              );
            })}
          </div>

          <div className={`October_face hide ${styles.octoberFaceWrap}`}>
            <Image src="imgs/page17/October_face.png" alt="October face" width={260} height={430} />
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={`page18-cta hide ${styles.cta}`}>查看我的emoji年度表情包</div>

          <div className={`PlayButton hide ${styles.playWrap}`}>
             {/* Replaced Image-based button with CSS Time Capsule Button */}
             <div 
                className={`${styles.playButtonWrapper} ${!capsuleOpened ? styles.pulseGlow : ""}`}
                onClick={handleCapsuleClick}
                data-next-ignore="true"
             >
                <div className={styles.playButton}>
                  <div className={styles.playIcon}>
                    {capsuleOpened ? (
                      <div className={styles.pauseIconCircle}>
                        <div className={styles.pauseBars}>
                          <div className={styles.pauseBar} />
                          <div className={styles.pauseBar} />
                        </div>
                      </div>
                    ) : (
                      <Image src="imgs/page7/PlayCircle.svg" alt="Play" fill /> 
                    )}
                  </div>
                </div>
                {/* Use page17 vector as arrow if possible, else fallback to page7 arrow */}
                <div className={styles.arrowDecor}>
                   <Image src="imgs/page17/Vector.png" alt="Vector" fill style={{objectFit: 'contain'}} />
                </div>
             </div>
          </div>
        </div>

        {/* Warp Overlay */}
        <div className={`${styles.warpOverlay} ${isWarping ? styles.warpActive : ""}`} />

        {showHint && !isWarping && (
          <div className="fade-in">
            <ScrollUpHint />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
