import Layout from "@/components/layout";
import Pages, { TOTAL_PAGES } from "@/components/Pages";
import PageManagerProvider from "@/components/PageManagerProvider";
import Footer from "@/components/Footer";
import { SummaryProvider } from "@/contexts/SummaryContext";
import MusicToggle from "@/components/MusicToggle";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  return (
    <Layout>
      <SummaryProvider>
        <PageManagerProvider totalPages={TOTAL_PAGES}>
          {/* 背景音乐（复制2024行为） */}
          <audio id="bgm" src={`${basePath}/audio/bgm.mp3`} preload="auto" loop />
          <MusicToggle />
          <div className="pages-wrapper" id="pages-wrapper">
            <Pages />
          </div>
          <Footer />
        </PageManagerProvider>
      </SummaryProvider>
    </Layout>
  );
}
