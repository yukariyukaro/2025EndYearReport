"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { sendViewPageTracking } from "@/utils/dom";
import styles from "./styles/page23.module.css";
import { useSummary } from "@/contexts/SummaryContext";

interface Achievement {
  title: string;
  description: string;
  importance: number;
}

export default function Page23() {
  const PAGE_NUMBER = 23;
  const { appendNextPage, onAppendNext, offAppendNext } = usePageManager();
  const { data } = useSummary();
  const page16 = data?.pages?.page16;

  const [isGrowing, setIsGrowing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  const lastShownRef = useRef<number | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const scrollToNext = () => {
    // Page 23 is likely the last page or close to it. 
    // If there is a page 24, this works. If not, it might do nothing.
    appendNextPage(PAGE_NUMBER, true);
  };

  const getAchievementsByYear = (year: number): Achievement[] => {
    if (!page16) return [];
    switch (year) {
      case 2023: return page16.user_achievements_2023 || [];
      case 2024: return page16.user_achievements_2024 || [];
      case 2025: return page16.user_achievements || [];
      default: return [];
    }
  };

  const handleYearClick = (year: number) => {
    setSelectedYear(year);
  };

  const handleCloseModal = () => {
    setSelectedYear(null);
  };

  function slideIn(selector: string, delayMs: number, fromDirection: 'left' | 'right' | 'top' | 'bottom' = 'bottom', durationMs = 800) {
    const timer = setTimeout(() => {
      if (typeof document === "undefined") return;
      const pageElement = document.getElementById(`page${PAGE_NUMBER}`);
      if (!pageElement) return;
      const elements = pageElement.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.remove("hide");
        let initialTransform = "";
        switch (fromDirection) {
          case 'left': initialTransform = "translateX(-100px)"; break;
          case 'right': initialTransform = "translateX(100px)"; break;
          case 'top': initialTransform = "translateY(-100px)"; break;
          case 'bottom': initialTransform = "translateY(100px)"; break;
        }
        el.style.transform = initialTransform;
        el.style.opacity = "0";
        el.style.transition = `transform ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${durationMs}ms ease-out`;
        requestAnimationFrame(() => {
          el.style.transform = "translate(0, 0)";
          el.style.opacity = "1";
        });
      });
    }, delayMs);
    timersRef.current.push(timer);
  }

  function onShow() {
    if (lastShownRef.current === PAGE_NUMBER) return;
    lastShownRef.current = PAGE_NUMBER;
    clearTimers();
    setShowHint(false);
    let t = 0;
    const step = 200;

    // Title
    slideIn('.page23-text-1', (t += step), 'left', 800);

    // Main tree and tree-like elements
    slideIn('.page23-tree-m', (t += step * 1.2), 'bottom', 1000);
    
    // trigger growth animation
    const growTimer = setTimeout(() => setIsGrowing(true), t + 50);
    timersRef.current.push(growTimer);

    slideIn('.page23-mango', (t += step), 'bottom', 900);
    slideIn('.page23-mangoes', (t += step), 'bottom', 900);
    slideIn('.page23-2023', (t += step), 'bottom', 900);
    slideIn('.page23-2024', (t += step), 'bottom', 900);
    slideIn('.page23-2025', (t += step), 'bottom', 900);

    const hintTimer = setTimeout(() => setShowHint(true), t + 1500);
    timersRef.current.push(hintTimer);
  }

  function handleShow() {
    onShow();
    sendViewPageTracking(PAGE_NUMBER);
  }

  // If page22 triggers appendNextPage(22,...), start growth animation here as well
  useEffect(() => {
    const handler = () => {
      setIsGrowing(true);
    };
    try {
      onAppendNext && onAppendNext(22, handler);
    } catch (e) {
      // ignore
    }
    return () => {
      try { offAppendNext && offAppendNext(22, handler); } catch (e) {}
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentAchievements = selectedYear ? getAchievementsByYear(selectedYear) : [];

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={handleShow} className={styles.container} style={{ backgroundImage: 'url("imgs/page22/background.png")' }}>
      <div className="content-block">
        <div className="page23-text-1 hide">
          <p>点击不同年份
            <br />
            展开成就详情卡片
          </p>
        </div>

        <div className="page23-tree-m hide">
          <div className="relative" style={{ width: '100%', height: '100%' }}>
            <Image src="imgs/page23/tree_m.png" alt="Tree With Mangos" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        {/* tree-like assets */}
        <div className="page23-mango hide">
          <Image src="imgs/page23/mango.png" alt="mango" width={75} height={35} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div className="page23-mangoes hide">
          <Image src="imgs/page23/mangoes.png" alt="mangoes" width={80} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        
        {/* Interactive Bubbles */}
        <div className="page23-2023 hide" onClick={() => handleYearClick(2023)}>
          <div className={`${styles.bubble} ${styles.bubble2023}`}>
            <span className={styles.yearText}>2023</span>
          </div>
        </div>

        <div className="page23-2024 hide" onClick={() => handleYearClick(2024)}>
          <div className={`${styles.bubble} ${styles.bubble2024}`}>
            <span className={styles.yearText}>2024</span>
          </div>
        </div>

        <div className="page23-2025 hide" onClick={() => handleYearClick(2025)}>
          <div className={`${styles.bubble} ${styles.bubble2025}`}>
            <span className={styles.yearText}>2025</span>
          </div>
        </div>

        {/* Achievement Modal */}
        <div className={`${styles.modalOverlay} ${selectedYear ? styles.modalActive : ''}`} onClick={handleCloseModal}>
          <div className={styles.cardContainer} onClick={e => e.stopPropagation()}>
            <div className={styles.cardHeader}>
              <span className={styles.yearTitle}>{selectedYear} 年度成就</span>
              <button className={styles.closeButton} onClick={handleCloseModal}>×</button>
            </div>
            
            <div className={styles.bentoGrid}>
              {currentAchievements.length > 0 ? (
                currentAchievements.map((ach, index) => (
                  <div 
                    key={index} 
                    className={`${styles.achievementItem} ${ach.importance >= 3 ? styles.important : ''}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={styles.achTitle}>{ach.title}</div>
                    <div className={styles.achDesc}>{ach.description}</div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>暂无成就记录</div>
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem' }}>
          <button onClick={scrollToNext} aria-label="Show next page" style={{border: 'none', background: 'transparent', padding: 0, width: 0, height: 0}} />
        </div>
      </div>
    </PageWrapper>
  );
}
