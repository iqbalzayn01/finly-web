import * as React from 'react'
import { Key, ExternalLink, ShieldCheck } from './icon'
import { Button } from '#/components/ui/button'
import { Modal } from '#/components/ui/modal'

export interface ApiKeyModalProps {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  providerName: string
  dashboardUrl?: string
  keyPlaceholder?: string
  currentKey?: string
  onSaveKey?: (newKey: string) => void
}

const providerUrls: Record<string, string> = {
  'Google Gemini': 'https://aistudio.google.com/app/apikey',
  'OpenAI ChatGPT': 'https://platform.openai.com/api-keys',
  'Anthropic Claude': 'https://console.anthropic.com/settings/keys',
  'DeepSeek AI': 'https://platform.deepseek.com/api_keys',
  'Custom / Local LLM': 'https://ollama.ai',
}

export function ApiKeyModal({
  trigger,
  open,
  onOpenChange,
  providerName,
  dashboardUrl,
  currentKey = '',
  onSaveKey,
}: ApiKeyModalProps) {
  const [keyInput, setKeyInput] = React.useState(currentKey)

  React.useEffect(() => {
    setKeyInput(currentKey)
  }, [currentKey])

  const targetUrl =
    dashboardUrl ||
    providerUrls[providerName] ||
    'https://aistudio.google.com/app/apikey'

  const handleSave = () => {
    onSaveKey?.(keyInput)
    onOpenChange?.(false)
  }

  return (
    <Modal
      trigger={trigger}
      open={open}
      onOpenChange={onOpenChange}
      size="md"
      title={`${providerName} API Key`}
      description={`Connect your ${providerName} account to unlock AI assistant features.`}
      footer={
        <div className="flex w-full items-center justify-between gap-2 pt-2">
          <a
            href={targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            Get API Key from Dashboard <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Key
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-4 py-2">
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-3.5">
          <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-muted-foreground">
            Your API key is stored locally in your browser session and encrypted
            in transit. It is never shared with third parties.
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Key className="h-3.5 w-3.5 text-muted-foreground" />
            Enter Secret Key
          </label>
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={`Enter your ${providerName} API key...`}
            className="h-11 w-full border border-border bg-background rounded-xl px-4 text-sm font-mono font-medium outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
    </Modal>
  )
}
