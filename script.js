// ==========================================================
// 自転車広告広場 - 表示・月間カウンター
// ==========================================================

// この版では、アクセス数・広告クリック数を
// 「1か月単位」で集計します。
//
// 例：
// 2026年9月なら
// 9月1日 00:00 ～ 9月30日 23:59
//
// 重要：
// 現在は localStorage を使っているため、
// 「この端末・このブラウザ内だけ」の簡易カウンターです。
//
// 公開後に全ユーザー分を合算するには、
// データベースやアクセス解析サービスが必要です。



// ==========================================
// 現在の年月を取得
// ==========================================

function getMonthKey() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      '0'
    );

  return `${year}-${month}`;
}



// 例：2026-09
const MONTH_KEY =
  getMonthKey();



// 月ごとに別々の保存場所を作る
const CLICK_KEY =
  `bicycleAdSquareClicks:${MONTH_KEY}`;

const VIEW_KEY =
  `bicycleAdSquareViews:${MONTH_KEY}`;





// ==========================================
// localStorageから数字を取得
// ==========================================

function getNumber(key) {

  return Number(
    localStorage.getItem(key) || 0
  );

}



// ==========================================
// localStorageへ数字を保存
// ==========================================

function setNumber(
  key,
  value
) {

  localStorage.setItem(
    key,
    String(value)
  );

}





// ==========================================
// HTML文字の安全対策
// ==========================================

function escapeHtml(text) {

  return String(text)

    .replaceAll(
      '&',
      '&amp;'
    )

    .replaceAll(
      '<',
      '&lt;'
    )

    .replaceAll(
      '>',
      '&gt;'
    )

    .replaceAll(
      '"',
      '&quot;'
    )

    .replaceAll(
      "'",
      '&#039;'
    );

}





// ==========================================
// URLチェック
// ==========================================

function safeUrl(url) {

  try {

    const parsed =
      new URL(url);

    return [
      'http:',
      'https:'
    ].includes(
      parsed.protocol
    )
      ? parsed.href
      : '#';

  }

  catch {

    return '#';

  }

}





// ==========================================
// 広告カードを表示
// ==========================================

function renderAds() {

  const grid =
    document.getElementById(
      'adGrid'
    );


  const ads =
    Array.isArray(
      window.AD_DATA
    )
      ? window.AD_DATA
      : [];


  grid.innerHTML =
    ads.map(
      ad => `

        <article class="ad-card">


          <div class="ad-card__topline">

            <span class="tag">
              ${escapeHtml(ad.category)}
            </span>

            <span class="status">
              ${escapeHtml(ad.status)}
            </span>

          </div>


          <h3>
            ${escapeHtml(ad.title)}
          </h3>


          <p>
            ${escapeHtml(ad.description)}
          </p>


          <div class="meta">
            ${escapeHtml(ad.meta)}
          </div>


          <a
            class="card-link"

            href="${safeUrl(ad.url)}"

            target="_blank"

            rel="noopener"

            data-ad="${escapeHtml(ad.id)}"
          >

            ${escapeHtml(ad.buttonText)}

            <span>
              →
            </span>

          </a>


        </article>

      `
    ).join('');

}



// 広告表示実行
renderAds();





// ==========================================
// 今月のアクセス数
// ==========================================

// ページを開くたびに
// 1アクセス追加

const views =
  getNumber(
    VIEW_KEY
  ) + 1;


setNumber(
  VIEW_KEY,
  views
);





// ==========================================
// 今月の広告クリック数
// ==========================================

let clicks =
  getNumber(
    CLICK_KEY
  );





// ==========================================
// HTMLの表示場所を取得
// ==========================================

const pageViews =
  document.getElementById(
    'pageViews'
  );


const adClicks =
  document.getElementById(
    'adClicks'
  );





// ==========================================
// アクセス数表示
// ==========================================

pageViews.textContent =
  views.toLocaleString(
    'ja-JP'
  );



// ==========================================
// クリック数表示
// ==========================================

adClicks.textContent =
  clicks.toLocaleString(
    'ja-JP'
  );





// ==========================================
// 広告ボタンが押された場合
// ==========================================

document
  .querySelectorAll(
    '[data-ad]'
  )
  .forEach(
    link => {

      link.addEventListener(
        'click',
        () => {

          clicks += 1;


          setNumber(
            CLICK_KEY,
            clicks
          );


          adClicks.textContent =
            clicks.toLocaleString(
              'ja-JP'
            );

        }
      );

    }
  );





// ==========================================
// Gmail問い合わせ
// ==========================================

const config =
  window.SITE_CONFIG || {};



const gmailContact =
  document.getElementById(
    'gmailContact'
  );



const to =
  String(
    config.contactEmail || ''
  ).trim();



const subject =
  encodeURIComponent(
    config.gmailSubject ||
    '自転車広告掲載について'
  );



const toParam =
  to
    ? `&to=${encodeURIComponent(to)}`
    : '';



gmailContact.href =
  `https://mail.google.com/mail/?view=cm&fs=1${toParam}&su=${subject}`;