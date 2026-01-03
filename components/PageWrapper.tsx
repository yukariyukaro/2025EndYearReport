"use client";
import React, { useEffect, useRef } from "react";
import usePageManager from "@/hooks/usePageManager";

type PageWrapperProps = {
  pageNumber: number;
  onShow?: () => void;
  autoAppendNext?: boolean;
  autoScrollToNext?: boolean;
  className?: string;
  children?: React.ReactNode;
  onAppendNext?: () => void;
  style?: React.CSSProperties;
};

export default function PageWrapper({
  pageNumber,
  onShow,
  autoAppendNext = false,
  autoScrollToNext = false,
  className,
  children,
  onAppendNext,
  style,
}: PageWrapperProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { registerPageRef, onEnterViewportForFirstTime, appendNextPage, onAppendNext: subscribeAppend, offAppendNext } = usePageManager();
  const clickCooldownUntilRef = useRef<number>(0);

  function shouldIgnoreClick(target: Element, container: Element): boolean {
    const interactiveTags = new Set(["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"]);
    let el: Element | null = target;
    while (el && el !== container) {
      if (interactiveTags.has(el.tagName)) return true;
      // 显式标记忽略推进的区域
      if ((el as HTMLElement).dataset && (el as HTMLElement).dataset.nextIgnore !== undefined) return true;
      el = el.parentElement;
    }
    // 文本选择中不推进
    if (typeof window !== "undefined" && window.getSelection && window.getSelection()?.toString()) {
      return true;
    }
    return false;
  }

  const handleClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now < clickCooldownUntilRef.current) return;
    const target = e.target as Element;
    const container = e.currentTarget as Element;
    if (shouldIgnoreClick(target, container)) return;
    appendNextPage(pageNumber, true);
    // 冷却 400ms 防止重复触发
    clickCooldownUntilRef.current = now + 400;
  };

  useEffect(() => {
    registerPageRef(pageNumber, ref.current);
    if (onShow) {
      onEnterViewportForFirstTime(pageNumber, () => {
        onShow?.();
        if (autoAppendNext) {
          appendNextPage(pageNumber, autoScrollToNext);
        }
      });
    }
    if (onAppendNext) {
      subscribeAppend(pageNumber, onAppendNext);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, onShow, autoAppendNext, autoScrollToNext, onAppendNext]);

  useEffect(() => {
    return () => {
      if (onAppendNext) {
        offAppendNext(pageNumber, onAppendNext);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, onAppendNext]);

  return (
    <div
      className={`page-content${className ? ` ${className}` : ""}`} // 移除了 .page 类名，因为外层已包裹
      id={`page${pageNumber}`}
      ref={ref}
      onClickCapture={handleClickCapture}
      style={{ width: '100%', height: '100%', ...style }}
    >
      {children}
    </div>
  );
}
