"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

// 根据 .tasks/后端返回.md 定义数据类型
// 这里使用 partial definition，后续可根据需要补全
export type PageData = Record<string, unknown>;

export interface SummaryData {
  user_id: number;
  generated_at: string;
  pages: Record<string, PageData> & {
    page1: {
      nickname: string;
      greeting: string;
    };
    page2: {
      launch_time: string;
      register_time: string;
      days_together: number;
      register_rank: number;
      time_capsule: {
        year: number;
        month: number;
        top_posts: number[];
      };
    };
  };
}

interface SummaryContextType {
  data: SummaryData | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const SummaryContext = createContext<SummaryContextType | null>(null);

export function SummaryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    const url =
      "https://api.uuunnniii.com/v4/report2025/get.php?user_itsc=ivanfan&user_school_label=HKU";

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
    } catch (err) {
      setError("网络请求失败，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  }, []);

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
