# Faith-Quotient Analyzer 🕉️

Welcome to the **Faith-Quotient Analyzer**, a full-stack application designed to explore the depths of religious and philosophical wisdom. Using the power of Google's Gemini AI, this tool provides profound spiritual insights, sentiment analysis, and thematic interpretations of quotes and passages.


---

## 🚀 Live Demo

Here is a quick demonstration of the Faith-Quotient Analyzer in action.

![Faith-Quotient Analyzer Demo](./assets/Output-ezgif.com-video-to-gif-converter.gif)

---

## 📸 Screenshots

Here’s a sneak peek into the application's interface:

| Landing Page | Features Section |
| :---: | :---: |
| *Transform Your Spiritual Journey* | *Spiritual Analysis Features* |
| ![Landing page of the application](./assets/WhatsApp%20Image%202025-08-28%20at%209.09.38%20PM.jpeg) | ![Features section of the application](./assets/WhatsApp%20Image%202025-08-28%20at%209.09.42%20PM.jpeg) |

| Quote Analysis Page | Footer |
| :---: | :---: |
| *The main quote analysis interface* | *Application Footer* |
| ![Quote analysis interface](./assets/WhatsApp%20Image%202025-08-28%20at%209.09.46%20PM.jpeg) | ![Footer of the application](./assets/WhatsApp%20Image%202025-08-28%20at%209.09.49%20PM.jpeg) |

---

## ✨ Features

Our application offers a rich set of features to guide your spiritual journey:

* **AI-Powered Quote Analysis**: Leverages the advanced capabilities of the Gemini API for deep, contextual analysis.
* **Sentiment Analysis**: Understand the emotional and spiritual tone of sacred texts, prayers, and inspirational quotes.
* **Thematic Interpretation**: Identify and explore the core spiritual themes, biblical concepts, and theological insights within your text.
* **Religion-Specific Context**: Provides more accurate and nuanced analysis by considering the specific religious background of a quote.
* **Modern & Responsive UI**: A clean, intuitive, and mobile-friendly user interface built with Next.js and Tailwind CSS.
* **Efficient Caching**: Caches previously analyzed quotes to deliver faster results and improve performance.

---

## 🛠️ Technologies Used

This project is built with a modern, full-stack technology set:

* **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
* **Backend**: Python, FastAPI, SQLAlchemy, SQLite
* **AI**: Google Gemini API

---

## ⚙️ Setup and Installation

To get the project up and running on your local machine, follow these simple steps.

### Prerequisites

* Node.js (v18.0 or higher)
* Python (v3.8 or higher)
* A valid API key for the Google Gemini API

### Frontend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/faith-quotient-analyzer.git](https://github.com/your-username/faith-quotient-analyzer.git)
    cd faith-quotient-analyzer
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install Python dependencies:**
    ```bash
    pip install fastapi uvicorn sqlalchemy google-generativeai python-dotenv
    ```

3.  **Configure API Keys:**
    * Rename the `.env.example` file to `.env`.
    * Add your Google Gemini API key to the `.env` file:
        ```
        GEMINI_API_KEY="YOUR_API_KEY_HERE"
        ```

4.  **Run the backend server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend API will be running at `http://localhost:8000`.

---

## 📄 API Endpoints

The primary API endpoint for the application is:

* `POST /analyze`
    * **Description**: Analyzes a given quote with optional religious context.
    * **Request Body**:
        ```json
        {
          "quote": "<The text of the quote to be analyzed>",
          "religion": "<Optional: The name of the religion for context>"
        }
        ```
    * **Response**: A structured JSON object containing the detailed analysis.

---

