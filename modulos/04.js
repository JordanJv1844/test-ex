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

window.initCourseFilter = initCourseFilter;
window.initOverhaulMinimalista = initOverhaulMinimalista;

