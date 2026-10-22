// =========================================
// MÓDULO 8: DASHBOARD INTELIGENTE (Accesos Principales)
// =========================================
function initDashboardInteligente() {
    if (!window.location.href.includes('Main.aspx')) return;

    // 1. Ocultar el anuncio gigante
    const anuncioGigante = document.getElementById('anuncio');
    if (!anuncioGigante) return;

    const contenedorPadre = anuncioGigante.closest('.panel') || anuncioGigante.parentElement;
    contenedorPadre.style.display = 'none';

    if (document.getElementById('usat-dashboard-accesos')) return;

    // 2. Inyectar estilos principales del Dashboard (Incluye CSS Grid)
    const style = document.createElement('style');
    style.textContent = `
        #usat-dashboard-accesos {
            background: #ffffff !important;
            border-radius: 6px !important;
            border: 1px solid #e5e7eb !important;
            margin-top: 12px !important; 
            margin-bottom: 20px !important;
            overflow: hidden !important;
        }
        .usat-btn-dash {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 14px 16px !important;
            background-color: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            text-decoration: none !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05) !important;
            height: 50px !important;
            width: 100% !important;
            box-sizing: border-box !important;
            outline: none !important;
        }
        .usat-btn-dash:hover {
            border-color: #dc2626 !important;
            box-shadow: inset 4px 0 0 0 #dc2626, 0 4px 6px -1px rgba(0,0,0,0.1) !important;
        }
        .usat-btn-dash svg, .usat-btn-dash span {
            pointer-events: none !important; 
        }
        .usat-btn-dash svg {
            width: 22px !important;
            height: 22px !important;
            min-width: 22px !important;
            flex-shrink: 0 !important;
            stroke: #475569 !important;
            transition: stroke 0.2s ease !important;
            display: block !important;
        }
        .usat-btn-dash span {
            color: #475569 !important;
            font-size: 13.5px !important;
            font-weight: 600 !important;
            font-family: Arial, sans-serif !important;
            transition: color 0.2s ease !important;
            white-space: nowrap !important;
            margin: 0 !important;
        }
        .usat-btn-dash:hover span { color: #dc2626 !important; }
        .usat-btn-dash:hover svg { stroke: #dc2626 !important; }
    `;
    document.head.appendChild(style);

    // 3. HTML con CSS Grid (2 columnas)
    const dashboardHtml = `
        <div id="usat-dashboard-accesos">
            <div style="background-color: #E33439; padding: 12px 20px;">
                <h3 style="margin: 0; color: white; font-size: 15px; font-weight: 600; font-family: Arial, sans-serif;">Accesos principales</h3>
            </div>
            <div style="padding: 20px; background: #f8fafc;">
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">

                    <a href="#" id="usat-btn-ficha" class="usat-btn-dash">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        <span>Ficha de matrícula</span>
                    </a>

                    <a href="#" id="usat-btn-historial" class="usat-btn-dash">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        <span>Historial académico</span>
                    </a>

                    <a href="#" id="usat-btn-aula-nativa" class="usat-btn-dash">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                        <span>Aula virtual</span>
                    </a>

                    <a href="#" id="usat-btn-mis-cursos" class="usat-btn-dash">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                        <span>Mis cursos</span>
                    </a>

                    <a href="#" id="usat-btn-notas" class="usat-btn-dash">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        <span>Calificaciones</span>
                    </a>

                    <a href="#" id="usat-btn-carnet" class="usat-btn-dash">
                        <svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><circle cx="9" cy="11" r="3"></circle><line x1="15" y1="9" x2="19" y2="9"></line><line x1="15" y1="13" x2="19" y2="13"></line><line x1="7" y1="17" x2="17" y2="17"></line></svg>
                        <span>Mostrar carnet</span>
                    </a>

                </div>
            </div>
        </div>
    `;

    contenedorPadre.insertAdjacentHTML('beforebegin', dashboardHtml);

    function ejecutarMenuNativo(nombreArchivo) {
        const enlacesMenu = document.querySelectorAll('a');
        for (let a of enlacesMenu) {
            if (a.getAttribute('onclick') && a.getAttribute('onclick').includes(nombreArchivo)) {
                a.click();
                return true;
            }
        }
        return false;
    }

    document.getElementById('usat-btn-ficha').addEventListener('click', (e) => { e.preventDefault(); ejecutarMenuNativo('cursosmatriculados.aspx'); });
    document.getElementById('usat-btn-historial').addEventListener('click', (e) => { e.preventDefault(); ejecutarMenuNativo('historialacademico.aspx'); });
    document.getElementById('usat-btn-aula-nativa').addEventListener('click', (e) => { e.preventDefault(); ejecutarMenuNativo('aulavirtual.aspx'); });
    document.getElementById('usat-btn-notas').addEventListener('click', (e) => { e.preventDefault(); ejecutarMenuNativo('calificadorestudiante.aspx'); });

    // Carnet
    // Carnet
    document.getElementById('usat-btn-carnet').addEventListener('click', (e) => {
        e.preventDefault();
        ejecutarMenuNativo('cursosmatriculados.aspx');
        let intentos = 0;
        const sabueso = setInterval(() => {
            intentos++;
            const boton = document.querySelector('#divCarnet a[title*="VISUALIZAR CARNET"]');
            
            if (!boton) {
                if (intentos >= 30) {
                    clearInterval(sabueso);
                }
                return;
            }
            
            clearInterval(sabueso);
            
            // Como estamos en el entorno MAIN de la web, extraemos y ejecutamos su función nativa directamente
            const href = boton.getAttribute('href');
            if (href && href.toLowerCase().startsWith('javascript:')) {
                // Ejecutamos el código JavaScript de la USAT
                const codigoNativo = href.replace(/javascript:/i, '');
                
                // Creamos un script temporal para ejecutarlo limpiamente
                const tempScript = document.createElement('script');
                tempScript.textContent = codigoNativo;
                document.body.appendChild(tempScript);
                tempScript.remove();
            } else {
                // Respaldo por si cambian la estructura del enlace
                boton.click();
            }
        }, 500);
    });

    // ==========================================
    // LÓGICA DEL MODAL MIS CURSOS (HÍBRIDO: Interfaz Iframe + API Oculta)
    // ==========================================
    // ==========================================
    // LÓGICA DEL AULA VIRTUAL (MODAL IFRAME NATIVO COMO CUP PRO)
    // ==========================================
    document.getElementById('usat-btn-mis-cursos').addEventListener('click', (e) => {
        e.preventDefault();
        abrirAulaVirtualModal('https://intranet.usat.edu.pe/aulavirtual/my/');
    });

    // Lo hacemos global (window) para que el Horario (Módulo 9) pueda usar esta misma ventana después
    // Lo hacemos global (window) para que el Horario (Módulo 9) pueda usar esta misma ventana después
    window.abrirAulaVirtualModal = async function (urlDestino) {
        let modal = document.getElementById('usat-moodle-modal');
        let iframe;

        // Función centralizada para cerrar la ventana con animacion
        const cerrarModal = () => {
            if (modal) {
                modal.style.opacity = '0';
                setTimeout(() => modal.style.display = 'none', 300);
            }
        };

        // Escuchar la tecla ESCAPE para cerrar
        const escListener = (e) => {
            if (e.key === 'Escape' && modal && modal.style.display !== 'none') {
                cerrarModal();
            }
        };

        // 1. Construir la ventana flotante si no existe
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'usat-moodle-modal';
            modal.style.cssText = 'position: fixed; inset: 0; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.85); z-index: 999999; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;';

            // Cerrar al hacer clic afuera del contenido
            modal.addEventListener('click', (e) => {
                if (e.target === modal) cerrarModal();
            });

            // Activar el detector de tecla Escape
            document.addEventListener('keydown', escListener);

            modal.innerHTML = `
                <div style="width: 96vw; height: 96vh; background: #fff; border-radius: 8px; display: flex; flex-direction: column; overflow: hidden; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <div style="background: #fff; height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 16px; flex-shrink: 0;">
                        <span style="color: #E33439; font-weight: bold; font-family: Arial, sans-serif; font-size: 15px;">Aula Virtual USAT</span>
                        <button id="usat-moodle-cerrar" style="background: rgba(211, 28, 28, 0.2); border: 1px solid rgba(243, 62, 77, 0.5); color: #E33439; cursor: pointer; display: flex; align-items: center; gap: 6px; justify-content: center; padding: 6px 14px; border-radius: 6px; transition: all 0.2s; font-family: Arial, sans-serif; font-weight: bold; font-size: 13px;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            CERRAR
                        </button>
                    </div>
                    <div style="flex: 1; position: relative; background: #f1f5f9;">
                        <div id="usat-moodle-loader" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #475569; background: #f1f5f9; z-index: 10;">
                            <span style="font-weight: 600; font-size: 16px; font-family: Arial, sans-serif;">⏳ Cargando Aula Virtual...</span>
                        </div>
                        <iframe id="usat-moodle-iframe" name="usat-moodle-iframe" style="width: 100%; height: 100%; border: none; position: relative; z-index: 5; opacity: 0; transition: opacity 0.3s ease;"></iframe>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Conectar el botón CERRAR
            document.getElementById('usat-moodle-cerrar').addEventListener('click', cerrarModal);

            iframe = document.getElementById('usat-moodle-iframe');

            // 2. Controlar la navegación interna del Iframe
            iframe.onload = () => {
                const loader = document.getElementById('usat-moodle-loader');
                if (loader) loader.style.display = 'none';
                iframe.style.opacity = '1';

                try {
                    const doc = iframe.contentDocument || iframe.contentWindow.document;

                    // Ocultar Footer gigante de Moodle
                    if (!doc.getElementById('usat-moodle-custom-css')) {
                        const style = doc.createElement('style');
                        style.id = 'usat-moodle-custom-css';
                        style.textContent = `
                            #page-footer { display: none !important; }
                            .back-to-top { display: none !important; }
                        `;
                        doc.head.appendChild(style);
                    }

                    // TRUCO CLAVE: Obligar a todos los links a abrirse DENTRO de la ventana flotante
                    doc.querySelectorAll('a').forEach(a => {
                        a.setAttribute('target', '_self');
                        if (a.hasAttribute('href') && a.getAttribute('href').includes('forcedownload')) {
                            a.href = a.href.substring(0, a.href.indexOf('?f'));
                        }
                        a.removeAttribute('onclick');
                    });

                    // Limpieza de cursos antiguos visuales
                    // Limpieza estricta de cursos antiguos y duplicados dentro del Modal Iframe
                    if (iframe.contentWindow.location.href.includes('aulavirtual/my')) {
                        const dt = new Date();
                        const curCic = dt.getFullYear() + '-' + (dt.getMonth() >= 7 ? 'II' : dt.getMonth() < 2 ? '0' : 'I');
                        const depurarEnIframe = () => {
                            const vistos = new Set();
                            doc.querySelectorAll('.list-group-item, .dashboard-card').forEach(t => {
                                const link = t.querySelector('a.coursename, .multiline');
                                const txt = (link ? link.innerText : t.innerText).trim();
                                if (!txt) return;
                                const clave = t.querySelector('a.coursename')?.getAttribute('href') || txt.toUpperCase();
                                if (!txt.toUpperCase().includes(curCic) || vistos.has(clave)) {
                                    t.remove();
                                } else {
                                    vistos.add(clave);
                                }
                            });
                        };
                        depurarEnIframe();
                        new MutationObserver(depurarEnIframe).observe(doc.body, { childList: true, subtree: true });
                    }
                } catch (e) {
                    console.log("[Campus PLUS] Redirección interna detectada (CORS).");
                }
            };
        } else {
            iframe = document.getElementById('usat-moodle-iframe');
            modal.style.display = 'flex';
        }

        // Mostrar la ventana flotante
        requestAnimationFrame(() => { modal.style.opacity = '1'; });

        // 3. Autenticación y Carga
        try {
            document.getElementById('usat-moodle-loader').style.display = 'flex';
            iframe.style.opacity = '0';

            let response = await fetch('https://intranet.usat.edu.pe/aulavirtual/my/');
            let html = await response.text();

            if (html.includes('login/index.php') || html.includes('Usted no se ha identificado')) {
                const respPuente = await fetch('aulavirtual.aspx');
                const htmlPuente = await respPuente.text();
                const docPuente = new DOMParser().parseFromString(htmlPuente, 'text/html');
                const formPuente = docPuente.querySelector('form');

                if (formPuente) {
                    const formData = new URLSearchParams();
                    formPuente.querySelectorAll('input').forEach(input => {
                        if (input.name) formData.append(input.name, input.value || '');
                    });
                    const actionUrl = formPuente.getAttribute('action') || 'https://intranet.usat.edu.pe/aulavirtual/login/index.php';
                    await fetch(actionUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: formData.toString()
                    });
                    html = await (await fetch('https://intranet.usat.edu.pe/aulavirtual/my/')).text();
                }
            }

            // 4. Extracción Invisible de IDs (Para que el Horario los use después)
            try {
                const matchKey = html.match(/sesskey.:.[^"]+/);
                if (matchKey) {
                    const sesskey = matchKey[0].split(':')[1].slice(1);
                    fetch(`https://intranet.usat.edu.pe/aulavirtual/lib/ajax/service.php?sesskey=${sesskey}&info=core_course_get_enrolled_courses_by_timeline_classification`, {
                        method: 'POST',
                        body: JSON.stringify([{
                            "index": 0, "methodname": "core_course_get_enrolled_courses_by_timeline_classification",
                            "args": { "offset": 0, "limit": 30, "classification": "inprogress", "sort": "fullname", "customfieldname": "", "customfieldvalue": "" }
                        }])
                    }).then(r => r.json()).then(dataApi => {
                        if (dataApi && !dataApi[0].error) {
                            const cursosActivos = dataApi[0].data.courses || [];
                            const diccionarioIDs = {};
                            cursosActivos.forEach(curso => {
                                let nombreLimpio = curso.fullname.replace(/\d{4}-.{1,2}\s*-\s*/, '').trim();
                                diccionarioIDs[nombreLimpio.toLowerCase()] = curso.id;
                            });
                            sessionStorage.setItem('usat_diccionario_ids_moodle', JSON.stringify(diccionarioIDs));
                        }
                    }).catch(e => { });
                }
            } catch (e) { console.error("Fallo al extraer Sesskey", e); }

            // Finalmente, cargar la URL (Mis cursos o el Curso directo) en el Iframe
            iframe.src = urlDestino;

        } catch (error) {
            console.error('[Campus Plus] Error al abrir mod', error);
            iframe.src = urlDestino;
        }
    };
}
window.initDashboardInteligente = initDashboardInteligente;
