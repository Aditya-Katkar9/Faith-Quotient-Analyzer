import { type NextRequest, NextResponse } from "next/server"

interface AnalysisRequest {
  quote: string
}

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

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    const { quote } = body

    if (!quote || quote.trim().length === 0) {
      return NextResponse.json({ error: "Quote is required" }, { status: 400 })
    }

    // Simulate API processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const defaultSensitivity = 0.7

    // Mock analysis - in real implementation, this would call external AI service
    const mockAnalysis: AnalysisResult = {
      sentiment: calculateSentiment(quote, defaultSensitivity),
      spiritualThemes: extractThemes(quote),
      emotions: extractEmotions(quote),
      keywords: extractKeywords(quote),
      recommendations: generateRecommendations(quote),
      quadrant: {
        spiritual: calculateSpiritualScore(quote),
        material: calculateMaterialScore(quote),
        positive: Math.max(0, calculateSentiment(quote, defaultSensitivity)),
        negative: Math.max(0, 1 - calculateSentiment(quote, defaultSensitivity)),
      },
    }

    return NextResponse.json(mockAnalysis)
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze quote" }, { status: 500 })
  }
}

// Mock analysis functions - replace with actual AI service calls
function calculateSentiment(quote: string, sensitivity: number): number {
  const positiveWords = [
    "love",
    "peace",
    "joy",
    "hope",
    "light",
    "blessed",
    "grateful",
    "beautiful",
    "wonderful",
    "amazing",
  ]
  const negativeWords = ["hate", "fear", "dark", "pain", "suffering", "lost", "broken", "sad", "angry", "despair"]

  let score = 0.5 // neutral baseline
  const words = quote.toLowerCase().split(/\s+/)

  words.forEach((word) => {
    if (positiveWords.includes(word)) score += 0.1 * sensitivity
    if (negativeWords.includes(word)) score -= 0.1 * sensitivity
  })

  return Math.max(0, Math.min(1, score))
}

function calculateSpiritualScore(quote: string): number {
  const spiritualWords = ["god", "faith", "spirit", "soul", "divine", "prayer", "sacred", "holy", "blessed", "grace"]
  const words = quote.toLowerCase().split(/\s+/)
  const spiritualCount = words.filter((word) => spiritualWords.includes(word)).length
  return Math.min(1, spiritualCount * 0.2 + 0.3)
}

function calculateMaterialScore(quote: string): number {
  const materialWords = [
    "money",
    "wealth",
    "success",
    "career",
    "business",
    "profit",
    "material",
    "physical",
    "worldly",
  ]
  const words = quote.toLowerCase().split(/\s+/)
  const materialCount = words.filter((word) => materialWords.includes(word)).length
  return Math.min(1, materialCount * 0.2 + 0.1)
}

function extractKeywords(quote: string): string[] {
  const importantWords = quote
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 4)
    .filter((word) => !["that", "this", "with", "from", "they", "have", "will", "been", "were"].includes(word))
    .slice(0, 5)
  return importantWords
}

function extractThemes(quote: string): string[] {
  const themes = ["Spiritual Growth", "Inner Peace", "Divine Love", "Faith Journey", "Wisdom"]
  return themes.slice(0, 3)
}

function extractEmotions(quote: string): string[] {
  const emotions = ["Peaceful", "Hopeful", "Contemplative", "Inspired", "Grateful"]
  return emotions.slice(0, 3)
}

function generateRecommendations(quote: string): string[] {
  return [
    "Reflect on this message during quiet meditation",
    "Journal about how this wisdom applies to your current life situation",
    "Share this insight with others who might benefit from its message",
  ]
}
