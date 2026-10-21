    // =========================================
    // MOTOR PRINCIPAL DE LA EXTENSIÓN
    // =========================================

    function runExtension() {
        const esIncognito = chrome.extension.inIncognitoContext;

        if (esIncognito) {
            initAutoLogin();
            initAutoRedirect();
            initAdBlocker();
            initCalculadoraNotas();
            initCourseFilter();
            initMonitorTareas();
            initGuardianSesion();
            initOverhaulMinimalista();
            initVistaPreviaModal();
            initVistaActividadInline();
            initDashboardInteligente();
            initHorarioInteractivo();
            return;
        }

        chrome.storage.local.get([
            'extensionEnabled',
            'vistaCursosActivada',
            'vistaMinimalistaActivada',
            'autoLoginEnabled',
            'adBlockerEnabled',
            'dashboardEnabled'
        ], (result) => {
            if (result.extensionEnabled === false) return;
            
            if (result.autoLoginEnabled !== false) initAutoLogin();
            if (result.dashboardEnabled !== false) initDashboardInteligente();

            initAutoRedirect();
            initCalculadoraNotas();
            initMonitorTareas();
            initGuardianSesion();
            initVistaPreviaModal();
            initVistaActividadInline();
            initHorarioInteractivo();


            if (result.adBlockerEnabled !== false) {
                initAdBlocker();
            } else {
                document.body.classList.add('modal-open');
            }

            if (result.vistaCursosActivada !== false) {
                initCourseFilter();
            } else {
                const cssCursos = document.getElementById('css-limpieza-cursos');
                if (cssCursos) cssCursos.remove();
            }

            if (result.vistaMinimalistaActivada !== false) {
                initOverhaulMinimalista();
            } else {
                const cssMin = document.getElementById('usat-overhaul-minimalista');
                if (cssMin) cssMin.remove();
            }
        });
    }

    chrome.storage.onChanged.addListener((changes, area) => {
        if (area !== 'local') return;

        if (changes.vistaMinimalistaActivada) {
            const activado = changes.vistaMinimalistaActivada.newValue;
            const estiloActual = document.getElementById('usat-overhaul-minimalista');

            if (activado !== false) {
                initOverhaulMinimalista();
            } else if (estiloActual) {
                estiloActual.remove();
            }
        }

        if (changes.vistaCursosActivada) {
            const activado = changes.vistaCursosActivada.newValue;
            const cssCursos = document.getElementById('css-limpieza-cursos');

            if (activado !== false) {
                initCourseFilter();
            } else if (cssCursos) {
                cssCursos.remove();
            }
        }
    });

    runExtension();
