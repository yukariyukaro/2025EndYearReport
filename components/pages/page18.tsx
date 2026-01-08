"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page18.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page18() {
  const PAGE_NUMBER = 18;
  const { appendNextPage } = usePageManager();
  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 100;
    const rowDelay = 300; 
    const stepDelay = 80; // Faster individual item delay
    
    // Row 1
    const row1 = document.querySelectorAll('.emoji-row-1 .emoji');
    row1.forEach((_, i) => {
        reveal(`.emoji-row-1 .emoji:nth-child(${i + 1})`, t + i * stepDelay);
    });

    // Row 2
    t += rowDelay;
    const row2 = document.querySelectorAll('.emoji-row-2 .emoji');
    row2.forEach((_, i) => {
        reveal(`.emoji-row-2 .emoji:nth-child(${i + 1})`, t + i * stepDelay);
    });

    t += row2.length * stepDelay + 200;

    const step = 200;
    reveal('.October_face', t += step);
    reveal('.page18-cta', t += step);
    reveal('.PlayButton', t += step);

    const hintTimer = setTimeout(() => setShowHint(true), t + 800);
    addTimer(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

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
    "Birthday.png"
  ];

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ backgroundImage: 'url("imgs/page18/background.png")' }}>
        <div className={styles.topArea}>
          {/* Row 1 */}
          <div className={`emoji-row-1 ${styles.topEmojiRow}`}>
            {Array.from({ length: 6 }).map((_, i) => {
              const file = emojiFiles[i % emojiFiles.length];
              const isFacemask = file === "facemask.png";
              return (
                <div 
                  key={`r1-${i}`} 
                  // Use global hide and fromLeft (or fromFade)
                  className={`emoji hide fromLeft ${styles.bigEmoji} ${isFacemask ? styles.facemask : ""}`}
                >
                  <Image 
                    src={`imgs/page18/${encodeURIComponent(file)}`} 
                    alt={file} 
                    width={64} 
                    height={64} 
                    priority={isFacemask}
                  />
                </div>
              );
            })}
          </div>

          {/* Row 2 */}
          <div className={`emoji-row-2 ${styles.topEmojiRow}`}>
            {Array.from({ length: 6 }).map((_, i) => {
              const file = emojiFiles[(i + 6) % emojiFiles.length];
              const isFacemask = file === "facemask.png";
              return (
                <div 
                  key={`r2-${i}`} 
                  className={`emoji hide fromLeft ${styles.bigEmoji} ${isFacemask ? styles.facemask : ""}`}
                >
                  <Image 
                    src={`imgs/page18/${encodeURIComponent(file)}`} 
                    alt={file} 
                    width={64} 
                    height={64} 
                  />
                </div>
              );
            })}
          </div>

          <div className={`October_face hide ${styles.octoberFaceWrap}`}>
            <Image src="imgs/page18/October_face.png" alt="October face" width={260} height={430} />
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={`page18-cta hide ${styles.cta}`}>查看我的emoji年度表情包</div>

          <div className={`PlayButton hide ${styles.playWrap}`}>
            <div className={styles.playIcon} />
            <Image src="imgs/page18/button.png" alt="Button" width={200} height={100} />
            <Image src="imgs/page18/Vector.png" alt="Vector" width={50} height={90} />
          </div>
        </div>

        {showHint && (
          <div className="fade-in">
            <ScrollUpHint />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
