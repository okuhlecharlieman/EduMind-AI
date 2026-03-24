import { NextResponse } from "next/server";
import { listPlans } from "@/lib/monetization";

export async function GET() {
  return NextResponse.json({ plans: listPlans() });
}
