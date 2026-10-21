// =========================================
// MÓDULO 6: VISOR DE ACTIVIDADES EN LÍNEA (Iframe Integrado)
// =========================================
function initVistaActividadInline() {
    if (!window.location.href.includes('course/view.php')) return;

    if (!document.getElementById('usat-inline-activity-styles')) {
        const style = document.createElement('style');
        style.id = 'usat-inline-activity-styles';
        style.textContent = `
            .btn-usat-inline {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                padding: 3px 12px !important;
                font-size: 11.5px !important;
                font-weight: 500 !important;
                color: #2563eb !important;
                background-color: #eff6ff !important;
                border: 1px solid #bfdbfe !important;
                border-radius: 15px !important;
                cursor: pointer !important;
                margin-left: 12px !important;
                transition: all 0.15s ease !important;
                text-decoration: none !important;
            }
            .btn-usat-inline:hover {
                background-color: #dbeafe !important;
            }
            .btn-usat-inline.cerrar {
                color: #dc2626 !important;
                background-color: #fef2f2 !important;
                border-color: #fecaca !important;
            }
            .usat-inline-container {
                margin-top: 10px !important;
                border: 1px solid #cbd5e1 !important;
                border-radius: 8px !important;
                background-color: #ffffff !important;
                overflow: hidden !important;
                display: none;
                flex-direction: column !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05) !important;
                width: 100% !important;
                animation: slideDown 0.3s ease-out;
            }
            .usat-inline-container.visible {
                display: flex !important; 
            }
            .usat-inline-toolbar {
                display: flex !important;
                gap: 6px !important;
                padding: 8px 12px !important;
                background-color: #f8fafc !important;
                border-bottom: 1px solid #e2e8f0 !important;
                align-items: center !important;
            }
            .usat-inline-toolbar button {
                background-color: #ffffff !important;
                border: 1px solid #cbd5e1 !important;
                border-radius: 4px !important;
                padding: 4px 12px !important;
                font-size: 11.5px !important;
                font-weight: 600 !important;
                color: #475569 !important;
                cursor: pointer !important;
                transition: all 0.15s !important;
            }
            .usat-inline-toolbar button:hover {
                background-color: #f1f5f9 !important;
                color: #0f172a !important;
            }
            .usat-inline-iframe {
                width: 100% !important;
                border: none !important;
                background-color: #ffffff !important;
                transition: height 0.2s ease !important;
            }
            .iframe-loading {
                padding: 20px;
                text-align: center;
                font-size: 13px;
                color: #64748b;
                font-weight: 600;
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }

    const actividades = document.querySelectorAll('.section .activity:not(.resource)');
    
    actividades.forEach(actividad => {
        const instancia = actividad.querySelector('.activityinstance');
        if (!instancia) return;

        // Filtra para que solo afecte Tareas (assign), Exámenes (quiz) y Foros (forum)
        const enlace = instancia.querySelector('a[href*="mod/assign/view.php"], a[href*="mod/quiz/view.php"], a[href*="mod/forum/view.php"]');
        if (!enlace || instancia.querySelector('.btn-usat-inline')) return;

        const btnToggle = document.createElement('button');
        btnToggle.className = 'btn-usat-inline';
        btnToggle.innerText = 'Ver actividad';

        let container = null;
        let iframe = null;
        let loadingDiv = null;
        let alturaIframe = 450; 

        btnToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (btnToggle.classList.contains('cerrar')) {
                container.classList.remove('visible');
                btnToggle.classList.remove('cerrar');
                btnToggle.innerText = 'Ver actividad';
            } else {
                if (!container) {
                    container = document.createElement('div');
                    container.className = 'usat-inline-container';

                    const toolbar = document.createElement('div');
                    toolbar.className = 'usat-inline-toolbar';

                    const btnRecargar = document.createElement('button');
                    btnRecargar.innerText = 'Recargar';
                    btnRecargar.onclick = () => { 
                        if(iframe) {
                            iframe.style.display = 'none';
                            loadingDiv.style.display = 'block';
                            iframe.src = iframe.src; 
                        }
                    };

                    const btnMenos = document.createElement('button');
                    btnMenos.innerText = 'Menos altura';
                    btnMenos.onclick = () => { 
                        alturaIframe = Math.max(200, alturaIframe - 150); 
                        iframe.style.height = alturaIframe + 'px'; 
                    };

                    const btnMas = document.createElement('button');
                    btnMas.innerText = 'Más altura';
                    btnMas.onclick = () => { 
                        alturaIframe += 150; 
                        iframe.style.height = alturaIframe + 'px'; 
                    };

                    toolbar.append(btnRecargar, btnMenos, btnMas);

                    loadingDiv = document.createElement('div');
                    loadingDiv.className = 'iframe-loading';
                    loadingDiv.innerText = '⏳ Cargando vista limpia de la actividad...';

                    iframe = document.createElement('iframe');
                    iframe.className = 'usat-inline-iframe';
                    iframe.src = enlace.href;
                    iframe.style.height = alturaIframe + 'px';
                    iframe.style.display = 'none';

                    iframe.onload = () => {
                        loadingDiv.style.display = 'none';
                        iframe.style.display = 'block';
                        try {
                            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                            const style = iframeDoc.createElement('style');
                            style.innerHTML = `
                                header, footer, nav, #page-header, #page-navbar, 
                                #block-region-side-pre, #block-region-side-post, 
                                .activity-navigation, .moodle-actionmenu, 
                                #theme_lambda-user-menu, .navbar {
                                    display: none !important;
                                }
                                
                                #page-content, #region-main-box, #region-main, [role="main"] {
                                    padding: 0 !important;
                                    margin: 0 !important;
                                    border: none !important;
                                    box-shadow: none !important;
                                    width: 100% !important;
                                    background-color: #ffffff !important;
                                }
                                
                                body {
                                    background: #ffffff !important;
                                    padding: 10px 15px !important;
                                    overflow-x: hidden !important;
                                    zoom: 0.85 !important;
                                }
                            `;
                            iframeDoc.head.appendChild(style);
                        } catch (error) {
                            console.log('No se pudo inyectar CSS en el iframe debido a seguridad cruzada (CORS)', error);
                        }
                    };

                    container.append(toolbar, loadingDiv, iframe);
                    actividad.appendChild(container);
                }
                
                container.classList.add('visible');
                btnToggle.classList.add('cerrar');
                btnToggle.innerText = 'Cerrar vista';
            }
        });

        instancia.appendChild(btnToggle);
    });
}