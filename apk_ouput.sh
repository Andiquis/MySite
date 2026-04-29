#!/bin/bash

# ==========================================
# Script Automático: Build Dist y APK
# Proyecto: MySite (Capacitor + docs)
# ==========================================

set -u

# Rutas principales del proyecto
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR"
WEB_DIR="$PROJECT_ROOT/docs"
ANDROID_DIR="$PROJECT_ROOT/android"
APK_PATH="$ANDROID_DIR/app/build/outputs/apk/debug/app-debug.apk"

# Configuración del entorno de Android (Adaptado a tu sistema local)
export ANDROID_HOME="/home/andi/Android/Sdk"
export JAVA_HOME="/home/andi/Descargas/android-studio/jbr"
export CAPACITOR_ANDROID_STUDIO_PATH="/home/andi/Descargas/android-studio/bin/studio.sh"

export PATH="$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$JAVA_HOME/bin"

fail() {
    echo "❌ Error: $1"
    exit 1
}

echo "======================================="
echo "🚀 INICIANDO BUILD DE APK"
echo "======================================="
echo "- Proyecto: $PROJECT_ROOT"
echo "- Web dir:  $WEB_DIR"
echo "- Android:  $ANDROID_DIR"

if [ ! -d "$WEB_DIR" ]; then
    fail "No existe la carpeta web '$WEB_DIR'. Revisa capacitor.config.json."
fi

if [ ! -f "$WEB_DIR/index.html" ]; then
    fail "No se encontró '$WEB_DIR/index.html'. Capacitor necesita un index.html para empaquetar."
fi

if [ ! -d "$ANDROID_DIR" ]; then
    fail "No existe la carpeta Android '$ANDROID_DIR'. Ejecuta 'npx cap add android' si todavía no fue creada."
fi

# Paso 1: Preparar archivos web
echo ""
echo "1. Verificando archivos web..."

if [ -f "$PROJECT_ROOT/package.json" ] && command -v pnpm >/dev/null 2>&1; then
    if pnpm --dir "$PROJECT_ROOT" run | grep -q "^  build"; then
        echo "Se encontró script 'build'. Compilando antes de sincronizar..."
        pnpm --dir "$PROJECT_ROOT" run build || fail "Falló la compilación del proyecto."
    else
        echo "No hay script 'build' en package.json. Se usará directamente la carpeta docs/."
    fi
else
    echo "No se ejecuta build. Se usará directamente la carpeta docs/."
fi
echo "✅ Archivos web listos."

# Paso 2: Copiar archivos web al proyecto nativo
echo ""
echo "2. Sincronizando código web con aplicación Capacitor Android..."
cd "$PROJECT_ROOT" || exit

if ! command -v npx >/dev/null 2>&1; then
    fail "La herramienta 'npx' no está instalada o no está en el PATH."
fi

npx cap sync android || fail "La sincronización web a nativo con Capacitor ha fallado."
echo "✅ Sincronización exitosa."

# Paso 3: Generar Instalador final del telefono
echo ""
echo "3. Generando el archivo fuente APK con Gradle..."
cd "$ANDROID_DIR" || exit

if [ ! -x "./gradlew" ]; then
    fail "No se puede ejecutar '$ANDROID_DIR/gradlew'. Dale permisos con: chmod +x $ANDROID_DIR/gradlew"
fi

./gradlew assembleDebug || fail "El motor Gradle no pudo ensamblar y firmar el APK. Revisa los logs de arriba."

if [ ! -f "$APK_PATH" ]; then
    fail "Gradle terminó, pero no se encontró el APK esperado en '$APK_PATH'."
fi
echo "✅ APK generado exitosamente."

# Paso 4: Instalar el APK en el dispositivo conectado
echo ""
echo "4. Instalando el APK en el dispositivo conectado..."

# Verificar si adb está disponible
if ! command -v adb >/dev/null 2>&1; then
    echo "❌ Error: La herramienta 'adb' no está instalada o no está en el PATH."
    echo "👉 Solución: Asegúrate de que el SDK de Android esté correctamente configurado y que 'platform-tools' esté en el PATH."
    echo "El APK se encuentra en: $APK_PATH"
    exit 1
fi

# Verificar si hay un dispositivo conectado
DEVICE_CONNECTED=$(adb devices | grep -w "device" | wc -l | tr -d ' ')
if [ "$DEVICE_CONNECTED" -eq 0 ]; then
    echo "❌ Error: No se detectó ningún dispositivo conectado con depuración USB habilitada."
    echo "👉 Solución: Conecta un dispositivo Android y habilita la depuración USB en las opciones de desarrollador."
    echo "El APK se encuentra en: $APK_PATH"
    exit 1
fi

# Intentar instalar el APK
adb install -r "$APK_PATH" || {
    echo "❌ Error: No se pudo instalar el APK en el dispositivo. Verifica los permisos y el estado del dispositivo."
    echo "El APK se encuentra en: $APK_PATH"
    exit 1
}

echo "✅ APK instalado exitosamente en el dispositivo."

# Debug final
echo "======================================="
echo "🔍 DEBUG FINAL"
echo "- Herramienta adb: $(command -v adb)"
echo "- Dispositivos conectados: $(adb devices | grep -w 'device')"
echo "- Ruta del APK: $APK_PATH"
echo "======================================="

echo ""
echo "======================================="
echo "🎉 ¡BUILD E INSTALADOR COMPLETADOS CON ÉXITO!"
echo "======================================="
echo "Tu archivo APK listo para pruebas en Android se encuentra aquí:"
echo "👉 $APK_PATH"
echo "======================================="
echo ""
