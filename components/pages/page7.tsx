"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page7.module.css";

export default function Page7() {
  const PAGE_NUMBER = 7;
  const { appendNextPage } = usePageManager();
  const { data } = useSummary();

  const lateNightRatio = data?.pages?.page4?.late_night_ratio ?? 0;
  const beatPercentage = data?.pages?.page5?.beat_percentage ?? 0;
  
  const [showHint, setShowHint] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // Animation helper
  function reveal(selector: string, delayMs: number, durationMs = 1000) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-line");
      el.classList.add(styles.hide);
      void el.offsetWidth;
    });

    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove(styles.hide);
        el.classList.add("reveal-line");
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 100;
    const step = 300;

    // 1. Top stats
    reveal(".page7-reveal-1", t);
    reveal(".page7-reveal-2", (t += step));
    reveal(".page7-reveal-3", (t += step));
    
    // 2. Question section
    reveal(".page7-reveal-4", (t += step)); // Subtitle
    reveal(".page7-reveal-5", (t += step)); // Tree hole
    reveal(".page7-reveal-6", (t += step)); // Open question

    // 3. Bottom interaction
    reveal(".page7-reveal-7", (t += step)); // Time travel text
    reveal(".page7-reveal-8", (t += step)); // Button & Arrow

    const hintTimer = setTimeout(() => setShowHint(true), (t += 600));
    timersRef.current.push(hintTimer);
  }

  const handleNext = () => {
    appendNextPage(PAGE_NUMBER, true);
  };

  return (
    <PageWrapper 
      pageNumber={PAGE_NUMBER} 
      onShow={onShow}
      onAppendNext={() => setShowHint(false)}
    >
      <div className={styles.container}>
        {/* Background */}
        <div className={styles.background}>
          <Image 
            src="/imgs/page7/background.png" 
            alt="Page 7 Background" 
            fill 
            style={{ objectFit: "cover" }} 
            priority
          />
        </div>

        <div className={styles.content}>
          {/* Top Text Group */}
          <div className={styles.topTextGroup}>
            <p className={`${styles.topText} ${styles.hide} page7-reveal-1`}>今年</p>
            <p className={`${styles.topText} ${styles.hide} page7-reveal-2`}>
              你熬夜的比例是 {lateNightRatio}%
            </p>
            <p className={`${styles.topText} ${styles.hide} page7-reveal-3`}>
              你的作息打败了 {beatPercentage}% 的用户！
            </p>
            
            <p className={`${styles.topText} ${styles.subTitle} ${styles.hide} page7-reveal-4`}>
              还记得你的第一条浏览吗？
            </p>
          </div>

          {/* Tree Hole Box */}
          <div className={`${styles.treeHoleBox} ${styles.hide} page7-reveal-5`}>
            <span className={styles.treeHoleText}>（树洞）</span>
          </div>

          {/* Open Question Box */}
          <div className={`${styles.openQuestionBox} ${styles.hide} page7-reveal-6`}>
            <div className={styles.questionHeader}>
              <div className={styles.questionIcon}>
                <Image src="/imgs/page7/questionIcon.svg" alt="Question" fill />
              </div>
              <span className={styles.questionLabel}>Open Question</span>
            </div>
            <p className={styles.questionText}>那时的你在想什么？🤔</p>
          </div>

          {/* Bottom Area */}
          <div className={styles.bottomArea}>
            <p className={`${styles.timeTravelText} ${styles.hide} page7-reveal-7`}>
              时间旅行，回到那天
            </p>
            
            <div className={`${styles.playButtonWrapper} ${styles.hide} page7-reveal-8`}>
              <button className={styles.playButton} onClick={handleNext}>
                <div className={styles.playIcon}>
                  <Image src="/imgs/page7/PlayCircle.svg" alt="Play" fill />
                </div>
              </button>
              
              <div className={styles.arrowDecor}>
                 <Image src="/imgs/page7/arrow.svg" alt="Arrow" fill />
              </div>
            </div>
          </div>
        </div>
      </div>

      {showHint && (
        <div 
          className="fade-in" 
          style={{ 
            position: 'absolute', 
            zIndex: 10, 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none' 
          }}
        >
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
