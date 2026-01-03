"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page4.module.css";

export default function Page4() {
  const PAGE_NUMBER = 4;
  const { appendNextPage } = usePageManager();
  const { data } = useSummary();
  const keyword = "默认"; // Default fallback
  
  const [showHint, setShowHint] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

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
      el.classList.add(styles.hide); // Use local class for initial state
      void el.offsetWidth;
    });

    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove(styles.hide);
        el.classList.add("reveal-line"); // Global class for animation
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

    // 1. Top Text
    reveal(".page4-reveal-1", t); 
    reveal(".page4-reveal-2", (t += stepSlow));

    // 2. Center Section (Button & Box)
    reveal(".page4-reveal-3", (t += stepSlow)); // Button
    reveal(".page4-reveal-4", (t += stepSlow)); // Box + Decors

    // 3. Bottom Text
    reveal(".page4-reveal-5", (t += stepSlow)); 
    reveal(".page4-reveal-6", (t += stepSlow)); 

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
            src="/imgs/page4/background.svg" 
            alt="Background" 
            fill 
            style={{ objectFit: "cover" }} 
          />
        </div>

        <div className={styles.content}>
          {/* Top Section */}
          <div className={styles.topSection}>
            <span className={`${styles.titleText} ${styles.hide} page4-reveal-1`}>打开时间的胶囊</span>
            <span className={`${styles.titleText} ${styles.hide} page4-reveal-2`}>看看那天的树洞吧</span>
          </div>

          {/* Center Section */}
          <div className={styles.centerSection}>
            {/* Play Button */}
            <div 
              className={`${styles.playButtonWrapper} ${styles.hide} page4-reveal-3`}
              onClick={handleNext}
              data-next-ignore="true" // Ignore full page click, handle locally if needed (though here it does next page anyway)
            >
               <div className={styles.playButton}>
                  <div className={styles.playIcon}>
                    <Image src="/imgs/page4/PlayCircle.svg" alt="Play" fill />
                  </div>
               </div>
               {/* Arrow Decor */}
               <div className={styles.arrowDecor}>
                  <Image src="/imgs/page4/Vector.svg" alt="Arrow" fill />
               </div>
            </div>

            {/* Tree Hole Box */}
            <div className={`${styles.treeHoleWrapper} ${styles.hide} page4-reveal-4`}>
               <div className={styles.personDecor}>
                  <Image src="/imgs/page4/小人儿.svg" alt="Person" fill />
               </div>
               
               <div className={styles.treeHoleBox}>
                  <span className={styles.treeHoleText}>树洞</span>
               </div>

               <div className={styles.starDecor}>
                  <Image src="/imgs/page4/right.svg" alt="Decor" fill />
               </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={styles.bottomSection}>
             <div className={`${styles.bottomTextGroup} ${styles.hide} page4-reveal-5`}>
                <span className={styles.bottomText}>
                  你注册时<br/>
                  大家最关心的是
                </span>
                <div className={styles.fingerIcon}>
                   <Image src="/imgs/page4/pointUp.svg" alt="Point Up" fill />
                </div>
             </div>
             <span className={`${styles.keywordText} ${styles.hide} page4-reveal-6`}>【{keyword}】</span>
          </div>
          {/* Footer removed, will be handled globally */}
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
