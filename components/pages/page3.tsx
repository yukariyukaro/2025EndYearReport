"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page3.module.css";

function formatDate(dateStr: string | undefined) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return `【${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日】`;
}

export default function Page3() {
  const PAGE_NUMBER = 3;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { appendNextPage, currentPage } = usePageManager();
  const { data, appName, launchDate: launchDateStr } = useSummary();
  
  // Toggle for Easter Egg mode (restoring design as Easter Egg version by default)
  const [isEasterEgg] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const pageData = data?.pages?.page2;
  const launchTimeFormatted = formatDate(launchDateStr);
  const registerTimeFormatted = formatDate(pageData?.register_time);
  
  // Manually calculate days together from registration time
  const daysTogether = (() => {
    if (!pageData?.register_time) return 0;
    const regDate = new Date(pageData.register_time);
    const now = new Date();
    const diff = now.getTime() - regDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  })();

  const registerRank = pageData?.register_rank ?? 0;

  // 清理 timers
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
      document.querySelectorAll<HTMLElement>(".reveal-active").forEach((el) => {
        el.classList.remove("reveal-active");
        el.classList.add("hide");
      });
    }
  }, [currentPage, PAGE_NUMBER, clearTimers]);

  // 文本逐行左→右浮现
  function reveal(selector: string, delayMs: number, durationMs = 1000) {
    // 先重置
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-active");
      el.classList.add("hide");
      el.style.setProperty("--reveal-duration", `${durationMs}ms`);
    });

    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.add("reveal-active");
      });
    }, delayMs);
    timersRef.current.push(timer);
  }

  function onShow() {
    clearTimers();
    setShowHint(false); // 强制重置 Hint 状态

    let t = 100; // 初始延迟缩短为 100ms
    const stepSlow = 300; 

    reveal(".page3-reveal-1", t);
    reveal(".page3-reveal-2", (t += stepSlow));
    reveal(".page3-reveal-3", (t += stepSlow));
    reveal(".page3-reveal-4", (t += stepSlow));
    reveal(".page3-reveal-5", (t += stepSlow));

    // Middle Section - Circle (Static, no reveal)

    reveal(".page3-reveal-6", (t += stepSlow));
    reveal(".page3-reveal-7", (t += stepSlow));
    reveal(".page3-reveal-8", (t += stepSlow));
    reveal(".page3-reveal-9", (t += stepSlow));

    const hintTimer = setTimeout(() => setShowHint(true), (t += 600));
    timersRef.current.push(hintTimer);
  }

  return (
    <PageWrapper 
      pageNumber={PAGE_NUMBER} 
      onShow={onShow}
      onAppendNext={() => setShowHint(false)}
    >
      <div className={styles.container} id="page3-container">
        {/* Background */}
        <div className={styles.background}>
          <Image 
            src="imgs/page3/background.svg" 
            alt="Background" 
            fill 
            style={{ objectFit: "cover" }} 
          />
        </div>

        <div className={styles.content}>
          {/* Top Section */}
          <div className={styles.topSection}>
            <span className={`${styles.titleEnglish} hide page3-reveal-1`}>At the Beginning....</span>
            
            <div className={styles.infoGroup}>
              <div className={`${styles.textRow} hide page3-reveal-2`}>
                <span className={styles.fontPrimary}>{appName}在</span>
                <span className={styles.fontPrimary}>{launchTimeFormatted}</span>
              </div>
              <div className={`${styles.textRow} hide page3-reveal-3`}>
                <span className={styles.fontPrimary}>悄然上线</span>
              </div>
              <div className={`${styles.textRow} hide page3-reveal-4`}>
                <span className={styles.fontPrimary}>你在</span>
                <span className={styles.fontPrimary}>{registerTimeFormatted}</span>
              </div>
              <div className={`${styles.textRow} hide page3-reveal-5`}>
                <span className={styles.fontPrimary}>与{appName}相遇~</span>
              </div>
            </div>
          </div>

          {/* Middle Section - Image (Always Visible) */}
          <div className={`${styles.middleSection} ${!isEasterEgg ? styles.wideSpacing : ''}`}>
            <Image 
              src="imgs/page3/Circle.png" 
              alt="Together" 
              fill 
              className={styles.circleImage}
            />
          </div>

          {/* Bottom Section */}
          <div className={styles.bottomSection}>
            <div className={styles.statGroup}>
              <span className={`${styles.fontPrimary} hide page3-reveal-6`}>我们已经相互陪伴了</span>
              <div className={`${styles.textRow} hide page3-reveal-7`}>
                 <span className={styles.highlightText}>{daysTogether}</span>
                 <span className={styles.fontPrimary}>天！</span>
              </div>
            </div>

            {isEasterEgg && (
              <div className={styles.statGroup}>
                <div className={`${styles.textRow} hide page3-reveal-8`}>
                  <span className={styles.fontPrimary}>你是第</span>
                  <span className={styles.highlightText}>{registerRank}</span>
                  <span className={styles.fontPrimary}>登岛的伙伴</span>
                </div>
                <span className={`${styles.fontPrimary} hide page3-reveal-9`}>是{appName}最珍贵的元老🫶</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showHint && currentPage === PAGE_NUMBER && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
