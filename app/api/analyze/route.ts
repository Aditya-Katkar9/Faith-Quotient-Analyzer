import { type NextRequest, NextResponse } from "next/server"

interface AnalysisRequest {
  quote: string
  religion: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()
    const { quote, religion } = body

    if (!quote || quote.trim().length === 0) {
      return NextResponse.json({ error: "Quote is required" }, { status: 400 })
    }

    // Forward the request to our FastAPI backend
    const response = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quote, religion }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || "Analysis failed" },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in analyze API route:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}
