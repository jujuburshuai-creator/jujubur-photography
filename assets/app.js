(() => {
  const data = window.PORTFOLIO_DATA;
  const photos = data.photos;
  const byId = Object.fromEntries(photos.map((photo) => [photo.id, photo]));
  const app = document.querySelector("#app");
  let currentLightboxIds = [];
  let currentLightboxIndex = 0;
  let lastFocused = null;
  let touchStartX = 0;
  const designTemplates = [
    {
      id: "ise", number: "01", type: "PPT", pages: "16 PAGES",
      title: "信息学院汇报模板", subtitle: "三套配色系统",
      description: "围绕信息科学与工程学院的视觉识别展开，包含蓝白、红金、蓝金三套配色，覆盖封面、目录、图文、数据与结尾页。",
      previews: [
        {label:"蓝 + 白", src:"/assets/templates/previews/ise-blue-white.jpg"},
        {label:"红 + 金", src:"/assets/templates/previews/ise-red-gold.jpg"},
        {label:"蓝 + 金", src:"/assets/templates/previews/ise-blue-gold.jpg"}
      ],
      downloads: [
        {label:"下载蓝白版", meta:"PPTX · 58 MB", href:"/assets/templates/downloads/ise-blue-white.pptx", filename:"信息科学与工程学院汇报模板_蓝+白.pptx"},
        {label:"下载红金版", meta:"PPTX · 63 MB", href:"/assets/templates/downloads/ise-red-gold.pptx", filename:"信息科学与工程学院汇报模板_红+金.pptx"},
        {label:"下载蓝金版", meta:"PPTX · 58 MB", href:"/assets/templates/downloads/ise-blue-gold.pptx", filename:"信息科学与工程学院汇报模板_蓝+金.pptx"}
      ]
    },
    {
      id: "seu-palette", number: "02", type: "PPT", pages: "12 PAGES",
      title: "东大配色", subtitle: "墨绿与金色",
      description: "提取东南大学标志性的墨绿与金色，以校园建筑、涌泉池与传统纹样作为视觉线索，适合正式汇报与学生组织展示。",
      previews: [{label:"完整预览", src:"/assets/templates/previews/seu-palette.jpg"}],
      downloads: [{label:"下载模板", meta:"PPTX · 52 MB", href:"/assets/templates/downloads/seu-palette.pptx", filename:"东南大学汇报模板-东大配色.pptx"}]
    },
    {
      id: "student-blue", number: "03", type: "PPT", pages: "16 PAGES",
      title: "校会蓝", subtitle: "清晰的校园表达",
      description: "明快蓝色搭配建筑线稿与模块化版式，信息层级直观，适用于学生会述职、工作总结与校园项目汇报。",
      previews: [{label:"完整预览", src:"/assets/templates/previews/student-union-blue.jpg"}],
      downloads: [{label:"下载模板", meta:"PPTX · 62 MB", href:"/assets/templates/downloads/student-union-blue.pptx", filename:"东南大学汇报模板-校会蓝.pptx"}]
    },
    {
      id: "deep-green", number: "04", type: "PPT", pages: "15 PAGES",
      title: "深墨绿", subtitle: "克制、稳重、有层次",
      description: "以深墨绿建立沉静基调，通过线描建筑、留白与金色细节强化秩序感，适合答辩、总结和正式主题分享。",
      previews: [{label:"完整预览", src:"/assets/templates/previews/deep-green.jpg"}],
      downloads: [{label:"下载模板", meta:"PPTX · 94 MB", href:"/assets/templates/downloads/deep-green.pptx", filename:"东南大学汇报模板-深墨绿.pptx"}]
    },
    {
      id: "elegant-red", number: "05", type: "PPT", pages: "10 PAGES",
      title: "典雅红", subtitle: "校史质感与现代排版",
      description: "深红、鎏金与老照片共同营造典雅的历史氛围，聚焦校史、院系介绍与人文主题，同时保留现代信息排版的效率。",
      previews: [{label:"完整预览", src:"/assets/templates/previews/elegant-red.jpg"}],
      downloads: [
        {label:"下载模板", meta:"PPTX · 47 MB", href:"/assets/templates/downloads/elegant-red.pptx", filename:"东南大学汇报模板-典雅红.pptx"},
        {label:"下载 PDF 样稿", meta:"PDF · 3 MB", href:"/assets/templates/downloads/elegant-red-preview.pdf", filename:"东南大学汇报模板-典雅红.pdf"}
      ]
    },
    {
      id: "seu-word", number: "06", type: "WORD", pages: "3 PAGES",
      title: "东南大学 Word 模板", subtitle: "从封面到正文",
      description: "延续校会蓝视觉体系，提供封面、目录与正文页面，用于项目报告、策划书和正式材料，下载后可直接替换文字与图片。",
      previewMode: "pages",
      previews: [
        {label:"封面", src:"/assets/templates/previews/word-page-1.jpg"},
        {label:"目录", src:"/assets/templates/previews/word-page-2.jpg"},
        {label:"正文", src:"/assets/templates/previews/word-page-3.jpg"}
      ],
      downloads: [
        {label:"下载模板", meta:"DOCX · 6 MB", href:"/assets/templates/downloads/seu-word.docx", filename:"东南大学_WORD模板.docx"},
        {label:"下载 PDF 样稿", meta:"PDF · 900 KB", href:"/assets/templates/downloads/seu-word-preview.pdf", filename:"东南大学_WORD模板.pdf"}
      ]
    }
  ];

  const src = (photo, size = "full") => `/assets/${size}/${photo.id}.webp`;
  const alt = (photo) => `${photo.location}，${photo.title}`;
  const picture = (photo, eager = false) => {
    return `
    <picture>
      <img src="${src(photo)}" width="${photo.w}" height="${photo.h}" alt="${alt(photo)}" loading="${eager ? "eager" : "lazy"}" decoding="async"${eager ? ' fetchpriority="high"' : ""}>
    </picture>`;
  };
  const caption = (photo) => `<div class="caption"><span>${photo.title}</span><span>${photo.location}</span></div>`;
  const photoButton = (photo, className = "") => `<button class="photo-button story-image js-photo ${className}" data-photo-id="${photo.id}" aria-label="查看大图：${alt(photo)}">${picture(photo)}${caption(photo)}</button>`;

  function header(overlay = false, current = "") {
    return `<header class="site-header${overlay ? " overlay" : ""}">
      <a class="brand" href="/"><span>JUJUBUR</span><i> / PHOTOGRAPHY</i></a>
      <nav class="nav" aria-label="主要导航">
        <a href="/works/"${current === "home" ? ' aria-current="page"' : ""}>主页</a>
        <a href="/series/"${current === "series" ? ' aria-current="page"' : ""}>专题</a>
        <a href="/selected/"${current === "selected" ? ' aria-current="page"' : ""}>精选</a>
        <a href="/design/"${current === "design" ? ' aria-current="page"' : ""}>设计</a>
      </nav>
    </header>`;
  }

  function footer() {
    return `<footer class="site-footer"><div class="brand">JUJUBUR / PHOTOGRAPHY</div><small>ALL IMAGES © JUJUBUR</small></footer>`;
  }

  function renderLanding() {
    const scenes = [
      {src:"/assets/video/earth-online.mp4", title:"地球 Online 新疆风光", place:"阿勒泰｜赛里木｜昭苏"},
      {src:"/assets/video/earth-online-indonesia.mp4", title:"地球 Online 印度尼西亚", place:"东爪哇｜巴厘岛"}
    ];
    document.title = "JUJUBUR / 个人摄影集";
    app.innerHTML = `<main id="main" class="film-landing">
      <div class="film-media" aria-hidden="true">
        <video class="film-video active" src="${scenes[0].src}" poster="/assets/full/f005.webp" autoplay muted playsinline webkit-playsinline preload="auto"></video>
        <video class="film-video" src="${scenes[1].src}" poster="/assets/full/f005.webp" muted playsinline webkit-playsinline preload="auto"></video>
      </div>
      <div class="film-scrim" aria-hidden="true"></div>
      <button class="film-play" type="button" hidden>播放影像</button>
      <header class="film-header"><span>JUJUBUR / PHOTOGRAPHY</span><span>PERSONAL ARCHIVE</span></header>
      <section class="film-copy">
        <span class="film-kicker">PHOTOGRAPHY · MOTION · PLACES</span>
        <h1><span>帅 杰 博</span><em>个人作品集</em></h1>
        <p>东南大学｜信息科学与工程学院</p>
        <div class="film-actions">
          <a class="film-enter" href="/works/"><span>进入摄影作品集</span><i aria-hidden="true">↗</i></a>
          <a class="film-enter film-enter-design" href="/design/"><span>进入设计作品集</span><i aria-hidden="true">↗</i></a>
        </div>
      </section>
      <div class="film-status">
        <span class="film-scene">${scenes[0].title} · ${scenes[0].place}</span>
        <span class="film-count">01 / 02</span>
        <div class="film-dots" aria-hidden="true">${scenes.map((_, index) => `<i${index === 0 ? ' class="active"' : ""}></i>`).join("")}</div>
      </div>
    </main>`;
    initFilmLanding(scenes);
  }

  function initFilmLanding(scenes) {
    const videos = [...document.querySelectorAll(".film-video")];
    const playButton = document.querySelector(".film-play");
    const scene = document.querySelector(".film-scene");
    const count = document.querySelector(".film-count");
    const dots = [...document.querySelectorAll(".film-dots i")];
    let index = 0;
    let active = 0;
    let switching = false;
    const updateStatus = () => {
      scene.textContent = `${scenes[index].title} · ${scenes[index].place}`;
      count.textContent = `${String(index + 1).padStart(2,"0")} / ${String(scenes.length).padStart(2,"0")}`;
      dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === index));
    };
    const showPlayButton = (show) => { playButton.hidden = !show; };
    const playActive = () => {
      const video = videos[active];
      video.muted = true;
      video.defaultMuted = true;
      const attempt = video.play();
      if (attempt) attempt.then(() => showPlayButton(false)).catch(() => showPlayButton(true));
    };
    const advance = () => {
      if (switching) return;
      switching = true;
      const oldVideo = videos[active];
      const nextActive = 1 - active;
      const nextVideo = videos[nextActive];
      const nextIndex = (index + 1) % scenes.length;
      const reveal = () => {
        nextVideo.classList.add("active");
        oldVideo.classList.remove("active");
        active = nextActive;
        index = nextIndex;
        switching = false;
        showPlayButton(false);
        updateStatus();
        window.setTimeout(() => {
          oldVideo.pause();
          oldVideo.currentTime = 0;
        }, 1000);
      };
      nextVideo.muted = true;
      nextVideo.defaultMuted = true;
      nextVideo.currentTime = 0;
      nextVideo.addEventListener("playing", reveal, {once:true});
      const attempt = nextVideo.play();
      if (attempt) attempt.catch(() => {
        switching = false;
        showPlayButton(true);
      });
    };
    videos.forEach((video) => {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.addEventListener("ended", () => { if (video === videos[active]) advance(); });
    });
    videos[0].addEventListener("loadeddata", playActive, {once:true});
    playButton.addEventListener("click", () => {
      if (videos[active].ended) advance();
      else playActive();
    });
    playActive();
    window.setTimeout(() => {
      if (videos[active].paused) showPlayButton(true);
    }, 2400);
    window.addEventListener("pageshow", playActive);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) videos[active].pause();
      else playActive();
    });
  }

  function renderHome() {
    const f = photos.filter((photo) => photo.featured).sort((a, b) => a.featured - b.featured);
    const hero = f[0];
    const descriptions = {
      f002: "鸡鸣寺路的樱花、车流与远处楼群沿同一条道路展开，傍晚的蓝调将新旧城市景观收进同一画面。",
      f003: "婺源石城村的早晨从山谷雾气开始。阳光穿过古枫之后，白墙、屋瓦和炊烟逐渐显出层次。",
      f004: "九龙湖校区的玉兰从教学楼旁向上生长，枝干、花朵和建筑共同分割春天的天空。",
      f005: "布罗莫火山位于印度尼西亚东爪哇。清晨，火山口持续吐出白烟，山脊上的黄色身影为巨大地貌提供了尺度。",
      f006: "积雪覆盖九曲桥之后，平日曲折的路径只留下清晰的几何轮廓，桥上的行人成为雪景中的暖色。",
      f007: "火壶表演把炭火甩向空中，飞散的火星在黑夜中形成短暂弧线，表演者始终位于火光中央。",
      f008: "夏日晚霞越过南京主城，紫峰与密集街区同时亮起，旧城肌理与不断生长的天际线在高处相遇。",
      f009: "深秋的落叶铺满九龙湖校区涌泉池，水面、八角池岸与两侧树冠构成近乎对称的俯视几何。",
      f010: "南京主城进入蓝调时刻，高架车流在城市建筑之间留下连续光带，紫峰与河西天际线同时进入画面。",
      f011: "南京大学校园的秋叶透过楼梯间窗格显出金黄，室内暗部保留了观看窗外景色的安静距离。",
      f012: "东爪哇 Sewu 瀑布由环形峭壁上的多股水流共同构成，站在瀑布前的人物让水幕的高度变得可感。",
      f013: "滁州的夜空下，银河与飞机剪影相接。手电光束指向星河，让地面的观看者与天空建立联系。",
      f014: "尼斯海岸的正午光线穿过清澈海水，游泳者被大片蓝色包围，水面的细小反光形成画面的纹理。",
      f015: "墨尔本西部的铁路向中央商务区延伸，旧铁路桥、信号灯与远处高楼排列在同一条城市轴线上。"
    };
    const homeItem = (id, wide = false) => {
      const photo = byId[id];
      return `<article class="home-photo${wide ? " wide" : ""}">${photoButton(photo)}<p class="home-photo-note">${descriptions[id]}</p></article>`;
    };
    document.title = "JUJUBUR / 个人摄影集";
    app.innerHTML = `
      <div class="hero">
        ${header(true, "home")}
        ${picture(hero, true)}
        <div class="hero-mark"><span class="hero-name">jujubur</span><span class="hero-title">个人摄影集</span></div>
        <div class="scroll-cue">SCROLL TO VIEW</div>
        <div class="hero-caption"><span>${hero.title}</span><span>${hero.location}</span></div>
      </div>
      <main id="main" class="home-story">
        <section class="home-feed" aria-label="重点作品">
          ${homeItem("f005")}${homeItem("f014")}
          ${homeItem("f012", true)}
          ${homeItem("f003")}${homeItem("f007")}
          ${homeItem("f008", true)}
          ${homeItem("f002")}${homeItem("f004")}
          ${homeItem("f013", true)}
          ${homeItem("f006")}${homeItem("f011")}
          ${homeItem("f010", true)}
          ${homeItem("f009", true)}
          ${homeItem("f015", true)}
        </section>
      </main>
      <section class="home-series" aria-labelledby="series-title">
        <div class="section-heading"><h2 id="series-title">Series</h2><span>专题 / 05</span></div>
        <div class="series-list">${data.series.map((series) => `
          <a class="series-row" href="/series/${series.slug}/">
            <div class="series-preview">${picture(byId[series.cover])}</div>
            <div class="series-row-content"><span class="number">${series.number}</span><h3>${series.title}</h3><p>${series.intro}</p><span class="arrow" aria-hidden="true">→</span></div>
          </a>`).join("")}</div>
      </section>
      <section class="home-selected reveal">
        <div class="home-selected-image">${picture(byId.p041)}</div>
        <div class="home-selected-copy"><span class="eyebrow">A CURATED EDIT / ${String(photos.filter((photo) => photo.selected).length).padStart(2,"0")}</span><h2>Selected<br>Works</h2><a class="text-link" href="/selected/">进入精选 <span aria-hidden="true">→</span></a></div>
      </section>
      ${footer()}`;
  }

  function renderSeriesIndex() {
    document.title = "专题 — JUJUBUR / PHOTOGRAPHY";
    app.innerHTML = `${header(false, "series")}
      <main id="main" class="page-main">
        <header class="page-intro"><span class="page-kicker">PHOTOGRAPHIC SERIES / 05</span><h1>专题</h1></header>
        <div class="series-index">${data.series.map((series) => {
          const cover = byId[series.cover];
          return `<a class="series-card reveal" href="/series/${series.slug}/">
            <span class="number">${series.number}</span>
            <div><h2>${series.title}</h2><p>${series.intro}</p></div>
            ${picture(cover)}
          </a>`;
        }).join("")}</div>
      </main>${footer()}`;
  }

  function renderSeries(series) {
    const index = data.series.findIndex((item) => item.slug === series.slug);
    const prev = data.series[(index - 1 + data.series.length) % data.series.length];
    const next = data.series[(index + 1) % data.series.length];
    const cover = byId[series.cover];
    const items = [cover, ...photos.filter((photo) => photo.series.includes(series.slug) && photo.id !== cover.id)];
    document.title = `${series.title} — JUJUBUR / PHOTOGRAPHY`;
    app.innerHTML = `${header(false, "series")}
      <main id="main" class="page-main">
        <header class="series-hero">
          <div class="series-titleline"><span class="number">${series.number}</span><h1>${series.title}</h1><p>${series.intro}</p></div>
        </header>
        <div class="series-gallery">${items.map((photo) => `
          <figure class="series-photo${photo.h > photo.w ? " portrait" : ""} reveal">
            <button class="photo-button js-photo" data-photo-id="${photo.id}" aria-label="查看大图：${alt(photo)}">${picture(photo)}</button>${caption(photo)}
          </figure>`).join("")}</div>
        <nav class="series-nav" aria-label="专题切换">
          <a href="/series/${prev.slug}/"><span>← 上一专题</span><strong>${prev.title}</strong></a>
          <a href="/series/${next.slug}/"><span>下一专题 →</span><strong>${next.title}</strong></a>
        </nav>
      </main>${footer()}`;
  }

  function renderSelected() {
    const selected = photos.filter((photo) => photo.selected).sort((a, b) => a.selected - b.selected);
    document.title = "精选 — JUJUBUR / PHOTOGRAPHY";
    app.innerHTML = `${header(false, "selected")}
      <main id="main" class="page-main">
        <header class="page-intro selected-head"><span class="page-kicker">A CURATED EDIT / ${String(selected.length).padStart(2,"0")}</span><h1>Selected<br>Works</h1></header>
        <div class="selected-grid">${selected.map((photo) => `
          <figure class="selected-item reveal"><button class="photo-button js-photo" data-photo-id="${photo.id}" aria-label="查看大图：${alt(photo)}">${picture(photo)}</button>${caption(photo)}</figure>`).join("")}</div>
      </main>${footer()}`;
  }

  function renderDesign() {
    document.title = "设计作品集 — JUJUBUR";
    app.innerHTML = `${header(false, "design")}
      <main id="main" class="design-page">
        <header class="design-hero">
          <span class="design-kicker">SELECTED DESIGN ARCHIVE / 06 COLLECTIONS</span>
          <h1><span>DESIGN</span><em>设计作品集</em></h1>
          <p>为校园汇报与正式文档建立清晰、可靠，同时具有辨识度的视觉系统。所有作品均可预览并下载源文件。</p>
          <a class="design-scroll" href="#collection">浏览模板 <span aria-hidden="true">↓</span></a>
        </header>
        <section class="design-collection" id="collection" aria-label="模板作品">
          <div class="design-collection-head"><span>COLLECTION</span><span>点击图片可查看完整长图</span></div>
          ${designTemplates.map((template) => `
            <article class="design-card design-card-${template.id} reveal" data-design-card="${template.id}">
              <div class="design-card-index"><span>${template.number}</span><small>${template.type}</small></div>
              <button class="design-card-preview js-design-preview${template.previewMode === "pages" ? " is-document" : ""}" type="button" data-design-id="${template.id}" aria-label="展开预览：${template.title}">
                <img src="${template.previews[0].src}" alt="${template.title}预览" loading="lazy" decoding="async">
                <span>展开预览 <i aria-hidden="true">↗</i></span>
              </button>
              <div class="design-card-copy">
                <span class="design-tag">${template.pages} · ${template.type === "WORD" ? "MICROSOFT WORD" : "POWERPOINT"}</span>
                <h2>${template.title}</h2>
                <strong>${template.subtitle}</strong>
                <p>${template.description}</p>
                ${template.previews.length > 1 && template.previewMode !== "pages" ? `<div class="design-variants" aria-label="选择预览配色">${template.previews.map((preview, index) => `<button type="button" class="js-design-variant" data-preview="${preview.src}" aria-pressed="${index === 0 ? "true" : "false"}">${preview.label}</button>`).join("")}</div>` : ""}
                <div class="design-downloads">${template.downloads.map((download) => `<a href="${download.href}" download="${download.filename}"><span>${download.label}</span><small>${download.meta}</small><i aria-hidden="true">↓</i></a>`).join("")}</div>
              </div>
            </article>`).join("")}
        </section>
        <section class="design-note reveal"><span>USAGE</span><p>下载后可在 Microsoft PowerPoint 或 Word 中编辑。模板中的示例文字与图片均可替换，请根据实际汇报内容调整版式。</p></section>
      </main>${footer()}`;
  }

  function ensureDesignModal() {
    if (document.querySelector("#design-modal")) return;
    document.body.insertAdjacentHTML("beforeend", `<div class="design-modal" id="design-modal" role="dialog" aria-modal="true" aria-label="模板完整预览" hidden>
      <div class="design-modal-top"><span class="design-modal-title"></span><button class="design-modal-close" type="button" aria-label="关闭预览">×</button></div>
      <div class="design-modal-stage"><div class="design-modal-images"></div></div>
    </div>`);
    document.querySelector(".design-modal-close").addEventListener("click", closeDesignPreview);
  }

  function openDesignPreview(button) {
    ensureDesignModal();
    const template = designTemplates.find((item) => item.id === button.dataset.designId);
    if (!template) return;
    const modal = document.querySelector("#design-modal");
    const selectedSource = button.querySelector("img").getAttribute("src");
    const currentPreview = template.previews.find((preview) => preview.src === selectedSource) || template.previews[0];
    const previews = template.previewMode === "pages" ? template.previews : [currentPreview];
    modal.querySelector(".design-modal-title").textContent = `${template.number} / ${template.title}`;
    modal.querySelector(".design-modal-images").innerHTML = previews.map((preview, index) => `<figure><img src="${preview.src}" alt="${template.title}${preview.label}预览${template.previewMode === "pages" ? `，第 ${index + 1} 页` : ""}"><figcaption>${String(index + 1).padStart(2,"0")} / ${preview.label}</figcaption></figure>`).join("");
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("design-modal-open");
    modal.querySelector(".design-modal-close").focus();
    modal.querySelector(".design-modal-stage").scrollTop = 0;
  }

  function closeDesignPreview() {
    const modal = document.querySelector("#design-modal");
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("design-modal-open");
    lastFocused?.focus();
  }

  function renderNotFound() {
    document.title = "未找到页面 — JUJUBUR / PHOTOGRAPHY";
    app.innerHTML = `${header()}<main id="main" class="page-intro"><span class="page-kicker">404</span><h1>未找到页面</h1><p><a class="text-link" href="/">返回主页 →</a></p></main>${footer()}`;
  }

  function ensureLightbox() {
    if (document.querySelector("#lightbox")) return;
    document.body.insertAdjacentHTML("beforeend", `<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="照片查看器">
      <div class="lightbox-top"><span class="lightbox-count"></span><button class="lightbox-close" type="button" aria-label="关闭">×</button></div>
      <div class="lightbox-stage"><button class="lightbox-nav prev" type="button" aria-label="上一张">←</button><img alt=""><button class="lightbox-nav next" type="button" aria-label="下一张">→</button></div>
      <div class="lightbox-meta"><span><b>作品</b><i class="lightbox-title"></i></span><span><b>拍摄地</b><i class="lightbox-location"></i></span><span><b>原始尺寸</b><i class="lightbox-size"></i></span></div>
    </div>`);
    const lightbox = document.querySelector("#lightbox");
    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightbox.querySelector(".prev").addEventListener("click", () => moveLightbox(-1));
    lightbox.querySelector(".next").addEventListener("click", () => moveLightbox(1));
    lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
    lightbox.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, {passive:true});
    lightbox.addEventListener("touchend", (event) => {
      const delta = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 55) moveLightbox(delta > 0 ? -1 : 1);
    }, {passive:true});
  }

  function openLightbox(id) {
    currentLightboxIds = [...document.querySelectorAll(".js-photo")].map((button) => button.dataset.photoId);
    currentLightboxIndex = currentLightboxIds.indexOf(id);
    lastFocused = document.activeElement;
    updateLightbox();
    const lightbox = document.querySelector("#lightbox");
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
    lightbox.querySelector(".lightbox-close").focus();
  }

  function updateLightbox() {
    const lightbox = document.querySelector("#lightbox");
    const photo = byId[currentLightboxIds[currentLightboxIndex]];
    if (!photo) return;
    const image = lightbox.querySelector("img");
    image.src = src(photo);
    image.alt = alt(photo);
    lightbox.querySelector(".lightbox-count").textContent = `${String(currentLightboxIndex + 1).padStart(2,"0")} / ${String(currentLightboxIds.length).padStart(2,"0")}`;
    lightbox.querySelector(".lightbox-title").textContent = photo.title;
    lightbox.querySelector(".lightbox-location").textContent = photo.location;
    lightbox.querySelector(".lightbox-size").textContent = `${photo.w} × ${photo.h}`;
  }

  function moveLightbox(direction) {
    currentLightboxIndex = (currentLightboxIndex + direction + currentLightboxIds.length) % currentLightboxIds.length;
    updateLightbox();
  }

  function closeLightbox() {
    document.querySelector("#lightbox")?.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    lastFocused?.focus();
  }

  function bindInteractions() {
    ensureLightbox();
    document.querySelectorAll(".js-photo").forEach((button) => button.addEventListener("click", () => openLightbox(button.dataset.photoId)));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); }
    }), {threshold:.08});
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
    document.querySelectorAll(".js-design-preview").forEach((button) => button.addEventListener("click", () => openDesignPreview(button)));
    document.querySelectorAll(".js-design-variant").forEach((button) => button.addEventListener("click", () => {
      const card = button.closest(".design-card");
      card.querySelector(".design-card-preview img").src = button.dataset.preview;
      card.querySelector(".design-card-preview img").alt = `${card.querySelector("h2").textContent}${button.textContent}预览`;
      card.querySelectorAll(".js-design-variant").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    }));
    document.addEventListener("keydown", (event) => {
      const designModal = document.querySelector("#design-modal");
      if (designModal && !designModal.hidden) {
        if (event.key === "Escape") closeDesignPreview();
        if (event.key === "Tab") { event.preventDefault(); designModal.querySelector(".design-modal-close").focus(); }
        return;
      }
      if (!document.querySelector("#lightbox.open")) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") moveLightbox(-1);
      if (event.key === "ArrowRight") moveLightbox(1);
      if (event.key === "Tab") {
        const controls = [...document.querySelectorAll("#lightbox button")];
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  function bindPageTransitions() {
    window.addEventListener("pageshow", () => document.body.classList.remove("page-leaving"));
    document.querySelectorAll('a[href^="/"]').forEach((link) => link.addEventListener("click", (event) => {
      if (link.hasAttribute("download") || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || (target.pathname === location.pathname && target.hash === location.hash)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      document.body.classList.add("page-leaving");
      window.setTimeout(() => { location.href = target.href; }, 360);
    }));
  }

  const path = location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/") renderLanding();
  else if (path === "/works") renderHome();
  else if (path === "/selected") renderSelected();
  else if (path === "/design") renderDesign();
  else if (path === "/series") renderSeriesIndex();
  else if (path.startsWith("/series/")) {
    const slug = path.split("/")[2];
    const series = data.series.find((item) => item.slug === slug);
    series ? renderSeries(series) : renderNotFound();
  } else renderNotFound();
  bindPageTransitions();
  if (path !== "/") bindInteractions();
})();
