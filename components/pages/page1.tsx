"use client";
import Image from "next/image";
import PageWrapper from "@/components/PageWrapper";
import usePageManager from "@/hooks/usePageManager";
import { useSummary } from "@/contexts/SummaryContext";
import styles from "./styles/page1.module.css";

export default function Page1() {
  const PAGE_NUMBER = 1;
  const { appendNextPage } = usePageManager();
  const { isLoading, error, retry } = useSummary();

  const isBlocking = isLoading || error !== null;

  // Image Mapping
  const col1 = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png",
    "img6.png",
    "img7and10and18.png",
  ];
  const col2 = [
    "img8and16.png",
    "img9and21.png",
    "img7and10and18.png",
    "img11.png",
    "img12.png",
    "img1.png", // Fallback for 13
    "img14.png",
  ];
  const col3 = [
    "img15.png",
    "img8and16.png",
    "img17.png",
    "img7and10and18.png",
    "img19.png",
    "img20.png",
    "img9and21.png",
  ];

  const columns = [col1, col2, col3];

  return (
    <PageWrapper pageNumber={PAGE_NUMBER}>
      <div className={styles.container}>
        {/* Background Grid */}
        <div className={styles.bg}>
          {columns.map((col, colIndex) => (
            <div
              key={colIndex}
              className={`${styles.column} ${styles[`col${colIndex + 1}`]}`}
            >
              {/* Duplicate items for infinite scroll */}
              {[...col, ...col].map((imgName, index) => (
                <div key={index} className={styles.gridItem}>
                  <Image
                    src={`/imgs/page1/${imgName}`}
                    alt=""
                    fill
                    className={styles.itemImage}
                    sizes="15vw"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {isBlocking ? (
          <div className="loading-overlay" data-next-ignore="true">
            <div className="loading-spinner" />
            {error ? (
              <>
                <p>
                  加载失败<span className="loading-animation">...</span>
                </p>
                <p style={{ paddingInline: "1.5rem", textAlign: "center" }}>
                  {error}
                </p>
                <button
                  type="button"
                  data-next-ignore="true"
                  onClick={retry}
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
                浪漫的年度总结即将开始<span className="loading-animation">...</span>
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
              <button
                className={styles.startBtn}
                onClick={() => appendNextPage(PAGE_NUMBER, true)}
              >
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
