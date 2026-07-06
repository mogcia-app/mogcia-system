type HpIndustry = "hotel" | "golf" | "restaurant" | "beauty" | "clinic" | "other";

type ProjectionRow = {
  month: number;
  visitors: number;
  conversionRate: number;
  inquiries: number;
  reservations: number;
  revenueIncrease: number;
  cost: number;
  monthlyProfit: number;
  cumulativeProfit: number;
};

type AnalyzePayload = {
  websiteUrl: string;
  industry: HpIndustry;
  inputs: Record<string, string | number | string[]>;
  result: {
    currentRevenue: number;
    annualImpact: number;
    currentConversionRate: number;
    oneYearConversionRate: number;
  };
  projectionRows: ProjectionRow[];
};

type WebsiteSnapshot = {
  url: string;
  title: string;
  description: string;
  headings: string[];
  ctaTexts: string[];
  bodyText: string;
  fetched: boolean;
  error?: string;
};

type HpAnalysis = {
  siteSummary: string;
  detectedSignals: string[];
  issues: string[];
  improvements: string[];
  priorityActions: string[];
  salesTalk: string;
};

const formatYen = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const ensureArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

const decodeHtml = (value: string) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");

const compactText = (value: string) =>
  decodeHtml(value.replace(/\s+/g, " ").trim());

function getMatch(html: string, pattern: RegExp) {
  return compactText(html.match(pattern)?.[1] || "");
}

function getMatches(html: string, pattern: RegExp, limit: number) {
  return [...html.matchAll(pattern)]
    .map((match) => compactText(match[1].replace(/<[^>]*>/g, " ")))
    .filter(Boolean)
    .slice(0, limit);
}

async function fetchWebsiteSnapshot(websiteUrl: string): Promise<WebsiteSnapshot> {
  try {
    const url = new URL(websiteUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("httpまたはhttpsのURLを入力してください。");
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MogciaHpSimulation/1.0; +https://mogcia.com)",
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HPの取得に失敗しました。status: ${response.status}`);
    }

    const html = await response.text();
    const title = getMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
    const description = getMatch(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    );
    const headings = getMatches(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi, 12);
    const ctaTexts = [
      ...getMatches(html, /<a[^>]*>([\s\S]*?)<\/a>/gi, 16),
      ...getMatches(html, /<button[^>]*>([\s\S]*?)<\/button>/gi, 8),
    ]
      .filter((text) => text.length >= 2 && text.length <= 40)
      .slice(0, 16);
    const bodyText = compactText(
      html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]*>/g, " "),
    ).slice(0, 6000);

    return {
      url: url.toString(),
      title,
      description,
      headings,
      ctaTexts,
      bodyText,
      fetched: true,
    };
  } catch (error) {
    return {
      url: websiteUrl,
      title: "",
      description: "",
      headings: [],
      ctaTexts: [],
      bodyText: "",
      fetched: false,
      error:
        error instanceof Error
          ? error.message
          : "HPの取得中にエラーが発生しました。",
    };
  }
}

function fallbackAnalyze(payload: AnalyzePayload, snapshot: WebsiteSnapshot): HpAnalysis {
  const lastProjection = payload.projectionRows[payload.projectionRows.length - 1];
  const currentIssues = Array.isArray(payload.inputs.currentIssue)
    ? payload.inputs.currentIssue.join("、")
    : String(payload.inputs.currentIssue || "");
  const title = snapshot.title || String(payload.inputs.companyName || "対象HP");

  return {
    siteSummary: snapshot.fetched
      ? `「${title}」のページ情報を読み取り、見出し・導線・現状数値をもとに診断しました。`
      : `URLの自動取得はできませんでしたが、ヒアリング内容をもとに診断しました。${snapshot.error || ""}`,
    detectedSignals: [
      snapshot.description
        ? `meta description: ${snapshot.description}`
        : "ページ説明文が弱い、または取得できませんでした。",
      snapshot.headings.length
        ? `主要見出し: ${snapshot.headings.slice(0, 3).join(" / ")}`
        : "主要見出しが取得できず、ファーストビューの訴求整理が必要です。",
      snapshot.ctaTexts.length
        ? `確認できた導線: ${snapshot.ctaTexts.slice(0, 4).join(" / ")}`
        : "問い合わせ・予約ボタンの文言が見つかりにくい状態です。",
    ],
    issues: [
      "ファーストビューで、誰向けに何をしてくれるHPなのかを一瞬で伝える必要があります。",
      "問い合わせ・予約ボタンを各セクションに配置し、迷わず行動できる導線にする必要があります。",
      "SNS・広告・予約サイトから来た人が安心できる実績、料金、流れ、よくある質問を整理する必要があります。",
      currentIssues
        ? `ヒアリング上の課題として「${currentIssues}」があるため、そこを優先して改善するべきです。`
        : "現状課題を明文化し、HPの目的を問い合わせ・予約・採用などに絞る必要があります。",
    ],
    improvements: [
      "ファーストビューに、対象顧客・提供価値・主要CTAを1画面で配置する。",
      "予約・問い合わせ導線を固定ボタン、各セクション末尾、料金付近に設置する。",
      "実績、口コミ、利用の流れ、FAQを追加し、検討中の不安を減らす。",
      "スマホで見た時のCTA到達距離を短くし、フォーム項目を必要最低限にする。",
    ],
    priorityActions: [
      "ファーストビューとCTAの再設計",
      "予約・問い合わせフォームまでの導線短縮",
      "信頼材料と料金・流れの整理",
    ],
    salesTalk: `現状のHPは、見られていても問い合わせ・予約に変わりきっていない可能性があります。今回の入力値では、改善後1年目に月間CVRを ${lastProjection.conversionRate.toFixed(
      2,
    )}% まで伸ばす前提で、年間 ${formatYen(
      payload.result.annualImpact,
    )} 程度の売上改善余地があります。HPを作り直すというより、SNS・広告・検索から来た人を迷わせず予約や問い合わせへ進める導線に変える提案が有効です。`,
  };
}

function normalizeAnalysis(value: unknown, fallback: HpAnalysis): HpAnalysis {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  return {
    siteSummary:
      typeof record.siteSummary === "string"
        ? record.siteSummary
        : fallback.siteSummary,
    detectedSignals: ensureArray(record.detectedSignals).length
      ? ensureArray(record.detectedSignals)
      : fallback.detectedSignals,
    issues: ensureArray(record.issues).length ? ensureArray(record.issues) : fallback.issues,
    improvements: ensureArray(record.improvements).length
      ? ensureArray(record.improvements)
      : fallback.improvements,
    priorityActions: ensureArray(record.priorityActions).length
      ? ensureArray(record.priorityActions)
      : fallback.priorityActions,
    salesTalk:
      typeof record.salesTalk === "string" ? record.salesTalk : fallback.salesTalk,
  };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AnalyzePayload;
  const snapshot = await fetchWebsiteSnapshot(payload.websiteUrl);
  const fallback = fallbackAnalyze(payload, snapshot);

  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ ...fallback, websiteSnapshot: snapshot });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "あなたはMOGCIAの営業支援AIです。取得したHP情報とヒアリング内容をもとに、HPを変えたい・新しくしたい顧客へ、問い合わせや予約につながる改善診断を日本語で具体的に作成してください。誇張せず、シミュレーションは目安である前提で、ファーストビュー、CTA、信頼材料、スマホ導線、SEO/MEO、SNS・広告からの受け皿を必ず考慮してください。必ずJSONのみを返してください。",
          },
          {
            role: "user",
            content: JSON.stringify({
              requiredJsonShape: {
                siteSummary: "string",
                detectedSignals: ["string"],
                issues: ["string"],
                improvements: ["string"],
                priorityActions: ["string"],
                salesTalk: "string",
              },
              websiteSnapshot: snapshot,
              payload,
            }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "hp_simulation_analysis",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                siteSummary: { type: "string" },
                detectedSignals: { type: "array", items: { type: "string" } },
                issues: { type: "array", items: { type: "string" } },
                improvements: { type: "array", items: { type: "string" } },
                priorityActions: { type: "array", items: { type: "string" } },
                salesTalk: { type: "string" },
              },
              required: [
                "siteSummary",
                "detectedSignals",
                "issues",
                "improvements",
                "priorityActions",
                "salesTalk",
              ],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      return Response.json({ ...fallback, websiteSnapshot: snapshot });
    }

    const data = await response.json();
    const text = data.output_text || data.output?.[0]?.content?.[0]?.text;
    const parsed = typeof text === "string" ? JSON.parse(text) : null;

    return Response.json({
      ...normalizeAnalysis(parsed, fallback),
      websiteSnapshot: snapshot,
    });
  } catch {
    return Response.json({ ...fallback, websiteSnapshot: snapshot });
  }
}
