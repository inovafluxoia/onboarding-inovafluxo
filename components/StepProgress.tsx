"use client"

import { Search, Database, MessageSquare, CheckCircle2, Lock, Bot } from "lucide-react"

type StepStatus = {
  prospecting: boolean
  database: boolean
  messages: boolean
  aiSdr: boolean
}

interface StepProgressProps {
  currentStep: number
  completedSteps: StepStatus
  onStepClick: (step: number) => void
}

export default function StepProgress({ currentStep, completedSteps, onStepClick }: StepProgressProps) {
  const steps = [
    {
      id: 1,
      key: "prospecting" as keyof StepStatus,
      title: "Prospecção",
      description: "Busque leads no Google",
      icon: Search,
    },
    {
      id: 2,
      key: "database" as keyof StepStatus,
      title: "Nutrição de Leads",
      description: "Organize seus contatos",
      icon: Database,
    },
    {
      id: 3,
      key: "messages" as keyof StepStatus,
      title: "Mensagens IA",
      description: "Crie mensagens personalizadas",
      icon: MessageSquare,
    },
    {
      id: 4,
      key: "aiSdr" as keyof StepStatus,
      title: "AI SDR",
      description: "Qualificação e agendamento",
      icon: Bot,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-2 sm:gap-3">
      {steps.map((step, index) => {
        const Icon = step.icon
        const isCompleted = completedSteps[step.key]
        const isCurrent = currentStep === step.id
        const isLocked = step.id > 1 && !completedSteps[steps[index - 1].key] && !isCompleted

        return (
          <button
            key={step.id}
            onClick={() => !isLocked && onStepClick(step.id)}
            disabled={isLocked}
            className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 text-left ${
              isCurrent
                ? "bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500 shadow-lg shadow-orange-500/20"
                : isCompleted
                  ? "bg-green-500/10 border-green-500/30 hover:border-green-500/50 cursor-pointer"
                  : isLocked
                    ? "bg-slate-800/30 border-slate-700/30 opacity-50 cursor-not-allowed"
                    : "bg-slate-800/50 border-slate-700 hover:border-orange-500/30"
            }`}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div
                className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${
                  isCurrent
                    ? "bg-orange-500/20"
                    : isCompleted
                      ? "bg-green-500/20"
                      : isLocked
                        ? "bg-slate-700/50"
                        : "bg-slate-700"
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                ) : isLocked ? (
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
                ) : (
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${isCurrent ? "text-orange-400" : isCompleted ? "text-green-400" : "text-slate-400"}`}
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                  <span
                    className={`text-[10px] sm:text-xs font-bold font-heading ${isCurrent ? "text-orange-400" : isCompleted ? "text-green-400" : "text-slate-500"}`}
                  >
                    ETAPA {step.id}
                  </span>
                </div>
                <h3
                  className={`font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 font-heading ${isCurrent ? "text-white" : isCompleted ? "text-green-300" : "text-slate-400"}`}
                >
                  {step.title}
                </h3>
                <p className={`text-[10px] sm:text-xs ${isCurrent ? "text-slate-300" : "text-slate-500"}`}>
                  {step.description}
                </p>
              </div>
            </div>

            {isCurrent && (
              <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#FFA500] to-[#FF8C00] rounded-full" />
            )}
          </button>
        )
      })}
    </div>
  )
}
