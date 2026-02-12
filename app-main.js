(function () {
  const PROFILE_KEY = "oncoProfile";
  const PROFILE_EXISTS_KEY = "profileExists";
  const WEIGHT_HISTORY_KEY = "oncoNutritionWeightHistory:v1";

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

  function profileExists() {
    return localStorage.getItem(PROFILE_EXISTS_KEY) === "true";
  }

  function getProfile() {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (_err) {
      return null;
    }
  }

  function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(PROFILE_EXISTS_KEY, "true");
  }

  function storageKeyForDate(date) {
    return `oncoNutritionLog:${date}`;
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
    if (targets.calories > 0 && sum.calories < targets.calories * 0.75) risk += 1;
    if (targets.protein > 0 && sum.protein < targets.protein * 0.75) risk += 1;
    if (risk >= 2) return "Moderate risk";
    if (risk >= 3) return "High risk";
    return "Low risk";
  }

  function statusFromScore(score, risk) {
    if (score < 50 || risk === "High risk") return "CRITICAL";
    if (score < 75 || risk === "Moderate risk") return "WARNING";
    return "GOOD";
  }

  function getRecommendations(profile) {
    const chemo = profile.treatmentMode || "normal";
    const cancer = profile.cancerType || TOP_CANCERS[0];
    const recs = [...(BASE_RECOMMENDATIONS[chemo] || BASE_RECOMMENDATIONS.normal)];
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
    const raw = localStorage.getItem(WEIGHT_HISTORY_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      return [];
    }
  }

  function saveWeightHistory(items) {
    localStorage.setItem(WEIGHT_HISTORY_KEY, JSON.stringify(items));
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
    const minW = Math.min(...values);
    const maxW = Math.max(...values);
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

  function initProfilePage() {
    const form = document.getElementById("profileSetupForm");
    if (!form) return;

    const cancerSelect = document.getElementById("cancerSelect");
    TOP_CANCERS.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      cancerSelect.appendChild(option);
    });

    const dialysisField = document.getElementById("dialysisField");
    cancerSelect.addEventListener("change", () => {
      dialysisField.classList.toggle("hidden", cancerSelect.value !== "Kidney and Renal Pelvis Cancer");
    });

    const saved = getProfile();
    if (saved) {
      document.getElementById("profileAge").value = saved.age || "";
      document.getElementById("profileSex").value = saved.sex || "female";
      document.getElementById("profileHeightCm").value = saved.heightCm || "";
      document.getElementById("profileWeightKg").value = saved.weight || "";
      document.getElementById("profileActivity").value = String(saved.activityLevel || "1.2");
      cancerSelect.value = saved.cancerType || TOP_CANCERS[0];
      document.getElementById("profileTreatmentType").value = saved.treatmentType || "chemotherapy";
      document.getElementById("profileTreatmentMode").value = saved.treatmentMode || "on";
      dialysisField.classList.toggle("hidden", cancerSelect.value !== "Kidney and Renal Pelvis Cancer");
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
    weightDate.value = isoToday();
    document.getElementById("saveWeightEntry").addEventListener("click", () => {
      const date = weightDate.value;
      const weightKg = roundOne(Number(weightValue.value || 0));
      if (!date || weightKg <= 0) return;
      const existing = weightHistory.find((x) => x.date === date);
      if (existing) existing.weightKg = weightKg;
      else weightHistory.push({ date, weightKg });
      saveWeightHistory(weightHistory);
      renderWeightChart(weightHistory, "weightTrendSummary", "weightChart");
    });

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
        cancerType: cancerSelect.value,
        treatmentType: document.getElementById("profileTreatmentType").value,
        treatmentMode: document.getElementById("profileTreatmentMode").value,
        symptoms,
        dialysisStatus: selectedDialysis ? selectedDialysis.value : "off"
      };
      saveProfile(profile);
      document.getElementById("profileStatus").textContent = "Profile saved. Redirecting to dashboard...";
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

  function initDashboardPage() {
    const profile = getProfile();
    if (!profile) return;
    const dateInput = document.getElementById("dashboardDate");
    dateInput.value = isoToday();

    const render = () => {
      const day = readDay(dateInput.value || isoToday());
      const sum = totals(day.meals);
      const score = nutritionScore(sum, day.targets);
      const risk = riskLabel(profile, sum, day.targets);
      const status = statusFromScore(score, risk);

      const statusNode = document.getElementById("nutritionStatus");
      statusNode.textContent = `Status: ${status}`;
      statusNode.classList.remove("good", "warning", "critical");
      statusNode.classList.add(status === "GOOD" ? "good" : status === "WARNING" ? "warning" : "critical");

      document.getElementById("nutritionScore").innerHTML = `<p><strong>${score}/100</strong></p><p class="muted">Daily nutrition score</p>`;
      document.getElementById("malnutritionRisk").innerHTML = `<p><strong>${risk}</strong></p>`;
      document.getElementById("profileSummaryCard").innerHTML = `
        <p>Treatment: <strong>${profile.treatmentType} (${profile.treatmentMode})</strong></p>
        <p>Weight: <strong>${profile.weight} kg</strong></p>
        <p>Symptoms: <strong>${(profile.symptoms || []).join(", ") || "none"}</strong></p>`;

      renderRings(sum, day.targets);

      const actions = [];
      if (sum.protein < day.targets.protein * 0.8) actions.push("Increase protein at next meal (eggs, yogurt, shake, tofu)." );
      if (sum.calories < day.targets.calories * 0.8) actions.push("Add one calorie-dense snack in the next 4 hours.");
      if ((profile.symptoms || []).includes("appetite_loss")) actions.push("Use smaller frequent meals and liquid nutrition options.");
      if (!actions.length) actions.push("Maintain current plan and continue logging intake.");
      const todo = document.getElementById("whatToDoList");
      todo.innerHTML = "";
      actions.forEach((a) => {
        const li = document.createElement("li");
        li.textContent = a;
        todo.appendChild(li);
      });

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

    document.getElementById("autofillFood").addEventListener("click", () => {
      const mealName = document.getElementById("mealName");
      const serving = Number(document.getElementById("mealServingGrams").value || 100);
      const found = CURATED_FOODS.find((f) => f.name.toLowerCase() === mealName.value.trim().toLowerCase());
      if (!found) {
        foodLookupStatus.textContent = "Food not in curated library.";
        return;
      }
      const macros = scaledMacros(found, serving);
      document.getElementById("mealCalories").value = macros.calories;
      document.getElementById("mealProtein").value = macros.protein;
      document.getElementById("mealCarbs").value = macros.carbs;
      document.getElementById("mealFat").value = macros.fat;
      foodLookupStatus.textContent = `Autofilled from curated food library (${found.name}).`;
    });

    quickAddFoods.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const food = target.getAttribute("data-food");
      if (!food) return;
      document.getElementById("mealName").value = food;
      document.getElementById("mealServingGrams").value = 100;
      document.getElementById("autofillFood").click();
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

    document.getElementById("clearEntries").addEventListener("click", () => {
      const day = readDay(dateInput.value || isoToday());
      day.meals = [];
      writeDay(dateInput.value, day);
      render();
    });

    render();
  }

  if (!requireProfileGate()) return;
  if (page === "profile") initProfilePage();
  if (page === "dashboard") initDashboardPage();
  if (page === "tracker") initTrackerPage();
})();
