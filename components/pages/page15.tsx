"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page15.module.css";

export default function Page15() {
  const PAGE_NUMBER = 15;
  const { currentPage } = usePageManager();
  const [showHint, setShowHint] = useState(true);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

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
      document.querySelectorAll('[class*="page15-reveal"]').forEach((el) => {
        el.classList.remove(styles.visible);
      });
    }
  }, [currentPage, clearTimers]);

  const reveal = useCallback((selector: string, delayMs: number) => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(selector);
      els.forEach((el) => {
        el.classList.add(styles.visible);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  const onShow = () => {
    clearTimers();
    // Animation Sequence
    reveal(`.page15-reveal-1`, 300);  // Light Bulb
    reveal(`.page15-reveal-2`, 600);  // Top Text
    reveal(`.page15-reveal-3`, 1000); // Main Image (Bro)
    reveal(`.page15-reveal-4`, 1500); // Bottom Text
    reveal(`.page15-reveal-5`, 1800); // Plus Icon
    reveal(`.page15-reveal-6`, 2200); // Footer
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        
        {/* Top Section */}
        <div className={styles.topSection}>
          <div className={`${styles.bulbWrapper} ${styles.popIn} ${styles.swing} page15-reveal-1`}>
            <Image
              src="/imgs/page15/light-bulb.png"
              alt="Light Bulb"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <div className={`${styles.topText} ${styles.slideLeft} page15-reveal-2`}>
            <div>这条内容收获了</div>
            <div><span className={styles.highlight}>[阅读数]</span> 次阅读</div>
            <div><span className={styles.highlight}>[评论数]</span> 条评论</div>
            <div><span className={styles.highlight}>[收藏数]</span> 次收藏</div>
            <div>是今年最受欢迎的一条</div>
          </div>
        </div>

        {/* Main Illustration */}
        <div className={`${styles.mainImageWrapper} ${styles.reveal} page15-reveal-3`}>
          <div className={styles.float}>
             <Image
               src="/imgs/page15/bro.png"
               alt="Illustration"
               width={300}
               height={300}
               className={styles.broImage}
               style={{ width: "100%", height: "auto", maxHeight: "40vh" }}
             />
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={`${styles.bottomText} ${styles.slideRight} page15-reveal-4`}>
            <div>这些内容也深深触动了</div>
            <div><span className={styles.highlight}>[互动人数]</span> 位伙伴的心</div>
          </div>
          <div className={`${styles.plusIcon} ${styles.popIn} page15-reveal-5`}>
            <Image
              src="/imgs/page15/plus.svg"
              alt="Plus"
              fill
            />
          </div>
        </div>

        {/* Footer */}
  

        {showHint && (
          <div className="fade-in">
            <ScrollUpHint />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
