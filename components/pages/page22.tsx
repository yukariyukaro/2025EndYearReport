"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import ScrollUpHint from "@/components/ScrollUpHint";
import { sendViewPageTracking } from "@/utils/dom";
import styles from "./styles/page22.module.css";
import usePageManager from "@/hooks/usePageManager";
import { useSummary } from "@/contexts/SummaryContext";

export default function Page22() {
  const PAGE_NUMBER = 22;
  const { appendNextPage, currentPage } = usePageManager();
  const { summaryData } = useSummary();
  const pageData = summaryData?.page16;

  const achievementCount = pageData?.achievements?.length ?? 0;
  const growthPercentage = 0;

  const [showHint, setShowHint] = useState(false);
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
      document.querySelectorAll('[class*="page22-reveal"]').forEach((el) => {
        el.classList.remove(styles.visible);
      });
    }
  }, [currentPage, clearTimers]);

  const handleTreeTrunkClick = () => {
    try {
      appendNextPage(PAGE_NUMBER, true);
    } catch (e) {
      console.log("点击树干查看成长足迹");
    }
  };

  const reveal = useCallback((selector: string, delayMs: number) => {
    const timer = setTimeout(() => {
      document.querySelectorAll(selector).forEach((el) => {
        el.classList.add(styles.visible);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  function handleShow() {
    clearTimers();
    setShowHint(false);
    reveal(".page22-reveal-header", 250);
    reveal(".page22-reveal-tree", 600);
    reveal(".page22-reveal-hint", 1050);
    reveal(".page22-reveal-leaf-1", 600);
    reveal(".page22-reveal-leaf-2", 700);
    reveal(".page22-reveal-leaf-3", 800);
    reveal(".page22-reveal-leaf-4", 900);
    reveal(".page22-reveal-leaf-5", 1000);
    reveal(".page22-reveal-leaf-6", 1100);
    sendViewPageTracking(PAGE_NUMBER);
    const hintTimer = setTimeout(() => setShowHint(true), 1500);
    timersRef.current.push(hintTimer);
  }

  return (
    <PageWrapper
      pageNumber={PAGE_NUMBER}
      onShow={handleShow}
      onAppendNext={() => setShowHint(false)}
      className={styles.container}
    >
      <div className={`${styles.headerText} ${styles.reveal} ${styles.fromLeft} page22-reveal-header`}>
        <p>今年你收获了 <span className={styles.figure}>{achievementCount}</span> 个成就</p>
        <p>比去年增长了 <span className={styles.figure}>{growthPercentage}</span>%</p>
      </div>

      <div 
        className={styles.treeContainer} 
        onClick={handleTreeTrunkClick} 
        data-next-ignore="true"
      >
        <div className={`${styles.reveal} ${styles.fromBottom} page22-reveal-tree`} style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image 
            src="/imgs/page22/tree.png" 
            alt="Tree" 
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <div className={styles.hintContainer}>
          <div className={`${styles.reveal} ${styles.fromRight} page22-reveal-hint`}>
            <div className={styles.arrow}>
              <Image src="/imgs/page22/arrow.png" alt="Arrow" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.hintText}>
              <p>点击树干</p>
              <p>看看你的成长足迹</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.leaf} ${styles.leaf1} ${styles.reveal} ${styles.fromFade} page22-reveal-leaf-1`}>
        <Image src="/imgs/page22/leaf1.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf2} ${styles.reveal} ${styles.fromFade} page22-reveal-leaf-2`}>
        <Image src="/imgs/page22/leaf2.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf3} ${styles.reveal} ${styles.fromFade} page22-reveal-leaf-3`}>
        <Image src="/imgs/page22/leaf3.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf4} ${styles.reveal} ${styles.fromFade} page22-reveal-leaf-4`}>
        <Image src="/imgs/page22/leaf4.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf5} ${styles.reveal} ${styles.fromFade} page22-reveal-leaf-5`}>
        <Image src="/imgs/page22/leaf5.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf6} ${styles.reveal} ${styles.fromFade} page22-reveal-leaf-6`}>
        <Image src="/imgs/page22/leaf6.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>

      {showHint && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
