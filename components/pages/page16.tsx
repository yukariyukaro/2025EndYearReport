"use client";
import { useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { useSummary } from "@/contexts/SummaryContext";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page16.module.css";
import { useRevealAnimation } from "@/hooks/useRevealAnimation";

export default function Page16() {
  const PAGE_NUMBER = 16;
  const { appendNextPage } = usePageManager();
  const { data: summaryData } = useSummary();
  const pageData = summaryData?.pages?.page12;
  const [showHint, setShowHint] = useState(false);
  
  const { reveal, clearTimers, addTimer } = useRevealAnimation(PAGE_NUMBER);

  function onShow() {
    clearTimers();
    setShowHint(false);

    let t = 100;
    
    // Images
    reveal('.page16-reveal-spring-trunk', t);
    reveal('.page16-reveal-spring-leaves', t + 200);
    
    // Text lines
    reveal('.page16-reveal-top-1', t + 300);
    reveal('.page16-reveal-top-2', t + 450);

    // Trees
    reveal('.page16-reveal-summer', t + 450);
    reveal('.page16-reveal-autumn', t + 600);
    reveal('.page16-reveal-rabbit-pair', t + 750);
    reveal('.page16-reveal-winter', t + 900);
    reveal('.page16-reveal-rabbit-single', t + 1050);

    // Bottom text
    let t2 = t + 1050;
    const textStep = 150;
    reveal('.page16-reveal-bottom-1', t2 += textStep);
    reveal('.page16-reveal-bottom-2', t2 += textStep);
    reveal('.page16-reveal-bottom-3', t2 += textStep);
    reveal('.page16-reveal-bottom-4', t2 += textStep);
    reveal('.page16-reveal-bottom-5', t2 += textStep);

    const hintTimer = setTimeout(() => setShowHint(true), t2 + 800);
    addTimer(hintTimer);
  }

  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  // Text variables extracted
  const POST_EMOTION_TITLE_LINE1 = "你的发帖情绪";
  const POST_EMOTION_TITLE_LINE2 = "随季节流转";
  
  const keywords = pageData?.top_keywords ?? [];
  const FREQ_WORD1 = keywords[0]?.word ?? "生活";
  const FREQ_WORD2 = keywords[1]?.word ?? "探索";
  const FREQ_WORD3 = keywords[2]?.word ?? "成长";

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        <div className={`${styles.springTrunk} page16-reveal-spring-trunk`}>
          <Image src="imgs/page16/springTreeFull.png" alt="springTree" fill style={{ objectFit: "contain" }} />
        </div>
        <div className={`${styles.springLeaves} page16-reveal-spring-leaves`}>
          <Image src="imgs/page16/springLeaves.png" alt="springLeaves" fill style={{ objectFit: "contain" }} />
        </div>

        {/* Trees use custom animations in CSS, so we don't add 'hide' but rely on 'reveal-active' triggering the keyframe */}
        <div className={`${styles.summerTree} page16-reveal-summer`}>
          <Image src="imgs/page16/summerTree.png" alt="summer" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.autumnTree} page16-reveal-autumn`}>
          <Image src="imgs/page16/autumnTree.png" alt="autumn" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.rabbitPair} page16-reveal-rabbit-pair`}>
          <Image src="imgs/page16/Rabbits.png" alt="rabbits" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.winterTree} page16-reveal-winter`}>
          <Image src="imgs/page16/winterTree.png" alt="winter" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={`${styles.rabbitSingle} page16-reveal-rabbit-single`}>
          <Image src="imgs/page16/Rabbit.png" alt="rabbit" fill style={{ objectFit: "contain" }} />
        </div>

        <div className={styles.topText}>
          <div className={`${styles.topTextLine} hide page16-reveal-top-1`}>{POST_EMOTION_TITLE_LINE1}</div>
          <div className={`${styles.topTextLine} hide page16-reveal-top-2`}>{POST_EMOTION_TITLE_LINE2}</div>
        </div>

        <div className={styles.bottomText}>
          <div className={`${styles.bottomTextLine} hide page16-reveal-bottom-1`}>这一年</div>
          <div className={`${styles.bottomTextLine} hide page16-reveal-bottom-2`}>你最常提起的词是</div>
          <div className={`${styles.keyword} hide page16-reveal-bottom-3`}>[{FREQ_WORD1}]</div>
          <div className={`${styles.keyword} hide page16-reveal-bottom-4`}>[{FREQ_WORD2}]</div>
          <div className={`${styles.keyword} hide page16-reveal-bottom-5`}>[{FREQ_WORD3}]</div>
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
