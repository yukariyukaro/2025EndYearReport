"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page20.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page20() {
  const PAGE_NUMBER = 20;
  const { appendNextPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 100;
    const step = 200; // Increased speed (reduced step)

    reveal('.page20-walking_people', t);
    reveal('.page20-reveal-2', t += step);
    reveal('.page20-reveal-3', t += step);
    reveal('.page20-reveal-5', t += step);
    reveal('.page20-reveal-6', t += step);
    // page20-reveal-4 was not in JSX, maybe removed or copy paste error in previous version? 
    // Checking JSX below... 
    
    const hintTimer = setTimeout(() => setShowHint(true), t + 800);
    addTimer(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);
  
  const pageData = summaryData?.pages?.page15;
  const searchTimes = pageData?.total_searches ?? 0;
  const keywords = pageData?.top_keywords ?? [];
  const frequentlyUsedWord1 = keywords[0]?.keyword ?? "生活";
  const frequentlyUsedWord2 = keywords[1]?.keyword ?? "探索";
  
  const topKeyword = keywords[0]?.keyword;
  const sharedData = (pageData?.shared_search_data as Array<{ keyword?: string; shared_users?: number }> | undefined)?.find(
    (item) => item.keyword === topKeyword
  );
  const sameSearchCount = sharedData?.shared_users ?? 0;

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ backgroundImage: 'url("imgs/page20/background.png")' }}>
        <div className={styles.topArea}>
          <div className={`hide page20-walking_people ${styles.headerLeft}`}>
            <Image src="imgs/page20/walking_people.png" alt="person" width={375} height={260} />
          </div>

          <div className={`hide page20-reveal-2 ${styles.headerRight}`}> 
            <div className={styles.pinText}>寻找</div>
            <div className={styles.pinCaption}>本身就是一种勇气</div>
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={`hide page20-reveal-3 ${styles.statBlock}`}>
            <div className={styles.statTitle}>今年你搜索了 <span className={styles.highlight}>[{searchTimes}]</span> 次</div>
          </div>
          <div className={`hide page20-reveal-5 ${styles.statBlock}`}>
            <div className={styles.statDesc}>最常搜索的是：<br/><span className={styles.highlight}>[{frequentlyUsedWord1}]、[{frequentlyUsedWord2}]</span>……</div>
          </div>
          <div className={`hide page20-reveal-6 ${styles.statBlock}`}>
            <div className={styles.statPeople}>有 <span className={styles.highlight}>[{sameSearchCount}]</span> 位<p>伙伴也在寻找同样的答案</p></div>
          </div>
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
