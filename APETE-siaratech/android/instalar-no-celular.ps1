param([string]$Serial, [string]$ApkPath = "$PSScriptRoot\app\build\outputs\apk\debug\app-debug.apk")
$ErrorActionPreference = 'Stop'
$adbCommand = Get-Command adb -ErrorAction SilentlyContinue
$adbPath = if ($adbCommand) { $adbCommand.Source } elseif ($env:ANDROID_HOME) { Join-Path $env:ANDROID_HOME 'platform-tools\adb.exe' } else { Join-Path $PSScriptRoot '..\..\..\android-tools\sdk\platform-tools\adb.exe' }
if (-not (Test-Path -LiteralPath $adbPath)) { throw 'ADB não encontrado. Configure ANDROID_HOME para o Android SDK.' }
if (-not (Test-Path -LiteralPath $ApkPath)) { throw 'APK não encontrado. Construa com gradlew.bat assembleDebug primeiro.' }
$devices = & $adbPath devices
$authorized = @($devices | Where-Object { $_ -match '^\S+\s+device$' } | ForEach-Object { ($_ -split '\s+')[0] })
if (-not $Serial) {
    if ($authorized.Count -ne 1) { throw 'Conecte um único celular com depuração USB autorizada, ou informe -Serial.' }
    $Serial = $authorized[0]
}
if ($Serial -notin $authorized) { throw 'O aparelho informado não está conectado e autorizado. Confira a tela do celular.' }
& $adbPath -s $Serial install -r $ApkPath
if ($LASTEXITCODE -ne 0) { throw 'A instalação não foi concluída.' }
Write-Host 'APETÊ instalado. Abra o aplicativo no celular.'
