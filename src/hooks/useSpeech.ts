import { useState, useCallback, useRef, useEffect } from 'react'

// ─── Speech Recognition ───────────────────────────────────────────────────────

export interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  error: string | null
  isSupported: boolean
  startListening: () => void
  stopListening: () => void
}

export function useSpeechRecognition(lang = 'it-IT'): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    setIsSupported(!!SR)
    if (!SR) return

    const recognition: SpeechRecognition = new SR()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = lang

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex
      const result = event.results[current]
      setTranscript(result[0].transcript)
      if (result.isFinal) {
        setIsListening(false)
      }
    }

    recognition.onerror = (event: any) => {
      setError(event.error as string)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.abort()
      recognitionRef.current = null
    }
  }, [lang])

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return
    setTranscript('')
    setError(null)
    setIsListening(true)
    try {
      recognitionRef.current.start()
    } catch {
      // Already started — ignore
    }
  }, [])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }, [])

  return { isListening, transcript, error, isSupported, startListening, stopListening }
}

// ─── TTS ─────────────────────────────────────────────────────────────────────

export interface TTSOptions {
  id?: string
  rate?: number
  gender?: 'male' | 'female'
}

export interface TTSHook {
  speak: (text: string, lang: string, opts?: TTSOptions) => void
  stop: () => void
  isSpeaking: boolean
  activeSpeakingId: string | null
  isSupported: boolean
}

export function useTTS(): TTSHook {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null)
  const isSupported =
    typeof window !== 'undefined' && !!window.speechSynthesis
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    if (!window.speechSynthesis) return

    const populate = () => {
      voicesRef.current = window.speechSynthesis.getVoices()
    }

    populate()
    window.speechSynthesis.onvoiceschanged = populate

    return () => {
      window.speechSynthesis.cancel()
    }
  }, [])

  const speak = useCallback(
    (text: string, lang: string, opts: TTSOptions = {}) => {
      if (!window.speechSynthesis) return

      const { id, rate = 0.85, gender } = opts

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      utterance.rate = rate
      utterance.pitch = 1.0

      const voices =
        voicesRef.current.length > 0
          ? voicesRef.current
          : window.speechSynthesis.getVoices()

      // Pick the best available voice
      let preferred: SpeechSynthesisVoice | null = null

      if (gender) {
        preferred =
          voices.find(
            (v) =>
              v.lang === lang &&
              v.localService &&
              v.name.toLowerCase().includes(gender),
          ) ||
          voices.find(
            (v) =>
              v.lang === lang && v.name.toLowerCase().includes(gender),
          ) ||
          null
      }

      if (!preferred) {
        preferred =
          voices.find((v) => v.lang === lang && v.localService) ||
          voices.find((v) => v.lang.startsWith(lang.split('-')[0])) ||
          null
      }

      if (preferred) utterance.voice = preferred

      utterance.onstart = () => {
        setIsSpeaking(true)
        setActiveSpeakingId(id ?? null)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setActiveSpeakingId(null)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setActiveSpeakingId(null)
      }

      window.speechSynthesis.speak(utterance)
    },
    [],
  )

  const stop = useCallback(() => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
    setActiveSpeakingId(null)
  }, [])

  return { speak, stop, isSpeaking, activeSpeakingId, isSupported }
}

// ─── Legacy export (backwards compat with any existing usages) ────────────────

export function useSpeech(
  opts: { onResult?: (t: string) => void; lang?: string } = {},
) {
  const hook = useSpeechRecognition(opts.lang ?? 'it-IT')

  const toggleRecording = useCallback(() => {
    if (hook.isListening) hook.stopListening()
    else hook.startListening()
  }, [hook])

  useEffect(() => {
    if (!hook.isListening && hook.transcript && opts.onResult) {
      opts.onResult(hook.transcript)
    }
  }, [hook.isListening, hook.transcript])

  return {
    isRecording: hook.isListening,
    isSupported: hook.isSupported,
    toggleRecording,
    startRecording: hook.startListening,
    stopRecording: hook.stopListening,
  }
}
