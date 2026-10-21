// =========================================
// MÓDULO 2: BLOQUEADOR DE ANUNCIOS INTELIGENTE
// =========================================
const ICONOS_USAT = window.ICONOS_USAT;
const forzarIngreso = window.forzarIngreso;
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
window.initAdBlocker = initAdBlocker;
