"use client";
import { useEffect, useMemo, useState } from "react";

export default function Page2() {
  const PAGE_NUMBER = 2;

  // 稳定的“当前时间”只在首次渲染初始化一次，避免 impure 函数警告
  const [now] = useState(() => Date.now());

  // 模拟的后端数据（使用稳定 now 计算差值）
  const summary = {
    user_create_date: "2023-07-28",
    user_school_label: "UST" as "HKU" | "UST" | "CUHK",
    user_create_date_till_now: Math.floor((now - new Date("2023-07-28").getTime()) / (1000 * 60 * 60 * 24)),
    user_create_date_rank: 12345,
    user_age: true,
  } as const;

  const appName = "TripleUNI";

  const appAge = useMemo(() => {
    let date: Date;
    switch (summary.user_school_label.toUpperCase()) {
      case "HKU":
        date = new Date("2020-10-31");
        break;
      case "UST":
        date = new Date("2020-05-02");
        break;
      case "CUHK":
        date = new Date("2020-08-24");
        break;
      default:
        date = new Date("2023-07-28");
    }
    const diffTime = now - date.getTime();
    return {
      year: Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365)),
      month: Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)),
      day: Math.floor((diffTime % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)),
    };
  }, [summary.user_school_label, now]);

  const userRegisterDate = useMemo(() => {
    const date = new Date(summary.user_create_date);
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }, [summary.user_create_date]);

  const [showHint, setShowHint] = useState(false);

  // 文本逐行左→右浮现
  function reveal(selector: string, delayMs: number, durationMs = 1200) {
    setTimeout(() => {
      document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.classList.remove("hide");
        el.classList.add("reveal-line");
        el.style.setProperty("--reveal-duration", `${durationMs}ms`);
        // 注：我们将延迟通过时序控制（setTimeout），这里不再设置 --reveal-delay
      });
    }, delayMs);
  }

  function onShow() {
    let t = 0;
    const stepSlow = 2000; // 逐行间隔更慢，避免“出现过快”问题

    // 第一段文字
    reveal(".pt1 > p:nth-child(1)", (t += stepSlow));
    reveal(".pt1 > p:nth-child(2)", (t += stepSlow));

    // 装饰图元素按原动画出现
    reveal(".bottle", (t += stepSlow));
    reveal(".pt1 div:nth-child(3) p:nth-child(1)", (t += stepSlow));
    reveal(".pt1 div:nth-child(3) p:nth-child(2)", (t += stepSlow));
    reveal(".pt1 div:nth-child(4) p:nth-child(1)", (t += stepSlow));
    reveal(".pt1 div:nth-child(4) p:nth-child(2)", (t += stepSlow));
    reveal(".bird", (t += stepSlow));
    reveal(".pt1 p:nth-child(5)", (t += stepSlow + 900));

    // 第二段文字（居中大字与括号）
    reveal(".pt2 > p:nth-child(1)", (t += stepSlow));
    reveal(".pt2 > p:nth-child(2)", (t += stepSlow));
    reveal(".pt2 > p:nth-child(3)", (t += stepSlow));

    setTimeout(() => setShowHint(true), (t += 600));
  }

  useEffect(() => {
    const target = document.getElementById(`page${PAGE_NUMBER}`);
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onShow();
          observer.unobserve(entries[0].target);
        }
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`page page${PAGE_NUMBER} page3`} id={`page${PAGE_NUMBER}`}>
      <div className={`content-block pt1`}>
        <p className="hide">到今天</p>
        <p className="hide">
          {appName}已经诞生
          <span className="figure">{appAge.year}</span>年
          <span className="figure">{appAge.month}</span>月
          <span className="figure">{appAge.day}</span>日啦!
        </p>

        {summary.user_create_date ? (
          <div>
            <p className="hide">
              <span className="figure">{userRegisterDate.year}</span>年
              <span className="figure">{userRegisterDate.month}</span>月
              <span className="figure">{userRegisterDate.day}</span>日
            </p>
            <p className="hide">是你和{appName}第一次见面的日子</p>
          </div>
        ) : (
          <div>
            <p className="hide">我们已经认识了<span className="accent">很久了</span></p>
            <p className="hide">久到{appName}都已经忘记和你第一次见面的日子</p>
          </div>
        )}

        {summary.user_age ? (
          <div>
            <p className="hide">
              {appName}与你相伴已经
              <span className="figure">{summary.user_create_date_till_now}</span>天了
            </p>
            <p className="hide">还是如此一往情深 !</p>
          </div>
        ) : (
          <div>
            <p className="hide">我们一路走来</p>
            <p className="hide">还是如此一往情深 !</p>
          </div>
        )}

        {summary.user_create_date_rank ? (
          <p className="hide">
            你是第<span className="figure">{summary.user_create_date_rank}</span>个注册{appName}的用户
          </p>
        ) : (
          <p className="hide no-wrap">
            这些相伴的日子里，{appName}永远是你安心的兔子洞
          </p>
        )}

        <div className="img-wrapper">
          <img src="https://i.boatonland.com/report2024/assets/imgs/3/bg.svg" alt="" className="bg" />
          <img src="https://i.boatonland.com/report2024/assets/imgs/3/bottle.svg" alt="" className="decor bottle hide" />
          <img src="https://i.boatonland.com/report2024/assets/imgs/3/wave.svg" alt="" className="decor wave" />
          <img src="https://i.boatonland.com/report2024/assets/imgs/3/bird.svg" alt="" className="decor bird hide" />
        </div>
      </div>

      <div className="content-block pt2">
        <p className="text hide">——</p>
        <p className="text highlight hide">{appName}我真是万人迷呀</p>
        <p className="hide">(得意)</p>
      </div>

      {showHint && (
        <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, textAlign: "center", opacity: 0.8 }}>
          ↑ 上滑继续
        </div>
      )}
    </div>
  );
}
