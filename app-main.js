(function () {
  const PROFILE_KEY_BASE = "oncoProfile";
  const PROFILE_EXISTS_KEY_BASE = "profileExists";
  const WEIGHT_HISTORY_KEY_BASE = "oncoNutritionWeightHistory:v1";
  const DAY_LOG_KEY_BASE = "oncoNutritionLog";
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

  function scopedKey(base) {
    const uid = currentUser && currentUser.id ? currentUser.id : "guest";
    return `${base}:${uid}`;
  }

  function profileExists() {
    return localStorage.getItem(scopedKey(PROFILE_EXISTS_KEY_BASE)) === "true";
  }

  function getProfile() {
    const raw = localStorage.getItem(scopedKey(PROFILE_KEY_BASE));
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(scopedKey(PROFILE_KEY_BASE), JSON.stringify(profile));
    localStorage.setItem(scopedKey(PROFILE_EXISTS_KEY_BASE), "true");
  }

  function storageKeyForDate(date) {
    return `${scopedKey(DAY_LOG_KEY_BASE)}:${date}`;
  }

  function getUsdaApiKey() {
    const saved = localStorage.getItem(scopedKey(USDA_API_KEY_STORAGE_KEY));
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
    const saved = localStorage.getItem(scopedKey(USDA_API_KEY_STORAGE_KEY)) || "";
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

    const authUserBadge = document.getElementById("authUserBadge");
    const logoutButton = document.getElementById("logoutButton");
    const authModeStatus = document.getElementById("authModeStatus");
    const authFormsWrap = document.getElementById("authFormsWrap");

    if (authUserBadge) {
      authUserBadge.textContent = loggedIn ? currentUser.email : "Guest mode";
    }
    if (logoutButton) {
      logoutButton.classList.toggle("hidden", !loggedIn);
    }
    if (authFormsWrap) {
      authFormsWrap.classList.toggle("hidden", loggedIn || !secureAuthReady);
    }
    if (authModeStatus) {
      if (loggedIn) {
        authModeStatus.textContent = "Authenticated session active.";
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

  function readDay(date) {
    const raw = localStorage.getItem(storageKeyForDate(date));
    if (!raw) {
      return {
        targets: { calories: 2000, protein: 90, carbs: 230, fat: 70 },
        targetsManual: false,
        meals: [],
        symptoms: []
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        targets: parsed.targets || { calories: 2000, protein: 90, carbs: 230, fat: 70 },
        targetsManual: Boolean(parsed.targetsManual),
        meals: Array.isArray(parsed.meals) ? parsed.meals : [],
        symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : []
      };
    } catch (_err) {
      return {
        targets: { calories: 2000, protein: 90, carbs: 230, fat: 70 },
        targetsManual: false,
        meals: [],
        symptoms: []
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
    let risk = 0;
    if ((profile.symptoms || []).includes("appetite_loss")) risk += 1;
    if ((profile.appetite || "normal") === "reduced") risk += 1;
    if ((profile.appetite || "normal") === "very_low") risk += 2;
    if ((profile.weightLoss || "none") === "moderate") risk += 1;
    if ((profile.weightLoss || "none") === "severe") risk += 2;
    if (targets.calories > 0 && sum.calories < targets.calories * 0.75) risk += 1;
    if (targets.protein > 0 && sum.protein < targets.protein * 0.75) risk += 1;

    if (risk >= 4) return "High risk";
    if (risk >= 2) return "Moderate risk";
    return "Low risk";
  }

  function statusFromScore(score, risk) {
    if (score < 50 || risk === "High risk") return "CRITICAL";
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

  function sourceLinkHtml(sourceId) {
    const source = (window.SOURCES_REGISTRY || {})[sourceId];
    if (!source) return "";
    return `<li><a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.title}</a> <span class="muted">(${source.evidenceType}, reviewed ${source.lastReviewed})</span></li>`;
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
      const card = document.createElement("article");
      card.className = "rec-card";
      card.innerHTML = `<h3>${rec.title}</h3>
        <p>${rec.patientTextShort || rec.patientText || ""}</p>
        <div class="rec-meta">
          <span class="rec-chip strength">${(rec.evidenceTags || ["Guideline"]).join(", ")}</span>
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
      details.innerHTML = `<summary>Sources</summary><ul class="sources">${rec.sourceIds.map(sourceLinkHtml).join("")}</ul>`;
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
          const card = document.createElement("article");
          card.className = "rec-card";
          card.innerHTML = `<h3>${rec.title}</h3>
            <p>${rec.patientTextShort || rec.patientText || ""}</p>
            <div class="rec-meta"><span class="rec-chip strength">${(rec.evidenceTags || ["Guideline"]).join(", ")}</span></div>
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
          src.innerHTML = `<summary>Sources</summary><ul class="sources">${rec.sourceIds.map(sourceLinkHtml).join("")}</ul>`;
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
    if (!sorted.length) {
      summaryNode.textContent = "No weight history yet.";
      chart.innerHTML = "";
      return;
    }

    const values = sorted.map((x) => Number(x.weightKg));
    const minW = Math.min.apply(null, values);
    const maxW = Math.max.apply(null, values);
    const span = Math.max(1, maxW - minW);
    const points = sorted.map((entry, idx) => {
      const x = 40 + (idx / Math.max(1, sorted.length - 1)) * 520;
      const y = 180 - ((entry.weightKg - minW) / span) * 140;
      return `${x},${y}`;
    });

    const latest = sorted[sorted.length - 1];
    const first = sorted[0];
    const delta = roundOne(latest.weightKg - first.weightKg);
    summaryNode.textContent = `Latest ${latest.weightKg} kg (${latest.date}) | Change ${delta >= 0 ? "+" : ""}${delta} kg`;
    chart.innerHTML = `<rect x="0" y="0" width="600" height="220" fill="#f8fafb"></rect>
      <polyline points="${points.join(" ")}" fill="none" stroke="#2cb1a6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>`;
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
      document.getElementById("profileActivity").value = String(saved.activityLevel || "1.2");
      document.getElementById("profileWeightLoss").value = saved.weightLoss || "none";
      document.getElementById("profileAppetite").value = saved.appetite || "normal";
      cancerSelect.value = saved.cancerType || TOP_CANCERS[0];
      document.getElementById("profileTreatmentType").value = saved.treatmentType || "chemotherapy";
      document.getElementById("profileTreatmentMode").value = saved.treatmentMode || "on";
      if (dialysisField) {
        dialysisField.classList.toggle("hidden", cancerSelect.value !== "Kidney and Renal Pelvis Cancer");
      }
      const sym = new Set(saved.symptoms || []);
      symptomInputs.forEach((input) => {
        input.checked = sym.has(input.value);
      });
      if (saved.dialysisStatus) {
        const radio = document.querySelector(`input[name="dialysisStatus"][value="${saved.dialysisStatus}"]`);
        if (radio) radio.checked = true;
      }
    }

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

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const symptoms = [];
      symptomInputs.forEach((input) => {
        if (input.checked) symptoms.push(input.value);
      });
      const selectedDialysis = document.querySelector('input[name="dialysisStatus"]:checked');
      const profile = {
        age: Number(document.getElementById("profileAge").value),
        sex: document.getElementById("profileSex").value,
        heightCm: Number(document.getElementById("profileHeightCm").value),
        weight: Number(document.getElementById("profileWeightKg").value),
        activityLevel: Number(document.getElementById("profileActivity").value),
        weightLoss: document.getElementById("profileWeightLoss").value,
        appetite: document.getElementById("profileAppetite").value,
        cancerType: cancerSelect.value,
        treatmentType: document.getElementById("profileTreatmentType").value,
        treatmentMode: document.getElementById("profileTreatmentMode").value,
        symptoms: symptoms,
        dialysisStatus: selectedDialysis ? selectedDialysis.value : "off"
      };
      saveProfile(profile);
      const profileStatus = document.getElementById("profileStatus");
      if (profileStatus) {
        profileStatus.textContent = "Profile saved. Redirecting to dashboard...";
      }
      window.setTimeout(() => {
        window.location.assign("./index.html");
      }, 250);
    });
  }

  function renderRings(sum, targets) {
    const node = document.getElementById("macroRings");
    if (!node) return;
    node.innerHTML = "";

    [
      { label: "Calories", consumed: sum.calories, target: targets.calories, unit: "kcal" },
      { label: "Protein", consumed: sum.protein, target: targets.protein, unit: "g" },
      { label: "Carbs", consumed: sum.carbs, target: targets.carbs, unit: "g" },
      { label: "Fat", consumed: sum.fat, target: targets.fat, unit: "g" }
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
      symptoms: ["none"],
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
      const profileSummaryNode = document.getElementById("profileSummaryCard");

      if (nutritionScoreNode) {
        nutritionScoreNode.innerHTML = `<p><strong>${score}/100</strong></p><p class="muted">Daily nutrition score</p>`;
      }
      if (malnutritionRiskNode) {
        malnutritionRiskNode.innerHTML = `<p><strong>${risk}</strong></p>`;
      }
      if (profileSummaryNode) {
        const symptoms = (profile.symptoms || []).filter((value) => value !== "none");
        const symptomText = symptoms.length ? symptoms.map(symptomLabel).join(", ") : "No particular symptoms";
        const weightText = typeof profile.weight === "number" ? `${profile.weight} kg` : "Not set";
        profileSummaryNode.innerHTML = `
          <p>Treatment: <strong>${profile.treatmentType} (${profile.treatmentMode})</strong></p>
          <p>Weight: <strong>${weightText}</strong></p>
          <p>Weight change: <strong>${weightLossLabel(profile.weightLoss || "none")}</strong></p>
          <p>Appetite: <strong>${appetiteLabel(profile.appetite || "normal")}</strong></p>
          <p>Symptoms: <strong>${symptomText}</strong></p>
          ${hasProfile ? "" : "<p class=\"muted\">Profile not complete yet. You can still use dashboard and tracker.</p>"}`;
      }

      renderRings(sum, day.targets);

      const actions = [];
      if (sum.protein < day.targets.protein * 0.8) actions.push("Increase protein at next meal (eggs, yogurt, shake, tofu).");
      if (sum.calories < day.targets.calories * 0.8) actions.push("Add one calorie-dense snack in the next 4 hours.");
      if ((profile.appetite || "normal") !== "normal") actions.push("Use 5-6 smaller meals and include liquid calories between meals.");
      if ((profile.weightLoss || "none") === "moderate" || (profile.weightLoss || "none") === "severe") {
        actions.push("Escalate to your care team dietitian this week due to meaningful recent weight loss.");
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
    return { calories: 2000, protein: 90, carbs: 230, fat: 70 };
  }

  function calculateRecommendedTargets(profile) {
    if (!profile) return defaultTargets();
    const age = Number(profile.age || 0);
    const weight = Number(profile.weight || 0);
    const heightCm = Number(profile.heightCm || 0);
    const activity = Number(profile.activityLevel || 1.2);

    if (age <= 0 || weight <= 0 || heightCm <= 0) return defaultTargets();

    const isMale = String(profile.sex || "").toLowerCase() === "male";
    let bmr = 10 * weight + 6.25 * heightCm - 5 * age + (isMale ? 5 : -161);
    if (!Number.isFinite(bmr) || bmr <= 0) bmr = 1400;

    const treatmentMode = String(profile.treatmentMode || "normal");
    const treatmentFactor = treatmentMode === "on" ? 1.15 : treatmentMode === "off" ? 1.05 : 1.0;
    const calories = Math.round(Math.max(1200, Math.min(4200, bmr * activity * treatmentFactor)));

    let proteinPerKg = 1.2;
    if (profile.weightLoss === "moderate") proteinPerKg = 1.4;
    if (profile.weightLoss === "severe") proteinPerKg = 1.6;
    if (profile.appetite === "reduced") proteinPerKg = Math.max(proteinPerKg, 1.3);
    if (profile.appetite === "very_low") proteinPerKg = Math.max(proteinPerKg, 1.5);
    const protein = roundTwo(Math.max(65, weight * proteinPerKg));

    const fatRatio = profile.appetite === "very_low" ? 0.35 : 0.30;
    const fat = roundTwo(Math.max(35, (calories * fatRatio) / 9));
    const carbs = roundTwo(Math.max(50, (calories - protein * 4 - fat * 9) / 4));

    return { calories, protein, carbs, fat };
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
    const foodSuggestions = document.getElementById("foodSuggestions");

    if (!dateInput || !targetForm || !mealForm || !mealList || !macroSummary || !options || !quickAddFoods || !autofillFoodButton || !mealNameInput || !mealServingInput || !mealCaloriesInput || !mealProteinInput || !mealCarbsInput || !mealFatInput) {
      return;
    }

    dateInput.value = isoToday();
    syncUsdaApiKeyInput();

    if (saveUsdaApiKeyButton && usdaApiKeyInput) {
      saveUsdaApiKeyButton.addEventListener("click", () => {
        const value = usdaApiKeyInput.value.trim();
        if (!value) {
          localStorage.removeItem(scopedKey(USDA_API_KEY_STORAGE_KEY));
          setUsdaKeyStatus("USDA key cleared. Using DEMO_KEY (lower limits).");
          return;
        }
        localStorage.setItem(scopedKey(USDA_API_KEY_STORAGE_KEY), value);
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

      const sum = totals(day.meals);
      macroSummary.innerHTML = `
        <p>Calories: <strong>${roundOne(sum.calories)} / ${day.targets.calories}</strong></p>
        <p>Protein: <strong>${roundTwo(sum.protein)} / ${day.targets.protein} g</strong></p>
        <p>Carbs: <strong>${roundTwo(sum.carbs)} / ${day.targets.carbs} g</strong></p>
        <p>Fat: <strong>${roundTwo(sum.fat)} / ${day.targets.fat} g</strong></p>`;

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
      const day = readDay(dateInput.value || isoToday());
      day.targets = {
        calories: Number(document.getElementById("targetCalories").value || 0),
        protein: roundTwo(Number(document.getElementById("targetProtein").value || 0)),
        carbs: roundTwo(Number(document.getElementById("targetCarbs").value || 0)),
        fat: roundTwo(Number(document.getElementById("targetFat").value || 0))
      };
      day.targetsManual = true;
      writeDay(dateInput.value, day);
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
      const day = readDay(dateInput.value || isoToday());
      day.meals.push({
        name: document.getElementById("mealName").value.trim(),
        servingGrams: Number(document.getElementById("mealServingGrams").value || 100),
        calories: Number(document.getElementById("mealCalories").value || 0),
        protein: roundTwo(Number(document.getElementById("mealProtein").value || 0)),
        carbs: roundTwo(Number(document.getElementById("mealCarbs").value || 0)),
        fat: roundTwo(Number(document.getElementById("mealFat").value || 0))
      });
      writeDay(dateInput.value, day);
      mealForm.reset();
      document.getElementById("mealServingGrams").value = 100;
      render();
    });

    mealList.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const idx = target.getAttribute("data-remove");
      if (idx == null) return;
      const day = readDay(dateInput.value || isoToday());
      day.meals.splice(Number(idx), 1);
      writeDay(dateInput.value, day);
      render();
    });

    const clearEntriesButton = document.getElementById("clearEntries");
    if (clearEntriesButton) {
      clearEntriesButton.addEventListener("click", () => {
        const day = readDay(dateInput.value || isoToday());
        day.meals = [];
        writeDay(dateInput.value, day);
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
  }

  init();
})();
