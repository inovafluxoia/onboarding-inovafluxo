import { type NextRequest, NextResponse } from "next/server"

const PRICING = {
  base: {
    price: 497.0,
    title: "InovaFluxo - Plano Mensal",
    description: "Acesso completo ao ecossistema de AI Agents",
  },
  upsell: {
    price: 997.0,
    title: "InovaFluxo - Plano Anual Premium",
    description: "Acesso vitalício + suporte prioritário 24/7 + consultoria mensal",
  },
  downsell: {
    price: 97.0,
    title: "InovaFluxo - Plano Starter",
    description: "Plano básico com recursos essenciais - até 100 leads/mês",
  },
  "cross-sell": {
    price: 497.0,
    title: "InovaFluxo - Setup Done-For-You",
    description: "Configuração completa em 48h + 10 templates + treinamento 1h",
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, offerType } = body

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    if (!phone) {
      return NextResponse.json({ error: "WhatsApp é obrigatório" }, { status: 400 })
    }

    const pricing = PRICING[offerType as keyof typeof PRICING] || PRICING.base

    console.log("[v0] Criando transação para oferta:", offerType || "base")
    console.log("[v0] Valor:", pricing.price)
    console.log("[v0] Email:", email)
    console.log("[v0] WhatsApp:", phone)

    const response = await fetch("https://api.lirapaybr.com/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-secret": process.env.LIRAPAY_API_SECRET || "",
      },
      body: JSON.stringify({
        external_id: `inovafluxo-${offerType || "base"}-${Date.now()}`,
        total_amount: pricing.price,
        payment_method: "PIX",
        webhook_url: `${request.nextUrl.origin}/api/webhook`,
        items: [
          {
            id: `inovafluxo-${offerType || "base"}`,
            title: pricing.title,
            description: pricing.description,
            price: pricing.price,
            quantity: 1,
            is_physical: false,
          },
        ],
        ip: "0.0.0.0",
        customer: {
          name: "Cliente InovaFluxo",
          email: email, // Using actual email from user
          phone: phone, // Using actual phone from user instead of hardcoded
          document_type: "CPF",
          document: "12345678909",
        },
      }),
    })

    const data = await response.json()

    if (data.hasError) {
      return NextResponse.json({ error: "Erro ao criar transação", details: data }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error creating transaction:", error)
    return NextResponse.json({ error: "Erro ao processar requisição" }, { status: 500 })
  }
}
