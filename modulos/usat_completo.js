// =========================================
// MOTOR PRINCIPAL DE LA EXTENSIÓN (main.js)
// =========================================

function runExtension() {
    // Usamos window.chrome por seguridad (conectando con el emulador del módulo 00)
    const esIncognito = (window.chrome && window.chrome.extension && window.chrome.extension.inIncognitoContext) ? true : false;

    if (esIncognito) {
        if (window.initAutoLogin) window.initAutoLogin();
        if (window.initAutoRedirect) window.initAutoRedirect();
        if (window.initAdBlocker) window.initAdBlocker();
        if (window.initCalculadoraNotas) window.initCalculadoraNotas();
        if (window.initCourseFilter) window.initCourseFilter();
        if (window.initMonitorTareas) window.initMonitorTareas();
        if (window.initGuardianSesion) window.initGuardianSesion();
        if (window.initOverhaulMinimalista) window.initOverhaulMinimalista();
        if (window.initVistaPreviaModal) window.initVistaPreviaModal();
        if (window.initVistaActividadInline) window.initVistaActividadInline();
        if (window.initDashboardInteligente) window.initDashboardInteligente();
        if (window.initHorarioInteractivo) window.initHorarioInteractivo();
        return;
    }

    if (window.chrome && window.chrome.storage && window.chrome.storage.local) {
        window.chrome.storage.local.get([
            'extensionEnabled',
            'vistaCursosActivada',
            'vistaMinimalistaActivada',
            'autoLoginEnabled',
            'adBlockerEnabled',
            'dashboardEnabled'
        ], (result) => {
            if (result.extensionEnabled === false) return;
            
            if (result.autoLoginEnabled !== false && window.initAutoLogin) window.initAutoLogin();
            if (result.dashboardEnabled !== false && window.initDashboardInteligente) window.initDashboardInteligente();

            if (window.initAutoRedirect) window.initAutoRedirect();
            if (window.initCalculadoraNotas) window.initCalculadoraNotas();
            if (window.initMonitorTareas) window.initMonitorTareas();
            if (window.initGuardianSesion) window.initGuardianSesion();
            if (window.initVistaPreviaModal) window.initVistaPreviaModal();
            if (window.initVistaActividadInline) window.initVistaActividadInline();
            if (window.initHorarioInteractivo) window.initHorarioInteractivo();

            if (result.adBlockerEnabled !== false) {
                if (window.initAdBlocker) window.initAdBlocker();
            } else {
                document.body.classList.add('modal-open');
            }

            if (result.vistaCursosActivada !== false) {
                if (window.initCourseFilter) window.initCourseFilter();
            } else {
                const cssCursos = document.getElementById('css-limpieza-cursos');
                if (cssCursos) cssCursos.remove();
            }

            if (result.vistaMinimalistaActivada !== false) {
                if (window.initOverhaulMinimalista) window.initOverhaulMinimalista();
            } else {
                const cssMin = document.getElementById('usat-overhaul-minimalista');
                if (cssMin) cssMin.remove();
            }
        });
    }
}

// Validación de seguridad para los listeners
if (typeof window.chrome !== 'undefined' && window.chrome.storage && window.chrome.storage.onChanged) {
    window.chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local') return;

        if (changes.vistaMinimalistaActivada) {
            const activado = changes.vistaMinimalistaActivada.newValue;
            const estiloActual = document.getElementById('usat-overhaul-minimalista');

            if (activado !== false) {
                if (window.initOverhaulMinimalista) window.initOverhaulMinimalista();
            } else if (estiloActual) {
                estiloActual.remove();
            }
        }

        if (changes.vistaCursosActivada) {
            const activado = changes.vistaCursosActivada.newValue;
            const cssCursos = document.getElementById('css-limpieza-cursos');

            if (activado !== false) {
                if (window.initCourseFilter) window.initCourseFilter();
            } else if (cssCursos) {
                cssCursos.remove();
            }
        }
    });
}


setTimeout(() => {
    console.log("[Campus-Usat Plus] Iniciando ...");
    runExtension();
}, 150);
