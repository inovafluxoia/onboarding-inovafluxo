"use client"

import { useState, useEffect, useRef } from "react"
import { Bot, User, CheckCircle2, Calendar, Clock, Send, Brain, MessageSquare, Target, Zap, Play } from "lucide-react"

type Lead = {
  id: string
  company_name: string
  category?: string
}

type Message = {
  id: number
  sender: "user" | "ai"
  text: string
  timestamp: string
  isTyping?: boolean
}

type AISdrSectionProps = {
  savedLeads: Lead[]
  generatedMessage: string
  scheduledDate: string
  scheduledTime: string
  onComplete: () => void
  readOnly?: boolean
}

export default function AISdrSection({
  savedLeads,
  generatedMessage,
  scheduledDate,
  scheduledTime,
  onComplete,
  readOnly = false,
}: AISdrSectionProps) {
  const [isScheduling, setIsScheduling] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [conversationComplete, setConversationComplete] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const lead = savedLeads[0]

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const startConversation = async () => {
    setConversationStarted(true)
    setIsScheduling(false)

    await new Promise((resolve) => setTimeout(resolve, 1000))
    const userMessage: Message = {
      id: 1,
      sender: "user",
      text: generatedMessage,
      timestamp: `${scheduledDate} às ${scheduledTime}`,
    }
    setMessages([userMessage])

    await simulateTyping(2000)
    const aiMessage1: Message = {
      id: 2,
      sender: "ai",
      text: `Olá! Obrigado por entrar em contato. Fiquei interessado em conhecer mais sobre a solução que vocês oferecem. Pode me contar um pouco mais sobre como funciona?`,
      timestamp: getCurrentTime(1),
    }
    setMessages((prev) => [...prev, aiMessage1])

    await simulateTyping(2500)
    const userMessage2: Message = {
      id: 3,
      sender: "user",
      text: `Claro! Nossa plataforma utiliza IA para automatizar processos de prospecção e qualificação de leads. Conseguimos reduzir em até 70% o tempo gasto nessas atividades, permitindo que sua equipe foque no que realmente importa: fechar negócios.`,
      timestamp: getCurrentTime(2),
    }
    setMessages((prev) => [...prev, userMessage2])

    await simulateTyping(2000)
    const aiMessage2: Message = {
      id: 4,
      sender: "ai",
      text: `Interessante! E como funciona o investimento? Vocês têm algum case de sucesso no nosso segmento de ${lead.category || "negócio"}?`,
      timestamp: getCurrentTime(3),
    }
    setMessages((prev) => [...prev, aiMessage2])

    await simulateTyping(3000)
    const userMessage3: Message = {
      id: 5,
      sender: "user",
      text: `Sim! Temos diversos cases no setor de ${lead.category || "seu segmento"}. Uma empresa similar aumentou em 150% a taxa de conversão de leads em apenas 3 meses. Quanto ao investimento, temos planos a partir de R$ 197/mês. Que tal agendarmos uma demonstração personalizada para mostrar como podemos ajudar especificamente a ${lead.company_name}?`,
      timestamp: getCurrentTime(4),
    }
    setMessages((prev) => [...prev, userMessage3])

    await simulateTyping(2000)
    const aiMessage3: Message = {
      id: 6,
      sender: "ai",
      text: `Perfeito! Gostaria sim de agendar uma demonstração. Tenho disponibilidade na próxima semana. Qual seria o melhor dia e horário para vocês?`,
      timestamp: getCurrentTime(5),
    }
    setMessages((prev) => [...prev, aiMessage3])

    await simulateTyping(1500)
    const userMessage4: Message = {
      id: 7,
      sender: "user",
      text: `Excelente! Vou agendar para terça-feira, 15/10, às 14h. Você receberá um link de videoconferência por email. Até lá! 🎯`,
      timestamp: getCurrentTime(6),
    }
    setMessages((prev) => [...prev, userMessage4])

    await new Promise((resolve) => setTimeout(resolve, 1000))
    setConversationComplete(true)
  }

  const simulateTyping = async (duration: number) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, duration))
    setIsTyping(false)
  }

  const getCurrentTime = (minutesOffset: number) => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + minutesOffset)
    return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-amber-500/30">
        <div>
          <h3 className="text-white font-semibold text-sm md:text-base mb-1">Etapa 4: AI SDR {readOnly && "✓"}</h3>
          <p className="text-slate-300 text-xs md:text-sm">
            {readOnly
              ? "Etapa concluída - Visualizando conversa"
              : "Inicie a qualificação e agendamento automático da reunião"}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-500/30">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white">Como funciona o AI SDR?</h3>
        </div>

        <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
          Nossa IA especializada em vendas trabalha 24/7 para qualificar leads, responder objeções de forma humanizada e
          agendar reuniões automaticamente, tudo sem intervenção humana.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Send className="w-5 h-5 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">Envio Programado</h4>
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Envia mensagens automaticamente na data e hora ideal para máximo engajamento com cada lead.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">Qualificação Inteligente</h4>
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Identifica o perfil do lead, entende suas necessidades e qualifica automaticamente o potencial de
              conversão.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <MessageSquare className="w-5 h-5 text-green-400" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">Respostas Humanizadas</h4>
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Responde objeções e dúvidas de forma natural e personalizada, criando uma experiência autêntica de
              conversa.
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-white font-semibold text-sm md:text-base">Agendamento Automático</h4>
            </div>
            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
              Agenda reuniões automaticamente quando identifica interesse, sincronizando com sua agenda disponível.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-lg p-4 border border-green-500/30">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-green-400" />
            <p className="text-green-400 font-semibold text-sm md:text-base">
              Resultado: Leads qualificados e reuniões agendadas no automático, 24/7!
            </p>
          </div>
        </div>
      </div>

      {!conversationStarted && !readOnly && (
        <div className="flex justify-center">
          <button
            onClick={startConversation}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-blue-500/25"
          >
            <Play className="w-5 h-5" />
            Iniciar Conversa com AI SDR
          </button>
        </div>
      )}

      {isScheduling && conversationStarted && !readOnly ? (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl border border-amber-500/20 p-8 md:p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative p-4 bg-amber-500/20 rounded-full">
                <Clock className="w-12 h-12 text-amber-400 animate-spin" style={{ animationDuration: "3s" }} />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h3 className="text-xl font-bold text-white">Agendando Envio Automático</h3>
              <p className="text-slate-300 text-sm max-w-md">
                A AI SDR está programando o envio da mensagem para o momento ideal de engajamento
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-4 border border-amber-500/20 w-full max-w-sm">
              <div className="flex items-center justify-between">
                <Calendar className="w-5 h-5 text-amber-400" />
                <span className="text-slate-300 font-semibold">Data e Hora do Envio</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Data:</span>
                  <span className="text-white font-semibold">{scheduledDate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Horário:</span>
                  <span className="text-white font-semibold">{scheduledTime}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                  <span className="text-slate-400 text-sm">Destinatário:</span>
                  <span className="text-amber-400 font-semibold text-sm">{lead.company_name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <Send className="w-4 h-4" />
              <span className="text-sm font-semibold">Mensagem será enviada automaticamente</span>
            </div>
          </div>
        </div>
      ) : (
        conversationStarted && (
          <>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl border border-amber-500/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <span className="text-xl">{lead.company_name.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm md:text-base">{lead.company_name}</h3>
                  <p className="text-green-100 text-xs">
                    {isTyping ? "digitando..." : conversationComplete ? "Reunião agendada ✓" : "online"}
                  </p>
                </div>
              </div>

              <div
                ref={containerRef}
                className="h-[350px] md:h-[400px] overflow-y-auto p-3 md:p-4 bg-[#0a0e1a] space-y-2 md:space-y-3"
              >
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="bg-slate-800/80 px-3 py-1 rounded-full text-xs text-slate-400">{scheduledDate}</div>
                </div>

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] md:max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === "user" ? "bg-amber-500" : "bg-green-500"
                          }`}
                        >
                          {message.sender === "user" ? (
                            <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                          )}
                        </div>
                        {message.sender === "user" && (
                          <span className="text-[9px] md:text-[10px] text-amber-400 font-medium whitespace-nowrap">
                            SDR Sofia
                          </span>
                        )}
                      </div>

                      <div>
                        <div
                          className={`rounded-lg p-2.5 md:p-3 ${
                            message.sender === "user"
                              ? "bg-amber-500 text-white rounded-tr-none"
                              : "bg-slate-800 text-slate-100 rounded-tl-none"
                          }`}
                        >
                          <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                        </div>
                        <p
                          className={`text-[10px] md:text-xs text-slate-500 mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex gap-2 max-w-[85%] md:max-w-[80%]">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-500">
                        <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                      </div>
                      <div className="bg-slate-800 rounded-lg rounded-tl-none p-2.5 md:p-3">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {conversationComplete && (
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 border-t border-green-500/30 p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 bg-green-500/20 rounded-lg">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-green-400 font-semibold text-xs md:text-sm">Reunião Agendada com Sucesso!</p>
                      <p className="text-slate-400 text-[10px] md:text-xs">Terça-feira, 15/10 às 14h</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                  </div>
                </div>
              )}
            </div>

            {conversationComplete && !readOnly && (
              <div className="flex justify-center">
                <button
                  onClick={onComplete}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-green-500/25"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Concluir Demonstração
                </button>
              </div>
            )}
          </>
        )
      )}
    </div>
  )
}
