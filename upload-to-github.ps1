# Quick GitHub Upload Script

Write-Host "🚀 MOPONS - GitHub Upload Script" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "Step 1: Initialize Git Repository" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan

# Initialize git
git init
Write-Host "✅ Git repository initialized" -ForegroundColor Green

# Add all files
Write-Host ""
Write-Host "Step 2: Adding files to Git" -ForegroundColor Cyan
Write-Host "----------------------------" -ForegroundColor Cyan
git add .
Write-Host "✅ Files added to staging" -ForegroundColor Green

# Commit
Write-Host ""
Write-Host "Step 3: Creating initial commit" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
git commit -m "Initial commit - MOPONS coupon marketplace with OCR"
Write-Host "✅ Initial commit created" -ForegroundColor Green

Write-Host ""
Write-Host "===================================" -ForegroundColor Green
Write-Host "✅ Git repository is ready!" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create a new repository on GitHub:" -ForegroundColor White
Write-Host "   👉 Go to: https://github.com/new" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. After creating the repository, run these commands:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/mopons.git" -ForegroundColor Cyan
Write-Host "   git branch -M main" -ForegroundColor Cyan
Write-Host "   git push -u origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. For deployment instructions, see:" -ForegroundColor White
Write-Host "   📄 DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

Read-Host "Press Enter to exit"
