import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const uid = url.searchParams.get("uid") || undefined
    const projectIdFromQuery = url.searchParams.get("projectId") || undefined

    const { amount, type, tier, projectId: projectIdFromBody } = await request.json()

    const buyerUserId = uid
    const projectId = projectIdFromQuery || projectIdFromBody

    if (!buyerUserId || !projectId) {
      return NextResponse.json({ success: false, error: "Missing uid or projectId in query/body" }, { status: 400 })
    }
    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 })
    }

    // Build product details
    const priceCents = Math.round(amount * 100)
    const productName =
      type === "subscription"
        ? (tier ? `${tier} (monthly credits)` : `Subscription (monthly credits)`)
        : `Coffee x${amount}`

    const description =
      type === "subscription"
        ? "Recurring support converted to credits"
        : "One-time support converted to credits"

    const base = process.env.PARENT_API_BASE
    if (!base) {
      return NextResponse.json({ success: false, error: "PARENT_API_BASE env var not set" }, { status: 500 })
    }

    // Call the parent app to create a real Stripe Checkout Session
    const res = await fetch(`${base}/api/credits/checkout?user_id=${encodeURIComponent(buyerUserId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectId,
        productName,
        description,
        priceCents,
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error("Parent credits/checkout failed:", res.status, text)
      return NextResponse.json({ success: false, error: "Failed to create checkout session" }, { status: 500 })
    }

    const data = await res.json()
    return NextResponse.json({ success: true, url: data.url })
  } catch (error) {
    console.error("[create-payment] Error:", error)
    return NextResponse.json({ success: false, error: "Payment processing failed" }, { status: 500 })
  }
}

