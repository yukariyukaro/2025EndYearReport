"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page9.module.css";

export default function Page9() {
  const PAGE_NUMBER = 9;
  const { currentPage } = usePageManager();
  const [showHint, setShowHint] = useState(true);
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
      document.querySelectorAll('[class*="page9-reveal"]').forEach((el) => {
        el.classList.remove(styles.reveal);
      });
    }
  }, [currentPage, PAGE_NUMBER, clearTimers]);

  // Reusing reveal logic
  const reveal = useCallback((selector: string, delayMs: number) => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(selector);
      els.forEach((el) => {
        el.classList.add(styles.reveal);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  const onShow = () => {
    clearTimers();
    // Animation sequence
    reveal(`.page9-reveal-1`, 300);  // Top Card
    reveal(`.page9-reveal-2`, 800);  // Flower 1
    reveal(`.page9-reveal-3`, 1200); // Stats Text
    reveal(`.page9-reveal-4`, 1600); // Keywords Title
    reveal(`.page9-reveal-5`, 2000); // Bubbles
    reveal(`.page9-reveal-6`, 2400); // Magnifying Glass
    reveal(`.page9-reveal-7`, 2600); // Flower 2
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        
        {/* Top Card */}
        <div className={`${styles.topCard} ${styles.hide} page9-reveal-1`}>
          <Image 
            src="/imgs/page9/let'sLook.png" 
            alt="Let's Look TripleUni" 
            width={320} 
            height={320}
            style={{ width: '100%', height: 'auto' }}
            priority
          />
          {/* Flower 1 (Left Bottom Corner) */}
          <div className={`${styles.flower1} ${styles.hide} page9-reveal-2`}>
             <Image 
              src="/imgs/page9/flower1.svg" 
              alt="Flower" 
              width={60} 
              height={80}
            />
          </div>
        </div>

        {/* Stats Text */}
        <div className={`${styles.statsContainer} ${styles.hide} page9-reveal-3`}>
          <p className={styles.statsText}>今年</p>
          <p className={styles.statsText}>
            你一共浏览了 <span className={styles.highlight}>[年度树洞总数]</span> 个树洞
          </p>
          <p className={styles.statsText}>见证了无数故事</p>
        </div>

        {/* Keywords Section */}
        <div className={styles.keywordsSection}>
          <div className={`${styles.keywordTitleWrapper} ${styles.hide} page9-reveal-4`}>
            <p className={styles.keywordTitle}>这些是年度热词</p>
            <div className={styles.underline}>
              <Image 
                src="/imgs/page9/underline.svg" 
                alt="underline" 
                width={120} 
                height={10}
              />
            </div>
          </div>

          {/* Bubbles */}
          <div className={`${styles.bubble} ${styles.bubble1} ${styles.popIn} page9-reveal-5`}>
            “xxxxx”
          </div>
          <div className={`${styles.bubble} ${styles.bubble2} ${styles.popIn} page9-reveal-5`} style={{ transitionDelay: '0.1s' }}>
            “xxxxx”
          </div>
          <div className={`${styles.bubble} ${styles.bubble3} ${styles.popIn} page9-reveal-5`} style={{ transitionDelay: '0.2s' }}>
            “xxxxx”
          </div>
          <div className={`${styles.bubble} ${styles.bubble4} ${styles.popIn} page9-reveal-5`} style={{ transitionDelay: '0.3s' }}>
            “xxxxx”
          </div>
          <div className={`${styles.bubble} ${styles.bubble5} ${styles.popIn} page9-reveal-5`} style={{ transitionDelay: '0.4s' }}>
            “xxxxx”
          </div>

          {/* Magnifying Glass */}
          <div className={`${styles.magnifyingGlass} ${styles.popIn} page9-reveal-6`}>
            <div className={styles.searchIcon}>
               <Image 
                src="/imgs/page9/search.svg" 
                alt="Search" 
                fill
              />
            </div>
            <p className={styles.glassText}>“XX xx”</p>
          </div>
        </div>

        {/* Flower 2 (Bottom Left) */}
        <div className={`${styles.flower2} ${styles.hide} page9-reveal-7`}>
           <Image 
            src="/imgs/page9/flower2.svg" 
            alt="Flower" 
            width={80} 
            height={100}
          />
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
