/**
 * CAHIER DE VACANCES - TERMINALE SPÉ MATHS
 * Contrôleur Principal de l'Application (Navigation, Profil, Stockage local, Exercices)
 */

// Global App State
let studentProfile = {
    firstname: "",
    lastname: ""
};

let currentChapterId = 1;
let currentChapterTab = "cours";
let currentExerciseLevel = 1;
let currentExerciseSubIndex = 0; // 0, 1, or 2 (3 exercises per level)

// Progress structure inside LocalStorage
let userProgress = {
    chapters: {},
    globalScore: null
};

// Initialize default progress for all 7 chapters
function initDefaultProgress() {
    CHAPTERS_DATA.forEach(ch => {
        userProgress.chapters[ch.id] = {
            read: false,
            ex1_1: false, ex1_2: false, ex1_3: false,
            ex2_1: false, ex2_2: false, ex2_3: false,
            ex3_1: false, ex3_2: false, ex3_3: false,
            quizScore: null
        };
    });
}

/* ==========================================================================
   1. INITIALIZATION & PROFILE MANAGEMENT
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Load profile
    const savedFirstname = localStorage.getItem("maths_firstname");
    const savedLastname = localStorage.getItem("maths_lastname");
    
    if (savedFirstname && savedLastname) {
        studentProfile.firstname = savedFirstname;
        studentProfile.lastname = savedLastname;
        document.getElementById("onboarding-modal").classList.remove("active");
        updateUserUI();
    } else {
        document.getElementById("onboarding-modal").classList.add("active");
    }
    
    // Load or initialize progress
    const savedProgress = localStorage.getItem("maths_student_progress");
    if (savedProgress) {
        try {
            userProgress = JSON.parse(savedProgress);
            
            // Failsafe: Ensure all chapters and sub-exercises exist in loaded progress
            CHAPTERS_DATA.forEach(ch => {
                if (!userProgress.chapters[ch.id]) {
                    userProgress.chapters[ch.id] = {
                        read: false,
                        ex1_1: false, ex1_2: false, ex1_3: false,
                        ex2_1: false, ex2_2: false, ex2_3: false,
                        ex3_1: false, ex3_2: false, ex3_3: false,
                        quizScore: null
                    };
                } else {
                    // Check sub-indices are defined
                    const c = userProgress.chapters[ch.id];
                    if (c.ex1_1 === undefined) {
                        // Migrate old single ex progress if any
                        c.ex1_1 = c.ex1 || false;
                        c.ex1_2 = c.ex1 || false;
                        c.ex1_3 = c.ex1 || false;
                        c.ex2_1 = c.ex2 || false;
                        c.ex2_2 = c.ex2 || false;
                        c.ex2_3 = c.ex2 || false;
                        c.ex3_1 = c.ex3 || false;
                        c.ex3_2 = c.ex3 || false;
                        c.ex3_3 = c.ex3 || false;
                    }
                }
            });
        } catch (e) {
            initDefaultProgress();
        }
    } else {
        initDefaultProgress();
    }
    
    // Load Theme Preference
    const savedTheme = localStorage.getItem("maths_theme") || "light";
    if (savedTheme === "dark") {
        document.body.className = "dark-theme";
        document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.className = "light-theme";
        document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
    
    // Setup and render Dashboard
    updateDashboardStats();
    renderChaptersGrid();
    
    // Initial view is dashboard
    switchView('dashboard');
});

function saveProfile(event) {
    event.preventDefault();
    const firstname = document.getElementById("student-firstname").value.trim();
    const lastname = document.getElementById("student-lastname").value.trim();
    
    if (!firstname || !lastname) return;
    
    studentProfile.firstname = firstname;
    studentProfile.lastname = lastname;
    
    localStorage.setItem("maths_firstname", firstname);
    localStorage.setItem("maths_lastname", lastname);
    
    // Fade out modal overlay
    document.getElementById("onboarding-modal").classList.remove("active");
    
    updateUserUI();
    triggerConfetti(30);
}

function resetProfile() {
    const confirmReset = confirm("Attention ! Vous allez réinitialiser votre profil ainsi que TOUTE votre progression dans ce cahier de vacances. Continuer ?");
    if (confirmReset) {
        localStorage.clear();
        window.location.reload();
    }
}

function updateUserUI() {
    const fullname = `${studentProfile.firstname} ${studentProfile.lastname.toUpperCase()}`;
    document.getElementById("user-display-name").innerText = studentProfile.firstname;
    document.getElementById("user-display-name").title = fullname;
    document.getElementById("welcome-name").innerText = studentProfile.firstname;
}

function toggleTheme() {
    const isDark = document.body.classList.contains("dark-theme");
    const toggleBtn = document.getElementById("theme-toggle");
    
    if (isDark) {
        document.body.className = "light-theme";
        toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem("maths_theme", "light");
    } else {
        document.body.className = "dark-theme";
        toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
        localStorage.setItem("maths_theme", "dark");
    }
    
    // Redraw active widget to load dark theme styles correctly
    if (activeWidgetInstance) {
        activeWidgetInstance.draw();
    }
}

/* ==========================================================================
   2. VIEW NAVIGATION SWITCHING
   ========================================================================== */

function switchView(viewName, chapterId = null) {
    // Remove active from all views
    document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");
    
    if (viewName === 'dashboard') {
        document.getElementById("view-dashboard").classList.add("active");
        document.getElementById("nav-dashboard").classList.add("active");
        pageTitle.innerText = "Tableau de Bord";
        pageSubtitle.innerText = "Préparez votre réussite en mathématiques pour le baccalauréat";
        
        // Refresh dashboard statistics
        updateDashboardStats();
        renderChaptersGrid();
        
    } else if (viewName === 'chapter' && chapterId !== null) {
        currentChapterId = chapterId;
        document.getElementById("view-chapter").classList.add("active");
        
        // Highlight active sidebar chapter
        const navItem = document.getElementById(`nav-ch-${chapterId}`);
        if (navItem) navItem.classList.add("active");
        
        loadChapterContent(chapterId);
        
    } else if (viewName === 'global') {
        document.getElementById("view-global").classList.add("active");
        document.getElementById("nav-global").classList.add("active");
        pageTitle.innerText = "Évaluation Finale";
        pageSubtitle.innerText = "Grand examen de validation transversale";
        
        // Set intro screen status based on progress
        const overall = getOverallProgress();
        const reqDiv = document.getElementById("req-chapters-status");
        const startBtn = document.getElementById("btn-start-global");
        
        if (overall < 70) {
            reqDiv.innerHTML = `
                <span class="req-icon text-error"><i class="fa-solid fa-circle-exclamation" style="color:var(--color-error)"></i></span>
                <span class="req-text">Vous devez progresser dans les chapitres d'abord. Nous recommandons au moins <strong>70% de progression globale</strong> (Actuel : <strong>${overall}%</strong>) pour lancer ce test.</span>
            `;
            startBtn.disabled = true;
            startBtn.title = "Progression insuffisante";
        } else {
            reqDiv.innerHTML = `
                <span class="req-icon"><i class="fa-solid fa-circle-check"></i></span>
                <span class="req-text"><strong>Progression validée !</strong> Vous avez accompli ${overall}% du programme, vous êtes paré pour l'épreuve.</span>
            `;
            startBtn.disabled = false;
            startBtn.title = "";
        }
        
        // Reset screen state
        document.getElementById("global-intro-screen").classList.add("active");
        document.getElementById("global-intro-screen").classList.remove("d-none");
        document.getElementById("global-quiz-screen").classList.add("d-none");
        document.getElementById("global-results-screen").classList.add("d-none");
    } else if (viewName === 'revision') {
        document.getElementById("view-revision").classList.add("active");
        document.getElementById("nav-revision").classList.add("active");
        pageTitle.innerText = "Révision Générale";
        pageSubtitle.innerText = "Fiche de révision générale de Première Spé Math et son corrigé";
        
        // Hide correction area by default when switching to revision view
        const correctionContainer = document.getElementById("correction-pdf-container");
        if (correctionContainer) {
            correctionContainer.classList.add("d-none");
        }
    }
}

/* ==========================================================================
   3. PROGRESS & LOCALSTORAGE CALCULATION
   ========================================================================== */

function getChapterProgress(chapterId) {
    const p = userProgress.chapters[chapterId];
    if (!p) return 0;
    
    // Balanced weight breakdown: 
    // Course read = 10%
    // 9 exercises = 9 * 10% = 90% (Course + exercises = 100% complete)
    // Quiz score is a bonus that unlocks badges but completion depends on course read + all exercises done.
    let total = 0;
    if (p.read) total += 10;
    
    if (p.ex1_1) total += 10;
    if (p.ex1_2) total += 10;
    if (p.ex1_3) total += 10;
    
    if (p.ex2_1) total += 10;
    if (p.ex2_2) total += 10;
    if (p.ex2_3) total += 10;
    
    if (p.ex3_1) total += 10;
    if (p.ex3_2) total += 10;
    if (p.ex3_3) total += 10;
    
    return total;
}

function getOverallProgress() {
    let totalProgress = 0;
    CHAPTERS_DATA.forEach(ch => {
        totalProgress += getChapterProgress(ch.id);
    });
    return Math.round(totalProgress / CHAPTERS_DATA.length);
}

function saveProgressToStorage() {
    localStorage.setItem("maths_student_progress", JSON.stringify(userProgress));
    updateSidebarStatusIcons();
}

function saveChapterScore(chapterId, score) {
    if (!userProgress.chapters[chapterId]) return;
    userProgress.chapters[chapterId].quizScore = score;
    saveProgressToStorage();
}

function saveGlobalScore(score) {
    userProgress.globalScore = score;
    localStorage.setItem("maths_global_score", score.toString());
    saveProgressToStorage();
}

function markCourseRead() {
    const chId = currentChapterId;
    if (!userProgress.chapters[chId]) return;
    
    userProgress.chapters[chId].read = true;
    saveProgressToStorage();
    
    // Animate progress circle in header
    updateChapterProgressUI(chId);
    
    // Auto switch tab to exercises
    switchChapterTab("exercices");
}

function markExerciseDone(chapterId, level, subIdx) {
    const ch = userProgress.chapters[chapterId];
    if (!ch) return;
    
    const key = `ex${level}_${subIdx + 1}`;
    ch[key] = true;
    
    saveProgressToStorage();
    updateChapterProgressUI(chapterId);
}

function updateSidebarStatusIcons() {
    CHAPTERS_DATA.forEach(ch => {
        const iconContainer = document.querySelector(`#nav-ch-${ch.id} .chapter-status-icon`);
        if (!iconContainer) return;
        
        const prog = getChapterProgress(ch.id);
        if (prog === 100) {
            iconContainer.innerHTML = '<i class="fa-solid fa-circle-check chapter-status-completed"></i>';
        } else if (prog > 0) {
            iconContainer.innerHTML = '<i class="fa-solid fa-circle-play chapter-status-started"></i>';
        } else {
            iconContainer.innerHTML = '<i class="fa-regular fa-circle"></i>';
        }
    });
    
    // final evaluation badge
    const finalBadge = document.getElementById("final-badge");
    if (finalBadge) {
        const overall = getOverallProgress();
        if (overall >= 70) {
            finalBadge.className = "badge badge-unlocked";
            finalBadge.innerHTML = '<i class="fa-solid fa-unlock"></i>';
        } else {
            finalBadge.className = "badge badge-locked";
            finalBadge.innerHTML = '<i class="fa-solid fa-lock"></i>';
        }
    }
}

function updateDashboardStats() {
    const overall = getOverallProgress();
    document.getElementById("stat-progress").innerText = `${overall}%`;
    document.getElementById("stat-progress-bar").style.width = `${overall}%`;
    
    // Masters count (100% completed)
    let completedCount = 0;
    let badgeCount = 0;
    let quizSum = 0;
    let quizCount = 0;
    
    CHAPTERS_DATA.forEach(ch => {
        const p = getChapterProgress(ch.id);
        if (p === 100) completedCount++;
        
        const prog = userProgress.chapters[ch.id];
        if (prog.quizScore !== null) {
            quizSum += prog.quizScore;
            quizCount++;
            if (prog.quizScore >= 3) badgeCount++;
        }
    });
    
    // Dynamically show count out of total chapters (7)
    const totalChapters = CHAPTERS_DATA.length;
    document.getElementById("stat-chapters-done").innerText = `${completedCount} / ${totalChapters}`;
    document.getElementById("stat-badge-count").innerText = `${badgeCount} / ${totalChapters}`;
    
    // Average score (/20 format)
    const avgScoreContainer = document.getElementById("stat-avg-score");
    if (quizCount > 0) {
        const avgRaw = (quizSum / quizCount) * 4; // convert out of 5 to out of 20
        const avg = Math.round(avgRaw * 10) / 10;
        avgScoreContainer.innerText = `${avg} / 20`;
    } else {
        avgScoreContainer.innerText = `-- / 20`;
    }
    
    updateSidebarStatusIcons();
}

function renderChaptersGrid() {
    const grid = document.getElementById("chapters-list-container");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    CHAPTERS_DATA.forEach(ch => {
        const progress = getChapterProgress(ch.id);
        
        let statusBadgeClass = "fa-regular fa-circle";
        if (progress === 100) statusBadgeClass = "fa-solid fa-circle-check completed";
        else if (progress > 0) statusBadgeClass = "fa-solid fa-circle-play text-yellow";
        
        grid.innerHTML += `
            <div class="chapter-card shadow-sm fade-in">
                <div class="chapter-card-header">
                    <span class="chapter-card-num">Module 0${ch.id} — ${ch.tag}</span>
                    <span class="chapter-card-badge"><i class="${statusBadgeClass}"></i></span>
                </div>
                <h4>${ch.title}</h4>
                <p>${ch.desc}</p>
                <div class="chapter-card-footer">
                    <span class="chapter-progress-lbl">Progression : ${progress}%</span>
                    <button class="btn btn-outline" onclick="switchView('chapter', ${ch.id})">
                        ${progress === 100 ? 'Réviser' : (progress > 0 ? 'Continuer' : 'Commencer')} 
                        <i class="fa-solid fa-chevron-right" style="font-size:10px"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

/* ==========================================================================
   4. CHAPTER AND TABS RENDERING
   ========================================================================== */

function loadChapterContent(chapterId) {
    const ch = CHAPTERS_DATA.find(c => c.id === chapterId);
    if (!ch) return;
    
    // Header tags
    document.getElementById("current-chapter-num").innerText = `Chapitre 0${ch.id}`;
    document.getElementById("current-chapter-title").innerText = ch.title;
    document.getElementById("current-chapter-desc").innerText = ch.desc;
    
    // Document Title
    document.getElementById("page-title").innerText = ch.title;
    document.getElementById("page-subtitle").innerText = `Module Spé Maths de niveau Première révisé`;
    
    // Render Cours Text
    const coursContainer = document.getElementById("cours-text-container");
    coursContainer.innerHTML = ch.cours;
    
    // Trigger KaTeX rendering on the loaded course
    renderMathInElement(coursContainer, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
    
    // Progress Circle
    updateChapterProgressUI(chapterId);
    
    // Reset internal chapter navigation
    currentChapterTab = "cours";
    switchChapterTab("cours");
    
    currentExerciseLevel = 1;
    currentExerciseSubIndex = 0;
    switchExerciseLevel(1);
    
    // Reset chapter quiz screen to startup screen
    const quizBody = document.getElementById("quiz-body-container");
    if (quizBody) {
        quizBody.innerHTML = `
            <div class="quiz-start-screen text-center">
                <i class="fa-solid fa-graduation-cap quiz-start-icon text-primary"></i>
                <h4>Prêt pour l'évaluation ?</h4>
                <p>L'évaluation comporte 5 questions (QCM et questions de calcul). Elle n'est pas limitée dans le temps, réfléchissez bien avant de soumettre vos réponses.</p>
                <button class="btn btn-primary btn-lg" onclick="startChapterQuiz()">Lancer l'évaluation</button>
            </div>
        `;
    }
}

function updateChapterProgressUI(chapterId) {
    const progress = getChapterProgress(chapterId);
    const textDisp = document.getElementById("chapter-progress-text");
    const circle = document.getElementById("chapter-progress-circle");
    
    if (textDisp) textDisp.innerText = `${progress}%`;
    
    if (circle) {
        // Circle circumference is 2 * PI * r = 2 * PI * 34 = 213.6
        const circumference = 213.6;
        const offset = circumference - (progress / 100) * circumference;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
}

function switchChapterTab(tabName) {
    currentChapterTab = tabName;
    
    // Style tabs buttons
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById(`tab-${tabName}`).classList.add("active");
    
    // Show active pane
    document.querySelectorAll(".tab-pane").forEach(pane => pane.classList.remove("active"));
    document.getElementById(`chapter-tab-${tabName}`).classList.add("active");
    
    // Load Widget only if course tab is active
    if (tabName === "cours") {
        initMathWidget(currentChapterId, "math-widget-canvas", "widget-controls-container");
    }
}

/* ==========================================================================
   5. PROGRESSIVE EXERCISES CONTROLLER (3 EXERCISES PER LEVEL)
   ========================================================================== */

function switchExerciseLevel(level) {
    currentExerciseLevel = level;
    currentExerciseSubIndex = 0; // reset sub-step to first exercise
    
    // Update level map buttons
    document.querySelectorAll(".ex-map-btn").forEach(btn => btn.classList.remove("active"));
    document.getElementById(`ex-map-${level}`).classList.add("active");
    
    renderActiveExercise();
}

function switchExerciseSubIndex(subIdx) {
    const chId = currentChapterId;
    const level = currentExerciseLevel;
    const progressState = userProgress.chapters[chId];
    
    // Lock guard: can't skip to next sub-exercise if previous ones aren't solved
    if (subIdx === 1) {
        const prevKey = `ex${level}_1`;
        if (!progressState[prevKey]) {
            alert("Veuillez d'abord résoudre l'exercice précédent.");
            return;
        }
    }
    if (subIdx === 2) {
        const prevKey = `ex${level}_2`;
        if (!progressState[prevKey]) {
            alert("Veuillez d'abord résoudre l'exercice précédent.");
            return;
        }
    }
    
    currentExerciseSubIndex = subIdx;
    renderActiveExercise();
}

function renderActiveExercise() {
    const chId = currentChapterId;
    const level = currentExerciseLevel;
    const subIdx = currentExerciseSubIndex;
    
    const chapter = CHAPTERS_DATA.find(c => c.id === chId);
    if (!chapter) return;
    
    const levelData = chapter.exercises.find(e => e.level === level);
    const container = document.getElementById("active-exercise-container");
    
    if (!levelData || !container) return;
    
    const ex = levelData.questions[subIdx];
    if (!ex) return;
    
    // Check if this specific sub-exercise was completed
    const progressState = userProgress.chapters[chId];
    const key = `ex${level}_${subIdx + 1}`;
    const isAlreadyDone = progressState[key] || false;
    
    // Check lock state for levels (Level 2 needs Level 1 completely done)
    let isLevelLocked = false;
    if (level === 2 && (!progressState.ex1_1 || !progressState.ex1_2 || !progressState.ex1_3)) isLevelLocked = true;
    if (level === 3 && (!progressState.ex2_1 || !progressState.ex2_2 || !progressState.ex2_3)) isLevelLocked = true;
    
    if (isLevelLocked) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fa-solid fa-lock text-muted" style="font-size: 48px; margin-bottom: 16px;"></i>
                <h4>Niveau Verrouillé</h4>
                <p class="text-secondary">Vous devez d'abord réussir les <strong>3 exercices</strong> du <strong>Niveau ${level - 1}</strong> pour débloquer cette étape.</p>
            </div>
        `;
        return;
    }
    
    // Build sub-step dots indicators in the header
    let subStepDotsHtml = "";
    for (let i = 0; i < 3; i++) {
        const isCompleted = progressState[`ex${level}_${i+1}`];
        const isActive = i === subIdx;
        let dotClass = "sub-dot";
        if (isActive) dotClass += " active";
        if (isCompleted) dotClass += " completed";
        
        subStepDotsHtml += `
            <button class="${dotClass}" onclick="switchExerciseSubIndex(${i})" title="Exercice ${level}.${i+1}">
                Ex ${level}.${i+1} ${isCompleted ? '✔' : ''}
            </button>
        `;
    }
    
    // Render answer forms
    let answerZoneHtml = "";
    selectedExOptionIdx = null; // reset choice
    
    if (ex.type === "input") {
        answerZoneHtml = `
            <div class="numeric-input-group">
                <label for="ex-user-input">Votre réponse :</label>
                <div class="input-with-validation">
                    <input type="text" id="ex-user-input" class="math-input-field" 
                           placeholder="${ex.placeholder || 'Saisissez votre réponse'}" ${isAlreadyDone ? 'disabled' : ''}
                           onkeydown="if(event.key === 'Enter') validateExerciseAnswer()">
                    <button class="btn btn-primary" id="ex-btn-submit" onclick="validateExerciseAnswer()" ${isAlreadyDone ? 'disabled' : ''}>
                        Valider
                    </button>
                </div>
            </div>
        `;
    } else if (ex.type === "qcm") {
        let choicesHtml = "";
        ex.choices.forEach((choice, idx) => {
            choicesHtml += `
                <div class="qcm-option-card" id="ex-opt-${idx}" onclick="selectExerciseOption(${idx})">
                    <div class="qcm-radio"></div>
                    <div class="qcm-text math-latex-render">${choice}</div>
                </div>
            `;
        });
        
        answerZoneHtml = `
            <div class="qcm-options-container">
                <p style="font-size: 13.5px; font-weight: 600; margin-bottom: 10px;">Sélectionnez la bonne proposition :</p>
                <div class="qcm-options-grid">
                    ${choicesHtml}
                </div>
                <button class="btn btn-primary" id="ex-btn-submit" onclick="validateExerciseAnswer()" disabled style="margin-top: 10px;">
                    Valider
                </button>
            </div>
        `;
    }
    
    container.innerHTML = `
        <div class="fade-in">
            <div class="ex-level-title" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="level-badge level-${level}">Niveau ${level}</span>
                    <h4 style="margin: 0;">${levelData.title} — Exercice ${subIdx + 1}/3</h4>
                </div>
                <div class="sub-step-dots-container" style="display: flex; gap: 6px;">
                    ${subStepDotsHtml}
                </div>
            </div>
            
            <div class="ex-statement math-latex-render" style="margin-bottom: 24px;">
                ${ex.statement}
            </div>
            
            <div class="hint-container" style="margin-bottom: 20px;">
                <button class="hint-trigger-btn" id="btn-hint-trigger" onclick="toggleHint()">
                    <i class="fa-regular fa-lightbulb"></i> Besoin d'un indice ?
                </button>
                <div class="hint-box d-none" id="ex-hint-box">
                    ${ex.hint}
                </div>
            </div>
            
            <div class="ex-answer-zone">
                ${answerZoneHtml}
            </div>
            
            <div id="ex-validation-feedback" class="d-none"></div>
            <div id="ex-correction-details" class="d-none"></div>
        </div>
    `;
    
    // Trigger LaTeX parsing on the entire active exercise area
    renderMathInElement(container, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
    
    // Pre-show results if already completed
    if (isAlreadyDone) {
        showExerciseCorrection(ex, true);
    }
}

// Variables for QCM selected state in Exercise
let selectedExOptionIdx = null;

function selectExerciseOption(optionIdx) {
    const isCompleted = isExerciseCompletedState();
    if (isCompleted) return;
    
    selectedExOptionIdx = optionIdx;
    
    // Highlight
    const cards = document.querySelectorAll("#active-exercise-container .qcm-option-card");
    cards.forEach((card, idx) => {
        if (idx === optionIdx) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
    
    // Enable submit
    const submitBtn = document.getElementById("ex-btn-submit");
    if (submitBtn) submitBtn.removeAttribute("disabled");
}

function isExerciseCompletedState() {
    const chId = currentChapterId;
    const lvl = currentExerciseLevel;
    const subIdx = currentExerciseSubIndex;
    const progressState = userProgress.chapters[chId];
    return progressState[`ex${lvl}_${subIdx + 1}`] || false;
}

function toggleHint() {
    const hintBox = document.getElementById("ex-hint-box");
    if (hintBox) {
        hintBox.classList.toggle("d-none");
    }
}

function validateExerciseAnswer() {
    const chId = currentChapterId;
    const level = currentExerciseLevel;
    const subIdx = currentExerciseSubIndex;
    
    const chapter = CHAPTERS_DATA.find(c => c.id === chId);
    if (!chapter) return;
    
    const levelData = chapter.exercises.find(e => e.level === level);
    if (!levelData) return;
    
    const ex = levelData.questions[subIdx];
    if (!ex) return;
    
    let isCorrect = false;
    
    if (ex.type === "input") {
        const userInput = document.getElementById("ex-user-input").value.trim();
        if (userInput === "") {
            alert("Veuillez saisir votre réponse.");
            return;
        }
        
        // Normalize: replace comma by dot, remove spaces, keep lower case
        const normUser = userInput.replace(',', '.').replace(/\s+/g, '').toLowerCase();
        const normAns = ex.answer.replace(',', '.').replace(/\s+/g, '').toLowerCase();
        
        isCorrect = (normUser === normAns);
    } else if (ex.type === "qcm") {
        isCorrect = (selectedExOptionIdx === ex.answer);
    }
    
    // UI show correction
    showExerciseCorrection(ex, isCorrect);
    
    if (isCorrect) {
        markExerciseDone(chId, level, subIdx);
        triggerConfetti(25);
    }
}

function showExerciseCorrection(ex, isCorrect) {
    const feedbackBox = document.getElementById("ex-validation-feedback");
    const correctionBox = document.getElementById("ex-correction-details");
    const submitBtn = document.getElementById("ex-btn-submit");
    
    if (!feedbackBox || !correctionBox) return;
    
    // Disable inputs
    if (submitBtn) submitBtn.disabled = true;
    const input = document.getElementById("ex-user-input");
    if (input) input.disabled = true;
    
    // Lock QCM styles
    if (ex.type === "qcm") {
        const cards = document.querySelectorAll("#active-exercise-container .qcm-option-card");
        cards.forEach((card, idx) => {
            card.style.cursor = 'default';
            if (idx === ex.answer) {
                card.style.borderColor = 'var(--color-success)';
                card.style.backgroundColor = 'var(--color-success-light)';
            } else if (idx === selectedExOptionIdx) {
                card.style.borderColor = 'var(--color-error)';
                card.style.backgroundColor = 'var(--color-error-light)';
            }
        });
    }
    
    // 1. Feedback message
    feedbackBox.className = `validation-message ${isCorrect ? 'validation-message-success' : 'validation-message-error'}`;
    feedbackBox.innerHTML = `
        <div class="validation-icon">
            <i class="fa-solid ${isCorrect ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
        </div>
        <div class="validation-text">
            <h5>${isCorrect ? 'Félicitations ! Excellente réponse.' : 'Réponse incorrecte.'}</h5>
            <p>${isCorrect ? 'Vous avez validé cette étape avec brio !' : 'N\'hésitez pas à relire l\'indice et à observer la correction ci-dessous pour comprendre votre erreur.'}</p>
        </div>
    `;
    feedbackBox.classList.remove("d-none");
    
    // 2. Step-by-step detailed correction
    correctionBox.className = "correction-box shadow-sm fade-in";
    
    // Setup class flow for continue buttons (Exercise 1 -> 2 -> 3 -> Level 2 -> Level 3 -> Quiz)
    let continueBtnHtml = "";
    
    if (isCorrect) {
        if (currentExerciseSubIndex < 2) {
            // Go to next sub-exercise of same level
            continueBtnHtml = `
                <button class="btn btn-primary" onclick="switchExerciseSubIndex(${currentExerciseSubIndex + 1})">
                    Exercice suivant (${currentExerciseSubIndex + 2}/3) <i class="fa-solid fa-arrow-right"></i>
                </button>
            `;
        } else {
            // Level is completed!
            if (currentExerciseLevel < 3) {
                // Go to next level
                continueBtnHtml = `
                    <button class="btn btn-success" onclick="switchExerciseLevel(${currentExerciseLevel + 1})">
                        Passer au Niveau ${currentExerciseLevel + 1} <i class="fa-solid fa-circle-arrow-up"></i>
                    </button>
                `;
            } else {
                // All exercises done, continue to Chapter Quiz
                continueBtnHtml = `
                    <button class="btn btn-success btn-lg" onclick="switchChapterTab('evaluation')">
                        Passer à l'évaluation du chapitre (Quiz) <i class="fa-solid fa-graduation-cap"></i>
                    </button>
                `;
            }
        }
    }
    
    correctionBox.innerHTML = `
        <h4><i class="fa-solid fa-chalkboard-user"></i> Correction détaillée</h4>
        <div class="correction-content math-latex-render" style="margin-bottom: 20px;">
            ${ex.solution}
        </div>
        
        ${continueBtnHtml ? `
            <div style="text-align: right; border-top: 1px solid var(--border-color); padding-top: 16px;">
                ${continueBtnHtml}
            </div>
        ` : ''}
    `;
    correctionBox.classList.remove("d-none");
    
    // Render LaTeX inside feedback and correction
    renderMathInElement(feedbackBox, { 
        delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
        throwOnError: false
    });
    renderMathInElement(correctionBox, { 
        delimiters: [{left: '$$', right: '$$', display: true}, {left: '$', right: '$', display: false}],
        throwOnError: false
    });
}

/* ==========================================================================
   6. MAIN ACCESSIBILITY MODALS
   ========================================================================== */

function showHelp() {
    document.getElementById("help-modal").classList.add("active");
}

function closeHelpModal() {
    document.getElementById("help-modal").classList.remove("active");
}

function toggleCorrectionPDF() {
    const container = document.getElementById("correction-pdf-container");
    if (container) {
        container.classList.toggle("d-none");
        if (!container.classList.contains("d-none")) {
            // Trigger math rendering inside correction area
            renderMathInElement(container, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
            // Smooth scroll into view
            container.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
