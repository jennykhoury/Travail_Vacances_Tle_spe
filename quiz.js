/**
 * CAHIER DE VACANCES - TERMINALE SPÉ MATHS
 * Moteur des Évaluations (Quiz de Chapitre & Évaluation Globale) & Certification
 */

// States
let activeQuiz = {
    chapterId: null,
    questions: [],
    currentIndex: 0,
    userAnswers: [], // stores indexes of selected options
    isSubmitted: false,
    score: 0
};

let globalQuiz = {
    questions: [],
    currentIndex: 0,
    userAnswers: [], // index of selected option or null
    isCompleted: false,
    score: 0
};

/* ==========================================================================
   1. CHAPTER QUIZZES ENGINE
   ========================================================================== */

function startChapterQuiz() {
    const chId = currentChapterId;
    const chapter = CHAPTERS_DATA.find(c => c.id === chId);
    if (!chapter) return;
    
    activeQuiz = {
        chapterId: chId,
        questions: chapter.quiz,
        currentIndex: 0,
        userAnswers: Array(chapter.quiz.length).fill(null),
        isSubmitted: false,
        score: 0
    };
    
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const qIndex = activeQuiz.currentIndex;
    const question = activeQuiz.questions[qIndex];
    const container = document.getElementById("quiz-body-container");
    
    if (!question || !container) return;
    
    let choicesHtml = "";
    question.choices.forEach((choice, idx) => {
        choicesHtml += `
            <div class="qcm-option-card" id="quiz-opt-${idx}" onclick="selectQuizOption(${idx})">
                <div class="qcm-radio"></div>
                <div class="qcm-text math-latex-render">${choice}</div>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="quiz-progress-header">
            <span class="q-progress-text">Question <strong>${qIndex + 1}</strong> sur <strong>5</strong></span>
            <div class="q-progress-bar-bg">
                <div class="q-progress-bar-fill" style="width: ${(qIndex + 1) * 20}%"></div>
            </div>
        </div>
        
        <div class="quiz-question-card fade-in">
            <h4 class="math-latex-render">${question.question}</h4>
            <div class="qcm-options-grid">
                ${choicesHtml}
            </div>
        </div>
        
        <div id="quiz-feedback-box" class="d-none"></div>
        
        <div class="quiz-navigation-actions" style="margin-top: 20px;">
            <button class="btn btn-secondary" id="quiz-btn-prev" onclick="quizPrevQuestion()" ${qIndex === 0 ? 'disabled' : ''}>
                <i class="fa-solid fa-arrow-left"></i> Précédent
            </button>
            <button class="btn btn-primary" id="quiz-btn-action" onclick="validateQuizAnswer()" disabled>
                Valider ma réponse
            </button>
        </div>
    `;
    
    // Trigger LaTeX rendering for current formulas
    renderMathInElement(container, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
}

function selectQuizOption(optionIdx) {
    if (activeQuiz.isSubmitted) return; // locked after validation
    
    const qIndex = activeQuiz.currentIndex;
    activeQuiz.userAnswers[qIndex] = optionIdx;
    
    // UI update
    const cards = document.querySelectorAll(".qcm-option-card");
    cards.forEach((card, idx) => {
        if (idx === optionIdx) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
    
    // Enable validate button
    const btn = document.getElementById("quiz-btn-action");
    if (btn) btn.removeAttribute("disabled");
}

function validateQuizAnswer() {
    const qIndex = activeQuiz.currentIndex;
    const question = activeQuiz.questions[qIndex];
    const selected = activeQuiz.userAnswers[qIndex];
    const correct = question.answer;
    
    const feedbackBox = document.getElementById("quiz-feedback-box");
    const actionBtn = document.getElementById("quiz-btn-action");
    
    if (selected === null || !feedbackBox || !actionBtn) return;
    
    activeQuiz.isSubmitted = true;
    
    // Style correct and incorrect options
    const cards = document.querySelectorAll(".qcm-option-card");
    cards.forEach((card, idx) => {
        card.style.cursor = 'default';
        if (idx === correct) {
            card.style.borderColor = 'var(--color-success)';
            card.style.backgroundColor = 'var(--color-success-light)';
            card.querySelector('.qcm-radio').style.backgroundColor = 'var(--color-success)';
            card.querySelector('.qcm-radio').style.borderColor = 'var(--color-success)';
        } else if (idx === selected) {
            card.style.borderColor = 'var(--color-error)';
            card.style.backgroundColor = 'var(--color-error-light)';
            card.querySelector('.qcm-radio').style.backgroundColor = 'var(--color-error)';
            card.querySelector('.qcm-radio').style.borderColor = 'var(--color-error)';
        }
    });
    
    // Show Feedback Box
    feedbackBox.className = `validation-message ${selected === correct ? 'validation-message-success' : 'validation-message-error'}`;
    feedbackBox.innerHTML = `
        <div class="validation-icon">
            <i class="fa-solid ${selected === correct ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
        </div>
        <div class="validation-text math-latex-render">
            <h5>${selected === correct ? 'Bonne réponse !' : 'Mauvaise réponse.'}</h5>
            <p>${question.explanation}</p>
        </div>
    `;
    
    // Render math in feedback
    renderMathInElement(feedbackBox, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
    
    // Change Button Actions
    const isLast = qIndex === activeQuiz.questions.length - 1;
    if (isLast) {
        actionBtn.innerHTML = `Terminer l'évaluation <i class="fa-solid fa-flag-checkered"></i>`;
        actionBtn.onclick = finishChapterQuiz;
    } else {
        actionBtn.innerHTML = `Question suivante <i class="fa-solid fa-arrow-right"></i>`;
        actionBtn.onclick = quizNextQuestion;
    }
}

function quizNextQuestion() {
    activeQuiz.currentIndex++;
    activeQuiz.isSubmitted = false;
    renderQuizQuestion();
}

function quizPrevQuestion() {
    if (activeQuiz.currentIndex > 0) {
        activeQuiz.currentIndex--;
        activeQuiz.isSubmitted = false;
        renderQuizQuestion();
        // preselect if previously answered
        const prevAnswer = activeQuiz.userAnswers[activeQuiz.currentIndex];
        if (prevAnswer !== null) {
            setTimeout(() => selectQuizOption(prevAnswer), 50);
        }
    }
}

function finishChapterQuiz() {
    // Grade the quiz
    let score = 0;
    activeQuiz.questions.forEach((q, idx) => {
        if (activeQuiz.userAnswers[idx] === q.answer) {
            score++;
        }
    });
    
    activeQuiz.score = score;
    
    // Update local storage via app controller
    saveChapterScore(activeQuiz.chapterId, score);
    
    const container = document.getElementById("quiz-body-container");
    if (!container) return;
    
    const passed = score >= 3;
    
    // Trigger confetti if scored 5/5
    if (score === 5) {
        triggerConfetti(100);
    } else if (passed) {
        triggerConfetti(40);
    }
    
    const chapterName = CHAPTERS_DATA.find(c => c.id === activeQuiz.chapterId).title;
    
    container.innerHTML = `
        <div class="quiz-results-card text-center fade-in">
            <div class="quiz-results-score-circle ${passed ? 'passed' : 'failed'}">
                <span class="score-text-num">${score}</span>
                <span class="score-text-lbl">/ 5</span>
            </div>
            
            <h4>${passed ? 'Félicitations, chapitre validé !' : 'Chapitre non validé.'}</h4>
            <p class="text-secondary" style="max-width: 480px; margin: 0 auto 20px auto;">
                ${passed ? 
                  `Vous avez obtenu la note de <strong>${score}/5</strong>. Vous maîtrisez les notions clés du chapitre <strong>${chapterName}</strong>.` : 
                  `Vous avez obtenu la note de <strong>${score}/5</strong>. Le seuil de validation est fixé à <strong>3/5</strong>. Relisez vos fiches de cours et réessayez !`}
            </p>
            
            ${passed ? `
                <div class="badge-unlock-banner">
                    <i class="fa-solid fa-trophy text-yellow fa-spin-slow" style="font-size: 24px;"></i>
                    <span>Badge débloqué : <strong>Maître du ${chapterName}</strong> !</span>
                </div>
            ` : ''}
            
            <div class="results-actions" style="margin-top: 30px;">
                <button class="btn btn-secondary" onclick="switchView('dashboard')">
                    <i class="fa-solid fa-table-cells-large"></i> Retour au tableau de bord
                </button>
                <button class="btn btn-primary" onclick="startChapterQuiz()">
                    <i class="fa-solid fa-rotate-left"></i> Recommencer l'évaluation
                </button>
            </div>
        </div>
    `;
}

/* ==========================================================================
   2. GLOBAL FINAL EVALUATION ENGINE
   ========================================================================== */

function startGlobalEvaluation() {
    globalQuiz = {
        questions: GLOBAL_QUIZ_QUESTIONS,
        currentIndex: 0,
        userAnswers: Array(GLOBAL_QUIZ_QUESTIONS.length).fill(null),
        isCompleted: false,
        score: 0
    };
    
    // Switch Screen UI
    document.getElementById("global-intro-screen").classList.add("d-none");
    document.getElementById("global-quiz-screen").classList.remove("d-none");
    document.getElementById("global-results-screen").classList.add("d-none");
    
    renderGlobalQuestion();
}

function renderGlobalQuestion() {
    const qIdx = globalQuiz.currentIndex;
    const question = globalQuiz.questions[qIdx];
    const container = document.getElementById("global-question-container");
    
    if (!question || !container) return;
    
    // Update progress header
    document.getElementById("global-q-current").innerText = qIdx + 1;
    document.getElementById("global-progress-fill").style.width = `${((qIdx + 1) / globalQuiz.questions.length) * 100}%`;
    
    let choicesHtml = "";
    question.choices.forEach((choice, idx) => {
        const isSelected = globalQuiz.userAnswers[qIdx] === idx;
        choicesHtml += `
            <div class="qcm-option-card ${isSelected ? 'selected' : ''}" onclick="selectGlobalOption(${idx})">
                <div class="qcm-radio"></div>
                <div class="qcm-text math-latex-render">${choice}</div>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="quiz-question-card fade-in">
            <span class="badge badge-unlocked" style="background-color: var(--accent-gold); margin-bottom: 12px; display: inline-block;">
                ${question.category}
            </span>
            <h4 class="math-latex-render">${question.question}</h4>
            <div class="qcm-options-grid">
                ${choicesHtml}
            </div>
        </div>
    `;
    
    // Style Navigation Buttons
    const prevBtn = document.getElementById("global-btn-prev");
    const nextBtn = document.getElementById("global-btn-next");
    
    if (prevBtn) prevBtn.disabled = qIdx === 0;
    
    if (nextBtn) {
        if (qIdx === globalQuiz.questions.length - 1) {
            nextBtn.innerHTML = `Soumettre mon examen <i class="fa-solid fa-paper-plane"></i>`;
            nextBtn.className = "btn btn-success";
        } else {
            nextBtn.innerHTML = `Question suivante <i class="fa-solid fa-arrow-right"></i>`;
            nextBtn.className = "btn btn-primary";
        }
    }
    
    renderMathInElement(container, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ],
        throwOnError: false
    });
}

function selectGlobalOption(optIdx) {
    const qIdx = globalQuiz.currentIndex;
    globalQuiz.userAnswers[qIdx] = optIdx;
    
    // Highlight selected in UI
    const cards = document.querySelectorAll("#global-question-container .qcm-option-card");
    cards.forEach((card, idx) => {
        if (idx === optIdx) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
}

function globalNextQuestion() {
    const qIdx = globalQuiz.currentIndex;
    
    // Check if answered
    if (globalQuiz.userAnswers[qIdx] === null) {
        alert("Veuillez sélectionner une réponse avant de continuer.");
        return;
    }
    
    if (qIdx === globalQuiz.questions.length - 1) {
        // Last question, submit!
        submitGlobalEvaluation();
    } else {
        globalQuiz.currentIndex++;
        renderGlobalQuestion();
    }
}

function globalPrevQuestion() {
    if (globalQuiz.currentIndex > 0) {
        globalQuiz.currentIndex--;
        renderGlobalQuestion();
    }
}

function submitGlobalEvaluation() {
    // Check if all answered (failsafe)
    const unanswered = globalQuiz.userAnswers.findIndex(ans => ans === null);
    if (unanswered !== -1) {
        const confirmSub = confirm(`Il vous reste des questions sans réponse (ex: Question ${unanswered + 1}). Voulez-vous vraiment soumettre votre copie ?`);
        if (!confirmSub) {
            globalQuiz.currentIndex = unanswered;
            renderGlobalQuestion();
            return;
        }
    }
    
    // Grade the exam
    let correctCount = 0;
    // Keep track by category
    const categoriesStats = {}; // { category: { total: 0, correct: 0 } }
    
    globalQuiz.questions.forEach((q, idx) => {
        if (!categoriesStats[q.category]) {
            categoriesStats[q.category] = { total: 0, correct: 0 };
        }
        
        categoriesStats[q.category].total++;
        
        if (globalQuiz.userAnswers[idx] === q.answer) {
            correctCount++;
            categoriesStats[q.category].correct++;
        }
    });
    
    // Final score out of 20
    const finalScoreRaw = (correctCount / globalQuiz.questions.length) * 20;
    const finalScore = Math.round(finalScoreRaw * 2) / 2; // round to nearest 0.5
    
    globalQuiz.score = finalScore;
    globalQuiz.isCompleted = true;
    
    // Save to Local Storage
    saveGlobalScore(finalScore);
    
    // Switch Screen UI
    document.getElementById("global-quiz-screen").classList.add("d-none");
    document.getElementById("global-results-screen").classList.remove("d-none");
    
    const passed = finalScore >= 10;
    
    // Style outcome UI
    const statusIcon = document.getElementById("global-status-icon");
    const resultsTitle = document.getElementById("global-results-title");
    const resultsSubtitle = document.getElementById("global-results-subtitle");
    const finalScoreDisp = document.getElementById("global-final-score");
    const correctDisp = document.getElementById("global-correct-answers");
    const successDisp = document.getElementById("global-success-status");
    const getDiplomaBtn = document.getElementById("btn-get-diploma");
    
    finalScoreDisp.innerText = finalScore.toFixed(1).replace('.0', '');
    correctDisp.innerText = `${correctCount} / ${globalQuiz.questions.length}`;
    
    if (passed) {
        triggerConfetti(150);
        statusIcon.className = "results-badge shadow-sm";
        statusIcon.style.backgroundColor = "var(--accent-gold-light)";
        statusIcon.style.color = "var(--accent-gold)";
        statusIcon.innerHTML = `<i class="fa-solid fa-award"></i>`;
        
        resultsTitle.innerText = "Félicitations, vous avez réussi ! 🎉";
        resultsSubtitle.innerText = "Vous possédez de solides compétences pour aborder sereinement la classe de Terminale.";
        successDisp.innerText = "Admis en Terminale Spé Math";
        successDisp.className = "stat-val text-success";
        
        if (getDiplomaBtn) getDiplomaBtn.classList.remove("d-none");
    } else {
        statusIcon.className = "results-badge shadow-sm";
        statusIcon.style.backgroundColor = "var(--color-error-light)";
        statusIcon.style.color = "var(--color-error)";
        statusIcon.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i>`;
        
        resultsTitle.innerText = "Évaluation non validée";
        resultsSubtitle.innerText = "Une note d'au moins 10/20 est requise pour débloquer votre diplôme.";
        successDisp.innerText = "Révisions conseillées";
        successDisp.className = "stat-val text-error";
        successDisp.style.color = "var(--color-error)";
        
        if (getDiplomaBtn) getDiplomaBtn.classList.add("d-none");
    }
    
    // Inject Skills Breakdown
    const skillsGrid = document.getElementById("global-skills-grid");
    if (skillsGrid) {
        skillsGrid.innerHTML = "";
        
        Object.keys(categoriesStats).forEach(cat => {
            const stat = categoriesStats[cat];
            const pct = Math.round((stat.correct / stat.total) * 100);
            
            // Choose color by skill level
            let barColor = "var(--color-error)";
            if (pct >= 80) barColor = "var(--color-success)";
            else if (pct >= 50) barColor = "var(--accent-gold)";
            
            skillsGrid.innerHTML += `
                <div class="skill-row">
                    <span class="skill-name">${cat}</span>
                    <div class="skill-bar-bg">
                        <div class="skill-bar-fill" style="width: ${pct}%; background-color: ${barColor};"></div>
                    </div>
                    <span class="skill-percent" style="color: ${barColor};">${pct}%</span>
                </div>
            `;
        });
    }
}

function restartGlobalEvaluation() {
    const confirmRest = confirm("Êtes-vous sûr de vouloir repasser l'évaluation globale ? Votre note précédente sera réinitialisée.");
    if (confirmRest) {
        startGlobalEvaluation();
    }
}

/* ==========================================================================
   3. CERTIFICATION & DIPLOMA GENERATOR
   ========================================================================== */

function showDiploma() {
    const modal = document.getElementById("diploma-modal");
    if (!modal) return;
    
    modal.classList.add("active");
    renderDiplomaCanvas();
}

function closeDiplomaModal() {
    const modal = document.getElementById("diploma-modal");
    if (modal) modal.classList.remove("active");
}

function renderDiplomaCanvas() {
    const canvas = document.getElementById("diploma-canvas");
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    
    // Get profiles and scores
    const firstname = localStorage.getItem("maths_firstname") || "Élève";
    const lastname = localStorage.getItem("maths_lastname") || "Anonyme";
    const scoreVal = parseFloat(localStorage.getItem("maths_global_score") || "0");
    const fullname = `${firstname} ${lastname.toUpperCase()}`;
    
    // Today's date
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = new Date().toLocaleDateString('fr-FR', dateOptions);
    
    // 1. Clear & Background Academic Soft Cream
    ctx.fillStyle = "#faf6eb"; // Soft Parchment Cream
    ctx.fillRect(0, 0, w, h);
    
    // 2. Draw Subtle Math Watermark in Background
    ctx.strokeStyle = "rgba(180, 83, 9, 0.035)"; // Extremely light gold/brown
    ctx.lineWidth = 2;
    // Draw some neat coordinates grid and polar circles
    ctx.beginPath();
    ctx.arc(w/2, h/2, 200, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w/2, h/2, 100, 0, Math.PI*2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w/2, 50); ctx.lineTo(w/2, h - 50);
    ctx.moveTo(100, h/2); ctx.lineTo(w - 100, h/2);
    ctx.stroke();
    
    // Draw golden ratio spirals or parabolas watermarks
    ctx.beginPath();
    for (let x = -200; x <= 200; x++) {
        const cx = w/2 + x;
        const cy = h/2 + 80 - (0.003 * x * x);
        if (x === -200) ctx.moveTo(cx, cy);
        else ctx.lineTo(cx, cy);
    }
    ctx.stroke();
    
    // 3. Double Gold Border
    ctx.strokeStyle = "#b45309"; // Gold
    ctx.lineWidth = 6;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    
    ctx.strokeStyle = "#d97706"; // Light gold
    ctx.lineWidth = 1.5;
    ctx.strokeRect(26, 26, w - 52, h - 52);
    
    // 4. Corner Ornaments
    const drawOrnament = (x, y, rotation) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = "#b45309";
        
        // draw a classy triangle diamond
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(25, 0);
        ctx.lineTo(0, 25);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(10, 10, 4, 0, Math.PI*2);
        ctx.fillStyle = "#faf6eb";
        ctx.fill();
        
        ctx.restore();
    };
    
    drawOrnament(26, 26, 0);
    drawOrnament(w - 26, 26, Math.PI / 2);
    drawOrnament(w - 26, h - 26, Math.PI);
    drawOrnament(26, h - 26, -Math.PI / 2);
    
    // 5. Header Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#1e3a8a"; // Academic Navy
    ctx.font = "bold 28px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("DIPLÔME DE RÉUSSITE", w/2, 90);
    
    ctx.fillStyle = "#b45309"; // Gold
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("SPÉCIALITÉ MATHÉMATIQUES — CLASSES DE LYCÉE", w/2, 120);
    
    // Thin horizontal separator line
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w/2 - 150, 135);
    ctx.lineTo(w/2 + 150, 135);
    ctx.stroke();
    
    // 6. Decerned text
    ctx.fillStyle = "#64748b";
    ctx.font = "italic 16px sans-serif";
    ctx.fillText("Le comité académique certifie que le présent diplôme est décerné à", w/2, 180);
    
    // 7. Full Student Name
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(fullname, w/2, 230);
    
    // Underline name
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(w/2 - 120, 245);
    ctx.lineTo(w/2 + 120, 245);
    ctx.stroke();
    
    // 8. Accomplishment text
    ctx.fillStyle = "#475569";
    ctx.font = "15px sans-serif";
    ctx.fillText("pour avoir complété avec succès le programme de révision estival et validé", w/2, 290);
    ctx.fillText("l'ensemble des épreuves de l'évaluation globale d'entrée en Terminale Spé Math.", w/2, 312);
    
    // 9. Score display
    ctx.fillStyle = "#0f172a";
    ctx.font = "600 16px sans-serif";
    ctx.fillText(`ÉVALUATION FINALE TERMINÉE AVEC LA NOTE DE`, w/2, 365);
    
    // Seal Circle in the bottom middle-ish
    const sealX = w/2;
    const sealY = 430;
    
    // Outer seal spikes (circles)
    ctx.fillStyle = "#e2e8f0";
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 44, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = "#b45309"; // Gold inside
    ctx.beginPath();
    ctx.arc(sealX, sealY, 38, 0, Math.PI*2);
    ctx.fill();
    
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(scoreVal.toFixed(1).replace('.0', ''), sealX, sealY + 2);
    ctx.font = "bold 11px sans-serif";
    ctx.fillText("/ 20", sealX, sealY + 18);
    
    // 10. Date and Signatures
    ctx.fillStyle = "#64748b";
    ctx.font = "12px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(`Fait le ${dateStr}`, 60, 490);
    ctx.fillText("Académie de Mathématiques", 60, 508);
    
    ctx.textAlign = "right";
    ctx.fillText("Le Jury de Spé Maths", w - 60, 490);
    
    ctx.fillStyle = "#1e3a8a";
    ctx.font = "italic 16px cursive, sans-serif";
    ctx.fillText("Antigravity Academica", w - 70, 520);
}

function downloadDiploma() {
    const canvas = document.getElementById("diploma-canvas");
    if (!canvas) return;
    
    const lastname = localStorage.getItem("maths_lastname") || "eleve";
    const dataURL = canvas.toDataURL("image/png");
    
    const link = document.createElement("a");
    link.download = `diplome_spe_maths_${lastname.toLowerCase()}.png`;
    link.href = dataURL;
    link.click();
}

function printDiploma() {
    const canvas = document.getElementById("diploma-canvas");
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    const windowContent = '<!DOCTYPE html><html><head><title>Impression du Diplôme</title></head><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;"><img src="' + dataUrl + '" style="max-width:100%;height:auto;" onload="window.print();window.close();" /></body></html>';
    const printWindow = window.open('', '', 'width=850,height=600');
    
    if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(windowContent);
        printWindow.document.close();
    } else {
        alert("Veuillez autoriser les popups pour imprimer votre diplôme.");
    }
}

/* ==========================================================================
   UTILITY CONFETTI TRIGGER
   ========================================================================== */

function triggerConfetti(particleCount = 50) {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: particleCount,
            spread: 80,
            origin: { y: 0.6 }
        });
    }
}
