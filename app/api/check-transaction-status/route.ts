import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const transactionId = searchParams.get("id")

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID é obrigatório" }, { status: 400 })
    }

    const response = await fetch(`https://api.lirapaybr.com/v1/transactions/${transactionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "api-secret": process.env.LIRAPAY_API_SECRET || "",
      },
    })

    const data = await response.json()

    if (data.hasError) {
      return NextResponse.json({ error: "Erro ao consultar transação", details: data }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error checking transaction status:", error)
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
