"use client";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page21.module.css";
import { useSummary } from "@/contexts/SummaryContext";
import { getOptimizedAIImageUrl } from "@/utils/resources";

export default function Page21() {
  const PAGE_NUMBER = 21;
  const { appendNextPage } = usePageManager();
  const { data: summaryData, userItsc } = useSummary();
  const pageData = summaryData?.pages?.page16;
  
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 直接计算 URL，不再依赖 useEffect 异步设置
  const imageUrl = getOptimizedAIImageUrl(userItsc);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  function reveal(selector: string, delayMs: number, durationMs = 1400) {
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove("reveal-line");
      el.classList.add("hide");
      void el.offsetWidth;
    });

    const t = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove("hide");
        el.classList.add("reveal-line");
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
      });
    }, delayMs);

    timersRef.current.push(t);
  }

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 120;
    const step = 350;

    reveal('.page21-reveal-1', t);
    reveal('.page21-reveal-2', (t += step));
    reveal('.page21-reveal-3', (t += step));
    reveal('.page21-reveal-4', (t += step));

    const hintTimer = setTimeout(() => setShowHint(true), (t += 900));
    timersRef.current.push(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);
  
  // 绑定后端数据
  const personality_label = pageData?.ai_title ?? "PUPUer";
  const keyword = pageData?.user_achievements?.[0]?.title ?? "暂无关键词";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container} style={{ backgroundImage: 'url("imgs/page21/background.png")' }}>
        <div className={styles.topText}>
          <div className={`hide page21-reveal-1 ${styles.title}`}>基于你的行为与情绪</div>
          <div className={`hide page21-reveal-2 ${styles.subtitle}`}>我们为你生成了一幅年度画像：</div>
        </div>

        <div className={styles.visualArea} onClick={goNext} data-next-ignore="true">
          <div className={`${styles.frame} hide page21-reveal-3`}>
            {imageUrl && !imageFailed && (
              <Image
                key={imageUrl}
                src={imageUrl}
                alt="AI Portrait"
                fill
                className={`${styles.objectContain} ${isImageLoaded ? styles.imgLoaded : styles.imgLoading}`}
                sizes="(max-width: 768px) 60vw, 40vw"
                priority
                onLoad={() => setIsImageLoaded(true)}
                onError={() => setImageFailed(true)}
              />
            )}
          </div>

          <div className={`${styles.leafLeft} hide page21-reveal-4`}>
            <Image src="imgs/page21/leaf_left.png" alt="leaf left" fill />
          </div>
          <div className={`${styles.leafRight} hide page21-reveal-4`}>
            <Image src="imgs/page21/leaf_right.png" alt="leaf right" fill />
          </div>
        </div>
        
        <div className={styles.textBlock}>
          <div className={`${styles.tag} hide page21-reveal-2`}>——{<span className={styles.personalityLabel}>{personality_label}</span>}</div>
          <div className={`${styles.keywords} hide page21-reveal-3`}>你的年度关键词是 [{<span className={styles.keywordLabel}>{keyword}</span>}]</div>

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

