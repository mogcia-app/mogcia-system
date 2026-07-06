export type PortfolioCategory = "HP" | "LP" | "SNS";

export const colorCollections = [
  "白",
  "黒",
  "グレー",
  "ベージュ",
  "赤",
  "オレンジ",
  "黄色",
  "緑",
  "青",
  "水色",
  "ネイビー",
  "紫",
  "ピンク",
  "ブラウン",
] as const;

export const industryCollections = [
  "コンサルティング会社",
  "美容・クリニック",
  "美容・コスメ",
  "飲食",
  "カフェ",
  "アパレル",
  "ブライダル",
  "不動産",
  "建築・工務店",
  "ホテル・宿泊",
  "教育",
  "士業",
  "医療",
  "福祉",
  "IT・SaaS",
  "製造業",
  "小売",
  "採用・人材",
] as const;

export const designCollections = [
  {
    label: "Minimal",
    subtitle: "ミニマル",
    keywords: ["余白", "白基調", "洗練", "静けさ", "高級感"],
  },
  {
    label: "Trust",
    subtitle: "信頼感",
    keywords: ["ネイビー", "整列", "実績", "コーポレート感", "安心感"],
  },
  {
    label: "Creative",
    subtitle: "クリエイティブ",
    keywords: ["アート感", "レイアウト崩し", "個性", "感性", "デザイン性"],
  },
  {
    label: "Tech",
    subtitle: "テック",
    keywords: ["黒背景", "グラデーション", "UI感", "AI感", "近未来"],
  },
  {
    label: "Warm",
    subtitle: "ナチュラル",
    keywords: ["ベージュ", "曲線", "柔らかい影", "自然光", "親しみ"],
  },
  {
    label: "Luxury",
    subtitle: "ラグジュアリー",
    keywords: ["黒", "serifフォント", "重厚感", "上質", "ハイブランド感"],
  },
  {
    label: "Modern",
    subtitle: "モダン",
    keywords: ["シンプル", "幾何学", "直線", "スタイリッシュ", "都市感"],
  },
  {
    label: "Soft",
    subtitle: "ソフト",
    keywords: ["丸み", "淡色", "優しい", "軽さ", "柔らかさ"],
  },
  {
    label: "Editorial",
    subtitle: "エディトリアル",
    keywords: ["雑誌風", "タイポ重視", "写真主役", "洗練レイアウト"],
  },
  {
    label: "Organic",
    subtitle: "オーガニック",
    keywords: ["波", "自然モチーフ", "流動感", "温かみ", "呼吸感"],
  },
  {
    label: "Futuristic",
    subtitle: "フューチャー",
    keywords: ["発光", "ガラス", "3D", "サイバー感", "未来感"],
  },
  {
    label: "Japanese Minimal",
    subtitle: "和ミニマル",
    keywords: ["余白", "静寂", "和紙感", "引き算", "上品さ"],
  },
  {
    label: "Scandinavian",
    subtitle: "北欧系",
    keywords: ["ナチュラル", "木", "淡色", "温かいミニマル", "居心地感"],
  },
  {
    label: "Brutalist",
    subtitle: "ブルータリズム",
    keywords: ["無骨", "大胆", "崩し", "強いタイポ", "実験感"],
  },
  {
    label: "Corporate Minimal",
    subtitle: "コーポレートミニマル",
    keywords: ["信頼感", "ミニマル", "BtoB感", "清潔感", "誠実さ"],
  },
] as const;

export type DesignCollection = (typeof designCollections)[number];

export type PortfolioItem = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  assetKey: string;
  logoPath?: string;
  galleryImages?: string[];
  colorTags?: string[];
  designTags?: string[];
  detailNotes?: {
    overview?: string[];
    recommendedFor?: string[];
    structure?: string[];
    tone?: string[];
    concept?: string[];
    toolsNote?: string;
    creatorComment?: string;
  };
  sidebarTags?: string[];
  industry: string;
  mood: string;
  client: string;
  year: string;
  catchCopy: string;
  summary: string;
  role: string[];
  tools: string[];
  accent: string;
  metrics: {
    label: string;
    value: string;
  }[];
  sections: {
    title: string;
    body: string;
  }[];
  thumbnailPath?: string;
  previewPath?: string;
  previewMode?: "iframe";
};

export const portfolioItems: PortfolioItem[] = [
  {
    slug: "growth-partners",
    assetKey: "growth-partners",
    logoPath: "/hp/growth-partners/growth-partnersicon.png",
    galleryImages: [
      "/HP/growth-partners/1.png",
      "/HP/growth-partners/2.png",
      "/HP/growth-partners/3.png",
      "/HP/growth-partners/4.png",
      "/HP/growth-partners/5.png",
    ],
    colorTags: ["白", "ネイビー", "グレー"],
    designTags: ["Trust", "Corporate Minimal"],
    sidebarTags: ["HP", "コンサルティング会社", "信頼", "落ち着き", "白", "ネイビー"],
    title: "Growth Partners",
    category: "HP",
    industry: "コンサルティング会社",
    mood: "信頼感 / 端正",
    client: "Growth Partners",
    year: "2024",
    catchCopy: "コンサルティング会社のブランドサイト。",
    summary:
      "事業内容と信頼感がまっすぐ伝わるように、情報の整理と余白設計を軸に構成したコーポレートサイトです。",
    role: ["Direction", "Design", "Frontend"],
    tools: ["Next.js", "Figma", "Photoshop"],
    accent: "from-[#f0dfd2] via-[#f7f0ea] to-[#fffaf6]",
    metrics: [
      { label: "Pages", value: "8" },
      { label: "Lead Time", value: "3 weeks" },
      { label: "CV Focus", value: "Reservation" },
    ],
    sections: [
      {
        title: "Overview",
        body:
          "ファーストビューでは写真を主役にしつつ、情報量は絞って第一印象を優先しました。落ち着いた配色と大きめの余白で、実店舗の空気感に近い温度を再現しています。",
      },
      {
        title: "Information Design",
        body:
          "ユーザーの主目的を『雰囲気確認』と『予約導線』に分け、ヘッダーと各セクション下部に予約ボタンを繰り返し配置しました。スクロールの途中でも迷わず行動できる構成です。",
      },
      {
        title: "Mobile Experience",
        body:
          "スマホでは画像の見せ方を優先しつつ、テキスト行間を広く確保しています。駅近サロンという強みが伝わるよう、アクセス情報を下層ではなくメイン導線上に置きました。",
      },
    ],
    thumbnailPath: "/hp/growth-partners/thumb.svg",
    previewPath: "/hp/growth-partners/index.html",
    previewMode: "iframe",
    detailNotes: {
      overview: [
        "コンサルティング会社のコーポレートサイト",
        "採用強化・企業認知・法人問い合わせ獲得を目的に作成",
      ],
      recommendedFor: [
        "中小企業向けにコンサル・専門サービスを展開して、信頼感を出したい",
        "採用強化と企業案件獲得の両方をひとつのサイトでやりたい",
        "派手さよりも『信頼・検討・読みやすさ』を優先したい",
        "幅広い実績を訴えたい（製造・IT・士業・小売など）",
        "写真素材を後から差し替えたい（image-slotで拡張可能）",
        "拡張性を意識した構造で運用したい",
      ],
      structure: [
        "TOP ─ 9セクションのワンページ縦スクロール",
        "ヘッダー（固定・グロナビ7項目 + CTA 2種）",
        "Hero（メインビジュアル・『共に描き、共に伸びる。』）",
        "About（使命と支援哲学）",
        "Numbers（120社+ / 25名 / 2019年 / 3領域）",
        "サービス（3サービスのリスト）",
        "Works（業種マトリクス6 + 導入事例3枚）",
        "メンバー（社員カード4名）",
        "Recruit（注力セクション・WE ARE HIRING・求人リスト）",
        "ニュース＆お問い合わせ CTA（法人 / 採用2導線）+ フッター",
        "サービス詳細 ─ 8セクション",
        "Page Hero（パンくず + 大羽根 + ヘッダー画像）",
        "サービスインデックス（3カードへのジャンプ）",
        "Service 01-03 詳細（各：課題リスト / 4ステップアプローチ / 成果数値）",
        "プロセス（5ステップ）",
        "プラン（3プラン・STANDARD ハイライト）",
        "FAQ（6項目）+ お問い合わせCTA + フッター",
      ],
      tone: [
        "決意 / 信頼 / 落ち着き ─ 派手さやアニメーションの多用を避け、静的で読みやすい紙面感",
        "モダン × 和の品格 ─ Noto Serif JP（見出し）と Noto Sans JP（本文）の対比",
        "数字とファクトで語る ─ 抽象的な美辞麗句より、具体的な数値を主役に",
        "低彩度 × 余白広め ─ ホワイトスペースで呼吸を作る",
        "CTAの主張は強く、装飾は控えめ",
      ],
      concept: [
        "『Editor Trust』──雑誌的な静けさで、信頼を語る。",
        "ネイビー #1A2E4A を主役に、白 / #F5F5F5 / #E5E8EE のみで構成",
        "Noto Serif JP と Noto Sans JP の対比で、品位と可読性を両立",
        "1280px グリッド、左ラベル / 右タイトルの2カラムヘッダブロックを統一",
        "No Shadow / No Radius。ヘアラインと四角形だけで信頼感を作る",
        "動きは最小限。矢印、スライドイン、採用バッジ程度に限定",
        "数字を活字として扱い、歴史性と重みを表現",
        "image-slot 前提で写真は後付け。CMS連携や記事追加も想定",
      ],
      toolsNote: "Figma / HTML / Photoshop",
    },
  },
  {
    slug: "lumiere-lp",
    assetKey: "lumiere-campaign",
    title: "Lumiere Campaign LP",
    category: "LP",
    colorTags: ["白", "緑", "ベージュ"],
    designTags: ["Soft", "Warm"],
    industry: "美容・コスメ",
    mood: "やわらかい / 購買訴求",
    client: "Cosmetics Brand",
    year: "2024",
    catchCopy: "訴求を絞って、読了から申込までを一直線につなぐ LP。",
    summary:
      "新商品ローンチ向けに、ベネフィット訴求とレビューの見せ方を整理したランディングページです。セールス色を強めすぎず、ブランドの上品さを維持しました。",
    role: ["Structure", "Copy Assist", "Design"],
    tools: ["Next.js", "Figma", "Illustrator"],
    accent: "from-[#d7e7db] via-[#eef6ef] to-[#fcfffd]",
    metrics: [
      { label: "Sections", value: "11" },
      { label: "AB Tests", value: "3" },
      { label: "Goal", value: "Purchase" },
    ],
    sections: [
      {
        title: "First View Strategy",
        body:
          "LP の離脱を防ぐため、ファーストビューでは価格より先に使用後の変化を伝える構成にしています。視線が自然に CTA へ流れるよう、コピーとボタンの間隔も細かく調整しました。",
      },
      {
        title: "Trust Building",
        body:
          "成分説明だけでなく、利用シーンとレビューを交互に挿入して納得感を積み上げる流れにしました。長文でも読まれやすいよう、背景色の切り替えでリズムを作っています。",
      },
      {
        title: "Conversion Design",
        body:
          "購入ボタンは画面の温度を壊さないようにアクセントカラーを限定利用しています。キャンペーン情報は目立たせつつ、過度な点滅や装飾を避けて信頼感を優先しました。",
      },
    ],
  },
  {
    slug: "rosebloom",
    assetKey: "rosebloom",
    logoPath: "/hp/rosebloom/rosebloomicon.png",
    galleryImages: [
      "/hp/rosebloom/1.png",
      "/hp/rosebloom/2.png",
      "/hp/rosebloom/3.png",
      "/hp/rosebloom/4.png",
      "/hp/rosebloom/5.png",
    ],
    colorTags: ["白", "ベージュ", "ピンク", "緑"],
    designTags: ["Warm", "Soft"],
    sidebarTags: ["HP", "美容・コスメ", "ナチュラル", "やわらかい", "白", "ベージュ"],
    title: "Rose Bloom",
    category: "HP",
    industry: "美容・コスメ",
    mood: "ナチュラル / やわらかい",
    client: "Rose Bloom",
    year: "2024",
    catchCopy: "やわらかい空気感と清潔感を両立したナチュラルコスメ会社のHP。",
    summary:
      "ブランドのやさしさと商品理解のしやすさを両立するために、余白と写真の見せ方を整えたコーポレートサイトです。",
    role: ["Direction", "Design", "Frontend"],
    tools: ["HTML", "Figma", "Photoshop"],
    accent: "from-[#f4e7e0] via-[#faf5f0] to-[#fffdfb]",
    metrics: [
      { label: "Pages", value: "6" },
      { label: "Lead Time", value: "2 weeks" },
      { label: "CV Focus", value: "Inquiry" },
    ],
    sections: [
      {
        title: "Overview",
        body:
          "ブランドの世界観を崩さずに、商品や企業情報へ自然につながる導線を意識して設計しました。",
      },
      {
        title: "Visual Tone",
        body:
          "白とベージュを軸に、やわらかい写真と余白でナチュラルコスメらしい軽さを出しています。",
      },
      {
        title: "User Flow",
        body:
          "ブランド理解から商品理解、問い合わせまでが途切れないように情報の順番を整理しています。",
      },
    ],
    previewPath: "/hp/rosebloom/index.html",
    previewMode: "iframe",
    detailNotes: {
      overview: [
        "Rose Bloom は、ダマスクローズを核に据えた国産ナチュラルスキンケアブランドのD2C／ブランドサイトです。",
        "単なる商品カタログではなく、「毎日のスキンケアを、自分への小さなご褒美に。」というブランドフィロソフィーを伝えるためのエディトリアル型コーポレートサイト＋ECサイトとして設計しました。",
        "TOPから商品の世界観に触れ、PDPで購入意思を固め、サブスクとマイページで継続利用へつなげる――ブランド体験と購買動線が一体化した構成です。",
      ],
      structure: [
        "Brand Layer / ブランド体験",
        "世界観と商品の魅力を伝える、購入前の入口。",
        "01 Top: ヒーロー / コンセプト / 新作 / 4カテゴリ / Ritual / レビュー / Journal / Instagram / Dual CTA",
        "02 About: 創業ストーリー、フィロソフィー、ローズへのこだわり、サステナビリティ",
        "03 Journal: スキンケアのコツ、季節のリチュアル、ブランドの裏側",
        "Commerce Layer / 購入動線",
        "欲しいを買うへ変換するための機能群。",
        "04 Products: 4カテゴリ別の商品リスト、フィルター、ベストセラー",
        "05 Product Detail: ヒーロー・サムネイル、サイズ / 購入モード(サブスク10%OFF)、4タブ詳細、レビュー",
        "06 Cart: アイテム編集、送料無料プログレスバー、クーポン適用、おすすめ商品",
        "07 Checkout: 配送先・支払い情報入力、注文確認、Shopify Pay 対応",
        "Account Layer / マイページ機能",
        "継続購入とロイヤルティ醸成のための領域。",
        "08 My Page: ダッシュボード / 注文履歴 / サブスク管理 / お届け先 / お気に入り / ポイント(PETAL→BLOOM→ROSE) / 設定",
        "Support Layer / サポート・採用",
        "疑問解消とブランド広報のための補助ページ。",
        "09 Recruit: ブランドのカルチャー、募集職種、社員の声",
        "10 Contact: お問い合わせフォーム、店舗・カウンター案内",
        "11 FAQ: 配送・返品・サブスク・成分など、カテゴリ別アコーディオン",
      ],
      tone: [
        "ピンク / 白 / やわらかい / 清潔感",
      ],
      concept: [
        "コスメサイトにありがちな「甘くてかわいい」ピンクから一歩引いて、大人のための上品なローズを主役に据えました。雑誌の特集ページを開いた時のような余白の取り方・タイポグラフィの抑揚で、商品より先に「世界観」が伝わる構成にしています。",
        "イタリック体のディスプレイ書体(Cormorant Garamond)が「薔薇のしなやかさ」を、明朝体の和文(Noto Serif JP)が「誠実さ」を、グロテスク体の英文(Noto Sans JP)が「現代性」を担当。三層のタイポグラフィで、上品さと親しみやすさのバランスを取っています。",
        "色は紙のような Paper をベースに、淡いローズ4階調をアクセントとして使い分け。インクの濃いダークブラウンが全体を引き締めることで、ピンクが甘くなりすぎないように調整しています。",
      ],
      toolsNote: "HTML / Figma / Photoshop",
    },
  },
  {
    slug: "lineablu",
    assetKey: "lineablu",
    logoPath: "/hp/lineablu/lineablulogo.png",
    galleryImages: [
      "/hp/lineablu/1.png",
      "/hp/lineablu/2.png",
      "/hp/lineablu/3.png",
      "/hp/lineablu/4.png",
      "/hp/lineablu/5.png",
    ],
    colorTags: ["白", "ベージュ", "グレー", "黒"],
    designTags: ["Editorial", "Luxury"],
    sidebarTags: ["HP", "アパレル", "上質", "静けさ", "ベージュ", "ミニマル"],
    title: "LINEABLU",
    category: "HP",
    industry: "アパレル",
    mood: "上質 / ミニマル",
    client: "LINEABLU",
    year: "2025",
    catchCopy: "毎日に、ちょうどいい上質を伝えるアパレルブランドのHP。",
    summary:
      "ブランドの世界観と商品導線を両立するために、静かな余白とエディトリアルな見せ方で整えたホームページです。",
    role: ["Direction", "Design", "Frontend"],
    tools: ["HTML", "Figma", "Photoshop"],
    accent: "from-[#efe7de] via-[#f7f3ee] to-[#fdfbf8]",
    metrics: [
      { label: "Pages", value: "10+" },
      { label: "Lead Time", value: "3 weeks" },
      { label: "CV Focus", value: "Purchase" },
    ],
    sections: [
      {
        title: "Overview",
        body:
          "ブランドの静かな高級感を損なわずに、商品一覧や購入導線まで自然につながる構成を意識して設計しました。",
      },
      {
        title: "Visual Tone",
        body:
          "ベージュと生成りを基調に、繊細なタイポグラフィと控えめなコントラストで上質さをつくっています。",
      },
      {
        title: "Commerce Flow",
        body:
          "世界観訴求だけで終わらないよう、商品詳細、カート、マイページまで含めて一貫した体験になるよう整理しています。",
      },
    ],
    previewPath: "/hp/lineablu/index.html",
    previewMode: "iframe",
    detailNotes: {
      overview: [
        "LINEABLU のブランドサイト兼 EC サイトの提案デザインです。",
        "世界観を伝えるトップページから、商品一覧、商品詳細、カート、マイページまでを一貫したトーンで設計しています。",
      ],
      recommendedFor: [
        "アパレルやライフスタイルブランドで、世界観と購入導線を両立したい",
        "高級感は出したいが、過度に重たくは見せたくない",
        "商品詳細や会員機能まで含めて、体験全体を整えたい",
      ],
      structure: [
        "TOP ─ ブランド訴求を軸にしたファーストビューと導線設計",
        "商品一覧 / 商品詳細 / カート / チェックアウト",
        "マイページ ─ 注文履歴、配送状況、お気に入りなどを想定",
      ],
      tone: [
        "上質 / 静けさ / ミニマル",
        "淡いベージュと生成りを軸に、黒の線とタイポで引き締める構成",
      ],
      concept: [
        "ブランドの空気感を先に伝え、その後に商品へ自然に視線が流れることを重視しました。",
        "情報量の多い EC 機能も、紙面のような余白と整列で落ち着いて見えるようにしています。",
      ],
      toolsNote: "HTML / Figma / Photoshop",
    },
  },
  {
    slug: "nalu-sns",
    assetKey: "nalu-cafe",
    title: "Nalu SNS Creative",
    category: "SNS",
    colorTags: ["白", "水色", "青"],
    designTags: ["Creative", "Scandinavian"],
    industry: "飲食",
    mood: "抜け感 / 保存したくなる",
    client: "Cafe Brand",
    year: "2025",
    catchCopy: "一覧で世界観を整え、単体投稿でも保存したくなる SNS デザイン。",
    summary:
      "Instagram 向けに、フィード全体の統一感と 1 投稿ごとの可読性を両立したクリエイティブ事例です。運用しやすさも考慮してテンプレート化しています。",
    role: ["Creative Direction", "Template Design"],
    tools: ["Figma", "Photoshop", "Instagram"],
    accent: "from-[#d7e7f0] via-[#eef6fb] to-[#fcfeff]",
    metrics: [
      { label: "Posts", value: "24" },
      { label: "Format", value: "Feed + Story" },
      { label: "Focus", value: "Save Rate" },
    ],
    sections: [
      {
        title: "Grid Planning",
        body:
          "投稿単体の強さだけでなく、3 列表示で見たときの並びも設計しました。写真・文字投稿・告知投稿が続きすぎないようにテンポを整えています。",
      },
      {
        title: "Template System",
        body:
          "複数担当者でもトーンがぶれないように、見出し位置や色数、写真比率のルールを先に定義しました。これにより運用負荷を抑えつつブランド一貫性を保てます。",
      },
      {
        title: "Engagement Intent",
        body:
          "保存されやすい投稿では、レシピやおすすめ情報を図解寄りに整理しました。感覚訴求だけで終わらせず、役立つ情報を差し込むことで接触回数を増やしています。",
      },
    ],
  },
];

export const portfolioCategories = [
  { label: "すべて", value: "all" },
  { label: "HP", value: "HP" },
  { label: "LP", value: "LP" },
  { label: "SNS", value: "SNS" },
] as const;

export type PortfolioFilter = (typeof portfolioCategories)[number]["value"];

export const portfolioBrowseGroups = [
  {
    title: "サイト種別から探す",
    items: ["HP", "LP", "SNS"],
  },
  {
    title: "業種・業界から探す",
    items: ["美容・クリニック", "美容・コスメ", "飲食", "ビジネス・専門職"],
  },
] as const;

export const portfolioShelves = [
  {
    title: "新着のデザイン",
    description: "最近追加した提案用デザインをまとめています。",
    slugs: ["lineablu", "growth-partners", "rosebloom", "lumiere-lp", "nalu-sns"],
  },
  {
    title: "人気のHP",
    description: "信頼感やブランドの空気感を重視したホームページ案です。",
    slugs: ["lineablu", "growth-partners", "rosebloom"],
  },
  {
    title: "ランディングページ（LP）",
    description: "訴求を絞って、読了からアクションまでつなぐ構成です。",
    slugs: ["lumiere-lp"],
  },
  {
    title: "SNSデザイン",
    description: "一覧の統一感と投稿単体の強さを両立したテンプレートです。",
    slugs: ["nalu-sns"],
  },
] as const;
