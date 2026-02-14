"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page9.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page9() {
  type KeywordItem = { word: string };

  const PAGE_NUMBER = 9;
  const { currentPage } = usePageManager();
  const { data } = useSummary();

  // Data binding
  const totalBrowses = data?.pages?.page7?.total_browses_2025 ?? 0;
  const rawKeywords = (data?.pages?.page6?.word_cloud?.slice(0, 5) as KeywordItem[] | undefined) || [];
  // Ensure we have 5 items for the 5 bubbles, padding with defaults if necessary
  const keywords: KeywordItem[] = [...rawKeywords];
  const defaultKeywords = ["大学", "生活", "学习", "期末", "假期"];
  while (keywords.length < 5) {
    keywords.push({ word: defaultKeywords[keywords.length] || "..." });
  }

  const searchKeyword = data?.pages?.page15?.top_keywords?.[0]?.keyword || "暂无记录";

  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  const onShow = () => {
    clearTimers();
    setShowHint(false);
    // Animation sequence
    const revealNormal = (selector: string, delay: number) => 
      reveal(selector, delay, { activeClass: styles.reveal, initialClass: styles.hide });
    
    const revealPop = (selector: string, delay: number) => 
      reveal(selector, delay, { activeClass: styles.reveal, initialClass: styles.popIn });

    revealNormal(`.page9-reveal-1`, 300);  // Top Card
    revealNormal(`.page9-reveal-2`, 800);  // Flower 1
    revealNormal(`.page9-reveal-3`, 1200); // Stats Text
    revealNormal(`.page9-reveal-4`, 1600); // Keywords Title
    
    revealPop(`.page9-reveal-5`, 2000); // Bubbles
    revealPop(`.page9-reveal-6`, 2400); // Magnifying Glass
    
    revealNormal(`.page9-reveal-7`, 2600); // Flower 2
    
    const hintTimer = setTimeout(() => setShowHint(true), (2600 + 600));
    addTimer(hintTimer);
  };

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        
        {/* Top Card */}
        <div className={`${styles.topCard} ${styles.hide} page9-reveal-1`}>
          <Image 
            src="imgs/page9/let'sLook.png" 
            alt="Let's Look TripleUni" 
            fill
            style={{ objectFit: 'contain' }} 


          />
          {/* Flower 1 (Left Bottom Corner) */}
          <div className={`${styles.flower1} ${styles.hide} page9-reveal-2`}>
             <Image 
              src="imgs/page9/flower1.svg" 
              alt="Flower" 
              width={60} 
              height={80}
            />
          </div>
        </div>

        {/* Stats Text */}
        <div className={`${styles.statsContainer} ${styles.hide} page9-reveal-3`}>
          <p className={styles.statsText}>今年</p>
          <p className={styles.statsText}>
            你一共浏览了 <span className={styles.highlight}>{totalBrowses}</span> 个树洞
          </p>
          <p className={styles.statsText}>见证了无数故事</p>
        </div>

        {/* Keywords Section */}
        <div className={styles.keywordsSection}>
          <div className={`${styles.keywordTitleWrapper} ${styles.hide} page9-reveal-4`}>
            <p className={styles.keywordTitle}>这些是年度热词</p>
            <div className={styles.underline}>
              <Image 
                src="imgs/page9/underline.svg" 
                alt="underline" 
                width={120} 
                height={10}
              />
            </div>
          </div>

          {/* Bubbles */}
          {keywords.map((k, i: number) => (
             <div 
               key={i}
               className={`${styles.bubble} ${styles[`bubble${i+1}`]} ${styles.popIn} page9-reveal-5`} 
               style={{ transitionDelay: `${i * 0.1}s` }}
             >
               {k.word}
             </div>
          ))}

          {/* Magnifying Glass */}
          <div className={`${styles.magnifyingGlass} ${styles.popIn} page9-reveal-6`}>
            <div className={styles.searchIcon}>
               <Image 
                src="imgs/page9/search.svg" 
                alt="Search" 
                fill
              />
            </div>
            <p className={styles.glassText}>“{searchKeyword}”</p>
          </div>
        </div>

        {/* Flower 2 (Bottom Left) */}
        <div className={`${styles.flower2} ${styles.hide} page9-reveal-7`}>
           <Image 
            src="imgs/page9/flower2.svg" 
            alt="Flower" 
            width={80} 
            height={100}
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
