// =========================================
// MÓDULO 7: CALCULADORA DE NOTAS V2
// =========================================
const ICONOS_USAT = window.ICONOS_USAT;
const forzarIngreso = window.forzarIngreso;
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

window.initCalculadoraNotas = initCalculadoraNotas;
