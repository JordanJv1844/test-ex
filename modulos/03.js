// =========================================
// MÓDULO 3: MONITOR DE TAREAS PENDIENTES
// =========================================
async function initMonitorTareas() {
    if (!window.location.href.includes('aulavirtual')) return;
    // Evitamos que el panel aparezca cuando se abre el visor nativo de archivos de Moodle
    if (window.location.href.includes('pluginfile.php')) return;

    try {
        const response = await fetch('https://intranet.usat.edu.pe/aulavirtual/calendar/view.php?view=upcoming');
        const html = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const eventos = doc.querySelectorAll('.event');
        let tareas = [];

        eventos.forEach(el => {
            const titulo = el.querySelector('.name, .eventname, .card-title')?.innerText.trim() || 'Tarea pendiente';
            const fecha = el.querySelector('.date, .col-11')?.innerText.trim() || 'Fecha por confirmar';
            const enlace = el.querySelector('a')?.href || '#';
            tareas.push({ titulo, fecha, enlace });
        });

        // Actualizar el número en el icono de la extensión
        try { chrome.runtime.sendMessage({ action: "updateBadge", count: tareas.length }); } catch (e) { }

        if (tareas.length === 0) return;

        let estadoMemoria = sessionStorage.getItem('estadoTareasUSAT') || 'nuevo';
        let isPinned = estadoMemoria === 'fijado';

        if (!document.getElementById('contenedor-tareas-usat')) {
            const contenedor = document.createElement('div');
            contenedor.id = 'contenedor-tareas-usat';
            Object.assign(contenedor.style, {
                position: 'fixed', bottom: '20px', right: '20px', zIndex: '999999', fontFamily: 'Arial, sans-serif'
            });

            const customStyles = document.createElement('style');
            customStyles.innerHTML = `
                #btn-fijar-tareas, #btn-cerrar-tareas {
                    background-color: transparent !important;
                    background: transparent !important;
                    border: none !important;
                    outline: none !important;
                    box-shadow: none !important;
                    padding: 4px !important;
                    margin: 0 2px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                #btn-fijar-tareas:focus, #btn-cerrar-tareas:focus,
                #btn-fijar-tareas:active, #btn-cerrar-tareas:active,
                #btn-fijar-tareas:hover, #btn-cerrar-tareas:hover {
                    background-color: transparent !important;
                    background: transparent !important;
                    outline: none !important;
                    box-shadow: none !important;
                }
            `;
            document.head.appendChild(customStyles);

            const miniBtnHtml = `
                <button id="btn-mini-tareas" style="background-color: #dc2626; color: white; border: 1px solid #dc2626; padding: 10px 15px; border-radius: 8px; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: ${estadoMemoria !== 'nuevo' && !isPinned ? 'inline-flex' : 'none'}; align-items: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.backgroundColor='#b91c1c'" onmouseout="this.style.backgroundColor='#dc2626'">
                    ${ICONOS_USAT.tareasPortapapeles}
                    <span>${tareas.length} Tareas Pendientes</span>
                </button>
            `;

            const panelHtml = `
                <div id="panel-tareas-usat" style="width: 320px; display: ${estadoMemoria === 'nuevo' || isPinned ? 'block' : 'none'}; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <div style="background-color: #dc2626; padding: 10px 12px; border-radius: 8px 8px 0 0; display: flex; justify-content: space-between; align-items: center; position: relative;">
                        <span style="font-size: 14px; font-weight: bold; color: white; display: inline-flex; align-items: center; gap: 7px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${ICONOS_USAT.alertaBlanco}
                            <span>${tareas.length} Tarea(s)</span>
                        </span>
                        
                        <div style="display: flex; align-items: center; flex-shrink: 0; background: transparent !important;">
                            <button id="btn-fijar-tareas" style="cursor: pointer; transition: transform 0.1s; opacity: ${isPinned ? '1' : '0.5'};" title="Fijar panel" onmousedown="this.style.transform='scale(0.9)'" onmouseup="this.style.transform='scale(1)'">
                                ${isPinned ? ICONOS_USAT.chinchetaSolida : ICONOS_USAT.chinchetaHueca}
                            </button>
                            <button id="btn-cerrar-tareas" style="color: white; cursor: pointer;" title="Cerrar panel">
                                ${ICONOS_USAT.cerrarBlanco}
                            </button>
                        </div>
                        
                        <div id="barra-progreso-tareas" style="position: absolute; bottom: 0; left: 0; height: 3px; background-color: rgba(255,255,255,0.8); width: 100%; display: ${isPinned ? 'none' : 'block'};"></div>
                    </div>

                    <ul style="list-style: none; padding: 0; margin: 0; max-height: 280px; overflow-y: auto;">
                        ${tareas.map(t => `
                            <li style="padding: 12px; border-bottom: 1px solid #f3f4f6; transition: background 0.2s;">
                                <a href="${t.enlace}" style="color: #1f2937; text-decoration: none; font-size: 12px; display: block; font-weight: 600; margin-bottom: 4px;" onmouseover="this.style.color='#dc2626'" onmouseout="this.style.color='#1f2937'">${t.titulo}</a>
                                <span style="color: #6b7280; font-size: 11px; font-weight: bold; display: inline-flex; align-items: center; gap: 5px;">
                                    ${ICONOS_USAT.calendarioGris}
                                    <span>${t.fecha}</span>
                                </span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;

            contenedor.innerHTML = panelHtml + miniBtnHtml;
            document.body.appendChild(contenedor);

            const panel = document.getElementById('panel-tareas-usat');
            const miniBtn = document.getElementById('btn-mini-tareas');
            const btnCerrar = document.getElementById('btn-cerrar-tareas');
            const btnFijar = document.getElementById('btn-fijar-tareas');
            const barraProgreso = document.getElementById('barra-progreso-tareas');

            let tiempoRestante = 8000;
            const tiempoTotal = 8000;
            let intervaloReloj;
            let ratonEncima = false;

            const ocultarPanel = (estadoFinal) => {
                panel.style.display = 'none';
                miniBtn.style.display = 'inline-flex';
                sessionStorage.setItem('estadoTareasUSAT', estadoFinal);
            };

            const arrancarReloj = () => {
                if (isPinned) return;
                clearInterval(intervaloReloj);

                intervaloReloj = setInterval(() => {
                    if (!ratonEncima && !isPinned) {
                        tiempoRestante -= 50;
                        let porcentaje = (tiempoRestante / tiempoTotal) * 100;
                        barraProgreso.style.width = porcentaje + '%';

                        if (tiempoRestante <= 0) {
                            clearInterval(intervaloReloj);
                            ocultarPanel('oculto_automatico');
                        }
                    }
                }, 50);
            };

            panel.addEventListener('mouseenter', () => { ratonEncima = true; });
            panel.addEventListener('mouseleave', () => { ratonEncima = false; });

            btnCerrar.addEventListener('click', (e) => {
                e.preventDefault();
                clearInterval(intervaloReloj);
                ocultarPanel('cerrado_manual');
            });

            btnFijar.addEventListener('click', (e) => {
                e.preventDefault();
                isPinned = !isPinned;
                if (isPinned) {
                    btnFijar.innerHTML = ICONOS_USAT.chinchetaSolida;
                    btnFijar.style.opacity = '1';
                    barraProgreso.style.display = 'none';
                    clearInterval(intervaloReloj);
                    sessionStorage.setItem('estadoTareasUSAT', 'fijado');
                } else {
                    btnFijar.innerHTML = ICONOS_USAT.chinchetaHueca;
                    btnFijar.style.opacity = '0.5';
                    barraProgreso.style.display = 'block';
                    tiempoRestante = 8000;
                    sessionStorage.setItem('estadoTareasUSAT', 'nuevo');
                    arrancarReloj();
                }
            });

            miniBtn.addEventListener('click', () => {
                miniBtn.style.display = 'none';
                panel.style.display = 'block';

                isPinned = true;
                btnFijar.innerHTML = ICONOS_USAT.chinchetaSolida;
                btnFijar.style.opacity = '1';
                barraProgreso.style.display = 'none';
                clearInterval(intervaloReloj);
                sessionStorage.setItem('estadoTareasUSAT', 'fijado');
            });

            if (estadoMemoria === 'nuevo' && !isPinned) {
                arrancarReloj();
            }
        }
    } catch (error) {
        console.log("Monitor USAT: Ocurrió un error", error);
    }
}
