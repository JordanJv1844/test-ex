const ICONOS_USAT = window.ICONOS_USAT;

// =========================================
// MÓDULO 4.1: LIMPIEZA DE VISTA DE CURSOS (Con Cursos Recientes visibles)
// =========================================
function initCourseFilter() {
    if (!window.location.href.includes('aulavirtual')) return;

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

            /* GRILLA DE 3 COLUMNAS PARA VISTA GENERAL Y PARA CURSOS RECIENTES */
            .paged-content-page-container [data-region="paged-content-page"]:not(.hidden) .list-group,
            [data-block="myoverview"] .dashboard-card-deck,
            [data-region="recentlyaccessedcourses-view-content"] .dashboard-card-deck { 
                display: grid !important; 
                grid-template-columns: repeat(3, minmax(0, 1fr)) !important; 
                gap: 14px !important; 
                border: none !important; 
                width: 100% !important; 
                padding-top: 8px !important;
            }

            /* ESTILO COMPACTO DE BOTÓN PARA AMBOS APARTADOS */
            .paged-content-page-container .list-group .list-group-item:not(.disabled-course),
            [data-block="myoverview"] .card.dashboard-card:not(.disabled-course),
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card { 
                position: relative !important;
                cursor: pointer !important;
                padding: 0 15px !important; 
                margin: 0 !important; 
                border-radius: 8px !important; 
                border: 1px solid #cbd5e1 !important; 
                background-color: #ffffff !important;
                box-shadow: 0 2px 5px rgba(15, 23, 42, 0.06) !important;
                height: 42px !important; 
                min-height: 42px !important;
                max-height: 42px !important;
                width: 100% !important;
                display: flex !important; 
                align-items: center !important; 
                overflow: hidden !important; 
                transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease !important;
            }

            /* REGLA DE OCULTAMIENTO SOLO PARA LA VISTA GENERAL (NO AFECTA A RECIENTES) */
            .paged-content-page-container .list-group .list-group-item.disabled-course,
            [data-block="myoverview"] .card.dashboard-card.disabled-course,
            .block_myoverview .card.dashboard-card.disabled-course {
                display: none !important;
            }

            .paged-content-page-container .list-group .list-group-item:hover,
            [data-block="myoverview"] .card.dashboard-card:hover,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card:hover {
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 8px rgba(15, 23, 42, 0.1) !important;
                border-color: #dc2626 !important;
            }

            /* OCULTAR IMÁGENES Y ELEMENTOS EXTRA EN LISTA Y EN CURSOS RECIENTES */
            .paged-content-page-container .list-group .list-group-item .text-muted, 
            .paged-content-page-container .list-group .list-group-item .col-md-1, 
            .paged-content-page-container .list-group .list-group-item .progress, 
            .paged-content-page-container .list-group .list-group-item .text-muted.small,
            .paged-content-page-container .list-group .list-group-item .more-menu,
            [data-block="myoverview"] .card.dashboard-card .card-img,
            [data-block="myoverview"] .card.dashboard-card .card-img-top,
            [data-block="myoverview"] .card.dashboard-card .course-summary,
            [data-block="myoverview"] .card.dashboard-card .text-muted,
            [data-block="myoverview"] .card.dashboard-card [data-region="favourite-icon"],
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-img,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-img-top,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-img-container,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .courseimage,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .dashboard-card-img,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .text-muted,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card [data-region="favourite-icon"] { 
                display: none !important; 
            }

            .paged-content-page-container .list-group .list-group-item .row, 
            .paged-content-page-container .list-group .list-group-item .col-md-11,
            [data-block="myoverview"] .card.dashboard-card .card-body,
            [data-block="myoverview"] .card.dashboard-card .course-info-container,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-body,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .course-info-container,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-body > *,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-body .coursename,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-body .multiline { 
                margin: 0 !important; 
                padding: 0 !important; 
                width: 100% !important; 
                min-width: 0 !important; 
                display: flex !important;
                align-items: center !important;
            }

            /* En cursos recientes, no ocultar el enlace que contiene el nombre */
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-body {
                display: flex !important;
                align-items: center !important;
                width: 100% !important;
                min-width: 0 !important;
                height: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
            }

            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-body a,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card a.coursename {
                min-width: 0 !important;
                max-width: 100% !important;
                flex: 1 1 auto !important;
            }

            .paged-content-page-container .list-group .list-group-item .coursename,
            [data-block="myoverview"] .card.dashboard-card a.coursename,
            [data-block="myoverview"] .card.dashboard-card .multiline,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card a.coursename,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .coursename,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .multiline,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card .card-body a { 
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
                padding: 0 !important;
                margin: 0 !important;
            }

            .paged-content-page-container .list-group .list-group-item:hover .coursename,
            [data-block="myoverview"] .card.dashboard-card:hover a.coursename,
            [data-block="myoverview"] .card.dashboard-card:hover .multiline,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card:hover a.coursename,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card:hover .coursename,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card:hover .multiline,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card:hover .card-body a {
                color: #dc2626 !important;
            }

            .paged-content-page-container .list-group .list-group-item a.coursename::after,
            [data-block="myoverview"] .card.dashboard-card a.coursename::after,
            [data-region="recentlyaccessedcourses-view-content"] .card.dashboard-card a.coursename::after {
                content: "" !important;
                position: absolute !important;
                inset: 0 !important;
                z-index: 5 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Ciclo actual automático ("2026-II")
    const dt = new Date();
    const dm = dt.getMonth();
    const curCic = dt.getFullYear() + '-' + (dm > 6 ? 'II' : dm < 2 ? '0' : 'I');

    // Filtra ÚNICAMENTE dentro de "Vista general de curso" ([data-block="myoverview"])
    function filterCourses() {
        const contenedores = document.querySelectorAll(
            '[data-block="myoverview"] .paged-content-page-container [data-region="paged-content-page"]:not(.hidden)'
        );

        contenedores.forEach(pagina => {
            const items = pagina.querySelectorAll('.list-group-item, .card.dashboard-card');
            const cursosVistos = new Set();

            items.forEach(card => {
                const nameEl = card.querySelector('a.coursename, .multiline');
                if (!nameEl) return;

                const courseName = nameEl.textContent.trim();
                if (!courseName) return;

                const href = card.querySelector('a.coursename')?.getAttribute('href') || courseName;
                const isCurrent = courseName.includes(curCic);

                if (isCurrent && !cursosVistos.has(href)) {
                    card.classList.remove('disabled-course');
                    cursosVistos.add(href);
                } else {
                    card.classList.add('disabled-course');
                }
            });
        });
    }

    let intentos = 0;
    const findList = setInterval(() => {
        intentos++;
        const hayCursos = document.querySelector('[data-block="myoverview"] .list-group-item a.coursename, [data-block="myoverview"] .card.dashboard-card .multiline');
        
        if (hayCursos || intentos > 25) {
            clearInterval(findList);

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
                setTimeout(filterCourses, 400);
            }, 400);

            filterCourses();

            const coursesView = document.querySelector('[data-region="courses-view"]');
            if (coursesView) {
                new MutationObserver(filterCourses).observe(coursesView, { childList: true, subtree: true });
            }
        }
    }, 400);
}

// =========================================
// MÓDULO 4.2: OVERHAUL MINIMALISTA (Login con Placeholders e Iconos)
// =========================================
function initOverhaulMinimalista() {
    if (!window.location.href.includes('usat.edu.pe')) return;

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

    const cssMinimalista = `
        body, html, #wrapper, #page, td, th, p, span, input, button, select, textarea {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
            letter-spacing: -0.01em !important;
        }
        body, #page, #wrapper, #page-content, #region-main-box, #region-main {
            background-color: #f1f5f9 !important;
            background-image: none !important;
        }
        #page-content, #region-main {
            padding: 8px 12px !important;
        }
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
