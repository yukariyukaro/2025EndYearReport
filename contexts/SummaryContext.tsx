"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useMemo,
} from "react";
import { getOptimizedAIImageUrl, preloadImage } from "@/utils/resources";

// 根据 .tasks/后端返回.md 定义数据类型
// 这里使用 any 以避免大量的 TS 类型检查错误，后续可补全详细 interface
export type PageData = any;

export interface SummaryData {
  user_id: number;
  generated_at: string;
  pages: Record<string, PageData>;
}

interface SummaryContextType {
  data: SummaryData | null;
  isLoading: boolean;
  error: string | null;
  userItsc: string;
  retry: () => void;
}

const SummaryContext = createContext<SummaryContextType | null>(null);

export function SummaryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 使用 useMemo 解析 URL 参数，确保在渲染期间稳定
  // 注意：在 Next.js App Router 中，window 可能在服务端未定义，但在 "use client" 组件的初始渲染中通常可以安全访问
  // 或者将其放入 effect 中设置 state，但为了尽早获取，我们尝试直接解析
  const { itsc, schoolLabel } = useMemo(() => {
    if (typeof window === 'undefined') return { itsc: "ivanfan", schoolLabel: "HKU" };
    const params = new URLSearchParams(window.location.search);
    return {
      itsc: params.get("user_itsc") || "ivanfan",
      schoolLabel: params.get("user_school_label") || "HKU"
    };
  }, []);

  // 触发预加载逻辑：一旦确定了 itsc，立即预加载 page21 的图片
  useEffect(() => {
    if (itsc) {
      // 预加载优化后的图片，确保进入 page21 时可以立即显示
      const url = getOptimizedAIImageUrl(itsc);
      preloadImage(url);
      console.log(`[SummaryContext] Preloading Optimized AI Image for ${itsc}: ${url}`);
    }
  }, [itsc]);

  const fetchSummary = useCallback(async () => {
    const url = `https://api.uuunnniii.com/v4/report2025/get.php?user_itsc=${itsc}&user_school_label=${schoolLabel}`;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(url, { method: "GET" });
      const json = (await res.json()) as {
        success?: boolean;
        data?: SummaryData;
        message?: string;
      };

      if (json && json.success === true && json.data) {
        setData(json.data);
      } else {
        const msg = json?.message || "数据格式错误或加载失败";
        setError(msg);
      }
    } catch {
      setError("网络请求失败，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  }, [itsc, schoolLabel]);

  // Mount 时立即请求
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <SummaryContext.Provider
      value={{
        data,
        isLoading,
        error,
        userItsc: itsc,
        retry: fetchSummary,
      }}
    >
      {children}
    </SummaryContext.Provider>
  );
}

export function useSummary() {
  const context = useContext(SummaryContext);
  if (!context) {
    throw new Error("useSummary must be used within a SummaryProvider");
  }
  return context;
}
