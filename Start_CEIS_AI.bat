@echo off

start cmd /k "cd /d F:\CEIS\CEIS_AI_STUDIO\CEIS_AI-Studio\backend && python -m uvicorn app.main:app --reload"

timeout /t 3 > nul

start cmd /k "cd /d F:\CEIS\CEIS_AI_STUDIO\CEIS_AI-Studio\frontend && npm run dev"

timeout /t 5 > nul

start http://localhost:5173