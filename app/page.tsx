"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, Brain, Sparkles, TrendingUp, BookOpen, Target, Globe, Menu, X, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

const Lottie = dynamic(() => import("react-lottie-player"), { ssr: false })

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
    <>
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
                className={`h-6 w-6 transition-colors duration-300 ${navbarOnWhite ? "text-indigo-600" : "text-white"}`}
              />
              <span
                className={`text-xl font-bold transition-colors duration-300 ${navbarOnWhite ? "text-indigo-900" : "text-white"}`}
              >
                FAITHFLOW
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => smoothScrollTo("hero")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-indigo-800 hover:text-indigo-600" : "text-white hover:text-yellow-300"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => smoothScrollTo("features")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-indigo-800 hover:text-indigo-600" : "text-white hover:text-yellow-300"
                }`}
              >
                Features
              </button>
              <button
                onClick={() => smoothScrollTo("analyzer")}
                className={`transition-all duration-300 hover:scale-105 font-medium ${
                  navbarOnWhite ? "text-indigo-800 hover:text-indigo-600" : "text-white hover:text-yellow-300"
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
                  navbarOnWhite ? "text-indigo-800 hover:text-indigo-600" : "text-white hover:text-yellow-300"
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
              className={`md:hidden ${navbarOnWhite ? "text-indigo-800" : "text-white"}`}
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
                  className="text-gray-700 hover:text-indigo-600 transition-colors text-left"
                >
                  Home
                </button>
                <button
                  onClick={() => smoothScrollTo("features")}
                  className="text-gray-700 hover:text-indigo-600 transition-colors text-left"
                >
                  Features
                </button>
                <button
                  onClick={() => smoothScrollTo("analyzer")}
                  className="text-gray-700 hover:text-indigo-600 transition-colors text-left"
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
                  className="text-gray-700 hover:text-indigo-600 transition-colors text-left"
                >
                  About
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section
          id="hero"
          className={`relative min-h-screen flex items-center justify-center overflow-hidden ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
        >
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-700"></div>
            <div className="absolute inset-0 bg-black/20"></div>

            <div className="absolute inset-0 flex items-center justify-center">
              <Lottie
                loop
                animationData={{
                  v: "5.7.4",
                  fr: 30,
                  ip: 0,
                  op: 180,
                  w: 800,
                  h: 600,
                  nm: "Spiritual Meditation",
                  ddd: 0,
                  assets: [],
                  layers: [
                    {
                      ddd: 0,
                      ind: 1,
                      ty: 4,
                      nm: "Lotus",
                      sr: 1,
                      ks: {
                        o: { a: 0, k: 30 },
                        r: {
                          a: 1,
                          k: [
                            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                            { t: 179, s: [360] },
                          ],
                        },
                        p: { a: 0, k: [400, 300, 0] },
                        a: { a: 0, k: [0, 0, 0] },
                        s: { a: 0, k: [100, 100, 100] },
                      },
                      ao: 0,
                      shapes: [
                        {
                          ty: "gr",
                          it: [
                            {
                              ty: "el",
                              s: { a: 0, k: [200, 200] },
                              p: { a: 0, k: [0, 0] },
                              nm: "Circle",
                            },
                            {
                              ty: "st",
                              c: { a: 0, k: [1, 0.9, 0.4, 1] },
                              o: { a: 0, k: 100 },
                              w: { a: 0, k: 2 },
                              nm: "Stroke",
                            },
                            {
                              ty: "tr",
                              p: { a: 0, k: [0, 0] },
                              a: { a: 0, k: [0, 0] },
                              s: { a: 0, k: [100, 100] },
                              r: { a: 0, k: 0 },
                              o: { a: 0, k: 100 },
                            },
                          ],
                          nm: "Lotus Circle",
                        },
                      ],
                      ip: 0,
                      op: 180,
                      st: 0,
                      bm: 0,
                    },
                    {
                      ddd: 0,
                      ind: 2,
                      ty: 4,
                      nm: "Particles",
                      sr: 1,
                      ks: {
                        o: { a: 0, k: 40 },
                        r: { a: 0, k: 0 },
                        p: {
                          a: 1,
                          k: [
                            { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 0, s: [100, 500, 0] },
                            { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 90, s: [700, 100, 0] },
                            { t: 179, s: [100, 500, 0] },
                          ],
                        },
                        a: { a: 0, k: [0, 0, 0] },
                        s: { a: 0, k: [100, 100, 100] },
                      },
                      ao: 0,
                      shapes: [
                        {
                          ty: "gr",
                          it: [
                            {
                              ty: "el",
                              s: { a: 0, k: [8, 8] },
                              p: { a: 0, k: [0, 0] },
                              nm: "Particle",
                            },
                            {
                              ty: "fl",
                              c: { a: 0, k: [1, 0.9, 0.4, 1] },
                              o: { a: 0, k: 100 },
                              nm: "Fill",
                            },
                            {
                              ty: "tr",
                              p: { a: 0, k: [0, 0] },
                              a: { a: 0, k: [0, 0] },
                              s: { a: 0, k: [100, 100] },
                              r: { a: 0, k: 0 },
                              o: { a: 0, k: 100 },
                            },
                          ],
                          nm: "Particle Group",
                        },
                      ],
                      ip: 0,
                      op: 180,
                      st: 0,
                      bm: 0,
                    },
                  ],
                }}
                play
                style={{ width: "100%", height: "100%", opacity: 0.3 }}
              />
            </div>
          </div>

          <div className="container relative z-10 px-4 py-32 text-center text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in-up">
              Transform Your
              <br />
              <span className="text-yellow-400">Spiritual Journey</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-10 max-w-4xl mx-auto animate-fade-in-up stagger-1">
              Discover deeper meaning in sacred texts and spiritual wisdom with AI-powered analysis
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up stagger-2">
              <Button
                onClick={() => smoothScrollTo("analyzer")}
                size="lg"
                className="bg-white text-indigo-700 hover:bg-gray-100 px-10 py-4 text-lg animate-button-pulse"
              >
                Start Your Journey
              </Button>
              <Button
                onClick={() => smoothScrollTo("features")}
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-700 px-10 py-4 text-lg transition-all duration-300 hover:scale-105 bg-transparent backdrop-blur-sm"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 px-4 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 animate-on-scroll relative overflow-hidden"
        >
          <div className="absolute top-10 right-10 opacity-20">
            <Lottie
              loop
              animationData={{
                v: "5.7.4",
                fr: 25,
                ip: 0,
                op: 150,
                w: 300,
                h: 300,
                nm: "Floating Meditation",
                ddd: 0,
                assets: [],
                layers: [
                  {
                    ddd: 0,
                    ind: 1,
                    ty: 4,
                    nm: "Meditation Figure",
                    sr: 1,
                    ks: {
                      o: { a: 0, k: 60 },
                      r: { a: 0, k: 0 },
                      p: {
                        a: 1,
                        k: [
                          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 0, s: [150, 150, 0] },
                          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 75, s: [150, 130, 0] },
                          { t: 149, s: [150, 150, 0] },
                        ],
                      },
                      a: { a: 0, k: [0, 0, 0] },
                      s: { a: 0, k: [100, 100, 100] },
                    },
                    ao: 0,
                    shapes: [
                      {
                        ty: "gr",
                        it: [
                          {
                            ty: "el",
                            s: { a: 0, k: [80, 80] },
                            p: { a: 0, k: [0, 0] },
                            nm: "Body",
                          },
                          {
                            ty: "st",
                            c: { a: 0, k: [0.9, 0.8, 0.3, 1] },
                            o: { a: 0, k: 100 },
                            w: { a: 0, k: 3 },
                            nm: "Stroke",
                          },
                          {
                            ty: "tr",
                            p: { a: 0, k: [0, 0] },
                            a: { a: 0, k: [0, 0] },
                            s: { a: 0, k: [100, 100] },
                            r: { a: 0, k: 0 },
                            o: { a: 0, k: 100 },
                          },
                        ],
                        nm: "Meditation Body",
                      },
                    ],
                    ip: 0,
                    op: 150,
                    st: 0,
                    bm: 0,
                  },
                ],
              }}
              play
              style={{ width: "200px", height: "200px" }}
            />
          </div>

          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-20">
              <div className="flex justify-center mb-8"></div>
              <h2 className="text-5xl md:text-6xl font-bold text-white mb-8 stagger-child">
                Spiritual Analysis Features
              </h2>
              <p className="text-2xl text-indigo-100 max-w-4xl mx-auto stagger-child">
                Discover deeper meaning in sacred texts, spiritual quotes, and wisdom literature
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-emerald-500/20 border-emerald-400/30 backdrop-blur-sm text-white stagger-child hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-emerald-400/30 rounded-full w-fit">
                    <Brain className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Sentiment Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-emerald-100">
                    Analyze the emotional and spiritual tone of sacred texts, prayers, and inspirational quotes
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-emerald-500/20 border-emerald-400/30 backdrop-blur-sm text-white stagger-child hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-emerald-400/30 rounded-full w-fit">
                    <Sparkles className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Theme Detection</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-emerald-100">
                    Identify spiritual themes, biblical concepts, and theological insights within your text
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-emerald-500/20 border-emerald-400/30 backdrop-blur-sm text-white stagger-child hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-emerald-400/30 rounded-full w-fit">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">PASSIONIT PRUTL Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-emerald-100">
                    Advanced analytical framework for comprehensive spiritual text evaluation and meaningful insights
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-emerald-500/20 border-emerald-400/30 backdrop-blur-sm text-white stagger-child hover:bg-emerald-500/30 transition-all duration-300 hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-emerald-400/30 rounded-full w-fit">
                    <Target className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl">Quadrant Mapping</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-emerald-100">
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
          className="py-10 px-4 pt-36 min-h-screen flex items-center justify-center bg-gray-50 animate-on-scroll relative overflow-hidden"
        >
          <div className="absolute bottom-10 left-10 opacity-15">
            <Lottie
              loop
              animationData={{
                v: "5.7.4",
                fr: 20,
                ip: 0,
                op: 200,
                w: 400,
                h: 400,
                nm: "Sacred Geometry",
                ddd: 0,
                assets: [],
                layers: [
                  {
                    ddd: 0,
                    ind: 1,
                    ty: 4,
                    nm: "Flower of Life",
                    sr: 1,
                    ks: {
                      o: { a: 0, k: 40 },
                      r: {
                        a: 1,
                        k: [
                          { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
                          { t: 199, s: [360] },
                        ],
                      },
                      p: { a: 0, k: [200, 200, 0] },
                      a: { a: 0, k: [0, 0, 0] },
                      s: {
                        a: 1,
                        k: [
                          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 0, s: [80, 80, 100] },
                          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 100, s: [120, 120, 100] },
                          { t: 199, s: [80, 80, 100] },
                        ],
                      },
                    },
                    ao: 0,
                    shapes: [
                      {
                        ty: "gr",
                        it: [
                          {
                            ty: "el",
                            s: { a: 0, k: [150, 150] },
                            p: { a: 0, k: [0, 0] },
                            nm: "Circle1",
                          },
                          {
                            ty: "el",
                            s: { a: 0, k: [100, 100] },
                            p: { a: 0, k: [50, 0] },
                            nm: "Circle2",
                          },
                          {
                            ty: "el",
                            s: { a: 0, k: [100, 100] },
                            p: { a: 0, k: [-50, 0] },
                            nm: "Circle3",
                          },
                          {
                            ty: "st",
                            c: { a: 0, k: [0.4, 0.2, 0.8, 1] },
                            o: { a: 0, k: 100 },
                            w: { a: 0, k: 2 },
                            nm: "Stroke",
                          },
                          {
                            ty: "tr",
                            p: { a: 0, k: [0, 0] },
                            a: { a: 0, k: [0, 0] },
                            s: { a: 0, k: [100, 100] },
                            r: { a: 0, k: 0 },
                            o: { a: 0, k: 100 },
                          },
                        ],
                        nm: "Sacred Pattern",
                      },
                    ],
                    ip: 0,
                    op: 200,
                    st: 0,
                    bm: 0,
                  },
                ],
              }}
              play
              style={{ width: "250px", height: "250px" }}
            />
          </div>

          <div className="container max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-6 stagger-child">Quote Analysis</h2>
              <p className="text-gray-600 max-w-3xl mx-auto stagger-child text-xl">
                Enter your quote or spiritual passage for comprehensive analysis
              </p>
            </div>

            <Card className="shadow-xl border-indigo-100 stagger-child">
              <CardHeader className="pb-6">
                <CardTitle className="text-indigo-800 text-2xl">Faith Quotient Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <label htmlFor="quote" className="block font-medium text-gray-700 mb-3 text-lg">
                    Enter your quote or spiritual passage for comprehensive analysis
                  </label>
                  <Textarea
                    id="quote"
                    placeholder="Enter Spiritual or philosophical quote"
                    className="min-h-36 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500 text-lg p-4"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="religion" className="block font-medium text-gray-700 mb-3 text-lg">
                    Religious Context
                  </label>
                  <Select value={selectedReligion} onValueChange={setSelectedReligion}>
                    <SelectTrigger className="w-full h-12 text-lg">
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
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-lg"
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
        <section
          id="results"
          className="py-10 px-4 pt-36 min-h-screen bg-indigo-50 animate-on-scroll relative overflow-hidden"
        >
          <div className="absolute top-20 right-20 opacity-10">
            <Lottie
              loop
              animationData={{
                v: "5.7.4",
                fr: 30,
                ip: 0,
                op: 120,
                w: 300,
                h: 200,
                nm: "Energy Waves",
                ddd: 0,
                assets: [],
                layers: [
                  {
                    ddd: 0,
                    ind: 1,
                    ty: 4,
                    nm: "Wave1",
                    sr: 1,
                    ks: {
                      o: { a: 0, k: 50 },
                      r: { a: 0, k: 0 },
                      p: { a: 0, k: [150, 100, 0] },
                      a: { a: 0, k: [0, 0, 0] },
                      s: {
                        a: 1,
                        k: [
                          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 0, s: [50, 50, 100] },
                          { i: { x: 0.833, y: 0.833 }, o: { x: 0.167, y: 0.167 }, t: 60, s: [150, 150, 100] },
                          { t: 119, s: [50, 50, 100] },
                        ],
                      },
                    },
                    ao: 0,
                    shapes: [
                      {
                        ty: "gr",
                        it: [
                          {
                            ty: "el",
                            s: { a: 0, k: [100, 100] },
                            p: { a: 0, k: [0, 0] },
                            nm: "Wave",
                          },
                          {
                            ty: "st",
                            c: { a: 0, k: [0.3, 0.7, 0.9, 1] },
                            o: { a: 0, k: 100 },
                            w: { a: 0, k: 3 },
                            nm: "Stroke",
                          },
                          {
                            ty: "tr",
                            p: { a: 0, k: [0, 0] },
                            a: { a: 0, k: [0, 0] },
                            s: { a: 0, k: [100, 100] },
                            r: { a: 0, k: 0 },
                            o: { a: 0, k: 100 },
                          },
                        ],
                        nm: "Energy Wave",
                      },
                    ],
                    ip: 0,
                    op: 120,
                    st: 0,
                    bm: 0,
                  },
                ],
              }}
              play
              style={{ width: "180px", height: "120px" }}
            />
          </div>

          <div className="container max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-indigo-800 mb-6">Analysis Results</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-xl">
                Discover the spiritual dimensions and practical wisdom in your quote.
              </p>
            </div>

            {analysisResult ? (
              <div className="grid md:grid-cols-2 gap-10">
                {/* Section 1: Quote & Interpretation */}
                <Card className="shadow-xl border-indigo-100 md:col-span-2">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-indigo-800 flex items-center gap-3 text-2xl">
                      <BookOpen className="h-6 w-6" />
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
                <Card className="shadow-xl border-indigo-100">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-indigo-800 flex items-center gap-3 text-2xl">
                      <Brain className="h-6 w-6" />
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
                <Card className="shadow-xl border-indigo-100">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-indigo-800 flex items-center gap-3 text-2xl">
                      <Heart className="h-6 w-6" />
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
                <Card className="shadow-xl border-indigo-100 md:col-span-2">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-indigo-800 flex items-center gap-3 text-2xl">
                      <Sparkles className="h-6 w-6" />
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
              <div className="text-center p-16 bg-white rounded-lg shadow-lg">
                <p className="text-gray-500 text-xl">Enter a quote and click "Analyze Quote" to see results here.</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-indigo-900 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              {/* Brand Section */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="h-6 w-6 text-yellow-400" />
                  <span className="text-xl font-bold">FaithFlow</span>
                </div>
                <p className="text-indigo-200 mb-3 text-sm">
                  Empowering spiritual growth through AI-powered analysis of sacred texts, prayers, and inspirational
                  content.
                </p>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm text-yellow-400">Global Reach</span>
                </div>
              </div>

              {/* Features Column */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <ul className="space-y-1 text-indigo-200 text-sm">
                  <li>Spiritual Sentiment Analysis</li>
                  <li>Biblical Theme Detection</li>
                  <li>Faith Insights</li>
                  <li>Spiritual Growth Guidance</li>
                </ul>
              </div>

              {/* Company Column */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Company</h3>
                <ul className="space-y-1 text-indigo-200 text-sm">
                  <li>About Us</li>
                  <li>Privacy Policy</li>
                  <li>Terms of Service</li>
                  <li>Contact</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-indigo-800 pt-6 text-center">
              <div className="mb-3">
                <p className="text-indigo-200 text-sm mb-1">Developed by</p>
                <p className="text-white font-medium">Aditya Katkar & Kanish Rawal</p>
              </div>
              <p className="text-indigo-300 text-sm">© 2025 FaithFlow. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
