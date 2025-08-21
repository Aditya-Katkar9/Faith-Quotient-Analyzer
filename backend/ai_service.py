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
        
        Format your response as a single, valid JSON object with these exact fields:
        1.  "section1": A single HTML string. It MUST contain a `<blockquote>` element for the original quote and a `<p>` element for the 2-3 line interpretation.
        2.  "section2": An object containing two fields: "table1" and "table2".
            - "table1": MUST be an array with exactly one object. This object must have keys "PS", "NS", "PM", and "NM". The values for each key must be a string starting with an emoji (✅ or ❌) followed by a 1-line justification.
            - "table2": MUST be an array with exactly one object, mapping emotional aspects. This object must have keys "Moral", "Spiritual", "Mental", and "Practical". The values should be a concise 1-line explanation or a ❌ emoji.
        3.  "section3": A single HTML string. It MUST contain `<h4>` tags for "Primary Zone" and "Secondary Zone", and a `<p>` tag for the final 4-line (max) summary. Crucially, if the quote is from a major religious scripture (e.g., Bible, Quran, Bhagavad Gita), the summary must begin by identifying the source (book, chapter, verse).

        Example for "table1" format:
        "table1": [
          {{
            "PS": "✅ Promotes spiritual growth by emphasizing...",
            "NS": "❌ Does not contain negative spiritual elements because...",
            "PM": "✅ Encourages practical, positive actions through...",
            "NM": "❌ Avoids focus on materialistic loss or gain."
          }}
        ]

        Example for "section3" format:
        "section3": "<h4>Primary Zone</h4><p>Positive Soul (PS)</p><h4>Secondary Zone</h4><p>Positive Materialism (PM)</p><p>This quote primarily focuses on spiritual growth and encourages positive actions in the material world, aligning with a constructive and hopeful worldview.</p>"

        Ensure all explanations are extremely concise. Return only the raw JSON object, without any markdown formatting like ```json.
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