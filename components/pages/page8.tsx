"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page8.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page8() {
  const PAGE_NUMBER = 8;
  const { appendNextPage } = usePageManager();
  const { data } = useSummary();

  const page5Data = data?.pages?.page5;
  const earliestTime = page5Data?.earliest_time || "2025-01-01";
  const earliestContent = page5Data?.earliest_content || "暂无记录";
  const latestTime = page5Data?.latest_time || "2025-12-31";
  const latestContent = page5Data?.latest_content || "暂无记录";
  const beatPercentage = page5Data?.beat_percentage ?? 0;

  const [showHint, setShowHint] = useState(true);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const onShow = () => {
    clearTimers();
    // Animation sequence
    reveal(`.page8-reveal-axis`, 300);
    reveal(`.page8-reveal-1`, 800); // Earliest text + box
    reveal(`.page8-reveal-2`, 1200); // Phone pop in
    reveal(`.page8-reveal-3`, 1800); // Latest text + box
    reveal(`.page8-reveal-4`, 2200); // Moon pop in
    reveal(`.page8-reveal-5`, 2800); // Unique schedule
    reveal(`.page8-reveal-6`, 3200); // Beat X%
    
    // City and stars are static or handled by CSS animations
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        {/* Stars Background */}
        <div className={styles.starsBg}>
          <Image 
            src="imgs/page8/backgroundStars.svg" 
            alt="stars" 
            fill 
            style={{ objectFit: "cover", objectPosition: "top" }} 
            priority
          />
        </div>
        <div className={styles.bigStars}>
          <Image 
            src="imgs/page8/bigStars.svg" 
            alt="big stars" 
            width={120} 
            height={120} 
            style={{ width: '100%', height: 'auto' }} 
          />
        </div>

        {/* Chart Section (Axis + Content) */}
        <div className={styles.chartSection}>
          {/* Axis Layer */}
          <div className={`${styles.axisLayer} hide page8-reveal-axis`}>
            <div className={styles.axisVertical}></div>
            <div className={styles.axisHorizontal}></div>
            <div className={styles.axisLabel}>time</div>
            <div className={styles.plant}>
              <Image 
                src="imgs/page8/plant.svg" 
                alt="plant" 
                width={60} 
                height={60} 
              />
            </div>
          </div>

          {/* Content Layer */}
          <div className={styles.contentLayer}>
            {/* Earliest Group */}
            <div className={`${styles.groupEarliest} hide page8-reveal-1`}>
              <p className={styles.labelWhite}>你在 {earliestTime} 写下了第一条浏览记录</p>
              <div className={styles.whiteBox}>
                <p className={styles.boxText}>{earliestContent}</p>
              </div>
              {/* Phone pops in separately */}
              <div className={`${styles.phoneImage} ${styles.popIn} page8-reveal-2`}>
                <Image 
                  src="imgs/page8/create-new-post.png" 
                  alt="phone" 
                  width={100} 
                  height={150} 
                  style={{ width: '80px', height: 'auto' }}
                />
              </div>
            </div>

            {/* Latest Group */}
            <div className={`${styles.groupLatest} hide page8-reveal-3`}>
              <p className={styles.labelWhite}>你在 {latestTime} 仍在默默守候</p>
              <div className={styles.whiteBox}>
                <p className={styles.boxText}>{latestContent}</p>
              </div>
              {/* Moon pops in separately */}
              <div className={`${styles.moonImage} ${styles.popIn} page8-reveal-4`}>
                <Image 
                  src="imgs/page8/moon.svg" 
                  alt="moon" 
                  width={70} 
                  height={70} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className={styles.bottomStats}>
          <p className={`${styles.statsText} hide page8-reveal-5`}>
            你的这份独特作息
          </p>
          <p className={`${styles.statsText} hide page8-reveal-6`}>
            打败了 {beatPercentage}% 的伙伴！
          </p>
        </div>

        {/* City Skyline */}
        <div className={styles.citySkyline}>
          <Image 
            src="imgs/page8/city.svg" 
            alt="city" 
            width={375} 
            height={150} 
            className={styles.cityImage}
            priority
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
