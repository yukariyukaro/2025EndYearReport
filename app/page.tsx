import Layout from "@/components/layout";
import Page1 from "@/components/pages/page1";
import Page2 from "@/components/pages/page2";

export default function Home() {
  return (
    <Layout>
      {/* 背景音乐（复制2024行为） */}
      <audio id="bgm" src="/audio/bgm.mp3" preload="auto" />
      <div className="pages-wrapper">
        <Page1 />
        <Page2 />
      </div>
    </Layout>
  );
}
