"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Brain, Sparkles, TrendingUp, BookOpen, Lightbulb, Target, Globe, Menu, X, Loader2 } from "lucide-react"

interface AnalysisResult {
  sentiment: number
  spiritualThemes: string[]
  emotions: string[]
  keywords: string[]
  recommendations: string[]
  quadrant: {
    spiritual: number
    material: number
    positive: number
    negative: number
  }
}

export default function FaithAnalyzer() {
  const [quote, setQuote] = useState("")
  const [selectedReligion, setSelectedReligion] = useState("") // Added religion selection state
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [navbarOnWhite, setNavbarOnWhite] = useState(false)

  const defaultSensitivity = 0.7
  const defaultHighlightKeywords = true

  const religionOptions = [
    { value: "", label: "Select Religion (Optional)" },
    { value: "christianity", label: "Christianity" },
    { value: "islam", label: "Islam" },
    { value: "judaism", label: "Judaism" },
    { value: "hinduism", label: "Hinduism" },
    { value: "buddhism", label: "Buddhism" },
    { value: "sikhism", label: "Sikhism" },
    { value: "other", label: "Other/Universal" },
  ]

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroHeight = document.getElementById("hero")?.offsetHeight || 0

      setNavbarOnWhite(scrollY > heroHeight - 100)
    }

    window.addEventListener("scroll", handleScroll)

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement

          if (element.classList.contains("slide-up")) {
            element.classList.add("animate-slide-up")
          } else if (element.classList.contains("slide-left")) {
            element.classList.add("animate-slide-left")
          } else if (element.classList.contains("slide-right")) {
            element.classList.add("animate-slide-right")
          } else if (element.classList.contains("zoom-in")) {
            element.classList.add("animate-zoom-in")
          } else if (element.classList.contains("rotate-in")) {
            element.classList.add("animate-rotate-in")
          } else {
            element.classList.add("animate-in")
          }

          const staggerElements = element.querySelectorAll(".stagger-child")
          staggerElements.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add("animate-in")
            }, index * 150)
          })
        }
      })
    }, observerOptions)

    const animateElements = document.querySelectorAll(
      ".animate-on-scroll, .slide-up, .slide-left, .slide-right, .zoom-in, .rotate-in",
    )
    animateElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const navLinks = document.querySelectorAll('a[href^="#"], button[onclick*="smoothScrollTo"]')
      navLinks.forEach((link) => link.classList.remove("nav-active"))

      const clickedLink =
        document.querySelector(`button[onclick*="${elementId}"]`) || document.querySelector(`a[href="#${elementId}"]`)
      if (clickedLink) {
        clickedLink.classList.add("nav-active")
        setTimeout(() => {
          clickedLink.classList.remove("nav-active")
        }, 1000)
      }

      const currentSection = document.querySelector(".section-active")
      if (currentSection) {
        currentSection.classList.add("slide-out-left")
        currentSection.classList.remove("section-active")
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })

      setMobileMenuOpen(false)

      setTimeout(() => {
        element.classList.add("slide-in-right", "section-active")
        element.classList.add("section-highlight")

        setTimeout(() => {
          element.classList.remove("slide-in-right")
          element.classList.remove("section-highlight")

          const allSections = document.querySelectorAll("section")
          allSections.forEach((section) => {
            section.classList.remove("slide-out-left")
          })
        }, 1000)
      }, 100)
    }
  }

  const handleAnalyze = async () => {
    if (!quote.trim()) return

    setIsAnalyzing(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quote: quote.trim(),
          religion: selectedReligion, // Include selected religion in API call
        }),
      })

      if (!response.ok) throw new Error("Analysis failed")

      const data = await response.json()

      displayResults(data)
    } catch (error) {
      console.error("Analysis error:", error)
      alert("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const displayResults = (results: AnalysisResult) => {
    const resultsContainer = document.getElementById("results-container")
    if (resultsContainer) {
      resultsContainer.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-white/90 backdrop-blur-sm border-purple-100 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <h3 class="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/></svg>
              Spiritual Insights
            </h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-2 text-purple-600">Themes</h4>
                <div class="flex flex-wrap gap-2">
                  ${results.spiritualThemes.map((theme) => `<span class="bg-purple-50 text-purple-700 border-purple-200 px-2 py-1 rounded text-sm">${theme}</span>`).join("")}
                </div>
              </div>
              <div>
                <h4 class="font-medium mb-2 text-purple-600">Emotions</h4>
                <div class="flex flex-wrap gap-2">
                  ${results.emotions.map((emotion) => `<span class="bg-purple-50 text-purple-600 border-purple-200 px-2 py-1 rounded text-sm">${emotion}</span>`).join("")}
                </div>
              </div>
              <div>
                <h4 class="font-medium mb-2 text-purple-600">Sentiment Score</h4>
                <div class="w-full bg-purple-100 rounded-full h-3">
                  <div class="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transition-all duration-1000 ease-out" style="width: ${Math.max(0, (results.sentiment + 1) * 50)}%"></div>
                </div>
                <p class="text-sm mt-1 text-purple-600">
                  ${results.sentiment > 0.3 ? "Very Positive" : results.sentiment > 0 ? "Positive" : results.sentiment > -0.3 ? "Neutral" : "Reflective"}
                </p>
              </div>
            </div>
          </div>
          <div class="bg-white/90 backdrop-blur-sm border-purple-100 rounded-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
            <h3 class="text-lg font-semibold text-purple-600 mb-4 flex items-center gap-2">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              Recommendations
            </h3>
            <ul class="space-y-3">
              ${results.recommendations
                .map(
                  (rec) => `
                <li class="flex items-start gap-3">
                  <svg class="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  <span class="text-sm text-purple-700">${rec}</span>
                </li>
              `,
                )
                .join("")}
            </ul>
          </div>
        </div>
      `
      resultsContainer.classList.remove("hidden")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
          }
          50% {
            box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
          }
        }

        @keyframes navPulse {
          0%, 100% {
            transform: scale(1);
            color: rgb(37, 99, 235);
          }
          50% {
            transform: scale(1.1);
            color: rgb(147, 51, 234);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-25%);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0.7;
            transform: translateX(-50px);
          }
        }

        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes buttonPress {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(60px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(-60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(60px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes rotateIn {
          from {
            opacity: 0;
            transform: rotate(-10deg) scale(0.9);
          }
          to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
          }
        }
        
        @keyframes parallaxFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-5px);
          }
          75% {
            transform: translateY(-30px) translateX(15px);
          }
        }

        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .animate-on-scroll.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .animate-slide-up {
          animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-slide-left {
          animation: slideLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-slide-right {
          animation: slideRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .animate-zoom-in {
          animation: zoomIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-rotate-in {
          animation: rotateIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .nav-active {
          animation: navPulse 0.6s ease-in-out, buttonPress 0.2s ease-in-out;
        }

        .section-highlight {
          animation: pulse 2s ease-in-out;
        }

        .slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-out-left {
          animation: slideOutLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-in-bottom {
          animation: slideInFromBottom 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .slide-in-top {
          animation: slideInFromTop 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce 3s ease-in-out infinite;
        }
        
        .stagger-child {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stagger-child.animate-in {
          opacity: 1;
          transform: translateY(0);
        }

        html {
          scroll-behavior: smooth;
        }

        .floating-icon {
          position: absolute;
          opacity: 0.1;
          animation: parallaxFloat 8s ease-in-out infinite;
        }

        .floating-icon:nth-child(2) { animation-delay: 2s; }
        .floating-icon:nth-child(3) { animation-delay: 4s; }
        .floating-icon:nth-child(4) { animation-delay: 6s; }

        button:active {
          animation: buttonPress 0.2s ease-in-out;
        }

        .section-active {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <nav
        className={`${navbarOnWhite ? "backdrop-blur-md text-gray-800 border-gray-200/20" : "backdrop-blur-md text-white border-white/20"} sticky top-0 z-50 transition-all duration-300 border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className={`flex items-center space-x-3 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}>
              <div
                className={`${navbarOnWhite ? "text-gray-800" : "text-white"} p-2 rounded-lg bg-white/10 backdrop-blur-sm animate-float`}
              >
                <Heart className="h-6 w-6 fill-current" />
              </div>
              <span className={`${navbarOnWhite ? "text-gray-800" : "text-white"} text-2xl font-bold`}>FAITHFLOW</span>
            </div>

            <div
              className={`hidden md:flex items-center space-x-8 ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}
            >
              <button
                onClick={() => smoothScrollTo("hero")}
                className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium transition-all duration-300 hover:scale-105 transform cursor-pointer active:scale-95`}
              >
                Home
              </button>
              <button
                onClick={() => smoothScrollTo("features")}
                className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium transition-all duration-300 hover:scale-105 transform cursor-pointer active:scale-95`}
              >
                Features
              </button>
              <button
                onClick={() => smoothScrollTo("analyzer")}
                className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium transition-all duration-300 hover:scale-105 transform cursor-pointer active:scale-95`}
              >
                Analyzer
              </button>
              <button
                onClick={() => smoothScrollTo("about")}
                className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium transition-all duration-300 active:scale-95`}
              >
                About
              </button>
            </div>

            <div
              className={`hidden md:flex items-center space-x-4 ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}
            >
              <button
                className={`p-2 rounded-full ${navbarOnWhite ? "hover:bg-gray-200/50 text-gray-700" : "hover:bg-white/20 text-white"} transition-all duration-200 active:scale-95`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                className={`p-2 rounded-full ${navbarOnWhite ? "hover:bg-gray-200/50 text-gray-700" : "hover:bg-white/20 text-white"} transition-all duration-200 active:scale-95`}
                title="Prayer & Meditation"
              >
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`${navbarOnWhite ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"} transition-transform duration-200 hover:scale-110 active:scale-95`}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div
              className={`md:hidden py-4 border-t ${navbarOnWhite ? "border-gray-200/20" : "border-white/20"} backdrop-blur-sm rounded-b-lg animate-fade-in-up`}
            >
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => smoothScrollTo("hero")}
                  className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium px-2 py-1 transition-all duration-300 hover:translate-x-2 text-left active:scale-95`}
                >
                  Home
                </button>
                <button
                  onClick={() => smoothScrollTo("features")}
                  className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium px-2 py-1 transition-all duration-300 hover:translate-x-2 text-left active:scale-95`}
                >
                  Features
                </button>
                <button
                  onClick={() => smoothScrollTo("analyzer")}
                  className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium px-2 py-1 transition-all duration-300 hover:translate-x-2 text-left active:scale-95`}
                >
                  Analyzer
                </button>
                <button
                  onClick={() => smoothScrollTo("about")}
                  className={`${navbarOnWhite ? "text-gray-700 hover:text-gray-900" : "text-white hover:text-white/80"} font-medium px-2 py-1 transition-all duration-300 hover:translate-x-2 text-left active:scale-95`}
                >
                  About
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <section
        id="hero"
        className="relative overflow-hidden h-screen flex items-center justify-center text-white -mt-16"
      >
        <div className="absolute inset-0 z-0">
  <video
    autoPlay
    muted
    loop
    className="w-full h-full object-cover pointer-events-none"
    style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "100vw",
      height: "56.25vw",
      minHeight: "100vh",
      minWidth: "177.77vh",
      transform: "translate(-50%, -50%)",
      zIndex: -1,
    }}
  >
    <source src="/BG Faith Video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>

        <div className="absolute inset-0 bg-black/40 z-1"></div>

        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-purple-500/20 to-purple-400/30 z-2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className={`${isVisible ? "animate-fade-in-up" : "opacity-0"} max-w-4xl mx-auto`}>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Transform Your
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text">
                Spiritual Journey
              </span>
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
              Discover deeper meaning in sacred texts and spiritual wisdom with AI-powered analysis
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-12 py-4 text-xl font-semibold transform hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
                onClick={() => smoothScrollTo("analyzer")}
              >
                Start Your Journey
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-black px-12 py-4 text-xl font-semibold transform hover:scale-105 transition-all duration-300"
                onClick={() => smoothScrollTo("features")}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 left-10 opacity-20">
          <Heart className="w-16 h-16 text-white animate-float" />
        </div>
        <div className="absolute bottom-1/4 right-10 opacity-20">
          <Sparkles className="w-20 h-20 text-white animate-sparkle" />
        </div>
      </section>

      <section id="features" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-indigo-900/60 to-slate-800/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/40 to-indigo-950/60"></div>

        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-800/30 to-transparent rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-purple-800/40 to-transparent rounded-full blur-3xl animate-bounce-slow"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-slate-700/30 to-indigo-800/30 rounded-full blur-2xl animate-sparkle"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 slide-up">
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center zoom-in">
              <Sparkles className="w-16 h-16 text-white animate-sparkle" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Spiritual Analysis{" "}
              <span className="text-transparent bg-gradient-to-r from-purple-100 to-white bg-clip-text">Features</span>
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Discover deeper meaning in sacred texts, spiritual quotes, and wisdom literature
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-white/20 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-left relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-2 right-2">
                <Brain className="w-6 h-6 text-white/30 animate-sparkle" />
              </div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/20 rounded-lg flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300 backdrop-blur-sm">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sentiment Analysis</h3>
                <p className="text-white/80 text-sm">
                  Analyze the emotional and spiritual tone of sacred texts, prayers, and inspirational quotes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-up relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-2 right-2">
                <Sparkles className="w-6 h-6 text-white/30 animate-bounce-slow" />
              </div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/20 rounded-lg flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300 backdrop-blur-sm">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Theme Detection</h3>
                <p className="text-white/80 text-sm">
                  Identify spiritual themes, biblical concepts, and theological insights within your text
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-up relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-2 right-2">
                <TrendingUp className="w-6 h-6 text-white/30 animate-float" />
              </div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/20 rounded-lg flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300 backdrop-blur-sm">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Growth Insights</h3>
                <p className="text-white/80 text-sm">
                  Receive personalized recommendations for spiritual growth and deeper faith understanding
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/20 border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl slide-right relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-2 right-2">
                <Target className="w-6 h-6 text-white/30 animate-sparkle" />
              </div>
              <CardContent className="p-6 text-center relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-white/30 to-white/20 rounded-lg flex items-center justify-center mx-auto mb-4 transform hover:rotate-12 transition-transform duration-300 backdrop-blur-sm">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Quadrant Mapping</h3>
                <p className="text-white/80 text-sm">
                  Visualize spiritual content across faith-doubt and hope-despair dimensions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="analyzer"
        className="py-20 bg-gradient-to-br from-purple-100/40 via-purple-50/60 to-white relative overflow-hidden"
      >
        <div className="floating-icon top-20 left-20 parallax-float">
          <BookOpen className="w-14 h-14 text-purple-400/20" />
        </div>
        <div className="floating-icon bottom-20 right-20 parallax-float">
          <Lightbulb className="w-16 h-16 text-purple-300/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 slide-up">
            <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center rotate-in">
              <BookOpen className="w-16 h-16 text-purple-500 animate-float" />
            </div>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-transparent bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text">
                Begin Your
              </span>
              <br />
              <span className="text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text">
                Spiritual Journey
              </span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto">
              <span className="text-transparent bg-gradient-to-r from-purple-600/90 via-purple-500 to-purple-600/90 bg-clip-text">
                Enter a meaningful verse, prayer, or spiritual quote to discover its deeper meaning and significance
              </span>
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <Card className="zoom-in transform hover:scale-105 transition-all duration-300 hover:shadow-lg relative overflow-hidden bg-white/90 backdrop-blur-sm border-purple-100">
              <div className="absolute top-4 right-4">
                <BookOpen className="w-10 h-10 text-purple-300/20 animate-float" />
              </div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  <span className="text-transparent bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text">
                    Quote Analysis
                  </span>
                </CardTitle>
                <CardDescription>
                  <span className="text-transparent bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text">
                    Enter your quote or spiritual passage for comprehensive analysis
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-transparent bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text">
                    Religious Context
                  </label>
                  <select
                    value={selectedReligion}
                    onChange={(e) => setSelectedReligion(e.target.value)}
                    className="w-full p-3 border border-purple-100 rounded-lg bg-white/80 backdrop-blur-sm focus:border-purple-300 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-purple-700"
                  >
                    {religionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <Textarea
                  placeholder="Enter a Bible verse, spiritual quote, prayer, or inspirational passage..."
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  className="min-h-32 text-lg transition-all duration-200 focus:scale-105 border-purple-100 focus:border-purple-300"
                />
                <Button
                  onClick={handleAnalyze}
                  disabled={!quote.trim() || isAnalyzing}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 py-3 text-lg transform hover:scale-105 transition-all duration-200 hover:shadow-xl relative overflow-hidden"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Analyze Spiritual Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div id="results-container" className="hidden"></div>
          </div>
        </div>
      </section>

      <footer id="about" className="relative overflow-hidden text-white py-12">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/80 via-indigo-900/60 to-slate-800/70"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/40 to-indigo-950/60"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2 slide-left">
              <div className="flex items-center gap-3 mb-4 stagger-child">
                <div className="p-2 rounded-lg bg-gradient-to-br from-white/20 to-white/10 animate-float backdrop-blur-sm">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">FaithFlow</span>
              </div>
              <p className="text-white/80 mb-4 max-w-md stagger-child">
                Empowering spiritual growth through AI-powered analysis of sacred texts, prayers, and inspirational
                content.
              </p>
              <div className="flex items-center gap-4 stagger-child">
                <Badge
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 transform hover:scale-110 transition-transform duration-200 backdrop-blur-sm"
                >
                  <Globe className="w-3 h-3 mr-1" />
                  Global Reach
                </Badge>
              </div>
            </div>

            <div className="slide-up">
              <h3 className="font-semibold mb-4 stagger-child">Features</h3>
              <ul className="space-y-2 text-white/80">
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  Spiritual Sentiment Analysis
                </li>
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  Biblical Theme Detection
                </li>
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  Faith Insights
                </li>
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  Spiritual Growth Guidance
                </li>
              </ul>
            </div>

            <div className="slide-right">
              <h3 className="font-semibold mb-4 stagger-child">Company</h3>
              <ul className="space-y-2 text-white/80">
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  About Us
                </li>
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  Privacy Policy
                </li>
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  Terms of Service
                </li>
                <li className="hover:text-white transition-colors duration-200 hover:translate-x-1 transform stagger-child">
                  Contact
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/80 slide-up">
            <p>&copy; 2025 FaithFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
