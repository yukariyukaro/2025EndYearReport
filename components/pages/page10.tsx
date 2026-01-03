"use client";
import { useCallback, useState, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page10.module.css";

export default function Page10() {
  const PAGE_NUMBER = 10;
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
      document.querySelectorAll('[class*="p10-anim"]').forEach((el) => {
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
    reveal(`.p10-anim-1`, 300);  // Hearts
    reveal(`.p10-anim-2`, 600);  // Year/Stats
    reveal(`.p10-anim-3`, 900);  // Main Image
    reveal(`.p10-anim-4`, 1200); // Content Box
    reveal(`.p10-anim-5`, 1500); // Footer
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        {/* Hearts Header */}
        <div className={`${styles.heartsRow} ${styles.reveal} p10-anim-1`}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.heartIcon}>
              <Image 
                src="/imgs/page10/social-rewards-heart-like-circle.svg" 
                alt="heart" 
                width={33} 
                height={33} 
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>

        {/* Top Text */}
        <div className={`${styles.textBase} ${styles.yearText} ${styles.reveal} p10-anim-2`}>
          2025年
        </div>
        <div className={`${styles.textBase} ${styles.statsText} ${styles.reveal} p10-anim-2`}>
          你浏览了 [浏览总数] 条内容
        </div>

        {/* Main Visual */}
        <div className={`${styles.mainImageContainer} ${styles.reveal} p10-anim-3`}>
          <Image 
            src="/imgs/page10/women.png" 
            alt="User Illustration" 
            fill 
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* Content Box Area */}
        <div className={`${styles.textBase} ${styles.firstBrowseLabel} ${styles.reveal} p10-anim-4`}>
          你的第一条浏览是：
        </div>
        <div className={`${styles.contentBox} ${styles.reveal} p10-anim-4`}>
          <div className={styles.rainbow}>
            <Image 
              src="/imgs/page10/rainbow.png" 
              alt="Decoration" 
              width={100} 
              height={80} 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className={`${styles.textBase} ${styles.contentText}`}>
            [第一条浏览内容]
          </div>
          <div className={styles.branch}>
            <Image 
              src="/imgs/page10/branch.png" 
              alt="Decoration" 
              width={50} 
              height={100} 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className={`${styles.textBase} ${styles.relationText} ${styles.reveal} p10-anim-5`}>
          与年度热帖的关系：关系标签
        </div>
        
        <div className={`${styles.footerSection} ${styles.reveal} p10-anim-5`}>
          <div className={styles.footerContent}>
            <div className={styles.arrow}>
              <Image 
                src="/imgs/page10/arrow.png" 
                alt="Arrow" 
                width={78} 
                height={70} 
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className={`${styles.textBase} ${styles.footerText}`}>
              这表示你 「xxx」<br />了这条内容!
            </div>
          </div>
        </div>

        {showHint && <ScrollUpHint />}
      </div>
    </PageWrapper>
  );
}
