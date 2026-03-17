import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechOptions {
  onResult?: (transcript: string) => void
  lang?: string
}

export function useSpeech({ onResult, lang = 'it-IT' }: UseSpeechOptions = {}) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)
    setIsSupported(supported)
  }, [])

  const startRecording = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognitionAPI) return

    const recognition = new SpeechRecognitionAPI()
    recognition.lang = lang
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.continuous = false

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      onResult?.(transcript)
      setIsRecording(false)
    }

    recognition.onerror = () => {
      setIsRecording(false)
    }

    recognition.onend = () => {
      setIsRecording(false)
    }

    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }, [lang, onResult])

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop()
    setIsRecording(false)
  }, [])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, startRecording, stopRecording])

  return { isRecording, isSupported, toggleRecording, startRecording, stopRecording }
}
