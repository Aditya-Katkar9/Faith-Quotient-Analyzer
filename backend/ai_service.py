import os
import json
import google.generativeai as genai
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def analyze_quote_with_gemini(quote: str, religion: str):
    """
    Analyze a religious quote using Google's Gemini API
    """
    try:
        # Configure the model
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Construct the prompt
        prompt = f"""
        You are an expert in spiritual and philosophical text interpretation. 
        You will be given a quote, which can be in ANY language and from ANY religious or philosophical book. 
        Your task is to analyze it strictly in the following format: 

        Section 1: Input Quote & Interpretation 
        - Show the exact input quote. 
        - Provide a short interpretation (meaning + context of the quote, in simple language). 

        Section 2: PASSIONIT PRUTL Sentiment Analysis + Emotional Mapping 
        - Table 1 (PASSIONIT PRUTL Analysis): 
          Columns = Positive Soul (PS), Negative Soul (NS), Positive Materialism (PM), Negative Materialism (NM). 
          For each column: mark ✅ if present, ❌ if absent. Add a one-line justification. 
        - Table 2 (Emotional & Philosophical Mapping): 
          Columns = Moral Discipline, Spiritual Alignment, Mental Well-being, Practical Challenge. 
          Fill each with a short explanation (how the quote relates to it, or ❌ if absent). 

        Section 3: Final Classification & Conclusion 
        - Identify the Primary Zone (PS, NS, PM, or NM). 
        - Identify any Secondary Zone (if applicable, otherwise ❌). 
        - Provide a short concluding note about what this quote teaches about life, values, or philosophy. 

        ⚠️ Rules: 
        - Always preserve the 3-section structure. 
        - Always mark ❌ explicitly where something is absent. 
        - Keep explanations short, clear, and meaningful. 
        - The quote may be in any language – translate/interpret internally before analysis, but always display the original quote. 
        
        Quote to analyze: "{quote}"
        Religion/Tradition: {religion}
        
        Return your analysis in JSON format with the following structure:
        {{
            "section1": "...",
            "section2": {{
                "table1": [...],
                "table2": [...]
            }},
            "section3": "..."
        }}
        """
        
        # Generate response
        response = model.generate_content(prompt)
        
        # Extract and parse JSON from the response
        response_text = response.text
        
        # Find JSON content (handling potential markdown code blocks)
        if "```json" in response_text:
            json_content = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            json_content = response_text.split("```")[1].split("```")[0].strip()
        else:
            json_content = response_text.strip()
        
        # Parse JSON
        analysis = json.loads(json_content)
        
        return {
            "quote": quote,
            "religion": religion,
            "analysis": analysis
        }
        
    except Exception as e:
        print(f"Error in Gemini API call: {str(e)}")
        return None


# Fallback to OpenAI if Gemini is not available
def analyze_quote_with_openai(quote: str, religion: str):
    """
    Fallback function to analyze a religious quote using OpenAI API
    """
    try:
        # This is a placeholder for OpenAI implementation
        # In a real implementation, you would use the OpenAI API here
        print("Gemini API not available, would use OpenAI as fallback")
        return None
    except Exception as e:
        print(f"Error in OpenAI API call: {str(e)}")
        return None


def analyze_quote(quote: str, religion: str):
    """
    Main function to analyze a quote, trying Gemini first and falling back to OpenAI
    """
    if GEMINI_API_KEY:
        result = analyze_quote_with_gemini(quote, religion)
        if result:
            return result
    
    # Fallback to OpenAI or other implementation
    return analyze_quote_with_openai(quote, religion)