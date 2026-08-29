import { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  CheckCircle2,
  FileText,
  TrendingUp,
  Receipt,
  ShieldCheck,
} from './ui/icon'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from './ui/button'
import { useNavigate } from '@tanstack/react-router'

export interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text?: string
  timestamp: string
  intentCard?: {
    type: 'expense' | 'invoice' | 'insight'
    title: string
    merchantOrClient?: string
    category?: string
    amount: number
    items?: Array<{ desc: string; amount: number }>
    insightText?: string
    isApproved?: boolean
  }
}

const SUGGESTED_PROMPTS = [
  'Log $15 expense for Uber',
  'Draft invoice to Apple for $5000 for consulting',
  'How much did I spend on software this month?',
]

export function AiChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: "Hello! I'm your Finly AI Assistant. Tell me what you'd like to log or draft using natural language.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isThinking])

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || input).trim()
    if (!query || isThinking) return

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsThinking(true)

    // Simulate AI LLM Response latency (800ms)
    setTimeout(() => {
      const lower = query.toLowerCase()
      let aiResponse: ChatMessage

      if (
        lower.includes('uber') ||
        lower.includes('expense') ||
        lower.includes('spent') ||
        lower.includes('$15') ||
        lower.includes('coffee') ||
        lower.includes('ads')
      ) {
        // Parse expense intent
        let amount = 15
        const amountMatch = query.match(/\$?(\d+(?:\.\d{2})?)/)
        if (amountMatch) amount = parseFloat(amountMatch[1])

        let merchant = 'Uber Transport'
        if (lower.includes('facebook') || lower.includes('ads'))
          merchant = 'Facebook Ads'
        else if (lower.includes('coffee') || lower.includes('starbucks'))
          merchant = 'Starbucks'
        else if (lower.includes('slack')) merchant = 'Slack Technologies'

        let category = 'Transport & Travel'
        if (lower.includes('ads')) category = 'Advertising & Marketing'
        else if (lower.includes('software') || lower.includes('slack'))
          category = 'Software & SaaS'
        else if (lower.includes('coffee')) category = 'Meals & Entertainment'

        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: `I've prepared a draft expense card for your review:`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          intentCard: {
            type: 'expense',
            title: 'Draft Expense Entry',
            merchantOrClient: merchant,
            category: category,
            amount: amount,
            isApproved: false,
          },
        }
      } else if (
        lower.includes('invoice') ||
        lower.includes('apple') ||
        lower.includes('draft') ||
        lower.includes('client') ||
        lower.includes('acme')
      ) {
        // Parse invoice intent
        let amount = 5000
        const amountMatch = query.match(/\$?(\d+(?:\.\d{2})?)/)
        if (amountMatch) amount = parseFloat(amountMatch[1])

        let client = 'Apple Inc'
        if (lower.includes('acme')) client = 'Acme Corp'
        else if (lower.includes('stark')) client = 'Stark Industries'
        else if (lower.includes('global')) client = 'GlobalTech Ltd'

        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: `Here is the draft invoice generated from your request:`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          intentCard: {
            type: 'invoice',
            title: 'Draft Client Invoice',
            merchantOrClient: client,
            category: 'B2B Services',
            amount: amount,
            items: [
              {
                desc: lower.includes('consulting')
                  ? 'Strategic Consulting Services'
                  : 'Web Application Engineering',
                amount: amount,
              },
            ],
            isApproved: false,
          },
        }
      } else if (
        lower.includes('insight') ||
        lower.includes('software') ||
        lower.includes('spend') ||
        lower.includes('how much') ||
        lower.includes('analytics')
      ) {
        // Parse quick insight intent
        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: `Here is your expense insight for Software & Subscriptions this month:`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          intentCard: {
            type: 'insight',
            title: 'Software Expenses (Aug 2026)',
            amount: 1450,
            insightText:
              'You spent $1,450.00 across 4 SaaS tools this month. That is 12% lower than July 2026 ($1,650.00).',
          },
        }
      } else {
        // Generic fallback AI conversation
        aiResponse = {
          id: 'ai-' + Date.now(),
          sender: 'ai',
          text: `I understood: "${query}". I can help you log expenses, draft client invoices, or analyze monthly cashflow trends. Try asking: "Log $50 for Facebook Ads" or "Draft invoice to Acme for $2500".`,
          timestamp: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
      }

      setMessages((prev) => [...prev, aiResponse])
      setIsThinking(false)
    }, 800)
  }

  const handleApproveIntent = (
    msgId: string,
    cardType: 'expense' | 'invoice' | 'insight',
  ) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === msgId && msg.intentCard) {
          return {
            ...msg,
            intentCard: {
              ...msg.intentCard,
              isApproved: true,
            },
          }
        }
        return msg
      }),
    )

    if (cardType === 'invoice') {
      setTimeout(() => {
        setIsOpen(false)
        navigate({ to: '/invoices/builder' })
      }, 600)
    }
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-none shadow-primary/30 hover:bg-primary/90 transition-all outline-none"
        aria-label="Toggle AI Assistant"
      >
        <Sparkles className="h-6 w-6 animate-pulse" />
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
      </motion.button>

      {/* Slide-over Drawer / Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              className="relative w-full max-w-md h-full bg-card border-l border-border shadow-none flex flex-col z-10"
            >
              {/* Panel Header */}
              <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-none">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      Finly AI Assistant
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Phase 2 API
                      </span>
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="h-3 w-3 text-emerald-500" />
                      Human-in-the-Loop Safeguard Active
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`space-y-2 max-w-[85%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      {msg.text && (
                        <div
                          className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-primary text-primary-foreground rounded-br-xs font-medium'
                              : 'bg-muted/60 text-foreground border border-border rounded-bl-xs font-normal'
                          }`}
                        >
                          {msg.text}
                        </div>
                      )}

                      {/* Interactive Draft Card (Expense / Invoice / Insight) */}
                      {msg.intentCard && (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="border border-border bg-background p-4 rounded-2xl shadow-none space-y-3 mt-2"
                        >
                          <div className="flex items-center justify-between border-b border-border pb-2.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                              {msg.intentCard.type === 'expense' && (
                                <Receipt className="h-3.5 w-3.5" />
                              )}
                              {msg.intentCard.type === 'invoice' && (
                                <FileText className="h-3.5 w-3.5" />
                              )}
                              {msg.intentCard.type === 'insight' && (
                                <TrendingUp className="h-3.5 w-3.5" />
                              )}
                              {msg.intentCard.title}
                            </span>
                            <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                              Draft
                            </span>
                          </div>

                          {msg.intentCard.type === 'expense' && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-muted-foreground">
                                Merchant / Entity
                              </p>
                              <p className="font-semibold text-sm text-foreground">
                                {msg.intentCard.merchantOrClient}
                              </p>
                              <div className="flex justify-between items-center pt-2">
                                <span className="text-xs font-medium text-muted-foreground bg-accent/40 px-2.5 py-0.5 rounded-full">
                                  {msg.intentCard.category}
                                </span>
                                <span className="font-mono text-base font-bold text-foreground">
                                  ${msg.intentCard.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {msg.intentCard.type === 'invoice' && (
                            <div className="space-y-1.5">
                              <p className="text-xs text-muted-foreground">
                                Client Name
                              </p>
                              <p className="font-semibold text-sm text-foreground">
                                {msg.intentCard.merchantOrClient}
                              </p>
                              {msg.intentCard.items && (
                                <div className="space-y-1 pt-1">
                                  {msg.intentCard.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex justify-between text-xs text-muted-foreground"
                                    >
                                      <span>{item.desc}</span>
                                      <span className="font-mono text-foreground font-semibold">
                                        ${item.amount.toFixed(2)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-between items-center pt-2 border-t border-border">
                                <span className="text-xs font-semibold text-foreground">
                                  Total Payable
                                </span>
                                <span className="font-mono text-base font-bold text-primary">
                                  ${msg.intentCard.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {msg.intentCard.type === 'insight' && (
                            <div className="space-y-2">
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {msg.intentCard.insightText}
                              </p>
                              <div className="pt-1 flex justify-between items-center">
                                <span className="text-xs text-muted-foreground">
                                  Total SaaS Spend
                                </span>
                                <span className="font-mono text-base font-bold text-foreground">
                                  ${msg.intentCard.amount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Approval Actions */}
                          {msg.intentCard.type !== 'insight' && (
                            <div className="pt-2">
                              {msg.intentCard.isApproved ? (
                                <div className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-semibold border border-emerald-500/20">
                                  <CheckCircle2 className="h-4 w-4" />
                                  {msg.intentCard.type === 'expense'
                                    ? 'Approved & Saved to Cashbook'
                                    : 'Approved & Sent to Builder'}
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() =>
                                    handleApproveIntent(
                                      msg.id,
                                      msg.intentCard!.type,
                                    )
                                  }
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
                                  {msg.intentCard.type === 'expense'
                                    ? 'Approve & Save Expense'
                                    : 'Approve & Draft Invoice'}
                                </Button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}

                      <span className="text-[10px] text-muted-foreground px-1">
                        {msg.timestamp}
                      </span>
                    </div>

                    {msg.sender === 'user' && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground border border-border">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {isThinking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 items-center text-muted-foreground text-xs"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                      <Bot className="h-4 w-4 animate-spin" />
                    </div>
                    <div className="p-3 bg-muted/40 rounded-2xl border border-border flex items-center gap-2">
                      <span>Parsing intent via LLM API...</span>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompt Chips */}
              <div className="p-3 border-t border-border bg-muted/20 space-y-2">
                <p className="text-[11px] font-semibold text-muted-foreground px-1">
                  Suggested Prompts:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleSend(prompt)}
                      className="text-xs text-foreground bg-background hover:bg-accent border border-border px-2.5 py-1 rounded-full font-medium transition-all text-left truncate max-w-full"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <div className="p-4 border-t border-border bg-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type natural language command..."
                    className="flex-1 h-11 border border-border bg-background rounded-full px-4 text-sm font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
                  />
                  <Button
                    type="submit"
                    disabled={!input.trim() || isThinking}
                    className="h-11 w-11 rounded-full p-0 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
