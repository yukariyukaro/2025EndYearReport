"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import ScrollUpHint from "@/components/ScrollUpHint";
import { sendViewPageTracking } from "@/utils/dom";
import styles from "./styles/page21.module.css";
import usePageManager from "@/hooks/usePageManager";
import { useSummary } from "@/contexts/SummaryContext";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page21() {
  const PAGE_NUMBER = 21;
  const { appendNextPage } = usePageManager();
  const { data } = useSummary();
  const pageData = data?.pages?.page16;

  const achievementCount = pageData?.user_achievements?.length ?? 0;
  
  const [showHint, setShowHint] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  // 计算成就增长率
  // 逻辑: (今年成就数 - 去年成就数) / 去年成就数 * 100
  const count2025 = pageData?.user_achievements?.length ?? 0;
  const count2024 = pageData?.user_achievements_2024?.length ?? 0;
  
  let growthPercentage = 0;
  let isNegativeGrowth = false;

  if (count2024 > 0) {
    const rawGrowth = ((count2025 - count2024) / count2024 * 100);
    growthPercentage = Number(Math.abs(rawGrowth).toFixed(1));
    isNegativeGrowth = rawGrowth < 0;
  } else if (count2025 > 0) {
    // 去年为0，今年有，增长率为100%
    growthPercentage = 100;
  }

  const handleTreeTrunkClick = () => {
    if (isClicked) return;
    setIsClicked(true);
    // 延迟跳转，展示点击反馈动画
    setTimeout(() => {
      try {
        appendNextPage(PAGE_NUMBER, true);
      } catch (e) {
        console.log("点击树干查看成长足迹");
      }
    }, 300);
  };

  const doReveal = (selector: string, delay: number) => {
    reveal(selector, delay, { activeClass: "visible", initialClass: "reveal" });
  };

  function handleShow() {
    clearTimers();
    setShowHint(false);
    doReveal(".page21-reveal-header", 250);
    doReveal(".page21-reveal-tree", 600);
    doReveal(".page21-reveal-hint", 1050);
    doReveal(".page21-reveal-leaf-1", 600);
    doReveal(".page21-reveal-leaf-2", 700);
    doReveal(".page21-reveal-leaf-3", 800);
    doReveal(".page21-reveal-leaf-4", 900);
    doReveal(".page21-reveal-leaf-5", 1000);
    doReveal(".page21-reveal-leaf-6", 1100);
    sendViewPageTracking(PAGE_NUMBER);
    const hintTimer = setTimeout(() => setShowHint(true), 1500);
    addTimer(hintTimer);
  }

  return (
    <PageWrapper
      pageNumber={PAGE_NUMBER}
      onShow={handleShow}
      onAppendNext={() => setShowHint(false)}
      className={styles.container}
    >
      <div className={`${styles.headerText} reveal fromLeft page21-reveal-header`}>
        <p>今年你收获了 <span className={styles.figure}>{achievementCount}</span> 个成就</p>
        <p>比去年{isNegativeGrowth ? "减少了" : "增长了"} <span className={styles.figure}>{growthPercentage}</span>%</p>
      </div>

      <div 
        className={`${styles.treeContainer} ${styles.treeBreathing} ${isClicked ? styles.treeClickFeedback : ''}`}
        onClick={handleTreeTrunkClick} 
        data-next-ignore="true"
      >
        <div className={`reveal fromBottom page21-reveal-tree`} style={{ width: "100%", height: "100%", position: "relative" }}>
          <Image 
            src="imgs/page22/tree.png" 
            alt="Tree" 
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <div className={styles.hintContainer}>
          <div className={`reveal fromRight page21-reveal-hint`}>
            <div className={styles.arrow}>
              <Image src="imgs/page22/arrow.png" alt="Arrow" fill style={{ objectFit: "contain" }} />
            </div>
            <div className={styles.hintText}>
              <p>点击树干</p>
              <p>看看你的成长足迹</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.leaf} ${styles.leaf1} reveal fromFade page21-reveal-leaf-1`}>
        <Image src="imgs/page22/leaf1.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf2} reveal fromFade page21-reveal-leaf-2`}>
        <Image src="imgs/page22/leaf2.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf3} reveal fromFade page21-reveal-leaf-3`}>
        <Image src="imgs/page22/leaf3.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf4} reveal fromFade page21-reveal-leaf-4`}>
        <Image src="imgs/page22/leaf4.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf5} reveal fromFade page21-reveal-leaf-5`}>
        <Image src="imgs/page22/leaf5.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>
      <div className={`${styles.leaf} ${styles.leaf6} reveal fromFade page21-reveal-leaf-6`}>
        <Image src="imgs/page22/leaf6.png" alt="Leaf" fill style={{ objectFit: "contain" }} />
      </div>

      {showHint && (
        <div className="fade-in">
          <ScrollUpHint />
        </div>
      )}
    </PageWrapper>
  );
}
