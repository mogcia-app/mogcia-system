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
    repeatRatio?: number;
    directRatio?: number;
    unitPrice?: number;
    cumulativeProfit?: number;
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
  const lastProjection = payload.projectionRows?.[payload.projectionRows.length - 1];
  const deliveryCount = lastProjection?.deliveryCount || 4;
  const facilityName = String(payload.inputs.facilityName || "貴施設");
  const externalSiteLabel =
    payload.industry === "hotel"
      ? "OTA"
      : payload.industry === "golf"
        ? "外部予約サイト"
        : "グルメサイト";
  const thirdPartyRatio = Number(payload.inputs.thirdPartyRatio || 0);
  const repeatRatio = Number(payload.inputs.repeatRatio || 0);
  const directRatio = Number(payload.inputs.directRatio || 0);
  const finalLineFriends = Math.round(lastProjection?.lineFriends || 0);
  const finalRepeatRatio = Math.round(lastProjection?.repeatRatio || repeatRatio);
  const finalDirectRatio = Math.round(lastProjection?.directRatio || directRatio);
  const finalMonthlyDifference = lastProjection?.monthlyDifference || payload.result.monthlyImpact;
  const finalCumulativeProfit =
    lastProjection?.cumulativeProfit ?? finalMonthlyDifference * 12 - 510000;

  return {
    improvements: [
      "宿泊時・チェックアウト時のスタッフ声かけを強化",
      "登録特典として宿泊割引・館内利用特典・ポイント付与を用意",
      "館内POP・客室内案内・フロント周辺にQRコードを設置",
      `月2〜${deliveryCount}回、季節プラン・直前空室・連泊プランを配信`,
      "LINE経由予約数・登録数・配信反応を毎月確認し改善",
    ],
    priorityMeasures: [
      "LINE登録導線の整備",
      "登録特典の設計",
      "リピーター向け配信の開始",
      "公式予約・直接予約への誘導強化",
    ],
    commoActions: [
      "スタッフ向けのLINE登録案内トークを作成",
      "館内POP・QRコード付き案内物を作成",
      "初回登録特典を設計",
      "月次配信カレンダーを作成",
      "配信結果をもとに改善提案を実施",
    ],
    salesTalk: `${facilityName}様は、${externalSiteLabel}予約比率が${Math.round(
      thirdPartyRatio,
    )}%と高く、予約獲得の多くを外部サイトに依存している状態です。そのため、公式LINEを活用して宿泊後のお客様と継続的につながり、再来訪や公式予約への転換を増やすことで、手数料の削減と売上改善が期待できます。

今回の試算では、12ヶ月後にLINE友だち数が${finalLineFriends}人、リピーター率が${Math.round(
      repeatRatio,
    )}%から${finalRepeatRatio}%、公式・自社予約率が${Math.round(
      directRatio,
    )}%から${finalDirectRatio}%へ改善する想定です。その結果、12ヶ月目には月間${formatYen(
      finalMonthlyDifference,
    )}の売上増加、12ヶ月累計では${formatYen(
      finalCumulativeProfit,
    )}の収支改善が見込まれます。

まずは宿泊時のLINE登録促進、館内POP設置、宿泊後の限定プラン配信から始めることで、段階的に外部予約依存を下げていくことができます。`,
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
              "あなたはcommo.の営業支援AIです。ホテル・ゴルフ場・飲食店向けに、公式LINE導入後の収支シミュレーションを踏まえ、OTAや外部予約サイトで集客した顧客を公式LINEでリピーター化し、次回以降の公式予約へつなげる提案を日本語で簡潔に作成してください。salesTalkは、1. 現状の課題、2. 導入後の見込み、3. 実施すべき施策の順で、入力値とprojectionRowsの12ヶ月目の数値を必ず反映してください。「年間で約◯円の売上増加」とは書かず、「12ヶ月目には月間約◯円の売上増加、12ヶ月累計では約◯円の収支改善」と売上増加と収支改善を分けてください。改善提案には、スタッフ声かけ、館内POP・QRコード、登録特典、季節プラン・空室案内・連泊プラン配信、公式・LINE経由予約への段階的誘導を含めてください。必ずJSONのみを返してください。",
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
