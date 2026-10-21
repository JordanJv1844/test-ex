// =========================================
// MÓDULO 9: HORARIO INTERACTIVO (Fix Checks Nativos y CSP)
// =========================================
function initHorarioInteractivo() {
    if (!window.location.href.includes('Main.aspx')) return;

    let cursoActualSeleccionado = '';

    // 1. Estilos Globales, Variables CSS y Fix de Checkboxes
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --usat-tam-dias: 12px; --usat-tam-nom: 10px; --usat-tam-hora: 9px;
            --usat-esp-nom: 1.1; --usat-rad-esq: 4px; --usat-anch-col: 1fr;
            --usat-alt-fil: auto; --usat-espaciado: 4px; --usat-sombra-bloque: 0 2px 4px rgba(0,0,0,0.1);
            --usat-txt-transform: none;
        }

        #usat-horario-wrapper {
            background: #ffffff; border-radius: 8px; border: 1px solid #cbd5e1; 
            margin-bottom: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }
        
        .usat-calendario-container { overflow-x: auto; padding: 15px; background: #fff; }
        .usat-grid-header { 
            display: grid; grid-template-columns: repeat(6, var(--usat-anch-col)); 
            background: #87ceeb; color: #0f172a; font-weight: bold; text-align: center; 
            padding: 8px 0; font-size: var(--usat-tam-dias);
        }
        .usat-grid-body { 
            display: grid; grid-template-columns: repeat(6, var(--usat-anch-col)); 
            min-height: 200px; border-left: 1px dashed #e2e8f0; border-bottom: 1px dashed #e2e8f0; 
        }
        .usat-dia-col { 
            border-right: 1px dashed #e2e8f0; position: relative; padding: 6px 4px; 
            display: flex; flex-direction: column; gap: var(--usat-espaciado); 
            background: repeating-linear-gradient(0deg, transparent, transparent 39px, #e2e8f0 39px, #e2e8f0 40px);
        }
        
        .usat-curso-bloque {
            color: white; padding: 6px; border-radius: var(--usat-rad-esq);
            cursor: pointer; transition: transform 0.1s; text-align: center;
            box-shadow: var(--usat-sombra-bloque); display: flex; flex-direction: column; 
            gap: 3px; min-height: var(--usat-alt-fil); align-items: center; justify-content: center;
        }
        .usat-curso-bloque:hover { transform: scale(1.02); filter: brightness(1.1); }
        .usat-bloque-hora { font-weight: bold; font-size: var(--usat-tam-hora); background: rgba(0,0,0,0.15); border-radius: 3px; padding: 2px 4px; }
        .usat-bloque-nombre { line-height: var(--usat-esp-nom); font-weight: 600; font-size: var(--usat-tam-nom); text-transform: var(--usat-txt-transform); word-break: break-word; }
        
        .usat-ocultar-horas .usat-bloque-hora { display: none !important; }
        .usat-col-oculta { display: none !important; }

        /* Panel Personalizar */
        .usat-panel-contenedor { padding: 0 15px 15px 15px; border-top: 1px solid #e2e8f0; background: #f8fafc;}
        .usat-panel-header { padding: 12px 5px; color: #64748b; font-size: 13px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .usat-panel-body { display: none; padding: 5px; }
        .usat-panel-body.activo { display: block; }
        .usat-panel-instruccion { font-size: 12px; color: #94a3b8; margin-bottom: 15px; }
        
        .usat-controles-grid { display: grid; grid-template-columns: 1fr; gap: 12px; font-size: 13px; color: #334155; }
        .usat-control-fila { display: flex; align-items: center; cursor: pointer; font-weight: 600; }
        
        /* CÓDIGO DEL USUARIO: FIX CHECKBOXES NATIVOS */
        #usat-body-personalizar .usat-control-fila input[type="checkbox"] {
            appearance: auto !important;
            -webkit-appearance: checkbox !important;
            display: inline-block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: static !important;
            width: 14px !important;
            height: 14px !important;
            min-width: 14px !important;
            margin: 0 8px 0 0 !important;
            padding: 0 !important;
            cursor: pointer !important;
            accent-color: #2563eb;
            flex-shrink: 0;
            pointer-events: auto !important;
        }
        
        .usat-control-rango { display: flex; align-items: center; justify-content: space-between; max-width: 400px; font-weight: 400; font-size: 12px;}
        .usat-control-rango span { width: 140px; }
        .usat-control-rango input[type="range"] { flex-grow: 1; height: 6px; border-radius: 3px; background: #cbd5e1; appearance: none; outline: none; cursor: pointer; border: none;}
        .usat-control-rango input[type="range"]::-webkit-slider-thumb { appearance: none; width: 14px; height: 14px; border-radius: 50%; background: #2563eb; cursor: pointer; }
        
        .usat-panel-footer { display: flex; gap: 8px; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        .usat-btn-accion { padding: 6px 12px; border: 1px solid #cbd5e1; background: white; border-radius: 4px; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #475569; }
        .usat-btn-accion:hover { background: #f1f5f9; }

        /* Modal Ampliar */
        #usat-modal-ampliar {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85);
            z-index: 10000; display: none; flex-direction: column; align-items: center; justify-content: center;
        }
        .usat-modal-toolbar { position: absolute; top: 10px; width: 95%; display: flex; justify-content: space-between; }
        .usat-modal-btn { background: #1e1e1e; border: 1px solid #333; color: white; padding: 6px 12px; font-size: 16px; cursor: pointer; border-radius: 4px; margin-right: 5px; }
        .usat-modal-btn:hover { background: #333; }
        .usat-modal-close { background: #dc2626; border: none; font-weight: bold;}
        .usat-modal-close:hover { background: #ef4444; }
        #usat-clon-contenedor {
            background: white; padding: 20px; border-radius: 8px; max-width: 95vw; max-height: 85vh; overflow: auto;
            transform-origin: center top; transition: transform 0.2s;
        }

        
        /* Menú compacto del curso */
        #usat-popover-horario {
            position: absolute;
            --usat-popover-color: #4caf50;
            --usat-flecha-x: 100px;
            background: var(--usat-popover-color);
            color: #fff;
            border: none;
            border-radius: 0;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
            padding: 5px 0;
            width: 110px;
            box-sizing: border-box;
            z-index: 9999;
            display: none;
            flex-direction: column;
            gap: 0;
            font-family: Arial, sans-serif;
        }

        /* Flecha que apunta al curso */
        #usat-popover-horario::before {
            content: "";
            position: absolute;
            top: -8px;
            left: calc(var(--usat-flecha-x) - 8px);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-bottom: 8px solid var(--usat-popover-color);
        }

        #usat-pop-curso-nombre {
    display: none;
}

        .usat-pop-btn {
            padding: 7px 10px;
            border: none;
            border-radius: 0;
            background: transparent;
            color: #fff;
            cursor: pointer;
            font-size: 11px;
            text-align: left;
            display: flex;
            align-items: center;
            gap: 7px;
            width: 100%;
            box-sizing: border-box;
        }

        .usat-pop-btn:hover {
            background: rgba(0, 0, 0, 0.13);
            color: #fff;
        }

        .usat-pop-btn svg {
            display: none;
        }

        .usat-color-picker-wrapper {
            display: block;
            margin: 0;
            padding: 0;
            font-size: 11px;
        }

        #usat-pop-color {
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
    padding: 0;
    border: 0;
}

        `;
    document.head.appendChild(style);

    // 2. DOM Elements
    const popover = document.createElement('div');
    popover.id = 'usat-popover-horario';

    popover.innerHTML = `
        <div id="usat-pop-curso-nombre"></div>

        <button type="button" class="usat-pop-btn" id="usat-pop-btn-aula">
            Abrir curso
        </button>

        <button type="button" class="usat-pop-btn" id="usat-pop-btn-notas">
            Ver notas
        </button>

        <div style="position: relative; width: 100%;">
            <button type="button" class="usat-pop-btn" style="width: 100%; pointer-events: none;">
                Cambiar color
            </button>
            <input type="color" id="usat-pop-color" aria-label="Elegir color del curso" style="position: absolute !important; opacity: 0 !important; width: 100% !important; height: 100% !important; left: 0 !important; top: 0 !important; cursor: pointer !important; pointer-events: auto !important; display: block !important; border: none !important; padding: 0 !important; margin: 0 !important;">
        </div>
    `;

    document.body.appendChild(popover);

    const modalAmpliar = document.createElement('div');
    modalAmpliar.id = 'usat-modal-ampliar';
    modalAmpliar.innerHTML = `
        <div class="usat-modal-toolbar">
            <div>
                <button type="button" class="usat-modal-btn" id="usat-mod-menos" title="Reducir tamaño">➖</button>
                <button type="button" class="usat-modal-btn" id="usat-mod-mas" title="Aumentar tamaño">➕</button>
            </div>
            <div>
                <button type="button" class="usat-modal-btn" id="usat-mod-dl" title="Descargar imagen">☁ Descargar</button>
                <button type="button" class="usat-modal-btn usat-modal-close" id="usat-mod-close">✖</button>
            </div>
        </div>
        <div id="usat-clon-contenedor"></div>
    `;
    document.body.appendChild(modalAmpliar);

    const sabuesoDashboard = setInterval(() => {
        const dashboardAccesos = document.getElementById('usat-dashboard-accesos');
        if (dashboardAccesos && !document.getElementById('usat-horario-wrapper')) {
            clearInterval(sabuesoDashboard);
            construirEstructuraHorario(dashboardAccesos);
        }
    }, 500);

    function construirEstructuraHorario(nodoReferencia) {
        const prefs = JSON.parse(localStorage.getItem('usat_horario_prefs')) || {
            sombras: true, mayusculas: false, horas: true, colHoras: false, fmt24: false, diasSinCursos: true,
            tamDias: 12, tamNom: 10, tamHora: 9, espNom: 1.1, radEsq: 4, anchCol: 100, altFil: 40, espaciado: 4
        };

        const horarioHtml = `
            <div id="usat-horario-wrapper" class="${!prefs.horas ? 'usat-ocultar-horas' : ''}">
                <div class="usat-calendario-container" id="usat-export-zona">
                    <div class="usat-grid-header" id="usat-horario-head">
                        <div data-dia="LU">LUN</div><div data-dia="MA">MAR</div><div data-dia="MI">MIE</div>
                        <div data-dia="JU">JUE</div><div data-dia="VI">VIE</div><div data-dia="SA">SAB</div>
                    </div>
                    <div class="usat-grid-body" id="usat-horario-body">
                        <div class="usat-dia-col" id="col-LU"></div><div class="usat-dia-col" id="col-MA"></div>
                        <div class="usat-dia-col" id="col-MI"></div><div class="usat-dia-col" id="col-JU"></div>
                        <div class="usat-dia-col" id="col-VI"></div><div class="usat-dia-col" id="col-SA"></div>
                    </div>
                </div>
                
                <div class="usat-panel-contenedor">
                    <div class="usat-panel-header" id="usat-btn-personalizar">
                        <span>Personalizar</span><span>⌄</span>
                    </div>
                    <div class="usat-panel-body" id="usat-body-personalizar">
                        <div class="usat-panel-instruccion">Puedes editar los colores de un curso en el horario haciendo clic sobre él</div>
                        
                        <div class="usat-controles-grid">
                            <label class="usat-control-fila"><input type="checkbox" id="cfg-sombras" ${prefs.sombras ? 'checked' : ''}> Mostrar sombras</label>
                            <label class="usat-control-fila"><input type="checkbox" id="cfg-mayus" ${prefs.mayusculas ? 'checked' : ''}> Nombres en mayúsculas</label>
                            <label class="usat-control-fila"><input type="checkbox" id="cfg-horas" ${prefs.horas ? 'checked' : ''}> Mostrar indicador de horas</label>
                            <label class="usat-control-fila"><input type="checkbox" id="cfg-fmt24" ${prefs.fmt24 ? 'checked' : ''}> Usar formato de 24 horas</label>
                            <label class="usat-control-fila"><input type="checkbox" id="cfg-dias-vacios" ${prefs.diasSinCursos ? 'checked' : ''}> Mostrar días sin cursos</label>
                            
                            <div class="usat-control-rango"><span>Tamaño de los días</span> <input type="range" id="cfg-tam-dias" min="8" max="20" value="${prefs.tamDias}"></div>
                            <div class="usat-control-rango"><span>Tamaño de los nombres</span> <input type="range" id="cfg-tam-nom" min="7" max="16" value="${prefs.tamNom}"></div>
                            <div class="usat-control-rango"><span>Tamaño de la hora</span> <input type="range" id="cfg-tam-hora" min="7" max="14" value="${prefs.tamHora}"></div>
                            <div class="usat-control-rango"><span>Espacio de los nombres</span> <input type="range" id="cfg-esp-nom" min="0.8" max="2" step="0.1" value="${prefs.espNom}"></div>
                            <div class="usat-control-rango"><span>Radio de esquinas</span> <input type="range" id="cfg-rad-esq" min="0" max="20" value="${prefs.radEsq}"></div>
                            <div class="usat-control-rango"><span>Ancho de columnas</span> <input type="range" id="cfg-anch-col" min="50" max="200" value="${prefs.anchCol}"></div>
                            <div class="usat-control-rango"><span>Alto de filas</span> <input type="range" id="cfg-alt-fil" min="20" max="100" value="${prefs.altFil}"></div>
                            <div class="usat-control-rango"><span>Espaciado</span> <input type="range" id="cfg-espaciado" min="0" max="15" value="${prefs.espaciado}"></div>
                        </div>

                        <div class="usat-panel-footer">
                            <button type="button" class="usat-btn-accion" id="usat-btn-ampliar">⛶ Ampliar</button>
                            <button type="button" class="usat-btn-accion" id="usat-btn-descargar">☁ Descargar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        nodoReferencia.insertAdjacentHTML('afterend', horarioHtml);

        document.getElementById('usat-btn-personalizar').addEventListener('click', function () {
            const body = document.getElementById('usat-body-personalizar');
            body.classList.toggle('activo');
            this.querySelector('span:last-child').innerText = body.classList.contains('activo') ? '⌃' : '⌄';
        });

        aplicarPreferenciasUI(prefs);
        registrarEventosPersonalizacion();
        extraerDatosDirectos(prefs);
        registrarEventosBotones();
    }

    function aplicarPreferenciasUI(prefs) {
        const root = document.documentElement;
        // Aplicar la sombra fuerte solicitada
        root.style.setProperty('--usat-sombra-bloque', prefs.sombras ? '0 6px 12px rgba(0,0,0,0.4)' : 'none');
        // Transformación a mayúsculas
        root.style.setProperty('--usat-txt-transform', prefs.mayusculas ? 'uppercase' : 'none');

        root.style.setProperty('--usat-tam-dias', `${prefs.tamDias}px`);
        root.style.setProperty('--usat-tam-nom', `${prefs.tamNom}px`);
        root.style.setProperty('--usat-tam-hora', `${prefs.tamHora}px`);
        root.style.setProperty('--usat-esp-nom', prefs.espNom);
        root.style.setProperty('--usat-rad-esq', `${prefs.radEsq}px`);
        root.style.setProperty('--usat-anch-col', `minmax(${prefs.anchCol}px, 1fr)`);
        root.style.setProperty('--usat-alt-fil', `${prefs.altFil}px`);
        root.style.setProperty('--usat-espaciado', `${prefs.espaciado}px`);

        const wrapper = document.getElementById('usat-horario-wrapper');
        if (wrapper) {
            prefs.horas ? wrapper.classList.remove('usat-ocultar-horas') : wrapper.classList.add('usat-ocultar-horas');
        }
    }

    function registrarEventosPersonalizacion() {
        const actualizar = () => {
            const prefs = {
                sombras: document.getElementById('cfg-sombras').checked,
                mayusculas: document.getElementById('cfg-mayus').checked,
                horas: document.getElementById('cfg-horas').checked,
                fmt24: document.getElementById('cfg-fmt24').checked,
                diasSinCursos: document.getElementById('cfg-dias-vacios').checked,
                tamDias: document.getElementById('cfg-tam-dias').value,
                tamNom: document.getElementById('cfg-tam-nom').value,
                tamHora: document.getElementById('cfg-tam-hora').value,
                espNom: document.getElementById('cfg-esp-nom').value,
                radEsq: document.getElementById('cfg-rad-esq').value,
                anchCol: document.getElementById('cfg-anch-col').value,
                altFil: document.getElementById('cfg-alt-fil').value,
                espaciado: document.getElementById('cfg-espaciado').value
            };
            localStorage.setItem('usat_horario_prefs', JSON.stringify(prefs));
            aplicarPreferenciasUI(prefs);
            extraerDatosDirectos(prefs); // Se ejecuta de nuevo para volver a dibujar el formato de 24h o los dias vacios
        };

        // Escuchamos el evento input (para los deslizadores) y change (para los checkboxes)
        document.querySelectorAll('#usat-body-personalizar input').forEach(input => {
            input.addEventListener('input', actualizar);
            input.addEventListener('change', actualizar);
        });
    }


    function convertirA24h(rango, formato24 = true) {
        if (!rango) return rango;

        return rango.replace(
            /(\d{1,2}):(\d{2})(?:\s*(AM|PM|A\.?\s*M\.?|P\.?\s*M\.?))?/gi,
            (coincidencia, horaTexto, minutos, sufijo) => {
                let hora = parseInt(horaTexto, 10);

                if (sufijo) {
                    const periodo = sufijo
                        .replace(/\./g, '')
                        .replace(/\s+/g, '')
                        .toUpperCase();

                    if (periodo === 'PM' && hora < 12) hora += 12;
                    if (periodo === 'AM' && hora === 12) hora = 0;
                }

                if (formato24) {
                    return `${String(hora).padStart(2, '0')}:${minutos}`;
                }

                const periodo = hora >= 12 ? 'PM' : 'AM';
                const hora12 = hora % 12 || 12;

                return `${hora12}:${minutos} ${periodo}`;
            }
        );
    }


    async function extraerDatosDirectos(prefs) {
        try {
            let response = await fetch('cursosmatriculados.aspx');
            let html = await response.text();
            let regexCursos = /var\s+_lstCursosMatriculados\s*=\s*(\[.*?\]);/s;
            let matchCursos = html.match(regexCursos);
            let modUSAT = html.match(/id="hdmod"\s+value="(\d+)"/i) ? html.match(/id="hdmod"\s+value="(\d+)"/i)[1] : '2';

            if (matchCursos && matchCursos[1]) {
                dibujarCalendario(JSON.parse(matchCursos[1]), modUSAT, prefs);
            }
        } catch (error) { }
    }

    function dibujarCalendario(cursosRaw, modUSAT, prefs) {
        const coloresGuardados = JSON.parse(localStorage.getItem('usat_colores_horario')) || {};
        const paletaDefault = ['#00bcd4', '#4caf50', '#f44336', '#673ab7', '#ff9800'];
        let colorIndex = 0, mapaColores = {}, diasConClase = new Set();

        ['LU', 'MA', 'MI', 'JU', 'VI', 'SA'].forEach(d => { let c = document.getElementById(`col-${d}`); if (c) c.innerHTML = ''; });


        // Ordenar los cursos por hora de inicio antes de dibujarlos.
        // Así cada columna mostrará las clases de la más temprana a la más tardía.
        const obtenerMinutosInicio = (valor) => {
            const texto = String(valor || '').trim();

            const coincidencia = texto.match(
                /(\d{1,2}):(\d{2})\s*(AM|PM|A\.?\s*M\.?|P\.?\s*M\.?)?/i
            );

            if (!coincidencia) return Number.MAX_SAFE_INTEGER;

            let hora = parseInt(coincidencia[1], 10);
            const minutos = parseInt(coincidencia[2], 10);
            const periodo = (coincidencia[3] || '')
                .replace(/[.\s]/g, '')
                .toUpperCase();

            if (periodo === 'PM' && hora < 12) hora += 12;
            if (periodo === 'AM' && hora === 12) hora = 0;

            return hora * 60 + minutos;
        };

        const cursosOrdenados = [...cursosRaw].sort(
            (a, b) =>
                obtenerMinutosInicio(a.nombre_Hor) -
                obtenerMinutosInicio(b.nombre_Hor)
        );

        cursosOrdenados.forEach(curso => {

            let diaCodigo = (modUSAT === '2') ? curso.dia_Lho : curso.dia_Lho2;
            if (!diaCodigo || diaCodigo.trim() === "") diaCodigo = curso.dia_Lho || curso.dia_Lho2;
            if (!diaCodigo || !curso.nombre_Hor) return;

            diasConClase.add(diaCodigo);
            let nombreLimpio = String(curso.nombre_Cur || '').trim();
            // El nombre original se conserva para identificar/guardar colores; solo cambia su presentación.
            let nombreMostrar = (prefs && prefs.mayusculas)
                ? nombreLimpio.toLocaleUpperCase('es-PE')
                : nombreLimpio;
            if (!mapaColores[nombreLimpio]) {
                mapaColores[nombreLimpio] = coloresGuardados[nombreLimpio] || paletaDefault[colorIndex % paletaDefault.length];
                colorIndex++;
            }

            const columna = document.getElementById(`col-${diaCodigo}`);
            if (columna) {

                const nombreVisible = prefs && prefs.mayusculas
                    ? nombreLimpio.toLocaleUpperCase('es-PE')
                    : nombreLimpio
                        .toLocaleLowerCase('es-PE')
                        .replace(/(^|[.!?]\s+)(\p{L})/gu,
                            (m, inicio, letra) => inicio + letra.toLocaleUpperCase('es-PE'));

                let txtHora = `${curso.nombre_Hor} - ${curso.horaFin_Lho}`;

                txtHora = convertirA24h(
                    txtHora,
                    !!(prefs && prefs.fmt24)
                );

                columna.insertAdjacentHTML(
                    'beforeend',
                    `<div class="usat-curso-bloque"
        data-curso="${nombreLimpio}"
        style="background-color: ${mapaColores[nombreLimpio]};">
        <span class="usat-bloque-hora">${txtHora}</span>
        <span class="usat-bloque-nombre"
            style="text-transform: none !important;">${nombreVisible}</span>
    </div>`
                );
            }
        });

        ['LU', 'MA', 'MI', 'JU', 'VI', 'SA'].forEach(d => {
            let col = document.getElementById(`col-${d}`);
            let head = document.querySelector(`#usat-horario-head div[data-dia="${d}"]`);
            if (col && head) {
                if (!prefs.diasSinCursos && !diasConClase.has(d)) { col.classList.add('usat-col-oculta'); head.classList.add('usat-col-oculta'); }
                else { col.classList.remove('usat-col-oculta'); head.classList.remove('usat-col-oculta'); }
            }
        });
    }

    // Modal Ampliar y Descarga segura CSP
    let escalaModal = 1;
    function registrarEventosBotones() {
        const clonarHorario = (e) => {
            e.preventDefault();
            const zona = document.getElementById('usat-export-zona');
            const clon = document.getElementById('usat-clon-contenedor');
            clon.innerHTML = '';
            const copia = zona.cloneNode(true);
            copia.style.padding = "20px";
            clon.appendChild(copia);
            document.getElementById('usat-modal-ampliar').style.display = 'flex';
            escalaModal = 1; clon.style.transform = `scale(${escalaModal})`;
        };



        const descargarFoto = async (elementoDestino, btnActivo) => {
            const textoOriginal = btnActivo.innerHTML;
            btnActivo.innerHTML = "⏳ Generando PNG...";
            btnActivo.disabled = true;

            try {
                if (!elementoDestino || !elementoDestino.isConnected) {
                    throw new Error("No se encontró el horario que se desea exportar.");
                }

                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

                // Renderizado propio en Canvas: no usa html2canvas ni captura la pestaña.
                // Se toman dimensiones, colores, tipografías y posiciones del horario actual,
                // por lo que se adapta a cada estudiante y a sus preferencias.
                const root = elementoDestino;
                const rootRect = root.getBoundingClientRect();
                const cssWidth = Math.max(root.scrollWidth, root.clientWidth);
                const cssHeight = Math.max(root.scrollHeight, root.clientHeight);
                if (cssWidth <= 0 || cssHeight <= 0) throw new Error("El horario no tiene dimensiones válidas.");

                // En el modal, el contenedor puede estar ampliado con transform: scale().
                // Normalizamos las coordenadas visuales a las dimensiones CSS originales.
                const visualScaleX = root.clientWidth > 0 ? rootRect.width / root.clientWidth : 1;
                const visualScaleY = root.clientHeight > 0 ? rootRect.height / root.clientHeight : 1;
                const sx = visualScaleX || 1;
                const sy = visualScaleY || 1;
                const rectRel = (el) => {
                    const r = el.getBoundingClientRect();
                    return {
                        x: (r.left - rootRect.left) / sx,
                        y: (r.top - rootRect.top) / sy,
                        w: r.width / sx,
                        h: r.height / sy
                    };
                };
                const canvas = document.createElement("canvas");
                const pixelRatio = 2;
                canvas.width = Math.ceil(cssWidth * pixelRatio);
                canvas.height = Math.ceil(cssHeight * pixelRatio);
                const ctx = canvas.getContext("2d");
                if (!ctx) throw new Error("No se pudo crear el lienzo de la imagen.");
                ctx.scale(pixelRatio, pixelRatio);
                ctx.fillStyle = getComputedStyle(root).backgroundColor;
                if (!ctx.fillStyle || ctx.fillStyle === "rgba(0, 0, 0, 0)") ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, cssWidth, cssHeight);

                const roundRect = (x, y, w, h, radius) => {
                    const r = Math.max(0, Math.min(Number(radius) || 0, w / 2, h / 2));
                    ctx.beginPath();
                    ctx.moveTo(x + r, y);
                    ctx.arcTo(x + w, y, x + w, y + h, r);
                    ctx.arcTo(x + w, y + h, x, y + h, r);
                    ctx.arcTo(x, y + h, x, y, r);
                    ctx.arcTo(x, y, x + w, y, r);
                    ctx.closePath();
                };
                const parsePx = (value, fallback = 0) => {
                    const n = parseFloat(value);
                    return Number.isFinite(n) ? n : fallback;
                };
                const getColor = (el, prop, fallback) => {
                    const value = getComputedStyle(el)[prop];
                    return value && value !== "rgba(0, 0, 0, 0)" ? value : fallback;
                };
                const wrapText = (text, maxWidth, font) => {
                    ctx.font = font;
                    const lines = [];
                    const paragraphs = String(text || "").split(/\n/);
                    paragraphs.forEach(paragraph => {
                        const words = paragraph.trim().split(/\s+/).filter(Boolean);
                        if (!words.length) { lines.push(""); return; }
                        let line = "";
                        words.forEach(word => {
                            const candidate = line ? `${line} ${word}` : word;
                            if (ctx.measureText(candidate).width <= maxWidth || !line) {
                                if (ctx.measureText(candidate).width <= maxWidth) {
                                    line = candidate;
                                } else {
                                    // Divide también palabras largas para nombres sin espacios.
                                    let fragment = "";
                                    for (const char of word) {
                                        if (fragment && ctx.measureText(fragment + char).width > maxWidth) {
                                            lines.push(fragment);
                                            fragment = char;
                                        } else fragment += char;
                                    }
                                    line = fragment;
                                }
                            } else {
                                lines.push(line);
                                line = word;
                            }
                        });
                        if (line) lines.push(line);
                    });
                    return lines.length ? lines : [""];
                };

                // Fondo y encabezados de los días.
                const header = root.querySelector(".usat-grid-header");
                const body = root.querySelector(".usat-grid-body");
                if (!header || !body) throw new Error("No se encontraron las filas del calendario.");
                const hr = rectRel(header);
                ctx.fillStyle = getColor(header, "backgroundColor", "#87ceeb");
                ctx.fillRect(hr.x, hr.y, hr.w, hr.h);
                header.querySelectorAll("[data-dia]").forEach(day => {
                    const r = rectRel(day);
                    const cs = getComputedStyle(day);
                    const fontSize = parsePx(cs.fontSize, 12);
                    ctx.fillStyle = cs.color || "#0f172a";
                    ctx.font = `${cs.fontWeight || "bold"} ${fontSize}px ${cs.fontFamily || "Arial, sans-serif"}`;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText((day.textContent || "").trim(), r.x + r.w / 2, r.y + r.h / 2, Math.max(1, r.w - 4));
                });

                // Área de días y bordes punteados, respetando columnas visibles/ocultas.
                const br = rectRel(body);
                ctx.fillStyle = getColor(body, "backgroundColor", "#ffffff");
                ctx.fillRect(br.x, br.y, br.w, br.h);
                const columns = Array.from(body.querySelectorAll(".usat-dia-col"));
                columns.forEach(col => {
                    if (getComputedStyle(col).display === "none") return;
                    const r = rectRel(col);
                    const cs = getComputedStyle(col);
                    ctx.fillStyle = getColor(col, "backgroundColor", "#ffffff");
                    ctx.fillRect(r.x, r.y, r.w, r.h);
                    ctx.strokeStyle = "#e2e8f0";
                    ctx.lineWidth = 1;
                    ctx.setLineDash([4, 3]);
                    ctx.beginPath();
                    ctx.moveTo(r.x, r.y);
                    ctx.lineTo(r.x, r.y + r.h);
                    ctx.lineTo(r.x + r.w, r.y + r.h);
                    ctx.lineTo(r.x + r.w, r.y);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    // Reproduce las líneas horizontales suaves del fondo sin depender de CSS gradients.
                    for (let y = r.y + 40; y < r.y + r.h; y += 40) {
                        ctx.strokeStyle = "#e2e8f0";
                        ctx.lineWidth = 0.7;
                        ctx.beginPath(); ctx.moveTo(r.x, y); ctx.lineTo(r.x + r.w, y); ctx.stroke();
                    }
                });

                // Bloques de cursos. El texto se mide y se ajusta dinámicamente a cada bloque.
                root.querySelectorAll(".usat-curso-bloque").forEach(block => {
                    if (getComputedStyle(block).display === "none") return;
                    const r = rectRel(block);
                    if (r.w <= 0 || r.h <= 0) return;
                    const cs = getComputedStyle(block);
                    const padding = Math.max(2, parsePx(cs.paddingTop, 6));
                    const radius = parsePx(cs.borderTopLeftRadius, 4);
                    const bg = getColor(block, "backgroundColor", "#4caf50");

                    ctx.save();
                    if (cs.boxShadow && cs.boxShadow !== "none") {
                        ctx.shadowColor = "rgba(0,0,0,0.22)";
                        ctx.shadowBlur = 5;
                        ctx.shadowOffsetX = 0;
                        ctx.shadowOffsetY = 2;
                    }
                    ctx.fillStyle = bg;
                    roundRect(r.x, r.y, r.w, r.h, radius);
                    ctx.fill();
                    ctx.restore();

                    const hourEl = block.querySelector(".usat-bloque-hora");
                    const nameEl = block.querySelector(".usat-bloque-nombre");
                    const showHour = hourEl && getComputedStyle(hourEl).display !== "none";
                    const nameText = nameEl ? nameEl.textContent.trim() : (block.getAttribute("data-curso") || "");
                    const hourText = showHour ? hourEl.textContent.trim() : "";
                    const hourStyle = hourEl ? getComputedStyle(hourEl) : null;
                    const nameStyle = nameEl ? getComputedStyle(nameEl) : cs;
                    let hourSize = hourStyle ? parsePx(hourStyle.fontSize, 9) : 9;
                    let nameSize = nameStyle ? parsePx(nameStyle.fontSize, 10) : 10;
                    const hourWeight = hourStyle ? hourStyle.fontWeight : "bold";
                    const nameWeight = nameStyle ? nameStyle.fontWeight : "600";
                    const hourFamily = hourStyle ? hourStyle.fontFamily : "Arial, sans-serif";
                    const nameFamily = nameStyle ? nameStyle.fontFamily : "Arial, sans-serif";
                    const textWidth = Math.max(8, r.w - padding * 2 - 4);
                    const availableHeight = Math.max(8, r.h - padding * 2);
                    let hourFont = `${hourWeight} ${hourSize}px ${hourFamily}`;
                    let nameFont = `${nameWeight} ${nameSize}px ${nameFamily}`;
                    let hourLineHeight = Math.max(hourSize * 1.2, 8);
                    // La hora tiene una etiqueta oscura en la vista web. Leemos
                    // su fondo, radio y padding reales para reproducirlos en el PNG.
                    const hourBg = hourStyle ? getColor(hourEl, "backgroundColor", "rgba(0, 0, 0, 0.15)") : "rgba(0, 0, 0, 0.15)";
                    const hourRadius = hourStyle ? parsePx(hourStyle.borderTopLeftRadius, 3) : 3;
                    const hourPadX = hourStyle ? parsePx(hourStyle.paddingLeft, 4) : 4;
                    const hourPadY = hourStyle ? parsePx(hourStyle.paddingTop, 2) : 2;
                    const hourPadBottom = hourStyle ? parsePx(hourStyle.paddingBottom, 2) : 2;
                    let hourBadgeHeight = hourLineHeight + hourPadY + hourPadBottom;
                    let nameLineHeight = Math.max(nameSize * Math.max(1, parsePx(nameStyle.lineHeight, nameSize * 1.1) / Math.max(nameSize, 1)), nameSize);
                    let nameLines = wrapText(nameText, textWidth, nameFont);
                    let totalHeight = (showHour ? hourBadgeHeight + 3 : 0) + nameLines.length * nameLineHeight;

                    // Si un curso tiene un nombre largo, reducir tipografía de forma proporcional
                    // hasta que quepa en su bloque; no se usa un nombre ni una altura fija por curso.
                    while (totalHeight > availableHeight && nameSize > 6) {
                        nameSize -= 0.5;
                        nameFont = `${nameWeight} ${nameSize}px ${nameFamily}`;
                        nameLineHeight = Math.max(nameSize, Math.min(nameSize * 1.25, parsePx(nameStyle.lineHeight, nameSize * 1.1)));
                        nameLines = wrapText(nameText, textWidth, nameFont);
                        if (showHour && hourSize > 7) {
                            hourSize -= 0.25;
                            hourFont = `${hourWeight} ${hourSize}px ${hourFamily}`;
                            hourLineHeight = Math.max(hourSize * 1.15, 7);
                        }
                        hourBadgeHeight = hourLineHeight + hourPadY + hourPadBottom;
                        totalHeight = (showHour ? hourBadgeHeight + 3 : 0) + nameLines.length * nameLineHeight;
                    }
                    if (totalHeight > availableHeight) {
                        nameLines = wrapText(nameText, textWidth, nameFont);
                        const maxLines = Math.max(1, Math.floor((availableHeight - (showHour ? hourBadgeHeight + 3 : 0)) / nameLineHeight));
                        if (nameLines.length > maxLines) nameLines = nameLines.slice(0, maxLines);
                    }

                    let y = r.y + (r.h - totalHeight) / 2;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "top";
                    if (showHour) {
                        ctx.font = hourFont;
                        const hourMetrics = ctx.measureText(hourText);
                        const badgeWidth = Math.min(
                            textWidth,
                            hourMetrics.width + hourPadX * 2
                        );
                        // Fondo semitransparente redondeado, igual al indicador web.
                        ctx.save();
                        ctx.fillStyle = hourBg;
                        roundRect(
                            r.x + (r.w - badgeWidth) / 2,
                            y,
                            badgeWidth,
                            hourBadgeHeight,
                            hourRadius
                        );
                        ctx.fill();
                        ctx.restore();

                        ctx.fillStyle = getColor(hourEl, "color", "#ffffff");
                        ctx.textBaseline = "top";
                        ctx.fillText(hourText, r.x + r.w / 2, y + hourPadY, textWidth);
                        y += hourBadgeHeight + 3;
                    }
                    ctx.font = nameFont;
                    ctx.fillStyle = getColor(nameEl, "color", "#ffffff");
                    nameLines.forEach(line => {
                        ctx.fillText(line, r.x + r.w / 2, y, textWidth);
                        y += nameLineHeight;
                    });
                });

                const blob = await new Promise((resolve, reject) => {
                    canvas.toBlob(result => result ? resolve(result) : reject(new Error("No se pudo generar el PNG.")), "image/png");
                });
                const url = URL.createObjectURL(blob);
                const enlace = document.createElement("a");
                enlace.download = "Mi_Horario_USAT.png";
                enlace.href = url;
                enlace.style.display = "none";
                document.body.appendChild(enlace);
                enlace.click();
                enlace.remove();
                setTimeout(() => URL.revokeObjectURL(url), 10000);
                btnActivo.innerHTML = "✓ Descargado";
            } catch (error) {
                console.error("Error al generar el PNG del horario:", error);
                btnActivo.innerHTML = "❌ Error";
                alert("No se pudo generar el PNG del horario.\n\n" + (error?.message || "Revisa la consola con F12."));
            } finally {
                btnActivo.disabled = false;
                setTimeout(() => { btnActivo.innerHTML = textoOriginal; }, 2000);
            }
        };


        document.getElementById('usat-btn-ampliar').addEventListener('click', clonarHorario);
        document.getElementById('usat-mod-close').addEventListener('click', (e) => { e.preventDefault(); document.getElementById('usat-modal-ampliar').style.display = 'none'; });

        document.getElementById('usat-mod-mas').addEventListener('click', (e) => { e.preventDefault(); escalaModal += 0.1; document.getElementById('usat-clon-contenedor').style.transform = `scale(${escalaModal})`; });
        document.getElementById('usat-mod-menos').addEventListener('click', (e) => { e.preventDefault(); escalaModal -= 0.1; document.getElementById('usat-clon-contenedor').style.transform = `scale(${escalaModal})`; });

        document.getElementById('usat-btn-descargar').addEventListener('click', function (e) { e.preventDefault(); descargarFoto(document.getElementById('usat-export-zona'), this); });
        document.getElementById('usat-mod-dl').addEventListener('click', function (e) { e.preventDefault(); descargarFoto(document.querySelector('#usat-clon-contenedor .usat-calendario-container'), this); });
    }

    // Eventos Popover
    document.addEventListener('click', (e) => {
        const bloque = e.target.closest('.usat-curso-bloque');
        if (!bloque && !e.target.closest('#usat-popover-horario')) { popover.style.display = 'none'; return; }

        if (bloque && !e.target.closest('#usat-modal-ampliar')) {
            e.preventDefault(); e.stopPropagation();
            cursoActualSeleccionado = bloque.getAttribute('data-curso');
            document.getElementById('usat-pop-curso-nombre').innerText = cursoActualSeleccionado;


            const colorActual = getComputedStyle(bloque).backgroundColor;

            // Sincronizar el color del selector y del menú con el curso.
            const coincidenciaRGB = colorActual.match(
                /rgba?\((\d+),\s*(\d+),\s*(\d+)/
            );

            if (coincidenciaRGB) {
                const aHex = valor =>
                    Number(valor).toString(16).padStart(2, '0');

                document.getElementById('usat-pop-color').value =
                    '#' +
                    aHex(coincidenciaRGB[1]) +
                    aHex(coincidenciaRGB[2]) +
                    aHex(coincidenciaRGB[3]);
            }

            popover.style.setProperty('--usat-popover-color', colorActual);

            const rect = bloque.getBoundingClientRect();

            // Mostrar primero para poder medir el menú.
            popover.style.display = 'flex';

            const anchoMenu = popover.offsetWidth;
            const margen = 8;

            // Centrar el menú en el curso sin que se salga de la pantalla.
            const centroCurso = rect.left + rect.width / 2;
            const izquierda = Math.max(
                margen,
                Math.min(
                    centroCurso - anchoMenu / 2,
                    window.innerWidth - anchoMenu - margen
                )
            );

            popover.style.left = `${izquierda + window.scrollX}px`;
            popover.style.top = `${rect.bottom + window.scrollY + 8}px`;

            // Mantener la flecha apuntando al centro del curso,
            // incluso cuando el menú se desplaza para caber en pantalla.
            const posicionFlecha = Math.max(
                14,
                Math.min(centroCurso - izquierda, anchoMenu - 14)
            );

            popover.style.setProperty(
                '--usat-flecha-x',
                `${posicionFlecha}px`
            );

        }
    });




    // Guardar y aplicar el nuevo color a todas las clases del mismo curso.
    document.getElementById('usat-pop-color').addEventListener('input', (e) => {
        const nuevoColor = e.target.value;

        if (!cursoActualSeleccionado) return;

        const colores =
            JSON.parse(localStorage.getItem('usat_colores_horario')) || {};

        colores[cursoActualSeleccionado] = nuevoColor;

        localStorage.setItem(
            'usat_colores_horario',
            JSON.stringify(colores)
        );

        document.querySelectorAll('.usat-curso-bloque').forEach(b => {
            if (b.getAttribute('data-curso') === cursoActualSeleccionado) {
                b.style.backgroundColor = nuevoColor;
            }
        });

        // Actualizar también el fondo del menú y su flecha.
        popover.style.setProperty('--usat-popover-color', nuevoColor);
    });



    document.getElementById('usat-pop-btn-notas').addEventListener('click', () => {
        const nombreCurso = cursoActualSeleccionado;

        if (!nombreCurso) {
            console.warn('[Campus Plus] No se ha seleccionado un curso.');
            popover.style.display = 'none';
            return;
        }

        sessionStorage.setItem('usat_auto_notas', nombreCurso);
        popover.style.display = 'none';

        // Normalizar nombres: ignora tildes, mayúsculas y la sección
        // final del curso, por ejemplo "(A)" o "(J)".
        const normalizar = (texto) => (texto || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase()
            .replace(/\s*\([A-Z0-9]+\)\s*$/, '')
            .replace(/\s+/g, ' ')
            .trim();

        const nombreBuscado = normalizar(nombreCurso);

        // Usar el mismo mecanismo que el acceso principal Calificaciones.
        const enlacesMenu = document.querySelectorAll('a');
        let enlaceCalificaciones = null;

        for (const enlace of enlacesMenu) {
            const onclick = enlace.getAttribute('onclick') || '';

            if (onclick.includes('calificadorestudiante.aspx')) {
                enlaceCalificaciones = enlace;
                break;
            }
        }

        if (!enlaceCalificaciones) {
            console.error(
                '[Campus Plus] No se encontró Calificaciones.'
            );
            alert('No se encontró el acceso a Calificaciones del campus.');
            return;
        }

        // Abrir la sección sin cambiar de página completa.
        enlaceCalificaciones.click();


        let intentos = 0;
        const maxIntentos = 120;

        // Busca el selector en la página principal y en sus iframes.
        function buscarSelectorCursoNotas(doc) {
            if (!doc) return null;

            const selector = doc.querySelector('#ddlCurso');
            if (selector) return selector;

            const marcos = doc.querySelectorAll('iframe, frame');

            for (const marco of marcos) {
                try {
                    const documentoMarco =
                        marco.contentDocument ||
                        marco.contentWindow?.document;

                    const resultado =
                        buscarSelectorCursoNotas(documentoMarco);

                    if (resultado) return resultado;
                } catch (error) {
                    // Ignorar marcos a los que no se pueda acceder.
                }
            }

            return null;
        }

        const buscarCurso = setInterval(() => {
            intentos++;

            const selector = buscarSelectorCursoNotas(document);

            if (selector) {
                const opciones = Array.from(selector.options);

                // Coincidencia exacta ignorando tildes, mayúsculas
                // y el sufijo de sección, por ejemplo (A) o (J).
                const opcion = opciones.find(option =>
                    option.value &&
                    option.value !== '-1' &&
                    normalizar(option.textContent) === nombreBuscado
                );

                if (opcion) {
                    clearInterval(buscarCurso);

                    selector.value = opcion.value;

                    // Disparar el evento desde el documento propietario
                    // del selector para activar el comportamiento del campus.
                    const ventana = selector.ownerDocument.defaultView;
                    const evento = new ventana.Event('change', {
                        bubbles: true
                    });

                    selector.dispatchEvent(evento);

                    sessionStorage.removeItem('usat_auto_notas');

                    

                    return;
                }
            }

            if (intentos >= maxIntentos) {
                clearInterval(buscarCurso);

                

                alert(
                    'Calificaciones se abrió, pero no se pudo seleccionar "' +
                    nombreCurso +
                    '". Comprueba que esté disponible en el semestre actual.'
                );
            }
        }, 250);

    });

    document.getElementById('usat-pop-btn-aula').addEventListener('click', () => {
        popover.style.display = 'none';
        
        if (!cursoActualSeleccionado) return;

        // 1. Limpiamos el nombre del horario para que coincida con Moodle (quitamos " - A (SIS)" etc.)
        const nombreBuscado = cursoActualSeleccionado.replace(/\d{4}-.{1,2}\s*-\s*/, '').trim().toLowerCase();
        
        // 2. Recuperamos el diccionario de IDs extraído silenciosamente por el Módulo 8
        const diccionarioRAW = sessionStorage.getItem('usat_diccionario_ids_moodle');
        let idMoodle = null;

        if (diccionarioRAW) {
            try {
                const diccionarioIDs = JSON.parse(diccionarioRAW);
                // Buscamos coincidencia
                for (const [nombreMoodle, id] of Object.entries(diccionarioIDs)) {
                    if (nombreMoodle.includes(nombreBuscado) || nombreBuscado.includes(nombreMoodle)) {
                        idMoodle = id;
                        break;
                    }
                }
            } catch (e) { 
                console.error(e); 
            }
        }

        // 3. Abrimos la ventana flotante nativa del Módulo 8
        if (typeof window.abrirAulaVirtualModal === 'function') {
            if (idMoodle) {
                
                window.abrirAulaVirtualModal(`https://intranet.usat.edu.pe/aulavirtual/course/view.php?id=${idMoodle}`);
            } else {
                
                window.abrirAulaVirtualModal('https://intranet.usat.edu.pe/aulavirtual/my/');
            }
        } else {
            alert("Error: El Módulo del Aula Virtual (Dashboard) no está cargado.");
        }
    });
}
