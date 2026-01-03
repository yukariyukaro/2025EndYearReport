"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page12.module.css";

export default function Page12() {
  const PAGE_NUMBER = 12;
  const { currentPage } = usePageManager();
  const { data } = useSummary();
  const pageData = data?.pages?.page9;

  // Data binding
  // Note: collect_rank_data.post_title is missing in backend, using fallback
  const collectTitle = "某条热门树洞"; 
  const collectRank = pageData?.collect_rank_data?.user_rank ?? 0;
  
  const frequentTitle = pageData?.frequent_post_data?.post_content || "暂无记录";
  const frequentCount = pageData?.frequent_post_data?.browse_count ?? 0;

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
      document.querySelectorAll('[class*="page12-reveal"]').forEach((el) => {
        el.classList.remove(styles.reveal);
      });
    }
  }, [currentPage, clearTimers]);

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
    reveal(`.page12-reveal-1`, 300); // Background
    
    // Top Text
    reveal(`.page12-reveal-2-1`, 600);
    reveal(`.page12-reveal-2-2`, 800);
    reveal(`.page12-reveal-2-3`, 1000);

    reveal(`.page12-reveal-3`, 1200); // Machine
    reveal(`.page12-reveal-4`, 1600); // Hearts
    
    // Bottom Text
    reveal(`.page12-reveal-5-1`, 2000);
    reveal(`.page12-reveal-5-2`, 2200);
    reveal(`.page12-reveal-5-3`, 2400);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        {/* Background */}
        <div className={`${styles.background} ${styles.hide} page12-reveal-1`}>
          <Image
            src="imgs/page12/background.png"
            alt="Background"
            fill
            className={styles.backgroundImage}
            priority
          />
        </div>

        {/* Top Text */}
        <div className={`${styles.textBlock} ${styles.topText}`}>
          <p className={`${styles.hide} page12-reveal-2-1`}>在 {collectTitle} 中</p>
          <p className={`${styles.hide} page12-reveal-2-2`}>你是第 <span className={styles.highlight}>{collectRank}</span> 个收藏的人</p>
          <p className={`${styles.hide} page12-reveal-2-3`}>真是慧眼识珠！</p>
        </div>

        {/* Machine Central Image */}
        <div className={`${styles.machineContainer} ${styles.hide} page12-reveal-3`}>
          <div className={styles.machineFloat}>
            <Image
              src="imgs/page12/pana.png"
              alt="Machine"
              width={300}
              height={400}
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>

        {/* Pixel Hearts */}
        <div className={`${styles.heart} ${styles.heartTopRight} ${styles.pixelPop} page12-reveal-4`}>
          <Image
            src="imgs/page12/social-rewards-heart-like-circle.svg"
            alt="Heart"
            width={64}
            height={64}
            style={{ width: "100%", height: "auto" }}
          />
        </div>
        
        <div className={`${styles.heart} ${styles.heartBottomLeft} ${styles.pixelPop} page12-reveal-4`}>
          <Image
            src="imgs/page12/social-rewards-heart-like-circle.svg"
            alt="Heart"
            width={64}
            height={64}
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        {/* Bottom Text */}
        <div className={`${styles.textBlock} ${styles.bottomText}`}>
          <p className={`${styles.hide} page12-reveal-5-1`}>你查看次数最多的帖子是</p>
          <p className={`${styles.highlight} ${styles.hide} page12-reveal-5-2`}>{frequentTitle}</p>
          <p className={`${styles.hide} page12-reveal-5-3`}>看了 <span className={styles.highlight}>{frequentCount}</span> 次</p>
        </div>

        {/* Footer / Logo (Optional, based on screenshot bottom branding) */}
        {/* If the screenshot implies a specific footer for this page, we might add it here, 
            but usually Layout handles the global footer. 
            The screenshot shows "TripleUni 2025" and a logo. 
            We'll assume it's part of the global footer or decorations. 
            If it's specific, we'd add it. For now, sticking to the main content.
        */}

        {showHint && (
          <div className="fade-in">
            <ScrollUpHint />
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

