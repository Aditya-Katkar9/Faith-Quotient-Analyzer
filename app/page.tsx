"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Brain, Sparkles, TrendingUp, BookOpen, Target, Globe, Menu, X, Loader2 } from "lucide-react"

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
    { value: "hinduism", label: "Hinduism" },
    { value: "jainism", label: "Jainism" },
    { value: "islam", label: "Islam" },
    { value: "judaism", label: "Judaism" },
    { value: "buddhism", label: "Buddhism" },
    { value: "sikhism", label: "Sikhism" },
    { value: "christianity", label: "Christianity" },
    { value: "other", label: "Other/Universal" },
  ]

  useEffect(() => {
    setIsVisible(true)

    const handleScroll = () => {
      const scrollY = window.scrollY
      const heroSection = document.getElementById("hero")
      const heroHeight = heroSection?.offsetHeight || 0

      setNavbarOnWhite(scrollY > heroHeight - 100)
    }

    window.addEventListener("scroll", handleScroll)

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement
        const staggerElements = element.querySelectorAll(".stagger-child")

        if (entry.isIntersecting) {
          // Reset animations first
          element.classList.remove("animate-fade-in-up")
          staggerElements.forEach((child) => {
            child.classList.remove("animate-fade-in-up")
          })

          // Trigger animations with slight delay
          setTimeout(() => {
            element.classList.add("animate-fade-in-up")
            staggerElements.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("animate-fade-in-up")
              }, index * 200)
            })
          }, 100)
        } else {
          // Remove animations when element leaves viewport
          element.classList.remove("animate-fade-in-up")
          staggerElements.forEach((child) => {
            child.classList.remove("animate-fade-in-up")
          })
        }
      })
    }, observerOptions)

    const animateElements = document.querySelectorAll(".animate-on-scroll")
    animateElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
      setMobileMenuOpen(false)
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
          religion: selectedReligion === "none" ? "other" : selectedReligion || "other",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()
      setAnalysisResult(data)

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
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          navbarOnWhite ? "bg-white/20 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Heart
                className={`h-6 w-6 transition-colors duration-300 ${navbarOnWhite ? "text-purple-600" : "text-white"}`}
              />
              <span
                className={`text-xl font-bold transition-colors duration-300 ${navbarOnWhite ? "text-purple-900" : "text-white"}`}
              >
                FAITHFLOW
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => smoothScrollTo("hero")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-purple-800 hover:text-purple-600" : "text-white hover:text-purple-300"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => smoothScrollTo("features")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-purple-800 hover:text-purple-600" : "text-white hover:text-purple-300"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => smoothScrollTo("analyzer")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-purple-800 hover:text-purple-600" : "text-white hover:text-purple-300"
                }`}
              >
                Analyzer
              </button>
              <button
                onClick={() => {
                  const footer = document.querySelector("footer")
                  if (footer) {
                    footer.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                }}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-purple-800 hover:text-purple-600" : "text-white hover:text-purple-300"
                }`}
              >
                About
              </button>
            </div>

            {/* Right side icons */}
            <div className="hidden md:flex items-center space-x-4"></div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`md:hidden ${navbarOnWhite ? "text-purple-800" : "text-white"}`}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm rounded-lg mt-2 p-4 shadow-lg">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => smoothScrollTo("hero")}
                  className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => smoothScrollTo("features")}
                  className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => smoothScrollTo("analyzer")}
                  className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                >
                  Analyzer
                </button>
                <button
                  onClick={() => {
                    const footer = document.querySelector("footer")
                    if (footer) {
                      footer.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    setMobileMenuOpen(false)
                  }}
                  className="text-gray-700 hover:text-purple-600 transition-colors text-left"
                >
                  About
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
      >
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="container relative z-10 px-4 py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Transform Your
            <br />
            <span className="text-purple-300">Spiritual Journey</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-fade-in-up stagger-1">
            Discover deeper meaning in sacred texts and spiritual wisdom with AI-powered analysis
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-2">
            <Button
              onClick={() => smoothScrollTo("analyzer")}
              size="lg"
              className="bg-white text-purple-700 hover:bg-purple-100 px-8 py-3 animate-button-pulse"
            >
              Start Your Journey
            </Button>
            <Button
              onClick={() => smoothScrollTo("features")}
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-700 px-8 py-3 transition-all duration-300 hover:scale-105 bg-transparent backdrop-blur-sm"
            >
              Explore Features
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 animate-on-scroll"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6"></div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 stagger-child">
              Spiritual Analysis Features
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto stagger-child">
              Discover deeper meaning in sacred texts, spiritual quotes, and wisdom literature
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-purple-500/20 border-purple-400/30 backdrop-blur-sm text-white stagger-child hover:bg-purple-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-purple-400/30 rounded-full w-fit">
                  <Brain className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-100">
                  Analyze the emotional and spiritual tone of sacred texts, prayers, and inspirational quotes
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/20 border-purple-400/30 backdrop-blur-sm text-white stagger-child hover:bg-purple-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-purple-400/30 rounded-full w-fit">
                  <Sparkles className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Theme Detection</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-100">
                  Identify spiritual themes, biblical concepts, and theological insights within your text
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/20 border-purple-400/30 backdrop-blur-sm text-white stagger-child hover:bg-purple-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-purple-400/30 rounded-full w-fit">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Growth Insights</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-100">
                  Receive personalized recommendations for spiritual growth and deeper faith understanding
                </p>
              </CardContent>
            </Card>

            <Card className="bg-purple-500/20 border-purple-400/30 backdrop-blur-sm text-white stagger-child hover:bg-purple-500/30 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-3 bg-purple-400/30 rounded-full w-fit">
                  <Target className="h-8 w-8" />
                </div>
                <CardTitle className="text-xl">Quadrant Mapping</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-purple-100">
                  Visualize spiritual content across faith-doubt and hope-despair dimensions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Analyzer Section */}
      <section
        id="analyzer"
        className="py-8 px-4 pt-32 min-h-screen flex items-center justify-center bg-white animate-on-scroll"
      >
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4 stagger-child">Quote Analysis</h2>
            <p className="text-gray-600 max-w-2xl mx-auto stagger-child">
              Enter your quote or spiritual passage for comprehensive analysis
            </p>
          </div>

          <Card className="shadow-lg border-purple-100 stagger-child">
            <CardHeader>
              <CardTitle className="text-purple-800">Faith Quotient Analysis</CardTitle>
              
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your quote or spiritual passage for comprehensive analysis
                </label>
                <Textarea
                  id="quote"
                  placeholder="Enter Spiritual or philosophical quote"
                  className="min-h-32 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="religion" className="block text-sm font-medium text-gray-700 mb-1">
                  Religious Context
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
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                disabled={isAnalyzing || !quote.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyze Spiritual Content
                  </>
                ) : (
                  "Analyze Spiritual Content"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-8 px-4 pt-32 min-h-screen bg-purple-50 animate-on-scroll">
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
                    <div dangerouslySetInnerHTML={{ __html: analysisResult.analysis?.section1 || "" }} />
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
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Positive Soul (PS)
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Negative Soul (NS)
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Positive Materialism (PM)
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Negative Materialism (NM)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {analysisResult.analysis?.section2?.table1 &&
                            (Array.isArray(analysisResult.analysis.section2.table1)
                              ? analysisResult.analysis.section2.table1
                              : [analysisResult.analysis.section2.table1]
                            ).map((row, index) => (
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
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Moral Discipline
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Spiritual Alignment
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Mental Well-being
                            </th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Practical Challenge
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {analysisResult.analysis?.section2?.table2 &&
                            (Array.isArray(analysisResult.analysis.section2.table2)
                              ? analysisResult.analysis.section2.table2
                              : [analysisResult.analysis.section2.table2]
                            ).map((row, index) => (
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
                    <div dangerouslySetInnerHTML={{ __html: analysisResult.analysis?.section3 || "" }} />
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
      <footer className="bg-purple-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Brand Section */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Heart className="h-6 w-6 text-purple-300" />
                <span className="text-xl font-bold">FaithFlow</span>
              </div>
              <p className="text-purple-200 mb-3 text-sm">
                Empowering spiritual growth through AI-powered analysis of sacred texts, prayers, and inspirational
                content.
              </p>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-purple-300" />
                <span className="text-sm text-purple-300">Global Reach</span>
              </div>
            </div>

            {/* Features Column */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <ul className="space-y-1 text-purple-200 text-sm">
                <li>Spiritual Sentiment Analysis</li>
                <li>Biblical Theme Detection</li>
                <li>Faith Insights</li>
                <li>Spiritual Growth Guidance</li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Company</h3>
              <ul className="space-y-1 text-purple-200 text-sm">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-purple-800 pt-6 text-center">
            <div className="mb-3">
              <p className="text-purple-200 text-sm mb-1">Developed by</p>
              <p className="text-white font-medium">Aditya Katkar & Kanish Rawal</p>
            </div>
            <p className="text-purple-300 text-sm">© 2025 FaithFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
