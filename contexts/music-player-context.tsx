"use client"

import type React from "react"
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"

interface Song {
    id: string
    title: string
    artist_id: string
    duration: number
    audio_url: string
    cover_url?: string
    genre?: string
    artist?: {
        name: string
    }
}

interface MusicPlayerContextType {
    // Current song and queue
    currentSong: Song | null
    queue: Song[]
    currentIndex: number

    // Playback state
    isPlaying: boolean
    currentTime: number
    duration: number
    volume: number
    isMuted: boolean
    isShuffled: boolean
    repeatMode: "off" | "one" | "all"

    isLoading: boolean
    isBuffering: boolean
    error: string | null

    // Actions
    playSong: (song: Song, queue?: Song[]) => void
    playPause: () => void
    nextSong: () => void
    previousSong: () => void
    seekTo: (time: number) => void
    setVolume: (volume: number) => void
    toggleMute: () => void
    toggleShuffle: () => void
    toggleRepeat: () => void

    // Audio element ref
    audioRef: React.RefObject<HTMLAudioElement | null>
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null)

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null)
    const supabase = createClient()

    // State
    const [currentSong, setCurrentSong] = useState<Song | null>(null)
    const [queue, setQueue] = useState<Song[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolumeState] = useState(0.7)
    const [isMuted, setIsMuted] = useState(false)
    const [isShuffled, setIsShuffled] = useState(false)
    const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off")

    const [isLoading, setIsLoading] = useState(false)
    const [isBuffering, setIsBuffering] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
        const handleDurationChange = () => setDuration(audio.duration)
        const handleLoadStart = () => {
            setIsLoading(true)
            setError(null)
        }
        const handleLoadedData = () => {
            setIsLoading(false)
            setIsBuffering(false)
        }
        const handleCanPlay = () => {
            setIsLoading(false)
            setIsBuffering(false)
        }
        const handleWaiting = () => setIsBuffering(true)
        const handlePlaying = () => setIsBuffering(false)
        const handleError = (e: Event) => {
            const target = e.target as HTMLAudioElement
            setIsLoading(false)
            setIsBuffering(false)
            setIsPlaying(false)
            setError(`Failed to load audio: ${target.error?.message || "Unknown error"}`)
        }
        const handleEnded = () => {
            if (repeatMode === "one") {
                audio.currentTime = 0
                audio.play()
            } else {
                nextSong()
            }
        }
        const handlePlay = () => setIsPlaying(true)
        const handlePause = () => setIsPlaying(false)

        audio.addEventListener("timeupdate", handleTimeUpdate)
        audio.addEventListener("durationchange", handleDurationChange)
        audio.addEventListener("loadstart", handleLoadStart)
        audio.addEventListener("loadeddata", handleLoadedData)
        audio.addEventListener("canplay", handleCanPlay)
        audio.addEventListener("waiting", handleWaiting)
        audio.addEventListener("playing", handlePlaying)
        audio.addEventListener("error", handleError)
        audio.addEventListener("ended", handleEnded)
        audio.addEventListener("play", handlePlay)
        audio.addEventListener("pause", handlePause)

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate)
            audio.removeEventListener("durationchange", handleDurationChange)
            audio.removeEventListener("loadstart", handleLoadStart)
            audio.removeEventListener("loadeddata", handleLoadedData)
            audio.removeEventListener("canplay", handleCanPlay)
            audio.removeEventListener("waiting", handleWaiting)
            audio.removeEventListener("playing", handlePlaying)
            audio.removeEventListener("error", handleError)
            audio.removeEventListener("ended", handleEnded)
            audio.removeEventListener("play", handlePlay)
            audio.removeEventListener("pause", handlePause)
        }
    }, [repeatMode])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger shortcuts when typing in inputs
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return
            }

            switch (e.code) {
                case "Space":
                    e.preventDefault()
                    playPause()
                    break
                case "ArrowLeft":
                    e.preventDefault()
                    if (e.shiftKey) {
                        previousSong()
                    } else {
                        seekTo(Math.max(0, currentTime - 10))
                    }
                    break
                case "ArrowRight":
                    e.preventDefault()
                    if (e.shiftKey) {
                        nextSong()
                    } else {
                        seekTo(Math.min(duration, currentTime + 10))
                    }
                    break
                case "ArrowUp":
                    e.preventDefault()
                    setVolume(Math.min(1, volume + 0.1))
                    break
                case "ArrowDown":
                    e.preventDefault()
                    setVolume(Math.max(0, volume - 0.1))
                    break
                case "KeyM":
                    e.preventDefault()
                    toggleMute()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [currentTime, duration, volume])

    // Update audio volume
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume
        }
    }, [volume, isMuted])

    const playSong = useCallback(
        async (song: Song, newQueue?: Song[]) => {
            setCurrentSong(song)
            setError(null)

            if (newQueue) {
                setQueue(newQueue)
                const index = newQueue.findIndex((s) => s.id === song.id)
                setCurrentIndex(index >= 0 ? index : 0)
            }

            if (audioRef.current) {
                try {
                    audioRef.current.src = song.audio_url
                    await audioRef.current.play()

                    // Track play count in database
                    try {
                        await supabase.rpc("increment_play_count", { song_uuid: song.id })
                    } catch (error) {
                        console.warn("Failed to increment play count:", error)
                    }
                } catch (error) {
                    console.error("Failed to play song:", error)
                    setError("Failed to play this song")
                }
            }
        },
        [supabase],
    )

    const playPause = useCallback(async () => {
        if (!audioRef.current || !currentSong) return

        try {
            if (isPlaying) {
                audioRef.current.pause()
            } else {
                await audioRef.current.play()
            }
        } catch (error) {
            console.error("Failed to play/pause:", error)
            setError("Playback failed")
        }
    }, [isPlaying, currentSong])

    const nextSong = useCallback(() => {
        if (queue.length === 0) return

        let nextIndex: number
        if (isShuffled) {
            // Avoid repeating the same song in shuffle mode
            const availableIndices = queue.map((_, i) => i).filter((i) => i !== currentIndex)
            if (availableIndices.length === 0) return
            nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]
        } else {
            nextIndex = currentIndex + 1
            if (nextIndex >= queue.length) {
                if (repeatMode === "all") {
                    nextIndex = 0
                } else {
                    return // End of queue
                }
            }
        }

        setCurrentIndex(nextIndex)
        playSong(queue[nextIndex])
    }, [queue, currentIndex, isShuffled, repeatMode, playSong])

    const previousSong = useCallback(() => {
        if (queue.length === 0) return

        // If more than 3 seconds played, restart current song
        if (currentTime > 3) {
            seekTo(0)
            return
        }

        let prevIndex = currentIndex - 1
        if (prevIndex < 0) {
            if (repeatMode === "all") {
                prevIndex = queue.length - 1
            } else {
                return // Beginning of queue
            }
        }

        setCurrentIndex(prevIndex)
        playSong(queue[prevIndex])
    }, [queue, currentIndex, currentTime, repeatMode, playSong])

    const seekTo = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time
            setCurrentTime(time)
        }
    }, [])

    const setVolume = useCallback((newVolume: number) => {
        const clampedVolume = Math.max(0, Math.min(1, newVolume))
        setVolumeState(clampedVolume)
        setIsMuted(false)

        // Store volume preference in localStorage
        localStorage.setItem("spotify-clone-volume", clampedVolume.toString())
    }, [])

    const toggleMute = useCallback(() => {
        setIsMuted(!isMuted)
    }, [isMuted])

    const toggleShuffle = useCallback(() => {
        setIsShuffled(!isShuffled)
    }, [isShuffled])

    const toggleRepeat = useCallback(() => {
        const modes: ("off" | "one" | "all")[] = ["off", "all", "one"]
        const currentModeIndex = modes.indexOf(repeatMode)
        const nextMode = modes[(currentModeIndex + 1) % modes.length]
        setRepeatMode(nextMode)
    }, [repeatMode])

    useEffect(() => {
        const savedVolume = localStorage.getItem("spotify-clone-volume")
        if (savedVolume) {
            const volume = Number.parseFloat(savedVolume)
            if (!isNaN(volume)) {
                setVolumeState(volume)
            }
        }
    }, [])

    const value: MusicPlayerContextType = {
        currentSong,
        queue,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isShuffled,
        repeatMode,
        isLoading,
        isBuffering,
        error,
        playSong,
        playPause,
        nextSong,
        previousSong,
        seekTo,
        setVolume,
        toggleMute,
        toggleShuffle,
        toggleRepeat,
        audioRef,
    }

    return (
        <MusicPlayerContext.Provider value={value}>
            {children}
            <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
        </MusicPlayerContext.Provider>
    )
}

export const useMusicPlayer = () => {
    const context = useContext(MusicPlayerContext)
    if (!context) {
        throw new Error("useMusicPlayer must be used within a MusicPlayerProvider")
    }
    return context
}
