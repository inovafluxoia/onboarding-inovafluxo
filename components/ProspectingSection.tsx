"use client"

import type React from "react"

import { useState } from "react"
import {
  Target,
  MapPin,
  Loader2,
  CheckCircle2,
  Eye,
  X,
  Phone,
  Mail,
  Globe,
  Star,
  AlertTriangle,
  ArrowRight,
  Users,
  Play,
  Brain,
  Search,
  Database,
  Sparkles,
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
}

type ProspectingSectionProps = {
  savedLeads: LeadPreview[]
  setSavedLeads: React.Dispatch<React.SetStateAction<LeadPreview[]>>
  sessionId: string | null
  onComplete: () => void
  readOnly?: boolean
}

const MOCK_LEADS: LeadPreview[] = [
  {
    id: "1",
    company_name: "Clínica de Estética Bella Vita",
    website: "https://bellavita.com.br",
    phone: "(11) 3062-4521",
    email: "contato@bellavita.com.br",
    address: "Av. Paulista, 1500 - Bela Vista, São Paulo - SP, 01310-100",
    category: "Clínica de estética",
    search_query: "clinicas de estética em são paulo",
    google_rating: 4.8,
    review_count: 342,
    business_image: null,
    maps_classification: "4.8",
    featured_review: "Excelente atendimento e resultados incríveis! Recomendo muito.",
    differential: "Equipamentos de última geração e profissionais altamente qualificados",
    status: "new",
  },
  {
    id: "2",
    company_name: "Espaço Estética Harmonia",
    website: "https://harmoniaestettica.com.br",
    phone: "(11) 3885-7234",
    email: "agendamento@harmoniaestettica.com.br",
    address: "R. Augusta, 2690 - Jardim Paulista, São Paulo - SP, 01412-100",
    category: "Clínica de estética",
    search_query: "clinicas de estética em são paulo",
    google_rating: 4.9,
    review_count: 567,
    business_image: null,
    maps_classification: "4.9",
    featured_review: "Melhor clínica da região! Tratamentos eficazes e equipe super atenciosa.",
    differential: "Especialistas em harmonização facial e tratamentos corporais avançados",
    status: "new",
  },
  {
    id: "3",
    company_name: "Clínica Estética Renove",
    website: "https://renoveestetica.com.br",
    phone: "(11) 3078-9156",
    email: "contato@renoveestetica.com.br",
    address: "Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP, 04538-133",
    category: "Clínica de estética",
    search_query: "clinicas de estética em são paulo",
    google_rating: 5.0,
    review_count: 428,
    business_image: null,
    maps_classification: "5.0",
    featured_review: "Profissionais extremamente competentes! Fiz preenchimento labial e ficou perfeito.",
    differential: "Médicos dermatologistas especializados em procedimentos estéticos minimamente invasivos",
    status: "new",
  },
  {
    id: "4",
    company_name: "Estética Avançada Corpo & Face",
    website: "https://corpoface.com.br",
    phone: "(11) 2367-8945",
    email: "atendimento@corpoface.com.br",
    address: "R. Haddock Lobo, 1626 - Cerqueira César, São Paulo - SP, 01414-002",
    category: "Clínica de estética",
    search_query: "clinicas de estética em são paulo",
    google_rating: 4.7,
    review_count: 892,
    business_image: null,
    maps_classification: "4.7",
    featured_review: "Ambiente aconchegante e tratamentos de alta qualidade. Adorei o resultado da drenagem linfática!",
    differential: "Tecnologia de criolipólise e radiofrequência com resultados comprovados",
    status: "new",
  },
  {
    id: "5",
    company_name: "Clínica Estética Essence",
    website: "https://essenceestetica.com.br",
    phone: "(11) 3168-5432",
    email: "contato@essenceestetica.com.br",
    address: "R. dos Pinheiros, 498 - Pinheiros, São Paulo - SP, 05422-001",
    category: "Clínica de estética",
    search_query: "clinicas de estética em são paulo",
    google_rating: 4.8,
    review_count: 634,
    business_image: null,
    maps_classification: "4.8",
    featured_review: "Equipe maravilhosa e resultados surpreendentes! Minha pele nunca esteve tão bonita.",
    differential: "Protocolos personalizados de skincare e tratamentos faciais exclusivos",
    status: "new",
  },
]

export default function ProspectingSection({
  savedLeads,
  setSavedLeads,
  sessionId,
  onComplete,
  readOnly = false,
}: ProspectingSectionProps) {
  const [segmentos, setSegmentos] = useState("")
  const [estado, setEstado] = useState("")
  const [cidadeFoco, setCidadeFoco] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewLeads, setPreviewLeads] = useState<LeadPreview[]>([])
  const [webhookData, setWebhookData] = useState<any>(null)
  const [searchQueryText, setSearchQueryText] = useState("")
  const [selectedLead, setSelectedLead] = useState<LeadPreview | null>(null)
  const [searchResult, setSearchResult] = useState<{
    type: "success" | "error"
    message: string
    leadsFound?: number
  } | null>(null)

  const [duplicateModal, setDuplicateModal] = useState<{
    show: boolean
    duplicates: Array<{ preview: LeadPreview; existing: LeadPreview }>
    currentIndex: number
    applyToAll: boolean
    action: "replace" | "keep" | null
  }>({
    show: false,
    duplicates: [],
    currentIndex: 0,
    applyToAll: false,
    action: null,
  })

  if (readOnly && savedLeads.length > 0) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-500/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-white font-semibold text-sm md:text-base mb-1">Etapa 1: Prospecção Ativa ✓</h3>
              <p className="text-slate-300 text-xs md:text-sm">Etapa concluída - Visualizando leads salvos</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-4 md:p-6 border border-green-500/20">
          <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
            <div className="p-2 md:p-3 bg-green-500/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Leads Salvos</h2>
              <p className="text-slate-400 text-xs md:text-sm">{savedLeads.length} leads encontrados</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {savedLeads.map((lead) => (
              <div
                key={lead.id}
                className="bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-green-500/30 transition-all overflow-hidden cursor-pointer p-3 md:p-4"
                onClick={() => setSelectedLead(lead)}
              >
                {lead.google_rating && (
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-white text-sm font-semibold">{lead.google_rating}</span>
                    </div>
                    {lead.review_count > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-300 text-sm">{lead.review_count}</span>
                        <Users className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                  </div>
                )}

                <h4 className="text-white font-semibold mb-2 line-clamp-2 text-sm md:text-base">{lead.company_name}</h4>

                {lead.category && (
                  <span className="inline-block mb-2 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded">
                    {lead.category}
                  </span>
                )}

                {lead.address && (
                  <div className="flex items-start gap-2 text-slate-300 text-xs md:text-sm mb-3">
                    <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{lead.address}</span>
                  </div>
                )}

                <div className="mt-3 flex items-center justify-center text-green-400 text-xs md:text-sm font-medium">
                  Ver detalhes
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedLead && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedLead(null)}
          >
            <div
              className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-amber-500/20 p-4 md:p-6 flex items-start justify-between">
                <div className="flex-1 pr-2">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedLead.company_name}</h3>
                  {selectedLead.category && (
                    <span className="inline-block px-2 md:px-3 py-1 bg-amber-500/10 text-amber-400 text-xs md:text-sm rounded">
                      {selectedLead.category}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                {selectedLead.google_rating && (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400" />
                      <span className="text-white font-semibold text-xl md:text-2xl">{selectedLead.google_rating}</span>
                    </div>
                    {selectedLead.review_count > 0 && (
                      <>
                        <div className="w-px h-6 md:h-8 bg-amber-500/30"></div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-semibold text-lg md:text-xl">
                            {selectedLead.review_count}
                          </span>
                          <Users className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {selectedLead.address && (
                  <div className="flex items-start gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-amber-400 text-xs mb-1">Endereço:</p>
                      <p className="text-white text-sm md:text-base break-words">{selectedLead.address}</p>
                    </div>
                  </div>
                )}

                {selectedLead.phone && (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <Phone className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-amber-400 text-xs mb-1">Telefone:</p>
                      <a
                        href={`tel:${selectedLead.phone}`}
                        className="text-white hover:text-amber-400 transition-colors text-sm md:text-base break-all"
                      >
                        {selectedLead.phone}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.website && (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <Globe className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-amber-400 text-xs mb-1">Website:</p>
                      <a
                        href={selectedLead.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-amber-400 transition-colors truncate block text-sm md:text-base"
                      >
                        {selectedLead.website}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.email && (
                  <div className="flex items-center gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-amber-400 text-xs mb-1">Email:</p>
                      <a
                        href={`mailto:${selectedLead.email}`}
                        className="text-white hover:text-amber-400 transition-colors text-sm md:text-base break-all"
                      >
                        {selectedLead.email}
                      </a>
                    </div>
                  </div>
                )}

                {selectedLead.featured_review && (
                  <div className="p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <p className="text-amber-400 text-xs mb-2 font-semibold">Review em Destaque:</p>
                    <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed">
                      "{selectedLead.featured_review}"
                    </p>
                  </div>
                )}

                {selectedLead.differential && (
                  <div className="p-3 md:p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                    <p className="text-amber-400 text-xs mb-2 font-semibold">Diferencial:</p>
                    <p className="text-white text-xs md:text-sm leading-relaxed">{selectedLead.differential}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!segmentos.trim()) {
      setSearchResult({
        type: "error",
        message: "Por favor, insira os segmentos que está procurando",
      })
      return
    }

    if (!estado.trim()) {
      setSearchResult({
        type: "error",
        message: "Por favor, insira o estado",
      })
      return
    }

    setIsSearching(true)
    setSearchResult(null)

    try {
      const webhookUrl = "https://autowebhook.atendenteiagencia.shop/webhook/PESQUISA"

      const webhookPayload = {
        session_id: sessionId,
        segmentos: segmentos,
        estado: estado,
        cidade_foco: cidadeFoco || null,
        timestamp: new Date().toISOString(),
      }

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.JSON.stringify(webhookPayload),
      })

      if (!response.ok) {
        throw new Error(`Webhook retornou status ${response.status}`)
      }

      const data = await response.json()

      let leadsToInsert: LeadPreview[] = []
      const queryText = `${segmentos} - ${estado}${cidadeFoco ? ` (${cidadeFoco})` : ""}`

      if (Array.isArray(data)) {
        leadsToInsert = data.map((lead: any, index: number) => ({
          id: lead.id?.toString() || `${index}`,
          company_name: lead["Nome do negócio"] || lead.company_name || lead.name || "Empresa sem nome",
          website: lead.website || lead.Website || null,
          phone: lead["Número"] || lead.Numero || lead.phone || lead.telefone || null,
          email: lead.email || null,
          address: lead["Endereço"] || lead.Endereco || lead.address || lead.endereco || null,
          category: lead["Segmento"] || lead.Segmento || lead.category || segmentos,
          search_query: queryText,
          google_rating: lead["Classificação Maps"] ? Number.parseFloat(lead["Classificação Maps"]) : null,
          review_count: lead["Avaliação maps"] ? Number.parseInt(lead["Avaliação maps"]) : 0,
          business_image: lead["Imagem do negócio"] || lead.business_image || null,
          maps_classification: lead["Classificação Maps"] || lead.maps_classification || null,
          featured_review: lead["Review Destaque"] || lead.featured_review || null,
          differential: lead["Diferencial"] || lead.differential || null,
          status: "new" as const,
        }))
      } else if (data.leads && Array.isArray(data.leads)) {
        leadsToInsert = data.leads.map((lead: any, index: number) => ({
          id: lead.id?.toString() || `${index}`,
          company_name: lead["Nome do negócio"] || lead.company_name || lead.name || "Empresa sem nome",
          website: lead.website || lead.Website || null,
          phone: lead["Número"] || lead.Numero || lead.phone || lead.telefone || null,
          email: lead.email || null,
          address: lead["Endereço"] || lead.Endereco || lead.address || lead.endereco || null,
          category: lead["Segmento"] || lead.Segmento || lead.category || segmentos,
          search_query: queryText,
          google_rating: lead["Classificação Maps"] ? Number.parseFloat(lead["Classificação Maps"]) : null,
          review_count: lead["Avaliação maps"] ? Number.parseInt(lead["Avaliação maps"]) : 0,
          business_image: lead["Imagem do negócio"] || lead.business_image || null,
          maps_classification: lead["Classificação Maps"] || lead.maps_classification || null,
          featured_review: lead["Review Destaque"] || lead.featured_review || null,
          differential: lead["Diferencial"] || lead.differential || null,
          status: "new" as const,
        }))
      } else {
        throw new Error("Formato de resposta do webhook não reconhecido")
      }

      if (leadsToInsert.length === 0) {
        setSearchResult({
          type: "error",
          message: "Nenhum lead foi retornado pelo webhook",
        })
        return
      }

      setPreviewLeads(leadsToInsert)
      setWebhookData(data)
      setSearchQueryText(queryText)
      setSearchResult({
        type: "success",
        message: `${leadsToInsert.length} leads encontrados! Revise abaixo antes de salvar.`,
        leadsFound: leadsToInsert.length,
      })
    } catch (error) {
      console.error("Search error:", error)
      setSearchResult({
        type: "error",
        message: error instanceof Error ? error.message : "Erro ao processar a busca. Tente novamente.",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const detectDuplicates = (
    newLeads: LeadPreview[],
    existingLeads: LeadPreview[],
  ): Array<{ preview: LeadPreview; existing: LeadPreview }> => {
    const duplicates: Array<{ preview: LeadPreview; existing: LeadPreview }> = []

    for (const newLead of newLeads) {
      const existing = existingLeads.find(
        (lead) =>
          lead.company_name.toLowerCase().trim() === newLead.company_name.toLowerCase().trim() &&
          lead.address?.toLowerCase().trim() === newLead.address?.toLowerCase().trim(),
      )

      if (existing) {
        duplicates.push({ preview: newLead, existing })
      }
    }

    return duplicates
  }

  const handleSaveLeadsProcess = async () => {
    // Check for duplicates before saving
    const duplicates = detectDuplicates(previewLeads, savedLeads)

    if (duplicates.length > 0) {
      // Show duplicate modal
      setDuplicateModal({
        show: true,
        duplicates,
        currentIndex: 0,
        applyToAll: false,
        action: null,
      })
      return
    }

    // No duplicates, proceed with normal save
    await processSave()
  }

  const processSave = async () => {
    setIsSaving(true)
    try {
      const leadsToSave = previewLeads.map((lead, index) => ({
        ...lead,
        id: lead.id || `saved-${Date.now()}-${index}`,
        status: (lead.status || "new") as "new" | "contacted" | "interested" | "not_interested",
      }))

      // Add the new leads to existing saved leads
      const allSavedLeads = [...savedLeads, ...leadsToSave]
      setSavedLeads(allSavedLeads)

      setSearchResult({
        type: "success",
        message: `Leads salvos com sucesso! Total de ${allSavedLeads.length} leads no banco.`,
        leadsFound: allSavedLeads.length,
      })

      setPreviewLeads([])
      setWebhookData(null)
      setSegmentos("")
      setEstado("")
      setCidadeFoco("")

      setTimeout(() => {
        onComplete()
      }, 2000)
    } catch (error) {
      console.error("[v0] Save error:", error)
      setSearchResult({
        type: "error",
        message: error instanceof Error ? error.message : "Erro ao salvar leads. Tente novamente.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDuplicateAction = (action: "replace" | "keep", applyToAll: boolean) => {
    const { duplicates, currentIndex } = duplicateModal

    if (applyToAll) {
      // Apply action to all duplicates
      let updatedSavedLeads = [...savedLeads]

      if (action === "replace") {
        // Replace all duplicates
        for (const dup of duplicates) {
          const index = updatedSavedLeads.findIndex(
            (lead) =>
              lead.company_name.toLowerCase().trim() === dup.existing.company_name.toLowerCase().trim() &&
              lead.address?.toLowerCase().trim() === dup.existing.address?.toLowerCase().trim(),
          )
          if (index !== -1) {
            updatedSavedLeads[index] = dup.preview
          }
        }
      }
      // If action is "keep", we don't need to do anything for duplicates

      // Add non-duplicate leads
      const nonDuplicates = previewLeads.filter(
        (preview) =>
          !duplicates.some(
            (dup) =>
              dup.preview.company_name.toLowerCase().trim() === preview.company_name.toLowerCase().trim() &&
              dup.preview.address?.toLowerCase().trim() === preview.address?.toLowerCase().trim(),
          ),
      )

      updatedSavedLeads = [...updatedSavedLeads, ...nonDuplicates]
      setSavedLeads(updatedSavedLeads)

      // Close modal and proceed with webhook
      setDuplicateModal({
        show: false,
        duplicates: [],
        currentIndex: 0,
        applyToAll: false,
        action: null,
      })

      // Proceed with webhook save
      processSave()
    } else {
      // Handle single duplicate
      if (action === "replace") {
        // Replace this specific duplicate
        const updatedSavedLeads = savedLeads.map((lead) =>
          lead.company_name.toLowerCase().trim() ===
            duplicates[currentIndex].existing.company_name.toLowerCase().trim() &&
          lead.address?.toLowerCase().trim() === duplicates[currentIndex].existing.address?.toLowerCase().trim()
            ? duplicates[currentIndex].preview
            : lead,
        )
        setSavedLeads(updatedSavedLeads)
      }
      // If action is "keep", we don't replace

      // Move to next duplicate or finish
      if (currentIndex < duplicates.length - 1) {
        setDuplicateModal({
          ...duplicateModal,
          currentIndex: currentIndex + 1,
        })
      } else {
        // All duplicates handled, add non-duplicates and close modal
        const nonDuplicates = previewLeads.filter(
          (preview) =>
            !duplicates.some(
              (dup) =>
                dup.preview.company_name.toLowerCase().trim() === preview.company_name.toLowerCase().trim() &&
                dup.preview.address?.toLowerCase().trim() === preview.address?.toLowerCase().trim(),
            ),
        )

        if (nonDuplicates.length > 0) {
          setSavedLeads([...savedLeads, ...nonDuplicates])
        }

        setDuplicateModal({
          show: false,
          duplicates: [],
          currentIndex: 0,
          applyToAll: false,
          action: null,
        })

        // Proceed with webhook save
        processSave()
      }
    }
  }

  const handleCancelPreviewProcess = async () => {
    try {
      const webhookUrl = "https://autowebhook.atendenteiagencia.shop/webhook/SALVAR-OU-NAO"

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "Cancelar",
          session_id: sessionId,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        if (data === "Cancelado" || data.status === "Cancelado" || data.message === "Cancelado") {
          setPreviewLeads([])
          setWebhookData(null)
          setSearchResult(null)
          setSegmentos("")
          setEstado("")
          setCidadeFoco("")
        }
      }
    } catch (error) {
      console.error("Cancel error:", error)
      setPreviewLeads([])
      setWebhookData(null)
      setSearchResult(null)
      setSegmentos("")
      setEstado("")
      setCidadeFoco("")
    }
  }

  const handleStartProspecting = async () => {
    setIsSearching(true)
    setSearchResult(null)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setPreviewLeads(MOCK_LEADS)
    setSearchResult({
      type: "success",
      message: `${MOCK_LEADS.length} leads encontrados! Revise abaixo antes de salvar.`,
      leadsFound: MOCK_LEADS.length,
    })
    setIsSearching(false)
  }

  const handleSaveLeadsNormal = () => {
    setIsSaving(true)

    // Simulate save delay
    setTimeout(() => {
      setSavedLeads(previewLeads)

      setSearchResult({
        type: "success",
        message: `${previewLeads.length} leads salvos com sucesso!`,
        leadsFound: previewLeads.length,
      })

      setPreviewLeads([])
      setIsSaving(false)

      setTimeout(() => {
        onComplete()
      }, 1500)
    }, 1000)
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-lg md:rounded-xl p-3 md:p-4 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-white font-semibold text-sm md:text-base mb-1">Etapa 1: Prospecção Ativa</h3>
            <p className="text-slate-300 text-xs md:text-sm">Busque e salve leads para avançar para a próxima etapa</p>
          </div>
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-amber-400 hidden sm:block" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg md:rounded-xl p-4 md:p-6 border border-purple-500/30">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 md:p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
            <Brain className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-white font-bold text-base md:text-lg mb-2">Como Funciona a Prospecção?</h4>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed mb-4">
              Nossa API realiza uma busca automatizada no Google, coletando informações estratégicas de múltiplas fontes
              para encontrar os melhores leads para o seu negócio.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <h5 className="text-white font-semibold text-sm md:text-base">API Inteligente</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">
              Busca automatizada no Google com filtros avançados por segmento e localização
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 md:w-5 md:h-5 text-green-400" />
              <h5 className="text-white font-semibold text-sm md:text-base">Dados Essenciais</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">
              Coleta de nome, contatos, endereço, avaliações e informações de negócio
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
              <h5 className="text-white font-semibold text-sm md:text-base">Leads Qualificados</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">
              Filtragem inteligente para encontrar apenas empresas com potencial de conversão
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 md:p-4 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              <h5 className="text-white font-semibold text-sm md:text-base">Prospecção Ativa</h5>
            </div>
            <p className="text-slate-400 text-xs md:text-sm">
              Informações prontas para iniciar contato direto e personalizado com cada lead
            </p>
          </div>
        </div>

        <div className="mt-4 p-3 md:p-4 bg-green-500/10 rounded-lg border border-green-500/30">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-400 text-xs md:text-sm">
              <span className="font-semibold">Resultado:</span> Leads qualificados com informações completas para
              abordagens mais assertivas e personalizadas, aumentando suas chances de conversão em até 30%.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg md:rounded-xl p-4 md:p-8 border border-amber-500/20 shadow-2xl">
        <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
          <div className="p-2 md:p-3 bg-amber-500/10 rounded-lg">
            <Target className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Prospecção Ativa</h2>
            <p className="text-slate-400 text-xs md:text-sm">Demonstração de busca de leads no Google</p>
          </div>
        </div>

        <div className="text-center py-6 md:py-8">
          <div className="mb-4 md:mb-6">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-4">
              <span className="text-slate-400 text-xs md:text-sm">Demonstração:</span>
              <span className="text-amber-400 font-semibold text-xs md:text-sm">Clínicas de Estética em São Paulo</span>
            </div>
          </div>

          <button
            onClick={handleStartProspecting}
            disabled={isSearching || previewLeads.length > 0 || readOnly}
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-bold text-base md:text-lg rounded-lg shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 md:gap-3 mx-auto"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                <span className="text-sm md:text-base">Buscando leads...</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">Começar Prospecção</span>
              </>
            )}
          </button>
        </div>

        {searchResult && (
          <div
            className={`mt-4 md:mt-6 p-3 md:p-4 rounded-lg border ${
              searchResult.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <p className="font-medium text-xs md:text-sm">{searchResult.message}</p>
            </div>
          </div>
        )}
      </div>

      {previewLeads.length > 0 && (
        <>
          <div className="bg-gradient-to-br from-amber-900/20 to-slate-900 rounded-lg md:rounded-xl p-4 md:p-6 border border-amber-500/30 shadow-2xl">
            <div className="flex flex-col gap-4 mb-4 md:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-2 md:p-3 bg-amber-500/10 rounded-lg">
                  <Eye className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white">Preview dos Leads</h3>
                  <p className="text-slate-400 text-xs md:text-sm">
                    {previewLeads.length} leads encontrados - revise antes de salvar
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 max-h-[600px] overflow-y-auto pr-1 md:pr-2 mb-6">
              {previewLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-amber-500/30 transition-all overflow-hidden cursor-pointer p-3 md:p-4"
                  onClick={() => setSelectedLead(lead)}
                >
                  {lead.google_rating && (
                    <div className="flex items-center gap-2 mb-2 md:mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-white text-sm font-semibold">{lead.google_rating}</span>
                      </div>
                      {lead.review_count > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-slate-300 text-sm">{lead.review_count}</span>
                          <Users className="w-4 h-4 text-slate-400" />
                        </div>
                      )}
                    </div>
                  )}

                  <h4 className="text-white font-semibold mb-2 line-clamp-2 text-sm md:text-base">
                    {lead.company_name}
                  </h4>

                  {lead.category && (
                    <span className="inline-block mb-2 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded">
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

            <div className="flex justify-center mt-6">
              <button
                onClick={handleSaveLeadsProcess} // Changed to handleSaveLeadsProcess to include duplicate check
                disabled={isSaving || readOnly}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base shadow-lg shadow-amber-500/25"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Prosseguir
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 md:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-amber-500/20 p-4 md:p-6 flex items-start justify-between">
              <div className="flex-1 pr-2">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{selectedLead.company_name}</h3>
                {selectedLead.category && (
                  <span className="inline-block px-2 md:px-3 py-1 bg-amber-500/10 text-amber-400 text-xs md:text-sm rounded">
                    {selectedLead.category}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-3 md:space-y-4">
              {selectedLead.google_rating && (
                <div className="flex items-center gap-3 p-3 md:p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 md:w-6 md:h-6 text-amber-400 fill-amber-400" />
                    <span className="text-white font-semibold text-xl md:text-2xl">{selectedLead.google_rating}</span>
                  </div>
                  {selectedLead.review_count > 0 && (
                    <>
                      <div className="w-px h-6 md:h-8 bg-amber-500/30"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold text-lg md:text-xl">{selectedLead.review_count}</span>
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {selectedLead.address && (
                <div className="flex items-start gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Endereço:</p>
                    <p className="text-white text-sm md:text-base break-words">{selectedLead.address}</p>
                  </div>
                </div>
              )}

              {selectedLead.phone && (
                <div className="flex items-center gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Telefone:</p>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="text-white hover:text-amber-400 transition-colors text-sm md:text-base break-all"
                    >
                      {selectedLead.phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedLead.website && (
                <div className="flex items-center gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Website:</p>
                    <a
                      href={selectedLead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-amber-400 transition-colors truncate block text-sm md:text-base"
                    >
                      {selectedLead.website}
                    </a>
                  </div>
                </div>
              )}

              {selectedLead.email && (
                <div className="flex items-center gap-3 p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-amber-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-amber-400 text-xs mb-1">Email:</p>
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="text-white hover:text-amber-400 transition-colors text-sm md:text-base break-all"
                    >
                      {selectedLead.email}
                    </a>
                  </div>
                </div>
              )}

              {selectedLead.featured_review && (
                <div className="p-3 md:p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-amber-400 text-xs mb-2 font-semibold">Review em Destaque:</p>
                  <p className="text-slate-300 text-xs md:text-sm italic leading-relaxed">
                    "{selectedLead.featured_review}"
                  </p>
                </div>
              )}

              {selectedLead.differential && (
                <div className="p-3 md:p-4 bg-amber-500/5 rounded-lg border border-amber-500/20">
                  <p className="text-amber-400 text-xs mb-2 font-semibold">Diferencial:</p>
                  <p className="text-white text-xs md:text-sm leading-relaxed">{selectedLead.differential}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {duplicateModal.show && duplicateModal.duplicates.length > 0 && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() =>
            setDuplicateModal({
              show: false,
              duplicates: [],
              currentIndex: 0,
              applyToAll: false,
              action: null,
            })
          }
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-amber-500/30 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-amber-500/20 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-2">Lead Duplicado Encontrado</h3>
                  <p className="text-slate-400 text-sm">
                    Encontramos {duplicateModal.duplicates.length} lead(s) que já existe(m) no banco. O que deseja
                    fazer?
                  </p>
                  <p className="text-amber-400 text-xs mt-2">
                    Lead {duplicateModal.currentIndex + 1} de {duplicateModal.duplicates.length}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setDuplicateModal({
                      show: false,
                      duplicates: [],
                      currentIndex: 0,
                      applyToAll: false,
                      action: null,
                    })
                  }
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Existing Lead */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                  Lead Existente no Banco
                </h4>
                <div className="bg-slate-900/50 rounded-lg border border-slate-700/50 p-4">
                  <h5 className="text-white font-semibold mb-2">
                    {duplicateModal.duplicates[duplicateModal.currentIndex].existing.company_name}
                  </h5>
                  {duplicateModal.duplicates[duplicateModal.currentIndex].existing.category && (
                    <span className="inline-block mb-2 px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">
                      {duplicateModal.duplicates[duplicateModal.currentIndex].existing.category}
                    </span>
                  )}
                  {duplicateModal.duplicates[duplicateModal.currentIndex].existing.address && (
                    <p className="text-slate-400 text-sm">
                      {duplicateModal.duplicates[duplicateModal.currentIndex].existing.address}
                    </p>
                  )}
                  {duplicateModal.duplicates[duplicateModal.currentIndex].existing.phone && (
                    <p className="text-slate-400 text-sm mt-1">
                      Tel: {duplicateModal.duplicates[duplicateModal.currentIndex].existing.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* New Lead */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-amber-400 uppercase tracking-wide">Novo Lead Encontrado</h4>
                <div className="bg-amber-500/5 rounded-lg border border-amber-500/20 p-4">
                  <h5 className="text-white font-semibold mb-2">
                    {duplicateModal.duplicates[duplicateModal.currentIndex].preview.company_name}
                  </h5>
                  {duplicateModal.duplicates[duplicateModal.currentIndex].preview.category && (
                    <span className="inline-block mb-2 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded">
                      {duplicateModal.duplicates[duplicateModal.currentIndex].preview.category}
                    </span>
                  )}
                  {duplicateModal.duplicates[duplicateModal.currentIndex].preview.address && (
                    <p className="text-slate-300 text-sm">
                      {duplicateModal.duplicates[duplicateModal.currentIndex].preview.address}
                    </p>
                  )}
                  {duplicateModal.duplicates[duplicateModal.currentIndex].preview.phone && (
                    <p className="text-slate-300 text-sm mt-1">
                      Tel: {duplicateModal.duplicates[duplicateModal.currentIndex].preview.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => handleDuplicateAction("replace", false)}
                  className="w-full py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold rounded-lg transition-all"
                >
                  Substituir este lead
                </button>

                <button
                  onClick={() => handleDuplicateAction("keep", false)}
                  className="w-full py-3 px-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-lg transition-all"
                >
                  Manter o original
                </button>

                {duplicateModal.duplicates.length > 1 && (
                  <>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-700/50"></div>
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-slate-900 px-2 text-slate-500">Aplicar a todos os duplicados</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDuplicateAction("replace", true)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-semibold rounded-lg transition-all"
                    >
                      Substituir todos ({duplicateModal.duplicates.length})
                    </button>

                    <button
                      onClick={() => handleDuplicateAction("keep", true)}
                      className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-lg transition-all"
                    >
                      Manter todos os originais
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
