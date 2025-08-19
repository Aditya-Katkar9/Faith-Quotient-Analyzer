@echo off
echo Starting Faith-Quotient Analyzer...
echo.

echo 1. Installing backend dependencies...
cd backend
pip install -r requirements.txt
echo.

echo 2. Starting backend server...
start cmd /k "cd backend && python main.py"
echo.

echo 3. Starting frontend...
cd ..
echo Please make sure you have Node.js installed
echo Run the following commands in a new terminal:
echo   cd frontend
echo   npm install
echo   npm run dev
echo.

echo Backend server is running at http://localhost:8000
echo Once frontend is started, access the application at http://localhost:3000
echo.
pause