(function () {
  const PROFILE_KEY_BASE = "oncoProfile";
  const PROFILE_EXISTS_KEY_BASE = "profileExists";
  const WEIGHT_HISTORY_KEY_BASE = "oncoNutritionWeightHistory:v1";
  const DAY_LOG_KEY_BASE = "oncoNutritionLog";
  const SUPABASE_URL_STORAGE_KEY = "oncoNutritionSupabaseUrl:v1";
  const SUPABASE_ANON_KEY_STORAGE_KEY = "oncoNutritionSupabaseAnonKey:v1";

  const CURATED_FOODS = [
    { name: "Egg (fully cooked)", macros100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 } },
    { name: "Chicken breast (cooked)", macros100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 } },
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
        meals: [],
        symptoms: []
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        targets: parsed.targets || { calories: 2000, protein: 90, carbs: 230, fat: 70 },
        meals: Array.isArray(parsed.meals) ? parsed.meals : [],
        symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : []
      };
    } catch (_err) {
      return {
        targets: { calories: 2000, protein: 90, carbs: 230, fat: 70 },
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

  function getRecommendations(profile) {
    const treatmentMode = profile.treatmentMode || "normal";
    const cancer = profile.cancerType || TOP_CANCERS[0];
    const recs = [...(BASE_RECOMMENDATIONS[treatmentMode] || BASE_RECOMMENDATIONS.normal)];
    recs.push(...(CANCER_OVERRIDES[cancer] || []));
    if (cancer === "Kidney and Renal Pelvis Cancer") {
      recs.push(KIDNEY_DIALYSIS[profile.dialysisStatus || "off"]);
    }
    return recs;
  }

  function renderEvidenceSources(sourceIds) {
    const sourceList = document.getElementById("sourceList");
    if (!sourceList) return;
    sourceList.innerHTML = "";
    sourceIds.forEach((id) => {
      const source = APP_SOURCES[id];
      if (!source) return;
      const li = document.createElement("li");
      const backup = source.backupUrl
        ? ` | <a href="${source.backupUrl}" target="_blank" rel="noopener noreferrer">backup</a>`
        : "";
      li.innerHTML = `<strong>${source.title}</strong> (${source.org}, ${source.type}) - <a href="${source.url}" target="_blank" rel="noopener noreferrer">link</a>${backup}`;
      sourceList.appendChild(li);
    });
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
    if (!recList) return;
    const recs = getRecommendations(profile);
    const sourceIds = new Set(["nciStats"]);
    recList.innerHTML = "";

    if (recMetaNode) {
      recMetaNode.textContent = `Cancer: ${profile.cancerType} | Treatment mode: ${profile.treatmentMode}`;
    }

    const high = [];
    const emerging = [];

    recs.forEach((rec) => {
      (rec.sourceIds || []).forEach((id) => sourceIds.add(id));
      const meta = recMeta(rec);
      const card = document.createElement("article");
      card.className = "rec-card";
      card.innerHTML = `<h3>${rec.title}</h3>
        <div class="rec-meta">
          <span class="rec-chip strength">${meta.evidenceStrength}</span>
          <span class="rec-chip confidence ${meta.confidence === "High confidence" ? "high" : meta.confidence === "Emerging evidence" ? "emerging" : "moderate"}">${meta.confidence}</span>
        </div>`;
      const ul = document.createElement("ul");
      rec.bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        ul.appendChild(li);
      });
      card.appendChild(ul);
      if (meta.confidence === "Emerging evidence") emerging.push(card);
      else high.push(card);
    });

    if (high.length) {
      const sec = document.createElement("section");
      sec.className = "recommendation-group";
      sec.innerHTML = "<h4>High-confidence guidance</h4>";
      high.forEach((c) => sec.appendChild(c));
      recList.appendChild(sec);
    }

    if (emerging.length) {
      const sec = document.createElement("section");
      sec.className = "recommendation-group";
      sec.innerHTML = "<h4>Emerging evidence to discuss with care team</h4>";
      emerging.forEach((c) => sec.appendChild(c));
      recList.appendChild(sec);
    }

    renderEvidenceSources(Array.from(sourceIds));
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
    if (page !== "profile" && !profileExists()) {
      window.location.replace("./profile.html");
      return false;
    }
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
      document.querySelectorAll('#symptomForm input[type="checkbox"]').forEach((input) => {
        input.checked = sym.has(input.value);
      });
      if (saved.dialysisStatus) {
        const radio = document.querySelector(`input[name="dialysisStatus"][value="${saved.dialysisStatus}"]`);
        if (radio) radio.checked = true;
      }
    }

    const weightHistory = loadWeightHistory();
    renderWeightChart(weightHistory, "weightTrendSummary", "weightChart");

    const weightDate = document.getElementById("weightDate");
    const weightValue = document.getElementById("weightValueKg");
    if (weightDate) weightDate.value = isoToday();

    const saveWeightEntry = document.getElementById("saveWeightEntry");
    if (saveWeightEntry) {
      saveWeightEntry.addEventListener("click", () => {
        const date = weightDate ? weightDate.value : "";
        const weightKg = roundOne(Number(weightValue ? weightValue.value : 0));
        if (!date || weightKg <= 0) return;
        const existing = weightHistory.find((x) => x.date === date);
        if (existing) existing.weightKg = weightKg;
        else weightHistory.push({ date, weightKg });
        saveWeightHistory(weightHistory);
        renderWeightChart(weightHistory, "weightTrendSummary", "weightChart");
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const symptoms = [];
      document.querySelectorAll('#symptomForm input[type="checkbox"]').forEach((input) => {
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

  function weightLossLabel(value) {
    if (value === "mild") return "Up to 5%";
    if (value === "moderate") return "5-10%";
    if (value === "severe") return "More than 10%";
    return "None";
  }

  function initDashboardPage() {
    const profile = getProfile();
    if (!profile) return;

    const dateInput = document.getElementById("dashboardDate");
    if (!dateInput) return;
    dateInput.value = isoToday();

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
        profileSummaryNode.innerHTML = `
          <p>Treatment: <strong>${profile.treatmentType} (${profile.treatmentMode})</strong></p>
          <p>Weight: <strong>${profile.weight} kg</strong></p>
          <p>Weight change: <strong>${weightLossLabel(profile.weightLoss || "none")}</strong></p>
          <p>Appetite: <strong>${appetiteLabel(profile.appetite || "normal")}</strong></p>
          <p>Symptoms: <strong>${(profile.symptoms || []).join(", ") || "none"}</strong></p>`;
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

  function initTrackerPage() {
    const dateInput = document.getElementById("trackerDate");
    const targetForm = document.getElementById("targetForm");
    const mealForm = document.getElementById("mealForm");
    const mealList = document.getElementById("mealList");
    const macroSummary = document.getElementById("macroSummary");
    const foodLookupStatus = document.getElementById("foodLookupStatus");
    const options = document.getElementById("oncologyFoodOptions");
    const quickAddFoods = document.getElementById("quickAddFoods");
    const autofillFoodButton = document.getElementById("autofillFood");

    if (!dateInput || !targetForm || !mealForm || !mealList || !macroSummary || !options || !quickAddFoods || !autofillFoodButton) {
      return;
    }

    dateInput.value = isoToday();

    CURATED_FOODS.forEach((f) => {
      const option = document.createElement("option");
      option.value = f.name;
      options.appendChild(option);
    });

    quickAddFoods.innerHTML = CURATED_FOODS.slice(0, 5)
      .map((f) => `<button type="button" data-food="${f.name}">+ ${f.name.split("(")[0].trim()}</button>`)
      .join(" ");

    function render() {
      const day = readDay(dateInput.value || isoToday());
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
      writeDay(dateInput.value, day);
      render();
    });

    autofillFoodButton.addEventListener("click", () => {
      const mealName = document.getElementById("mealName");
      const serving = Number(document.getElementById("mealServingGrams").value || 100);
      const found = CURATED_FOODS.find((f) => f.name.toLowerCase() === mealName.value.trim().toLowerCase());
      if (!found) {
        if (foodLookupStatus) foodLookupStatus.textContent = "Food not in curated library.";
        return;
      }
      const macros = scaledMacros(found, serving);
      document.getElementById("mealCalories").value = macros.calories;
      document.getElementById("mealProtein").value = macros.protein;
      document.getElementById("mealCarbs").value = macros.carbs;
      document.getElementById("mealFat").value = macros.fat;
      if (foodLookupStatus) {
        foodLookupStatus.textContent = `Autofilled from curated food library (${found.name}).`;
      }
    });

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
