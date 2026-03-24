import { NextRequest } from "next/server";

export type PlanId = "free" | "pro" | "tutor" | "school";
export type UsageFeature = "summarize" | "quiz" | "simplify";

interface Plan {
  id: PlanId;
  displayName: string;
  priceMonthlyUsd: number;
  dailyLimits: Record<UsageFeature, number>;
  perks: string[];
}

interface UserUsage {
  plan: PlanId;
  date: string;
  counts: Record<UsageFeature, number>;
}

const plans: Record<PlanId, Plan> = {
  free: {
    id: "free",
    displayName: "Free",
    priceMonthlyUsd: 0,
    dailyLimits: { summarize: 15, quiz: 10, simplify: 15 },
    perks: ["Basic summaries", "Practice quizzes", "Fallback reliability"],
  },
  pro: {
    id: "pro",
    displayName: "Pro Learner",
    priceMonthlyUsd: 9,
    dailyLimits: { summarize: 200, quiz: 120, simplify: 200 },
    perks: ["High daily limits", "Priority inference", "Export-ready responses"],
  },
  tutor: {
    id: "tutor",
    displayName: "Tutor Dashboard",
    priceMonthlyUsd: 29,
    dailyLimits: { summarize: 600, quiz: 400, simplify: 600 },
    perks: ["Multi-learner usage", "Faster throughput", "Usage analytics API"],
  },
  school: {
    id: "school",
    displayName: "School Pack",
    priceMonthlyUsd: 99,
    dailyLimits: { summarize: 3000, quiz: 2000, simplify: 3000 },
    perks: ["Institution-scale limits", "Org controls", "White-label options"],
  },
};

const usageStore = new Map<string, UserUsage>();

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function parsePlan(value: string | null): PlanId {
  if (value === "pro" || value === "tutor" || value === "school") {
    return value;
  }
  return "free";
}

function getClientId(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const cfIp = request.headers.get("cf-connecting-ip")?.trim();

  return forwarded || realIp || cfIp || "anonymous-client";
}

export function listPlans(): Plan[] {
  return Object.values(plans);
}

export function enforceUsageLimit(request: NextRequest, feature: UsageFeature) {
  const clientId = getClientId(request);
  const plan = parsePlan(request.headers.get("x-edumind-plan"));
  const date = todayUtc();
  const key = `${clientId}:${plan}`;

  const existing = usageStore.get(key);
  const initial: UserUsage = {
    plan,
    date,
    counts: { summarize: 0, quiz: 0, simplify: 0 },
  };

  const usage = !existing || existing.date !== date ? initial : existing;

  const limit = plans[plan].dailyLimits[feature];
  const used = usage.counts[feature];

  if (used >= limit) {
    return {
      allowed: false as const,
      status: 402,
      payload: {
        error: `${feature} daily limit reached for ${plans[plan].displayName} plan`,
        monetization: {
          feature,
          plan,
          used,
          limit,
          suggestedUpgrade: plan === "free" ? plans.pro : plans.school,
          plans: listPlans(),
        },
      },
    };
  }

  usage.counts[feature] += 1;
  usageStore.set(key, usage);

  return {
    allowed: true as const,
    usage: {
      plan,
      feature,
      used: usage.counts[feature],
      limit,
      remaining: Math.max(limit - usage.counts[feature], 0),
    },
  };
}
