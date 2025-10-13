"use client"

import { useState, useRef } from "react"
import {
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Brain,
  User,
  Zap,
  Target,
} from "lucide-react"

type Lead = {
  id: string
  company_name: string
  category?: string
  email?: string
  phone?: string
  google_rating?: number
  review_count?: number
  enriched?: boolean
  industry_insights?: string
}

type MessagesSectionProps = {
  savedLeads: Lead[]
  onComplete: (messageData: { message: string; date: string; time: string }) => void
  readOnly?: boolean
}

export default function MessagesSection({ savedLeads, onComplete, readOnly = false }: MessagesSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedMessage, setGeneratedMessage] = useState("")
  const [copied, setCopied] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const scrollPositionRef = useRef<number>(0)

  const generateMessage = async () => {
    scrollPositionRef.current = window.scrollY

    setIsGenerating(true)

    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const lead = savedLeads[0]

    // Generate scheduled date/time (tomorrow at 10:00 AM)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(10, 0, 0, 0)

    setScheduledDate(tomorrow.toLocaleDateString("pt-BR"))
    setScheduledTime(tomorrow.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }))

    const message = `Olá, equipe da ${lead.company_name}! 👋

Meu nome é [Seu Nome] e identificamos que vocês são referência em ${lead.category || "seu setor"}${lead.google_rating ? ` com excelente avaliação de ${lead.google_rating}⭐` : ""}.

${lead.enriched && lead.industry_insights ? `Notamos que ${lead.industry_insights.toLowerCase()}` : "Gostaríamos de apresentar uma solução inovadora que pode otimizar suas operações."}

Nossa tecnologia já ajudou empresas similares a:
✅ Aumentar a eficiência operacional em até 40%
✅ Reduzir custos com automação inteligente  
✅ Melhorar significativamente a experiência do cliente

Que tal agendarmos 15 minutos para uma conversa rápida? Tenho certeza que podemos agregar valor ao trabalho excepcional que já realizam.

Aguardo seu retorno!

Atenciosamente,
[Seu Nome]
[Sua Empresa]`

    setGeneratedMessage(message)
    setIsGenerating(false)
    setHasGenerated(true)

    setTimeout(() => {
      window.scrollTo({ top: scrollPositionRef.current, behavior: "instant" })
    }, 0)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleComplete = () => {
    onComplete({
      message: generatedMessage,
      date: scheduledDate,
      time: scheduledTime,
    })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-amber-500/30">
        <div>
          <h3 className="text-white font-semibold text-sm md:text-base mb-1">
            Etapa 3: Mensagens IA {readOnly && "✓"}
          </h3>
          <p className="text-slate-300 text-xs md:text-sm">
            {readOnly ? "Etapa concluída - Visualizando mensagem gerada" : "Gere uma mensagem personalizada com IA"}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">Como Funciona a Mensagem Gerada?</h3>
        </div>

        <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
          Nossa IA especialista em abordagem comercial analisa todas as informações do lead e cria mensagens
          personalizadas que geram conexão e aumentam suas chances de conversão.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-5 h-5 text-purple-400" />
              <h4 className="text-white font-semibold text-sm">Personalização Inteligente</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Puxa informações específicas do lead como nome da empresa, setor, avaliações e insights do mercado
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <h4 className="text-white font-semibold text-sm">Abordagem Estratégica</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Cria mensagens com tom profissional e persuasivo, destacando benefícios relevantes para o lead
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h4 className="text-white font-semibold text-sm">Agendamento Automático</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Define automaticamente o melhor horário e data para envio, otimizando as taxas de resposta
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <h4 className="text-white font-semibold text-sm">Pronta para Envio</h4>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Mensagem completa e editável, pronta para ser copiada e enviada via email ou WhatsApp
            </p>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-green-400 font-semibold text-sm mb-1">Resultado:</p>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
                Mensagens personalizadas que geram conexão genuína com seus leads, aumentando significativamente suas
                taxas de resposta e conversão em vendas.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        {!isGenerating && !hasGenerated && !readOnly && (
          <div className="flex justify-center">
            <button
              onClick={generateMessage}
              disabled={savedLeads.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-purple-500/25"
            >
              <Sparkles className="w-5 h-5" />
              Gerar Mensagem com IA
            </button>
          </div>
        )}

        {isGenerating && (
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg md:rounded-xl p-6 md:p-8 border border-purple-500/30 animate-pulse">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Criando Mensagem Personalizada...</h3>
              <p className="text-slate-300 text-sm md:text-base">
                Analisando informações do lead e gerando conteúdo estratégico
              </p>
            </div>
          </div>
        )}

        {!isGenerating && hasGenerated && (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-4 md:p-6 border border-amber-500/20">
            <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
              <div className="p-2 md:p-3 bg-amber-500/10 rounded-lg">
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white">Mensagem Personalizada</h2>
                <p className="text-slate-400 text-xs md:text-sm">Criada com base nas informações enriquecidas</p>
              </div>
            </div>

            {/* Lead info */}
            <div className="mb-4 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
              <div className="flex items-center gap-2 mb-2">
                <Send className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 text-xs font-semibold">Destinatário:</span>
              </div>
              <p className="text-white font-semibold">{savedLeads[0]?.company_name}</p>
              {savedLeads[0]?.category && (
                <span className="inline-block mt-2 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded">
                  {savedLeads[0].category}
                </span>
              )}
            </div>

            {/* Scheduling info */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-xs font-semibold">Data de Envio:</span>
                </div>
                <p className="text-white font-semibold">{scheduledDate}</p>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-xs font-semibold">Horário:</span>
                </div>
                <p className="text-white font-semibold">{scheduledTime}</p>
              </div>
            </div>

            {/* Message content */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Conteúdo da Mensagem:</label>
                <div className="relative">
                  <textarea
                    value={generatedMessage}
                    readOnly
                    className="w-full h-64 md:h-80 px-3 md:px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none text-xs md:text-sm leading-relaxed"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-3 right-3 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-600"
                    title="Copiar mensagem"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>

              {copied && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm">Mensagem copiada para a área de transferência!</span>
                </div>
              )}
            </div>

            {!readOnly && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleComplete}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-green-500/25"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Concluir Etapa
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
