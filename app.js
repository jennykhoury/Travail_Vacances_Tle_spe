/**
 * CAHIER DE VACANCES - TERMINALE SPÉ MATHS
 * Contrôleur Principal de l'Application (Navigation, Profil, Stockage local, Exercices, Synchronisation Cloud)
 */

// SUPABASE CONFIGURATION
const SUPABASE_URL = "https://llapoxnwtyshzorsmfaw.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsYXBveG53dHlzaHpvcnNtZmF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjQ3ODYsImV4cCI6MjA5NjI0MDc4Nn0.xzpPYCIgUWaCVK8daovtdWaA0D4RnEaINwINso4MW8s";
const TEACHER_ACCESS_CODE = "jennykhoury";

let supabaseClient = null;
let isSupabaseConfigured = false;

if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        isSupabaseConfigured = true;
        console.log("Supabase initialisé avec succès !");
    } catch (e) {
        console.error("Erreur d'initialisation de Supabase :", e);
    }
} else {
    console.warn("Supabase n'est pas configuré. Utilisation du mode local hors ligne.");
}

// Global App State
let studentProfile = {
    firstname: "",
    lastname: ""
};

let currentUser = null; // Supabase auth user object
let currentUserRole = "student"; // "student" or "teacher"

let currentChapterId = 1;
let currentChapterTab = "cours";
let currentExerciseLevel = 1;
let currentExerciseSubIndex = 0; // 0, 1, or 2 (3 exercises per level)

// Progress structure inside LocalStorage
let userProgress = {
    chapters: {},
    globalScore: null
};

// Initialize default progress for all 8 chapters
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
    // Load Theme Preference
    const savedTheme = localStorage.getItem("maths_theme") || "light";
    if (savedTheme === "dark") {
        document.body.className = "dark-theme";
        document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.body.className = "light-theme";
        document.getElementById("theme-toggle").innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    if (isSupabaseConfigured) {
        // Setup authentication listener
        supabaseClient.auth.onAuthStateChange(async (event, session) => {
            console.log("Supabase Auth Event:", event);
            await handleAuthStateChange(session);
        });
    } else {
        // Fallback: Local offline mode
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
        
        // Load offline progress
        const savedProgress = localStorage.getItem("maths_student_progress");
        if (savedProgress) {
            try {
                userProgress = JSON.parse(savedProgress);
                migrateOldProgressData();
            } catch (e) {
                initDefaultProgress();
            }
        } else {
            initDefaultProgress();
        }
        
        // Setup and render Dashboard
        updateDashboardStats();
        renderChaptersGrid();
        
        // Initial view is dashboard
        switchView('dashboard');
    }
});

function migrateOldProgressData() {
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
            const c = userProgress.chapters[ch.id];
            if (c.ex1_1 === undefined) {
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
}

async function handleAuthStateChange(session) {
    if (session) {
        currentUser = session.user;
        currentUserRole = currentUser.user_metadata.role || "student";
        
        studentProfile.firstname = currentUser.user_metadata.firstname || "Élève";
        studentProfile.lastname = currentUser.user_metadata.lastname || "";
        
        localStorage.setItem("maths_firstname", studentProfile.firstname);
        localStorage.setItem("maths_lastname", studentProfile.lastname);
        
        updateUserUI();
        
        // Cloud sync status UI
        const cloudIcon = document.getElementById("sync-status-icon");
        if (cloudIcon) {
            cloudIcon.classList.remove("d-none");
            cloudIcon.className = "fa-solid fa-cloud-arrow-up text-success";
            cloudIcon.title = "Synchronisé avec le cloud";
        }
        
        toggleTeacherNav(currentUserRole === "teacher");
        
        if (currentUserRole === "teacher") {
            document.getElementById("onboarding-modal").classList.remove("active");
            switchView('teacher');
        } else {
            await loadProgressFromCloud();
            document.getElementById("onboarding-modal").classList.remove("active");
            switchView('dashboard');
        }
    } else {
        currentUser = null;
        currentUserRole = "student";
        studentProfile = { firstname: "", lastname: "" };
        userProgress = { chapters: {}, globalScore: null };
        initDefaultProgress();
        
        const cloudIcon = document.getElementById("sync-status-icon");
        if (cloudIcon) cloudIcon.classList.add("d-none");
        
        toggleTeacherNav(false);
        
        // Clear forms
        document.getElementById("login-form").reset();
        document.getElementById("signup-form").reset();
        document.getElementById("signup-is-teacher").checked = false;
        document.getElementById("teacher-code-group").classList.add("d-none");
        
        document.getElementById("onboarding-modal").classList.add("active");
    }
}

async function loadProgressFromCloud() {
    if (!isSupabaseConfigured || !currentUser) return;
    
    try {
        const cloudIcon = document.getElementById("sync-status-icon");
        if (cloudIcon) {
            cloudIcon.className = "fa-solid fa-arrows-rotate fa-spin text-warning";
            cloudIcon.title = "Synchronisation...";
        }
        
        const { data, error } = await supabaseClient
            .from('student_progress')
            .select('*')
            .eq('id', currentUser.id)
            .single();
            
        if (error) {
            if (error.code === 'PGRST116') { // Record not found
                console.log("Aucune progression trouvée. Création initiale...");
                initDefaultProgress();
                await saveProgressToCloud();
            } else {
                throw error;
            }
        } else if (data) {
            userProgress = data.progress;
            if (data.global_score !== null && data.global_score !== undefined) {
                userProgress.globalScore = data.global_score;
                localStorage.setItem("maths_global_score", data.global_score.toString());
            }
            localStorage.setItem("maths_student_progress", JSON.stringify(userProgress));
        }
        
        if (cloudIcon) {
            cloudIcon.className = "fa-solid fa-cloud-arrow-up text-success";
            cloudIcon.title = "Synchronisé avec le cloud";
        }
        
        updateDashboardStats();
        renderChaptersGrid();
    } catch (e) {
        console.error("Erreur de chargement cloud :", e);
        const cloudIcon = document.getElementById("sync-status-icon");
        if (cloudIcon) {
            cloudIcon.className = "fa-solid fa-cloud-exclamation text-error";
            cloudIcon.title = "Erreur de synchronisation";
        }
    }
}

async function saveProgressToCloud() {
    if (!isSupabaseConfigured || !currentUser || currentUserRole === "teacher") return;
    
    try {
        const cloudIcon = document.getElementById("sync-status-icon");
        if (cloudIcon) {
            cloudIcon.className = "fa-solid fa-arrows-rotate fa-spin text-warning";
            cloudIcon.title = "Synchronisation...";
        }
        
        const { error } = await supabaseClient
            .from('student_progress')
            .upsert({
                id: currentUser.id,
                firstname: studentProfile.firstname,
                lastname: studentProfile.lastname,
                progress: userProgress,
                global_score: userProgress.globalScore,
                updated_at: new Date().toISOString()
            });
            
        if (error) throw error;
        
        if (cloudIcon) {
            cloudIcon.className = "fa-solid fa-cloud-arrow-up text-success";
            cloudIcon.title = "Synchronisé avec le cloud";
        }
    } catch (e) {
        console.error("Erreur de sauvegarde cloud :", e);
        const cloudIcon = document.getElementById("sync-status-icon");
        if (cloudIcon) {
            cloudIcon.className = "fa-solid fa-cloud-exclamation text-error";
            cloudIcon.title = "Erreur de synchronisation";
        }
    }
}

// Auth modal tabs
function switchAuthTab(tabName) {
    const title = document.getElementById("auth-modal-title");
    const feedback = document.getElementById("auth-feedback");
    
    if (feedback) {
        feedback.className = "auth-feedback-msg d-none";
        feedback.innerText = "";
    }
    
    document.querySelectorAll(".auth-tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".auth-form-pane").forEach(pane => pane.classList.remove("active"));
    
    if (tabName === 'login') {
        document.getElementById("btn-tab-login").classList.add("active");
        document.getElementById("login-form").classList.add("active");
        title.innerText = "Se connecter";
    } else {
        document.getElementById("btn-tab-signup").classList.add("active");
        document.getElementById("signup-form").classList.add("active");
        title.innerText = "Créer un compte";
    }
}

function toggleTeacherCodeField(checkbox) {
    const group = document.getElementById("teacher-code-group");
    const codeInput = document.getElementById("signup-teacher-code");
    if (checkbox.checked) {
        group.classList.remove("d-none");
        codeInput.required = true;
    } else {
        group.classList.add("d-none");
        codeInput.required = false;
        codeInput.value = "";
    }
}

function toggleTeacherNav(show) {
    const title = document.getElementById("teacher-nav-title");
    const item = document.getElementById("teacher-nav-item");
    if (title && item) {
        if (show) {
            title.classList.remove("d-none");
            item.classList.remove("d-none");
        } else {
            title.classList.add("d-none");
            item.classList.add("d-none");
        }
    }
}

// Authentication Actions
async function handleSignup(event) {
    event.preventDefault();
    const feedback = document.getElementById("auth-feedback");
    const submitBtn = document.getElementById("btn-signup-submit");
    
    if (feedback) feedback.className = "auth-feedback-msg d-none";
    
    const firstname = document.getElementById("signup-firstname").value.trim();
    const lastname = document.getElementById("signup-lastname").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value;
    const isTeacher = document.getElementById("signup-is-teacher").checked;
    
    let role = "student";
    
    if (isTeacher) {
        const code = document.getElementById("signup-teacher-code").value.trim();
        if (code !== TEACHER_ACCESS_CODE) {
            showAuthFeedback("Code enseignant incorrect !", "error");
            return;
        }
        role = "teacher";
    }
    
    if (!isSupabaseConfigured) {
        // Offline registration fallback
        studentProfile.firstname = firstname;
        studentProfile.lastname = lastname;
        localStorage.setItem("maths_firstname", firstname);
        localStorage.setItem("maths_lastname", lastname);
        document.getElementById("onboarding-modal").classList.remove("active");
        updateUserUI();
        triggerConfetti(30);
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Création du compte...";
        
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    firstname,
                    lastname,
                    role
                }
            }
        });
        
        if (error) throw error;
        
        showAuthFeedback("Compte créé avec succès ! Authentification en cours...", "success");
        if (data.session) {
            await handleAuthStateChange(data.session);
        } else {
            showAuthFeedback("Compte créé ! Veuillez vérifier votre boîte mail si nécessaire.", "success");
        }
    } catch (e) {
        showAuthFeedback(e.message || "Erreur lors de l'inscription.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Créer mon compte";
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const feedback = document.getElementById("auth-feedback");
    const submitBtn = document.getElementById("btn-login-submit");
    
    if (feedback) feedback.className = "auth-feedback-msg d-none";
    
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value;
    
    if (!isSupabaseConfigured) {
        showAuthFeedback("Mode hors ligne actif. Supabase non configuré.", "error");
        return;
    }
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Connexion...";
        
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) throw error;
        
        showAuthFeedback("Connexion réussie !", "success");
        await handleAuthStateChange(data.session);
    } catch (e) {
        showAuthFeedback(e.message || "Email ou mot de passe incorrect.", "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "Se connecter";
    }
}

async function handleSignOut() {
    const confirmLogout = confirm("Souhaitez-vous vous déconnecter ?");
    if (!confirmLogout) return;
    
    if (isSupabaseConfigured) {
        await supabaseClient.auth.signOut();
    }
    
    localStorage.removeItem("maths_firstname");
    localStorage.removeItem("maths_lastname");
    localStorage.removeItem("maths_student_progress");
    localStorage.removeItem("maths_global_score");
    
    window.location.reload();
}

async function resetProfile() {
    const confirmReset = confirm("Attention ! Vous allez réinitialiser votre progression locale. Si vous êtes connecté, cela réinitialisera aussi vos données cloud. Continuer ?");
    if (confirmReset) {
        if (isSupabaseConfigured && currentUser) {
            try {
                await supabaseClient.from('student_progress').delete().eq('id', currentUser.id);
                await supabaseClient.auth.signOut();
            } catch (e) {
                console.error("Erreur réinitialisation cloud :", e);
            }
        }
        localStorage.clear();
        window.location.reload();
    }
}

function showAuthFeedback(msg, type) {
    const feedback = document.getElementById("auth-feedback");
    if (feedback) {
        feedback.className = `auth-feedback-msg ${type}`;
        feedback.innerText = msg;
        feedback.classList.remove("d-none");
    }
}

function updateUserUI() {
    const fullname = `${studentProfile.firstname} ${studentProfile.lastname.toUpperCase()}`;
    document.getElementById("user-display-name").innerText = studentProfile.firstname;
    document.getElementById("user-display-name").title = fullname;
    
    const welcomeName = document.getElementById("welcome-name");
    if (welcomeName) welcomeName.innerText = studentProfile.firstname;
    
    const roleDisp = document.getElementById("user-display-role");
    if (roleDisp) {
        roleDisp.innerText = currentUserRole === "teacher" ? "Professeur" : "Spé Mathématiques";
    }
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
    } else if (viewName === 'teacher') {
        document.getElementById("view-teacher").classList.add("active");
        document.getElementById("nav-teacher").classList.add("active");
        pageTitle.innerText = "Espace Enseignant";
        pageSubtitle.innerText = "Suivi de l'évolution et des résultats des élèves";
        
        refreshTeacherData();
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
    if (isSupabaseConfigured && currentUser) {
        saveProgressToCloud();
    }
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

/* ==========================================================================
   7. TEACHER DASHBOARD LOGIC (SUPABASE CLOUD QUERY & RENDER)
   ========================================================================== */

let studentsData = []; // Cache list of students
let currentSortKey = "lastname";
let currentSortOrder = "asc";

async function refreshTeacherData() {
    if (!isSupabaseConfigured || currentUserRole !== "teacher") return;
    
    const tbody = document.getElementById("teacher-students-tbody");
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-secondary);">
                    <i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i> Récupération des données en cours...
                </td>
            </tr>
        `;
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('student_progress')
            .select('*')
            .order('lastname', { ascending: true });
            
        if (error) throw error;
        
        studentsData = data.map(item => {
            // Helper stats
            const progress = getOverallProgressPercentage(item.progress);
            const avgQuiz = getAverageQuizScore(item.progress);
            
            return {
                id: item.id,
                firstname: item.firstname,
                lastname: item.lastname,
                progress: progress,
                avg_quiz: avgQuiz,
                global_score: item.global_score,
                updated_at: item.updated_at,
                rawProgress: item.progress // save for detailed modal view
            };
        });
        
        updateTeacherStats();
        renderStudentsTable();
        
    } catch (e) {
        console.error("Erreur de récupération des données enseignants :", e);
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 30px; color: var(--color-error);">
                        <i class="fa-solid fa-circle-exclamation" style="margin-right: 8px;"></i> Une erreur est survenue lors du chargement des données.
                    </td>
                </tr>
            `;
        }
    }
}

// Helpers for progress parsing
function getOverallProgressPercentage(prog) {
    if (!prog || !prog.chapters) return 0;
    
    let totalProgress = 0;
    const chaptersCount = Object.keys(prog.chapters).length;
    if (chaptersCount === 0) return 0;
    
    Object.keys(prog.chapters).forEach(chId => {
        const p = prog.chapters[chId];
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
        
        totalProgress += total;
    });
    
    return Math.round(totalProgress / chaptersCount);
}

function getAverageQuizScore(prog) {
    if (!prog || !prog.chapters) return null;
    
    let quizSum = 0;
    let quizCount = 0;
    
    Object.keys(prog.chapters).forEach(chId => {
        const c = prog.chapters[chId];
        if (c.quizScore !== null && c.quizScore !== undefined) {
            quizSum += c.quizScore;
            quizCount++;
        }
    });
    
    if (quizCount > 0) {
        const avgRaw = (quizSum / quizCount) * 4; // Out of 20
        return Math.round(avgRaw * 10) / 10;
    }
    
    return null;
}

// Update summary stats cards
function updateTeacherStats() {
    document.getElementById("teacher-stat-students-count").innerText = studentsData.length;
    
    if (studentsData.length === 0) {
        document.getElementById("teacher-stat-avg-progress").innerText = "0%";
        document.getElementById("teacher-stat-avg-score").innerText = "-- / 20";
        return;
    }
    
    let sumProgress = 0;
    let sumScore = 0;
    let scoreCount = 0;
    
    studentsData.forEach(s => {
        sumProgress += s.progress;
        if (s.global_score !== null && s.global_score !== undefined) {
            sumScore += s.global_score;
            scoreCount++;
        }
    });
    
    const avgProgress = Math.round(sumProgress / studentsData.length);
    document.getElementById("teacher-stat-avg-progress").innerText = `${avgProgress}%`;
    
    const avgScoreContainer = document.getElementById("teacher-stat-avg-score");
    if (scoreCount > 0) {
        const avg = Math.round((sumScore / scoreCount) * 10) / 10;
        avgScoreContainer.innerText = `${avg} / 20`;
    } else {
        avgScoreContainer.innerText = "-- / 20";
    }
}

// Render the list of students in the table
function renderStudentsTable(filteredData = null) {
    const tbody = document.getElementById("teacher-students-tbody");
    if (!tbody) return;
    
    const list = filteredData || studentsData;
    
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 30px; color: var(--text-secondary);">
                    Aucun élève trouvé.
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = "";
    
    list.forEach(student => {
        const date = new Date(student.updated_at).toLocaleDateString('fr-FR', {
            day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
        });
        
        let progressBadge = `<span class="teacher-badge teacher-badge-notstarted">0%</span>`;
        if (student.progress === 100) {
            progressBadge = `<span class="teacher-badge teacher-badge-completed"><i class="fa-solid fa-circle-check"></i> 100%</span>`;
        } else if (student.progress > 0) {
            progressBadge = `<span class="teacher-badge teacher-badge-progress">${student.progress}%</span>`;
        }
        
        const quizText = student.avg_quiz !== null ? `${student.avg_quiz} / 20` : `-- / 20`;
        const scoreText = student.global_score !== null ? `<strong>${student.global_score} / 20</strong>` : `<span style="color:var(--text-secondary);">Non passé</span>`;
        
        tbody.innerHTML += `
            <tr style="border-bottom: 1px solid var(--border-color);">
                <td style="padding: 12px; font-weight: 600;">${student.lastname.toUpperCase()} ${student.firstname}</td>
                <td style="padding: 12px;">${progressBadge}</td>
                <td style="padding: 12px;">${quizText}</td>
                <td style="padding: 12px;">${scoreText}</td>
                <td style="padding: 12px; font-size: 13px; color: var(--text-secondary);">${date}</td>
                <td style="padding: 12px;">
                    <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="viewStudentDetails('${student.id}')">
                        Détails
                    </button>
                </td>
            </tr>
        `;
    });
}

// Filter the table based on search input
function filterStudentsTable() {
    const searchVal = document.getElementById("teacher-search").value.trim().toLowerCase();
    if (searchVal === "") {
        renderStudentsTable();
        return;
    }
    
    const filtered = studentsData.filter(s => {
        const full = `${s.firstname} ${s.lastname}`.toLowerCase();
        return full.includes(searchVal) || s.lastname.toLowerCase().includes(searchVal) || s.firstname.toLowerCase().includes(searchVal);
    });
    
    renderStudentsTable(filtered);
}

// Sort the table
function sortStudentsTable(key) {
    if (currentSortKey === key) {
        currentSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    } else {
        currentSortKey = key;
        currentSortOrder = "asc";
    }
    
    studentsData.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        
        // Handle nulls
        if (valA === null || valA === undefined) return currentSortOrder === "asc" ? 1 : -1;
        if (valB === null || valB === undefined) return currentSortOrder === "asc" ? -1 : 1;
        
        if (typeof valA === 'string') {
            return currentSortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            return currentSortOrder === "asc" ? valA - valB : valB - valA;
        }
    });
    
    renderStudentsTable();
}

// Show detailed modal of a student
function viewStudentDetails(studentId) {
    const student = studentsData.find(s => s.id === studentId);
    if (!student) return;
    
    document.getElementById("detail-student-name").innerText = `${student.lastname.toUpperCase()} ${student.firstname}`;
    document.getElementById("detail-student-email").innerText = `Identifiant ID : ${student.id}`;
    
    const container = document.getElementById("detail-student-content");
    container.innerHTML = "";
    
    let chRows = "";
    
    CHAPTERS_DATA.forEach(ch => {
        const progState = student.rawProgress.chapters[ch.id];
        let progPct = 0;
        
        if (progState) {
            let total = 0;
            if (progState.read) total += 10;
            if (progState.ex1_1) total += 10;
            if (progState.ex1_2) total += 10;
            if (progState.ex1_3) total += 10;
            if (progState.ex2_1) total += 10;
            if (progState.ex2_2) total += 10;
            if (progState.ex2_3) total += 10;
            if (progState.ex3_1) total += 10;
            if (progState.ex3_2) total += 10;
            if (progState.ex3_3) total += 10;
            progPct = total;
        }
        
        const qScore = (progState && progState.quizScore !== null) ? `${progState.quizScore} / 5` : `<span style="color:var(--text-secondary);">Non fait</span>`;
        
        const exCheck = (exVal) => exVal ? `<i class="fa-solid fa-circle-check text-success" style="font-size:12px;"></i>` : `<i class="fa-regular fa-circle text-muted" style="font-size:12px;"></i>`;
        
        chRows += `
            <div style="border: 1px solid var(--border-color); border-radius: var(--border-radius-sm); padding: 14px; margin-bottom: 12px; background-color: var(--bg-app);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                    <strong style="font-size: 13.5px;">Module 0${ch.id} — ${ch.title}</strong>
                    <span class="teacher-badge ${progPct === 100 ? 'teacher-badge-completed' : (progPct > 0 ? 'teacher-badge-progress' : 'teacher-badge-notstarted')}">${progPct}%</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 12.5px;">
                    <div>
                        <div>Cours lu : ${progState && progState.read ? '✔ Oui' : '❌ Non'}</div>
                        <div style="margin-top: 4px;">Quiz de chapitre : <strong>${qScore}</strong></div>
                    </div>
                    <div>
                        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                            <span>Niv 1 :</span>
                            <span>${exCheck(progState && progState.ex1_1)} ${exCheck(progState && progState.ex1_2)} ${exCheck(progState && progState.ex1_3)}</span>
                        </div>
                        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-top: 4px;">
                            <span>Niv 2 :</span>
                            <span>${exCheck(progState && progState.ex2_1)} ${exCheck(progState && progState.ex2_2)} ${exCheck(progState && progState.ex2_3)}</span>
                        </div>
                        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center; margin-top: 4px;">
                            <span>Niv 3 :</span>
                            <span>${exCheck(progState && progState.ex3_1)} ${exCheck(progState && progState.ex3_2)} ${exCheck(progState && progState.ex3_3)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = `
        <div class="stats-grid" style="margin-bottom: 20px; grid-template-columns: 1fr 1fr;">
            <div class="stat-card" style="padding: 14px;">
                <div class="stat-details">
                    <span class="stat-value" style="font-size: 20px;">${student.progress}%</span>
                    <span class="stat-label" style="font-size: 11px;">Progression totale</span>
                </div>
            </div>
            <div class="stat-card" style="padding: 14px;">
                <div class="stat-details">
                    <span class="stat-value" style="font-size: 20px;">${student.global_score !== null ? student.global_score + ' / 20' : 'Non validée'}</span>
                    <span class="stat-label" style="font-size: 11px;">Évaluation finale</span>
                </div>
            </div>
        </div>
        
        <h4 style="margin-top: 16px; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Détail par module</h4>
        ${chRows}
    `;
    
    document.getElementById("student-detail-modal").classList.add("active");
}

function closeStudentDetailModal() {
    document.getElementById("student-detail-modal").classList.remove("active");
}
