import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def analyze_quote(quote: str, religion: str):
    """
    Analyze a religious quote using Google's Gemini API with optimized token usage
    """
    try:
        # Configure the model - using gemini-1.5-flash for free tier compatibility
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Construct the prompt - optimized for minimal token usage
        prompt = f"""
        Analyze this {religion} quote concisely: "{quote}"
        
        Format your response as JSON with these exact fields:
        1. section1: Show original quote and 2-3 line translation/interpretation
        2. section2: Two tables:
           - table1: MUST be an array with exactly one object containing keys PS, NS, PM, NM (each with ✅/❌ + 1-line justification)
           - table2: Emotional mapping with columns: Moral, Spiritual, Mental, Practical (1-line each or ❌)
        3. section3: Primary zone (PS/NS/PM/NM), Secondary zone (or ❌), and max 4-line summary
        
        Example for table1 format:
        "table1": [
          {
            "PS": "✅ Promotes spiritual growth",
            "NS": "❌ No negative spiritual elements",
            "PM": "✅ Encourages practical action",
            "NM": "❌ No materialistic focus"
          }
        ]
        
        Keep all explanations extremely concise (1-2 lines max per item).
        Return only valid JSON.
        """
        
        # Generate response with minimal safety settings for token efficiency
        safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_ONLY_HIGH"
            }
        ]
        
        generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 1024,
        }
        
        response = model.generate_content(
            prompt,
            generation_config=generation_config,
            safety_settings=safety_settings
        )
        
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