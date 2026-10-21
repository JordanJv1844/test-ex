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
window.initAutoLogin = initAutoLogin;
