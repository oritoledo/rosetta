import { useState, useCallback, useRef } from 'react'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  translation?: string
  isStreaming?: boolean
}

interface UseClaudeOptions {
  systemPrompt: string
}

function parseTranslation(text: string): { main: string; translation?: string } {
  // Look for content in parentheses at the end that looks like a translation
  const match = text.match(/^([\s\S]*?)\s*\(([^)]{10,})\)\s*$/)
  if (match) {
    return { main: match[1].trim(), translation: match[2].trim() }
  }
  return { main: text }
}

export function useClaude({ systemPrompt }: UseClaudeOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (userContent: string, history?: Message[]) => {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey) {
        console.error('Missing VITE_ANTHROPIC_API_KEY')
        return
      }

      const source = history ?? messages
      const newUserMsg: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: userContent,
      }

      const updatedHistory = userContent
        ? [...source, newUserMsg]
        : [...source]

      if (userContent) {
        setMessages(updatedHistory)
      }

      const streamingId = crypto.randomUUID()
      const streamingMsg: Message = {
        id: streamingId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }
      setMessages((prev) => [...prev, streamingMsg])
      setIsLoading(true)

      abortRef.current = new AbortController()

      try {
        const apiMessages = updatedHistory
          .filter((m) => m.role === 'user' || m.role === 'assistant')
          .map((m) => ({ role: m.role, content: m.content }))

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            stream: true,
            system: systemPrompt,
            messages: apiMessages,
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`API error ${res.status}: ${errText}`)
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (
                  parsed.type === 'content_block_delta' &&
                  parsed.delta?.type === 'text_delta'
                ) {
                  accumulated += parsed.delta.text
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === streamingId
                        ? { ...m, content: accumulated }
                        : m
                    )
                  )
                }
              } catch {
                // skip malformed JSON lines
              }
            }
          }
        }

        const { main, translation } = parseTranslation(accumulated)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? { ...m, content: main, translation, isStreaming: false }
              : m
          )
        )
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setMessages((prev) =>
          prev.map((m) =>
            m.id === streamingId
              ? {
                  ...m,
                  content: 'Mi dispiace, si è verificato un errore. (Sorry, an error occurred.)',
                  isStreaming: false,
                }
              : m
          )
        )
      } finally {
        setIsLoading(false)
      }
    },
    [messages, systemPrompt]
  )

  const initScene = useCallback(
    async () => {
      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey) return

      const streamingId = crypto.randomUUID()
      const streamingMsg: Message = {
        id: streamingId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }
      setMessages([streamingMsg])
      setIsLoading(true)

      abortRef.current = new AbortController()

      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1024,
            stream: true,
            system: systemPrompt,
            messages: [
              {
                role: 'user',
                content: 'Start the scene with a natural opening line.',
              },
            ],
          }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`API error ${res.status}: ${errText}`)
        }

        const reader = res.body!.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (
                  parsed.type === 'content_block_delta' &&
                  parsed.delta?.type === 'text_delta'
                ) {
                  accumulated += parsed.delta.text
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === streamingId
                        ? { ...m, content: accumulated }
                        : m
                    )
                  )
                }
              } catch {
                // skip
              }
            }
          }
        }

        const { main, translation } = parseTranslation(accumulated)
        setMessages([
          {
            id: streamingId,
            role: 'assistant',
            content: main,
            translation,
            isStreaming: false,
          },
        ])
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setMessages([
          {
            id: streamingId,
            role: 'assistant',
            content: 'Benvenuto! Come posso aiutarti? (Welcome! How can I help you?)',
            isStreaming: false,
          },
        ])
      } finally {
        setIsLoading(false)
      }
    },
    [systemPrompt]
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { messages, isLoading, sendMessage, initScene, abort }
}
