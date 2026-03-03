@echo off
chcp 65001 >nul
echo [1/2] 正在下載台股清單...
powershell -Command "Invoke-WebRequest -Uri 'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL' -Headers @{'Accept'='application/json'} -OutFile 'src\data\tw_stocks.json'"
if errorlevel 1 (
    echo [ERROR] 下載失敗，請確認網路連線後重試
    pause
    exit /b 1
)

echo [2/2] 精簡 JSON（只保留 Date/Code/Name）...
powershell -Command "(Get-Content 'src\data\tw_stocks.json' -Raw | ConvertFrom-Json) | Select-Object Date, Code, Name | ConvertTo-Json -Compress | Set-Content 'src\data\tw_stocks.json' -Encoding UTF8"
if errorlevel 1 (
    echo [ERROR] JSON 處理失敗
    pause
    exit /b 1
)

echo.
echo 完成！台股清單已更新至 src\data\tw_stocks.json
pause
