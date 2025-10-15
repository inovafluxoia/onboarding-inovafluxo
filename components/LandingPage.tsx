"use client"

import {
  ArrowRight,
  TrendingUp,
  Clock,
  Zap,
  Users,
  Shield,
  Target,
  MessageSquare,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import { useEffect, useState } from "react"
import Navigation from "./Navigation"

interface LandingPageProps {
  onStartDemo: () => void
}

export default function LandingPage({ onStartDemo }: LandingPageProps) {
  const [counters, setCounters] = useState({
    performance: 0,
    automation: 0,
    efficiency: 0,
  })

  useEffect(() => {
    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounters({
        performance: Math.floor(99 * progress),
        automation: Math.floor(100 * progress),
        efficiency: Math.floor(3 * progress * 10) / 10,
      })

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-0 left-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

      <Navigation onStartDemo={onStartDemo} />

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pt-20 sm:pt-24">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 w-full max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-4 md:mb-6 font-heading leading-tight px-2">
            Descubra Como Empresas Estão{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FF8C00]">
              Automatizando suas Vendas
            </span>{" "}
            com IA — Enquanto Dormem
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-6 sm:mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto px-4">
            Chegou o ecossistema que transforma toda sua operação comercial em uma máquina previsível de geração de
            oportunidades. Veja ao vivo como a IA executa cada parte do seu processo — do contato ao fechamento da venda.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 mb-4 sm:mb-6 md:mb-8 px-4">
            <button
              onClick={onStartDemo}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white font-bold rounded-xl transition-all duration-300 shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 text-sm sm:text-base"
            >
              <span className="text-center">Iniciar Demonstração Agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>
            <p className="text-slate-400 text-xs sm:text-sm text-center">
              Experimente o poder da automação comercial em ação (sem compromisso).
            </p>
          </div>
        </div>

        <div className="mb-12 sm:mb-16 md:mb-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-6 sm:mb-8 md:mb-12 font-heading px-4">
            Resultados Reais. Impacto Imediato.
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-400 flex-shrink-0" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                  +{counters.performance}%
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">de performance comercial</p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-400 flex-shrink-0" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                  {counters.automation}%
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">de automação validada</p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-400 flex-shrink-0" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">24/7</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">Operação ativa</p>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-400 flex-shrink-0" />
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
                  {counters.efficiency}x
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-medium">mais eficiência em fechamento</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto text-center px-4">
            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed italic border-l-4 border-orange-500 pl-4 sm:pl-6 py-3">
              "Empresas que automatizam com IA aumentam o faturamento em menos de 30 dias — e reduzem custos
              operacionais instantaneamente."
            </p>
          </div>
        </div>

        <div className="mb-12 sm:mb-16 md:mb-20" id="diferenciais">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12 md:mb-16 px-4">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 md:mb-6 font-heading">
              Pare de perder tempo com tarefas que sua IA pode fazer{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFA500] to-[#FF8C00]">
                melhor que você
              </span>
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed mb-4 sm:mb-6">
              Enquanto você gasta horas prospectando e dando follow-up, nossos agentes de IA fazem tudo sozinhos,
              identificam leads, nutrem relacionamentos e executam estratégias que não param nem por um segundo.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-orange-400 font-semibold">
              A cada dia que passa, alguém fecha um negócio que poderia ser seu.
            </p>

            <button
              onClick={onStartDemo}
              className="group inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 text-sm sm:text-base mt-4 sm:mt-6"
            >
              Quero ver funcionando agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-4">
            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-orange-500/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">Prospecção Inteligente</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    A IA encontra oportunidades qualificadas no momento certo — sem você precisar buscar.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-orange-500/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">Nutrição Estratégica</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Mensagens que despertam interesse e fazem seus leads quererem falar com você.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-orange-500/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">Follow-up Automático</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Nunca mais perca um fechamento por esquecimento. A IA acompanha cada lead até o sim.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#1a1f2e]/90 to-[#0C0F18]/90 backdrop-blur-sm border border-orange-500/20 rounded-xl p-4 sm:p-5 md:p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="bg-orange-500/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2">Execução Contínua</h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Enquanto você dorme, ela trabalha. Enquanto você foca em crescer, ela fecha negócios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 backdrop-blur-sm border border-orange-500/30 rounded-2xl p-5 sm:p-6 md:p-10 text-center mb-12 sm:mb-16 md:mb-20 max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3 md:mb-4 font-heading px-2">
            Cada minuto sem automação é uma oportunidade perdida.
          </h3>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-4 sm:mb-6 md:mb-8 leading-relaxed px-4">
            Empresas inteligentes já estão transformando tempo em lucro com agentes de IA.
            <br />
            <span className="text-orange-400 font-semibold">A sua vai esperar mais quanto?</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <button
              onClick={onStartDemo}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] hover:from-[#FF8C00] hover:to-[#FFA500] text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 text-sm sm:text-base"
            >
              Quero minha demonstração agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </button>

            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-400 text-xs sm:text-sm font-medium">Teste gratuito + Garantia de 7 dias</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#0C0F18]/80 backdrop-blur-md border-t border-orange-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-xl" />
                <img
                  src="/LogoInovaFluxo1.png"
                  alt="InovaFluxo"
                  className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full"
                />
              </div>
              <h4 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent font-heading">
                iNovaFluxo
              </h4>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base mb-1 sm:mb-2 px-4">
              Deixe que a IA execute. Você apenas acompanha os resultados — automáticos, consistentes e escaláveis.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm mb-2 sm:mb-3">
              O futuro da operação comercial começa agora.
            </p>
            <button
              onClick={onStartDemo}
              className="text-orange-400 hover:text-orange-300 font-medium transition-colors text-xs sm:text-sm inline-flex items-center gap-1"
            >
              Inicie sua demonstração e veja acontecendo diante dos seus olhos
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
