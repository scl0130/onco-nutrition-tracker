(function () {
  const PROFILE_KEY_BASE = "oncoProfile";
  const PROFILE_EXISTS_KEY_BASE = "profileExists";
  const WEIGHT_HISTORY_KEY_BASE = "oncoNutritionWeightHistory:v1";
  const DAY_LOG_KEY_BASE = "oncoNutritionLog";
  const CAREGIVER_RELATIONSHIPS_KEY_BASE = "caregiver_relationships";
  const ACTIVE_PATIENT_ID_KEY_BASE = "active_patient_id";
  const SYMPTOM_LOG_KEY_BASE = "symptom_log";
  const TREATMENT_CYCLE_LOG_KEY_BASE = "treatment_cycle_log";
  const FLUID_INTAKE_LOG_KEY_BASE = "fluid_intake_log";
  const NUTRITION_LOG_KEY_BASE = "nutrition_log";
  const RECOMMENDATION_LOG_KEY_BASE = "recommendation_log";
  const USDA_API_KEY_STORAGE_KEY = "oncoNutritionUsdaApiKey:v1";
  const USDA_DEFAULT_API_KEY = "DEMO_KEY";
  const SUPABASE_URL_STORAGE_KEY = "oncoNutritionSupabaseUrl:v1";
  const SUPABASE_ANON_KEY_STORAGE_KEY = "oncoNutritionSupabaseAnonKey:v1";

  const CURATED_FOODS = [
    { name: "Egg (fully cooked)", macros100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 } },
    { name: "Chicken breast (cooked)", macros100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
    { name: "Ribeye steak (cooked)", macros100g: { calories: 291, protein: 24.8, carbs: 0, fat: 21.8 } },
    { name: "White rice (cooked)", macros100g: { calories: 130, protein: 2.4, carbs: 28.2, fat: 0.3 } },
    { name: "Protein shake", macros100g: { calories: 72, protein: 12, carbs: 3, fat: 1.2 } },
    { name: "Banana", macros100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 } },
    { name: "Greek yogurt (plain)", macros100g: { calories: 59, protein: 10.3, carbs: 3.6, fat: 0.4 } },
    { name: "Tofu (firm)", macros100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 } }
  ];

  const page = document.body.dataset.page;

  let currentUser = null;
  let supabaseClient = null;
  let authInitialized = false;

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  function viewerUserId() {
    return currentUser && currentUser.id ? currentUser.id : "guest";
  }

  function viewerScopedKey(base) {
    return `${base}:${viewerUserId()}`;
  }

  function getCaregiverRelationships() {
    const raw = localStorage.getItem(viewerScopedKey(CAREGIVER_RELATIONSHIPS_KEY_BASE));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  }

  function saveCaregiverRelationships(rows) {
    localStorage.setItem(viewerScopedKey(CAREGIVER_RELATIONSHIPS_KEY_BASE), JSON.stringify(rows));
  }

  function getActivePatientId() {
    const raw = localStorage.getItem(viewerScopedKey(ACTIVE_PATIENT_ID_KEY_BASE));
    return raw && raw.trim() ? raw.trim() : "";
  }

  function setActivePatientId(patientId) {
    if (!patientId) {
      localStorage.removeItem(viewerScopedKey(ACTIVE_PATIENT_ID_KEY_BASE));
      return;
    }
    localStorage.setItem(viewerScopedKey(ACTIVE_PATIENT_ID_KEY_BASE), patientId);
  }

  function canManagePatient(patientId) {
    if (!patientId) return false;
    const relationships = getCaregiverRelationships();
    return relationships.some((row) => row && row.patient_user_id === patientId);
  }

  function dataOwnerId() {
    const viewer = viewerUserId();
    const activePatientId = getActivePatientId();
    if (activePatientId && canManagePatient(activePatientId)) return activePatientId;
    return viewer;
  }

  function scopedKey(base) {
    return `${base}:${dataOwnerId()}`;
  }

  function profileExists() {
    return localStorage.getItem(scopedKey(PROFILE_EXISTS_KEY_BASE)) === "true";
  }

  function getProfile() {
    const raw = localStorage.getItem(scopedKey(PROFILE_KEY_BASE));
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      const symptomSeverity = normalizeSymptomSeverity(parsed.symptomSeverity, parsed.symptoms);
      return {
        ...parsed,
        symptomSeverity,
        symptoms: severityToSymptoms(symptomSeverity)
      };
    } catch (_err) {
      return null;
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(scopedKey(PROFILE_KEY_BASE), JSON.stringify(profile));
    localStorage.setItem(scopedKey(PROFILE_EXISTS_KEY_BASE), "true");
  }

  function readArray(baseKey) {
    const raw = localStorage.getItem(scopedKey(baseKey));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  }

  function writeArray(baseKey, value) {
    localStorage.setItem(scopedKey(baseKey), JSON.stringify(value));
  }

  function upsertLogByDate(baseKey, date, payload) {
    const rows = readArray(baseKey);
    const idx = rows.findIndex((row) => row && row.date === date);
    const row = { ...payload, date, created_at: new Date().toISOString() };
    if (idx >= 0) rows[idx] = row;
    else rows.push(row);
    writeArray(baseKey, rows);
  }

  function symptomSeverityDefaults() {
    return {
      nausea_severity: 0,
      vomiting_severity: 0,
      diarrhea_severity: 0,
      constipation_severity: 0,
      mucositis_severity: 0,
      taste_change_severity: 0,
      dry_mouth_severity: 0,
      appetite_loss_severity: 0,
      early_satiety_severity: 0,
      fatigue_severity: 0,
      difficulty_swallowing_severity: 0,
      bloating_severity: 0,
      greasy_stools_severity: 0,
      floating_stools_severity: 0,
      pain_severity: 0
    };
  }

  function severityToSymptoms(severityObj) {
    const severity = { ...symptomSeverityDefaults(), ...(severityObj || {}) };
    const map = {
      nausea_severity: "nausea",
      vomiting_severity: "vomiting",
      diarrhea_severity: "diarrhea",
      constipation_severity: "constipation",
      mucositis_severity: "mouth_sores",
      taste_change_severity: "taste_changes",
      dry_mouth_severity: "dry_mouth",
      appetite_loss_severity: "appetite_loss",
      early_satiety_severity: "early_satiety",
      fatigue_severity: "fatigue",
      difficulty_swallowing_severity: "difficulty_swallowing",
      bloating_severity: "bloating",
      greasy_stools_severity: "greasy_stools",
      floating_stools_severity: "floating_stools",
      pain_severity: "pain"
    };
    return Object.keys(map).filter((key) => Number(severity[key] || 0) >= 1).map((key) => map[key]);
  }

  function symptomSeverityFromLegacySymptoms(symptoms) {
    const severity = symptomSeverityDefaults();
    const set = new Set(Array.isArray(symptoms) ? symptoms : []);
    if (set.has("nausea")) severity.nausea_severity = 1;
    if (set.has("vomiting")) severity.vomiting_severity = 1;
    if (set.has("diarrhea")) severity.diarrhea_severity = 1;
    if (set.has("constipation")) severity.constipation_severity = 1;
    if (set.has("mouth_sores")) severity.mucositis_severity = 1;
    if (set.has("taste_changes")) severity.taste_change_severity = 1;
    if (set.has("dry_mouth")) severity.dry_mouth_severity = 1;
    if (set.has("appetite_loss")) severity.appetite_loss_severity = 1;
    if (set.has("early_satiety")) severity.early_satiety_severity = 1;
    if (set.has("fatigue")) severity.fatigue_severity = 1;
    if (set.has("difficulty_swallowing")) severity.difficulty_swallowing_severity = 1;
    if (set.has("bloating")) severity.bloating_severity = 1;
    if (set.has("greasy_stools")) severity.greasy_stools_severity = 1;
    if (set.has("floating_stools")) severity.floating_stools_severity = 1;
    if (set.has("pain")) severity.pain_severity = 1;
    return severity;
  }

  function normalizeSymptomSeverity(severityObj, legacySymptoms) {
    const fromLegacy = symptomSeverityFromLegacySymptoms(legacySymptoms);
    return { ...symptomSeverityDefaults(), ...fromLegacy, ...(severityObj || {}) };
  }

  function storageKeyForDate(date) {
    return `${scopedKey(DAY_LOG_KEY_BASE)}:${date}`;
  }

  function getUsdaApiKey() {
    const saved = localStorage.getItem(viewerScopedKey(USDA_API_KEY_STORAGE_KEY));
    return saved && saved.trim() ? saved.trim() : USDA_DEFAULT_API_KEY;
  }

  function setUsdaKeyStatus(message, isError) {
    const node = document.getElementById("usdaApiKeyStatus");
    if (!node) return;
    node.textContent = message;
    node.style.color = isError ? "var(--danger)" : "var(--muted)";
  }

  function syncUsdaApiKeyInput() {
    const input = document.getElementById("usdaApiKey");
    if (!input) return;
    const saved = localStorage.getItem(viewerScopedKey(USDA_API_KEY_STORAGE_KEY)) || "";
    input.value = saved;
    if (saved) {
      setUsdaKeyStatus("USDA API key saved.");
    } else {
      setUsdaKeyStatus("No USDA key saved. Using DEMO_KEY (lower limits).");
    }
  }

  function resolvedSupabaseConfig() {
    const runtimeUrl = localStorage.getItem(SUPABASE_URL_STORAGE_KEY) || "";
    const runtimeKey = localStorage.getItem(SUPABASE_ANON_KEY_STORAGE_KEY) || "";
    if (runtimeUrl && runtimeKey) {
      return { supabaseUrl: runtimeUrl, supabaseAnonKey: runtimeKey };
    }
    const cfg = window.APP_CONFIG || {};
    return {
      supabaseUrl: cfg.supabaseUrl || "",
      supabaseAnonKey: cfg.supabaseAnonKey || ""
    };
  }

  function isSupabaseConfigured() {
    const cfg = resolvedSupabaseConfig();
    return Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey);
  }

  function setCurrentUserFromAuthUser(user) {
    if (!user) {
      currentUser = null;
      return;
    }
    currentUser = {
      id: user.id,
      email: normalizeEmail(user.email || "")
    };
  }

  function clearCurrentUser() {
    currentUser = null;
  }

  function setAuthStatus(message, isError) {
    const authStatus = document.getElementById("authStatus");
    if (!authStatus) return;
    authStatus.textContent = message;
    authStatus.style.color = isError ? "var(--danger)" : "var(--muted)";
  }

  function setSupabaseConfigStatus(message, isError) {
    const status = document.getElementById("supabaseConfigStatus");
    if (!status) return;
    status.textContent = message;
    status.style.color = isError ? "var(--danger)" : "var(--muted)";
  }

  function syncSupabaseConfigInputs() {
    const urlInput = document.getElementById("supabaseUrlInput");
    const keyInput = document.getElementById("supabaseAnonKeyInput");
    if (!urlInput || !keyInput) return;
    const cfg = resolvedSupabaseConfig();
    urlInput.value = cfg.supabaseUrl || "";
    keyInput.value = cfg.supabaseAnonKey || "";
  }

  async function initSupabaseAuth() {
    if (!window.supabase || !window.supabase.createClient || !isSupabaseConfigured()) {
      supabaseClient = null;
      return false;
    }

    const cfg = resolvedSupabaseConfig();
    supabaseClient = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);

    const { data } = await supabaseClient.auth.getSession();
    const previousUserId = currentUser && currentUser.id ? currentUser.id : "guest";
    setCurrentUserFromAuthUser(data.session ? data.session.user : null);

    if (!authInitialized) {
      supabaseClient.auth.onAuthStateChange((_event, session) => {
        const before = currentUser && currentUser.id ? currentUser.id : "guest";
        setCurrentUserFromAuthUser(session ? session.user : null);
        const after = currentUser && currentUser.id ? currentUser.id : "guest";
        if (authInitialized && before !== after) {
          window.location.reload();
        }
      });
    }

    if (authInitialized && previousUserId !== (currentUser && currentUser.id ? currentUser.id : "guest")) {
      window.location.reload();
    }

    return true;
  }

  function renderAuthVisibility() {
    const loggedIn = Boolean(currentUser && currentUser.email);
    const secureAuthReady = Boolean(supabaseClient);
    const activePatientId = getActivePatientId();
    const inCaregiverMode = Boolean(loggedIn && activePatientId && canManagePatient(activePatientId));

    const authUserBadge = document.getElementById("authUserBadge");
    const logoutButton = document.getElementById("logoutButton");
    const authModeStatus = document.getElementById("authModeStatus");
    const authFormsWrap = document.getElementById("authFormsWrap");

    if (authUserBadge) {
      if (!loggedIn) authUserBadge.textContent = "Guest mode";
      else if (inCaregiverMode) authUserBadge.textContent = `${currentUser.email} (caregiver -> ${activePatientId})`;
      else authUserBadge.textContent = currentUser.email;
    }
    if (logoutButton) {
      logoutButton.classList.toggle("hidden", !loggedIn);
    }
    if (authFormsWrap) {
      authFormsWrap.classList.toggle("hidden", loggedIn || !secureAuthReady);
    }
    if (authModeStatus) {
      if (loggedIn) {
        authModeStatus.textContent = inCaregiverMode ? "Authenticated caregiver mode active." : "Authenticated session active.";
      } else if (!secureAuthReady) {
        authModeStatus.textContent = "Guest mode active. Configure Supabase to enable secure sign up and log in.";
      } else {
        authModeStatus.textContent = "Guest mode active. You can sign up or log in anytime.";
      }
    }
  }

  async function handleSignupSubmit(e) {
    e.preventDefault();
    if (!supabaseClient) {
      setAuthStatus("Secure auth not configured yet. Use guest mode or add Supabase config.", true);
      return;
    }
    const signupEmail = document.getElementById("signupEmail");
    const signupPassword = document.getElementById("signupPassword");
    const email = normalizeEmail(signupEmail ? signupEmail.value : "");
    const password = String(signupPassword ? signupPassword.value : "");
    if (!email || password.length < 6) {
      setAuthStatus("Use a valid email and password (6+ chars).", true);
      return;
    }
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      setAuthStatus(error.message, true);
      return;
    }
    setCurrentUserFromAuthUser(data.user);
    renderAuthVisibility();
    setAuthStatus("Sign-up submitted. Check email for confirmation if required.", false);
    window.location.reload();
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    if (!supabaseClient) {
      setAuthStatus("Secure auth not configured yet. Use guest mode or add Supabase config.", true);
      return;
    }
    const loginEmail = document.getElementById("loginEmail");
    const loginPassword = document.getElementById("loginPassword");
    const email = normalizeEmail(loginEmail ? loginEmail.value : "");
    const password = String(loginPassword ? loginPassword.value : "");
    if (!email || !password) {
      setAuthStatus("Enter your email and password.", true);
      return;
    }
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthStatus(error.message, true);
      return;
    }
    setCurrentUserFromAuthUser(data.user);
    renderAuthVisibility();
    setAuthStatus("Login successful.", false);
    window.location.reload();
  }

  async function handleLogout() {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setActivePatientId("");
    clearCurrentUser();
    renderAuthVisibility();
    setAuthStatus("Logged out.", false);
    window.location.reload();
  }

  async function saveSupabaseConfig() {
    const urlInput = document.getElementById("supabaseUrlInput");
    const keyInput = document.getElementById("supabaseAnonKeyInput");
    if (!urlInput || !keyInput) return;

    const url = urlInput.value.trim();
    const anonKey = keyInput.value.trim();
    if (!url || !anonKey) {
      setSupabaseConfigStatus("Enter both Supabase URL and anon key.", true);
      return;
    }

    localStorage.setItem(SUPABASE_URL_STORAGE_KEY, url);
    localStorage.setItem(SUPABASE_ANON_KEY_STORAGE_KEY, anonKey);
    await initSupabaseAuth();
    renderAuthVisibility();
    setSupabaseConfigStatus("Secure auth config saved.", false);
    setAuthStatus("Secure auth ready. You can sign up or log in.", false);
  }

  function clearSupabaseConfig() {
    localStorage.removeItem(SUPABASE_URL_STORAGE_KEY);
    localStorage.removeItem(SUPABASE_ANON_KEY_STORAGE_KEY);
    supabaseClient = null;
    clearCurrentUser();
    syncSupabaseConfigInputs();
    renderAuthVisibility();
    setSupabaseConfigStatus("Secure auth config cleared.", false);
    setAuthStatus("Using guest mode.", false);
  }

  function initAuthHandlers() {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const logoutButton = document.getElementById("logoutButton");
    const continueGuestButton = document.getElementById("continueGuestButton");
    const saveSupabaseConfigButton = document.getElementById("saveSupabaseConfig");
    const clearSupabaseConfigButton = document.getElementById("clearSupabaseConfig");

    if (signupForm) signupForm.addEventListener("submit", handleSignupSubmit);
    if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);
    if (logoutButton) logoutButton.addEventListener("click", handleLogout);
    if (continueGuestButton) {
      continueGuestButton.addEventListener("click", () => {
        clearCurrentUser();
        renderAuthVisibility();
        setAuthStatus("Continuing in guest mode.", false);
        window.location.reload();
      });
    }
    if (saveSupabaseConfigButton) {
      saveSupabaseConfigButton.addEventListener("click", saveSupabaseConfig);
    }
    if (clearSupabaseConfigButton) {
      clearSupabaseConfigButton.addEventListener("click", clearSupabaseConfig);
    }
  }

  function isoToday() {
    return new Date().toISOString().slice(0, 10);
  }

  function roundOne(v) {
    return Math.round(v * 10) / 10;
  }

  function roundTwo(v) {
    return Math.round(v * 100) / 100;
  }

  function calculateBMI(profile) {
    const weight = Number(profile && profile.weight);
    const heightCm = Number(profile && profile.heightCm);
    if (weight <= 0 || heightCm <= 0) return null;
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    return roundOne(bmi);
  }

  function bmiCategory(bmi) {
    if (!Number.isFinite(bmi)) return "unknown";
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal";
    if (bmi < 30) return "overweight";
    return "obese";
  }

  function symptomScore(profile) {
    const severity = normalizeSymptomSeverity(profile && profile.symptomSeverity, profile && profile.symptoms);
    return Object.values(severity).reduce((acc, v) => acc + Number(v || 0), 0);
  }

  function malnutritionRiskLevel(profile, dayTotals, dayTargets) {
    const bmi = calculateBMI(profile);
    let points = 0;
    if (Number.isFinite(bmi) && bmi < 18.5) points += 3;
    else if (Number.isFinite(bmi) && bmi < 20) points += 2;
    else if (Number.isFinite(bmi) && bmi >= 30) points += 1;

    const weightLoss = String((profile && profile.weightLoss) || "none");
    if (weightLoss === "mild") points += 1;
    if (weightLoss === "moderate") points += 2;
    if (weightLoss === "severe") points += 3;

    const severity = normalizeSymptomSeverity(profile && profile.symptomSeverity, profile && profile.symptoms);
    const appetiteSeverity = Number(severity.appetite_loss_severity || 0);
    points += appetiteSeverity;

    const calorieTarget = Number(dayTargets && dayTargets.calories);
    const calories = Number(dayTotals && dayTotals.calories);
    if (calorieTarget > 0) {
      const deficitPct = (calorieTarget - calories) / calorieTarget;
      if (deficitPct > 0.4) points += 3;
      else if (deficitPct > 0.25) points += 2;
      else if (deficitPct > 0.1) points += 1;
    }

    if (points >= 8) return "severe";
    if (points >= 5) return "high";
    if (points >= 3) return "moderate";
    return "low";
  }

  function readDay(date) {
    const raw = localStorage.getItem(storageKeyForDate(date));
    if (!raw) {
      return {
        targets: { calories: 2000, protein: 90, carbs: 230, fat: 70, fluidsMl: 2000 },
        targetsManual: false,
        meals: [],
        symptoms: [],
        fluidsMl: 0
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        targets: parsed.targets || { calories: 2000, protein: 90, carbs: 230, fat: 70, fluidsMl: 2000 },
        targetsManual: Boolean(parsed.targetsManual),
        meals: Array.isArray(parsed.meals) ? parsed.meals : [],
        symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : [],
        fluidsMl: Number(parsed.fluidsMl || 0)
      };
    } catch (_err) {
      return {
        targets: { calories: 2000, protein: 90, carbs: 230, fat: 70, fluidsMl: 2000 },
        targetsManual: false,
        meals: [],
        symptoms: [],
        fluidsMl: 0
      };
    }
  }

  function writeDay(date, day) {
    localStorage.setItem(storageKeyForDate(date), JSON.stringify(day));
  }

  function totals(meals) {
    return meals.reduce(
      (acc, meal) => {
        acc.calories += Number(meal.calories || 0);
        acc.protein += Number(meal.protein || 0);
        acc.carbs += Number(meal.carbs || 0);
        acc.fat += Number(meal.fat || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  function countRecentDaysBelowHalfEnergy(referenceDate, lookbackDays) {
    const days = Math.max(1, Number(lookbackDays || 14));
    const base = new Date(`${referenceDate}T00:00:00`);
    if (Number.isNaN(base.getTime())) return 0;
    let count = 0;
    for (let i = 0; i < days; i += 1) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const day = readDay(iso);
      const sum = totals(day.meals);
      const target = Number(day.targets && day.targets.calories || 0);
      if (target > 0 && sum.calories < target * 0.5) count += 1;
    }
    return count;
  }

  function percentage(consumed, target) {
    if (!target || target <= 0) return 0;
    return Math.round((consumed / target) * 100);
  }

  function nutritionScore(sum, targets) {
    const calPct = Math.min(100, Math.max(0, percentage(sum.calories, targets.calories)));
    const proteinPct = Math.min(100, Math.max(0, percentage(sum.protein, targets.protein)));
    const carbBalance = targets.carbs > 0
      ? Math.max(0, 100 - Math.abs(percentage(sum.carbs, targets.carbs) - 100))
      : 100;
    const fatBalance = targets.fat > 0
      ? Math.max(0, 100 - Math.abs(percentage(sum.fat, targets.fat) - 100))
      : 100;
    const weighted = calPct * 0.3 + proteinPct * 0.4 + carbBalance * 0.15 + fatBalance * 0.15;
    return Math.round(Math.max(0, Math.min(100, weighted)));
  }

  function riskLabel(profile, sum, targets) {
    const level = malnutritionRiskLevel(profile, sum, targets);
    if (level === "severe") return "Severe risk";
    if (level === "high") return "High risk";
    if (level === "moderate") return "Moderate risk";
    return "Low risk";
  }

  function statusFromScore(score, risk) {
    if (score < 50 || risk === "High risk" || risk === "Severe risk") return "CRITICAL";
    if (score < 75 || risk === "Moderate risk") return "WARNING";
    return "GOOD";
  }

  function getRecommendations(profile, dayTotals, dayTargets, weightHistory) {
    if (typeof getRecommendationsForUser !== "function") {
      return { recommendations: [], allRecommendations: [], validationErrors: ["Recommendation engine not loaded."] };
    }
    return getRecommendationsForUser({
      profile,
      dailyTotals: dayTotals,
      targets: dayTargets,
      weightHistory,
      maxResults: 12
    });
  }

  function ensureRecommendationErrorBanner() {
    const recommendationsSection = document.getElementById("recommendations");
    if (!recommendationsSection) return null;
    let banner = document.getElementById("recommendationValidationError");
    if (banner) return banner;
    banner = document.createElement("div");
    banner.id = "recommendationValidationError";
    banner.className = "alert-card hidden";
    recommendationsSection.prepend(banner);
    return banner;
  }

  function sourceLinkHtml(sourceId, locatorText) {
    const source = (window.SOURCES_REGISTRY || {})[sourceId];
    if (!source) return "";
    const locator = locatorText ? `, ${locatorText}` : "";
    return `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.title}</a> <span class="muted">(${source.evidenceType}, reviewed ${source.lastReviewed}${locator})</span></li>`;
  }

  function renderReferencesPanel() {
    const sourceList = document.getElementById("sourceList");
    if (!sourceList) return;
    const registry = window.SOURCES_REGISTRY || {};
    const byEvidence = {
      guidelinesGovernment: [],
      cancerCenters: [],
      peerReviewed: []
    };

    Object.keys(registry).forEach((id) => {
      const source = registry[id];
      if (source.evidenceType === "Guideline" || source.evidenceType === "Government") {
        byEvidence.guidelinesGovernment.push(id);
      } else if (source.evidenceType === "CancerCenter") {
        byEvidence.cancerCenters.push(id);
      } else if (source.evidenceType === "PeerReviewed") {
        byEvidence.peerReviewed.push(id);
      }
    });

    sourceList.innerHTML = `
      <section class="reference-group">
        <h3>Guidelines and government</h3>
        <ul class="sources">${byEvidence.guidelinesGovernment.map(sourceLinkHtml).join("")}</ul>
      </section>
      <section class="reference-group">
        <h3>Major cancer centers</h3>
        <ul class="sources">${byEvidence.cancerCenters.map(sourceLinkHtml).join("")}</ul>
      </section>
      <section class="reference-group">
        <h3>Peer reviewed journals (PubMed)</h3>
        <ul class="sources">${byEvidence.peerReviewed.map(sourceLinkHtml).join("")}</ul>
      </section>`;
  }

  function recMeta(rec) {
    return {
      evidenceStrength: rec.evidenceStrength || "Guideline/Study mix",
      confidence: rec.confidence || "Moderate confidence"
    };
  }

  function renderRecommendations(profile) {
    const recList = document.getElementById("recommendationList");
    const recMetaNode = document.getElementById("recommendationMeta");
    const errorBanner = ensureRecommendationErrorBanner();
    if (!recList) return;
    const day = readDay(document.getElementById("dashboardDate") ? (document.getElementById("dashboardDate").value || isoToday()) : isoToday());
    const dayTotals = totals(day.meals);
    const weightHistory = loadWeightHistory();
    const engineResult = getRecommendations(profile, dayTotals, day.targets, weightHistory);
    const allRecs = engineResult.allRecommendations || [];
    const recs = allRecs.slice(0, 6);
    recList.innerHTML = "";
    if (errorBanner) {
      errorBanner.classList.add("hidden");
      errorBanner.textContent = "";
    }

    const sourceDomainValidation = typeof validateSourcesRegistryDomains === "function"
      ? validateSourcesRegistryDomains()
      : { valid: false, errors: ["Source registry validator not loaded."] };
    const sourceIdValidation = typeof validateRecommendationSourceIds === "function"
      ? validateRecommendationSourceIds(window.RECOMMENDATIONS_CATALOG || [])
      : { valid: false, errors: ["Recommendation sourceId validator not loaded."] };

    const validationErrors = [
      ...(sourceDomainValidation.errors || []),
      ...(sourceIdValidation.errors || []),
      ...(engineResult.validationErrors || [])
    ];

    if (validationErrors.length) {
      console.warn("Recommendation validation issues", validationErrors);
    }
    if (!sourceDomainValidation.valid) {
      if (errorBanner) {
        errorBanner.classList.remove("hidden");
        errorBanner.textContent = `Some source registry entries failed validation. Showing only valid sourced recommendations.`;
      }
    }

    if (recMetaNode) {
      recMetaNode.textContent = `Cancer: ${profile.cancerType} | Treatment mode: ${profile.treatmentMode}`;
    }

    recs.forEach((rec) => {
      if (!Array.isArray(rec.sourceIds) || rec.sourceIds.length === 0) return;
      const meta = recMeta(rec);
      const card = document.createElement("article");
      card.className = "rec-card";
      card.innerHTML = `<h3>${rec.title}</h3>
        <p>${rec.patientTextShort || rec.patientText || ""}</p>
        <div class="rec-meta">
          <span class="rec-chip strength">${(rec.evidenceTags || ["Guideline"]).join(", ")}</span>
          <span class="rec-chip">${meta.confidence}</span>
        </div>
        <p class="muted">${rec.safetyNote}</p>`;
      const actions = document.createElement("details");
      actions.className = "rec-actions";
      actions.open = true;
      actions.innerHTML = `<summary>What you can do today</summary><ul class="sources">${(rec.patientTextActions || []).map((line) => `<li>${line}</li>`).join("")}</ul>`;
      card.appendChild(actions);
      const why = document.createElement("details");
      why.className = "rec-why";
      why.innerHTML = `<summary>Why this matters</summary><p>${rec.whyThisMatters || ""}</p>`;
      card.appendChild(why);
      const details = document.createElement("details");
      details.className = "rec-sources";
      details.innerHTML = `<summary>Sources</summary><ul class="sources">${rec.sourceIds.map((sourceId) => sourceLinkHtml(sourceId, rec.sourceLocators && rec.sourceLocators[sourceId])).join("")}</ul>`;
      card.appendChild(details);
      recList.appendChild(card);
    });

    if (allRecs.length > 6) {
      const showMoreButton = document.createElement("button");
      showMoreButton.type = "button";
      showMoreButton.className = "secondary";
      showMoreButton.textContent = "Show more";
      showMoreButton.addEventListener("click", () => {
        const additional = allRecs.slice(6, 12);
        additional.forEach((rec) => {
          const meta = recMeta(rec);
          const card = document.createElement("article");
          card.className = "rec-card";
          card.innerHTML = `<h3>${rec.title}</h3>
            <p>${rec.patientTextShort || rec.patientText || ""}</p>
            <div class="rec-meta">
              <span class="rec-chip strength">${(rec.evidenceTags || ["Guideline"]).join(", ")}</span>
              <span class="rec-chip">${meta.confidence}</span>
            </div>
            <p class="muted">${rec.safetyNote}</p>`;
          const actions = document.createElement("details");
          actions.className = "rec-actions";
          actions.open = true;
          actions.innerHTML = `<summary>What you can do today</summary><ul class="sources">${(rec.patientTextActions || []).map((line) => `<li>${line}</li>`).join("")}</ul>`;
          card.appendChild(actions);
          const why = document.createElement("details");
          why.className = "rec-why";
          why.innerHTML = `<summary>Why this matters</summary><p>${rec.whyThisMatters || ""}</p>`;
          card.appendChild(why);
          const src = document.createElement("details");
          src.className = "rec-sources";
          src.innerHTML = `<summary>Sources</summary><ul class="sources">${rec.sourceIds.map((sourceId) => sourceLinkHtml(sourceId, rec.sourceLocators && rec.sourceLocators[sourceId])).join("")}</ul>`;
          card.appendChild(src);
          recList.appendChild(card);
        });
        showMoreButton.remove();
      });
      recList.appendChild(showMoreButton);
    }

    if (!allRecs.length) {
      recList.innerHTML = "<p class='muted'>No source-qualified recommendations matched your current profile and symptoms.</p>";
    }

    const recLogRows = readArray(RECOMMENDATION_LOG_KEY_BASE).filter((row) => row.date !== (document.getElementById("dashboardDate") ? document.getElementById("dashboardDate").value || isoToday() : isoToday()));
    allRecs.forEach((rec) => {
      recLogRows.push({
        user_id: dataOwnerId(),
        date: document.getElementById("dashboardDate") ? document.getElementById("dashboardDate").value || isoToday() : isoToday(),
        recommendation_type: "symptom_driven",
        recommendation_text: rec.title,
        created_at: new Date().toISOString()
      });
    });
    writeArray(RECOMMENDATION_LOG_KEY_BASE, recLogRows);

    renderReferencesPanel();
  }

  function loadWeightHistory() {
    const raw = localStorage.getItem(scopedKey(WEIGHT_HISTORY_KEY_BASE));
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  }

  function saveWeightHistory(items) {
    localStorage.setItem(scopedKey(WEIGHT_HISTORY_KEY_BASE), JSON.stringify(items));
  }

  function renderWeightChart(items, summaryNodeId, chartNodeId) {
    const summaryNode = document.getElementById(summaryNodeId);
    const chart = document.getElementById(chartNodeId);
    if (!summaryNode || !chart) return;

    const sorted = [...items].sort((a, b) => (a.date > b.date ? 1 : -1));
    const hasData = sorted.length > 0;
    if (!hasData) {
      summaryNode.textContent = "No weight history yet.";
    }

    const values = hasData ? sorted.map((x) => Number(x.weightKg)) : [50, 90];
    const minW = Math.min.apply(null, values);
    const maxW = Math.max.apply(null, values);
    const span = Math.max(1, maxW - minW);
    const x0 = 50;
    const y0 = 190;
    const chartW = 520;
    const chartH = 140;
    const points = sorted.map((entry, idx) => {
      const x = x0 + (idx / Math.max(1, sorted.length - 1)) * chartW;
      const y = y0 - ((entry.weightKg - minW) / span) * chartH;
      return `${x},${y}`;
    });

    if (hasData) {
      const latest = sorted[sorted.length - 1];
      const first = sorted[0];
      const delta = roundOne(latest.weightKg - first.weightKg);
      summaryNode.textContent = `Latest ${latest.weightKg} kg (${latest.date}) | Change ${delta >= 0 ? "+" : ""}${delta} kg`;
    }
    const yTicks = [0, 0.5, 1].map((ratio) => {
      const y = y0 - ratio * chartH;
      const value = roundOne(minW + ratio * span);
      return `<line x1="${x0}" y1="${y}" x2="${x0 + chartW}" y2="${y}" stroke="#d7deea" stroke-width="1"></line>
        <text x="${x0 - 8}" y="${y + 4}" text-anchor="end" fill="#334155" font-size="11" font-weight="600">${value}</text>`;
    }).join("");
    const defaultDates = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      defaultDates.push(d.toISOString().slice(0, 10));
    }
    const tickDates = hasData ? sorted.map((entry) => entry.date) : defaultDates;
    const xTicks = tickDates.map((dateLabel, idx) => {
      const x = x0 + (idx / Math.max(1, tickDates.length - 1)) * chartW;
      const label = dateLabel.slice(5);
      return `<text x="${x}" y="${y0 + 16}" text-anchor="middle" fill="#5f6b7a" font-size="10">${label}</text>`;
    }).join("");
    chart.innerHTML = `<rect x="0" y="0" width="600" height="220" fill="#f8fafb"></rect>
      ${yTicks}
      <line x1="${x0}" y1="${y0}" x2="${x0 + chartW}" y2="${y0}" stroke="#334155" stroke-width="2"></line>
      <line x1="${x0}" y1="${y0 - chartH}" x2="${x0}" y2="${y0}" stroke="#334155" stroke-width="2"></line>
      ${hasData ? `<polyline points="${points.join(" ")}" fill="none" stroke="#2cb1a6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>` : ""}
      ${xTicks}
      <text x="${x0 + chartW / 2}" y="214" text-anchor="middle" fill="#334155" font-size="12" font-weight="600">X-axis: Date (MM-DD)</text>
      <text x="14" y="${y0 - chartH / 2}" transform="rotate(-90 14 ${y0 - chartH / 2})" text-anchor="middle" fill="#334155" font-size="12" font-weight="600">Y-axis: Weight (kg)</text>`;
  }

  function renderIntakeTrendChart(summaryNodeId, chartNodeId) {
    const summaryNode = document.getElementById(summaryNodeId);
    const chart = document.getElementById(chartNodeId);
    if (!summaryNode || !chart) return;

    const dates = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }
    const rows = dates.map((date) => ({ date, day: readDay(date), sum: totals(readDay(date).meals) }));
    const caloriePcts = rows.map((r) => percentage(r.sum.calories, r.day.targets.calories));
    const proteinPcts = rows.map((r) => percentage(r.sum.protein, r.day.targets.protein));
    const fluidPcts = rows.map((r) => percentage(Number(r.day.fluidsMl || 0), Number(r.day.targets.fluidsMl || 0)));
    const x0 = 50;
    const y0 = 190;
    const chartW = 520;
    const chartH = 150;
    const toPoints = (arr) => arr.map((v, idx) => {
      const x = x0 + (idx / Math.max(1, arr.length - 1)) * chartW;
      const y = y0 - (Math.max(0, Math.min(150, v)) / 150) * chartH;
      return `${x},${y}`;
    }).join(" ");
    const yTicks = [0, 50, 100, 150].map((value) => {
      const y = y0 - (value / 150) * chartH;
      return `<line x1="${x0}" y1="${y}" x2="${x0 + chartW}" y2="${y}" stroke="#d7deea" stroke-width="1"></line>
        <text x="${x0 - 8}" y="${y + 4}" text-anchor="end" fill="#334155" font-size="11" font-weight="600">${value}%</text>`;
    }).join("");
    const xTicks = rows.map((r, idx) => {
      const x = x0 + (idx / Math.max(1, rows.length - 1)) * chartW;
      return `<text x="${x}" y="${y0 + 16}" text-anchor="middle" fill="#5f6b7a" font-size="10">${r.date.slice(5)}</text>`;
    }).join("");
    summaryNode.textContent = "Last 7 days: line = percent of target (100% means target met).";
    chart.innerHTML = `<rect x="0" y="0" width="600" height="220" fill="#f8fafb"></rect>
      ${yTicks}
      <line x1="${x0}" y1="${y0}" x2="${x0 + chartW}" y2="${y0}" stroke="#334155" stroke-width="2"></line>
      <line x1="${x0}" y1="${y0 - chartH}" x2="${x0}" y2="${y0}" stroke="#334155" stroke-width="2"></line>
      <polyline points="${toPoints(caloriePcts)}" fill="none" stroke="#2cb1a6" stroke-width="3"></polyline>
      <polyline points="${toPoints(proteinPcts)}" fill="none" stroke="#2d6cdf" stroke-width="3"></polyline>
      <polyline points="${toPoints(fluidPcts)}" fill="none" stroke="#9a640c" stroke-width="3"></polyline>
      ${xTicks}
      <text x="46" y="20" fill="#2cb1a6" font-size="12">Calories</text>
      <text x="120" y="20" fill="#2d6cdf" font-size="12">Protein</text>
      <text x="184" y="20" fill="#9a640c" font-size="12">Fluids</text>
      <text x="${x0 + chartW / 2}" y="214" text-anchor="middle" fill="#334155" font-size="12" font-weight="600">X-axis: Date (MM-DD)</text>
      <text x="14" y="${y0 - chartH / 2}" transform="rotate(-90 14 ${y0 - chartH / 2})" text-anchor="middle" fill="#334155" font-size="12" font-weight="600">Y-axis: % of Target</text>`;
  }

  function requireProfileGate() {
    return true;
  }

  function populateCancerOptions(cancerSelect) {
    if (!cancerSelect) return;
    if (cancerSelect.options.length > 0) return;
    TOP_CANCERS.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      cancerSelect.appendChild(option);
    });
  }

  function initProfilePage() {
    const form = document.getElementById("profileSetupForm");
    if (!form) return;

    const cancerSelect = document.getElementById("cancerSelect");
    const dialysisField = document.getElementById("dialysisField");
    const symptomInputs = Array.from(document.querySelectorAll('#symptomForm input[type="checkbox"]'));
    const noneSymptomInput = symptomInputs.find((input) => input.value === "none");
    const cycleLengthInput = document.getElementById("profileCycleLengthDays");
    const cycleDayInput = document.getElementById("profileCycleDay");
    const lastTxInput = document.getElementById("profileLastTreatmentDate");
    const nextTxInput = document.getElementById("profileNextTreatmentDate");
    populateCancerOptions(cancerSelect);

    cancerSelect.addEventListener("change", () => {
      if (dialysisField) {
        dialysisField.classList.toggle("hidden", cancerSelect.value !== "Kidney and Renal Pelvis Cancer");
      }
    });

    const saved = getProfile();
    if (saved) {
      document.getElementById("profileAge").value = saved.age || "";
      document.getElementById("profileSex").value = saved.sex || "female";
      document.getElementById("profileHeightCm").value = saved.heightCm || "";
      document.getElementById("profileWeightKg").value = saved.weight || "";
      const leanMassInput = document.getElementById("profileLeanBodyMassKg");
      if (leanMassInput) leanMassInput.value = saved.leanBodyMassKg || "";
      document.getElementById("profileActivity").value = String(saved.activityLevel || "1.2");
      document.getElementById("profileWeightLoss").value = saved.weightLoss || "none";
      document.getElementById("profileAppetite").value = saved.appetite || "normal";
      cancerSelect.value = saved.cancerType || TOP_CANCERS[0];
      document.getElementById("profileTreatmentType").value = saved.treatmentType || "chemotherapy";
      document.getElementById("profileTreatmentMode").value = saved.treatmentMode || "on";
      const cycle = saved.treatmentCycle || {};
      if (cycleLengthInput) cycleLengthInput.value = String(cycle.cycle_length_days || 21);
      if (cycleDayInput) cycleDayInput.value = String(cycle.cycle_day || 1);
      if (lastTxInput) lastTxInput.value = cycle.last_treatment_date || "";
      if (nextTxInput) nextTxInput.value = cycle.next_treatment_date || "";
      if (dialysisField) {
        dialysisField.classList.toggle("hidden", cancerSelect.value !== "Kidney and Renal Pelvis Cancer");
      }
      const sym = new Set(saved.symptoms || []);
      symptomInputs.forEach((input) => {
        input.checked = sym.has(input.value);
      });
      if (!sym.size && noneSymptomInput) {
        noneSymptomInput.checked = true;
      }
      if (saved.dialysisStatus) {
        const radio = document.querySelector(`input[name="dialysisStatus"][value="${saved.dialysisStatus}"]`);
        if (radio) radio.checked = true;
      }
    } else {
      if (lastTxInput) lastTxInput.value = isoToday();
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const symptoms = [];
      symptomInputs.forEach((input) => {
        if (input.checked) symptoms.push(input.value);
      });
      if (!symptoms.length) symptoms.push("none");
      const symptomSeverity = symptomSeverityFromLegacySymptoms(symptoms);
      const selectedDialysis = document.querySelector('input[name="dialysisStatus"]:checked');
      const treatmentCycle = {
        treatment_type: document.getElementById("profileTreatmentType").value,
        cycle_length_days: Math.max(1, Number(cycleLengthInput ? cycleLengthInput.value : 21)),
        cycle_day: Math.max(1, Number(cycleDayInput ? cycleDayInput.value : 1)),
        last_treatment_date: lastTxInput ? lastTxInput.value : "",
        next_treatment_date: nextTxInput ? nextTxInput.value : ""
      };
      const profile = {
        age: Number(document.getElementById("profileAge").value),
        sex: document.getElementById("profileSex").value,
        heightCm: Number(document.getElementById("profileHeightCm").value),
        weight: Number(document.getElementById("profileWeightKg").value),
        leanBodyMassKg: Number(document.getElementById("profileLeanBodyMassKg") ? document.getElementById("profileLeanBodyMassKg").value : 0) || 0,
        activityLevel: Number(document.getElementById("profileActivity").value),
        weightLoss: document.getElementById("profileWeightLoss").value,
        appetite: document.getElementById("profileAppetite").value,
        cancerType: cancerSelect.value,
        treatmentType: document.getElementById("profileTreatmentType").value,
        treatmentMode: document.getElementById("profileTreatmentMode").value,
        symptoms: symptoms,
        symptomSeverity,
        dialysisStatus: selectedDialysis ? selectedDialysis.value : "off",
        treatmentCycle,
        bmi: calculateBMI({
          weight: Number(document.getElementById("profileWeightKg").value),
          heightCm: Number(document.getElementById("profileHeightCm").value)
        })
      };
      profile.bmiCategory = bmiCategory(profile.bmi);
      saveProfile(profile);

      const today = isoToday();
      const symptomRows = readArray(SYMPTOM_LOG_KEY_BASE).filter((row) => row.date !== today);
      Object.keys(symptomSeverity).forEach((name) => {
        symptomRows.push({
          user_id: dataOwnerId(),
          symptom_name: name,
          severity: Number(symptomSeverity[name] || 0),
          date: today,
          created_at: new Date().toISOString()
        });
      });
      writeArray(SYMPTOM_LOG_KEY_BASE, symptomRows);

      const treatmentCycleRows = readArray(TREATMENT_CYCLE_LOG_KEY_BASE);
      treatmentCycleRows.push({
        user_id: dataOwnerId(),
        treatment_type: treatmentCycle.treatment_type,
        cycle_length_days: treatmentCycle.cycle_length_days,
        cycle_day: treatmentCycle.cycle_day,
        last_treatment_date: treatmentCycle.last_treatment_date,
        next_treatment_date: treatmentCycle.next_treatment_date,
        date: today,
        created_at: new Date().toISOString()
      });
      writeArray(TREATMENT_CYCLE_LOG_KEY_BASE, treatmentCycleRows);

      const profileStatus = document.getElementById("profileStatus");
      if (profileStatus) {
        profileStatus.textContent = "Profile saved. Redirecting to dashboard...";
      }
      window.setTimeout(() => {
        window.location.assign("./index.html");
      }, 250);
    });

    function enforceSymptomSelectionBehavior(changedInput) {
      if (!noneSymptomInput) return;
      if (changedInput === noneSymptomInput && noneSymptomInput.checked) {
        symptomInputs.forEach((input) => {
          if (input !== noneSymptomInput) input.checked = false;
        });
        return;
      }
      if (changedInput !== noneSymptomInput && changedInput.checked) {
        noneSymptomInput.checked = false;
      }
    }

    symptomInputs.forEach((input) => {
      input.addEventListener("change", () => enforceSymptomSelectionBehavior(input));
    });
  }

  function initCaregiverPage() {
    const relationshipsList = document.getElementById("caregiverRelationshipsList");
    const relationshipForm = document.getElementById("caregiverRelationshipForm");
    const patientIdInput = document.getElementById("caregiverPatientUserId");
    const relationshipTypeInput = document.getElementById("caregiverRelationshipType");
    const caregiverStatus = document.getElementById("caregiverStatus");
    const activePatientNode = document.getElementById("caregiverActivePatient");

    if (!relationshipsList || !relationshipForm || !patientIdInput || !relationshipTypeInput || !caregiverStatus || !activePatientNode) return;

    if (!(currentUser && currentUser.id)) {
      caregiverStatus.textContent = "Log in with a secure account to use caregiver mode.";
      relationshipsList.innerHTML = "";
      return;
    }

    function setStatus(message, isError) {
      caregiverStatus.textContent = message;
      caregiverStatus.style.color = isError ? "var(--danger)" : "var(--muted)";
    }

    function renderRelationships() {
      const rows = getCaregiverRelationships();
      const activePatientId = getActivePatientId();
      activePatientNode.textContent = activePatientId && canManagePatient(activePatientId)
        ? `Active patient: ${activePatientId}`
        : "Active patient: self";
      relationshipsList.innerHTML = "";
      if (!rows.length) {
        relationshipsList.innerHTML = "<p class='muted'>No linked patients yet.</p>";
        return;
      }
      rows.forEach((row, idx) => {
        const item = document.createElement("div");
        item.className = "meal";
        const activeLabel = activePatientId === row.patient_user_id ? " (active)" : "";
        item.innerHTML = `<div><strong>${row.patient_user_id}</strong><br><span class="muted">${row.relationship_type}${activeLabel}</span></div>
          <div class="inline-actions">
            <button type="button" class="secondary" data-switch="${idx}">Switch</button>
            <button type="button" class="danger" data-remove-rel="${idx}">Remove</button>
          </div>`;
        relationshipsList.appendChild(item);
      });
    }

    relationshipForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const patientUserId = String(patientIdInput.value || "").trim();
      if (!patientUserId) {
        setStatus("Enter a patient user id.", true);
        return;
      }
      if (patientUserId === viewerUserId()) {
        setStatus("Patient id cannot match your own user id.", true);
        return;
      }
      const rows = getCaregiverRelationships();
      if (rows.some((row) => row.patient_user_id === patientUserId)) {
        setStatus("Relationship already exists for this patient.", true);
        return;
      }
      rows.push({
        caregiver_user_id: viewerUserId(),
        patient_user_id: patientUserId,
        relationship_type: relationshipTypeInput.value || "caregiver",
        created_at: new Date().toISOString()
      });
      saveCaregiverRelationships(rows);
      setStatus("Patient relationship added.", false);
      patientIdInput.value = "";
      renderRelationships();
      renderAuthVisibility();
    });

    relationshipsList.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const switchIdx = target.getAttribute("data-switch");
      if (switchIdx != null) {
        const rows = getCaregiverRelationships();
        const row = rows[Number(switchIdx)];
        if (!row) return;
        setActivePatientId(row.patient_user_id);
        setStatus(`Switched to patient ${row.patient_user_id}.`, false);
        renderRelationships();
        renderAuthVisibility();
        return;
      }
      const removeIdx = target.getAttribute("data-remove-rel");
      if (removeIdx != null) {
        const rows = getCaregiverRelationships();
        const row = rows[Number(removeIdx)];
        if (!row) return;
        rows.splice(Number(removeIdx), 1);
        saveCaregiverRelationships(rows);
        if (getActivePatientId() === row.patient_user_id) setActivePatientId("");
        setStatus("Relationship removed.", false);
        renderRelationships();
        renderAuthVisibility();
      }
    });

    const selfButton = document.getElementById("caregiverSwitchSelf");
    if (selfButton) {
      selfButton.addEventListener("click", () => {
        setActivePatientId("");
        setStatus("Switched back to your own account data.", false);
        renderRelationships();
        renderAuthVisibility();
      });
    }

    renderRelationships();
  }

  function renderRings(sum, targets, fluidsMl) {
    const node = document.getElementById("macroRings");
    if (!node) return;
    node.innerHTML = "";

    [
      { label: "Calories", consumed: sum.calories, target: targets.calories, unit: "kcal" },
      { label: "Protein", consumed: sum.protein, target: targets.protein, unit: "g" },
      { label: "Carbs", consumed: sum.carbs, target: targets.carbs, unit: "g" },
      { label: "Fat", consumed: sum.fat, target: targets.fat, unit: "g" },
      { label: "Fluids", consumed: Number(fluidsMl || 0), target: Number(targets.fluidsMl || 0), unit: "mL" }
    ].forEach((it) => {
      const pct = Math.max(0, Math.min(100, percentage(it.consumed, it.target)));
      const card = document.createElement("article");
      card.className = "ring-card";
      card.innerHTML = `<div class="ring" style="--pct:${pct}"><span>${pct}%</span></div>
        <p><strong>${it.label}</strong><br><span class="muted">${roundOne(it.consumed)} / ${it.target} ${it.unit}</span></p>`;
      node.appendChild(card);
    });
  }

  function appetiteLabel(value) {
    if (value === "very_low") return "Very low";
    if (value === "reduced") return "Reduced";
    return "Normal";
  }

  function symptomLabel(value) {
    const labels = {
      none: "No particular symptoms",
      nausea: "Nausea",
      vomiting: "Vomiting",
      fatigue: "Fatigue",
      appetite_loss: "Appetite loss",
      taste_changes: "Taste changes",
      mouth_sores: "Mouth sores",
      dry_mouth: "Dry mouth",
      difficulty_swallowing: "Difficulty swallowing",
      constipation: "Constipation",
      diarrhea: "Diarrhea",
      greasy_stools: "Greasy stools",
      floating_stools: "Floating stools",
      bloating: "Bloating",
      early_satiety: "Early satiety",
      pain: "Pain affecting eating"
    };
    return labels[value] || value;
  }

  function weightLossLabel(value) {
    if (value === "mild") return "Up to 5%";
    if (value === "moderate") return "5-10%";
    if (value === "severe") return "More than 10%";
    return "None";
  }

  function initDashboardPage() {
    const profile = getProfile() || {
      treatmentType: "Not set",
      treatmentMode: "normal",
      weight: "-",
      weightLoss: "none",
      appetite: "normal",
      symptoms: [],
      symptomSeverity: symptomSeverityDefaults(),
      cancerType: TOP_CANCERS[0],
      dialysisStatus: "off"
    };
    const hasProfile = profileExists();
    const dateInput = document.getElementById("dashboardDate");
    if (!dateInput) return;
    dateInput.value = isoToday();

    const weightDateInput = document.getElementById("dashboardWeightDate");
    const weightKgInput = document.getElementById("dashboardWeightKg");
    const saveWeightButton = document.getElementById("dashboardSaveWeightEntry");
    if (weightDateInput) weightDateInput.value = isoToday();

    const render = () => {
      const day = readDay(dateInput.value || isoToday());
      const sum = totals(day.meals);
      const score = nutritionScore(sum, day.targets);
      const risk = riskLabel(profile, sum, day.targets);
      const status = statusFromScore(score, risk);

      const statusNode = document.getElementById("nutritionStatus");
      if (statusNode) {
        statusNode.textContent = `Status: ${status}`;
        statusNode.classList.remove("good", "warning", "critical");
        statusNode.classList.add(status === "GOOD" ? "good" : status === "WARNING" ? "warning" : "critical");
      }

      const nutritionScoreNode = document.getElementById("nutritionScore");
      const malnutritionRiskNode = document.getElementById("malnutritionRisk");
      const hydrationRiskNode = document.getElementById("hydrationRisk");
      const calorieDeficitRiskNode = document.getElementById("calorieDeficitRisk");
      const weightLossRiskNode = document.getElementById("weightLossRisk");
      const clinicalSummaryNode = document.getElementById("clinicalSummaryCard");
      const profileSummaryNode = document.getElementById("profileSummaryCard");
      const bmi = calculateBMI(profile);
      const severity = normalizeSymptomSeverity(profile.symptomSeverity, profile.symptoms);
      const activeSymptoms = severityToSymptoms(severity);
      const hasHydrationSensitiveSymptom = activeSymptoms.includes("diarrhea") || activeSymptoms.includes("vomiting") || activeSymptoms.includes("constipation") || activeSymptoms.includes("dry_mouth");
      const hydrationRisk = Number(day.targets.fluidsMl || 0) > 0 && Number(day.fluidsMl || 0) < Number(day.targets.fluidsMl || 0) * (hasHydrationSensitiveSymptom ? 0.85 : 0.75)
        ? "high"
        : "low";
      const calorieDeficitRisk = Number(day.targets.calories || 0) > 0 && sum.calories < day.targets.calories * 0.8 ? "high" : "low";
      const weightLossRisk = (profile.weightLoss === "moderate" || profile.weightLoss === "severe") ? "high" : "low";

      if (nutritionScoreNode) {
        nutritionScoreNode.innerHTML = `<p><strong>${score}/100</strong></p><p class="muted">Daily nutrition score</p>`;
      }
      if (malnutritionRiskNode) {
        malnutritionRiskNode.innerHTML = `<p><strong>Malnutrition: ${risk}</strong></p>`;
      }
      if (hydrationRiskNode) {
        hydrationRiskNode.innerHTML = `<p><strong>Hydration risk: ${hydrationRisk}</strong></p>`;
      }
      if (calorieDeficitRiskNode) {
        calorieDeficitRiskNode.innerHTML = `<p><strong>Calorie deficit risk: ${calorieDeficitRisk}</strong></p>`;
      }
      if (weightLossRiskNode) {
        weightLossRiskNode.innerHTML = `<p><strong>Weight loss risk: ${weightLossRisk}</strong></p>`;
      }
      if (clinicalSummaryNode) {
        clinicalSummaryNode.innerHTML = `
          <p>BMI: <strong>${Number.isFinite(bmi) ? bmi : "Not set"}</strong> (${bmiCategory(bmi)})</p>
          <p>Cycle: <strong>${profile.treatmentCycle ? `${profile.treatmentCycle.cycle_day || "-"} / ${profile.treatmentCycle.cycle_length_days || "-"}` : "Not set"}</strong></p>
          <p>Target fluids: <strong>${day.targets.fluidsMl || 0} mL</strong></p>`;
      }
      if (profileSummaryNode) {
        const symptomText = activeSymptoms.length ? activeSymptoms.map(symptomLabel).join(", ") : "No particular symptoms";
        const weightText = typeof profile.weight === "number" ? `${profile.weight} kg` : "Not set";
        const leanMassText = Number(profile.leanBodyMassKg || 0) > 0 ? `${roundOne(Number(profile.leanBodyMassKg || 0))} kg` : "Not set";
        profileSummaryNode.innerHTML = `
          <p>Treatment: <strong>${profile.treatmentType} (${profile.treatmentMode})</strong></p>
          <p>Weight: <strong>${weightText}</strong></p>
          <p>Lean body mass: <strong>${leanMassText}</strong></p>
          <p>Weight change: <strong>${weightLossLabel(profile.weightLoss || "none")}</strong></p>
          <p>Appetite: <strong>${appetiteLabel(profile.appetite || "normal")}</strong></p>
          <p>Symptoms: <strong>${symptomText}</strong></p>
          ${hasProfile ? "" : "<p class=\"muted\">Profile not complete yet. You can still use dashboard and tracker.</p>"}`;
      }

      renderRings(sum, day.targets, day.fluidsMl);

      const actions = [];
      const strictRules = window.STRICT_TWO_SOURCE_RULES || {};
      const escalation = strictRules.intake_escalation || {};
      const belowHalfLast14 = countRecentDaysBelowHalfEnergy(dateInput.value || isoToday(), 14);
      if (sum.protein < day.targets.protein * 0.8) actions.push("Increase protein at next meal (eggs, yogurt, shake, tofu).");
      if (sum.calories < day.targets.calories * 0.8) actions.push("Add one calorie-dense snack in the next 4 hours.");
      if (Number(day.targets.fluidsMl || 0) > 0 && Number(day.fluidsMl || 0) < Number(day.targets.fluidsMl || 0) * 0.8) actions.push("Increase fluid intake today unless your team has fluid restrictions.");
      if ((profile.appetite || "normal") !== "normal") actions.push("Use 5-6 smaller meals and include liquid calories between meals.");
      if (Number(day.targets.protein || 0) > 0) actions.push("Distribute protein across meals instead of concentrating it in one meal.");
      if ((profile.treatmentMode || "normal") === "on" && activeSymptoms.includes("nausea")) {
        actions.push("For mild treatment-related nausea, ask your team whether ginger lozenges or candy can be used as an adjunct.");
      }
      if ((profile.weightLoss || "none") === "moderate" || (profile.weightLoss || "none") === "severe") {
        actions.push("Escalate to your care team dietitian this week due to meaningful recent weight loss.");
      }
      if (belowHalfLast14 >= Number(escalation.actual_days_threshold || 14)) {
        actions.push("Intake has been under 50% of needs for prolonged periods; discuss nutrition support route escalation now.");
      } else if (belowHalfLast14 >= Number(escalation.anticipated_days_threshold || 10)) {
        actions.push("Intake has frequently been under 50% of energy needs; ask your team whether enteral/parenteral nutrition escalation is needed.");
      }
      if (!actions.length) actions.push("Maintain current plan and continue logging intake.");

      const todo = document.getElementById("whatToDoList");
      if (todo) {
        todo.innerHTML = "";
        actions.forEach((a) => {
          const li = document.createElement("li");
          li.textContent = a;
          todo.appendChild(li);
        });
      }

      renderRecommendations(profile);
      renderWeightChart(loadWeightHistory(), "weightTrendSummary", "weightChart");
      renderIntakeTrendChart("intakeTrendSummary", "intakeTrendChart");
    };

    if (saveWeightButton) {
      saveWeightButton.addEventListener("click", () => {
        const date = weightDateInput ? weightDateInput.value : "";
        const weightKg = roundOne(Number(weightKgInput ? weightKgInput.value : 0));
        if (!date || weightKg <= 0) return;
        const weightHistory = loadWeightHistory();
        const existing = weightHistory.find((entry) => entry.date === date);
        if (existing) existing.weightKg = weightKg;
        else weightHistory.push({ date, weightKg });
        saveWeightHistory(weightHistory);
        render();
      });
    }

    dateInput.addEventListener("change", render);
    render();
  }

  function scaledMacros(food, grams) {
    const factor = grams / 100;
    return {
      calories: Math.round(food.macros100g.calories * factor),
      protein: roundTwo(food.macros100g.protein * factor),
      carbs: roundTwo(food.macros100g.carbs * factor),
      fat: roundTwo(food.macros100g.fat * factor)
    };
  }

  function defaultTargets() {
    return { calories: 2000, protein: 90, carbs: 230, fat: 70, fluidsMl: 2000 };
  }

  function calculateRecommendedTargets(profile) {
    if (!profile) return defaultTargets();
    const strictRules = window.STRICT_TWO_SOURCE_RULES || {};
    const strictEnergyRules = strictRules.energy_rules || {};
    const strictProteinRules = strictRules.protein_rules || {};
    const age = Number(profile.age || 0);
    const weight = Number(profile.weight || 0);
    const heightCm = Number(profile.heightCm || 0);
    const leanBodyMassKg = Number(profile.leanBodyMassKg || 0);
    const leanBodyMassLb = leanBodyMassKg > 0 ? leanBodyMassKg * 2.20462 : 0;
    const activity = Number(profile.activityLevel || 1.2);

    if (age <= 0 || weight <= 0 || heightCm <= 0) return defaultTargets();

    const isMale = String(profile.sex || "").toLowerCase() === "male";
    let bmr = 10 * weight + 6.25 * heightCm - 5 * age + (isMale ? 5 : -161);
    if (!Number.isFinite(bmr) || bmr <= 0) bmr = 1400;

    const treatmentMode = String(profile.treatmentMode || "normal");
    const treatmentType = String(profile.treatmentType || "none");
    const activeSymptoms = new Set(Array.isArray(profile.symptoms) ? profile.symptoms.filter((s) => s && s !== "none") : []);

    const severity = normalizeSymptomSeverity(profile.symptomSeverity, profile.symptoms);
    const symptomBurden = symptomScore(profile);
    const malnutritionRisk = malnutritionRiskLevel(profile, { calories: 0, protein: 0 }, { calories: Math.round(bmr * activity), protein: 90 });
    const bmi = calculateBMI(profile);
    const riskBump = malnutritionRisk === "severe" ? 2 : malnutritionRisk === "high" ? 1.5 : malnutritionRisk === "moderate" ? 1 : 0;
    let kcalPerKg = 25;
    if (["chemotherapy", "radiation", "immunotherapy", "targeted"].includes(treatmentType) || treatmentMode === "on") kcalPerKg = 27;
    if (treatmentType === "surgery") kcalPerKg = 28;
    if (profile.weightLoss === "moderate" || profile.weightLoss === "severe") kcalPerKg += 1;
    if (activeSymptoms.has("appetite_loss") || activeSymptoms.has("early_satiety") || activeSymptoms.has("nausea")) kcalPerKg += 1;
    kcalPerKg += riskBump;
    kcalPerKg = Math.max(23, Math.min(32, kcalPerKg));
    const weightBasedCalories = weight * kcalPerKg;
    const mifflinCalories = bmr * activity;
    let calories = Math.round(Math.max(1200, Math.min(4200, Math.max(weightBasedCalories, mifflinCalories * 0.95))));
    // Strict two-source rule: lean mass energy fact (~30 kcal/kg LBM/day) is context anchor, not universal prescription.
    if (leanBodyMassKg > 0 && Number(strictEnergyRules.lean_mass_energy_context_kcal_per_kg || 0) > 0) {
      const leanMassEnergyContext = leanBodyMassKg * Number(strictEnergyRules.lean_mass_energy_context_kcal_per_kg);
      if ((treatmentMode === "on" || malnutritionRisk === "high" || malnutritionRisk === "severe") && calories < leanMassEnergyContext * 0.8) {
        calories = Math.round(Math.max(calories, leanMassEnergyContext * 0.8));
      }
    }

    let proteinPerKg = 1.2;
    if (treatmentType === "surgery") proteinPerKg = Math.max(proteinPerKg, 1.3);
    if (["chemotherapy", "radiation", "immunotherapy", "targeted"].includes(treatmentType)) {
      proteinPerKg = Math.max(proteinPerKg, 1.2);
    }
    if (profile.weightLoss === "moderate") proteinPerKg = 1.4;
    if (profile.weightLoss === "severe") proteinPerKg = 1.6;
    if (profile.appetite === "reduced") proteinPerKg = Math.max(proteinPerKg, 1.3);
    if (profile.appetite === "very_low") proteinPerKg = Math.max(proteinPerKg, 1.5);
    if (activeSymptoms.has("diarrhea") || activeSymptoms.has("vomiting") || activeSymptoms.has("mouth_sores")) {
      proteinPerKg = Math.max(proteinPerKg, 1.3);
    }
    // Nutritional Oncology (p. 317): older post-discharge adults showed higher protein goals by BMI group.
    if (age >= 65 && (treatmentType === "surgery" || treatmentMode === "off")) {
      if (Number.isFinite(bmi) && bmi < 23) proteinPerKg = Math.max(proteinPerKg, 1.7);
      else if (Number.isFinite(bmi) && bmi <= 27) proteinPerKg = Math.max(proteinPerKg, 1.4);
      else if (Number.isFinite(bmi) && bmi > 27) proteinPerKg = Math.max(proteinPerKg, 1.1);
    }
    if (profile.dialysisStatus === "on") proteinPerKg = Math.max(1.2, Math.min(1.4, proteinPerKg));
    if (profile.dialysisStatus === "off" && profile.cancerType === "Kidney and Renal Pelvis Cancer") {
      proteinPerKg = Math.min(proteinPerKg, 1.0);
    }
    proteinPerKg = Math.min(1.8, proteinPerKg);
    let protein = roundTwo(Math.max(65, weight * proteinPerKg));
    // Strict two-source rule: if LBM is available, UCLA-style anchor is 1 g per lb LBM.
    if (leanBodyMassLb > 0 && strictProteinRules.lean_mass_primary_prescription_g_per_lb_lbm === 1) {
      protein = roundTwo(Math.max(protein, leanBodyMassLb));
    }

    // In surgical recovery, prioritize achieving protein goals before chasing exact carb/fat splits.
    const fatRatio = treatmentType === "surgery" ? 0.32 : (profile.appetite === "very_low" ? 0.35 : 0.30);
    const fat = roundTwo(Math.max(35, (calories * fatRatio) / 9));
    const carbs = roundTwo(Math.max(50, (calories - protein * 4 - fat * 9) / 4));

    let fluidsMl = Math.round(weight * 30);
    if (activeSymptoms.has("diarrhea")) fluidsMl += 500;
    if (activeSymptoms.has("vomiting")) fluidsMl += 500;
    if (activeSymptoms.has("constipation")) fluidsMl += 300;
    if (activeSymptoms.has("dry_mouth")) fluidsMl += 250;
    if (activeSymptoms.has("mouth_sores")) fluidsMl += 200;
    if (activeSymptoms.has("difficulty_swallowing")) fluidsMl += 200;
    if (severity.diarrhea_severity >= 2 || severity.vomiting_severity >= 2) fluidsMl += 200;
    if (activeSymptoms.has("diarrhea") && activeSymptoms.has("vomiting")) fluidsMl += 250;
    if (profile.dialysisStatus === "on") fluidsMl = Math.round(Math.max(1000, Math.min(1800, weight * 20)));
    if (symptomBurden >= 12) fluidsMl += 200;
    fluidsMl = Math.max(1000, Math.min(4000, fluidsMl));

    return { calories, protein, carbs, fat, fluidsMl };
  }

  function findCuratedFoodByName(inputName) {
    const query = String(inputName || "").trim().toLowerCase();
    if (!query) return null;
    return CURATED_FOODS.find((food) => {
      const canonical = food.name.toLowerCase();
      const simplified = canonical.replace(/\s*\([^)]*\)\s*/g, " ").replace(/\s+/g, " ").trim();
      return canonical === query || simplified === query || canonical.includes(query) || query.includes(simplified);
    }) || null;
  }

  function scaleFoodMacros(macros100g, servingGrams) {
    const factor = servingGrams / 100;
    return {
      calories: roundOne(macros100g.calories * factor),
      protein: roundTwo(macros100g.protein * factor),
      carbs: roundTwo(macros100g.carbs * factor),
      fat: roundTwo(macros100g.fat * factor)
    };
  }

  function usdaNutrientValue(food, nutrientId, nutrientNumber, nutrientNames, unitName) {
    const nutrients = Array.isArray(food.foodNutrients) ? food.foodNutrients : [];
    const match = nutrients.find((n) => {
      const id = Number(n.nutrientId || NaN);
      const num = String(n.nutrientNumber || n.number || "");
      const name = String(n.nutrientName || n.name || "").toLowerCase();
      const unit = String(n.unitName || "").toUpperCase();
      if (!Number.isNaN(id) && id === nutrientId) return true;
      if (num === nutrientNumber) {
        if (!unitName) return true;
        return unit === unitName.toUpperCase();
      }
      return nutrientNames.some((candidate) => name.includes(candidate));
    });
    if (!match) return NaN;
    return Number(match.value || match.amount || NaN);
  }

  function parseUsdaFoodMacros(food) {
    if (!food) return null;

    let calories100g = usdaNutrientValue(food, 1008, "1008", ["energy"], "KCAL");
    const protein100g = usdaNutrientValue(food, 1003, "1003", ["protein"]);
    const carbs100g = usdaNutrientValue(food, 1005, "1005", ["carbohydrate"]);
    const fat100g = usdaNutrientValue(food, 1004, "1004", ["total lipid", "fat"]);

    const safeProtein = Number.isNaN(protein100g) ? 0 : protein100g;
    const safeCarbs = Number.isNaN(carbs100g) ? 0 : carbs100g;
    const safeFat = Number.isNaN(fat100g) ? 0 : fat100g;

    if (Number.isNaN(calories100g)) {
      calories100g = safeProtein * 4 + safeCarbs * 4 + safeFat * 9;
    }

    if (Number.isNaN(calories100g)) return null;

    return {
      calories: calories100g,
      protein: safeProtein,
      carbs: safeCarbs,
      fat: safeFat
    };
  }

  function parseProductMacros(product) {
    if (!product || !product.nutriments) return null;
    const nutriments = product.nutriments;
    const calories100g = Number(
      nutriments["energy-kcal_100g"] ||
      nutriments["energy-kcal_value"] ||
      (nutriments.energy_100g ? nutriments.energy_100g / 4.184 : NaN)
    );
    const protein100g = Number(nutriments.proteins_100g);
    const carbs100g = Number(nutriments.carbohydrates_100g);
    const fat100g = Number(nutriments.fat_100g);

    if (
      Number.isNaN(calories100g) ||
      Number.isNaN(protein100g) ||
      Number.isNaN(carbs100g) ||
      Number.isNaN(fat100g)
    ) {
      return null;
    }

    return {
      calories: calories100g,
      protein: protein100g,
      carbs: carbs100g,
      fat: fat100g
    };
  }

  async function lookupOpenFoodFactsMacros(name, servingGrams) {
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      name
    )}&search_simple=1&action=process&json=1&page_size=10`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`OpenFoodFacts lookup failed (${response.status})`);
    }
    const data = await response.json();
    const products = Array.isArray(data.products) ? data.products : [];

    for (const product of products) {
      const macros100g = parseProductMacros(product);
      if (!macros100g) continue;
      return {
        source: `OpenFoodFacts (${product.product_name || "best match"})`,
        macros: scaleFoodMacros(macros100g, servingGrams)
      };
    }

    throw new Error("No nutrition data found for this food name");
  }

  async function lookupUsdaFoodMacros(name, servingGrams) {
    const apiKey = getUsdaApiKey();
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: name,
          pageSize: 25,
          dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)", "Branded"],
          requireAllWords: false
        })
      }
    );

    if (!response.ok) {
      throw new Error(`USDA search failed (${response.status})`);
    }

    const data = await response.json();
    const foods = Array.isArray(data.foods) ? data.foods : [];

    for (const food of foods) {
      const macros100g = parseUsdaFoodMacros(food);
      if (!macros100g) continue;
      return {
        source: `USDA FoodData Central (${food.description || "best match"})`,
        macros: scaleFoodMacros(macros100g, servingGrams)
      };
    }

    throw new Error("USDA did not return complete macro data for this query");
  }

  async function lookupFoodMacros(name, servingGrams) {
    const curated = findCuratedFoodByName(name);
    if (curated) {
      return {
        source: `Curated library (${curated.name})`,
        macros: scaledMacros(curated, servingGrams)
      };
    }
    try {
      return await lookupUsdaFoodMacros(name, servingGrams);
    } catch (_err) {
      return lookupOpenFoodFactsMacros(name, servingGrams);
    }
  }

  function parseQuantityToGrams(quantityText) {
    const q = String(quantityText || "").toLowerCase();
    const match = q.match(/(\d+(?:\.\d+)?)\s*(g|gram|grams|ml|milliliter|milliliters)/);
    if (!match) return null;
    const value = Number(match[1]);
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.round(value);
  }

  async function fetchFoodSuggestions(query) {
    const normalized = String(query || "").trim();
    if (normalized.length < 2) return [];
    const key = normalized.toLowerCase();
    const suggestions = [];
    const seen = new Set();

    const addSuggestion = (item) => {
      const dedupeKey = String(item.name || item.label || "").toLowerCase();
      if (!dedupeKey || seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      suggestions.push(item);
    };

    CURATED_FOODS.forEach((food) => {
      if (food.name.toLowerCase().includes(key)) {
        addSuggestion({
          name: food.name,
          label: food.name,
          meta: "Curated",
          servingHintGrams: 100,
          macros100g: food.macros100g
        });
      }
    });

    try {
      const offResp = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(normalized)}&search_simple=1&action=process&json=1&page_size=8`
      );
      if (offResp.ok) {
        const offData = await offResp.json();
        const products = Array.isArray(offData.products) ? offData.products : [];
        products.forEach((p) => {
          const name = String(p.product_name || "").trim();
          if (!name) return;
          const brand = String(p.brands || "").trim();
          const qty = String(p.quantity || "").trim();
          const macros100g = parseProductMacros(p);
          addSuggestion({
            name: `${name}${brand ? ` (${brand})` : ""}`,
            label: `${name}${qty ? ` ${qty}` : ""}${brand ? ` (${brand})` : ""}`,
            meta: "OpenFoodFacts",
            servingHintGrams: parseQuantityToGrams(qty),
            macros100g: macros100g || null
          });
        });
      }
    } catch (_err) {
      // Ignore suggestion errors and keep remaining providers.
    }

    try {
      const usdaResp = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(getUsdaApiKey())}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: normalized,
            pageSize: 8,
            dataType: ["Foundation", "SR Legacy", "Survey (FNDDS)", "Branded"],
            requireAllWords: false
          })
        }
      );
      if (usdaResp.ok) {
        const usdaData = await usdaResp.json();
        const foods = Array.isArray(usdaData.foods) ? usdaData.foods : [];
        foods.forEach((food) => {
          const desc = String(food.description || "").trim();
          if (!desc) return;
          addSuggestion({
            name: desc,
            label: desc,
            meta: "USDA",
            servingHintGrams: 100,
            macros100g: parseUsdaFoodMacros(food)
          });
        });
      }
    } catch (_err) {
      // Ignore suggestion errors and keep current list.
    }

    return suggestions.slice(0, 12);
  }

  function initTrackerPage() {
    const profile = getProfile();
    const dateInput = document.getElementById("trackerDate");
    const targetForm = document.getElementById("targetForm");
    const mealForm = document.getElementById("mealForm");
    const fluidForm = document.getElementById("fluidForm");
    const mealList = document.getElementById("mealList");
    const macroSummary = document.getElementById("macroSummary");
    const foodLookupStatus = document.getElementById("foodLookupStatus");
    const options = document.getElementById("oncologyFoodOptions");
    const quickAddFoods = document.getElementById("quickAddFoods");
    const autofillFoodButton = document.getElementById("autofillFood");
    const usdaApiKeyInput = document.getElementById("usdaApiKey");
    const saveUsdaApiKeyButton = document.getElementById("saveUsdaApiKey");
    const mealNameInput = document.getElementById("mealName");
    const mealServingInput = document.getElementById("mealServingGrams");
    const mealCaloriesInput = document.getElementById("mealCalories");
    const mealProteinInput = document.getElementById("mealProtein");
    const mealCarbsInput = document.getElementById("mealCarbs");
    const mealFatInput = document.getElementById("mealFat");
    const targetFluidsInput = document.getElementById("targetFluidsMl");
    const fluidIntakeInput = document.getElementById("fluidIntakeMl");
    const foodSuggestions = document.getElementById("foodSuggestions");

    if (!dateInput || !targetForm || !mealForm || !mealList || !macroSummary || !options || !quickAddFoods || !autofillFoodButton || !mealNameInput || !mealServingInput || !mealCaloriesInput || !mealProteinInput || !mealCarbsInput || !mealFatInput || !targetFluidsInput || !fluidIntakeInput || !fluidForm) {
      return;
    }

    dateInput.value = isoToday();
    syncUsdaApiKeyInput();

    if (saveUsdaApiKeyButton && usdaApiKeyInput) {
      saveUsdaApiKeyButton.addEventListener("click", () => {
        const value = usdaApiKeyInput.value.trim();
        if (!value) {
          localStorage.removeItem(viewerScopedKey(USDA_API_KEY_STORAGE_KEY));
          setUsdaKeyStatus("USDA key cleared. Using DEMO_KEY (lower limits).");
          return;
        }
        localStorage.setItem(viewerScopedKey(USDA_API_KEY_STORAGE_KEY), value);
        setUsdaKeyStatus("USDA API key saved.");
      });
    }

    CURATED_FOODS.forEach((f) => {
      const option = document.createElement("option");
      option.value = f.name;
      options.appendChild(option);
    });

    quickAddFoods.innerHTML = CURATED_FOODS.slice(0, 5)
      .map((f) => `<button type="button" data-food="${f.name}">+ ${f.name.split("(")[0].trim()}</button>`)
      .join(" ");

    let activeSuggestions = [];
    let suggestionsToken = 0;
    let suggestionsTimer = null;

    function hideSuggestions() {
      if (!foodSuggestions) return;
      foodSuggestions.classList.add("hidden");
      foodSuggestions.innerHTML = "";
      activeSuggestions = [];
    }

    function renderSuggestions() {
      if (!foodSuggestions) return;
      foodSuggestions.innerHTML = "";
      if (!activeSuggestions.length) {
        hideSuggestions();
        return;
      }
      activeSuggestions.forEach((item, idx) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "food-suggestion-item";
        button.setAttribute("data-suggestion-index", String(idx));
        button.innerHTML = `<span>${item.label}</span><span class="food-suggestion-meta">${item.meta}</span>`;
        foodSuggestions.appendChild(button);
      });
      foodSuggestions.classList.remove("hidden");
    }

    async function updateSuggestions() {
      const query = mealNameInput.value.trim();
      if (query.length < 2) {
        hideSuggestions();
        return;
      }
      const token = ++suggestionsToken;
      const results = await fetchFoodSuggestions(query);
      if (token !== suggestionsToken) return;
      activeSuggestions = results;
      renderSuggestions();
    }

    mealNameInput.addEventListener("input", () => {
      if (suggestionsTimer) window.clearTimeout(suggestionsTimer);
      suggestionsTimer = window.setTimeout(updateSuggestions, 300);
    });
    mealNameInput.addEventListener("focus", () => {
      if (mealNameInput.value.trim().length >= 2) updateSuggestions();
    });
    mealNameInput.addEventListener("blur", () => {
      window.setTimeout(() => hideSuggestions(), 120);
    });

    if (foodSuggestions) {
      foodSuggestions.addEventListener("mousedown", (e) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const button = target.closest(".food-suggestion-item");
        if (!button) return;
        e.preventDefault();
        const idx = Number(button.getAttribute("data-suggestion-index"));
        const suggestion = activeSuggestions[idx];
        if (!suggestion) return;
        mealNameInput.value = suggestion.name;
        if (suggestion.servingHintGrams && !Number.isNaN(Number(suggestion.servingHintGrams))) {
          mealServingInput.value = String(suggestion.servingHintGrams);
        }
        if (suggestion.macros100g) {
          const macros = scaleFoodMacros(suggestion.macros100g, Number(mealServingInput.value || 100));
          mealCaloriesInput.value = macros.calories;
          mealProteinInput.value = macros.protein;
          mealCarbsInput.value = macros.carbs;
          mealFatInput.value = macros.fat;
          if (foodLookupStatus) {
            foodLookupStatus.textContent = `Autofilled from ${suggestion.meta} (${suggestion.label}).`;
          }
        } else {
          autofillFoodButton.click();
        }
        hideSuggestions();
      });
    }

    function render() {
      const day = readDay(dateInput.value || isoToday());
      const recommendedTargets = calculateRecommendedTargets(profile);
      if (!day.targetsManual) {
        day.targets = recommendedTargets;
        writeDay(dateInput.value || isoToday(), day);
      }
      document.getElementById("targetCalories").value = day.targets.calories;
      document.getElementById("targetProtein").value = day.targets.protein;
      document.getElementById("targetCarbs").value = day.targets.carbs;
      document.getElementById("targetFat").value = day.targets.fat;
      targetFluidsInput.value = Number(day.targets.fluidsMl || 0);
      fluidIntakeInput.value = Number(day.fluidsMl || 0);

      const sum = totals(day.meals);
      macroSummary.innerHTML = `
        <p>Calories: <strong>${roundOne(sum.calories)} / ${day.targets.calories}</strong></p>
        <p>Protein: <strong>${roundTwo(sum.protein)} / ${day.targets.protein} g</strong></p>
        <p>Carbs: <strong>${roundTwo(sum.carbs)} / ${day.targets.carbs} g</strong></p>
        <p>Fat: <strong>${roundTwo(sum.fat)} / ${day.targets.fat} g</strong></p>
        <p>Fluids: <strong>${Number(day.fluidsMl || 0)} / ${Number(day.targets.fluidsMl || 0)} mL</strong></p>`;

      mealList.innerHTML = "";
      if (!day.meals.length) {
        mealList.innerHTML = "<p class='muted'>No entries for selected day yet.</p>";
        return;
      }
      day.meals.forEach((meal, idx) => {
        const row = document.createElement("div");
        row.className = "meal";
        row.innerHTML = `<div><strong>${meal.name}</strong><br><span class="muted">${meal.calories} kcal | P ${meal.protein}g | C ${meal.carbs}g | F ${meal.fat}g | ${meal.servingGrams}g</span></div>
          <button type="button" class="danger" data-remove="${idx}">Remove</button>`;
        mealList.appendChild(row);
      });
    }

    dateInput.addEventListener("change", render);

    targetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedDate = dateInput.value || isoToday();
      const day = readDay(selectedDate);
      day.targets = {
        calories: Number(document.getElementById("targetCalories").value || 0),
        protein: roundTwo(Number(document.getElementById("targetProtein").value || 0)),
        carbs: roundTwo(Number(document.getElementById("targetCarbs").value || 0)),
        fat: roundTwo(Number(document.getElementById("targetFat").value || 0)),
        fluidsMl: Math.max(0, Number(targetFluidsInput.value || 0))
      };
      day.targetsManual = true;
      writeDay(selectedDate, day);
      render();
    });

    fluidForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const day = readDay(dateInput.value || isoToday());
      day.fluidsMl = Math.max(0, Number(fluidIntakeInput.value || 0));
      writeDay(dateInput.value || isoToday(), day);
      upsertLogByDate(FLUID_INTAKE_LOG_KEY_BASE, dateInput.value || isoToday(), {
        user_id: dataOwnerId(),
        total_fluids_ml: day.fluidsMl
      });
      render();
    });

    let activeLookupToken = 0;
    let lastAutofillKey = "";
    let autoFillTimer = null;

    async function performAutofill(isAutoTriggered) {
      const serving = Number(mealServingInput.value || 100);
      const name = mealNameInput.value.trim();
      if (!name || serving <= 0) {
        if (!isAutoTriggered && foodLookupStatus) {
          foodLookupStatus.textContent = "Enter a food name and serving size.";
        }
        return;
      }

      const queryKey = `${name.toLowerCase()}|${serving}`;
      if (isAutoTriggered && queryKey === lastAutofillKey) return;
      lastAutofillKey = queryKey;

      const lookupToken = ++activeLookupToken;
      autofillFoodButton.disabled = true;
      if (foodLookupStatus) {
        foodLookupStatus.textContent = "Looking up food macros...";
      }
      try {
        const result = await lookupFoodMacros(name, serving);
        if (lookupToken !== activeLookupToken) return;
        mealCaloriesInput.value = result.macros.calories;
        mealProteinInput.value = result.macros.protein;
        mealCarbsInput.value = result.macros.carbs;
        mealFatInput.value = result.macros.fat;
        if (foodLookupStatus) {
          foodLookupStatus.textContent = `Autofilled from ${result.source}.`;
        }
      } catch (err) {
        if (lookupToken !== activeLookupToken) return;
        if (foodLookupStatus) {
          foodLookupStatus.textContent = err instanceof Error
            ? `${err.message}. Try a more specific name (e.g., "ribeye steak cooked").`
            : "Food lookup failed. Try a more specific food name.";
        }
      } finally {
        if (lookupToken === activeLookupToken) {
          autofillFoodButton.disabled = false;
        }
      }
    }

    autofillFoodButton.addEventListener("click", () => {
      performAutofill(false);
    });

    function scheduleAutoFill() {
      if (autoFillTimer) window.clearTimeout(autoFillTimer);
      autoFillTimer = window.setTimeout(() => {
        performAutofill(true);
      }, 500);
    }

    mealNameInput.addEventListener("input", scheduleAutoFill);
    mealServingInput.addEventListener("input", scheduleAutoFill);

    quickAddFoods.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const food = target.getAttribute("data-food");
      if (!food) return;
      document.getElementById("mealName").value = food;
      document.getElementById("mealServingGrams").value = 100;
      autofillFoodButton.click();
    });

    mealForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const selectedDate = dateInput.value || isoToday();
      const day = readDay(dateInput.value || isoToday());
      day.meals.push({
        name: document.getElementById("mealName").value.trim(),
        servingGrams: Number(document.getElementById("mealServingGrams").value || 100),
        calories: Number(document.getElementById("mealCalories").value || 0),
        protein: roundTwo(Number(document.getElementById("mealProtein").value || 0)),
        carbs: roundTwo(Number(document.getElementById("mealCarbs").value || 0)),
        fat: roundTwo(Number(document.getElementById("mealFat").value || 0))
      });
      writeDay(selectedDate, day);
      const sum = totals(day.meals);
      upsertLogByDate(NUTRITION_LOG_KEY_BASE, selectedDate, {
        user_id: dataOwnerId(),
        calories_kcal: roundOne(sum.calories),
        protein_g: roundTwo(sum.protein),
        carbs_g: roundTwo(sum.carbs),
        fat_g: roundTwo(sum.fat),
        fluids_ml: Number(day.fluidsMl || 0)
      });
      mealForm.reset();
      dateInput.value = selectedDate;
      document.getElementById("mealServingGrams").value = 100;
      render();
    });

    mealList.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const idx = target.getAttribute("data-remove");
      if (idx == null) return;
      const selectedDate = dateInput.value || isoToday();
      const day = readDay(selectedDate);
      day.meals.splice(Number(idx), 1);
      writeDay(selectedDate, day);
      const sum = totals(day.meals);
      upsertLogByDate(NUTRITION_LOG_KEY_BASE, selectedDate, {
        user_id: dataOwnerId(),
        calories_kcal: roundOne(sum.calories),
        protein_g: roundTwo(sum.protein),
        carbs_g: roundTwo(sum.carbs),
        fat_g: roundTwo(sum.fat),
        fluids_ml: Number(day.fluidsMl || 0)
      });
      render();
    });

    const clearEntriesButton = document.getElementById("clearEntries");
    if (clearEntriesButton) {
      clearEntriesButton.addEventListener("click", () => {
        const selectedDate = dateInput.value || isoToday();
        const day = readDay(selectedDate);
        day.meals = [];
        writeDay(selectedDate, day);
        upsertLogByDate(NUTRITION_LOG_KEY_BASE, selectedDate, {
          user_id: dataOwnerId(),
          calories_kcal: 0,
          protein_g: 0,
          carbs_g: 0,
          fat_g: 0,
          fluids_ml: Number(day.fluidsMl || 0)
        });
        render();
      });
    }

    render();
  }

  async function init() {
    syncSupabaseConfigInputs();
    setSupabaseConfigStatus(isSupabaseConfigured() ? "Secure auth config detected." : "No secure auth config yet.", false);
    initAuthHandlers();
    await initSupabaseAuth();
    authInitialized = true;
    renderAuthVisibility();

    if (!requireProfileGate()) return;
    if (page === "profile") initProfilePage();
    if (page === "dashboard") initDashboardPage();
    if (page === "tracker") initTrackerPage();
    if (page === "caregiver") initCaregiverPage();
  }

  init();
})();
