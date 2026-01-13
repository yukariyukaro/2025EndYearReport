"use client";
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page18.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

type EmojiSentiment = "positive" | "neutral" | "healing" | "negative" | string;

function normalizeTopEmojis(
  input:
    | Array<{ emoji?: string; count?: number; sentiment?: EmojiSentiment }>
    | Record<string, { count?: number; sentiment?: EmojiSentiment }>
    | null
    | undefined
) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((item) => ({
        emoji: item?.emoji ?? "",
        count: typeof item?.count === "number" ? item.count : Number(item?.count ?? 0),
        sentiment: item?.sentiment,
      }))
      .filter((x) => x.emoji && Number.isFinite(x.count) && x.count > 0);
  }

  if (typeof input === "object") {
    return Object.entries(input)
      .map(([emoji, value]) => ({
        emoji,
        count: typeof value?.count === "number" ? value.count : Number(value?.count ?? 0),
        sentiment: value?.sentiment,
      }))
      .filter((x) => x.emoji && Number.isFinite(x.count) && x.count > 0);
  }

  return [];
}

export default function Page18() {
  const PAGE_NUMBER = 18;
  const { appendNextPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const [showHint, setShowHint] = useState(false);
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 100;
    const step = 200;
    reveal(".page17-reveal-2", t);
    reveal(".page17-reveal-4", (t += step));
    reveal(".page17-reveal-3", (t += step));

    const hintTimer = setTimeout(() => setShowHint(true), t + 800);
    addTimer(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  const pageData = summaryData?.pages?.page13;
  const topEmojis = normalizeTopEmojis(pageData?.top_emojis);
  const hasData = topEmojis.length > 0;

  const favoriteEmojiItem =
    topEmojis.length === 0
      ? undefined
      : topEmojis.reduce((best, curr) => (curr.count > best.count ? curr : best), topEmojis[0]);

  const FAVORITE_EMOJI = favoriteEmojiItem?.emoji ?? "😶";
  const EMOJI_USE_COUNT = favoriteEmojiItem?.count ?? 0;

  const totalCount = topEmojis.reduce((sum, x) => sum + x.count, 0);
  const sentimentCount = topEmojis.reduce(
    (acc, x) => {
      const sentiment = String(x.sentiment ?? "").toLowerCase();
      if (sentiment === "positive") acc.positive += x.count;
      else if (sentiment === "healing") acc.healing += x.count;
      else if (sentiment === "neutral") acc.neutral += x.count;
      else acc.neutral += x.count;
      return acc;
    },
    { positive: 0, neutral: 0, healing: 0 }
  );

  const POSITIVE_PCT = totalCount > 0 ? Math.round((sentimentCount.positive / totalCount) * 100) : 0;
  const NEUTRAL_PCT = totalCount > 0 ? Math.round((sentimentCount.neutral / totalCount) * 100) : 0;
  const HEALING_PCT = totalCount > 0 ? Math.round((sentimentCount.healing / totalCount) * 100) : 0;
  const sentimentDescription = pageData?.sentiment_description;

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ backgroundImage: 'url("imgs/page18/background.png")' }}>
        {/* Flash In Effect from Page 17 */}
        <div className={styles.fadeInOverlay} />

        <div className={styles.topArea}>
          <div className={`hide page17-reveal-2 ${styles.headerRight}`}>
            {hasData ? (
              <>
                <div className={styles.title}>
                  今年你最爱的表情是： <span className={styles.emoji}>[{FAVORITE_EMOJI}]</span>
                </div>
                <div className={styles.subtitle}>
                  它陪你表达了 <span className={styles.highlight}>[{EMOJI_USE_COUNT}]</span> 次心情
                </div>
              </>
            ) : (
              <>
                <div className={styles.title}>
                  今年你似乎更喜欢
                </div>
                <div className={styles.subtitle}>
                  用文字表达心情
                </div>
              </>
            )}
          </div>
        </div>

        <div className={`hide page17-reveal-4 ${styles.ILove}`}>I LOVE</div>

        <div className={styles.contentArea}>
          <div className={`hide page17-reveal-3 ${styles.statBlock}`}>
            {hasData ? (
              <>
                <div className={styles.caption}>{sentimentDescription ?? "你的emoji情绪倾向："}</div>
                <div className={styles.pcts}>
                  [{POSITIVE_PCT}%] 正向 · [{NEUTRAL_PCT}%] 中性 · [{HEALING_PCT}%] 疗愈
                </div>
              </>
            ) : (
              <>
                <div className={styles.caption}>{sentimentDescription ?? "暂无表情使用数据"}</div>
                <div className={styles.pcts}>
                  期待明年看到你的表情包~
                </div>
              </>
            )}
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
