"use client";
import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";

type PageEntry = {
  el: HTMLElement | null;
  firstEntered: boolean;
  action?: () => void;
};

type PageManagerContextType = {
  showUpTo: number;
  currentPage: number; // Added currentPage to type definition
  registerPageRef: (page: number, el: HTMLElement | null) => void;
  onEnterViewportForFirstTime: (page: number, action: () => void) => void;
  appendNextPage: (by: number, scrollTo?: boolean) => void;
  isActive: (page: number) => boolean;
  onAppendNext: (page: number, cb: () => void) => void;
  offAppendNext: (page: number, cb: () => void) => void;
};

export const PageManagerContext = createContext<PageManagerContextType | null>(null);

export default function PageManagerProvider({ children, totalPages = 24 }: { children: React.ReactNode, totalPages?: number }) {
  const [showUpTo, setShowUpTo] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pagesRef = useRef<Map<number, PageEntry>>(new Map());
  const rootMargin = "-50% 0px -50% 0px";
  const observerRef = useRef<IntersectionObserver | null>(null);
  const appendSubscribersRef = useRef<Map<number, Set<() => void>>>(new Map());
  const scrollAccumRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const cooldownUntilRef = useRef<number>(0);
  const thresholdPxRef = useRef<number>(0);
  const touchEndCooldownRef = useRef<number>(0); // 防止 touchEnd 和 wheel 同时触发

  const registerPageRef = useCallback((page: number, el: HTMLElement | null) => {
    const prev = pagesRef.current.get(page) || { el: null, firstEntered: false };
    pagesRef.current.set(page, { ...prev, el });
    // 即使注册过，也需要重新 observe 确保 onEnterViewportForFirstTime 逻辑（虽然这里是首次注册，但兼容性好）
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  const onEnterViewportForFirstTime = useCallback((page: number, action: () => void) => {
    const prev = pagesRef.current.get(page) || { el: null, firstEntered: false };
    // 重置 firstEntered 标记，确保如果传入新 action，能有机会再次触发（尽管名字叫 ForFirstTime，但结合 showUpTo 逻辑，每次进入可视区都需要触发 reveal）
    // 修改逻辑：这里更名为 onEnterViewport 可能更贴切，但为了兼容旧代码，我们保留名字，但允许通过 observer 每次进入时触发
    // 注意：原始需求是“每次进入页面时，重新显示动画”。
    // 现有的 observer 逻辑只在 !state.firstEntered 时触发。
    // 我们需要修改 observer 的回调逻辑，支持“每次进入”。
    // 但为了避免多次绑定，这里只更新 action。
    pagesRef.current.set(page, { ...prev, action });
    const el = prev.el || (typeof document !== "undefined" ? document.getElementById(`page${page}`) : null);
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  const appendNextPage = useCallback((by: number, scrollTo: boolean = false) => {
    // Check if we are already at max pages
    if (by >= totalPages) return;

    // 推进渲染范围
    setShowUpTo((prev) => (by === prev ? Math.min(prev + 1, totalPages) : prev));
    // 通知由当前页触发的“进入下一页”订阅者，用于隐藏提示等
    const subs = appendSubscribersRef.current.get(by);
    if (subs && subs.size) {
      subs.forEach((cb) => {
        try { cb(); } catch (e) { /* ignore */ }
      });
    }
    if (scrollTo) {
      // 触发转场
      if (by + 1 > currentPage && by + 1 <= totalPages) {
        setCurrentPage(by + 1);
      }
    }
  }, [currentPage, totalPages]);

  const isActive = useCallback((page: number) => page <= showUpTo, [showUpTo]);

  const onAppendNext = useCallback((page: number, cb: () => void) => {
    const set = appendSubscribersRef.current.get(page) || new Set<() => void>();
    set.add(cb);
    appendSubscribersRef.current.set(page, set);
  }, []);

  const offAppendNext = useCallback((page: number, cb: () => void) => {
    const set = appendSubscribersRef.current.get(page);
    if (set) {
      set.delete(cb);
      if (set.size === 0) appendSubscribersRef.current.delete(page);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 按页面编号排序后逐一处理
        const handled = entries
          .map((entry) => {
            const target = entry.target as HTMLElement;
            const id = target?.id || "";
            const match = id.match(/page(\d+)/);
            const page = match ? Number(match[1]) : NaN;
            return { entry, target, page };
          })
          .filter((i) => !Number.isNaN(i.page))
          .sort((a, b) => a.page - b.page);

        handled.forEach(({ entry, target, page }) => {
          const state = pagesRef.current.get(page);
          if (!state) return;
          
          // 修改核心：只要进入视口且是当前页，就触发 action (用于播放动画)
          // 并且当离开视口时，如果需要重置，可以在 action 内部处理或者这里增加 onLeave 回调
          // 简便起见，我们在 action 中执行“播放动画”，而重置逻辑交由组件在 useEffect 依赖 currentPage 变化时处理，
          // 或者更简单的：每次 currentPage 变化，Page 组件重新渲染会重置状态？不一定。
          // 最佳实践：当 currentPage 变为 page 时，触发 onShow。
          
          // 但这里是 IntersectionObserver，它监控的是滚动位置。
          // 我们的架构是 Scroll Snap，currentPage 决定了哪个页面在视口中。
          // 所以其实可以不用 IntersectionObserver 来触发动画，而是直接监听 currentPage 变化。
          // 但为了兼容现有逻辑（onEnterViewportForFirstTime），我们保持 observer，
          // 但去掉 firstEntered 锁，改为“只要是 currentPage 且 intersecting 就触发”。
          
          if (entry.isIntersecting && page === currentPage) {
             state.action?.();
          }
        });
      },
      { rootMargin: "-10% 0px -10% 0px" } // 稍微收缩范围，确保完全进入
    );

    pagesRef.current.forEach((val) => {
      if (val.el) observerRef.current?.observe(val.el);
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [currentPage]); // 依赖 currentPage，确保每次切页都能重新评估

  // 容器滚动/触摸推进
  useEffect(() => {
    if (typeof window === "undefined") return;
    const container = document.getElementById("pages-wrapper");
    if (!container) return;
    thresholdPxRef.current = 15; // 提高一点阈值防止误触？保持 15 灵敏度

    const attemptNavigation = (direction: 'next' | 'prev') => {
      const now = Date.now();
      if (now < cooldownUntilRef.current) return;
      
      if (direction === 'next') {
        if (currentPage < showUpTo) {
          if (currentPage < totalPages) {
             setCurrentPage(prev => prev + 1);
          }
        } else {
          appendNextPage(showUpTo, true);
        }
      } else {
        if (currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      }
      
      // 增加冷却时间到 1000ms，防止连续滚动直接跳两页
      cooldownUntilRef.current = now + 1000;
      scrollAccumRef.current = 0;
      touchStartYRef.current = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now < cooldownUntilRef.current) return;
      
      scrollAccumRef.current += e.deltaY;
      
      // 增加防抖累积判断，不仅仅是阈值，还可以重置
      if (Math.abs(scrollAccumRef.current) >= thresholdPxRef.current) {
        if (scrollAccumRef.current > 0) {
          attemptNavigation('next');
        } else {
          attemptNavigation('prev');
        }
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
    };
    
    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) {
        e.preventDefault();
      }
    };
    
    const onTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now < cooldownUntilRef.current) return;
      if (now < touchEndCooldownRef.current) return; // 避免 touchEnd 后立即触发 wheel (某些设备)
      
      const endY = e.changedTouches[0]?.clientY ?? null;
      if (touchStartYRef.current == null || endY == null) return;
      
      const delta = touchStartYRef.current - endY;
      if (Math.abs(delta) >= thresholdPxRef.current) {
        if (delta > 0) {
          attemptNavigation('next');
        } else {
          attemptNavigation('prev');
        }
      }
      touchStartYRef.current = null;
      touchEndCooldownRef.current = now + 100; 
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [showUpTo, currentPage, appendNextPage, totalPages]);

  const value = useMemo<PageManagerContextType>(() => ({
    showUpTo,
    currentPage,
    registerPageRef,
    onEnterViewportForFirstTime,
    appendNextPage,
    isActive,
    onAppendNext,
    offAppendNext,
  }), [showUpTo, currentPage, registerPageRef, onEnterViewportForFirstTime, appendNextPage, isActive, onAppendNext, offAppendNext]);

  return <PageManagerContext.Provider value={value}>{children}</PageManagerContext.Provider>;
}
