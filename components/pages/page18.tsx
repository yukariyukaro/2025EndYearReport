"use client";
import { useCallback, useRef, useEffect, useState } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import ScrollUpHint from "@/components/ScrollUpHint";
import styles from "./styles/page18.module.css";

export default function Page18() {
  const PAGE_NUMBER = 18;
  const { appendNextPage } = usePageManager();
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const [showHint, setShowHint] = useState(false);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  // 新增单个元素飞入动画
  function flyIn(element: HTMLElement, delayMs: number, durationMs = 1000) {
    // 初始状态：左侧外部，透明
    element.style.transform = "translateX(-100px)";
    element.style.opacity = "0";
    element.style.transition = `transform ${durationMs}ms ease-out, opacity ${durationMs}ms ease-out`;
    element.classList.remove("fly-in");

    const t = setTimeout(() => {
      // 最终状态：原位，不透明
      element.style.transform = "translateX(0)";
      element.style.opacity = "1";
      element.classList.add("fly-in");
    }, delayMs);

    timersRef.current.push(t);
  }

  // 批量处理一排元素逐个飞入
  function revealRow(selector: string, startDelay: number, stepDelay: number = 150) {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el, index) => {
      // 每个元素延迟依次递增
      flyIn(el, startDelay + index * stepDelay);
    });
  }
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
  const rowDelay = 500; 
  const elementsPerRow = 6; 
  const stepDelay = 150; 

  revealRow('.emoji-row-1 .emoji', t);
  
  revealRow('.emoji-row-2 .emoji', t + rowDelay);
  const totalEmojiAnimationTime = t + rowDelay + (elementsPerRow - 1) * stepDelay;
  
  const elementDelay = 360;
  t = totalEmojiAnimationTime; 

    let s = 120;
    const step = 360;
    reveal('.October_face', (s += step));
    reveal('.page18-cta', (s += step*2));
    reveal('.PlayButton', (s += step*3));

    const hintTimer = setTimeout(() => setShowHint(true), (s += 900));
    timersRef.current.push(hintTimer);
}
  const goNext = () => appendNextPage && appendNextPage(PAGE_NUMBER, true);

  const emojiFiles = [
    "Laugh.png",
    "Pain.png",
    "Hello.png",
    "Bored.png",
    "Laugh.png",
    "Pain.png",
    "Bored.png",
    "Star.png",
    "To tears.png",
    "Birthday.png",
    "Bored.png",
    "Star.png",
  ];

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={onShow} onAppendNext={() => setShowHint(false)}>
      <div className={styles.container}>
        <div className={styles.topArea}>
          {/* 第一排 emoji：判断是否为 facemask.png，动态加放大类 */}
          <div className={`emoji-row emoji-row-1 ${styles.topEmojiRow}`}>
            {Array.from({ length: 6 }).map((_, i) => {
              const file = emojiFiles[i % emojiFiles.length];
              const isFacemask = file === "facemask.png";
              return (
                <div 
                  key={`r1-${i}`} 
                  className={`emoji hide ${styles.bigEmoji} ${isFacemask ? styles.facemask : ""}`}
                >
                  <Image 
                    src={`/imgs/page18/${encodeURIComponent(file)}`} 
                    alt={file} 
                    width={64} 
                    height={64} 
                    priority={isFacemask} // 可选：给 facemask 图片优先加载
                  />
                </div>
              );
            })}
          </div>

          <div className={`emoji-row emoji-row-2 ${styles.topEmojiRow}`}>
            {Array.from({ length: 6 }).map((_, i) => {
              const file = emojiFiles[(i + 6) % emojiFiles.length];
              const isFacemask = file === "facemask.png";
              return (
                <div 
                  key={`r2-${i}`} // 修复：补充索引 i
                  className={`emoji hide ${styles.bigEmoji} ${isFacemask ? styles.facemask : ""}`}
                >
                  <Image 
                    src={`/imgs/page18/${encodeURIComponent(file)}`} 
                    alt={file} 
                    width={64} 
                    height={64} 
                  />
                </div>
              );
            })}
          </div>

          <div className={`October_face hide ${styles.octoberFaceWrap}`}>
            <Image src="/imgs/page18/October_face.png" alt="October face" width={260} height={430} />
          </div>
        </div>

        <div className={styles.contentArea}>
          <div className={`page18-cta hide ${styles.cta}`}>查看我的emoji年度表情包</div>

          <div className={`PlayButton hide ${styles.playWrap}`}>
            <div className={styles.playIcon} />
            <Image src="/imgs/page18/button.png" alt="Button" width={200} height={100} />
            <Image src="/imgs/page18/Vector.png" alt="Vector" width={50} height={90} />
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