"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page10.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page10() {
  const PAGE_NUMBER = 10;
  const { currentPage } = usePageManager();
  const { data } = useSummary();

  const pageData = data?.pages?.page7;
  const rawTotalBrowses = pageData?.total_browses_2025;
  const totalBrowses = typeof rawTotalBrowses === "number" ? rawTotalBrowses : 0;

  const rawFirstContent = pageData?.first_post_content;
  const firstContent = typeof rawFirstContent === "string" && rawFirstContent ? rawFirstContent : "暂无记录";

  const rawRelationType = pageData?.relationship_type;
  const relationType = typeof rawRelationType === "string" && rawRelationType ? rawRelationType : "相遇";

  const rawRelationDesc = pageData?.relationship_desc;
  const relationDesc =
    typeof rawRelationDesc === "string" && rawRelationDesc ? rawRelationDesc : "暂无记录";

  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const onShow = () => {
    clearTimers();
    setShowHint(false);
    
    const revealAnim = (selector: string, delay: number) => 
      reveal(selector, delay, { activeClass: styles.visible, initialClass: styles.reveal });

    revealAnim(`.p10-anim-1`, 300);  // Hearts
    revealAnim(`.p10-anim-2`, 600);  // Year/Stats
    revealAnim(`.p10-anim-3`, 900);  // Main Image
    revealAnim(`.p10-anim-4`, 1200); // Content Box
    revealAnim(`.p10-anim-5`, 1500); // Footer
    
    const hintTimer = setTimeout(() => setShowHint(true), 1500 + 600);
    addTimer(hintTimer);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        {/* Hearts Header */}
        <div className={`${styles.heartsRow} ${styles.reveal} p10-anim-1`}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={styles.heartIcon}>
              <Image 
                src="imgs/page10/social-rewards-heart-like-circle.svg" 
                alt="heart" 
                width={33} 
                height={33} 
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          ))}
        </div>

        {/* Top Text */}
        <div className={`${styles.textBase}  ${styles.reveal} p10-anim-2`}>
          2025年
        </div>
        <div className={`${styles.textBase} ${styles.statsText} ${styles.reveal} p10-anim-2`}>
          你浏览了 <span className={styles.highlight}>{totalBrowses}</span> 条内容
        </div>

        {/* Main Visual */}
        <div className={`${styles.mainImageContainer} ${styles.reveal} p10-anim-3`}>
          <Image 
            src="imgs/page10/women.png" 
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
              src="imgs/page10/rainbow.png" 
              alt="Decoration" 
              width={100} 
              height={80} 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
          <div className={`${styles.textBase} ${styles.contentText}`}>
            {firstContent}
          </div>
          <div className={styles.branch}>
            <Image 
              src="imgs/page10/branch.png" 
              alt="Decoration" 
              width={50} 
              height={100} 
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className={`${styles.textBase} ${styles.relationText} ${styles.reveal} p10-anim-5`}>
          与年度热帖的关系：{relationType}
        </div>
        
        <div className={`${styles.footerSection} ${styles.reveal} p10-anim-5`}>
          <div className={styles.footerContent}>
            <div className={styles.arrow}>
              <Image 
                src="imgs/page10/arrow.png" 
                alt="Arrow" 
                width={78} 
                height={70} 
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
            <div className={`${styles.textBase} ${styles.footerText}`}>
              {relationDesc}
            </div>
          </div>
        </div>

        {showHint && <ScrollUpHint />}
      </div>
    </PageWrapper>
  );
}
