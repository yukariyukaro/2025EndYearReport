import Layout from "@/components/layout";
import Pages, { TOTAL_PAGES } from "@/components/Pages";
import PageManagerProvider from "@/components/PageManagerProvider";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Layout>
      <PageManagerProvider totalPages={TOTAL_PAGES}>
        {/* 背景音乐（复制2024行为） */}
        <audio id="bgm" src="/audio/bgm.mp3" preload="auto" loop />
        <div className="pages-wrapper" id="pages-wrapper">
          <Pages />
        </div>
        <Footer />
      </PageManagerProvider>
    </Layout>
  );
}
