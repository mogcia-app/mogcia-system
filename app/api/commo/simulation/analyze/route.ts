type Industry = "hotel" | "golf" | "restaurant";

type AiComment = {
  improvements: string[];
  priorityMeasures: string[];
  commoActions: string[];
  salesTalk: string;
};

type AnalyzePayload = {
  industry: Industry;
  inputs: Record<string, string | number | string[]>;
  scenario: Record<string, number>;
  result: {
    currentRevenue: number;
    improvedRevenue: number;
    monthlyImpact: number;
    annualImpact: number;
    feeSaving: number;
    priority: string[];
  };
  projectionRows?: Array<{
    month: number;
    lineFriends: number;
    monthlyNewLineFriends: number;
    deliveryCount: number;
    deliveryReservationRate: number;
    estimatedReservations: number;
    lineReservationRevenue: number;
    monthlyDifference: number;
  }>;
};

const formatYen = (value: number) =>
  new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const ensureArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];

function fallbackAnalyze(payload: AnalyzePayload): AiComment {
  const topPriority = payload.result.priority[0] || "LINE登録導線の強化";
  const lastProjection = payload.projectionRows?.[payload.projectionRows.length - 1];
  const deliveryCount = lastProjection?.deliveryCount || 4;
  const estimatedReservations = Math.round(lastProjection?.estimatedReservations || 0);

  return {
    improvements: [
      "受付・会計・チェックアウト時にスタッフから一言声がけし、その場で公式LINE登録を促す。",
      "登録特典や次回予約特典を用意し、登録する理由をお客様に分かりやすく伝える。",
      `登録後は月${deliveryCount}回を目安に、季節案内・空き枠案内・限定プランを配信し、月間${estimatedReservations}件前後の予約化を狙う。`,
      "OTA・外部予約サイト経由のお客様にも、次回は公式予約が便利だと案内して直接予約へ誘導する。",
    ],
    priorityMeasures: payload.result.priority.slice(0, 3),
    commoActions: [
      "公式LINEアカウントの立ち上げと登録導線の設計",
      "現場スタッフが使える声がけトークと登録案内POPの設計",
      "顧客属性や利用履歴に合わせたセグメント配信",
      "OTA経由のお客様を公式予約へ戻す導線設計と効果確認",
      "配信結果をもとにした継続改善",
    ],
    salesTalk: `今回の入力値では、月間 ${formatYen(
      payload.result.monthlyImpact,
    )}、年間 ${formatYen(
      payload.result.annualImpact,
    )} の改善余地があります。まずは「${topPriority}」から始めると、OTA集客を活かしながら手数料削減とリピーター育成の両方につながりやすいです。commo.では、LINE登録から再来訪、公式予約への導線まで一連で設計できます。`,
  };
}

function normalizeAiComment(value: unknown, fallback: AiComment): AiComment {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const record = value as Record<string, unknown>;

  return {
    improvements: ensureArray(record.improvements).length
      ? ensureArray(record.improvements)
      : fallback.improvements,
    priorityMeasures: ensureArray(record.priorityMeasures).length
      ? ensureArray(record.priorityMeasures)
      : fallback.priorityMeasures,
    commoActions: ensureArray(record.commoActions).length
      ? ensureArray(record.commoActions)
      : fallback.commoActions,
    salesTalk:
      typeof record.salesTalk === "string" ? record.salesTalk : fallback.salesTalk,
  };
}

export async function POST(request: Request) {
  const payload = (await request.json()) as AnalyzePayload;
  const fallback = fallbackAnalyze(payload);

  if (!process.env.OPENAI_API_KEY) {
    return Response.json(fallback);
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
              "あなたはcommo.の営業支援AIです。ホテル・ゴルフ場・飲食店向けに、公式LINE導入後の収支シミュレーションを踏まえ、OTAや外部予約サイトで集客した顧客を公式LINEでリピーター化し、次回以降の公式予約へつなげる提案を日本語で簡潔に作成してください。改善提案には、スタッフの声がけ、登録特典、案内POP、配信内容、月間配信回数、LINE経由予約見込み数、外部予約手数料削減を使った具体策を含めてください。必ずJSONのみを返してください。",
          },
          {
            role: "user",
            content: JSON.stringify({
              requiredJsonShape: {
                improvements: ["string"],
                priorityMeasures: ["string"],
                commoActions: ["string"],
                salesTalk: "string",
              },
              payload,
            }),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "commo_simulation_analysis",
            strict: true,
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                improvements: { type: "array", items: { type: "string" } },
                priorityMeasures: { type: "array", items: { type: "string" } },
                commoActions: { type: "array", items: { type: "string" } },
                salesTalk: { type: "string" },
              },
              required: [
                "improvements",
                "priorityMeasures",
                "commoActions",
                "salesTalk",
              ],
            },
          },
        },
      }),
    });

    if (!response.ok) {
      return Response.json(fallback);
    }

    const data = await response.json();
    const text = data.output_text || data.output?.[0]?.content?.[0]?.text;
    const parsed = typeof text === "string" ? JSON.parse(text) : null;

    return Response.json(normalizeAiComment(parsed, fallback));
  } catch {
    return Response.json(fallback);
  }
}
