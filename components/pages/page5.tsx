"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page5.module.css";

export default function Page5() {
  const PAGE_NUMBER = 5;
  const { appendNextPage } = usePageManager();
  
  const [showHint, setShowHint] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const { data } = useSummary();
  const page3Data = data?.pages?.page3;

  const stats = {
    days: page3Data?.login_days ?? 0,
    minutes: page3Data?.total_minutes ?? 0,
    rank: page3Data?.school_rank ?? 0,
    totalUsers: page3Data?.school_total_users ?? 0,
    courses: page3Data?.pupu_courses ?? 0
  };

  // 清理 timers
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  // 复用动画逻辑
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
    const stepSlow = 300;

    // Title
    reveal(".page5-reveal-1", t); 

    // Text Rows
    reveal(".page5-reveal-2", (t += stepSlow));
    reveal(".page5-reveal-3", (t += stepSlow));
    reveal(".page5-reveal-4", (t += stepSlow));
    reveal(".page5-reveal-5", (t += stepSlow));
    reveal(".page5-reveal-6", (t += stepSlow));

    // Sticker Card
    reveal(".page5-reveal-7", (t += stepSlow));

    // Bottom Hint
    reveal(".page5-reveal-8", (t += stepSlow));

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
      <div 
        className={styles.container} 
        onClick={handleNext}
      >
        {/* Title */}
        <h1 className={`${styles.title} ${styles.hide} page5-reveal-1`}>时光的印记</h1>

        {/* Stats List */}
        <div className={styles.statsList}>
          <div className={`${styles.textRow} ${styles.hide} page5-reveal-2`}>
            <span className={styles.textBase}>在过去的四季里</span>
          </div>
          <div className={`${styles.textRow} ${styles.hide} page5-reveal-3`}>
            <span className={styles.textBase}>噗噗默默陪伴了你</span>
            <span className={styles.textHighlight}>【{stats.days}】</span>
            <span className={styles.textBase}>天</span>
          </div>
          <div className={`${styles.textRow} ${styles.hide} page5-reveal-4`}>
            <span className={styles.textBase}>总计</span>
            <span className={styles.textHighlight}>{stats.minutes}</span>
            <span className={styles.textBase}>分钟</span>
          </div>
          <div className={`${styles.textRow} ${styles.hide} page5-reveal-5`}>
             <span className={styles.textBase}>你的坚持让你在</span>
             <span className={styles.textHighlight}>{stats.totalUsers}</span>
             <span className={styles.textBase}>名</span>
          </div>
          <div className={`${styles.textRow} ${styles.hide} page5-reveal-6`}>
             <span className={styles.textBase}>用户中排名第</span>
             <span className={styles.textHighlight}>{stats.rank}！</span>
          </div>
        </div>

        {/* Sticker Card */}
        <div className={`${styles.stickerWrapper} ${styles.hide} page5-reveal-7`}>
           <div className={styles.stickerCard}>
              {/* Card Bg */}
              <div className={styles.cardBg}>
                 <Image src="imgs/page5/card.png" alt="Card" fill className={styles.objectCover} />
              </div>
              
              {/* Content */}
              <div className={styles.cardContent}>
                 <div className={styles.courseRow}>
                    <span className={styles.cardText}>相当于修了</span>
                    <div className={styles.courseCountWrapper}>
                       <div className={styles.ellipseBg}></div>
                       <span className={styles.courseCount}>{stats.courses}</span>
                    </div>
                    <span className={styles.cardText}>门</span>
                 </div>
                 <span className={styles.cardText}>噗噗课程呢~</span>
              </div>
           </div>

           {/* Decors */}
           <div className={styles.flowerDecor}>
              <Image src="imgs/page5/flower.png" alt="Flower" fill style={{ objectFit: 'contain' }} />
           </div>
           <div className={styles.smilesDecor}>
              <Image src="imgs/page5/smiles.png" alt="Smiles" fill style={{ objectFit: 'contain' }} />
           </div>
           <div className={styles.plantDecor}>
              <Image src="imgs/page5/plant.png" alt="Plant" fill style={{ objectFit: 'contain' }} />
           </div>
        </div>

        {/* Bottom Hint */}
        <div className={`${styles.bottomHint} ${styles.hide} page5-reveal-8`}>
           点击探索，感受四季陪伴的温暖
        </div>
      </div>

      {showHint && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
