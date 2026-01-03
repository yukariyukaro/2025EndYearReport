import { useRef, useCallback, useEffect } from 'react';
import usePageManager from './usePageManager';

export function useRevealAnimation(pageNumber: number) {
  const { currentPage } = usePageManager();
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // 离开页面时重置全局动画状态
  useEffect(() => {
    if (currentPage !== pageNumber) {
      clearTimers();
      // 重置标准全局动画 (.hide -> .reveal-active)
      document.querySelectorAll<HTMLElement>(".reveal-active").forEach((el) => {
        el.classList.remove("reveal-active");
        el.classList.add("hide");
      });
      // 重置扩展全局动画 (.reveal -> .visible)
      document.querySelectorAll<HTMLElement>(".visible").forEach((el) => {
        el.classList.remove("visible");
        // 注意：这里不需要 add('hide')，因为 .reveal 类本身就是隐藏状态
      });
    }
  }, [currentPage, pageNumber, clearTimers]);

  // 组件卸载清理
  useEffect(() => () => clearTimers(), [clearTimers]);

  const reveal = useCallback((selector: string, delayMs: number, options?: { durationMs?: number; activeClass?: string; initialClass?: string }) => {
    const activeClass = options?.activeClass || "reveal-active";
    const initialClass = options?.initialClass || "hide";
    const durationMs = options?.durationMs || 1000;

    // 立即重置状态（防闪烁关键）
    document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
      el.classList.remove(activeClass);
      el.classList.add(initialClass);
      el.style.setProperty("--reveal-duration", `${durationMs}ms`);
    });

    const timer = setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.add(activeClass);
      });
    }, delayMs);
    timersRef.current.push(timer);
  }, []);

  const addTimer = useCallback((timer: NodeJS.Timeout) => {
    timersRef.current.push(timer);
  }, []);

  return { reveal, clearTimers, addTimer };
}
