# Faith-Quotient Analyzer

A full-stack application that analyzes religious and philosophical quotes using AI to provide spiritual insights, sentiment analysis, and thematic interpretation.

## Project Structure

- **Frontend**: Next.js application with a modern UI for quote input and analysis display
- **Backend**: Python FastAPI service that processes quotes using AI and caches results

## Features

- Quote analysis using PASSIONIT PRUTL framework
- Religion-specific context for more accurate analysis
- Caching of analyzed quotes for improved performance
- Structured output with interpretation, sentiment analysis, and conclusions
- Modern, responsive UI with styled result sections

## Setup Instructions

### Prerequisites

- Node.js (for frontend)
- Python 3.8+ (for backend)
- API key for Gemini

### Frontend Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install Python dependencies:
   ```
   pip install fastapi uvicorn sqlalchemy google-generativeai python-dotenv
   ```

3. Configure API keys:
   - Rename `.env.example` to `.env`
   - Add your Gemini API key to the `.env` file

4. Run the backend server:
   ```
   uvicorn main:app --reload
   ```
   Or use the provided batch file:
   ```
   run.bat
   ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter a religious or philosophical quote in the input field
3. Select the relevant religion from the dropdown (optional)
4. Click "Analyze Quote" to process the input
5. View the structured analysis results in the designated sections

## API Endpoints

- `POST /analyze`: Analyzes a quote with optional religion context
  - Request body: `{ "quote": "<quote_text>", "religion": "<religion_name>" }`
  - Response: Structured analysis in JSON format

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui components
- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **AI**: Google Gemini API

## License

MIT