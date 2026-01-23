//token：eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiLpqazmlpnmsLTlk5Tlk5TmnLoiLCJhdWQiOiJDVUhLZXIiLCJpYXQiOjE3Njg1NzMwNTMuMDE5OTg1LCJleHAiOjE3NjkxNzc4NTMuMDE5OTg1LCJ1c2VyX2l0c2MiOiIxMTU1MjExMjI2IiwidXNlcl9zY2hvb2xfbGFiZWwiOiJDVUhLIiwicGxhdGZvcm0iOiJ3ZWNoYXQifQ.-x2gFDHACpFVohLB4yLqP8_nZ66KNYtuOXiT2yBUqP4
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

// 开发阶段使用的默认 Token
const DEV_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiLpqazmlpnmsLTlk5Tlk5TmnLoiLCJhdWQiOiJDVUhLZXIiLCJpYXQiOjE3Njg1NzMwNTMuMDE5OTg1LCJleHAiOjE3NjkxNzc4NTMuMDE5OTg1LCJ1c2VyX2l0c2MiOiIxMTU1MjExMjI2IiwidXNlcl9zY2hvb2xfbGFiZWwiOiJDVUhLIiwicGxhdGZvcm0iOiJ3ZWNoYXQifQ.-x2gFDHACpFVohLB4yLqP8_nZ66KNYtuOXiT2yBUqP4";

// 简单的 JWT 解析函数
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

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
  appName: string;
  launchDate: string;
  retry: () => void;
}

const SummaryContext = createContext<SummaryContextType | null>(null);

export function SummaryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 使用 useMemo 解析 URL 参数，确保在渲染期间稳定
  // 注意：在 Next.js App Router 中，window 可能在服务端未定义，但在 "use client" 组件的初始渲染中通常可以安全访问
  const { urlItsc, schoolLabel, token } = useMemo(() => {
    if (typeof window === 'undefined') {
        return { urlItsc: "ivanfan", schoolLabel: "HKU", token: DEV_TOKEN };
    }
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    
    // 优先使用 URL 中的 token，否则使用 DEV_TOKEN
    const activeToken = urlToken || DEV_TOKEN;
    
    // 尝试从 Token 解析用户信息
    const payload = parseJwt(activeToken);
    // 注意：Token 可能不包含 user_itsc，这里仅作为 Fallback
    const extractedItsc = payload?.user_itsc || params.get("user_itsc") || "ivanfan";
    const extractedSchool = payload?.user_school_label || params.get("user_school_label") || "HKU";

    return {
      urlItsc: extractedItsc,
      schoolLabel: extractedSchool,
      token: activeToken
    };
  }, []);

  const userItsc = useMemo(() => {
    if (data?.pages?.page1?.nickname) {
      return data.pages.page1.nickname;
    }
    return urlItsc;
  }, [data, urlItsc]);

  const { appName, launchDate } = useMemo(() => {
    const label = data?.pages?.page3?.school_label || schoolLabel;

    let resolvedAppName = "噗噗";
    let resolvedLaunchDate = "2020-10-31";

    switch (label) {
      case "HKU":
        resolvedAppName = "噗噗";
        resolvedLaunchDate = "2020-10-31";
        break;
      case "UST":
        resolvedAppName = "星尘";
        resolvedLaunchDate = "2020-05-02";
        break;
      case "CUHK":
        resolvedAppName = "哔哔机";
        resolvedLaunchDate = "2020-08-24";
        break;
      default:
        resolvedAppName = "噗噗";
        resolvedLaunchDate = "2020-10-31";
    }

    return { appName: resolvedAppName, launchDate: resolvedLaunchDate };
  }, [data, schoolLabel]);

  const fetchSummary = useCallback(async () => {
    const url = `https://api.uuunnniii.com/v4/report2025/get.php`;

    setIsLoading(true);
    setError(null);

    try {
      // 构建 Form Data
      const formData = new FormData();
      formData.append('token', token);

      const res = await fetch(url, { 
        method: "POST",
        body: formData 
      });
      
      const json = (await res.json()) as {
        code?: number;
        success?: boolean; // 兼容旧字段
        data?: SummaryData;
        msg?: string;
        message?: string; // 兼容旧字段
      };

      console.log('[SummaryContext] Report Data:', json);

      if (json && (json.code === 200 || json.success === true) && json.data) {
        setData(json.data);
      } else {
        const msg = json?.msg || json?.message || "数据格式错误或加载失败";
        setError(msg);
      }
    } catch (e) {
      console.error('[SummaryContext] Error:', e);
      setError("网络请求失败，请检查网络连接");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

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
        userItsc,
        appName,
        launchDate,
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
