"use client";
import React, { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import styles from "./styles/page13.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";
import ScrollUpHint from "@/components/ScrollUpHint";

export default function Page13() {
  const PAGE_NUMBER = 13;
  const { appendNextPage } = usePageManager();
  
  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const onShow = () => {
    clearTimers();
    setShowHint(false);
    // Animation sequence
    reveal(`.page13-reveal-1`, 300);  // Title "BONUS TIME"
    // Question Text
    reveal(`.page13-reveal-2-1`, 800);
    reveal(`.page13-reveal-2-2`, 1000);
    reveal(`.page13-reveal-2-3`, 1200);
    // Hint Text
    reveal(`.page13-reveal-3-1`, 1500);
    reveal(`.page13-reveal-3-2`, 1700);
    // Other elements
    reveal(`.page13-reveal-4`, 2000); // Arrow
    reveal(`.page13-reveal-5`, 2200); // Button
    reveal(`.page13-reveal-6`, 2400); // Footer

    const hintTimer = setTimeout(() => setShowHint(true), 3000);
    addTimer(hintTimer);
  };

  const handlePress = () => {
    // Navigate to next page or perform action
    appendNextPage(PAGE_NUMBER, true);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        {/* Background */}
        <div className={styles.background}>
          <Image
            src="imgs/page13/background.png"
            alt="Background"
            fill
            className={styles.backgroundImage}
            priority
          />
        </div>

        <div className={styles.content}>
          {/* Title Section */}
          <div className={styles.titleGroup}>
            <h1 className={`${styles.bonusText} hide page13-reveal-1`}>BONUS</h1>
            <h1 className={`${styles.bonusText} hide page13-reveal-1`}>TIME</h1>
          </div>

          {/* Question Text */}
          <div className={styles.questionGroup}>
            <p className={`${styles.questionText} hide page13-reveal-2-1`}>还记得</p>
            <p className={`${styles.questionText} hide page13-reveal-2-2`}>这条</p>
            <p className={`${styles.questionText} hide page13-reveal-2-3`}>
              被你珍藏的 <span className={styles.highlight}>「回忆」</span> 吗？
            </p>
          </div>

          {/* Interaction Area */}
          <div className={styles.interactionArea}>
            <div className={styles.hintText}>
                <div className={`hide page13-reveal-3-1`}>点击后随机推荐</div>
                <div className={`hide page13-reveal-3-2`}>一条被遗忘的收藏</div>
            </div>

            <div className={`${styles.arrowWrapper} hide ${styles.bounce} page13-reveal-4`}>
              <Image 
                src="imgs/page13/arrow.svg" 
                alt="Arrow" 
                fill 
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className={`${styles.buttonWrapper} hide page13-reveal-5`}>
              <button className={`${styles.pressButton} ${styles.pulse}`} onClick={handlePress}>
                <span className={styles.buttonText}>PRESS</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className={`${styles.footer} hide page13-reveal-6`}>
            @TripleUni 2025
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
