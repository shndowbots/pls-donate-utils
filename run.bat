@echo off

rem Checking if node.js is installed
where node.exe >nul 2>&1 && set message=true || set message=false
if exist node.msi del node.msi
if %message% == false (
    curl -o node.msi https://nodejs.org/dist/v18.12.0/node-v18.12.0-x64.msi
    if exist node.msi (
        cls
        start node.msi
        echo Install Node.js then run this file again
        pause
        exit
    ) else (
        echo fail
    )
)
if not exist node_modules\ npm i
node ./js/updater.js
if not exist tokens.json (
    echo welcome, add a roblox token to start
    pause
    goto token
)

:ui
cls
echo pls donate utils v1.1.0 by tzechco
echo.
echo option select
echo.
echo [1] transfer
echo [2] get robux amount
echo [3] setup gamepasses
echo [4] avatar changer
echo [5] token management
echo.
set /p o=
if %o% == 1 goto transfer
if %o% == 2 goto amount
if %o% == 3 goto gamepass
if %o% == 4 goto avatar
if %o% == 5 goto token
pause
goto ui

:transfer
cls
echo enter the username to transfer to
echo.
set /p name=
cls
echo enter the shirt id
echo.
set /p id=
cls
node ./js/transfer.js %name% %id%
pause
goto ui

:amount
cls
node ./js/robuxAmount.js
pause
goto ui

:gamepass
cls
echo setup gamepasses
echo.
echo enter the username or "all"
echo.
set /p name=
if %name% == all (
    node ./js/all.js gamepass
) else (
    node ./js/gamepass.js %name%
)
pause
goto ui

:avatar
cls
echo avatar changer
echo.
echo enter the username or "all"
echo.
set /p name=
cls
echo enter user to copy
echo.
set /p copy=
cls
if %name% == all (
    node ./js/all.js avatar %copy%
) else (
    node ./js/avatar.js %name% %copy%
)
pause
goto ui


:token
cls
echo add/remove token
echo.
echo [1] add
echo [2] import from roblox account manager
echo [3] remove
echo [4] list
echo.
set /p top=
if %top% == 1 goto addtoken
if %top% == 2 goto import
if %top% == 3 goto removetoken
if %top% == 4 goto listtoken
pause
goto ui

:addtoken
cls
echo enter your roblox token inside of ""
set /p token=
cls
node ./js/addToken.js %token%
pause
goto ui

:import
cls
node ./js/import.js
pause
goto ui

:removetoken
cls
echo enter the username or "all"
set /p name=
if %name% == all (
    del tokens.json
) else (
    node ./js/removeToken.js %name%
)
pause
goto ui

:listtoken
cls
node ./js/tokenList.js
pause
goto ui

:end
pause
