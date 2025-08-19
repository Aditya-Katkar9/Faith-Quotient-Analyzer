Write-Host "Starting Faith-Quotient Analyzer..." -ForegroundColor Green

# Check if .env file exists in backend directory
$envPath = ".\backend\.env"
if (-Not (Test-Path $envPath)) {
    Write-Host "ERROR: .env file not found in backend directory." -ForegroundColor Red
    Write-Host "Please create a .env file with your GEMINI_API_KEY." -ForegroundColor Yellow
    Write-Host "Example: GEMINI_API_KEY=your_api_key_here" -ForegroundColor Yellow
    pause
    exit
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Cyan
Set-Location -Path ".\backend"
pip install -r requirements.txt

# Start backend server
Write-Host "`nStarting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$(Get-Location)'; python main.py"

# Return to root directory
Set-Location -Path ".."

# Instructions for frontend
Write-Host "`nTo start the frontend:" -ForegroundColor Yellow
Write-Host "1. Open a new terminal" -ForegroundColor Yellow
Write-Host "2. Navigate to the project root directory" -ForegroundColor Yellow
Write-Host "3. Run the following commands:" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White

Write-Host "`nBackend server is running at http://localhost:8000" -ForegroundColor Green
Write-Host "Once frontend is started, access the application at http://localhost:3000" -ForegroundColor Green