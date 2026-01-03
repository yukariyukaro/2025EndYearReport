"use client";
import React, { useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import styles from "./styles/page13.module.css";

export default function Page13() {
  const PAGE_NUMBER = 13;
  const { appendNextPage, currentPage } = usePageManager();
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (currentPage !== PAGE_NUMBER) {
      clearTimers();
      document.querySelectorAll('[class*="page13-reveal"]').forEach((el) => {
        el.classList.remove(styles.visible);
      });
    }
  }, [currentPage, clearTimers]);

  const reveal = useCallback((selector: string, delayMs: number) => {
    timersRef.current.push(setTimeout(() => {
      const els = document.querySelectorAll(selector);
      els.forEach((el) => {
        el.classList.add(styles.visible);
      });
    }, delayMs));
  }, []);

  const onShow = () => {
    clearTimers();
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
  };

  const handlePress = () => {
    // Navigate to next page or perform action
    appendNextPage(PAGE_NUMBER, true);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow}>
      <div className={styles.container}>
        {/* Background */}
        <div className={styles.background}>
          <Image
            src="/imgs/page13/background.png"
            alt="Background"
            fill
            className={styles.backgroundImage}
            priority
          />
        </div>

        <div className={styles.content}>
          {/* Title Section */}
          <div className={styles.titleGroup}>
            <h1 className={`${styles.bonusText} ${styles.reveal} page13-reveal-1`}>BONUS</h1>
            <h1 className={`${styles.bonusText} ${styles.reveal} page13-reveal-1`}>TIME</h1>
          </div>

          {/* Question Text */}
          <div className={styles.questionGroup}>
            <p className={`${styles.questionText} ${styles.reveal} page13-reveal-2-1`}>还记得</p>
            <p className={`${styles.questionText} ${styles.reveal} page13-reveal-2-2`}>这条</p>
            <p className={`${styles.questionText} ${styles.reveal} page13-reveal-2-3`}>
              被你珍藏的 <span className={styles.highlight}>「回忆」</span> 吗？
            </p>
          </div>

          {/* Interaction Area */}
          <div className={styles.interactionArea}>
            <div className={styles.hintText}>
                <div className={`${styles.reveal} page13-reveal-3-1`}>点击后随机推荐</div>
                <div className={`${styles.reveal} page13-reveal-3-2`}>一条被遗忘的收藏</div>
            </div>

            <div className={`${styles.arrowWrapper} ${styles.reveal} ${styles.bounce} page13-reveal-4`}>
              <Image 
                src="/imgs/page13/arrow.svg" 
                alt="Arrow" 
                fill 
                style={{ objectFit: "contain" }}
              />
            </div>

            <div className={`${styles.buttonWrapper} ${styles.reveal} page13-reveal-5`}>
              <button className={`${styles.pressButton} ${styles.pulse}`} onClick={handlePress}>
                <span className={styles.buttonText}>PRESS</span>
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className={`${styles.footer} ${styles.reveal} page13-reveal-6`}>
            @TripleUni 2025
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
