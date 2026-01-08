"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page17.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page17() {
  const PAGE_NUMBER = 17;
  const { appendNextPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 100;
    const step = 200; // Faster step

    reveal('.page17-reveal-2', t);
    reveal('.page17-reveal-4', t += step);
    reveal('.page17-reveal-3', t += step);

    const hintTimer = setTimeout(() => setShowHint(true), t + 800);
    addTimer(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  // Text terminal variables (extracted)
  const pageData = summaryData?.pages?.page13;
  // Backend returns top_emojis as null in example, need safety check
  const topEmojiItem = pageData?.top_emojis?.[0];
  const FAVORITE_EMOJI = topEmojiItem?.emoji ?? "🌟"; 
  const EMOJI_USE_COUNT = topEmojiItem?.count ?? 0;

  // Backend missing sentiment percentages
  const POSITIVE_PCT = 0;
  const NEUTRAL_PCT = 0;
  const HEALING_PCT = 0;

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ backgroundImage: 'url("imgs/page17/background.png")' }}>
        <div className={styles.topArea}>

          <div className={`hide page17-reveal-2 ${styles.headerRight}`}>
            <div className={styles.title}>今年你最爱的表情是： <span className={styles.emoji}>[{FAVORITE_EMOJI}]</span></div>
            <div className={styles.subtitle}>它陪你表达了 <span className={styles.highlight}>[{EMOJI_USE_COUNT}]</span> 次心情</div>
          </div>
        </div>

        <div className={`hide page17-reveal-4 ${styles.ILove}`}>I LOVE</div>

        <div className={styles.contentArea}>
          <div className={`hide page17-reveal-3 ${styles.statBlock}`}>
            <div className={styles.caption}>你的emoji情绪倾向：</div>
            <div className={styles.pcts}>[{POSITIVE_PCT}%] 正向 · [{NEUTRAL_PCT}%] 中性 · [{HEALING_PCT}%] 疗愈</div>
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
