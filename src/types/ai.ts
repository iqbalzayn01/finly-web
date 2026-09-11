export interface AiModel {
  id: string
  name: string
}

export interface AiProvider {
  id: string
  name: string
  tagline: string
  iconColor: string
  badgeColor: string
  defaultModel: string
  keyPlaceholder: string
  models: AiModel[]
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'assistant'
  text: string
  timestamp: string
  actionData?: {
    type: 'create_invoice' | 'categorize_expense' | 'forecast_cashflow'
    title: string
    payload: Record<string, unknown>
  }
}
