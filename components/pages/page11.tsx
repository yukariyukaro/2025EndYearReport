"use client";
import React, { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page11.module.css";

// Default fallback data
const DEFAULT_DATA = [
  { name: 'Happy', value: 30, color: '#f4c9aa' },
  { name: 'Peace', value: 25, color: '#ffe6a5' },
  { name: 'Free', value: 15, color: '#d9f0b6' },
  { name: 'Sad', value: 10, color: '#cbdad7' },
  { name: 'Thoughtful', value: 20, color: '#d4ebef' },
];

const COLORS = ['#f4c9aa', '#ffe6a5', '#d9f0b6', '#cbdad7', '#d4ebef'];

export default function Page11() {
  const PAGE_NUMBER = 11;
  const { currentPage } = usePageManager();
  const { data: summaryData } = useSummary();

  const pageData = summaryData?.pages?.page8;
  
  // Transform emotion_analysis to chart data
  const chartData = pageData?.emotion_analysis?.map((item: { topic: string; count: number }, index: number) => ({
    name: item.topic,
    value: item.count,
    color: COLORS[index % COLORS.length]
  })) || DEFAULT_DATA;

  // Keywords logic
  const primaryKeyword = pageData?.keywords?.[0]?.word || "生活";
  const secondaryKeyword = pageData?.keywords?.[1]?.word || "学习";
  
  // Topic logic
  const topTopic = pageData?.longest_topic?.topic || "日常";
  const topTopicPercentage = pageData?.longest_topic?.percentage || "0%";
  // Simple logic to determine "mood" based on topic, or just reuse topic for now
  const moodDesc = topTopic;

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
      // Reset donut wipe animation
      const donut = document.querySelector(`.${styles.donutWrap}`);
      if (donut) {
        donut.classList.remove(styles.reveal);
      }
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
    
    // Top Text
    reveal(`.page11-reveal-1-1`, 300);
    reveal(`.page11-reveal-1-2`, 500);

    reveal(`.page11-reveal-2`, 800); // Chart Background
    
    // Chart Content (Pie + Fire) - Trigger mask animation
    reveal(`.page11-reveal-3`, 1200); 
    
    // Legend
    reveal(`.page11-reveal-4`, 1800);
    
    // Bottom Text
    reveal(`.page11-reveal-5-1`, 2400);
    reveal(`.page11-reveal-5-2`, 2600);
    reveal(`.page11-reveal-5-3`, 2800);
    reveal(`.page11-reveal-5-4`, 3000);

    reveal(`.page11-reveal-6`, 3400); // Decors (Birds)
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        
        {/* Top Text */}
        <div className={styles.topText}>
          <div className={`${styles.hide} page11-reveal-1-1`}>你经常关注 {primaryKeyword} 相关的内容</div>
          <div className={`${styles.hide} page11-reveal-1-2`}>例如：「{secondaryKeyword}」</div>
        </div>

        {/* Background Layer */}
        <div className={`${styles.chartBackground} ${styles.hide} page11-reveal-2`}>
        </div>

        {/* Chart Section */}
        <div className={`${styles.donutWrap} page11-reveal-3`}>
            <div className={styles.pieContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius="55%"
                    outerRadius="100%"
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                    startAngle={90}
                    endAngle={-270}
                    isAnimationActive={false} // Disable default animation
                  >
                    {chartData.map((entry: { name: string; value: number; color: string }, index: number) => (
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
             {chartData.map((item: { name: string; value: number; color: string }) => (
               <div key={item.name} className={styles.legendItem}>
                 <div className={styles.legendDot} style={{ background: item.color }}></div>
                 <span className={styles.legendText}>{item.name}</span>
               </div>
             ))}
           </div>
        </div>

        {/* Bottom Text */}
        <div className={styles.bottomText}>
           <div className={`${styles.hide} page11-reveal-5-1`}>你最常浏览的话题是 {topTopic}，</div>
           <div className={`${styles.hide} page11-reveal-5-2`}>其中</div>
           <div className={`${styles.hide} page11-reveal-5-3`}>{topTopicPercentage}</div>
           <div className={`${styles.hide} page11-reveal-5-4`}>反映了你的 {moodDesc} 倾向</div>
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
