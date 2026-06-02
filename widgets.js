/**
 * CAHIER DE VACANCES - TERMINALE SPÉ MATHS
 * Moteurs graphiques des widgets interactifs (Canvas HTML5)
 */

let activeWidgetInstance = null;

function initMathWidget(chapterId, canvasId, controlsId) {
    const canvas = document.getElementById(canvasId);
    const controlsContainer = document.getElementById(controlsId);
    
    if (!canvas || !controlsContainer) return;
    
    // Stop any active rendering or event listeners if necessary
    if (activeWidgetInstance) {
        activeWidgetInstance.destroy();
    }
    
    // Find chapter widget data
    const chapterData = CHAPTERS_DATA.find(c => c.id === chapterId);
    if (!chapterData || !chapterData.widget) {
        canvas.style.display = 'none';
        controlsContainer.innerHTML = '<p class="text-muted">Aucune simulation pour ce chapitre.</p>';
        return;
    }
    
    canvas.style.display = 'block';
    
    // Instantiate appropriate widget
    const widgetType = chapterData.widget.type;
    const widgetConfig = chapterData.widget;
    
    switch (widgetType) {
        case "second_degre":
            activeWidgetInstance = new SecondDegreWidget(canvas, controlsContainer, widgetConfig);
            break;
        case "derivation":
            activeWidgetInstance = new DerivationWidget(canvas, controlsContainer, widgetConfig);
            break;
        case "suites":
            activeWidgetInstance = new SuitesWidget(canvas, controlsContainer, widgetConfig);
            break;
        case "exponentielle":
            activeWidgetInstance = new ExponentielleWidget(canvas, controlsContainer, widgetConfig);
            break;
        case "produit_scalaire":
            activeWidgetInstance = new ProduitScalaireWidget(canvas, controlsContainer, widgetConfig);
            break;
        case "probabilites":
            activeWidgetInstance = new ProbabilitesWidget(canvas, controlsContainer, widgetConfig);
            break;
        case "variables_aleatoires":
            activeWidgetInstance = new VariablesAleatoiresWidget(canvas, controlsContainer, widgetConfig);
            break;
        case "trigonometrie":
            activeWidgetInstance = new TrigonometrieWidget(canvas, controlsContainer, widgetConfig);
            break;
        default:
            controlsContainer.innerHTML = '<p class="text-muted">Widget en cours de chargement...</p>';
    }
}

/**
 * BASE CLASS FOR CANVAS MATH WIDGETS
 */
class BaseMathWidget {
    constructor(canvas, controlsContainer, config) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.controlsContainer = controlsContainer;
        this.config = config;
        this.listeners = [];
        this.values = {};
        
        // Setup resolution for HD drawing on high-DPI screens
        this.setupCanvasDPI();
        
        // Initialize values from default config
        config.params.forEach(param => {
            this.values[param.name] = param.default;
        });
        
        // Build Sliders in UI
        this.buildControls();
        
        // Initial Draw
        setTimeout(() => this.draw(), 50);
    }
    
    setupCanvasDPI() {
        const rect = this.canvas.getBoundingClientRect();
        this.width = 450;
        this.height = 320;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    
    buildControls() {
        this.controlsContainer.innerHTML = '';
        
        this.config.params.forEach(param => {
            const group = document.createElement('div');
            group.className = 'control-group';
            
            // Custom label for specialized parameters
            let labelText = param.name;
            if (param.name === 'a') labelText = 'Coefficient a (courbure)';
            if (param.name === 'b') labelText = 'Coefficient b (translation)';
            if (param.name === 'c') labelText = 'Coefficient c (ordonnée à l\'origine)';
            if (param.name === 'x0') labelText = 'Point d\'abscisse x₀';
            if (param.name === 'u0') labelText = 'Premier terme u₀';
            if (param.name === 'raison') labelText = 'Raison de la suite';
            if (param.name === 'type') labelText = 'Nature (0: Arithmétique, 1: Géométrique)';
            if (param.name === 'k') labelText = 'Facteur de croissance k';
            if (param.name === 'ux') labelText = 'u_x (abscisse de u)';
            if (param.name === 'uy') labelText = 'u_y (ordonnée de u)';
            if (param.name === 'vx') labelText = 'v_x (abscisse de v)';
            if (param.name === 'vy') labelText = 'v_y (ordonnée de v)';
            if (param.name === 'pa') labelText = 'P(A)';
            if (param.name === 'pab') labelText = 'P_A(B) (sachant A)';
            if (param.name === 'panb') labelText = 'P_Ā(B) (sachant A barre)';
            if (param.name === 'x1') labelText = 'Valeur de x₁';
            if (param.name === 'p1') labelText = 'Probabilité P(X = x₁)';
            if (param.name === 'p2') labelText = 'Probabilité P(X = x₂)';
            if (param.name === 'theta') labelText = 'Angle θ (en radians)';
            
            let displayVal = param.default;
            if (param.name === 'type') displayVal = param.default === 0 ? "Arithmétique" : "Géométrique";
            
            group.innerHTML = `
                <div class="control-label-row">
                    <span>${labelText}</span>
                    <span class="control-val" id="val-${param.name}">${displayVal}</span>
                </div>
                <input type="range" class="control-slider" 
                       id="slider-${param.name}" 
                       min="${param.min}" 
                       max="${param.max}" 
                       step="${param.step}" 
                       value="${param.default}">
            `;
            
            this.controlsContainer.appendChild(group);
            
            const slider = group.querySelector('input[type="range"]');
            const valDisplay = group.querySelector(`#val-${param.name}`);
            
            const handler = (e) => {
                let val = parseFloat(e.target.value);
                this.values[param.name] = val;
                
                // Special labels
                if (param.name === 'type') {
                    valDisplay.innerText = val === 0 ? "Arithmétique" : "Géométrique";
                } else {
                    valDisplay.innerText = val.toFixed(1);
                }
                
                this.draw();
            };
            
            slider.addEventListener('input', handler);
            this.listeners.push({ element: slider, type: 'input', handler });
        });
    }
    
    // Core grid drawing helper
    drawGrid(scaleX = 30, scaleY = 30, offsetX = 225, offsetY = 160) {
        const ctx = this.ctx;
        const w = this.width;
        const h = this.height;
        
        ctx.clearRect(0, 0, w, h);
        
        // Soft grid lines
        ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f1f5f9';
        ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = offsetX % scaleX; x < w; x += scaleX) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = offsetY % scaleY; y < h; y += scaleY) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
        }
        
        // Main Axes
        ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#64748b' : '#cbd5e1';
        ctx.lineWidth = 2;
        
        // X Axis
        ctx.beginPath();
        ctx.moveTo(0, offsetY);
        ctx.lineTo(w, offsetY);
        ctx.stroke();
        
        // Y Axis
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX, h);
        ctx.stroke();
        
        // Axis arrows
        ctx.fillStyle = ctx.strokeStyle;
        // X Arrow
        ctx.beginPath();
        ctx.moveTo(w, offsetY);
        ctx.lineTo(w - 8, offsetY - 4);
        ctx.lineTo(w - 8, offsetY + 4);
        ctx.fill();
        
        // Y Arrow
        ctx.beginPath();
        ctx.moveTo(offsetX, 0);
        ctx.lineTo(offsetX - 4, 8);
        ctx.lineTo(offsetX + 4, 8);
        ctx.fill();
        
        // Origin label
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#94a3b8' : '#64748b';
        ctx.font = '10px sans-serif';
        ctx.fillText("O", offsetX - 12, offsetY + 12);
        
        // Step marks
        ctx.lineWidth = 1;
        // X Mark 1
        ctx.beginPath();
        ctx.moveTo(offsetX + scaleX, offsetY - 4);
        ctx.lineTo(offsetX + scaleX, offsetY + 4);
        ctx.stroke();
        ctx.fillText("1", offsetX + scaleX - 3, offsetY + 15);
        
        // Y Mark 1
        ctx.beginPath();
        ctx.moveTo(offsetX - 4, offsetY - scaleY);
        ctx.lineTo(offsetX + 4, offsetY - scaleY);
        ctx.stroke();
        ctx.fillText("1", offsetX - 12, offsetY - scaleY + 4);
    }
    
    // Map Cartesian coordinates to Canvas coordinates
    toCanvasCoords(x, y, scaleX = 30, scaleY = 30, offsetX = 225, offsetY = 160) {
        return {
            x: offsetX + x * scaleX,
            y: offsetY - y * scaleY
        };
    }
    
    destroy() {
        this.listeners.forEach(l => {
            l.element.removeEventListener(l.type, l.handler);
        });
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.controlsContainer.innerHTML = '';
        activeWidgetInstance = null;
    }
}

/**
 * WIDGET 1: SECOND DEGRÉ (Parabole active)
 */
class SecondDegreWidget extends BaseMathWidget {
    draw() {
        const { a, b, c } = this.values;
        const ctx = this.ctx;
        
        // Grid setup
        const scale = 25; // 25 pixels = 1 unit
        const offsetX = 225;
        const offsetY = 160;
        
        this.drawGrid(scale, scale, offsetX, offsetY);
        
        // Trace the Parabola
        ctx.strokeStyle = '#1e3a8a'; // Primary navy
        if (document.body.classList.contains('dark-theme')) {
            ctx.strokeStyle = '#3b82f6'; // Light blue
        }
        ctx.lineWidth = 3;
        
        ctx.beginPath();
        let activePathStarted = false;
        
        for (let px = 0; px < this.width; px++) {
            // Convert pixel to cartesian x
            const cx = (px - offsetX) / scale;
            // Compute y = ax^2 + bx + c
            const cy = a * cx * cx + b * cx + c;
            
            // Convert cartesian back to pixel
            const py = offsetY - cy * scale;
            
            if (py >= 0 && py <= this.height) {
                if (!activePathStarted) {
                    ctx.moveTo(px, py);
                    activePathStarted = true;
                } else {
                    ctx.lineTo(px, py);
                }
            } else {
                activePathStarted = false;
            }
        }
        ctx.stroke();
        
        // Calculate Summit S(alpha, beta)
        const alpha = -b / (2 * a);
        const beta = a * alpha * alpha + b * alpha + c;
        const summitP = this.toCanvasCoords(alpha, beta, scale, scale, offsetX, offsetY);
        
        // Draw Summit point
        ctx.fillStyle = '#d97706'; // Gold
        ctx.beginPath();
        ctx.arc(summitP.x, summitP.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Label Summit
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`S(${alpha.toFixed(1)}; ${beta.toFixed(1)})`, summitP.x + 8, summitP.y - 4);
        
        // Calculate and Render Delta
        const delta = b * b - 4 * a * c;
        
        // Info Box drawing on Canvas
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = varColor('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(12, 12, 160, 75, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
        ctx.font = '12px Courier New';
        ctx.fillText(`Δ = b² - 4ac`, 20, 28);
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(`Δ = ${delta.toFixed(2)}`, 20, 48);
        
        ctx.font = '11px sans-serif';
        if (delta > 0) {
            ctx.fillStyle = '#10b981'; // Emerald
            ctx.fillText("2 racines distinctes", 20, 68);
            
            // Draw Roots
            const r1 = (-b - Math.sqrt(delta)) / (2 * a);
            const r2 = (-b + Math.sqrt(delta)) / (2 * a);
            
            const p1 = this.toCanvasCoords(r1, 0, scale, scale, offsetX, offsetY);
            const p2 = this.toCanvasCoords(r2, 0, scale, scale, offsetX, offsetY);
            
            ctx.fillStyle = '#ec4899'; // Crimson pink
            [p1, p2].forEach((p, idx) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                
                const rootVal = idx === 0 ? r1 : r2;
                ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
                ctx.font = '9px sans-serif';
                ctx.fillText(`x${idx+1}≈${rootVal.toFixed(1)}`, p.x - 15, p.y - 8);
            });
            
        } else if (delta === 0) {
            ctx.fillStyle = '#d97706'; // Gold
            ctx.fillText("1 racine double", 20, 68);
            
            const r0 = -b / (2 * a);
            const p0 = this.toCanvasCoords(r0, 0, scale, scale, offsetX, offsetY);
            
            ctx.fillStyle = '#ec4899';
            ctx.beginPath();
            ctx.arc(p0.x, p0.y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
            ctx.font = '9px sans-serif';
            ctx.fillText(`x₀=${r0.toFixed(1)}`, p0.x - 12, p0.y - 8);
        } else {
            ctx.fillStyle = '#ef4444'; // Red
            ctx.fillText("Aucune racine réelle", 20, 68);
        }
    }
}

/**
 * WIDGET 2: DÉRIVATION (Tangente dynamique)
 */
class DerivationWidget extends BaseMathWidget {
    draw() {
        const { x0 } = this.values;
        const ctx = this.ctx;
        
        const scale = 30;
        const offsetX = 180; // slightly shifted left
        const offsetY = 200; // shifted down to see curve
        
        this.drawGrid(scale, scale, offsetX, offsetY);
        
        // Define function f(x) = 0.25*x^2 - x - 0.5
        const f = (x) => 0.25 * x * x - x - 0.5;
        // Derivative f'(x) = 0.5*x - 1
        const df = (x) => 0.5 * x - 1;
        
        // 1. Draw Curve
        ctx.strokeStyle = '#6366f1'; // Indigo
        ctx.lineWidth = 3;
        ctx.beginPath();
        let pathStarted = false;
        
        for (let px = 0; px < this.width; px++) {
            const cx = (px - offsetX) / scale;
            const cy = f(cx);
            const py = offsetY - cy * scale;
            
            if (py >= 0 && py <= this.height) {
                if (!pathStarted) {
                    ctx.moveTo(px, py);
                    pathStarted = true;
                } else {
                    ctx.lineTo(px, py);
                }
            } else {
                pathStarted = false;
            }
        }
        ctx.stroke();
        
        // 2. Draw active Point A(x0, f(x0))
        const y0 = f(x0);
        const ptA = this.toCanvasCoords(x0, y0, scale, scale, offsetX, offsetY);
        
        ctx.fillStyle = '#ef4444'; // Red dot
        ctx.beginPath();
        ctx.arc(ptA.x, ptA.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Label Point A
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`A(${x0.toFixed(1)}; ${y0.toFixed(2)})`, ptA.x + 8, ptA.y - 6);
        
        // 3. Draw Tangent Line
        const slope = df(x0);
        
        // tangent: y = slope * (x - x0) + y0
        ctx.strokeStyle = '#d97706'; // Gold
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Draw tangent segment from left to right edge
        const tXLeft = -5;
        const tYLeft = slope * (tXLeft - x0) + y0;
        const tXRight = 8;
        const tYRight = slope * (tXRight - x0) + y0;
        
        const pLeft = this.toCanvasCoords(tXLeft, tYLeft, scale, scale, offsetX, offsetY);
        const pRight = this.toCanvasCoords(tXRight, tYRight, scale, scale, offsetX, offsetY);
        
        ctx.moveTo(pLeft.x, pLeft.y);
        ctx.lineTo(pRight.x, pRight.y);
        ctx.stroke();
        
        // Info Box with computations
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = varColor('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(12, 12, 210, 80, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
        ctx.font = '11px sans-serif';
        ctx.fillText(`Fonction f(x) = 0.25x² - x - 0.5`, 20, 28);
        
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#6366f1';
        ctx.fillText(`Nombre dérivé f'(${x0.toFixed(1)}) = ${slope.toFixed(2)}`, 20, 48);
        
        ctx.fillStyle = '#d97706';
        const sign = y0 >= 0 ? '+' : '-';
        const absY0 = Math.abs(y0).toFixed(2);
        ctx.fillText(`Tangente: y = ${slope.toFixed(1)}x + ${(y0 - slope*x0).toFixed(1)}`, 20, 68);
    }
}

/**
 * WIDGET 3: SUITES (Évolutions)
 */
class SuitesWidget extends BaseMathWidget {
    draw() {
        const { u0, raison, type } = this.values;
        const ctx = this.ctx;
        
        // Custom Grid (no normal cartesian, just horizontal lines for terms)
        ctx.clearRect(0, 0, this.width, this.height);
        
        const terms = [u0];
        // Calculate 10 terms
        for (let i = 1; i <= 10; i++) {
            if (type === 0) { // Arithmetic
                terms.push(terms[i-1] + raison);
            } else { // Geometric
                terms.push(terms[i-1] * raison);
            }
        }
        
        // Find min and max for scaling
        let maxVal = Math.max(...terms, 10);
        let minVal = Math.min(...terms, -5);
        
        // Guard against Infinity
        if (!isFinite(maxVal)) maxVal = 100;
        if (!isFinite(minVal)) minVal = -100;
        
        const padTop = 40;
        const padBot = 40;
        const valRange = maxVal - minVal;
        
        // Draw axes & bars
        const spacing = 35; // px between terms
        const startX = 50;
        
        // Draw soft grid lines for values
        ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f1f5f9';
        ctx.lineWidth = 1;
        
        const gridSteps = 5;
        for (let i = 0; i <= gridSteps; i++) {
            const val = minVal + (valRange * i) / gridSteps;
            const y = this.height - padBot - ((val - minVal) / valRange) * (this.height - padTop - padBot);
            
            ctx.beginPath();
            ctx.moveTo(startX - 10, y);
            ctx.lineTo(startX + 10 * spacing, y);
            ctx.stroke();
            
            ctx.fillStyle = '#64748b';
            ctx.font = '9px monospace';
            ctx.fillText(val.toFixed(1), 10, y + 3);
        }
        
        // Draw Zero Line
        const zeroY = this.height - padBot - ((0 - minVal) / valRange) * (this.height - padTop - padBot);
        if (zeroY >= padTop && zeroY <= this.height - padBot) {
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(startX - 10, zeroY);
            ctx.lineTo(startX + 10 * spacing, zeroY);
            ctx.stroke();
        }
        
        // Draw terms
        terms.forEach((val, idx) => {
            const x = startX + idx * spacing;
            const y = this.height - padBot - ((val - minVal) / valRange) * (this.height - padTop - padBot);
            
            // Draw Vertical Stem
            ctx.strokeStyle = type === 0 ? '#10b981' : '#8b5cf6'; // Emerald or Violet
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, zeroY >= 0 ? zeroY : this.height - padBot);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Draw Dot on top
            ctx.fillStyle = type === 0 ? '#059669' : '#7c3aed';
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw label
            ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText(`u${idx}`, x - 6, this.height - 15);
            
            // Label value if not overflowing
            ctx.font = '8px monospace';
            ctx.fillText(val.toFixed(1), x - 10, y - 8);
        });
        
        // Title banner
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#eff6ff';
        ctx.fillRect(10, 10, 260, 24);
        ctx.fillStyle = type === 0 ? '#059669' : '#7c3aed';
        ctx.font = 'bold 10px sans-serif';
        const typeStr = type === 0 ? "ARITHMÉTIQUE" : "GÉOMÉTRIQUE";
        const formStr = type === 0 ? `uₙ₊₁ = uₙ + ${raison.toFixed(1)}` : `uₙ₊₁ = uₙ × ${raison.toFixed(1)}`;
        ctx.fillText(`SUITE ${typeStr} : ${formStr}`, 18, 26);
    }
}

/**
 * WIDGET 4: EXPONENTIELLE (Courbe et k)
 */
class ExponentielleWidget extends BaseMathWidget {
    draw() {
        const { k } = this.values;
        const ctx = this.ctx;
        
        const scaleX = 40;
        const scaleY = 35;
        const offsetX = 225; // center
        const offsetY = 240; // shifted down to see vertical growth
        
        this.drawGrid(scaleX, scaleY, offsetX, offsetY);
        
        // Trace f(x) = e^(k*x)
        ctx.strokeStyle = '#2563eb'; // Vibrant Royal Blue
        ctx.lineWidth = 3;
        ctx.beginPath();
        let pathStarted = false;
        
        for (let px = 0; px < this.width; px++) {
            const cx = (px - offsetX) / scaleX;
            // Compute y = e^(k*x)
            const cy = Math.exp(k * cx);
            const py = offsetY - cy * scaleY;
            
            if (py >= 0 && py <= this.height) {
                if (!pathStarted) {
                    ctx.moveTo(px, py);
                    pathStarted = true;
                } else {
                    ctx.lineTo(px, py);
                }
            } else {
                pathStarted = false;
            }
        }
        ctx.stroke();
        
        // Draw the point (0, 1) which is invariant
        const ptCenter = this.toCanvasCoords(0, 1, scaleX, scaleY, offsetX, offsetY);
        ctx.fillStyle = '#f59e0b'; // Amber Gold
        ctx.beginPath();
        ctx.arc(ptCenter.x, ptCenter.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Invariant label
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText("e⁰ = 1", ptCenter.x + 10, ptCenter.y + 4);
        
        // Mark point (1, e^k)
        if (k !== 0) {
            const ptOne = this.toCanvasCoords(1, Math.exp(k), scaleX, scaleY, offsetX, offsetY);
            if (ptOne.y >= 0 && ptOne.y <= this.height) {
                ctx.fillStyle = '#10b981'; // Green
                ctx.beginPath();
                ctx.arc(ptOne.x, ptOne.y, 5, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#ffffff' : '#0f172a';
                ctx.fillText(`(1; eᵏ) ≈ e${k > 0 ? '^' : ''}${k.toFixed(1)} ≈ ${Math.exp(k).toFixed(1)}`, ptOne.x + 8, ptOne.y - 4);
            }
        }
        
        // Text display on top left
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = varColor('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(12, 12, 190, 52, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
        ctx.font = '12px sans-serif';
        ctx.fillText(`Fonction: f(x) = e^(${k.toFixed(1)}x)`, 20, 28);
        ctx.font = '11px sans-serif';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`f'(x) = ${k.toFixed(1)}e^(${k.toFixed(1)}x)`, 20, 44);
    }
}

/**
 * WIDGET 5: PRODUIT SCALAIRE (Coordonnées et vecteurs)
 */
class ProduitScalaireWidget extends BaseMathWidget {
    draw() {
        const { ux, uy, vx, vy } = this.values;
        const ctx = this.ctx;
        
        const scale = 25;
        const offsetX = 225;
        const offsetY = 160;
        
        this.drawGrid(scale, scale, offsetX, offsetY);
        
        // Origin coordinates
        const origin = { x: offsetX, y: offsetY };
        
        // End coordinates
        const ptU = this.toCanvasCoords(ux, uy, scale, scale, offsetX, offsetY);
        const ptV = this.toCanvasCoords(vx, vy, scale, scale, offsetX, offsetY);
        
        // 1. Draw Vector U (Navy Blue/Cyan)
        ctx.strokeStyle = '#0284c7'; // cyan dark
        ctx.lineWidth = 3.5;
        this.drawArrow(ctx, origin.x, origin.y, ptU.x, ptU.y, 10);
        
        // Label Vector U
        ctx.fillStyle = '#0284c7';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`u(${ux.toFixed(1)}; ${uy.toFixed(1)})`, ptU.x + 8, ptU.y - 4);
        
        // 2. Draw Vector V (Purple)
        ctx.strokeStyle = '#c026d3'; // Magenta
        ctx.lineWidth = 3.5;
        this.drawArrow(ctx, origin.x, origin.y, ptV.x, ptV.y, 10);
        
        // Label Vector V
        ctx.fillStyle = '#c026d3';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`v(${vx.toFixed(1)}; ${vy.toFixed(1)})`, ptV.x + 8, ptV.y + 12);
        
        // Calculate Dot Product
        const dotProduct = ux * vx + uy * vy;
        
        // Draw Orthogonal indicator if dot product is zero
        const isOrthogonal = Math.abs(dotProduct) < 0.01;
        if (isOrthogonal) {
            ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
            ctx.strokeStyle = '#10b981'; // Green orthogonal marker
            ctx.lineWidth = 2;
            
            // Draw a small square along vectors
            // Orthogonal vectors, we can just draw a little perpendicular box
            // For simplicity, draw a square centered at origin if they are perpendicular
            ctx.beginPath();
            ctx.arc(origin.x, origin.y, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fill();
        }
        
        // Info calculation box
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = isOrthogonal ? '#10b981' : varColor('--border-color');
        ctx.lineWidth = isOrthogonal ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(12, 12, 230, 80, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`u · v = xx' + yy'`, 20, 28);
        
        ctx.font = '12px Courier New';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`= (${ux.toFixed(1)})(${vx.toFixed(1)}) + (${uy.toFixed(1)})(${vy.toFixed(1)})`, 20, 48);
        
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = isOrthogonal ? '#10b981' : (document.body.classList.contains('dark-theme') ? '#3b82f6' : '#1e3a8a');
        ctx.fillText(`u · v = ${dotProduct.toFixed(2)}`, 20, 70);
        
        if (isOrthogonal) {
            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = '#10b981';
            ctx.fillText("✔ ORTHOGONAUX", 140, 70);
        }
    }
    
    // Custom arrow helper
    drawArrow(ctx, fromx, fromy, tox, toy, headlen = 10) {
        // Line
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.stroke();
        
        // Head
        const angle = Math.atan2(toy - fromy, tox - fromx);
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
    }
}

/**
 * WIDGET 6: PROBABILITÉS (Arbre pondéré interactif)
 */
class ProbabilitesWidget extends BaseMathWidget {
    draw() {
        const { pa, pab, panb } = this.values;
        const ctx = this.ctx;
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        const qA = 1 - pa;
        const qAb = 1 - pab;
        const qAnb = 1 - panb;
        
        // Coordinates of tree nodes
        const xRoot = 40;
        const yRoot = 150;
        
        const xLevel1 = 160;
        const yNodeA = 60;
        const yNodeAn = 240;
        
        const xLevel2 = 280;
        const yNodeB1 = 30;
        const yNodeBn1 = 90;
        const yNodeB2 = 210;
        const yNodeBn2 = 270;
        
        // Draw branches and write text
        ctx.lineWidth = 2.5;
        ctx.font = 'bold 12px sans-serif';
        
        // Branch color
        ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#334155' : '#cbd5e1';
        
        // 1. Root to Level 1
        // Root -> A
        ctx.beginPath(); ctx.moveTo(xRoot, yRoot); ctx.lineTo(xLevel1, yNodeA); ctx.stroke();
        // Root -> A barre
        ctx.beginPath(); ctx.moveTo(xRoot, yRoot); ctx.lineTo(xLevel1, yNodeAn); ctx.stroke();
        
        // 2. Level 1 to Level 2
        // A -> B
        ctx.beginPath(); ctx.moveTo(xLevel1, yNodeA); ctx.lineTo(xLevel2, yNodeB1); ctx.stroke();
        // A -> B barre
        ctx.beginPath(); ctx.moveTo(xLevel1, yNodeA); ctx.lineTo(xLevel2, yNodeBn1); ctx.stroke();
        
        // A barre -> B
        ctx.beginPath(); ctx.moveTo(xLevel1, yNodeAn); ctx.lineTo(xLevel2, yNodeB2); ctx.stroke();
        // A barre -> B barre
        ctx.beginPath(); ctx.moveTo(xLevel1, yNodeAn); ctx.lineTo(xLevel2, yNodeBn2); ctx.stroke();
        
        // Draw Node Circles and Texts
        const drawNode = (x, y, txt, isRoot = false) => {
            ctx.fillStyle = isRoot ? '#64748b' : (txt.includes('B') ? '#c026d3' : '#3b82f6');
            ctx.beginPath();
            ctx.arc(x, y, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(txt, x, y);
        };
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        drawNode(xRoot, yRoot, 'Ω', true);
        
        drawNode(xLevel1, yNodeA, 'A');
        drawNode(xLevel1, yNodeAn, 'Ā');
        
        drawNode(xLevel2, yNodeB1, 'B');
        drawNode(xLevel2, yNodeBn1, 'B̄');
        drawNode(xLevel2, yNodeB2, 'B');
        drawNode(xLevel2, yNodeBn2, 'B̄');
        
        // Branch Labels (Probabilities)
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#0f172a';
        ctx.font = 'monospace 11px';
        ctx.textAlign = 'center';
        
        // p(A), p(Abar)
        ctx.fillText(pa.toFixed(2), (xRoot + xLevel1)/2 - 5, (yRoot + yNodeA)/2 - 12);
        ctx.fillText(qA.toFixed(2), (xRoot + xLevel1)/2 - 5, (yRoot + yNodeAn)/2 + 12);
        
        // p_A(B)
        ctx.fillText(pab.toFixed(2), (xLevel1 + xLevel2)/2, (yNodeA + yNodeB1)/2 - 10);
        ctx.fillText(qAb.toFixed(2), (xLevel1 + xLevel2)/2, (yNodeA + yNodeBn1)/2 + 12);
        
        // p_Abar(B)
        ctx.fillText(panb.toFixed(2), (xLevel1 + xLevel2)/2, (yNodeAn + yNodeB2)/2 - 10);
        ctx.fillText(qAnb.toFixed(2), (xLevel1 + xLevel2)/2, (yNodeAn + yNodeBn2)/2 + 12);
        
        // Calculate Leaves Intersections
        const pAnB = pa * pab;
        const pAnBb = pa * qAb;
        const pAbnB = qA * panb;
        const pAbnBb = qA * qAnb;
        
        ctx.textAlign = 'left';
        ctx.font = '10px monospace';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`P(A∩B)  = ${pAnB.toFixed(3)}`, xLevel2 + 25, yNodeB1);
        ctx.fillText(`P(A∩B̄)  = ${pAnBb.toFixed(3)}`, xLevel2 + 25, yNodeBn1);
        ctx.fillText(`P(Ā∩B)  = ${pAbnB.toFixed(3)}`, xLevel2 + 25, yNodeB2);
        ctx.fillText(`P(Ā∩B̄)  = ${pAbnBb.toFixed(3)}`, xLevel2 + 25, yNodeBn2);
        
        // Formula block totals
        const pTotalB = pAnB + pAbnB;
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#eff6ff';
        ctx.strokeStyle = '#c026d3';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(10, 10, 430, 36, 6);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`Probabilité totale P(B) = P(A∩B) + P(Ā∩B) = ${pTotalB.toFixed(3)}`, 20, 28);
    }
}

// Utility function to get CSS variable values
function varColor(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
}

/**
 * WIDGET 7: VARIABLES ALÉATOIRES (Centre de gravité / espérance)
 */
class VariablesAleatoiresWidget extends BaseMathWidget {
    draw() {
        const { x1, p1, p2 } = this.values;
        const ctx = this.ctx;
        
        // Setup Grid
        const scaleX = 18; // wider scaling to fit -10 to 10
        const scaleY = 120; // taller scaling for probabilities 0 to 1
        const offsetX = 225; // center horizontally
        const offsetY = 200; // shifted down to see the lever clearly
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw physical grid and axes
        this.drawGrid(scaleX, scaleY, offsetX, offsetY);
        
        // Values setup
        const x2 = 2;
        const x3 = 8;
        
        // Robust probability clamping
        let p1Val = p1;
        let p2Val = p2;
        if (p1Val + p2Val > 0.9) {
            const total = p1Val + p2Val;
            p1Val = (p1Val / total) * 0.9;
            p2Val = (p2Val / total) * 0.9;
        }
        const p3Val = 1 - p1Val - p2Val;
        
        // Calculate Expectation E(X)
        const expectation = x1 * p1Val + x2 * p2Val + x3 * p3Val;
        
        // Calculate Variance and Standard Deviation
        const variance = p1Val * Math.pow(x1 - expectation, 2) + 
                         p2Val * Math.pow(x2 - expectation, 2) + 
                         p3Val * Math.pow(x3 - expectation, 2);
        const stdDev = Math.sqrt(variance);
        
        // Draw the physical lever line (horizontal bar)
        ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#cbd5e1' : '#475569';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(offsetX - 10 * scaleX - 10, offsetY);
        ctx.lineTo(offsetX + 10 * scaleX + 10, offsetY);
        ctx.stroke();
        
        // Helper to draw a dynamic hanging mass/weight at coordinates
        const drawMass = (xVal, pVal, color, label) => {
            const pt = this.toCanvasCoords(xVal, pVal, scaleX, scaleY, offsetX, offsetY);
            const groundY = offsetY;
            
            // Draw support column (dashed or thin line) from ground to mass center
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(pt.x, groundY);
            ctx.lineTo(pt.x, pt.y);
            ctx.stroke();
            ctx.setLineDash([]); // reset
            
            // Draw mass as a beautiful rounded rectangle or weight circle
            const radius = Math.sqrt(pVal) * 26 + 6; // weight size proportional to probability
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Write value label inside the mass
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${label}`, pt.x, pt.y - 4);
            ctx.font = '8px sans-serif';
            ctx.fillText(`p=${pVal.toFixed(2)}`, pt.x, pt.y + 6);
        };
        
        // Draw the three masses
        drawMass(x1, p1Val, '#3b82f6', `x₁=${x1.toFixed(0)}`);
        drawMass(x2, p2Val, '#10b981', `x₂=${x2}`);
        drawMass(x3, p3Val, '#ec4899', `x₃=${x3}`);
        
        // Draw Fulcrum (Triangle Pivot representing Expectation E(X))
        const fulcrumPt = this.toCanvasCoords(expectation, 0, scaleX, scaleY, offsetX, offsetY);
        ctx.fillStyle = '#d97706'; // Gold
        ctx.beginPath();
        ctx.moveTo(fulcrumPt.x, fulcrumPt.y);
        ctx.lineTo(fulcrumPt.x - 12, fulcrumPt.y + 18);
        ctx.lineTo(fulcrumPt.x + 12, fulcrumPt.y + 18);
        ctx.closePath();
        ctx.fill();
        
        // Label Expectation below fulcrum
        ctx.fillStyle = '#d97706';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(`E(X) = ${expectation.toFixed(2)}`, fulcrumPt.x, fulcrumPt.y + 22);
        
        // Draw Distribution Table at the top of the canvas
        const tableX = 18;
        const tableY = 12;
        const cellW = 45;
        const cellH = 18;
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 250, 252, 0.8)';
        ctx.strokeStyle = varColor('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tableX, tableY, cellW * 4, cellH * 2, 6);
        ctx.fill();
        ctx.stroke();
        
        // Draw table grid
        ctx.beginPath();
        ctx.moveTo(tableX, tableY + cellH);
        ctx.lineTo(tableX + cellW * 4, tableY + cellH);
        for(let i=1; i<4; i++) {
            ctx.moveTo(tableX + cellW * i, tableY);
            ctx.lineTo(tableX + cellW * i, tableY + cellH * 2);
        }
        ctx.stroke();
        
        // Fill table text
        ctx.font = 'bold 9px sans-serif';
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#94a3b8' : '#64748b';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText("x_i", tableX + cellW/2, tableY + cellH/2);
        ctx.fillText("P(X=x_i)", tableX + cellW/2, tableY + cellH*1.5);
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#0f172a';
        ctx.fillText(`${x1.toFixed(0)}`, tableX + cellW*1.5, tableY + cellH/2);
        ctx.fillText(`${x2}`, tableX + cellW*2.5, tableY + cellH/2);
        ctx.fillText(`${x3}`, tableX + cellW*3.5, tableY + cellH/2);
        
        ctx.fillText(`${p1Val.toFixed(2)}`, tableX + cellW*1.5, tableY + cellH*1.5);
        ctx.fillText(`${p2Val.toFixed(2)}`, tableX + cellW*2.5, tableY + cellH*1.5);
        ctx.fillText(`${p3Val.toFixed(2)}`, tableX + cellW*3.5, tableY + cellH*1.5);
        
        // Draw Info Box for statistical calculations
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = varColor('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(265, 12, 172, 85, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText("Indicateurs Statistiques :", 273, 20);
        
        ctx.font = '10px Courier New';
        ctx.fillStyle = '#64748b';
        ctx.fillText(`E(X) = ${expectation.toFixed(2)}`, 273, 38);
        ctx.fillText(`V(X) = ${variance.toFixed(2)}`, 273, 53);
        
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#d97706';
        ctx.fillText(`σ(X) = ${stdDev.toFixed(2)}`, 273, 72);
    }
}

/**
 * WIDGET 8: TRIGONOMÉTRIE (Cercle trigonométrique interactif)
 */
class TrigonometrieWidget extends BaseMathWidget {
    draw() {
        const { theta } = this.values;
        const ctx = this.ctx;
        
        const scale = 100; // 100 pixels = 1 unit (excellent size for trigo circle)
        const offsetX = 225; // center
        const offsetY = 160; // center
        
        ctx.clearRect(0, 0, this.width, this.height);
        
        // Draw grid
        this.drawGrid(scale, scale, offsetX, offsetY);
        
        // Draw Trigo Circle (R = 1)
        ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#475569' : '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(offsetX, offsetY, scale, 0, Math.PI * 2);
        ctx.stroke();
        
        // Calculate coords of the point on circle
        const cosVal = Math.cos(theta);
        const sinVal = Math.sin(theta);
        const tanVal = Math.tan(theta);
        
        const pt = this.toCanvasCoords(cosVal, sinVal, scale, scale, offsetX, offsetY);
        
        // Draw Cosine segment (x-axis projection)
        ctx.strokeStyle = '#10b981'; // Green
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.lineTo(pt.x, offsetY);
        ctx.stroke();
        
        // Draw Sine segment (y-axis projection)
        ctx.strokeStyle = '#ec4899'; // Crimson pink
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(pt.x, offsetY);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        
        // Draw radius line (from O to M)
        ctx.strokeStyle = document.body.classList.contains('dark-theme') ? '#3b82f6' : '#1e3a8a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
        
        // Draw Point M
        ctx.fillStyle = '#ef4444'; // Red
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        
        // Label M
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`M(θ)`, pt.x + 8, pt.y - 4);
        
        // Draw dynamic angle arc
        ctx.strokeStyle = '#f59e0b'; // Gold
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(offsetX, offsetY, 25, 0, -theta, theta < 0);
        ctx.stroke();
        
        // Info Box with trigonometric values
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#1e293b' : '#f8fafc';
        ctx.strokeStyle = varColor('--border-color');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(12, 12, 185, 90, 8);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = document.body.classList.contains('dark-theme') ? '#f8fafc' : '#1e293b';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Angle θ = ${theta.toFixed(2)} rad`, 20, 28);
        ctx.fillText(`        ≈ ${(theta * 180 / Math.PI).toFixed(0)}°`, 20, 42);
        
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#10b981'; // Green for cos
        ctx.fillText(`cos(θ) = ${cosVal.toFixed(3)}`, 20, 62);
        
        ctx.fillStyle = '#ec4899'; // Crimson pink for sin
        ctx.fillText(`sin(θ) = ${sinVal.toFixed(3)}`, 20, 78);
        
        // Tan value display
        if (Math.abs(cosVal) > 0.01) {
            ctx.font = '11px sans-serif';
            ctx.fillStyle = '#8b5cf6'; // Violet
            ctx.fillText(`tan(θ) = ${tanVal.toFixed(3)}`, 20, 93);
        } else {
            ctx.font = '11px sans-serif';
            ctx.fillStyle = '#ef4444';
            ctx.fillText(`tan(θ) = non défini`, 20, 93);
        }
    }
}
