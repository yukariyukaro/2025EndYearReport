"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import styles from "./styles/page11.module.css";

// Mock Data for the chart
const data = [
  { name: 'Happy', value: 30, color: '#f4c9aa' },
  { name: 'Peace', value: 25, color: '#ffe6a5' },
  { name: 'Free', value: 15, color: '#d9f0b6' },
  { name: 'Sad', value: 10, color: '#cbdad7' },
  { name: 'Thoughtful', value: 20, color: '#d4ebef' },
];

export default function Page11() {
  const PAGE_NUMBER = 11;
  const { appendNextPage, currentPage } = usePageManager();
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
      document.querySelectorAll('[class*="page11-reveal"]').forEach((el) => {
        el.classList.remove(styles.reveal);
        if (el.classList.contains(styles.popIn)) {
          (el as HTMLElement).style.opacity = '';
        }
      });
    }
  }, [currentPage, clearTimers]);

  // Reusing reveal logic from other pages
  const reveal = useCallback((selector: string, delayMs: number) => {
    const timer = setTimeout(() => {
      const els = document.querySelectorAll(selector);
      els.forEach((el) => {
        el.classList.add(styles.reveal);
        if (el.classList.contains(styles.popIn)) {
          // Trigger popIn animation
          (el as HTMLElement).style.opacity = '1'; 
        }
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  const onShow = () => {
    clearTimers();
    // Animation sequence
    reveal(`.page11-reveal-1`, 300); // Top Text
    reveal(`.page11-reveal-2`, 800); // Chart Background
    reveal(`.page11-reveal-3`, 1200); // Chart Content (Pie + Fire)
    reveal(`.page11-reveal-4`, 1800); // Legend
    reveal(`.page11-reveal-5`, 2400); // Bottom Text
    reveal(`.page11-reveal-6`, 2800); // Decors (Birds)
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        
        {/* Top Text */}
        <div className={`${styles.topText} ${styles.hide} page11-reveal-1`}>
          你经常关注 [关键词] 相关的内容<br />
          例如：「[例子]」
        </div>

        {/* Background Layer */}
        <div className={`${styles.chartBackground} ${styles.hide} page11-reveal-2`}>
        </div>

        {/* Chart Section */}
        <div className={`${styles.donutWrap} ${styles.hide} page11-reveal-3`}>
            <div className={styles.pieContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="100%"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={`${styles.fireIcon} ${styles.popIn} page11-reveal-3`}>
              <Image
                src="/imgs/page11/fire.png"
                alt="Fire"
                width={80}
                height={94}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
        </div>

        {/* Legend */}
        <div className={`${styles.legendContainer} ${styles.hide} page11-reveal-4`}>
           {/* If card.png is the background, we use it here */}
           {/* Based on Figma, 'card' group has the yellow bg. Assuming card.png is that. */}
           <Image 
             src="/imgs/page11/card.png" 
             alt="Card Bg" 
             fill
             className={styles.objectCover}
             style={{ borderRadius: '12px', zIndex: -1 }}
           />
           <div className={styles.legendGrid}>
             {data.map((item) => (
               <div key={item.name} className={styles.legendItem}>
                 <div className={styles.legendDot} style={{ background: item.color }}></div>
                 <span className={styles.legendText}>{item.name}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Bottom Text */}
        <div className={`${styles.bottomText} ${styles.hide} page11-reveal-5`}>
           你最常浏览的话题是 [话题]，<br />
           其中<br />
           [话题情绪分析]<br />
           反映了你的[心情倾向]
        </div>

        {/* Birds Decorations */}
        <div className={`${styles.birdsTopRight} ${styles.hide} page11-reveal-6`}>
           <Image src="/imgs/page11/birdsUpRight.png" alt="Birds" fill style={{ objectFit: "contain" }} />
        </div>
        <div className={`${styles.birdsTopLeft} ${styles.hide} page11-reveal-6`}>
           <Image src="/imgs/page11/birdsUpLeft.png" alt="Birds" fill style={{ objectFit: "contain" }} />
        </div>
        <div className={`${styles.birdsBottomLeft} ${styles.hide} page11-reveal-6`}>
           <Image src="/imgs/page11/birdsDownLeft.png" alt="Birds" fill style={{ objectFit: "contain" }} />
        </div>
        <div className={`${styles.birdsBottomRight} ${styles.hide} page11-reveal-6`}>
           <Image src="/imgs/page11/BirdsDownRight.png" alt="Birds" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.bottomDecor} ${styles.hide} page11-reveal-6`}>
          <Image
            src="/imgs/page11/rightCorner.png"
            alt="Decoration"
            fill
           style={{ objectFit: "contain" }}
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
