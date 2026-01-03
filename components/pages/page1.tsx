"use client";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { useCallback, useMemo, useState } from "react";
import styles from "./styles/page1.module.css";

type LoadStatus =
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

export default function Page1() {
  const PAGE_NUMBER = 1;
  const { appendNextPage } = usePageManager();
  const enableReportFetch = process.env.NEXT_PUBLIC_ENABLE_REPORT_FETCH === "1";
  const [status, setStatus] = useState<LoadStatus>(() =>
    enableReportFetch ? { type: "loading" } : { type: "success" }
  );

  const fetchSummary = useCallback(async () => {
    if (!enableReportFetch) {
      return;
    }
    const url =
      "https://api.uuunnniii.com/v4/report2025/get.php?user_itsc=ivanfan&user_school_label=HKU";

    setStatus({ type: "loading" });

    try {
      const res = await fetch(url, { method: "GET" });
      const data = (await res.json()) as unknown;

      if (
        data &&
        typeof data === "object" &&
        "success" in data &&
        (data as { success?: unknown }).success === true
      ) {
        setStatus({ type: "success" });
        return;
      }

      const message =
        data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as { message?: unknown }).message === "string"
          ? (data as { message: string }).message
          : "加载失败";

      setStatus({ type: "error", message });
    } catch {
      setStatus({ type: "error", message: "加载失败" });
    }
  }, [enableReportFetch]);

  const isBlocking = status.type !== "success";
  const bgImgClassName = useMemo(
    () => `${styles.objectCover}${isBlocking ? ` ${styles.bgLoadingImg}` : ""}`,
    [isBlocking]
  );

  return (
    <PageWrapper pageNumber={PAGE_NUMBER}>
      <div className={styles.container}>
        {/* Background Image */}
        <div className={styles.bg}>
          <Image
            src="/imgs/page1/封面1.png"
            alt="Page 1 Background"
            fill
            className={bgImgClassName}
            priority
          />
        </div>

        {isBlocking ? (
          <div className="loading-overlay" data-next-ignore="true">
            <div className="loading-spinner" />
            {status.type === "error" ? (
              <>
                <p>
                  加载失败<span className="loading-animation">...</span>
                </p>
                <p style={{ paddingInline: "1.5rem", textAlign: "center" }}>
                  {status.message}
                </p>
                <button
                  type="button"
                  data-next-ignore="true"
                  onClick={fetchSummary}
                  style={{
                    marginTop: "0.75rem",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "999rem",
                    border: "none",
                    background: "rgba(255,255,255,0.12)",
                    color: "#fff",
                  }}
                >
                  重试
                </button>
              </>
            ) : (
              <p>
                正在布置爱丽丝的兔子洞<span className="loading-animation">...</span>
              </p>
            )}
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.titleCard}>
              <div className={styles.titleHeader}>
                <h1 className={styles.titleEn}>TRIPLE UNI</h1>
                <h2 className={styles.titleCn}>年度总结</h2>
              </div>
              <div className={styles.schoolList}>
                <div className={`${styles.schoolBadge} ${styles.cuhk}`}>CUHK</div>
                <div className={`${styles.schoolBadge} ${styles.hku}`}>HKU</div>
                <div className={`${styles.schoolBadge} ${styles.hkust}`}>HKUST</div>
              </div>
            </div>

            <div className={styles.footer}>
              <button className={styles.startBtn} onClick={() => appendNextPage(PAGE_NUMBER, true)}>
                <span className={styles.startBtnText}>立即开启</span>
              </button>
              <p className={styles.privacy}>点击即代表您同意隐私政策</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
