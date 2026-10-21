// EMULADOR DE API CHROME PARA ENTORNO MAIN
if (typeof chrome === 'undefined') {
    window.chrome = {};
}
if (!chrome.extension) {
    chrome.extension = { inIncognitoContext: false };
}
if (!chrome.runtime) {
    chrome.runtime = { sendMessage: function(msg, cb) { if(cb) cb(); } };
}
if (!chrome.storage) {
    chrome.storage = {
        local: {
            get: function(keys, callback) {
                let result = {};
                try {
                    let keyArray = Array.isArray(keys) ? keys : [keys];
                    keyArray.forEach(k => {
                        let val = localStorage.getItem('usat_pro_' + k);
                        if (val !== null) result[k] = JSON.parse(val);
                    });
                } catch(e) {}
                if (callback) callback(result);
            },
            set: function(items, callback) {
                try {
                    for (let k in items) {
                        localStorage.setItem('usat_pro_' + k, JSON.stringify(items[k]));
                    }
                } catch(e) {}
                if (callback) callback();
            }
        },
        onChanged: { addListener: function() {} }
    };
}
console.log("Extensión del campus cargada");

// =========================================
// DICCIONARIO CENTRAL DE ICONOS SVG (Cero Emojis de Windows)
// =========================================
const ICONOS_USAT = {
    alertaBlanco: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    llaveBlanco: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`,
    calculadora: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16" y2="18"></line><path d="M16 10h.01"></path><path d="M12 10h.01"></path><path d="M8 10h.01"></path><path d="M12 14h.01"></path><path d="M8 14h.01"></path><path d="M12 18h.01"></path><path d="M8 18h.01"></path></svg>`,
    cerrarBlanco: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    cerrarOscuro: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
    documento: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`,
    reloj: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    checkBlanco: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
    tareasPortapapeles: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><line x1="9" y1="12" x2="15" y2="12"></line><line x1="9" y1="16" x2="15" y2="16"></line></svg>`,
    calendarioGris: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
    chinchetaHueca: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`,
    chinchetaSolida: `<svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>`,
    ojo: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    copiar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
    descargar: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`
};

function forzarIngreso() {
    const loginBtn = document.querySelector('#lnkbtnIngresar');
    if (loginBtn) {
        loginBtn.removeAttribute('href');
        loginBtn.click();
        const eventTarget = document.getElementById('__EVENTTARGET');
        const eventArgument = document.getElementById('__EVENTARGUMENT');
        const form = document.forms[0];
        if (eventTarget && form) {
            eventTarget.value = 'lnkbtnIngresar';
            if (eventArgument) eventArgument.value = '';
            form.submit();
        }
    }
}

// =========================================
// MÓDULO 2: AUTO-REDIRECCIÓN
// =========================================
function initAutoRedirect() {
    const btnAccedeAqui = document.querySelector('a[href="https://intranet.usat.edu.pe/campusestudiante/Alumno.aspx"]');
    if (btnAccedeAqui) {
        if (chrome.extension.inIncognitoContext) {
            btnAccedeAqui.click();
            return;
        }
        chrome.storage.local.get(['autoRedirectEnabled'], (result) => {
            if (result.autoRedirectEnabled !== false) btnAccedeAqui.click();
        });
    }
}

// =========================================
// MÓDULO 9: GUARDIÁN DE SESIÓN (ANTI-TIMEOUT)
// =========================================
function initGuardianSesion() {
    if (!window.location.href.includes('usat.edu.pe')) return;

    const intervaloPing = 20 * 60 * 1000;

    setInterval(() => {
        fetch('https://intranet.usat.edu.pe/aulavirtual/my/')
            .then(response => {
                if (response.ok) {
                    console.log(`Guardián USAT: Sesión mantenida activa (${new Date().toLocaleTimeString()})`);
                }
            })
            .catch(error => {
                console.log('Guardián USAT: Error al hacer ping al servidor', error);
            });
    }, intervaloPing);
}
// =========================================
// MÓDULO 1: AUTO-LOGIN Y GESTIÓN DE CREDENCIALES
// =========================================
function initAutoLogin() {
    const esIncognito = chrome.extension.inIncognitoContext;
    const userInput = document.querySelector('#txtUsername');
    const passInput = document.querySelector('#txtPassword');
    const loginBtn = document.querySelector('#lnkbtnIngresar');

    if (!userInput || !passInput || !loginBtn) {
        sessionStorage.removeItem('intentoFallidoUSAT');
        return;
    }

    if (esIncognito) {
        const incognitoUser = sessionStorage.getItem('incognitoUser');
        const incognitoPass = sessionStorage.getItem('incognitoPass');

        if (incognitoUser && incognitoPass) {
            const yaIntentado = sessionStorage.getItem('intentoFallidoUSAT');
            if (!yaIntentado) {
                userInput.value = incognitoUser;
                passInput.value = incognitoPass;
                sessionStorage.setItem('intentoFallidoUSAT', 'true');
                forzarIngreso(); // Llama a la función global que está en 00_utilidades.js
            } else {
                mostrarBotonActualizar(loginBtn, userInput, passInput, true);
            }
        } else {
            injectConfigUI(userInput, passInput, loginBtn, true);
        }
    } else {
        chrome.storage.local.get(['usatUser', 'usatPass'], (result) => {
            if (result.usatUser && result.usatPass) {
                const yaIntentado = sessionStorage.getItem('intentoFallidoUSAT');
                if (!yaIntentado) {
                    userInput.value = result.usatUser;
                    passInput.value = result.usatPass;
                    sessionStorage.setItem('intentoFallidoUSAT', 'true');
                    forzarIngreso();
                } else {
                    mostrarBotonActualizar(loginBtn, userInput, passInput, false);
                }
            } else {
                injectConfigUI(userInput, passInput, loginBtn, false);
            }
        });
    }
}

function mostrarBotonActualizar(loginBtn, userInput, passInput, esIncognito) {
    if (document.querySelector('.btn-extension-error')) return;
    const updateBtn = document.createElement('button');
    updateBtn.innerHTML = `${ICONOS_USAT.alertaBlanco}<span>Credenciales Incorrectas - Actualizar</span>`;
    updateBtn.type = 'button';
    updateBtn.className = 'btn-extension-config btn-extension-error';
    updateBtn.style.display = 'inline-flex';
    updateBtn.style.alignItems = 'center';
    updateBtn.style.justifyContent = 'center';
    updateBtn.style.gap = '8px';

    updateBtn.addEventListener('click', () => {
        const nuevoUser = userInput.value.trim();
        const nuevaPass = passInput.value.trim();
        if (nuevoUser && nuevaPass) {
            if (esIncognito) {
                sessionStorage.setItem('incognitoUser', nuevoUser);
                sessionStorage.setItem('incognitoPass', nuevaPass);
                alert('Nuevas credenciales de incógnito guardadas solo para esta pestaña.');
                sessionStorage.removeItem('intentoFallidoUSAT');
                forzarIngreso();
            } else {
                chrome.storage.local.set({ usatUser: nuevoUser, usatPass: nuevaPass }, () => {
                    alert('Nuevas credenciales guardadas. Intentando ingresar de nuevo...');
                    sessionStorage.removeItem('intentoFallidoUSAT');
                    forzarIngreso();
                });
            }
        } else {
            alert('Por favor, escribe tus nuevas credenciales correctas en los campos de arriba.');
        }
    });
    loginBtn.parentElement.appendChild(updateBtn);
}

function injectConfigUI(userInput, passInput, loginBtn, esIncognito) {
    const configBtn = document.createElement('button');
    configBtn.innerHTML = `${ICONOS_USAT.llaveBlanco}<span>Configurar acceso automático</span>`;
    configBtn.type = 'button';
    configBtn.className = 'btn-extension-config';
    configBtn.style.display = 'inline-flex';
    configBtn.style.alignItems = 'center';
    configBtn.style.justifyContent = 'center';
    configBtn.style.gap = '8px';

    configBtn.addEventListener('click', () => {
        const userVal = userInput.value.trim();
        const passVal = passInput.value.trim();
        if (userVal && passVal) {
            if (esIncognito) {
                sessionStorage.setItem('incognitoUser', userVal);
                sessionStorage.setItem('incognitoPass', passVal);
                alert('Credenciales temporales guardadas (Se borrarán al cerrar el incógnito).');
                forzarIngreso();
            } else {
                chrome.storage.local.set({ usatUser: userVal, usatPass: passVal }, () => {
                    alert('Credenciales guardadas en tu navegador. Ingreso automatizado activado.');
                    forzarIngreso();
                });
            }
        } else {
            alert('Por favor, ingresa tu Código Universitario y Contraseña antes de guardar.');
        }
    });
    loginBtn.parentElement.appendChild(configBtn);
}
// =========================================
// MÓDULO 2: BLOQUEADOR DE ANUNCIOS INTELIGENTE
// =========================================
function initAdBlocker() {
    const contenedorAnuncios = document.getElementById('id_anuncios_modal');
    if (!contenedorAnuncios) return;
    
    const modales = contenedorAnuncios.querySelectorAll('.div_anuncio_modal');
    if (modales.length === 0) return;

    const ahora = new Date().getTime();
    const LIMITE_HORAS = 10; // Límite de vida del anuncio más reciente
    let anunciosVisiblesCount = 0;

    let registroAnuncios = JSON.parse(localStorage.getItem('usat_registro_anuncios') || '{}');

    let toastContainer = document.getElementById('usat-toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'usat-toast-container';
        document.body.appendChild(toastContainer);

        // Proteger los iconos SVG de los estilos globales de Moodle
        const fixSvgStyle = document.createElement('style');
        fixSvgStyle.innerHTML = `
            .usat-toast-text svg {
                width: 16px !important;
                height: 16px !important;
                min-width: 16px !important;
                min-height: 16px !important;
                display: block !important;
                flex-shrink: 0 !important;
            }
            /* FIX ADICIONAL: Forzar la eliminación del espacio a la derecha si no hay modales */
            body:not(.modal-open) {
                padding-right: 0 !important;
                overflow-y: auto !important;
            }
        `;
        document.head.appendChild(fixSvgStyle);
    }

    const checkBackdrop = (visibles) => {
        if (visibles > 0) {
            contenedorAnuncios.style.display = 'block';
            document.body.classList.add('modal-open');
            let backdrop = document.querySelector('.modal-backdrop');
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop fade in';
                document.body.appendChild(backdrop);
            } else {
                backdrop.style.display = 'block';
            }
        } else {
            contenedorAnuncios.style.display = 'none';
            document.body.classList.remove('modal-open');
            
            // FIX: Limpiamos los estilos residuales (el margen derecho vacío) que Bootstrap inyecta por defecto
            document.body.style.paddingRight = '';
            document.body.style.overflow = '';
            
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) backdrop.style.display = 'none';
        }
    };

    modales.forEach((modal, index) => {
        const tituloElemento = modal.querySelector('.modal-title');
        const titulo = tituloElemento ? tituloElemento.innerText.trim() : `Anuncio_Desconocido_${index}`;

        if (!registroAnuncios[titulo]) {
            registroAnuncios[titulo] = ahora;
        }

        const tiempoPrimeraVez = registroAnuncios[titulo];
        const horasTranscurridas = (ahora - tiempoPrimeraVez) / (1000 * 60 * 60);

        const esElMasNuevo = (index === modales.length - 1);
        const estaDentroDelTiempo = (horasTranscurridas <= LIMITE_HORAS);

        if (esElMasNuevo && estaDentroDelTiempo) {
            modal.style.display = 'block';
            modal.classList.add('in');
            anunciosVisiblesCount++;

            const horasRestantes = Math.ceil(LIMITE_HORAS - horasTranscurridas);
            setTimeout(() => lanzarToastInfo(horasRestantes, toastContainer), 400);

        } else {
            modal.style.display = 'none';
            lanzarToastEliminado(modal, titulo, toastContainer, checkBackdrop);
        }
    });

    localStorage.setItem('usat_registro_anuncios', JSON.stringify(registroAnuncios));
    checkBackdrop(anunciosVisiblesCount);

    function lanzarToastEliminado(modalTarget, titulo, container, callbackBackdrop) {
        const toast = document.createElement('div');
        toast.className = 'usat-toast';
        toast.innerHTML = `
            <span class="usat-toast-text" style="display: flex; align-items: center; gap: 6px;">
                ${ICONOS_USAT.alertaBlanco.replace('#ffffff', '#38bdf8')}
                Modal "${titulo}" removido
            </span>
            <button class="usat-toast-btn">VER</button>
            <div class="usat-toast-progress"></div>
        `;
        
        const btnVer = toast.querySelector('.usat-toast-btn');
        btnVer.addEventListener('click', () => {
            toast.remove();
            modalTarget.style.display = 'block';
            modalTarget.classList.add('in');
            callbackBackdrop(1);
        });
        
        container.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    function lanzarToastInfo(horasRestantes, container) {
        const toast = document.createElement('div');
        toast.className = 'usat-toast';
        toast.style.borderLeftColor = '#10b981'; 
        toast.innerHTML = `
            <span class="usat-toast-text" style="display: flex; align-items: center; gap: 6px; color: #065f46;">
                ${ICONOS_USAT.reloj.replace('#ffffff', '#10b981')}
                El anuncio visible se ocultará en ${horasRestantes} hora(s)
            </span>
            <div class="usat-toast-progress" style="background-color: #10b981;"></div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                toast.style.animation = 'fadeOut 0.3s forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }
}
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
// =========================================
// MÓDULO 4.1: LIMPIEZA DE VISTA DE CURSOS
// =========================================
function initCourseFilter() {
    if (!document.getElementById('css-limpieza-cursos')) {
        const style = document.createElement('style');
        style.id = 'css-limpieza-cursos';
        style.textContent = `
            .block_myoverview [data-region="filter"] {
                clear: both !important;
                margin-top: 8px !important;
                margin-bottom: 14px !important;
            }
            .block_myoverview [data-region="courses-view"] {
                clear: both !important;
                margin-top: 12px !important;
                margin-bottom: 14px !important;
            }
            .block_myoverview [data-region="paging-bar-container"] {
                clear: both !important;
                margin-top: 10px !important;
            }

            .paged-content-page-container [data-region="paged-content-page"]:not(.hidden) .list-group { 
                display: grid !important; 
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important; 
                gap: 14px !important; 
                border: none !important; 
                width: 100% !important; 
            }

            .paged-content-page-container .list-group .list-group-item { 
                position: relative !important;
                cursor: pointer !important;
                padding: 0 15px !important; 
                margin-bottom: 0 !important; 
                border-radius: 8px !important; 
                border: 1px solid #cbd5e1 !important; 
                background-color: #ffffff !important;
                box-shadow: 0 2px 5px rgba(15, 23, 42, 0.06) !important;
                height: 42px !important; 
                min-height: 42px !important;
                max-height: 42px !important;
                display: flex !important; 
                align-items: center !important; 
                overflow: hidden !important; 
                transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease !important;
            }

            .paged-content-page-container .list-group .list-group-item:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 8px rgba(15, 23, 42, 0.1) !important;
                border-color: #dc2626 !important;
            }

            .paged-content-page-container .list-group .list-group-item .text-muted, 
            .paged-content-page-container .list-group .list-group-item .col-md-1, 
            .paged-content-page-container .list-group .list-group-item .progress, 
            .paged-content-page-container .list-group .list-group-item .text-muted.small { 
                display: none !important; 
            }

            .paged-content-page-container .list-group .list-group-item .row, 
            .paged-content-page-container .list-group .list-group-item .col-md-11 { 
                margin: 0 !important; 
                padding: 0 !important; 
                width: 100% !important; 
                min-width: 0 !important; 
            }

            .paged-content-page-container .list-group .list-group-item .coursename { 
                font-size: 12px !important; 
                font-weight: 600 !important;
                color: #1e293b !important;
                white-space: nowrap !important; 
                overflow: hidden !important; 
                text-overflow: ellipsis !important; 
                display: block !important; 
                width: 100% !important; 
                text-decoration: none !important;
                outline: none !important;
            }

            .paged-content-page-container .list-group .list-group-item:hover .coursename {
                color: #dc2626 !important;
            }

            .paged-content-page-container .list-group .list-group-item a.coursename::after {
                content: "" !important;
                position: absolute !important;
                inset: 0 !important;
                z-index: 5 !important;
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        const dropdownProgreso = document.querySelector('#groupingdropdown span');
        const btnProgreso = document.querySelector('a[data-filter="grouping"][data-value="inprogress"]');

        if (dropdownProgreso && btnProgreso && !dropdownProgreso.innerText.includes('En progreso')) {
            btnProgreso.click();
        }

        setTimeout(() => {
            const dropdownVista = document.querySelector('#displaydropdown span');
            const btnLista = document.querySelector('a[data-display-option="display"][data-value="list"]');

            if (dropdownVista && btnLista && !dropdownVista.innerText.includes('Lista')) {
                btnLista.click();
            }
        }, 500);

    }, 1500);
}

// =========================================
// MÓDULO 4.2: OVERHAUL MINIMALISTA (Login con Placeholders e Iconos)
// =========================================
function initOverhaulMinimalista() {
    if (!window.location.href.includes('usat.edu.pe')) return;

    // 1. Lógica JS para la página de Login
    const txtUser = document.getElementById('txtUsername');
    const txtPass = document.getElementById('txtPassword');
    
    if (txtUser && txtPass) {
        txtUser.placeholder = 'Código Universitario';
        txtPass.placeholder = 'Contraseña';
        
        const elementosTexto = document.querySelectorAll('span, label, p, div, b');
        elementosTexto.forEach(el => {
            if (el.children.length === 0) { 
                const texto = el.innerText.trim();
                if (texto === 'Código universitario' || texto === 'Contraseña') {
                    el.style.display = 'none';
                }
            }
        });
    }

    // 2. Estilos CSS
    const cssMinimalista = `
        /* 1. TIPOGRAFÍA MODERNA */
        body, html, #wrapper, #page, td, th, p, span, input, button, select, textarea {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            letter-spacing: -0.01em !important;
        }

        /* 2. FONDO GENERAL GRIS SUAVE */
        body, #page, #wrapper, #page-content, #region-main-box, #region-main {
            background-color: #f1f5f9 !important;
            background-image: none !important;
        }
        #page-content, #region-main {
            padding: 8px 12px !important;
        }

        /* 3. CAJA PRINCIPAL Y BLOQUES LATERALES */
        .course-content .section.main, .block {
            background-color: #ffffff !important;
            border-radius: 12px !important; 
            border: 1px solid #cbd5e1 !important;
            box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05) !important;
            padding: 12px 16px !important;
            margin-bottom: 12px !important;
        }

        .contentwithoutlink, .activity.label {
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            padding: 2px 0 !important;
            margin: 0 !important;
        }

        /* 4. ENCABEZADOS INTERNOS DE UNIDADES */
        .course-content .well:not(.course-pano):not(.course-banner),
        .course-content .panel:not(.course-pano):not(.course-banner) {
            background-color: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 8px !important;
            padding: 6px 12px !important;
            margin-bottom: 8px !important;
            box-shadow: none !important;
        }

        #section-0 .well,
        .course-content .well:has(.course-pano),
        .course-content .well:has(.course-banner) {
            background-color: transparent !important;
            border: none !important;
            padding: 0 !important;
            box-shadow: none !important;
        }

        /* 5. FILAS DE ARCHIVOS Y TAREAS */
        .section .activity:not(.label) {
            padding: 4px 8px !important;
            margin: 2px 0 !important;
            border-radius: 5px !important;
            border-bottom: 1px solid #f1f5f9 !important;
            font-size: 12px !important;
            transition: background-color 0.15s ease !important;
        }
        .section .activity:not(.label):hover {
            background-color: #f8fafc !important;
        }
        .section .activity a {
            color: #1e293b !important;
            font-weight: 500 !important;
            text-decoration: none !important;
        }
        .section .activity a:hover {
            color: #dc2626 !important;
        }

        /* 6. PESTAÑAS DE UNIDADES */
        .nav-tabs {
            border-bottom: 2px solid #cbd5e1 !important;
            margin-bottom: 10px !important;
            background: transparent !important;
        }
        .nav-tabs .nav-link, .nav-tabs > li > a {
            border: none !important;
            background: transparent !important;
            color: #64748b !important;
            font-weight: 600 !important;
            padding: 5px 12px !important;
            font-size: 12px !important;
            border-bottom: 2px solid transparent !important;
            margin-bottom: -2px !important;
            border-radius: 6px 6px 0 0 !important;
        }
        .nav-tabs .nav-link.active, .nav-tabs > li.active > a {
            color: #dc2626 !important;
            background-color: #ffffff !important;
            border-bottom-color: #dc2626 !important;
            font-weight: 700 !important;
        }

        /* 7. MENÚ DE NAVEGACIÓN DERECHO */
        #divleft, .sidebar {
            background-color: #ffffff !important;
            border-right: 1px solid #cbd5e1 !important;
        }
        .block_navigation .block_tree li a {
            color: #475569 !important;
            padding: 2px 4px !important;
            font-size: 11.5px !important;
            border-radius: 4px !important;
            display: inline-block !important;
        }
        .block_navigation .block_tree li a:hover {
            background-color: #f1f5f9 !important;
            color: #dc2626 !important;
            text-decoration: none !important;
        }

        /* 8. BANNER DEL CURSO */
        .course-pano, .course-banner {
            width: 100% !important;
            max-width: 100% !important;
            min-height: 160px !important;
            max-height: none !important;
            height: auto !important;
            padding: 8px 10px !important;
            margin: 0 0 10px 0 !important;
            border: none !important;
            background-color: transparent !important;
            background-size: 100% 100% !important;
            background-position: center !important;
            background-repeat: no-repeat !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
        }
        .course-pano *, .course-banner * {
            max-height: none !important;
        }

        /* 9. PÁGINA DE LOGIN */
        .login-container, .login-box, .card, form#form1 > div[style*="background-color: white"], div[style*="background-color:#ffffff"], div[style*="background-color: white"] {
            border-radius: 16px !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
            border: none !important;
            padding: 25px 20px !important;
        }

        #txtUsername, #txtPassword, input[type="text"].login-input, input[type="password"].login-input {
            background-color: #f8fafc !important;
            border: 1px solid #cbd5e1 !important;
            border-radius: 8px !important;
            padding: 14px 14px 14px 44px !important; 
            color: #0f172a !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            box-shadow: inset 0 1px 2px rgba(15, 23, 42, 0.02) !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin-bottom: 16px !important; 
            background-repeat: no-repeat !important;
            background-position: 14px center !important;
            background-size: 18px !important;
        }

        #txtUsername {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E") !important;
        }

        #txtPassword {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='11' width='18' height='11' rx='2' ry='2'%3E%3C/rect%3E%3Cpath d='M7 11V7a5 5 0 0 1 10 0v4'%3E%3C/path%3E%3C/svg%3E") !important;
        }

        #txtUsername:focus, #txtPassword:focus {
            border-color: #dc2626 !important;
            background-color: #ffffff !important;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15) !important;
            outline: none !important;
        }

        #txtUsername::placeholder, #txtPassword::placeholder {
            color: #94a3b8 !important;
            font-weight: 500 !important;
            opacity: 1 !important;
        }

        input[type="submit"], button[type="submit"], #lnkbtnIngresar {
            border-radius: 8px !important;
            font-weight: 700 !important;
            letter-spacing: 0.5px !important;
            padding: 12px !important;
            text-transform: uppercase !important;
            margin-top: 5px !important;
        }
    `;

    const stylePrevio = document.getElementById('usat-overhaul-minimalista');
    if (stylePrevio) stylePrevio.remove();

    const styleElement = document.createElement('style');
    styleElement.id = 'usat-overhaul-minimalista';
    styleElement.textContent = cssMinimalista;
    document.head.appendChild(styleElement);
}
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
// =========================================
// MÓDULO 7: CALCULADORA DE NOTAS V2
// =========================================
let isSimulating = false;
let originalTreeHTML = '';

function obtenerIdCurso(iframeDoc) {
    const selects = iframeDoc.querySelectorAll('select');
    let cursoSelect = null;
    selects.forEach(sel => {
        if (sel.id.toLowerCase().includes('curso') || sel.name.toLowerCase().includes('curso')) {
            cursoSelect = sel;
        }
    });
    if (!cursoSelect && selects.length >= 2) cursoSelect = selects[1];

    if (cursoSelect && cursoSelect.options.length > 0 && cursoSelect.selectedIndex >= 0) {
        const textoCurso = cursoSelect.options[cursoSelect.selectedIndex].text;
        return textoCurso.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, '_');
    }
    return 'general';
}

function initCalculadoraNotas() {
    setInterval(() => {
        const iframe = document.getElementById('ifrmEstudiante');
        if (!iframe) return;
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc) return;

            const tree = iframeDoc.getElementById('tree');
            if (!tree) return;

            const container = iframeDoc.querySelector('.table-responsive') || tree.parentElement;
            if (iframeDoc.querySelector('.btn-simulador')) return;

            const ddlCurso = iframeDoc.getElementById('ddlCurso');
            if (ddlCurso && ddlCurso.selectedIndex <= 0) return;

            if (tree.querySelectorAll('li').length === 0) return;
            isSimulating = false;
            originalTreeHTML = '';

            if (!iframeDoc.getElementById('sim-styles')) {
                const style = iframeDoc.createElement('style');
                style.id = 'sim-styles';
                style.textContent = `
                    .btn-simulador { width: 100%; margin-bottom: 5px; padding: 10px; background-color: #14719c; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; transition: background-color 0.2s; display: inline-flex; align-items: center; justify-content: center; gap: 8px; }
                    .btn-simulador:hover { background-color: #10638d; }
                    .btn-simulador.activo { background-color: #374151; }
                    .btn-silabo { width: 100%; margin-bottom: 15px; padding: 8px; background-color: #10b981; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 13px; display: none; align-items: center; justify-content: center; gap: 8px; }
                    .btn-silabo:hover { background-color: #059669; }
                    .sim-input { width: 55px; text-align: center; color: #111827; border: 1px solid #cbd5e1; border-radius: 4px; padding: 2px; font-size: 13px; font-weight: bold; outline: none; }
                    .sim-input:focus, .sim-weight:focus { border-color: #0ea5e9; box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2); }
                    .sim-weight { width: 42px; text-align: center; color: #111827; border: 1px solid #eab308; border-radius: 4px; padding: 2px; font-size: 12px; font-weight: bold; outline: none; background-color: #fef08a; margin-right: 5px; transition: 0.3s; }
                    .unverified { background-color: #fca5a5 !important; border-color: #ef4444 !important; color: #7f1d1d !important; }
                    .sim-readonly { background-color: #d1d5db !important; color: #374151 !important; border-color: #9ca3af !important; }
                    #sim-final-grade { font-size: 16px; font-weight: 900; color: white; }
                    html, body { overflow-y: auto !important; padding-bottom: 150px !important; }
                    .table-responsive { margin-bottom: 80px !important; overflow: visible !important; }
                `;
                iframeDoc.head.appendChild(style);
            }

            const btnToggle = iframeDoc.createElement('button');
            btnToggle.type = 'button';
            btnToggle.className = 'btn-simulador';
            btnToggle.innerHTML = `${ICONOS_USAT.calculadora}<span>Activar Calculadora de Notas</span>`;

            const btnSilabo = iframeDoc.createElement('button');
            btnSilabo.type = 'button';
            btnSilabo.className = 'btn-silabo';
            btnSilabo.innerHTML = `${ICONOS_USAT.documento}<span>Autocompletar pesos con Sílabo (PDF)</span>`;

            const fileInput = iframeDoc.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'application/pdf';
            fileInput.style.display = 'none';

            container.insertBefore(btnSilabo, container.firstChild);
            container.insertBefore(fileInput, container.firstChild);
            container.insertBefore(btnToggle, container.firstChild);

            btnToggle.addEventListener('click', (e) => {
                e.preventDefault();
                if (!isSimulating) {
                    originalTreeHTML = tree.innerHTML;
                    btnToggle.innerHTML = `${ICONOS_USAT.cerrarBlanco}<span>Desactivar Calculadora</span>`;
                    btnToggle.classList.add('activo');
                    btnSilabo.style.display = 'inline-flex';
                    isSimulating = true;
                    transformarACalculadora(tree, iframeDoc);
                    setTimeout(() => { iframe.style.height = (iframeDoc.body.scrollHeight + 250) + 'px'; }, 100);
                } else {
                    tree.innerHTML = originalTreeHTML;
                    btnToggle.innerHTML = `${ICONOS_USAT.calculadora}<span>Activar Calculadora de Notas Avanzada</span>`;
                    btnToggle.classList.remove('activo');
                    btnSilabo.style.display = 'none';
                    isSimulating = false;
                    setTimeout(() => { iframe.style.height = (iframeDoc.body.scrollHeight + 50) + 'px'; }, 100);
                }
            });

            btnSilabo.addEventListener('click', (e) => {
                e.preventDefault();
                fileInput.click();
            });

            fileInput.addEventListener('change', function () {
                if (this.files.length === 0) return;
                const file = this.files[0];
                btnSilabo.innerHTML = `${ICONOS_USAT.reloj}<span>Analizando algoritmo del sílabo...</span>`;

                const fileReader = new FileReader();
                fileReader.onload = async function () {
                    try {
                        if (typeof pdfjsLib === 'undefined') throw new Error("PDF.js no cargó.");

                        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                        const typedarray = new Uint8Array(this.result);

                        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
                        let fullText = '';
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const textContent = await page.getTextContent();
                            fullText += textContent.items.map(item => item.str).join(' ') + ' ';
                        }

                        procesarPDFSilabo(fullText, iframeDoc);

                        btnSilabo.innerHTML = `${ICONOS_USAT.checkBlanco}<span>Pesos extraídos y guardados con éxito</span>`;
                        setTimeout(() => {
                            btnSilabo.innerHTML = `${ICONOS_USAT.documento}<span>Autocompletar pesos con Sílabo (PDF)</span>`;
                        }, 4000);
                    } catch (error) {
                        alert('Ocurrió un error técnico:\n' + error.message);
                        btnSilabo.innerHTML = `${ICONOS_USAT.cerrarBlanco}<span>Error al leer PDF</span>`;
                        setTimeout(() => {
                            btnSilabo.innerHTML = `${ICONOS_USAT.documento}<span>Autocompletar pesos con Sílabo (PDF)</span>`;
                        }, 4000);
                    }
                };
                fileReader.readAsArrayBuffer(file);
            });

        } catch (e) { }
    }, 1500);
}

function procesarPDFSilabo(texto, iframeDoc) {
    const cleanText = texto.replace(/\s+/g, '').toUpperCase();
    const raRegex = /RA(\d)=((?:IND\d+\([\d.,]+\)\+?)+)/ig;
    const indWeights = {};
    let raMatches;
    let foundAny = false;

    while ((raMatches = raRegex.exec(cleanText)) !== null) {
        foundAny = true;
        const raIndex = parseInt(raMatches[1], 10);
        const indString = raMatches[2];
        const weights = [];
        const indRegex = /IND\d+\(([\d.,]+)\)/ig;
        let indMatch;
        while ((indMatch = indRegex.exec(indString)) !== null) {
            weights.push(parseFloat(indMatch[1].replace(',', '.')) * 100);
        }
        indWeights[raIndex] = weights;
    }

    if (!foundAny) {
        for (let i = 1; i <= 6; i++) {
            const laxRegex = new RegExp(`RA${i}[^A-Z]*=(.*?)(?:RA${i + 1}|NF|$)`, 'i');
            const match = cleanText.match(laxRegex);
            if (match) {
                const weights = [];
                const laxIndRegex = /IND\d+[^\d]+([\d.,]+)/ig;
                let indMatch;
                while ((indMatch = laxIndRegex.exec(match[1])) !== null) {
                    weights.push(parseFloat(indMatch[1].replace(',', '.')) * 100);
                }
                if (weights.length > 0) {
                    indWeights[i] = weights;
                    foundAny = true;
                }
            }
        }
    }

    if (foundAny) {
        let uIdx = 0;
        let globalIndCounter = 1;

        while (uIdx < 6) {
            let iIdx = 0;
            while (true) {
                const indInput = iframeDoc.querySelector(`.sim-weight[data-id="w-i-${uIdx}-${iIdx}"]`);
                if (!indInput) break;

                if (indWeights[uIdx + 1] && indWeights[uIdx + 1][iIdx] !== undefined) {
                    indInput.value = indWeights[uIdx + 1][iIdx];
                }

                const evals = [];
                let eIdx = 0;
                while (true) {
                    const evalInp = iframeDoc.querySelector(`.sim-weight[data-id="w-e-${uIdx}-${iIdx}-${eIdx}"]`);
                    if (!evalInp) break;
                    evals.push(evalInp);
                    eIdx++;
                }

                if (evals.length > 0) {
                    let startIndex = cleanText.indexOf(`IND${globalIndCounter}`);
                    let endIndex = cleanText.indexOf(`IND${globalIndCounter + 1}`);
                    if (endIndex === -1) endIndex = cleanText.indexOf(`RA${uIdx + 2}`);
                    if (endIndex === -1) endIndex = cleanText.length;

                    let success = false;
                    if (startIndex !== -1) {
                        let block = cleanText.substring(startIndex, endIndex);
                        let evalRegex = /(?:10|15|20|25|30|35|40|45|50|55|60|65|70|75|80|85|90|95)(?:\.00|%)/g;
                        let matches = block.match(evalRegex);

                        if (matches && matches.length >= evals.length) {
                            for (let k = 0; k < evals.length; k++) {
                                evals[k].value = parseFloat(matches[k]);
                                evals[k].classList.remove('unverified');
                            }
                            success = true;
                        }
                    }

                    if (!success) {
                        evals.forEach(evInp => {
                            if (!evInp.value) evInp.classList.add('unverified');
                        });
                    }
                }

                iIdx++;
                globalIndCounter++;
            }
            uIdx++;
        }

        const firstInput = iframeDoc.querySelector('.sim-weight');
        if (firstInput) firstInput.dispatchEvent(new Event('input', { bubbles: true }));
    } else {
        alert("No se detectaron las fórmulas de los indicadores en este sílabo.");
    }
}

function protegerInput(input) {
    ['click', 'mousedown', 'mouseup', 'keydown', 'focus'].forEach(evento => {
        input.addEventListener(evento, (e) => e.stopPropagation());
    });
}

function transformarACalculadora(tree, iframeDoc) {
    const items = tree.querySelectorAll('li.list-group-item');
    let allUnits = [];
    let finalGradeElement = null;

    const courseId = obtenerIdCurso(iframeDoc);
    const storageKey = `usat_notas_v2_${courseId}`;

    let currentUnit = null;
    let currentIndicator = null;
    let uIdx = 0, iIdx = 0, eIdx = 0;

    items.forEach(li => {
        const badge = li.querySelector('.badge');
        const textContent = li.innerText;

        if (textContent.includes('PROMEDIO') && textContent.includes('FINAL')) {
            if (badge) {
                badge.innerHTML = `<span id="sim-final-grade">00.00</span>`;
                finalGradeElement = badge.querySelector('#sim-final-grade');
            }
            return;
        }

        if (li.querySelector('b') && li.querySelector('b').innerText.includes('UNIDAD')) {
            currentUnit = { weight: 0, unitAvgInput: null, indicators: [] };
            allUnits.push(currentUnit);
            currentIndicator = null;
            uIdx++; iIdx = 0;
            return;
        }

        if (badge && textContent.includes('Peso:')) {
            if (!currentUnit) {
                currentUnit = { weight: 0, unitAvgInput: null, indicators: [] };
                allUnits.push(currentUnit);
                uIdx++;
            }
            const weightMatch = textContent.match(/Peso:\s*([\d.]+)%/);
            currentUnit.weight = weightMatch ? parseFloat(weightMatch[1]) / 100 : 0;

            badge.innerHTML = `Peso: ${(currentUnit.weight * 100).toFixed(0)}% | <input type="number" class="sim-input sim-readonly" disabled title="Promedio Automático de Unidad">`;
            currentUnit.unitAvgInput = badge.querySelector('input');
            return;
        }

        if (!badge) {
            if (textContent.trim() === '') return;
            const newBadge = iframeDoc.createElement('span');
            newBadge.className = 'badge';
            newBadge.style.backgroundColor = '#737579';
            newBadge.style.color = '#ffffff';
            newBadge.innerHTML = `Peso: <input type="number" class="sim-weight" data-id="w-i-${uIdx - 1}-${iIdx}" placeholder="%" title="Peso del indicador"> % | <input type="number" class="sim-input sim-readonly" disabled title="Promedio Automático">`;
            li.appendChild(newBadge);

            currentIndicator = {
                weightInput: newBadge.querySelector('.sim-weight'),
                avgInput: newBadge.querySelector('.sim-input'),
                evaluations: []
            };
            if (currentUnit) currentUnit.indicators.push(currentIndicator);
            iIdx++; eIdx = 0;
            return;
        }

        if (badge && !textContent.includes('Peso:')) {
            badge.style.backgroundColor = '#3b82f6';
            badge.style.color = '#ffffff';

            let textoNota = badge.innerText.trim();
            let val = textoNota.includes('Pendiente') ? '' : (textoNota.match(/[\d.]+/)?.[0] || '');

            badge.innerHTML = `Peso: <input type="number" class="sim-weight" data-id="w-e-${uIdx - 1}-${iIdx > 0 ? iIdx - 1 : 0}-${eIdx}" placeholder="%"> % | <input type="number" class="sim-input" 
                data-id="n-e-${uIdx - 1}-${iIdx > 0 ? iIdx - 1 : 0}-${eIdx}" value="${val}" step="0.1" min="0" max="20" placeholder="-">`;
            const evalWeight = badge.querySelector('.sim-weight');
            const evalNote = badge.querySelector('.sim-input');

            if (!currentIndicator) {
                currentIndicator = { weightInput: null, avgInput: null, evaluations: [] };
                if (currentUnit) currentUnit.indicators.push(currentIndicator);
            }

            currentIndicator.evaluations.push({ weightInput: evalWeight, noteInput: evalNote });
            eIdx++;
        }
    });

    const inputs = iframeDoc.querySelectorAll('.sim-input:not(:disabled), .sim-weight');
    inputs.forEach(inp => {
        protegerInput(inp);
        inp.addEventListener('input', function () {
            this.classList.remove('unverified');
            recalcularTodo(allUnits, finalGradeElement);
            guardarNotasEnMemoria(storageKey, iframeDoc);
        });
    });

    chrome.storage.local.get([storageKey], (result) => {
        if (result[storageKey]) {
            const data = result[storageKey];
            inputs.forEach(inp => {
                if (data[inp.dataset.id] !== undefined) {
                    inp.value = data[inp.dataset.id];
                    inp.classList.remove('unverified');
                }
            });
        }
        recalcularTodo(allUnits, finalGradeElement);
    });
}

function guardarNotasEnMemoria(storageKey, iframeDoc) {
    const inputs = iframeDoc.querySelectorAll('.sim-input:not(:disabled), .sim-weight');
    const data = {};
    inputs.forEach(inp => {
        if (inp.dataset.id) data[inp.dataset.id] = inp.value;
    });
    chrome.storage.local.set({ [storageKey]: data });
}

function recalcularTodo(units, finalGradeElement) {
    let finalGrade = 0;
    units.forEach(u => {
        let unitSum = 0;
        let unitWeightSum = 0;
        let unitEvalsCount = 0;

        u.indicators.forEach(ind => {
            let indSum = 0;
            let indWeightSum = 0;
            let indEvalsCount = 0;

            ind.evaluations.forEach(ev => {
                const note = parseFloat(ev.noteInput.value);
                const weight = parseFloat(ev.weightInput.value);

                if (!isNaN(note)) {
                    if (!isNaN(weight)) {
                        indSum += note * (weight / 100);
                        indWeightSum += (weight / 100);
                    } else {
                        indSum += note;
                    }
                    indEvalsCount++;
                }
            });

            let indFinalAvg = 0;
            if (indWeightSum > 0) indFinalAvg = indSum / indWeightSum;
            else if (indEvalsCount > 0) indFinalAvg = indSum / indEvalsCount;

            if (ind.avgInput) ind.avgInput.value = isNaN(indFinalAvg) ? '0.00' : indFinalAvg.toFixed(2);

            const indWeight = parseFloat(ind.weightInput ? ind.weightInput.value : NaN);
            if (!isNaN(indFinalAvg)) {
                if (!isNaN(indWeight)) {
                    unitSum += indFinalAvg * (indWeight / 100);
                    unitWeightSum += (indWeight / 100);
                } else {
                    unitSum += indFinalAvg;
                }
                unitEvalsCount++;
            }
        });

        let unitFinalAvg = 0;
        if (unitWeightSum > 0) unitFinalAvg = unitSum / unitWeightSum;
        else if (unitEvalsCount > 0) unitFinalAvg = unitSum / unitEvalsCount;

        if (u.unitAvgInput) u.unitAvgInput.value = isNaN(unitFinalAvg) ? '0.00' : unitFinalAvg.toFixed(2);

        if (!isNaN(unitFinalAvg) && u.weight > 0) {
            finalGrade += unitFinalAvg * u.weight;
        }
    });

    if (finalGradeElement) {
        finalGradeElement.innerText = finalGrade.toFixed(2);
        if (finalGrade >= 13.5) {
            finalGradeElement.parentElement.style.backgroundColor = '#10b981';
        } else {
            finalGradeElement.parentElement.style.backgroundColor = '#dc2626';
        }
    }
}
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
            const href = boton.getAttribute('href');
            const coincidencia = href?.match(/^\s*javascript:\s*fnAbrirCarnet\((.*)\);?\s*$/i);
            if (!coincidencia) return;

            const argumentos = [];
            const patron = /'((?:\\.|[^'\\])*)'\s*(?:,|$)/g;
            let resultado;
            while ((resultado = patron.exec(coincidencia[1])) !== null) {
                argumentos.push(resultado[1].replace(/\\(['\\])/g, '$1'));
            }

            if (argumentos.length !== 6) return;

            chrome.runtime.sendMessage({ type: 'USAT_ABRIR_CARNET', argumentos: argumentos }, () => { });
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
                    if (iframe.contentWindow.location.href.includes('aulavirtual/my')) {
                        const tarjetas = doc.querySelectorAll('.dashboard-card, .list-group-item');
                        tarjetas.forEach(t => {
                            if (t.innerText.match(/2022-|2023-|2024-|2025-/)) {
                                t.style.display = 'none';
                            }
                        });
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

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
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
    }

    runExtension();
