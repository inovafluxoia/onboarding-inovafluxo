"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ProspectingSection from "@/components/ProspectingSection"
import DatabaseSection from "@/components/DatabaseSection"
import MessagesSection from "@/components/MessagesSection"
import AISdrSection from "@/components/AISdrSection"
import StepProgress from "@/components/StepProgress"
import LandingPage from "@/components/LandingPage"
import { ArrowLeft } from "lucide-react"

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
  status: "new"
}

type StepStatus = {
  prospecting: boolean
  database: boolean
  messages: boolean
  aiSdr: boolean
}

export default function Page() {
  const router = useRouter()
  const [showLanding, setShowLanding] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [savedLeads, setSavedLeads] = useState<LeadPreview[]>([])
  const [completedSteps, setCompletedSteps] = useState<StepStatus>({
    prospecting: false,
    database: false,
    messages: false,
    aiSdr: false,
  })
  const [messageData, setMessageData] = useState<{ message: string; date: string; time: string }>({
    message: "",
    date: "",
    time: "",
  })

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)

      const stepKeys: (keyof StepStatus)[] = ["prospecting", "database", "messages", "aiSdr"]
      const currentStepKey = stepKeys[currentStep - 1]

      setCompletedSteps((prev) => ({
        ...prev,
        [currentStepKey]: false,
      }))
    } else {
      setShowLanding(true)
    }
  }

  const handleStartDemo = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      setShowLanding(false)
    }, 500)
  }

  const completeStep = (step: keyof StepStatus) => {
    if (!completedSteps[step]) {
      setCompletedSteps((prev) => ({ ...prev, [step]: true }))
    }
  }

  const goToNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleMessagesComplete = (data: { message: string; date: string; time: string }) => {
    setMessageData(data)
    completeStep("messages")
    goToNextStep()
  }

  const handleAISdrComplete = () => {
    completeStep("aiSdr")
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      router.push("/checkout")
    }, 500)
  }

  const completedCount = [
    completedSteps.prospecting,
    completedSteps.database,
    completedSteps.messages,
    completedSteps.aiSdr,
  ].filter(Boolean).length
  const progressPercentage = (completedCount / 4) * 100

  useEffect(() => {
    if (!showLanding) {
      if (currentStep === 1) {
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          })
        }, 100)
      } else {
        const stepElement = document.getElementById(`step-${currentStep}`)
        if (stepElement) {
          setTimeout(() => {
            const headerOffset = 80
            const elementPosition = stepElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            })
          }, 100)
        }
      }
    }
  }, [currentStep, showLanding])

  if (showLanding) {
    return <LandingPage onStartDemo={handleStartDemo} />
  }

  return (
    <div className="min-h-screen bg-[#0C0F18]">
      <header className="bg-[#0C0F18]/90 backdrop-blur-lg border-b border-orange-500/20 sticky top-0 z-40">
        <div className="max-w-[500px] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="p-1.5 sm:p-2 hover:bg-orange-500/10 rounded-lg transition-all text-slate-400 hover:text-orange-400 border border-transparent hover:border-orange-500/30"
              title="Voltar"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 sm:gap-2">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-md" />
                <img
                  src="/LogoInovaFluxo1.png"
                  alt="InovaFluxo"
                  className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                />
              </div>
              <h1 className="text-base sm:text-lg font-bold bg-gradient-to-r from-[#FFA500] to-[#FF8C00] bg-clip-text text-transparent font-heading">
                iNovaFluxo
              </h1>
            </div>

            <div className="w-7 sm:w-9"></div>
          </div>
        </div>
      </header>

      <div className="bg-[#0C0F18]/50 border-b border-orange-500/10">
        <div className="max-w-[500px] mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="mb-3 sm:mb-4">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <h2 className="text-xs sm:text-sm font-semibold text-slate-300 font-heading">Progresso Geral</h2>
              <span className="text-xs sm:text-sm text-orange-400 font-bold font-heading">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full h-1.5 sm:h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-[#FFA500] to-[#FF8C00] transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <StepProgress currentStep={currentStep} completedSteps={completedSteps} onStepClick={setCurrentStep} />
        </div>
      </div>

      <main className="max-w-[500px] mx-auto p-3 sm:p-4">
        {currentStep === 1 && (
          <div id="step-1">
            <ProspectingSection
              savedLeads={savedLeads}
              setSavedLeads={setSavedLeads}
              sessionId={null}
              onComplete={() => {
                completeStep("prospecting")
                goToNextStep()
              }}
              readOnly={completedSteps.prospecting}
            />
          </div>
        )}

        {currentStep === 2 && (
          <div id="step-2">
            <DatabaseSection
              savedLeads={savedLeads}
              setSavedLeads={setSavedLeads}
              sessionId={null}
              onComplete={() => {
                completeStep("database")
                goToNextStep()
              }}
              readOnly={completedSteps.database}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div id="step-3">
            <MessagesSection
              savedLeads={savedLeads}
              onComplete={handleMessagesComplete}
              readOnly={completedSteps.messages}
            />
          </div>
        )}

        {currentStep === 4 && (
          <div id="step-4">
            <AISdrSection
              savedLeads={savedLeads}
              generatedMessage={messageData.message}
              scheduledDate={messageData.date}
              scheduledTime={messageData.time}
              onComplete={handleAISdrComplete}
              readOnly={completedSteps.aiSdr}
            />
          </div>
        )}
      </main>

      <div className="fixed bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  )
}
