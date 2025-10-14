"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, CheckCircle2, Copy, ArrowLeft, Clock, TrendingUp, Award, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

type TransactionResponse = {
  id: string
  external_id: string
  status: string
  total_value: number
  customer: {
    email: string
    name: string
  }
  payment_method: string
  pix: {
    payload: string
  }
  hasError: boolean
}

const PRICING = {
  base: { price: 497.0, originalPrice: 1507.0, discount: 67 },
  upsell: { price: 997.0, originalPrice: 2364.0, discount: 58 },
  downsell: { price: 97.0, originalPrice: 197.0, discount: 51 },
  "cross-sell": { price: 497.0, originalPrice: 1507.0, discount: 67 },
}

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false)
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "authorized" | "failed">("pending")
  const [currentStatus, setCurrentStatus] = useState<string>("PENDING")
  const [isCheckingStatus, setIsCheckingStatus] = useState(false)
  const [showOfferPopup, setShowOfferPopup] = useState(false)
  const [currentOffer, setCurrentOffer] = useState<"upsell" | "downsell" | "cross-sell" | null>(null)
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false)
  const [phone, setPhone] = useState("")
  const [communityPhone, setCommunityPhone] = useState("")
  const [whatsappPhone, setWhatsappPhone] = useState("") // Added whatsappPhone state
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false)
  const [whatsappPopupTrigger, setWhatsappPopupTrigger] = useState<"exit-intent" | "back-button" | null>(null)
  // </CHANGE>
  const { toast } = useToast()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const [spotsLeft, setSpotsLeft] = useState(23)
  const [recentPurchases, setRecentPurchases] = useState(2)
  const [peopleCount, setPeopleCount] = useState(1248)
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(5000)
  const [averageTicket, setAverageTicket] = useState<number>(0)

  const [showCommunitySuccess, setShowCommunitySuccess] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const peopleTimer = setInterval(() => {
      const increment = Math.floor(Math.random() * 3) + 1

      setPeopleCount((prev) => prev + increment)

      setSpotsLeft((prev) => {
        if (prev <= 7) return prev
        return Math.max(7, prev - increment)
      })

      setRecentPurchases((prev) => {
        const newCount = Math.min(prev + increment, 5)
        return newCount
      })
    }, 60000) // Every 1 minute

    return () => clearInterval(peopleTimer)
  }, [])

  useEffect(() => {
    // Only track exit intent if user hasn't completed transaction and hasn't seen the popup yet
    if (transaction || exitIntentTriggered) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Check if mouse is leaving from the top of the page (Y < 10)
      if (e.clientY < 10 && !exitIntentTriggered && !showWhatsAppPopup) {
        console.log("[v0] Exit intent detected - showing WhatsApp community popup")
        setExitIntentTriggered(true)
        setWhatsappPopupTrigger("exit-intent")
        // </CHANGE>
        setShowWhatsAppPopup(true)
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [transaction, exitIntentTriggered, showWhatsAppPopup])

  useEffect(() => {
    if (!transaction?.id) return

    const checkPaymentStatus = async () => {
      try {
        setIsCheckingStatus(true)
        const response = await fetch(`/api/check-transaction-status?id=${transaction.id}`)
        const data = await response.json()

        if (data.error) {
          console.error("[v0] Erro ao verificar status:", data.error)
          return
        }

        console.log("[v0] Status atual do pagamento:", data.status)
        setCurrentStatus(data.status)

        // If payment is approved, update UI
        if (data.status === "APPROVED" || data.status === "PAID" || data.status === "CONFIRMED") {
          setPaymentStatus("authorized")
          toast({
            title: "Pagamento confirmado!",
            description: "Seu acesso foi liberado com sucesso.",
          })
        } else if (data.status === "REJECTED" || data.status === "FAILED" || data.status === "CANCELLED") {
          setPaymentStatus("failed")
          toast({
            title: "Pagamento não aprovado",
            description: "Tente novamente ou entre em contato com o suporte.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("[v0] Erro ao verificar status do pagamento:", error)
      } finally {
        setIsCheckingStatus(false)
      }
    }

    // Check immediately
    checkPaymentStatus()

    // Then check every 5 seconds
    const interval = setInterval(checkPaymentStatus, 5000)

    // Stop checking after 30 minutes
    const timeout = setTimeout(
      () => {
        clearInterval(interval)
        console.log("[v0] Timeout: parando verificação de status")
      },
      30 * 60 * 1000,
    )

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [transaction?.id, toast])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateROI = () => {
    const investmentCost = 497
    const salesPerMonth = averageTicket > 0 ? Math.floor(monthlyRevenue / averageTicket) : 0
    const additionalSales = Math.floor(salesPerMonth * 0.3)
    const revenueIncrease = additionalSales * averageTicket
    const monthlyReturn = revenueIncrease // Pure profit, not subtracting investment
    const threeMonthReturn = revenueIncrease * 3 // 3-month projection
    const roiMultiplier = revenueIncrease / investmentCost

    return {
      investmentCost,
      salesPerMonth,
      additionalSales,
      revenueIncrease,
      monthlyReturn,
      threeMonthReturn,
      roiMultiplier,
    }
  }

  const handleMainCTA = () => {
    if (!email || !phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha seu e-mail e WhatsApp primeiro.",
        variant: "destructive",
      })
      return
    }

    // Show upsell offer first
    setCurrentOffer("upsell")
    setShowOfferPopup(true)
  }

  const handleAcceptOffer = async (offerType: "upsell" | "downsell" | "cross-sell") => {
    setShowOfferPopup(false)
    await createTransaction(offerType)
  }

  const handleDeclineOffer = () => {
    console.log("[v0] Oferta atual recusada:", currentOffer)

    if (currentOffer === "upsell") {
      // Show cross-sell after declining upsell
      console.log("[v0] Mostrando cross-sell após recusar upsell")
      setCurrentOffer("cross-sell")
    } else if (currentOffer === "cross-sell") {
      // Show downsell after declining cross-sell
      console.log("[v0] Mostrando downsell após recusar cross-sell")
      setCurrentOffer("downsell")
    } else {
      console.log("[v0] Downsell recusado, prosseguindo com preço base")
      setShowOfferPopup(false)
      setCurrentOffer(null)
      createTransaction()
    }
  }

  const sendWebhook = async (phoneNumber: string, action: "comunidade-gratuita" | "pix-gerado", userEmail?: string) => {
    try {
      console.log("[v0] Enviando webhook com número:", phoneNumber)
      console.log("[v0] Ação:", action)
      if (userEmail) console.log("[v0] Email:", userEmail)

      const body: { phone: string; action: string; email?: string; timestamp: string } = {
        phone: phoneNumber,
        action: action,
        timestamp: new Date().toISOString(),
      }

      if (action === "pix-gerado" && userEmail) {
        body.email = userEmail
      }

      const response = await fetch("https://autowebhook.atendenteiagencia.shop/webhook/SALVA-INFO", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.JSON.stringify(body),
      })

      if (response.ok) {
        console.log("[v0] Webhook enviado com sucesso")
      } else {
        console.error("[v0] Erro ao enviar webhook:", response.status)
      }
    } catch (error) {
      console.error("[v0] Erro ao enviar webhook:", error)
    }
  }

  const handleJoinCommunity = async () => {
    if (!communityPhone || getPhoneNumbers(communityPhone).length < 10) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de WhatsApp válido com DDD.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Usuário optou por entrar na comunidade")
    console.log("[v0] WhatsApp do usuário:", communityPhone)

    await sendWebhook(getPhoneNumbers(communityPhone), "comunidade-gratuita")
    // </CHANGE>

    setShowWhatsAppPopup(false)
    setShowCommunitySuccess(true)

    // After 3 seconds, navigate back to home
    setTimeout(() => {
      setShowCommunitySuccess(false)
      router.push("/")
    }, 3000)
  }

  const handleDeclineCommunity = () => {
    console.log("[v0] Usuário optou por não entrar na comunidade")
    console.log("[v0] Popup trigger source:", whatsappPopupTrigger)

    setShowWhatsAppPopup(false)

    if (whatsappPopupTrigger === "exit-intent") {
      console.log("[v0] Exit intent trigger - staying on checkout")
      setWhatsappPopupTrigger(null)
    } else if (whatsappPopupTrigger === "back-button") {
      console.log("[v0] Back button trigger - going back in history")
      setWhatsappPopupTrigger(null)
      router.back()
      // </CHANGE>
    }
  }

  const handleWhatsAppSubmit = async () => {
    if (!whatsappPhone || whatsappPhone.length < 10) {
      toast({
        title: "Número inválido",
        description: "Por favor, insira um número de WhatsApp válido.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Número de WhatsApp capturado:", whatsappPhone)

    // Here you could send the phone number to an API to add to WhatsApp group
    // For now, we'll just show a success message and proceed with transaction

    toast({
      title: "Número registrado!",
      description: "Você receberá o convite da comunidade em breve.",
    })

    setShowWhatsAppPopup(false)
    createTransaction()
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "")

    // Limit to 11 digits
    const limited = numbers.slice(0, 11)

    // Format as (DD) DDDDD-DDDD
    if (limited.length <= 2) {
      return limited
    } else if (limited.length <= 7) {
      return `(${limited.slice(0, 2)}) ${limited.slice(2)}`
    } else {
      return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const handleCommunityPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setCommunityPhone(formatted)
  }

  const getPhoneNumbers = (formattedPhone: string) => {
    // Extract only numbers for API
    return formattedPhone.replace(/\D/g, "")
  }
  // </CHANGE>

  const createTransaction = async (offerType?: "upsell" | "downsell" | "cross-sell") => {
    console.log("[v0] Iniciando criação de transação PIX")
    console.log("[v0] Email fornecido:", email)
    console.log("[v0] WhatsApp fornecido:", getPhoneNumbers(phone))
    console.log("[v0] Tipo de oferta:", offerType || "base")

    if (!email) {
      console.log("[v0] Erro: Email não fornecido")
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha seu e-mail.",
        variant: "destructive",
      })
      return
    }

    if (!phone || getPhoneNumbers(phone).length < 10) {
      console.log("[v0] Erro: WhatsApp não fornecido ou inválido")
      toast({
        title: "Campo obrigatório",
        description: "Por favor, preencha seu WhatsApp com DDD.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    console.log("[v0] Estado de loading ativado")

    await sendWebhook(getPhoneNumbers(phone), "pix-gerado", email)

    try {
      console.log("[v0] Fazendo requisição para /api/create-transaction")
      const response = await fetch("/api/create-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          phone: getPhoneNumbers(phone),
          offerType,
        }),
      })

      console.log("[v0] Resposta recebida - Status:", response.status)
      const data = await response.json()
      console.log("[v0] Dados da resposta:", data)

      if (data.error || data.hasError) {
        console.log("[v0] Erro na resposta da API:", data.error)
        throw new Error(data.error || "Erro ao criar transação")
      }

      console.log("[v0] Transação criada com sucesso!")
      console.log("[v0] ID da transação:", data.id)
      console.log("[v0] Código PIX gerado:", data.pix?.payload ? "Sim" : "Não")

      setTransaction(data)
      toast({
        title: "PIX gerado com sucesso!",
        description: "Escaneie o QR Code ou copie o código PIX para pagar.",
      })
    } catch (error) {
      console.error("[v0] Erro ao criar transação:", error)
      toast({
        title: "Erro ao gerar PIX",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      })
    } finally {
      console.log("[v0] Finalizando processo - Loading desativado")
      setLoading(false)
    }
  }

  const copyPixCode = () => {
    console.log("[v0] Copy button clicked!")

    if (!transaction?.pix?.payload) {
      console.log("[v0] Erro: Código PIX não disponível")
      toast({
        title: "Erro ao copiar",
        description: "Código PIX não disponível.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Tentando copiar código PIX:", transaction.pix.payload.substring(0, 20) + "...")

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(transaction.pix.payload)
        .then(() => {
          console.log("[v0] Código PIX copiado com sucesso via clipboard API")
          toast({
            title: "Código copiado!",
            description: "Cole no seu app de pagamentos.",
          })
        })
        .catch((err) => {
          console.error("[v0] Erro ao copiar via clipboard API:", err)
          // Fallback to old method
          fallbackCopyTextToClipboard(transaction.pix.payload)
        })
    } else {
      // Fallback for older browsers
      console.log("[v0] Clipboard API não disponível, usando fallback")
      fallbackCopyTextToClipboard(transaction.pix.payload)
    }
  }

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.top = "0"
    textArea.style.left = "0"
    textArea.style.width = "2em"
    textArea.style.height = "2em"
    textArea.style.padding = "0"
    textArea.style.border = "none"
    textArea.style.outline = "none"
    textArea.style.boxShadow = "none"
    textArea.style.background = "transparent"
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      const successful = document.execCommand("copy")
      console.log("[v0] Fallback copy " + (successful ? "bem-sucedido" : "falhou"))
      if (successful) {
        toast({
          title: "Código copiado!",
          description: "Cole no seu app de pagamentos.",
        })
      } else {
        toast({
          title: "Erro ao copiar",
          description: "Por favor, copie manualmente o código.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("[v0] Erro no fallback copy:", err)
      toast({
        title: "Erro ao copiar",
        description: "Por favor, copie manualmente o código.",
        variant: "destructive",
      })
    }

    document.body.removeChild(textArea)
  }
  // </CHANGE>

  const handleGoBack = () => {
    if (!transaction && !exitIntentTriggered && !showWhatsAppPopup) {
      console.log("[v0] Back button clicked - showing WhatsApp community popup")
      setExitIntentTriggered(true)
      setWhatsappPopupTrigger("back-button")
      // </CHANGE>
      setShowWhatsAppPopup(true)
    } else {
      // If already shown popup or transaction exists, just navigate back
      router.push("/")
    }
  }

  const roiData = calculateROI()

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { text: string; color: string; icon: string }> = {
      PENDING: { text: "Aguardando pagamento", color: "text-amber-400", icon: "⏳" },
      ANALYZING: { text: "Pagamento em análise", color: "text-blue-400", icon: "🔍" },
      APPROVED: { text: "Pagamento aprovado", color: "text-green-400", icon: "✅" },
      PAID: { text: "Pagamento confirmado", color: "text-green-400", icon: "✅" },
      CONFIRMED: { text: "Pagamento confirmado", color: "text-green-400", icon: "✅" },
      REJECTED: { text: "Pagamento rejeitado", color: "text-red-400", icon: "❌" },
      FAILED: { text: "Pagamento falhou", color: "text-red-400", icon: "❌" },
      CANCELLED: { text: "Pagamento cancelado", color: "text-red-400", icon: "❌" },
    }

    return statusMap[status] || { text: "Verificando status", color: "text-slate-400", icon: "⏳" }
  }

  if (paymentStatus === "authorized") {
    // REMOVED upsell popup trigger after payment
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-green-500/30 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full mb-4 sm:mb-6 mx-auto">
              <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-2 sm:mb-3">Pagamento Confirmado!</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">
              Seu acesso ao InovaFluxo foi liberado com sucesso.
            </p>
            <Button
              onClick={handleGoBack}
              className="w-full h-12 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-bold rounded-xl transition-all hover:scale-[1.02]"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (paymentStatus === "failed") {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full mb-4 sm:mb-6 mx-auto">
              <span className="text-4xl sm:text-5xl">❌</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-red-400 mb-2 sm:mb-3">Pagamento não aprovado</h2>
            <p className="text-sm sm:text-base text-slate-300 mb-4 sm:mb-6">
              Não foi possível processar seu pagamento. Tente novamente ou entre em contato com o suporte.
            </p>
            <Button
              onClick={() => {
                setTransaction(null)
                setPaymentStatus("pending")
                setCurrentStatus("PENDING")
              }}
              className="w-full h-12 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-bold rounded-xl transition-all hover:scale-[1.02]"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] font-normal">
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-amber-500/20 py-3">
        <div className="max-w-[500px] mx-auto px-4 relative flex items-center justify-between">
          <button
            onClick={handleGoBack}
            className="p-2 hover:bg-amber-500/10 rounded-lg transition-all text-slate-400 hover:text-amber-400"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-md" />
              <img src="/LogoInovaFluxo1.png" alt="InovaFluxo" className="relative rounded-2xl w-10 h-10" />
            </div>
            <h1 className="text-base font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent font-heading">
              iNovaFluxo
            </h1>
          </div>

          <div className="w-[80px]"></div>
        </div>
      </header>

      <div className="fixed top-[52px] left-0 right-0 z-40 bg-gradient-to-r from-[#dc2626] to-[#ea580c] shadow-lg py-2 px-4 border-0 opacity-90">
        <div className="max-w-[500px] mx-auto">
          <p className="text-center text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 flex-wrap">
            <Clock className="w-4 h-4" />
            <span>Restam apenas {spotsLeft} vagas</span>
            <span className="hidden sm:inline">—</span>
            <span>Expira em {formatTime(timeLeft)}</span>
          </p>
        </div>
      </div>

      <main className="max-w-[500px] mx-auto px-4 py-6 pt-24">
        {transaction ? (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-amber-500/20 rounded-2xl p-4 sm:p-6 backdrop-blur-sm shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-400 text-center mb-2">Pagamento via PIX</h2>
              <p className="text-slate-300 text-center text-xs sm:text-sm mb-4 sm:mb-6">
                Escaneie o QR Code ou copie o código PIX
              </p>

              <div className="bg-white p-4 sm:p-6 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                <div className="text-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                      transaction.pix.payload,
                    )}`}
                    alt="QR Code PIX"
                    className="w-40 h-40 sm:w-48 sm:h-48 mx-auto"
                  />
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 sm:mt-3">Escaneie para pagar</p>
                </div>
              </div>

              <div className="space-y-3 mb-4 sm:mb-6">
                <Label className="text-slate-300 text-xs sm:text-sm">Código PIX (Copia e Cola)</Label>
                <div className="flex gap-2">
                  <Input
                    value={transaction.pix.payload}
                    readOnly
                    className="bg-[#0a0a0a] border border-amber-500/30 text-white font-mono text-xs"
                  />
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      copyPixCode()
                    }}
                    className="bg-[#0a0a0a] border border-amber-500/30 hover:bg-amber-500/10 flex-shrink-0"
                    title="Copiar código PIX"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                  {/* </CHANGE> */}
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm text-amber-300 text-center">
                  Valor:{" "}
                  <span className="font-bold text-xl sm:text-2xl text-amber-400">
                    R$ {transaction.total_value.toFixed(2)}
                  </span>
                </p>
              </div>

              <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusDisplay(currentStatus).icon}</span>
                    <div>
                      <p className="text-xs text-slate-400">Status do pagamento</p>
                      <p className={`text-sm sm:text-base font-semibold ${getStatusDisplay(currentStatus).color}`}>
                        {getStatusDisplay(currentStatus).text}
                      </p>
                    </div>
                  </div>
                  {isCheckingStatus && currentStatus === "PENDING" && (
                    <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-amber-500/20">
                <p className="text-xs text-slate-400 text-center">Aguardando confirmação do pagamento...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {/* 1. Progress Bar */}
            <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-amber-500/20 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Etapa 1 de 2</span>
                <span className="text-xs text-amber-400 font-semibold">50% completo</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full w-1/2 transition-all duration-500"></div>
              </div>
              <p className="text-xs text-slate-400 mt-2">Preencha seu e-mail para garantir o acesso</p>
            </div>

            {/* 2. Testimonials Section */}
            <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-amber-500/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
              <h3 className="text-base sm:text-lg font-bold text-amber-400 text-center mb-4">
                O que nossos clientes dizem:
              </h3>
              <div className="space-y-3 sm:space-y-4">
                {/* João M. Testimonial */}
                <div className="bg-[#0a0a0a]/60 border border-amber-500/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      JM
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-white text-sm sm:text-base">João M.</h4>
                        <span className="text-xs text-slate-400">• Especialista em Marketing</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-amber-400 text-sm">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        "Recuperei 3 clientes em 1 semana. O ROI foi imediato!"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Maria S. Testimonial */}
                <div className="bg-[#0a0a0a]/60 border border-amber-500/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                      MS
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h4 className="font-semibold text-white text-sm sm:text-base">Maria S.</h4>
                        <span className="text-xs text-slate-400">• Clínica de Estética</span>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-amber-400 text-sm">
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        "Automatizei 70% do meu processo comercial. Incrível!"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Exclusive Bonus Section */}
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/40 border border-purple-500/40 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                <h3 className="text-base sm:text-lg font-bold text-purple-200">BÔNUS EXCLUSIVOS</h3>
              </div>
              <p className="text-xs sm:text-sm text-purple-100 mb-3 sm:mb-4">
                Garantindo hoje, você recebe 2 bônus secretos dentro do acesso:
              </p>
              <ul className="space-y-2 sm:space-3">
                <li className="flex items-start gap-2 text-xs sm:text-sm text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />
                  <span>Templates prontos de mensagens de alta conversão</span>
                </li>
                <li className="flex items-start gap-2 text-xs sm:text-sm text-purple-100">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0 mt-0.5" />
                  <span>Acesso ao grupo privado dos membros InovaFluxo 🚀</span>
                </li>
              </ul>
            </div>

            {/* 4. ROI Simulation Section - REDESIGNED */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/80 via-green-950/60 to-teal-950/80 border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-[0_0_30px_rgba(16,185,129,0.15)]">
              {/* Glow effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />

              <div className="relative z-10">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-3 py-1 mb-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">CALCULADORA DE ROI</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Descubra Seu Retorno Explosivo</h3>
                  <p className="text-xs text-emerald-200/80">Com apenas 30% mais vendas, veja quanto você lucra</p>
                </div>

                <div className="space-y-3">
                  {/* Compact Input Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-emerald-100 text-xs mb-1.5 block font-semibold">Ticket Médio</Label>
                      <Input
                        type="number"
                        value={averageTicket || ""}
                        onChange={(e) => setAverageTicket(Number(e.target.value))}
                        placeholder="Ex: 100"
                        className="bg-black/40 border-emerald-500/30 text-white h-10 text-sm placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Label className="text-emerald-100 text-xs mb-1.5 block font-semibold">Faturamento</Label>
                      <div className="bg-black/40 border border-emerald-500/30 rounded-lg h-10 flex items-center justify-center">
                        <span className="text-sm font-bold text-emerald-400">
                          R$ {(monthlyRevenue / 1000).toFixed(0)}k
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Compact Slider */}
                  <div>
                    <Slider
                      value={[monthlyRevenue]}
                      onValueChange={(value) => setMonthlyRevenue(value[0])}
                      min={50000}
                      max={500000}
                      step={1000}
                      className="mb-1 [&_[data-slot=slider-track]]:bg-emerald-950/30 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-emerald-500 [&_[data-slot=slider-range]]:to-green-400"
                    />
                    <div className="flex justify-between text-[10px] text-emerald-300/60">
                      <span>R$ 50k</span>
                      <span>R$ 500k</span>
                    </div>
                  </div>

                  {/* Results - Compact and Impactful */}
                  {averageTicket > 0 && (
                    <div className="bg-gradient-to-br from-black/60 to-emerald-950/40 border border-emerald-400/30 rounded-xl p-3 space-y-2">
                      {/* Main ROI Display */}
                      <div className="text-center pb-2 border-b border-emerald-500/20">
                        <div className="text-[10px] text-emerald-300/80 mb-1">SEU LUCRO MENSAL (30% MAIS VENDAS)</div>
                        <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent">
                          +R${" "}
                          {roiData.monthlyReturn.toLocaleString("pt-BR", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        <div className="text-[10px] text-emerald-400/80 mt-1">
                          {roiData.roiMultiplier > 0 && roiData.roiMultiplier !== Number.POSITIVE_INFINITY ? (
                            <span className="font-bold">{roiData.roiMultiplier.toFixed(1)}x o investimento</span>
                          ) : null}
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 rounded-lg p-2.5 text-center">
                        <div className="text-[10px] text-emerald-300/80 mb-1">RETORNO EM 3 MESES</div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                          +R${" "}
                          {roiData.threeMonthReturn.toLocaleString("pt-BR", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          })}
                        </div>
                        <div className="text-[10px] text-emerald-300/70 mt-0.5">Com a solução automatizada</div>
                      </div>

                      {/* Compact Stats Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-black/40 rounded-lg p-2">
                          <div className="text-emerald-300/70 text-[10px] mb-0.5">Vendas atuais</div>
                          <div className="text-white font-bold">{roiData.salesPerMonth}/mês</div>
                        </div>
                        <div className="bg-black/40 rounded-lg p-2">
                          <div className="text-emerald-300/70 text-[10px] mb-0.5">+30% vendas</div>
                          <div className="text-emerald-400 font-bold">+{roiData.additionalSales} vendas</div>
                        </div>
                      </div>

                      {/* Investment Display */}
                      <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 border border-slate-600/20 rounded-lg p-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">Investimento único:</span>
                          <span className="text-white font-semibold">R$ 497</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {averageTicket === 0 && (
                    <div className="bg-black/40 border border-emerald-500/20 rounded-xl p-4 text-center">
                      <p className="text-xs text-emerald-300/60">👆 Preencha seu ticket médio para ver o ROI</p>
                    </div>
                  )}
                </div>

                {/* Bottom CTA */}
                {averageTicket > 0 && roiData.roiMultiplier > 5 && (
                  <div className="mt-3 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 rounded-lg p-2 text-center">
                    <p className="text-xs text-amber-200 font-bold">
                      🚀 No primeiro mês!!! Você pode recuperar esse investimento imediatamente e começar a lucrar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Not Buying a Course Section */}
            <div className="bg-gradient-to-br from-amber-900/40 to-yellow-800/40 border border-amber-600/50 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
              <h4 className="text-base sm:text-lg font-bold text-amber-200 text-center mb-3">
                Você não está comprando um curso
              </h4>
              <p className="text-xs sm:text-sm text-amber-100 text-center leading-relaxed">
                Você está entrando no grupo dos{" "}
                <span className="font-bold text-amber-300">5% que automatizam resultados</span> enquanto a concorrência
                ainda faz tudo manualmente.
              </p>
            </div>

            {/* 6. Price Section */}
            <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-amber-500/20 rounded-xl p-6 sm:p-8 backdrop-blur-sm text-center">
              <div className="mb-4">
                <div className="text-5xl sm:text-6xl font-bold text-amber-400 mb-2">
                  R$ {PRICING.base.price.toFixed(2)}
                </div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-xl sm:text-2xl text-slate-500 line-through">
                    R$ {PRICING.base.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
                    -{PRICING.base.discount}% OFF
                  </span>
                </div>
                <p className="text-sm sm:text-base text-slate-300">Menos que duas pizzas por mês 🍕</p>
              </div>

              <div className="bg-amber-900/30 border border-amber-600/50 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-amber-200 font-semibold flex items-center justify-center gap-2">
                  <span>⚠️</span>
                  <span>O valor volta para R${PRICING.base.originalPrice.toFixed(2)} amanhã às 23h59</span>
                </p>
              </div>
            </div>

            {/* 7. Email and WhatsApp Input Fields */}
            <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-amber-500/20 rounded-xl p-4 sm:p-5 backdrop-blur-sm">
              <h3 className="text-white text-base sm:text-lg font-bold mb-3 sm:mb-4">Preencha para liberar o acesso</h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white text-sm mb-2 block">
                    Seu melhor e-mail *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="bg-[#0a0a0a] border border-amber-500/30 text-white h-12 text-base"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-white text-sm mb-2 block">
                    Seu WhatsApp (com DDD) *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="bg-[#0a0a0a] border border-amber-500/30 text-white h-12 text-base"
                    required
                    maxLength={15}
                  />
                  {phone && getPhoneNumbers(phone).length < 10 && (
                    <p className="text-xs text-red-400 mt-1">Digite um número válido com DDD (11 dígitos)</p>
                  )}
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-3">
                Enviaremos seu acesso e os bônus exclusivos para este e-mail e WhatsApp
              </p>
            </div>

            {/* 8. CTA Button */}
            <Button
              onClick={handleMainCTA}
              disabled={loading}
              className="w-full h-14 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#f59e0b] text-white font-bold text-base rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Gerando seu PIX...
                </>
              ) : (
                <>LIBERAR MEU ACESSO AGORA</>
              )}
            </Button>

            {/* 9. Bottom Trust Badges */}
            <div className="flex items-center justify-center gap-4 flex-wrap text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>✅ 100% Seguro</span>
              </div>
              <div className="flex items-center gap-1">
                <span>🔒</span>
                <span>Dados Criptografados</span>
              </div>
              <div className="flex items-center gap-1">
                <span>⚡</span>
                <span>Reembolso em 24h</span>
              </div>
            </div>

            {/* 10. Recent Purchases Alert */}
            <div className="bg-gradient-to-br from-red-900/40 to-orange-900/40 border border-red-500/50 rounded-xl p-3 sm:p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">🔥</span>
                <p className="text-red-200 font-semibold text-xs sm:text-sm">
                  {recentPurchases} novas compras nos últimos 5 minutos
                </p>
              </div>
            </div>

            {/* 11. People Counter */}
            <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/40 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-base sm:text-lg">👥</span>
                <p className="text-green-300 font-bold text-xs sm:text-sm">
                  +{peopleCount.toLocaleString()} pessoas já garantiram acesso
                </p>
              </div>
            </div>

            {/* 12. Trust Badges - 3 Boxes */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-green-500/30 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mb-2" />
                <p className="text-[10px] sm:text-xs text-green-300 font-semibold leading-tight">Compra Verificada</p>
              </div>
              <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-blue-500/30 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                <Award className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mb-2" />
                <p className="text-[10px] sm:text-xs text-blue-300 font-semibold leading-tight">
                  Aprovado por Especialistas
                </p>
              </div>
              <div className="bg-gradient-to-br from-[#1a1a1a]/80 to-[#0a0a0a]/80 border border-amber-500/30 rounded-xl p-3 sm:p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 mb-2" />
                <p className="text-[10px] sm:text-xs text-amber-300 font-semibold leading-tight">Mais Vendido</p>
              </div>
            </div>

            {/* 13. Guarantee Section */}
            <div className="bg-gradient-to-br from-[#78350f] to-[#451a03] border border-yellow-600/40 rounded-xl p-4 sm:p-5 shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-xl sm:text-2xl">🛡️</span>
                <h4 className="text-yellow-400 font-bold text-base sm:text-lg">GARANTIA TOTAL DE 7 DIAS</h4>
                <span className="text-xl sm:text-2xl">🛡️</span>
              </div>
              <p className="text-yellow-200/90 text-xs sm:text-sm text-center mb-3 sm:mb-4 leading-relaxed font-semibold">
                Se em 7 dias você não ver valor, a devolução é instantânea, sem explicar nada.
              </p>
              <p className="text-yellow-200/90 text-xs text-center mb-3 sm:mb-4 leading-relaxed">
                Testamos nosso sistema milhares de vezes. Temos tanta confiança que oferecemos garantia total. Se por
                qualquer motivo o APP não funcionar como prometido, devolvemos todo seu investimento e você fica com o
                teste.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li className="flex items-start gap-2 text-yellow-200/90">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Sem perguntas, sem burocracia</span>
                </li>
                <li className="flex items-start gap-2 text-yellow-200/90">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Reembolso em até 24 horas</span>
                </li>
                <li className="flex items-start gap-2 text-yellow-200/90">
                  <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Suporte dedicado para garantia</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {showOfferPopup && currentOffer && !transaction && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-amber-500/40 rounded-2xl max-w-md w-full p-4 sm:p-6 relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
              {currentOffer === "upsell" && (
                <>
                  <div className="text-center mb-4 sm:mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full mb-3">
                      <span className="text-3xl sm:text-4xl">🚀</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">ESPERE! Oferta Especial</h3>
                    <p className="text-amber-400 font-semibold text-xs sm:text-sm">Apenas para novos membros</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2">🎯 Plano Anual Premium</h4>
                    <p className="text-slate-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Economize {PRICING.upsell.discount}% + suporte prioritário 24/7
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-3">
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Tudo do plano mensal incluído</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Suporte prioritário 24/7</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Consultoria mensal (R$ 500/mês)</span>
                      </li>
                    </ul>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        R$ {PRICING.upsell.price.toFixed(2)}
                      </span>
                      <span className="text-lg sm:text-xl text-slate-500 line-through">
                        R$ {PRICING.upsell.originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-center text-green-400 font-semibold text-xs sm:text-sm">
                      Economize R$ {(PRICING.upsell.originalPrice - PRICING.upsell.price).toFixed(0)}!
                    </p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={() => handleAcceptOffer("upsell")}
                      disabled={loading}
                      className="w-full h-11 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-sm sm:text-base rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "SIM! Quero Economizar"
                      )}
                    </Button>
                    <button
                      onClick={handleDeclineOffer}
                      disabled={loading}
                      className="w-full text-slate-400 hover:text-slate-300 text-xs sm:text-sm underline transition-colors py-2"
                    >
                      Não, continuar com plano mensal
                    </button>
                  </div>
                </>
              )}

              {currentOffer === "cross-sell" && (
                <>
                  <div className="text-center mb-4 sm:mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full mb-3">
                      <span className="text-3xl sm:text-4xl">🎁</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Última Oferta!</h3>
                    <p className="text-green-400 font-semibold text-xs sm:text-sm">Acelere seus resultados</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2">🚀 Setup Done-For-You</h4>
                    <p className="text-slate-300 text-xs sm:text-sm mb-3 leading-relaxed">
                      Nossa equipe configura tudo em 48h
                    </p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-3">
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Configuração completa</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>10 templates personalizados</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Treinamento de 1h ao vivo</span>
                      </li>
                    </ul>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        R$ {PRICING["cross-sell"].price.toFixed(2)}
                      </span>
                      <span className="text-lg sm:text-xl text-slate-500 line-through">
                        R$ {PRICING["cross-sell"].originalPrice.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-center text-green-400 font-semibold text-xs sm:text-sm">Resultados em 48h!</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={() => handleAcceptOffer("cross-sell")}
                      disabled={loading}
                      className="w-full h-11 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-sm sm:text-base rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "SIM! Quero Resultados em 48h"
                      )}
                    </Button>
                    <button
                      onClick={handleDeclineOffer}
                      disabled={loading}
                      className="w-full text-slate-400 hover:text-slate-300 text-xs sm:text-sm underline transition-colors py-2"
                    >
                      Não, vou configurar sozinho
                    </button>
                  </div>
                </>
              )}

              {currentOffer === "downsell" && (
                <>
                  <div className="text-center mb-4 sm:mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full mb-3">
                      <span className="text-3xl sm:text-4xl">💡</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Que tal começar menor?</h3>
                    <p className="text-blue-400 font-semibold text-xs sm:text-sm">Plano básico essencial</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/40 rounded-xl p-3 sm:p-4 mb-4 sm:mb-5">
                    <h4 className="text-base sm:text-lg font-bold text-white mb-2">⚡ Plano Starter</h4>
                    <p className="text-slate-300 text-xs sm:text-sm mb-3 leading-relaxed">Comece com o essencial</p>
                    <ul className="space-y-1.5 sm:space-y-2 mb-3">
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Até 100 leads/mês</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>AI SDR básico</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Suporte por email</span>
                      </li>
                    </ul>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1">
                      <span className="text-2xl sm:text-3xl font-bold text-white">
                        R$ {PRICING.downsell.price.toFixed(2)}
                      </span>
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{PRICING.downsell.discount}% OFF
                      </span>
                    </div>
                    <p className="text-center text-blue-400 font-semibold text-xs sm:text-sm">Perfeito para começar!</p>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <Button
                      onClick={() => handleAcceptOffer("downsell")}
                      disabled={loading}
                      className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-sm sm:text-base rounded-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "SIM! Quero o Plano Starter"
                      )}
                    </Button>
                    <button
                      onClick={handleDeclineOffer}
                      disabled={loading}
                      className="w-full text-slate-400 hover:text-slate-300 text-xs sm:text-sm underline transition-colors py-2"
                    >
                      Não, continuar com plano completo
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showWhatsAppPopup && !transaction && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-green-500/50 rounded-2xl max-w-md w-full p-4 relative animate-in fade-in zoom-in duration-300 shadow-[0_0_50px_rgba(34,197,94,0.3)] max-h-[95vh] overflow-y-auto">
              <div className="relative z-10">
                <div className="text-center mb-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full mb-2 animate-pulse">
                    <span className="text-3xl">💎</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 leading-tight">ÚLTIMA CHANCE!</h3>
                  <p className="text-green-400 font-bold text-sm mb-0.5">Comunidade Exclusiva iNovaFluxo</p>
                  <p className="text-slate-300 text-xs">
                    Apenas <span className="text-red-400 font-bold">{spotsLeft} vagas</span> restantes
                  </p>
                </div>

                <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border border-green-500/40 rounded-xl p-3 mb-3">
                  <p className="text-slate-200 text-xs mb-2 leading-relaxed text-center">
                    Entre para o grupo VIP no WhatsApp com{" "}
                    <span className="text-green-400 font-bold">+500 empreendedores</span> que já estão automatizando
                    vendas!
                  </p>

                  <ul className="space-y-1.5 mb-2">
                    <li className="flex items-start gap-1.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">Estratégias exclusivas diárias</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">Networking com empreendedores</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">Suporte direto da equipe</span>
                    </li>
                    <li className="flex items-start gap-1.5 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">Templates prontos de alta conversão</span>
                    </li>
                  </ul>

                  <div className="bg-amber-900/40 border border-amber-500/50 rounded-lg p-2 mb-2.5">
                    <p className="text-amber-200 text-[10px] font-semibold text-center leading-tight">
                      🎁 BÔNUS: Banco de templates que convertem até 40% mais!
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="communityPhone" className="text-green-100 text-xs mb-1 block font-semibold">
                      Seu WhatsApp (com DDD) *
                    </Label>
                    <Input
                      id="communityPhone"
                      type="tel"
                      value={communityPhone}
                      onChange={handleCommunityPhoneChange}
                      placeholder="(11) 99999-9999"
                      className="bg-black/40 border border-green-500/30 text-white h-10 text-sm"
                      required
                      maxLength={15}
                    />
                    {communityPhone && getPhoneNumbers(communityPhone).length < 10 && (
                      <p className="text-xs text-red-400 mt-1">Digite um número válido com DDD (11 dígitos)</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Button
                    onClick={handleJoinCommunity}
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-sm rounded-xl transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.4)] active:scale-95"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "SIM! QUERO ENTRAR NA COMUNIDADE"
                    )}
                  </Button>

                  <button
                    onClick={handleDeclineCommunity}
                    disabled={loading}
                    className="w-full text-slate-400 hover:text-slate-300 text-xs underline transition-colors py-1.5"
                  >
                    Não, continuar sem a comunidade
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-700/50">
                  <p className="text-center text-[10px] text-slate-400 leading-tight">
                    ⚡ <span className="text-green-400 font-bold">{recentPurchases} pessoas</span> entraram nos últimos
                    10 min
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showCommunitySuccess && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-green-900/80 to-emerald-900/80 border-2 border-green-500/50 rounded-2xl max-w-md w-full p-6 sm:p-8 text-center animate-in fade-in zoom-in duration-300 shadow-[0_0_50px_rgba(34,197,94,0.5)]">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/30 rounded-full mb-4 animate-bounce">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Parabéns! 🎉</h3>
              <p className="text-green-200 text-sm sm:text-base mb-2 leading-relaxed">
                Você garantiu sua vaga na comunidade exclusiva iNovaFluxo!
              </p>
              <p className="text-green-300/80 text-xs sm:text-sm leading-relaxed">
                Nossa equipe entrará em contato pelo WhatsApp <span className="font-bold">{communityPhone}</span> em
                breve para adicionar você ao grupo VIP.
              </p>
              <div className="mt-4">
                <Loader2 className="w-6 h-6 text-green-400 animate-spin mx-auto" />
                <p className="text-xs text-green-300/60 mt-2">Redirecionando...</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
