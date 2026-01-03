"use client";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { sendViewPageTracking } from "@/utils/dom";
import styles from "./styles/page23.module.css";

export default function Page23() {
  const PAGE_NUMBER = 23;
  const { appendNextPage, onAppendNext, offAppendNext } = usePageManager();
  const [isGrowing, setIsGrowing] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const lastShownRef = useRef<number | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };

  const scrollToNext = () => {
    appendNextPage(PAGE_NUMBER, true);
  };

  function slideIn(selector: string, delayMs: number, fromDirection: 'left' | 'right' | 'top' | 'bottom' = 'bottom', durationMs = 800) {
    setTimeout(() => {
      if (typeof document === "undefined") return;
      const pageElement = document.getElementById(`page${PAGE_NUMBER}`);
      if (!pageElement) return;
      const elements = pageElement.querySelectorAll<HTMLElement>(selector);
      elements.forEach((el) => {
        el.classList.remove("hide");
        let initialTransform = "";
        switch (fromDirection) {
          case 'left': initialTransform = "translateX(-100px)"; break;
          case 'right': initialTransform = "translateX(100px)"; break;
          case 'top': initialTransform = "translateY(-100px)"; break;
          case 'bottom': initialTransform = "translateY(100px)"; break;
        }
        el.style.transform = initialTransform;
        el.style.opacity = "0";
        el.style.transition = `transform ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity ${durationMs}ms ease-out`;
        requestAnimationFrame(() => {
          el.style.transform = "translate(0, 0)";
          el.style.opacity = "1";
        });
      });
    }, delayMs);
  }

  function onShow() {
    if (lastShownRef.current === PAGE_NUMBER) return;
    lastShownRef.current = PAGE_NUMBER;
    clearTimers();
    setShowHint(false);
    let t = 0;
    const step = 200;

    // Title
    slideIn('.page23-text-1', (t += step), 'left', 800);

    // Main tree and tree-like elements (mango, mangoes, chat_box) slide from bottom like page22 tree
    slideIn('.page23-tree-m', (t += step * 1.2), 'bottom', 1000);
    // trigger growth animation
    setTimeout(() => setIsGrowing(true), t + 50);
    slideIn('.page23-mango', (t += step), 'bottom', 900);
    slideIn('.page23-mangoes', (t += step), 'bottom', 900);
    slideIn('.page23-2023', (t += step), 'bottom', 900);
    slideIn('.page23-2024', (t += step), 'bottom', 900);
    slideIn('.page23-2025', (t += step), 'bottom', 900);

    // Decorative elements behave like leaves
    slideIn('.page23-chat_b2023', (t += step), 'top', 700);
    slideIn('.page23-chat_b2024', (t += step), 'left', 700);
    slideIn('.page23-chat_b2025', (t += step), 'left', 700);
    slideIn('.page23-mango', (t += step), 'right', 700);
    slideIn('.page23-mangoes', (t += step), 'bottom', 700);

    // footer
    slideIn('.page23-footer', (t += step), 'bottom', 600);
    const hintTimer = setTimeout(() => setShowHint(true), t + 700);
    timersRef.current.push(hintTimer);
  }

  function handleShow() {
    onShow();
    sendViewPageTracking(PAGE_NUMBER);
  }

  // If page22 triggers appendNextPage(22,...), start growth animation here as well
  useEffect(() => {
    const handler = () => {
      setIsGrowing(true);
    };
    try {
      onAppendNext && onAppendNext(22, handler);
    } catch (e) {
      // ignore
    }
    return () => {
      try { offAppendNext && offAppendNext(22, handler); } catch (e) {}
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageWrapper pageNumber={PAGE_NUMBER} onShow={handleShow} className={styles.container} style={{ backgroundImage: 'url("imgs/page22/background.png")' }}>
      <div className="content-block">
        <div className="page23-text-1 hide">
          <p>点击不同年份
            <br />
            展开成就详情卡片
          </p>
        </div>

        <div className="page23-tree-m hide">
          <div className="relative" style={{ width: '100%', height: '100%' }}>
            <Image src="imgs/page23/tree_m.png" alt="Tree With Mangos" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        {/* tree-like assets */}
        <div className="page23-mango hide">
          <Image src="imgs/page23/mango.png" alt="mango" width={75} height={35} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div className="page23-mangoes hide">
          <Image src="imgs/page23/mangoes.png" alt="mangoes" width={80} height={60} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div className="page23-2023">
          <span style={{ display: 'inline-block', width: 30, height: 30, lineHeight: '37px', textAlign: 'center' }}>2023</span>
        </div>

        <div className="page23-2024">
          <span style={{ display: 'inline-block', width: 30, height: 30, lineHeight: '37px', textAlign: 'center' }}>2024</span>
        </div>

        <div className="page23-2025">
          <span style={{ display: 'inline-block', width: 30, height: 30, lineHeight: '37px', textAlign: 'center' }}>2025</span>
        </div>


        {/* decorative chatbox elements */}
        <div className="relative w-full min-h-[320px]">
          <div className="page23-chat_b2023 hide">
            <Image src="imgs/page23/chat_bubble2023.png" alt="chat_bubble2023" width={115} height={82} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="page23-chat_b2024 hide">
            <Image src="imgs/page23/chat_bubble2024.png" alt="chat_bubble2024" width={123} height={81} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div className="page23-chat_b2025 hide ">
            <Image src="imgs/page23/chat_bubble2025.png" alt="chat_bubble025" width={123} height={83} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
        {/* Minimal template block (from page11) preserved — remove visible text but keep scroll functionality */}
        <div style={{ marginTop: '1.25rem' }}>
          <button onClick={scrollToNext} aria-label="Show next page" style={{border: 'none', background: 'transparent', padding: 0, width: 0, height: 0}} />
        </div>

        {showHint && (
          <div style={{ position: 'absolute', bottom: 24, right: 20 }}>
            <div className="fade-in">
              <span />
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
