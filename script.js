// 訂閱適性測驗：每一題都用簡單分數，讓結果容易理解。
const 題目資料 = [
  {題目:"你的商品或服務，顧客會重複購買或使用嗎？",選項:[["經常會",20],["偶爾會",12],["幾乎不會",3]]},
  {題目:"顧客通常多久需要再次購買？",選項:[["一個月內",18],["一到三個月",14],["超過三個月",7]]},
  {題目:"顧客是否容易因為忙碌而忘記補貨或預約？",選項:[["很容易",16],["有時候",10],["不太會",3]]},
  {題目:"顧客是否需要持續性的服務、內容或陪伴？",選項:[["非常需要",18],["部分需要",10],["單次就足夠",2]]},
  {題目:"你能預測顧客的使用或補貨週期嗎？",選項:[["相當明確",16],["大致可預測",10],["不容易預測",3]]},
  {題目:"你能提供會員才有的專屬權益嗎？",選項:[["可以，且很有吸引力",12],["可以嘗試",7],["目前很困難",2]]}
];

let 目前題號 = 0;
const 回答分數 = [];
const 題目容器 = document.querySelector("#題目容器");
const 下一題按鈕 = document.querySelector("#下一題");
const 上一題按鈕 = document.querySelector("#上一題");

function 顯示題目() {
  const 現在題目 = 題目資料[目前題號];
  document.querySelector("#進度文字").textContent = `問題 ${目前題號 + 1}／${題目資料.length}`;
  document.querySelector("#進度條").style.width = `${((目前題號 + 1) / 題目資料.length) * 100}%`;
  題目容器.innerHTML = `<span class="題目標記">請選擇最接近的情況</span><h3 class="題目">${現在題目.題目}</h3><div class="選項">${現在題目.選項.map(([文字],索引) => `<button type="button" class="${回答分數[目前題號]?.索引 === 索引 ? "已選" : ""}" aria-pressed="${回答分數[目前題號]?.索引 === 索引}" data-索引="${索引}">${文字}</button>`).join("")}</div>`;
  下一題按鈕.disabled = !回答分數[目前題號];
  下一題按鈕.innerHTML = 目前題號 === 題目資料.length - 1 ? "查看我的結果 <b>→</b>" : "下一題 <b>→</b>";
  上一題按鈕.style.visibility = 目前題號 === 0 ? "hidden" : "visible";
  document.querySelectorAll("[data-索引]").forEach(按鈕 => 按鈕.addEventListener("click", () => {
    const 索引 = Number(按鈕.dataset.索引);
    回答分數[目前題號] = {索引,分數:現在題目.選項[索引][1]};
    顯示題目();
    題目容器.querySelector(`[data-索引="${索引}"]`)?.focus();
  }));
}

function 顯示結果() {
  const 分數 = 回答分數.reduce((總和,回答) => 總和 + 回答.分數, 0);
  const 模式 = 分數 >= 76 ? "定期配送型＋會員權益型" : 分數 >= 52 ? "會員權益型＋持續服務型" : "先從會員權益型開始";
  const 建議 = 分數 >= 76 ? "你的商品有明顯的重複需求與持續價值，很適合著手規劃訂閱。" : 分數 >= 52 ? "你具備發展訂閱的基礎，可先用小型方案驗證顧客的續訂意願。" : "目前更適合先建立會員關係、蒐集使用週期，再逐步測試訂閱方案。";
  題目容器.innerHTML = `<div class="結果"><small>你的商品訂閱適性</small><h3><strong>${分數}</strong> 分</h3><p>${建議}</p><p><b>建議模式：</b>${模式}</p></div>`;
  document.querySelector("#進度文字").textContent = "測驗完成";
  document.querySelector("#進度條").style.width = "100%";
  下一題按鈕.style.display = "none";
  上一題按鈕.textContent = "← 重新測驗";
  上一題按鈕.style.visibility = "visible";
}

// 只有品牌合作頁有測驗；其他頁面略過。
if (題目容器) {
下一題按鈕.addEventListener("click", () => { if (目前題號 === 題目資料.length - 1) 顯示結果(); else {目前題號++;顯示題目();} });
上一題按鈕.addEventListener("click", () => { if (下一題按鈕.style.display === "none") {目前題號 = 0;回答分數.length = 0;下一題按鈕.style.display = "block";顯示題目();} else {目前題號--;顯示題目();} });
顯示題目();
}

// 結構化資料已直接寫在各頁的 <head>，搜尋引擎不需執行 JavaScript 就能讀到。

// 無 JavaScript 時導覽保持可見。手機版支援展開、關閉及 Escape。
const 選單按鈕 = document.querySelector(".menu-toggle");
const 導覽選單 = document.querySelector("#navigation");
const 手機版 = window.matchMedia("(max-width: 1023px)");
function 關閉選單() {
  選單按鈕.setAttribute("aria-expanded", "false");
  導覽選單.hidden = 手機版.matches;
}
選單按鈕.hidden = false;
關閉選單();
手機版.addEventListener("change", 關閉選單);
選單按鈕.addEventListener("click", () => {
  const 展開 = 選單按鈕.getAttribute("aria-expanded") !== "true";
  選單按鈕.setAttribute("aria-expanded", String(展開));
  導覽選單.hidden = !展開;
});
導覽選單.addEventListener("click", (事件) => { if (事件.target.closest("a")) 關閉選單(); });
document.addEventListener("keydown", (事件) => {
  if (事件.key === "Escape" && 手機版.matches && !導覽選單.hidden) {
    關閉選單(); 選單按鈕.focus();
  }
});

// 回饋表單只使用可公開的發佈金鑰，不能讀取或管理資料庫內容。
const 回饋表單 = document.querySelector("#回饋表單");
const 回饋提示 = document.querySelector("#回饋提示");
const 送出回饋按鈕 = 回饋表單?.querySelector("button[type='submit']");
const 回饋資料庫網址 = "https://hxyfgbmnynyvxbpohstw.supabase.co/rest/v1/feedback";
const 回饋發佈金鑰 = "sb_publishable_PvGaE8fLtCKHj8a3Bl_IRg_Rt-67dzc";

回饋表單?.addEventListener("submit", async (事件) => {
  事件.preventDefault();
  if (!回饋表單.checkValidity()) {
    回饋表單.reportValidity();
    return;
  }

  const 表單資料 = new FormData(回饋表單);
  送出回饋按鈕.disabled = true;
  delete 回饋提示.dataset.state;
  回饋提示.textContent = "正在送出回饋…";

  try {
    const 回應 = await fetch(回饋資料庫網址, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": 回饋發佈金鑰,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({
        name: 表單資料.get("姓名"),
        email: 表單資料.get("電子信箱"),
        message: (回饋表單.dataset.source ? `【${回饋表單.dataset.source}】` : "") + 表單資料.get("回饋內容")
      })
    });

    if (!回應.ok) throw new Error("回饋暫時無法送出");
    回饋表單.reset();
    回饋提示.dataset.state = "ok";
    回饋提示.textContent = "已送出，謝謝你的回饋！";
  } catch (錯誤) {
    回饋提示.dataset.state = "error";
    回饋提示.textContent = "沒有送出成功，你填的內容還在。請稍後再按一次「送出回饋」，或直接來信 fm21407@gmail.com。";
  } finally {
    送出回饋按鈕.disabled = false;
  }
});
