// =========================================
// MÓDULO 5: VISTA PREVIA INSTANTÁNEA Y VISOR PDF
// =========================================
function initVistaPreviaModal() {
    if (!window.location.href.includes('course/view.php')) return;

    if (!document.getElementById('usat-preview-styles')) {
        const style = document.createElement('style');
        style.id = 'usat-preview-styles';
        style.textContent = `
            .btn-usat-preview {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 5px !important;
                margin-left: 8px !important;
                padding: 2px 8px !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                color: #dc2626 !important;
                background-color: #fff1f2 !important;
                border: 1px solid #fecdd3 !important;
                border-radius: 5px !important;
                cursor: pointer !important;
                vertical-align: middle !important;
                transition: all 0.15s ease !important;
                line-height: 1.2 !important;
            }
            .btn-usat-preview svg {
                stroke: currentColor !important;
            }
            .btn-usat-preview:hover {
                background-color: #dc2626 !important;
                color: #ffffff !important;
                border-color: #dc2626 !important;
                transform: translateY(-1px) !important;
            }
            #usat-modal-overlay {
                position: fixed !important;
                inset: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                background-color: rgba(15, 23, 42, 0.65) !important;
                backdrop-filter: blur(3px) !important;
                z-index: 999999 !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                opacity: 0;
                transition: opacity 0.2s ease;
            }
            #usat-modal-box {
                background-color: #ffffff !important;
                width: 92vw !important;
                height: 88vh !important;
                max-width: none !important;
                max-height: none !important;
                border-radius: 12px !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35) !important;
                display: flex !important;
                flex-direction: column !important;
                overflow: hidden !important;
                border: 1px solid #cbd5e1 !important;
            }
            #usat-modal-header {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 10px 16px !important;
                background-color: #ffffff !important;
                border-bottom: 1px solid #e2e8f0 !important;
                flex-shrink: 0 !important;
                height: 56px !important;
                box-sizing: border-box !important;
            }
            #usat-modal-body {
                flex: 1 !important;
                width: 100% !important;
                height: 100% !important;
                background-color: #f1f5f9 !important;
                position: relative !important;
                overflow: auto !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
            }
            .usat-modal-btn-action {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 6px !important;
                padding: 0 14px !important;
                height: 34px !important;
                border-radius: 6px !important;
                font-size: 12.5px !important;
                font-weight: 600 !important;
                color: #ffffff !important;
                text-decoration: none !important;
                border: none !important;
                cursor: pointer !important;
                transition: opacity 0.15s ease !important;
                box-sizing: border-box !important;
            }
            .usat-modal-btn-action.usat-oculto {
                display: none !important;
            }
            .usat-modal-btn-action:hover {
                opacity: 0.9 !important;
                color: #ffffff !important;
            }
            #usat-btn-cerrar-modal {
                background-color: #f1f5f9 !important;
                color: #0f172a !important;
                border: none !important;
                width: 34px !important;
                height: 34px !important;
                padding: 0 !important;
                border-radius: 6px !important;
                cursor: pointer !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: background-color 0.15s ease !important;
                box-sizing: border-box !important;
            }
            #usat-btn-cerrar-modal:hover {
                background-color: #e2e8f0 !important;
            }
            .usat-code-viewer {
                width: 100%;
                height: 100%;
                margin: 0 !important;
                padding: 18px !important;
                background-color: #0f172a !important;
                color: #e2e8f0 !important;
                font-family: "Consolas", "Monaco", "Courier New", monospace !important;
                font-size: 13px !important;
                line-height: 1.5 !important;
                overflow: auto !important;
                box-sizing: border-box !important;
                white-space: pre-wrap !important;
                word-break: break-word !important;
            }
        `;
        document.head.appendChild(style);
    }

    function esArchivoNoPrevisualizable(actividad, titulo) {
        const imgIcon = actividad.querySelector('img.activityicon, img.icon');
        const srcIcono = (imgIcon?.src || '').toLowerCase();
        const altIcono = (imgIcon?.alt || '').toLowerCase();
        const textoTitulo = titulo.toLowerCase();

        const iconosBloqueados = [
            'f/document', 'f/word', 'powerpoint', 'spreadsheet', 'excel', 'calc', 'archive', 'zip', 'mp3', 'mp4', 'audio', 'video'
        ];
        if (iconosBloqueados.some(tipo => srcIcono.includes(tipo) || altIcono.includes(tipo))) {
            return true;
        }

        const regexExtensiones = /\.(docx?|pptx?|xlsx?|zip|rar|7z|exe|msi|iso)$/i;
        return regexExtensiones.test(textoTitulo);
    }

    const actividades = document.querySelectorAll('.section .activity.resource');
    actividades.forEach(actividad => {
        const enlace = actividad.querySelector('a[href*="mod/resource/view.php"]');
        if (!enlace || actividad.querySelector('.btn-usat-preview')) return;

        const cloneEnlace = enlace.cloneNode(true);
        cloneEnlace.querySelectorAll('.accesshide').forEach(el => el.remove());
        let titulo = cloneEnlace.innerText.replace(/\s*Archivo$/i, '').trim();

        if (esArchivoNoPrevisualizable(actividad, titulo)) return;

        const btnPreview = document.createElement('button');
        btnPreview.className = 'btn-usat-preview';
        btnPreview.innerHTML = `${ICONOS_USAT.ojo}<span>Ver</span>`;
        btnPreview.title = 'Vista previa instantánea';

        btnPreview.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            abrirModalVistaPrevia(enlace.href, titulo, btnPreview);
        });

        enlace.parentNode.insertBefore(btnPreview, enlace.nextSibling);
    });

    async function abrirModalVistaPrevia(urlOriginal, titulo, botonOrigen) {
        cerrarModalExistente();

        let blobUrlActual = null;
        const urlDirecta = urlOriginal.includes('?') ? `${urlOriginal}&redirect=1` : `${urlOriginal}?redirect=1`;

        const overlay = document.createElement('div');
        overlay.id = 'usat-modal-overlay';

        overlay.innerHTML = `
            <div id="usat-modal-box">
                <div id="usat-modal-header">
                    <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
                        <span id="usat-modal-badge" style="background: #e2e8f0; color: #334155; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 4px; text-transform: uppercase;">CARGANDO</span>
                        <span style="font-weight: 700; font-size: 14px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${titulo}</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                        <button id="usat-btn-copiar-codigo" class="usat-modal-btn-action usat-oculto" style="background: #1e293b;">
                            ${ICONOS_USAT.copiar}<span>Copiar código</span>
                        </button>
                        <a id="usat-btn-descargar-modal" href="${urlDirecta}" target="_blank" class="usat-modal-btn-action" style="background: #dc2626;">
                            ${ICONOS_USAT.descargar}<span>Descargar</span>
                        </a>
                        <button id="usat-btn-cerrar-modal" title="Cerrar (Esc)">
                            ${ICONOS_USAT.cerrarOscuro}
                        </button>
                    </div>
                </div>
                <div id="usat-modal-body">
                    <div style="color: #475569; font-size: 13.5px; font-weight: 600;">Cargando vista previa...</div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        requestAnimationFrame(() => { overlay.style.opacity = '1'; });

        const headerElement = document.getElementById('usat-modal-header');
        const ajustarEscalaZoom = () => {
            if (!headerElement) return;
            const dpr = window.devicePixelRatio || 1;
            if (dpr < 0.85) {
                headerElement.style.zoom = (0.95 / dpr).toFixed(2);
            } else {
                headerElement.style.zoom = '1';
            }
        };
        ajustarEscalaZoom();
        window.addEventListener('resize', ajustarEscalaZoom);

        const limpiarYCerrar = () => {
            if (blobUrlActual) URL.revokeObjectURL(blobUrlActual);
            window.removeEventListener('resize', ajustarEscalaZoom);
            document.removeEventListener('keydown', manejadorEscape);
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 200);
        };

        const manejadorEscape = (e) => {
            if (e.key === 'Escape') limpiarYCerrar();
        };

        document.addEventListener('keydown', manejadorEscape);
        document.getElementById('usat-btn-cerrar-modal').addEventListener('click', limpiarYCerrar);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) limpiarYCerrar();
        });

        const bodyContainer = document.getElementById('usat-modal-body');
        const badgeElement = document.getElementById('usat-modal-badge');
        const btnCopiar = document.getElementById('usat-btn-copiar-codigo');

        try {
            const response = await fetch(urlDirecta);
            if (!response.ok) throw new Error('Error de red');

            const contentType = (response.headers.get('content-type') || '').toLowerCase();
            const urlFinal = decodeURIComponent(response.url || '').split('?')[0];
            const extension = urlFinal.includes('.') ? urlFinal.split('.').pop().toLowerCase() : '';

            const rawBlob = await response.blob();
            const btnDescargar = document.getElementById('usat-btn-descargar-modal');

            if (btnDescargar) {
                blobUrlActual = URL.createObjectURL(rawBlob);
                btnDescargar.href = blobUrlActual;
                btnDescargar.download = `${titulo}.${extension || 'pdf'}`;
                btnDescargar.removeAttribute('target');
            }

            if (contentType.includes('pdf') || extension === 'pdf') {
                btnCopiar.classList.add('usat-oculto');
                badgeElement.innerText = 'PDF';
                badgeElement.style.background = '#fee2e2';
                badgeElement.style.color = '#991b1b';

                const pdfBlob = new Blob([rawBlob], { type: 'application/pdf' });
                blobUrlActual = URL.createObjectURL(pdfBlob);

                if (btnDescargar) btnDescargar.href = blobUrlActual;

                bodyContainer.innerHTML = `<iframe src="${blobUrlActual}#view=FitH" style="width: 100%; height: 100%; border: none; display: block;"></iframe>`;
            }
            else if (contentType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(extension)) {
                btnCopiar.classList.add('usat-oculto');
                badgeElement.innerText = extension.toUpperCase() || 'IMAGEN';
                badgeElement.style.background = '#dcfce7';
                badgeElement.style.color = '#166534';

                bodyContainer.innerHTML = `<img src="${blobUrlActual}" style="max-width: 95%; max-height: 95%; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />`;
            }
            else if (
                contentType.startsWith('text/') ||
                ['sql', 'txt', 'csv', 'json', 'xml', 'html', 'css', 'js', 'java', 'cpp', 'c', 'h', 'ino', 'py', 'md'].includes(extension) ||
                rawBlob.size < 300 * 1024
            ) {
                const posiblesBinarios = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls', 'zip', 'rar', '7z', 'exe'];
                if (posiblesBinarios.includes(extension)) {
                    descargarYQuitarBoton(urlDirecta, limpiarYCerrar, botonOrigen);
                    return;
                }

                const texto = await rawBlob.text();
                if (texto.includes('\u0000')) {
                    descargarYQuitarBoton(urlDirecta, limpiarYCerrar, botonOrigen);
                    return;
                }

                badgeElement.innerText = extension ? extension.toUpperCase() : 'SCRIPT / TEXTO';
                badgeElement.style.background = '#e0e7ff';
                badgeElement.style.color = '#1e40af';

                if (btnDescargar) btnDescargar.download = `${titulo}.${extension || 'txt'}`;

                const pre = document.createElement('pre');
                pre.className = 'usat-code-viewer';
                pre.textContent = texto;
                bodyContainer.innerHTML = '';
                bodyContainer.appendChild(pre);

                btnCopiar.classList.remove('usat-oculto');
                btnCopiar.onclick = () => {
                    navigator.clipboard.writeText(texto);
                    btnCopiar.innerHTML = `${ICONOS_USAT.checkBlanco}<span>Copiado</span>`;
                    setTimeout(() => {
                        btnCopiar.innerHTML = `${ICONOS_USAT.copiar}<span>Copiar código</span>`;
                    }, 2000);
                };
            }
            else {
                descargarYQuitarBoton(urlDirecta, limpiarYCerrar, botonOrigen);
            }

        } catch (err) {
            descargarYQuitarBoton(urlDirecta, limpiarYCerrar, botonOrigen);
        }
    }

    function descargarYQuitarBoton(urlDescarga, cerrarModalFn, botonOrigen) {
        cerrarModalFn();
        if (botonOrigen) botonOrigen.remove();
        window.open(urlDescarga, '_blank');
    }

    function cerrarModalExistente() {
        const previo = document.getElementById('usat-modal-overlay');
        if (previo) previo.remove();
    }
}