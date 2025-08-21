"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Brain, Sparkles, TrendingUp, BookOpen, Lightbulb, Target, Globe, Menu, X, Loader2 } from "lucide-react"
import { QuadrantChart } from "@/components/quadrant-chart"

interface AnalysisResponse {
  quote: string
  religion: string
  analysis: {
    section1: string
    section2: {
      table1: any[]
      table2: any[]
    }
    section3: string
  }
}

export default function FaithAnalyzer() {
  const [quote, setQuote] = useState("")
  const [selectedReligion, setSelectedReligion] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [navbarOnWhite, setNavbarOnWhite] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null)

  const religionOptions = [
    { value: "none", label: "Select Religion (Optional)" },
    { value: "christianity", label: "Christianity" },
    { value: "islam", label: "Islam" },
    { value: "judaism", label: "Judaism" },
    { value: "hinduism", label: "Hinduism" },
    { value: "buddhism", label: "Buddhism" },
    { value: "sikhism", label: "Sikhism" },
    { value: "jainism", label: "Jainism" },
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
          religion: selectedReligion === "none" ? "other" : selectedReligion || "other", // Include selected religion in API call
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      setAnalysisResult(data)
      
      // Scroll to results section
      const resultsSection = document.getElementById("results")
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" })
      }
    } catch (error) {
      console.error("Analysis error:", error)
      alert("Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <section
        id="hero"
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
      >
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/placeholder.jpg"
          >
            <source src="/BG%20Faith%20Video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-sm"></div>
        </div>

        <div className="container relative z-10 px-4 py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Faith Quotient Analyzer
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in delay-300">
            Discover the spiritual depth and meaning behind religious texts and quotes
          </p>
          <Button
            onClick={() => smoothScrollTo("analyzer")}
            size="lg"
            className="bg-white text-purple-700 hover:bg-purple-100 animate-fade-in delay-500"
          >
            Analyze Your Quote
          </Button>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => smoothScrollTo("analyzer")}
            className="text-white flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity"
          >
            <span className="mb-2">Begin</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      </section>

      {/* Analyzer Section */}
      <section
        id="analyzer"
        className="py-20 px-4 min-h-screen flex items-center justify-center bg-white"
      >
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">Analyze Your Quote</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Enter a religious or philosophical quote below to discover its spiritual meaning, emotional impact, and
              practical wisdom.
            </p>
          </div>

          <Card className="shadow-lg border-purple-100">
            <CardHeader>
              <CardTitle className="text-purple-800">Faith Quotient Analysis</CardTitle>
              <CardDescription>
                Our AI will analyze your quote using the PASSIONIT PRUTL framework to reveal its spiritual dimensions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your quote
                </label>
                <Textarea
                  id="quote"
                  placeholder="Enter a religious or philosophical quote..."
                  className="min-h-32 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Religion/Tradition (Optional)
                </label>
                <Select value={selectedReligion} onValueChange={setSelectedReligion}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Religion (Optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {religionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleAnalyze}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isAnalyzing || !quote.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Quote"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 px-4 min-h-screen bg-purple-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">Analysis Results</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover the spiritual dimensions and practical wisdom in your quote.
            </p>
          </div>

          {analysisResult ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Section 1: Quote & Interpretation */}
              <Card className="shadow-lg border-purple-100 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Quote & Interpretation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: analysisResult.analysis?.section1 || '' }} />
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: PASSIONIT PRUTL Analysis */}
              <Card className="shadow-lg border-purple-100">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    PASSIONIT PRUTL Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <h3>Sentiment Analysis</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positive Soul (PS)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negative Soul (NS)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positive Materialism (PM)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negative Materialism (NM)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {analysisResult.analysis?.section2?.table1?.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 whitespace-normal text-sm">
                                  {String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Emotional & Philosophical Mapping */}
              <Card className="shadow-lg border-purple-100">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Emotional & Philosophical Mapping
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moral Discipline</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spiritual Alignment</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mental Well-being</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Practical Challenge</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {analysisResult.analysis?.section2?.table2?.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-3 py-2 whitespace-normal text-sm">
                                  {String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Final Classification & Conclusion */}
              <Card className="shadow-lg border-purple-100 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-purple-800 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Final Classification & Conclusion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: analysisResult.analysis?.section3 || '' }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center p-12 bg-white rounded-lg shadow">
              <p className="text-gray-500">Enter a quote and click "Analyze Quote" to see results here.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold">Faith Quotient Analyzer</h3>
              <p className="mt-2 text-purple-200">Exploring the spiritual dimensions of wisdom</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-purple-200 hover:text-white transition-colors">
                About
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-purple-800 text-center text-purple-300 text-sm">
            &copy; {new Date().getFullYear()} Faith Quotient Analyzer. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
