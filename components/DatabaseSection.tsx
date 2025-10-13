"use client"

import type React from "react"
import { useState } from "react"
import {
  Database,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  X,
  Trash2,
  ArrowRight,
  Users,
  CheckCircle2,
  Loader2,
  Sparkles,
  TrendingUp,
  Instagram,
  Linkedin,
  Search,
  Brain,
} from "lucide-react"

type LeadPreview = {
  id: string
  company_name: string
  website: string | null
  phone: string | null
  email: string | null
  address: string | null
  category: string
  search_query: string
  google_rating: number | null
  review_count: number
  business_image: string | null
  maps_classification: string | null
  featured_review: string | null
  differential: string | null
  status: "new" | "contacted" | "interested" | "not_interested"
  enriched?: boolean
  industry_insights?: string
  competitor_analysis?: string
  growth_potential?: string
}

type DatabaseSectionProps = {
  savedLeads: LeadPreview[]
  setSavedLeads: React.Dispatch<React.SetStateAction<LeadPreview[]>>
  sessionId: string | null
  onComplete: () => void
  readOnly?: boolean
}

export default function DatabaseSection({
  savedLeads,
  setSavedLeads,
  sessionId,
  onComplete,
  readOnly = false,
}: DatabaseSectionProps) {
  const [selectedLead, setSelectedLead] = useState<LeadPreview | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [actionResult, setActionResult] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isNurturing, setIsNurturing] = useState(false)
  const [nurturingProgress, setNurturingProgress] = useState(0)
  const [currentNurturingLead, setCurrentNurturingLead] = useState<string | null>(null)
  const [verifiedLeads, setVerifiedLeads] = useState<Set<string>>(new Set())

  const startNurturing = async () => {
    setIsNurturing(true)
    setNurturingProgress(0)

    // Simulate nurturing each lead
    for (let i = 0; i < savedLeads.length; i++) {
      setCurrentNurturingLead(savedLeads[i].id)
      setNurturingProgress(((i + 1) / savedLeads.length) * 100)

      // Simulate API delay for each lead
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    const enrichedLeads = savedLeads.map((lead) => ({
      ...lead,
      enriched: true,
      industry_insights: `Mercado de ${lead.category} em crescimento de 15% ao ano. Alta demanda por soluções digitais.`,
      competitor_analysis: `Principais concorrentes: 3-5 empresas na região. Oportunidade de diferenciação através de tecnologia.`,
      growth_potential: `Potencial de crescimento: Alto. Empresa bem avaliada e com base de clientes estabelecida.`,
    }))

    setSavedLeads(enrichedLeads)
    setIsNurturing(false)
    setCurrentNurturingLead(null)
    setNurturingProgress(100)

    setActionResult({
      type: "success",
      message: "Leads nutridos com sucesso! Informações adicionais foram coletadas.",
    })

    setTimeout(() => setActionResult(null), 3000)
  }

  const handleClearHistory = () => {
    setSavedLeads([])
    setShowClearConfirm(false)
    setActionResult({
      type: "success",
      message: "Histórico limpo com sucesso!",
    })
    setTimeout(() => setActionResult(null), 2000)
  }

  const handleDeleteLead = () => {
    setIsProcessing(true)
    const updatedLeads = savedLeads.filter((lead) => lead.id !== selectedLead?.id)
    setSavedLeads(updatedLeads)
    setSelectedLead(null)
    setActionResult({
      type: "success",
      message: "Lead excluído com sucesso!",
    })
    setTimeout(() => {
      setActionResult(null)
      setIsProcessing(false)
    }, 2000)
  }

  const handleCompleteStep = () => {
    setTimeout(() => {
      onComplete()
    }, 1500)
  }

  const handleLeadClick = (lead: LeadPreview) => {
    setSelectedLead(lead)
    setVerifiedLeads((prev) => new Set(prev).add(lead.id))
  }

  const hasVerifiedAtLeastOne = verifiedLeads.size > 0

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-white font-semibold text-sm md:text-base mb-1">
              Etapa 2: Nutrição de Leads {readOnly && "✓"}
            </h3>
            <p className="text-slate-300 text-xs md:text-sm">
              {readOnly
                ? "Etapa concluída - Visualizando leads enriquecidos"
                : "Enriqueça seus leads com informações estratégicas"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-500/30">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-2">Como Funciona a Nutrição de Leads?</h4>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
              Nossa IA realiza uma análise profunda de cada lead, coletando informações estratégicas de múltiplas fontes
              digitais para enriquecer seu banco de dados e potencializar suas conversões.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <h5 className="text-white font-semibold text-sm md:text-base">Websites</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">
              Análise de sites corporativos, portfólios e páginas de serviços
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Instagram className="w-4 h-4 md:w-5 md:h-5 text-pink-400" />
              <h5 className="text-white font-semibold text-sm md:text-base">Instagram</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Engajamento, conteúdo publicado e interação com público</p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
              <h5 className="text-white font-semibold text-sm md:text-base">LinkedIn</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Perfil profissional, conexões e atividades corporativas</p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
              <h5 className="text-white font-semibold text-sm md:text-base">Outras Fontes</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">Reviews, notícias, menções e presença digital geral</p>
          </div>
        </div>

        <div className="mt-4 p-3 md:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-400 text-xs md:text-sm">
              <span className="font-semibold">Resultado:</span> Leads enriquecidos com insights de mercado, análise
              competitiva e potencial de crescimento para abordagens mais assertivas e personalizadas.
            </p>
          </div>
        </div>
      </div>

      {!isNurturing && savedLeads.length > 0 && !savedLeads[0].enriched && !readOnly && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-4 md:p-8 border border-purple-500/20 shadow-2xl">
          <div className="text-center">
            <div className="mb-4 md:mb-6">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4">
                <span className="text-slate-400 text-xs md:text-sm">Leads prontos para nutrição:</span>
                <span className="text-purple-400 font-semibold text-xs md:text-sm">{savedLeads.length} leads</span>
              </div>
            </div>

            <button
              onClick={startNurturing}
              className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold text-base md:text-lg rounded-lg shadow-lg shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2 md:gap-3 mx-auto"
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-sm md:text-base">Iniciar Nutrição de Leads</span>
            </button>
          </div>
        </div>
      )}

      {isNurturing && (
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg md:rounded-xl p-6 md:p-8 border border-purple-500/30 animate-pulse">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Nutrindo Leads...</h3>
            <p className="text-slate-300 text-sm md:text-base mb-4">
              Coletando informações estratégicas sobre seus leads
            </p>
            <div className="max-w-md mx-auto">
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${nurturingProgress}%` }}
                />
              </div>
              <p className="text-slate-400 text-sm md:text-base">{Math.round(nurturingProgress)}% concluído</p>
            </div>
          </div>
        </div>
      )}

      {!isNurturing && (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-4 md:p-6 border border-amber-500/20">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-amber-500/10 rounded-lg">
              <Database className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Nutrição de Leads</h2>
              <p className="text-slate-400 text-xs md:text-sm">{savedLeads.length} leads enriquecidos</p>
            </div>
          </div>

          {actionResult && !selectedLead && (
            <div
              className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
                actionResult.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              {actionResult.type === "success" && <CheckCircle2 className="w-4 h-4" />}
              <span className="text-xs md:text-sm">{actionResult.message}</span>
            </div>
          )}

          {!isNurturing && savedLeads.length > 0 && savedLeads[0].enriched && (
            <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-400 font-semibold text-sm mb-1">Leads Enriquecidos!</h4>
                  <p className="text-slate-300 text-xs md:text-sm">
                    Verifique as informações adicionais coletadas para cada lead. Clique em um card para ver os insights
                    estratégicos.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {savedLeads.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <Database className="w-10 h-10 md:w-12 md:h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm md:text-base">Nenhum lead salvo ainda</p>
                <p className="text-slate-500 text-xs md:text-sm mt-1">
                  Use a seção de Prospecção para buscar e salvar leads
                </p>
              </div>
            ) : (
              <>
                {!isNurturing && savedLeads[0].enriched && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {savedLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className={`bg-slate-900/50 rounded-lg border ${readOnly ? "border-green-500/30" : "border-green-500/30"} hover:border-amber-500/30 transition-all overflow-hidden cursor-pointer p-3 md:p-4`}
                        onClick={() => handleLeadClick(lead)}
                      >
                        {lead.enriched && (
                          <div className="flex items-center gap-1 mb-2">
                            <Sparkles className="w-3 h-3 text-green-400" />
                            <span className="text-green-400 text-xs font-semibold">Enriquecido</span>
                          </div>
                        )}

                        {lead.google_rating && (
                          <div className="flex items-center gap-2 mb-2 md:mb-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                              <span className="text-white text-sm font-semibold">{lead.google_rating}</span>
                            </div>
                            {lead.review_count > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-slate-400 text-sm">{lead.review_count}</span>
                                <Users className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                          </div>
                        )}

                        <h4 className="text-white font-semibold mb-2 line-clamp-2 text-sm md:text-base">
                          {lead.company_name}
                        </h4>

                        {lead.category && (
                          <span className="inline-block mb-2 md:mb-3 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs md:text-sm rounded">
                            {lead.category}
                          </span>
                        )}

                        {lead.address && (
                          <div className="flex items-start gap-2 text-slate-300 text-xs md:text-sm mb-3">
                            <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{lead.address}</span>
                          </div>
                        )}

                        <div className="mt-3 flex items-center justify-center text-amber-400 text-xs md:text-sm font-medium">
                          Ver detalhes
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isNurturing && savedLeads.length > 0 && savedLeads[0].enriched && !readOnly && (
                  <div className="mt-6 flex flex-col items-center gap-3">
                    {!hasVerifiedAtLeastOne && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg text-center max-w-md">
                        <p className="text-blue-400 text-xs md:text-sm">
                          Clique em pelo menos 1 card para verificar as informações antes de concluir a etapa
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleCompleteStep}
                      disabled={!hasVerifiedAtLeastOne}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-amber-500 disabled:hover:to-amber-600"
                    >
                      Concluir Etapa
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-3 md:p-4 animate-in fade-in duration-200"
          onClick={() => {
            setSelectedLead(null)
            setActionResult(null)
          }}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg sm:rounded-xl border border-amber-500/30 w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-amber-500/20 p-3 sm:p-4 md:p-6 z-10">
              <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3 md:mb-4">
                <div className="flex-1 min-w-0 pr-1">
                  <h3 className="text-base sm:text-lg md:text-2xl font-bold text-white mb-1.5 sm:mb-2 break-words">
                    {selectedLead.company_name}
                  </h3>
                  {selectedLead.category && (
                    <span className="inline-block px-2 py-0.5 sm:py-1 bg-amber-500/10 text-amber-400 text-xs sm:text-sm rounded">
                      {selectedLead.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedLead(null)
                    setActionResult(null)
                  }}
                  className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                </button>
              </div>

              {!readOnly && (
                <button
                  onClick={handleDeleteLead}
                  disabled={isProcessing}
                  className="w-full px-3 py-2 sm:py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Excluir Lead
                </button>
              )}

              {actionResult && (
                <div
                  className={`mt-2 sm:mt-3 md:mt-4 p-2 sm:p-3 rounded-lg border flex items-center gap-2 ${
                    actionResult.type === "success"
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
                >
                  {actionResult.type === "success" && <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                  <span className="text-xs sm:text-sm">{actionResult.message}</span>
                </div>
              )}
            </div>

            <div className="p-3 sm:p-4 md:p-6 space-y-2.5 sm:space-y-3 md:space-y-4">
              {selectedLead.google_rating && (
                <div className="p-3 sm:p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 fill-amber-400 flex-shrink-0" />
                    <span className="text-white font-semibold text-xl sm:text-2xl">{selectedLead.google_rating}</span>
                    {selectedLead.review_count > 0 && (
                      <>
                        <div className="w-px h-5 sm:h-6 bg-amber-500/30" />
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span className="text-slate-300 text-base sm:text-lg">{selectedLead.review_count}</span>
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {selectedLead.address && (
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Endereço:</p>
                    <p className="text-white text-xs sm:text-sm break-words">{selectedLead.address}</p>
                  </div>
                </div>
              )}

              {selectedLead.phone && (
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Telefone:</p>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="text-white hover:text-amber-400 transition-colors text-xs sm:text-sm break-all"
                    >
                      {selectedLead.phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedLead.website && (
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Website:</p>
                    <a
                      href={selectedLead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-amber-400 transition-colors text-xs sm:text-sm break-all block"
                    >
                      {selectedLead.website}
                    </a>
                  </div>
                </div>
              )}

              {selectedLead.email && (
                <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Email:</p>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-white hover:text-amber-400 transition-colors text-xs sm:text-sm break-all"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                </div>
              )}

              {selectedLead.enriched && (
                <>
                  <div className="border-t border-slate-700/50 pt-3 sm:pt-4">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                      <h4 className="text-base sm:text-lg font-semibold text-white">Informações Enriquecidas</h4>
                    </div>
                  </div>

                  {selectedLead.industry_insights && (
                    <div className="p-3 sm:p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                      <p className="text-purple-400 text-xs mb-1.5 sm:mb-2 font-semibold">Insights do Mercado:</p>
                      <p className="text-white text-xs sm:text-sm leading-relaxed break-words">
                        {selectedLead.industry_insights}
                      </p>
                    </div>
                  )}

                  {selectedLead.competitor_analysis && (
                    <div className="p-3 sm:p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <p className="text-blue-400 text-xs mb-1.5 sm:mb-2 font-semibold">Análise Competitiva:</p>
                      <p className="text-white text-xs sm:text-sm leading-relaxed break-words">
                        {selectedLead.competitor_analysis}
                      </p>
                    </div>
                  )}

                  {selectedLead.growth_potential && (
                    <div className="p-3 sm:p-4 bg-green-500/5 rounded-lg border border-green-500/20">
                      <p className="text-green-400 text-xs mb-1.5 sm:mb-2 font-semibold">Potencial de Crescimento:</p>
                      <p className="text-white text-xs sm:text-sm leading-relaxed break-words">
                        {selectedLead.growth_potential}
                      </p>
                    </div>
                  )}
                </>
              )}

              {selectedLead.featured_review && (
                <div className="p-3 sm:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-amber-400 text-xs mb-1.5 sm:mb-2 font-semibold">Review em Destaque:</p>
                  <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed break-words">
                    "{selectedLead.featured_review}"
                  </p>
                </div>
              )}

              {selectedLead.differential && (
                <div className="p-3 sm:p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                  <p className="text-amber-400 text-xs mb-1.5 sm:mb-2 font-semibold">Diferencial:</p>
                  <p className="text-white text-xs sm:text-sm leading-relaxed break-words">
                    {selectedLead.differential}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200"
          onClick={() => !isProcessing && setShowClearConfirm(false)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-red-500/30 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between gap-2 mb-3 md:mb-4">
                <div className="flex-1 pr-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Limpar Histórico</h3>
                </div>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <p className="text-slate-300 mb-4 md:mb-6 text-sm md:text-base">
                Tem certeza que deseja limpar todo o histórico de leads? Esta ação não pode ser desfeita e todos os{" "}
                <span className="text-white font-semibold">{savedLeads.length} leads</span> serão permanentemente
                removidos.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <button
                  onClick={handleClearHistory}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2.5 md:py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Limpando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Sim, Limpar Tudo
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 md:py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all disabled:opacity-50 text-sm md:text-base"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
