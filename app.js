(function () {
  const cancerSelect = document.getElementById("cancerSelect");
  const dialysisField = document.getElementById("dialysisField");
  const recommendationMeta = document.getElementById("recommendationMeta");
  const recommendationList = document.getElementById("recommendationList");
  const sourceList = document.getElementById("sourceList");

  const profileForm = document.getElementById("profileForm");
  const profileName = document.getElementById("profileName");
  const profileGender = document.getElementById("profileGender");
  const profileAge = document.getElementById("profileAge");
  const profileActivity = document.getElementById("profileActivity");
  const profileWeightLoss = document.getElementById("profileWeightLoss");
  const profileAppetite = document.getElementById("profileAppetite");
  const profileTreatmentMode = document.getElementById("profileTreatmentMode");
  const profileSummary = document.getElementById("profileSummary");

  const profileHeightUnit = document.getElementById("profileHeightUnit");
  const profileHeightCm = document.getElementById("profileHeightCm");
  const profileHeightFt = document.getElementById("profileHeightFt");
  const profileHeightIn = document.getElementById("profileHeightIn");
  const heightCmWrap = document.getElementById("heightCmWrap");
  const heightFtWrap = document.getElementById("heightFtWrap");
  const heightInWrap = document.getElementById("heightInWrap");

  const profileWeightUnit = document.getElementById("profileWeightUnit");
  const profileWeightKg = document.getElementById("profileWeightKg");
  const profileWeightLb = document.getElementById("profileWeightLb");
  const weightKgWrap = document.getElementById("weightKgWrap");
  const weightLbWrap = document.getElementById("weightLbWrap");

  const targetForm = document.getElementById("targetForm");
  const mealForm = document.getElementById("mealForm");
  const macroSummary = document.getElementById("macroSummary");
  const macroRings = document.getElementById("macroRings");
  const remainingSummary = document.getElementById("remainingSummary");
  const nutritionScoreNode = document.getElementById("nutritionScore");
  const nutritionStatus = document.getElementById("nutritionStatus");
  const medicalAlerts = document.getElementById("medicalAlerts");
  const malnutritionRiskNode = document.getElementById("malnutritionRisk");
  const todayRecommendationsNode = document.getElementById("todayRecommendations");
  const dashboardDate = document.getElementById("dashboardDate");
  const prevDayButton = document.getElementById("prevDay");
  const nextDayButton = document.getElementById("nextDay");
  const mealList = document.getElementById("mealList");
  const clearEntriesButton = document.getElementById("clearEntries");
  const quickAddFoods = document.getElementById("quickAddFoods");

  const weightForm = document.getElementById("weightForm");
  const weightDateInput = document.getElementById("weightDate");
  const weightValueKgInput = document.getElementById("weightValueKg");
  const weightTrendSummary = document.getElementById("weightTrendSummary");
  const weightChart = document.getElementById("weightChart");

  const symptomForm = document.getElementById("symptomForm");
  const saveSymptomsButton = document.getElementById("saveSymptoms");
  const historyList = document.getElementById("historyList");
  const exportClinicianReportButton = document.getElementById("exportClinicianReport");
  const intakeTrendChart = document.getElementById("intakeTrendChart");
  const stepProfile = document.getElementById("stepProfile");
  const stepTargets = document.getElementById("stepTargets");
  const stepTrack = document.getElementById("stepTrack");
  const stepReview = document.getElementById("stepReview");

  const targetCalories = document.getElementById("targetCalories");
  const targetProtein = document.getElementById("targetProtein");
  const targetCarbs = document.getElementById("targetCarbs");
  const targetFat = document.getElementById("targetFat");

  const mealNameInput = document.getElementById("mealName");
  const mealBarcodeInput = document.getElementById("mealBarcode");
  const lookupBarcodeButton = document.getElementById("lookupBarcode");
  const mealServingInput = document.getElementById("mealServingGrams");
  const mealCaloriesInput = document.getElementById("mealCalories");
  const mealProteinInput = document.getElementById("mealProtein");
  const mealCarbsInput = document.getElementById("mealCarbs");
  const mealFatInput = document.getElementById("mealFat");
  const autofillFoodButton = document.getElementById("autofillFood");
  const foodLookupStatus = document.getElementById("foodLookupStatus");
  const foodSafetyNote = document.getElementById("foodSafetyNote");
  const oncologyFoodOptions = document.getElementById("oncologyFoodOptions");
  const foodLibrarySearch = document.getElementById("foodLibrarySearch");
  const usdaApiKeyInput = document.getElementById("usdaApiKey");
  const saveUsdaApiKeyButton = document.getElementById("saveUsdaApiKey");
  const usdaApiKeyStatus = document.getElementById("usdaApiKeyStatus");
  const foodFilterHighProtein = document.getElementById("foodFilterHighProtein");
  const foodFilterPlantBased = document.getElementById("foodFilterPlantBased");
  const foodFilterSoftTexture = document.getElementById("foodFilterSoftTexture");
  const foodLibraryCount = document.getElementById("foodLibraryCount");
  const foodLibraryResults = document.getElementById("foodLibraryResults");

  const PROFILE_STORAGE_KEY = "oncoNutritionProfile:v2";
  const WEIGHT_HISTORY_STORAGE_KEY = "oncoNutritionWeightHistory:v1";
  const USDA_API_KEY_STORAGE_KEY = "oncoNutritionUsdaApiKey:v1";
  const USDA_DEFAULT_API_KEY = "DEMO_KEY";

  const CURATED_ONCOLOGY_SAFE_FOODS = [
    {
      name: "Salmon (baked)",
      aliases: ["salmon", "baked salmon"],
      macros100g: { calories: 208, protein: 20.4, carbs: 0, fat: 13.4 },
      safety: "Cook fish fully to an internal temperature of 145 F; avoid raw fish during treatment."
    },
    {
      name: "Chicken breast (cooked)",
      aliases: ["chicken breast", "cooked chicken breast"],
      macros100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      safety: "Use fully cooked poultry only; avoid deli meats unless heated steaming hot."
    },
    {
      name: "Turkey breast (cooked)",
      aliases: ["turkey breast", "cooked turkey"],
      macros100g: { calories: 135, protein: 30, carbs: 0, fat: 1 },
      safety: "Keep hot foods hot and refrigerate leftovers within 2 hours."
    },
    {
      name: "Egg (fully cooked)",
      aliases: ["egg", "cooked egg", "scrambled egg"],
      macros100g: { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
      safety: "Avoid runny/undercooked eggs while immunocompromised."
    },
    {
      name: "Tofu (firm)",
      aliases: ["tofu", "firm tofu"],
      macros100g: { calories: 76, protein: 8, carbs: 1.9, fat: 4.8 },
      safety: "Store refrigerated and consume by use-by date after opening."
    },
    {
      name: "Greek yogurt (pasteurized, plain)",
      aliases: ["greek yogurt", "plain greek yogurt"],
      macros100g: { calories: 59, protein: 10.3, carbs: 3.6, fat: 0.4 },
      safety: "Choose pasteurized dairy products only."
    },
    {
      name: "Cottage cheese (low-fat)",
      aliases: ["cottage cheese", "low fat cottage cheese"],
      macros100g: { calories: 81, protein: 11, carbs: 4.3, fat: 2.3 },
      safety: "Use pasteurized products and keep refrigerated."
    },
    {
      name: "Milk (pasteurized, 2%)",
      aliases: ["milk", "2 percent milk"],
      macros100g: { calories: 50, protein: 3.4, carbs: 4.8, fat: 1.9 },
      safety: "Use pasteurized milk only."
    },
    {
      name: "Oatmeal (cooked)",
      aliases: ["oatmeal", "cooked oatmeal"],
      macros100g: { calories: 68, protein: 2.4, carbs: 12, fat: 1.4 },
      safety: "Cook with clean water and refrigerate leftovers promptly."
    },
    {
      name: "Brown rice (cooked)",
      aliases: ["brown rice", "cooked brown rice"],
      macros100g: { calories: 112, protein: 2.6, carbs: 23, fat: 0.9 },
      safety: "Do not leave cooked rice at room temperature for long periods."
    },
    {
      name: "White rice (cooked)",
      aliases: ["white rice", "cooked white rice"],
      macros100g: { calories: 130, protein: 2.4, carbs: 28.2, fat: 0.3 },
      safety: "Store cooked rice in the refrigerator within 2 hours."
    },
    {
      name: "Sweet potato (baked)",
      aliases: ["sweet potato", "baked sweet potato"],
      macros100g: { calories: 90, protein: 2, carbs: 21, fat: 0.2 },
      safety: "Scrub produce before cooking and avoid damaged produce."
    },
    {
      name: "Banana",
      aliases: ["banana"],
      macros100g: { calories: 89, protein: 1.1, carbs: 22.8, fat: 0.3 },
      safety: "Peel before eating and wash hands first."
    },
    {
      name: "Apple",
      aliases: ["apple"],
      macros100g: { calories: 52, protein: 0.3, carbs: 13.8, fat: 0.2 },
      safety: "Rinse well under running water before cutting."
    },
    {
      name: "Blueberries",
      aliases: ["blueberries", "blueberry"],
      macros100g: { calories: 57, protein: 0.7, carbs: 14.5, fat: 0.3 },
      safety: "Rinse thoroughly and discard moldy berries."
    },
    {
      name: "Avocado",
      aliases: ["avocado"],
      macros100g: { calories: 160, protein: 2, carbs: 8.5, fat: 14.7 },
      safety: "Wash the peel before cutting to avoid contamination transfer."
    },
    {
      name: "Broccoli (steamed)",
      aliases: ["broccoli", "steamed broccoli"],
      macros100g: { calories: 35, protein: 2.4, carbs: 7.2, fat: 0.4 },
      safety: "Cook vegetables thoroughly if neutropenic."
    },
    {
      name: "Carrots (cooked)",
      aliases: ["carrots", "cooked carrots"],
      macros100g: { calories: 35, protein: 0.8, carbs: 8.2, fat: 0.2 },
      safety: "Wash produce and use clean cutting boards."
    },
    {
      name: "Lentils (cooked)",
      aliases: ["lentils", "cooked lentils"],
      macros100g: { calories: 116, protein: 9, carbs: 20.1, fat: 0.4 },
      safety: "Cook legumes thoroughly and refrigerate leftovers quickly."
    },
    {
      name: "Almonds",
      aliases: ["almonds"],
      macros100g: { calories: 579, protein: 21.2, carbs: 21.7, fat: 49.9 },
      safety: "Use sealed products and avoid bulk-bin foods during high infection risk."
    },
    {
      name: "Protein shake",
      aliases: ["protein shake", "ready to drink protein shake"],
      macros100g: { calories: 72, protein: 12, carbs: 3, fat: 1.2 },
      safety: "Use pasteurized, sealed products and keep refrigerated after opening."
    }
  ];

  const storageKeyForDate = (dateStr) => {
    return `oncoNutritionLog:${dateStr}`;
  };

  const isoToday = () => new Date().toISOString().slice(0, 10);

  let isFoodLookupRunning = false;
  let selectedDate = isoToday();
  let weightHistory = [];

  let state = {
    profile: null,
    targets: { calories: 2000, protein: 90, carbs: 230, fat: 70 },
    meals: [],
    symptoms: []
  };

  function initCancerOptions() {
    TOP_CANCERS.forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      cancerSelect.appendChild(option);
    });
  }

  function getRadioValue(name) {
    const node = document.querySelector(`input[name="${name}"]:checked`);
    return node ? node.value : null;
  }

  function selectedTreatmentState() {
    return getRadioValue("chemoStatus");
  }

  function selectedDialysisState() {
    return getRadioValue("dialysisStatus");
  }

  function getRecommendations() {
    const cancer = cancerSelect.value;
    const chemo = selectedTreatmentState();
    const recs = [...BASE_RECOMMENDATIONS[chemo]];

    const overrides = CANCER_OVERRIDES[cancer] || [];
    recs.push(...overrides);

    if (cancer === "Kidney and Renal Pelvis Cancer") {
      const dialysis = selectedDialysisState();
      recs.push(KIDNEY_DIALYSIS[dialysis]);
    }

    return recs;
  }

  function renderRecommendations() {
    const cancer = cancerSelect.value;
    const chemo = selectedTreatmentState();
    const dialysis = selectedDialysisState();

    dialysisField.classList.toggle(
      "hidden",
      cancer !== "Kidney and Renal Pelvis Cancer"
    );

    const metaParts = [
      `Cancer: ${cancer}`,
      `Chemo: ${chemo === "on" ? "On chemotherapy" : "Off chemotherapy"}`
    ];

    if (cancer === "Kidney and Renal Pelvis Cancer") {
      metaParts.push(
        `Dialysis: ${dialysis === "on" ? "On dialysis" : "Off dialysis"}`
      );
    }

    recommendationMeta.textContent = metaParts.join(" | ");

    const recs = getRecommendations();
    recommendationList.innerHTML = "";

    const sourceIds = new Set(["nciStats"]);

    recs.forEach((rec) => {
      rec.sourceIds.forEach((id) => sourceIds.add(id));
      const card = document.createElement("article");
      card.className = "rec-card";

      const h3 = document.createElement("h3");
      h3.textContent = rec.title;
      card.appendChild(h3);

      const ul = document.createElement("ul");
      rec.bullets.forEach((point) => {
        const li = document.createElement("li");
        li.textContent = point;
        ul.appendChild(li);
      });

      card.appendChild(ul);
      recommendationList.appendChild(card);
    });

    renderSources(Array.from(sourceIds));
  }

  function renderSources(sourceIds) {
    sourceList.innerHTML = "";
    sourceIds.forEach((id) => {
      const source = APP_SOURCES[id];
      if (!source) return;
      const li = document.createElement("li");
      const backup = source.backupUrl
        ? ` | <a href="${source.backupUrl}" target="_blank" rel="noopener noreferrer">backup link</a>`
        : "";
      li.innerHTML = `<strong>${source.title}</strong> (${source.org}, ${source.type}) - <a href="${source.url}" target="_blank" rel="noopener noreferrer">primary link</a>${backup}`;
      sourceList.appendChild(li);
    });
  }

  function loadState(dateStr) {
    const raw = localStorage.getItem(storageKeyForDate(dateStr));
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw);
      if (parsed.targets && parsed.meals) {
        state.targets = parsed.targets;
        state.meals = parsed.meals;
        state.symptoms = Array.isArray(parsed.symptoms) ? parsed.symptoms : [];
        return true;
      }
    } catch (_err) {
      // Ignore malformed local storage.
    }

    return false;
  }

  function saveState() {
    localStorage.setItem(
      storageKeyForDate(selectedDate),
      JSON.stringify({ targets: state.targets, meals: state.meals, symptoms: state.symptoms })
    );
  }

  function loadProfile() {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.gender || !parsed.heightCm || !parsed.weightKg || !parsed.age) {
        return;
      }
      if (!parsed.weightLoss) parsed.weightLoss = "none";
      if (!parsed.appetite) parsed.appetite = "normal";
      if (!parsed.treatmentMode) parsed.treatmentMode = "chemotherapy";
      state.profile = parsed;
    } catch (_err) {
      // Ignore malformed profile storage.
    }
  }

  function saveProfile() {
    if (!state.profile) return;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile));
  }

  function loadWeightHistory() {
    const raw = localStorage.getItem(WEIGHT_HISTORY_STORAGE_KEY);
    if (!raw) {
      weightHistory = [];
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      weightHistory = Array.isArray(parsed) ? parsed : [];
    } catch (_err) {
      weightHistory = [];
    }
  }

  function saveWeightHistory() {
    localStorage.setItem(WEIGHT_HISTORY_STORAGE_KEY, JSON.stringify(weightHistory));
  }

  function getUsdaApiKey() {
    const saved = localStorage.getItem(USDA_API_KEY_STORAGE_KEY);
    return saved && saved.trim() ? saved.trim() : USDA_DEFAULT_API_KEY;
  }

  function loadUsdaApiKeyInput() {
    const saved = localStorage.getItem(USDA_API_KEY_STORAGE_KEY) || "";
    usdaApiKeyInput.value = saved;
    if (saved) {
      usdaApiKeyStatus.textContent = "USDA API key saved.";
      return;
    }
    usdaApiKeyStatus.textContent =
      "No USDA key saved. Using DEMO_KEY (lower limits).";
  }

  function syncTargetInputs() {
    targetCalories.value = state.targets.calories;
    targetProtein.value = state.targets.protein;
    targetCarbs.value = state.targets.carbs;
    targetFat.value = state.targets.fat;
  }

  function roundOne(value) {
    return Math.round(value * 10) / 10;
  }

  function roundTwo(value) {
    return Math.round(value * 100) / 100;
  }

  function cmToFeetInches(heightCm) {
    const totalInches = heightCm / 2.54;
    let feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches - feet * 12);
    if (inches === 12) {
      feet += 1;
      return { feet, inches: 0 };
    }
    return { feet, inches };
  }

  function feetInchesToCm(feet, inches) {
    return (feet * 12 + inches) * 2.54;
  }

  function kgToLb(kg) {
    return kg * 2.2046226218;
  }

  function lbToKg(lb) {
    return lb / 2.2046226218;
  }

  function updateProfileUnitVisibility() {
    const usesCm = profileHeightUnit.value === "cm";
    heightCmWrap.classList.toggle("hidden", !usesCm);
    heightFtWrap.classList.toggle("hidden", usesCm);
    heightInWrap.classList.toggle("hidden", usesCm);

    profileHeightCm.required = usesCm;
    profileHeightFt.required = !usesCm;
    profileHeightIn.required = !usesCm;

    const usesKg = profileWeightUnit.value === "kg";
    weightKgWrap.classList.toggle("hidden", !usesKg);
    weightLbWrap.classList.toggle("hidden", usesKg);

    profileWeightKg.required = usesKg;
    profileWeightLb.required = !usesKg;
  }

  function handleHeightUnitChange() {
    const useCm = profileHeightUnit.value === "cm";

    if (useCm) {
      const feet = Number(profileHeightFt.value || 0);
      const inches = Number(profileHeightIn.value || 0);
      if (feet > 0 || inches > 0) {
        profileHeightCm.value = roundOne(feetInchesToCm(feet, inches));
      }
    } else {
      const cm = Number(profileHeightCm.value || 0);
      if (cm > 0) {
        const converted = cmToFeetInches(cm);
        profileHeightFt.value = converted.feet;
        profileHeightIn.value = converted.inches;
      }
    }

    updateProfileUnitVisibility();
  }

  function handleWeightUnitChange() {
    const useKg = profileWeightUnit.value === "kg";

    if (useKg) {
      const lb = Number(profileWeightLb.value || 0);
      if (lb > 0) {
        profileWeightKg.value = roundOne(lbToKg(lb));
      }
    } else {
      const kg = Number(profileWeightKg.value || 0);
      if (kg > 0) {
        profileWeightLb.value = roundOne(kgToLb(kg));
      }
    }

    updateProfileUnitVisibility();
  }

  function syncProfileInputs() {
    if (!state.profile) return;

    profileName.value = state.profile.name || "";
    profileGender.value = state.profile.gender;
    profileAge.value = state.profile.age;
    profileActivity.value = String(state.profile.activityFactor);
    profileWeightLoss.value = state.profile.weightLoss || "none";
    profileAppetite.value = state.profile.appetite || "normal";
    profileTreatmentMode.value = state.profile.treatmentMode || "chemotherapy";

    profileHeightUnit.value = state.profile.heightUnit || "cm";
    profileWeightUnit.value = state.profile.weightUnit || "kg";
    updateProfileUnitVisibility();

    if (profileHeightUnit.value === "cm") {
      profileHeightCm.value = roundOne(state.profile.heightCm);
    } else {
      if (state.profile.heightFt != null && state.profile.heightIn != null) {
        profileHeightFt.value = state.profile.heightFt;
        profileHeightIn.value = state.profile.heightIn;
      } else {
        const converted = cmToFeetInches(state.profile.heightCm);
        profileHeightFt.value = converted.feet;
        profileHeightIn.value = converted.inches;
      }
    }

    if (profileWeightUnit.value === "kg") {
      profileWeightKg.value = roundOne(state.profile.weightKg);
    } else {
      profileWeightLb.value =
        state.profile.weightLb != null ? state.profile.weightLb : roundOne(kgToLb(state.profile.weightKg));
    }
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function nutritionRiskLevel(profile) {
    if (profile.weightLoss === "severe" || profile.appetite === "very_low") {
      return "high";
    }
    if (profile.weightLoss === "moderate" || profile.appetite === "reduced") {
      return "moderate";
    }
    if (profile.weightLoss === "mild") {
      return "mild";
    }
    return "low";
  }

  function calculatePersonalizedTargets(profile, chemoState) {
    const { gender, age, heightCm, weightKg, activityFactor } = profile;
    const risk = nutritionRiskLevel(profile);
    const treatmentMode = profile.treatmentMode || "chemotherapy";

    const bmrBase = 10 * weightKg + 6.25 * heightCm - 5 * age;
    const bmr = gender === "male" ? bmrBase + 5 : bmrBase - 161;
    const tdee = bmr * activityFactor;

    const lowEnergy = 25 * weightKg;
    const midEnergy = 27.5 * weightKg;
    const highEnergy = 30 * weightKg;
    let calories = clamp(tdee, lowEnergy, highEnergy);

    const activeTreatment =
      chemoState === "on" ||
      treatmentMode === "chemotherapy" ||
      treatmentMode === "radiation";

    if (activeTreatment) {
      if (risk === "mild") calories = Math.max(calories, 28.5 * weightKg);
      if (risk === "moderate") calories = Math.max(calories, 30 * weightKg);
      if (risk === "high") calories = Math.max(calories, 32 * weightKg);
    }

    let proteinMultiplier = 1.2;
    if (activeTreatment) proteinMultiplier = 1.3;
    if (treatmentMode === "recovery") proteinMultiplier = Math.max(proteinMultiplier, 1.25);
    if (treatmentMode === "remission") proteinMultiplier = Math.max(proteinMultiplier, 1.1);
    if (risk === "moderate") proteinMultiplier = Math.max(proteinMultiplier, 1.4);
    if (risk === "high") proteinMultiplier = Math.max(proteinMultiplier, 1.5);

    const caloriesRounded = Math.max(1200, Math.round(calories / 10) * 10);
    const protein = roundTwo(weightKg * proteinMultiplier);
    const fat = roundTwo((caloriesRounded * 0.3) / 9);
    const carbs = roundTwo(
      Math.max(50, (caloriesRounded - protein * 4 - fat * 9) / 4)
    );

    return {
      calories: caloriesRounded,
      protein,
      carbs,
      fat,
      rationale: {
        chemoState,
        risk,
        energyRangeKcal: `${Math.round(lowEnergy)}-${Math.round(highEnergy)}`,
        baseMidEnergyKcal: Math.round(midEnergy)
      }
    };
  }

  function renderProfileSummary() {
    if (!state.profile) {
      profileSummary.innerHTML = "<p class='muted'>No profile saved yet.</p>";
      return;
    }

    const helloName = state.profile.name ? `${state.profile.name}` : "there";
    const convertedHeight = cmToFeetInches(state.profile.heightCm);
    const treatmentState = selectedTreatmentState();

    profileSummary.innerHTML = `
      <p><strong>Hello, ${helloName}.</strong></p>
      <p class="muted">Profile: ${state.profile.gender}, ${state.profile.age} years, ${roundOne(state.profile.heightCm)} cm (${convertedHeight.feet} ft ${convertedHeight.inches} in), ${roundOne(state.profile.weightKg)} kg (${roundOne(kgToLb(state.profile.weightKg))} lb).</p>
      <p class="muted">Treatment profile: mode ${state.profile.treatmentMode || "chemotherapy"}, ${treatmentState === "on" ? "on chemotherapy" : "off chemotherapy"}, appetite ${state.profile.appetite}, recent weight loss ${state.profile.weightLoss}.</p>
      <p class="muted">Personalized targets set to ${state.targets.calories} kcal, P ${state.targets.protein}g, C ${state.targets.carbs}g, F ${state.targets.fat}g.</p>
    `;
  }

  function totals() {
    return state.meals.reduce(
      (acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }

  function percentage(consumed, target) {
    if (!target || target <= 0) return 0;
    return Math.round((consumed / target) * 100);
  }

  function nutritionScore(sum) {
    const calPct = Math.min(100, Math.max(0, percentage(sum.calories, state.targets.calories)));
    const proteinPct = Math.min(100, Math.max(0, percentage(sum.protein, state.targets.protein)));
    const carbBalance = state.targets.carbs > 0
      ? Math.max(0, 100 - Math.abs(percentage(sum.carbs, state.targets.carbs) - 100))
      : 100;
    const fatBalance = state.targets.fat > 0
      ? Math.max(0, 100 - Math.abs(percentage(sum.fat, state.targets.fat) - 100))
      : 100;

    const weighted = calPct * 0.3 + proteinPct * 0.4 + carbBalance * 0.15 + fatBalance * 0.15;
    return Math.round(Math.max(0, Math.min(100, weighted)));
  }

  function scoreStatus(score) {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Needs attention";
    return "High concern";
  }

  function statusLevel(score, risk, alertsCount) {
    if (risk === "High risk" || alertsCount >= 2 || score < 50) return "CRITICAL";
    if (risk === "Moderate risk" || alertsCount >= 1 || score < 75) return "WARNING";
    return "GOOD";
  }

  function remainingMacros(sum) {
    return {
      calories: Math.max(0, roundOne(state.targets.calories - sum.calories)),
      protein: Math.max(0, roundTwo(state.targets.protein - sum.protein)),
      carbs: Math.max(0, roundTwo(state.targets.carbs - sum.carbs)),
      fat: Math.max(0, roundTwo(state.targets.fat - sum.fat))
    };
  }

  function malnutritionRisk(sum) {
    const riskLevel = nutritionRiskLevel(state.profile || { weightLoss: "none", appetite: "normal" });
    let score = 0;
    if (riskLevel === "mild") score += 1;
    if (riskLevel === "moderate") score += 2;
    if (riskLevel === "high") score += 3;
    if (state.targets.calories > 0 && sum.calories < state.targets.calories * 0.7) score += 1;
    if (state.targets.protein > 0 && sum.protein < state.targets.protein * 0.7) score += 1;
    if (state.symptoms.includes("appetite_loss")) score += 1;

    if (score >= 4) return "High risk";
    if (score >= 2) return "Moderate risk";
    return "Low risk";
  }

  function buildDailyAlerts(sum) {
    const alerts = [];
    if (state.targets.protein > 0 && sum.protein < state.targets.protein * 0.75) {
      alerts.push("Protein intake is too low today. Adequate protein is critical to prevent muscle loss during treatment.");
    }
    if (state.targets.calories > 0 && sum.calories < state.targets.calories * 0.75) {
      alerts.push("You are below minimum calorie needs.");
    }
    const risk = malnutritionRisk(sum);
    if (risk !== "Low risk") {
      alerts.push(`You are at risk of malnutrition (${risk.toLowerCase()}). Consider contacting your care team.`);
    }
    return alerts;
  }

  function dailyRecommendations(sum) {
    const recs = [];
    const profile = state.profile;
    if (!profile) return recs;

    if (profile.treatmentMode === "chemotherapy" || selectedTreatmentState() === "on") {
      recs.push("Increase protein density in each meal and prioritize easy-to-digest foods.");
    }
    if (profile.treatmentMode === "radiation") {
      recs.push("Use frequent hydration and softer texture foods if throat/GI irritation occurs.");
    }
    if (profile.appetite === "reduced" || profile.appetite === "very_low") {
      recs.push("Use high-calorie, nutrient-dense snacks in small frequent portions.");
    }
    if (state.symptoms.includes("nausea")) {
      recs.push("Try bland, lower-odor meals and separate fluids from meals when nausea is active.");
    }
    if (state.targets.protein > 0 && sum.protein < state.targets.protein * 0.8) {
      recs.push("To close protein gap, add Greek yogurt, eggs, tofu, lentils, or a protein shake.");
    }
    if (recs.length === 0) {
      recs.push("Maintain your current plan and continue monitoring intake, weight, and symptoms.");
    }
    return recs;
  }

  function renderMacroRings(sum) {
    const items = [
      { label: "Calories", consumed: sum.calories, target: state.targets.calories, unit: "kcal" },
      { label: "Protein", consumed: sum.protein, target: state.targets.protein, unit: "g" },
      { label: "Carbs", consumed: sum.carbs, target: state.targets.carbs, unit: "g" },
      { label: "Fat", consumed: sum.fat, target: state.targets.fat, unit: "g" }
    ];
    macroRings.innerHTML = "";
    items.forEach((item) => {
      const pct = Math.max(0, Math.min(100, percentage(item.consumed, item.target)));
      const ring = document.createElement("article");
      ring.className = "ring-card";
      ring.innerHTML = `
        <div class="ring" style="--pct:${pct}">
          <span>${pct}%</span>
        </div>
        <p><strong>${item.label}</strong><br><span class="muted">${roundOne(item.consumed)} / ${item.target} ${item.unit}</span></p>
      `;
      macroRings.appendChild(ring);
    });
  }

  function renderStepProgress(score) {
    const profileDone = Boolean(state.profile);
    const targetsDone =
      state.targets.calories > 0 &&
      state.targets.protein > 0 &&
      state.targets.carbs > 0 &&
      state.targets.fat > 0;
    const trackingDone = state.meals.length > 0;
    const reviewDone = score >= 70;

    const apply = (node, done, active) => {
      if (!node) return;
      node.classList.toggle("complete", done);
      node.classList.toggle("active", active && !done);
    };

    apply(stepProfile, profileDone, true);
    apply(stepTargets, targetsDone, profileDone);
    apply(stepTrack, trackingDone, targetsDone);
    apply(stepReview, reviewDone, trackingDone);
  }

  function renderHistory() {
    const allDates = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("oncoNutritionLog:")) continue;
      allDates.push(key.replace("oncoNutritionLog:", ""));
    }
    allDates.sort((a, b) => (a < b ? 1 : -1));
    const recent = allDates.slice(0, 14);
    historyList.innerHTML = "";
    if (recent.length === 0) {
      historyList.innerHTML = "<p class='muted'>No history yet.</p>";
      return;
    }
    recent.forEach((dateStr) => {
      try {
        const snapshot = readDaySnapshot(dateStr);
        if (!snapshot) return;
        const sum = snapshot.sum;
        const targets = snapshot.targets;
        const score = Math.round(
          Math.min(100, Math.max(0, (sum.calories / Math.max(1, targets.calories)) * 100 * 0.3 +
            (sum.protein / Math.max(1, targets.protein)) * 100 * 0.4 +
            30))
        );
        const item = document.createElement("article");
        item.className = "food-card";
        item.innerHTML = `
          <div>
            <h3>${dateStr}${dateStr === selectedDate ? " (selected)" : ""}</h3>
            <p class="muted">${roundOne(sum.calories)} kcal | P ${roundTwo(sum.protein)}g | C ${roundTwo(sum.carbs)}g | F ${roundTwo(sum.fat)}g</p>
            <p class="muted">Nutrition score: ${score}/100</p>
          </div>
          <button type="button" data-open-date="${dateStr}">View</button>
        `;
        historyList.appendChild(item);
      } catch (_err) {
        // Skip malformed history rows.
      }
    });
    renderIntakeTrendChart(recent.slice().reverse());
  }

  function readDaySnapshot(dateStr) {
    const raw = localStorage.getItem(storageKeyForDate(dateStr));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const sum = (parsed.meals || []).reduce(
      (acc, meal) => {
        acc.calories += Number(meal.calories || 0);
        acc.protein += Number(meal.protein || 0);
        acc.carbs += Number(meal.carbs || 0);
        acc.fat += Number(meal.fat || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
    return {
      date: dateStr,
      sum,
      targets: parsed.targets || { calories: 2000, protein: 90, carbs: 230, fat: 70 },
      symptoms: Array.isArray(parsed.symptoms) ? parsed.symptoms : []
    };
  }

  function listLogDates(limit) {
    const dates = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("oncoNutritionLog:")) continue;
      dates.push(key.replace("oncoNutritionLog:", ""));
    }
    dates.sort();
    if (limit) return dates.slice(-limit);
    return dates;
  }

  function renderIntakeTrendChart(dateList) {
    if (!intakeTrendChart) return;
    const dates = Array.isArray(dateList) && dateList.length ? dateList : listLogDates(14);
    const snapshots = dates.map((d) => readDaySnapshot(d)).filter(Boolean);
    if (snapshots.length === 0) {
      intakeTrendChart.innerHTML = "";
      return;
    }

    const calVals = snapshots.map((s) => s.sum.calories);
    const proteinVals = snapshots.map((s) => s.sum.protein);
    const maxCal = Math.max(1, ...calVals);
    const maxProtein = Math.max(1, ...proteinVals);
    const buildPoints = (vals, maxV) =>
      vals
        .map((val, idx) => {
          const x = 40 + (idx / Math.max(1, vals.length - 1)) * 520;
          const y = 180 - (val / maxV) * 140;
          return `${x},${y}`;
        })
        .join(" ");

    const calPoints = buildPoints(calVals, maxCal);
    const proteinPoints = buildPoints(proteinVals, maxProtein);
    intakeTrendChart.innerHTML = `
      <rect x="0" y="0" width="600" height="220" fill="#f8fafb"></rect>
      <text x="20" y="24" fill="#3a86ff" font-size="12">Calories</text>
      <text x="96" y="24" fill="#2cb1a6" font-size="12">Protein</text>
      <polyline points="${calPoints}" fill="none" stroke="#3a86ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
      <polyline points="${proteinPoints}" fill="none" stroke="#2cb1a6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></polyline>
    `;
  }

  async function lookupFoodByBarcode(barcode, servingGrams) {
    const clean = String(barcode || "").trim();
    if (!clean) throw new Error("Enter a barcode first.");
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(clean)}.json`
    );
    if (!response.ok) {
      throw new Error(`Barcode lookup failed (${response.status})`);
    }
    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      throw new Error("No product found for this barcode.");
    }
    const macros100g = parseProductMacros(data.product);
    if (!macros100g) {
      throw new Error("Barcode product found but macros are incomplete.");
    }
    return {
      name: data.product.product_name || clean,
      source: "OpenFoodFacts barcode",
      safety: "Check package and food safety requirements for your treatment stage.",
      macros: scaleFoodMacros(macros100g, servingGrams)
    };
  }

  async function exportClinicianReport() {
    const snapshots = listLogDates(30).map((d) => readDaySnapshot(d)).filter(Boolean);
    if (!snapshots.length) {
      setFoodLookupStatus("No daily history available to export.", true);
      return;
    }
    if (!(window.jspdf && window.jspdf.jsPDF)) {
      setFoodLookupStatus("PDF library unavailable. Refresh and try again.", true);
      return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    let y = 16;
    const line = (text) => {
      if (y > 275) {
        pdf.addPage();
        y = 16;
      }
      pdf.text(String(text), 12, y);
      y += 7;
    };

    line("OncoNutrition Tracker - Clinician Report");
    line(`Generated: ${new Date().toLocaleString()}`);
    line(`Patient: ${(state.profile && state.profile.name) || "N/A"}`);
    line(`Treatment mode: ${(state.profile && state.profile.treatmentMode) || "N/A"}`);
    line("");
    line("Recent Daily Intake (up to 30 days):");
    snapshots.forEach((s) => {
      line(
        `${s.date} | kcal ${roundOne(s.sum.calories)} | P ${roundTwo(s.sum.protein)}g | C ${roundTwo(s.sum.carbs)}g | F ${roundTwo(s.sum.fat)}g | symptoms: ${(s.symptoms || []).join(", ") || "none"}`
      );
    });
    line("");
    line("Weight trend:");
    if (!weightHistory.length) {
      line("No weight entries");
    } else {
      [...weightHistory]
        .sort((a, b) => (a.date > b.date ? 1 : -1))
        .forEach((w) => line(`${w.date}: ${w.weightKg} kg`));
    }

    const filenameDate = new Date().toISOString().slice(0, 10);
    pdf.save(`onco-nutrition-clinician-report-${filenameDate}.pdf`);
    setFoodLookupStatus("Clinician PDF report exported.", false);
  }

  function shiftDate(dateStr, deltaDays) {
    const base = new Date(`${dateStr}T00:00:00`);
    base.setDate(base.getDate() + deltaDays);
    return base.toISOString().slice(0, 10);
  }

  function syncSymptomForm() {
    const selected = new Set(state.symptoms || []);
    symptomForm.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = selected.has(input.value);
    });
  }

  function loadDateState(dateStr) {
    selectedDate = dateStr;
    dashboardDate.value = selectedDate;
    weightDateInput.value = selectedDate;

    const hasState = loadState(selectedDate);
    if (!hasState) {
      state.meals = [];
      state.symptoms = [];
      if (state.profile) {
        applyPersonalizedTargets(state.profile, selectedTreatmentState());
      } else {
        state.targets = { calories: 2000, protein: 90, carbs: 230, fat: 70 };
      }
      saveState();
    }
    syncTargetInputs();
    syncSymptomForm();
    renderMeals();
    renderProfileSummary();
  }

  function renderWeightChart() {
    const sorted = [...weightHistory].sort((a, b) => (a.date > b.date ? 1 : -1));
    if (sorted.length === 0) {
      weightChart.innerHTML = "";
      weightTrendSummary.textContent = "No weight entries yet.";
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
    weightTrendSummary.textContent = `Latest: ${latest.weightKg} kg (${latest.date}) | Change since first entry: ${delta >= 0 ? "+" : ""}${delta} kg`;

    weightChart.innerHTML = `
      <rect x="0" y="0" width="600" height="220" fill="#f8fafb"></rect>
      <polyline points="${points.join(" ")}" fill="none" stroke="#2cb1a6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></polyline>
    `;
  }

  function buildProgressRow(label, consumed, target) {
    const pct = target > 0 ? Math.min(100, (consumed / target) * 100) : 0;
    return `
      <div class="progress">
        <strong>${label}</strong>
        <div class="bar"><span style="width:${pct}%"></span></div>
        <span>${roundOne(consumed)} / ${target}</span>
      </div>
    `;
  }

  function renderMeals() {
    const sum = totals();
    macroSummary.innerHTML =
      buildProgressRow("Calories", sum.calories, state.targets.calories) +
      buildProgressRow("Protein", sum.protein, state.targets.protein) +
      buildProgressRow("Carbs", sum.carbs, state.targets.carbs) +
      buildProgressRow("Fat", sum.fat, state.targets.fat);

    renderMacroRings(sum);
    const remaining = remainingMacros(sum);
    remainingSummary.innerHTML = `
      <p>Calories remaining: <strong>${remaining.calories} kcal</strong></p>
      <p>Protein remaining: <strong>${remaining.protein} g</strong></p>
      <p>Carbs remaining: <strong>${remaining.carbs} g</strong></p>
      <p>Fat remaining: <strong>${remaining.fat} g</strong></p>
    `;

    const score = nutritionScore(sum);
    nutritionScoreNode.innerHTML = `<p><strong>${score} / 100</strong></p><p>${scoreStatus(score)}</p>`;
    const risk = malnutritionRisk(sum);
    malnutritionRiskNode.innerHTML = `<p><strong>${risk}</strong></p>`;

    const alerts = buildDailyAlerts(sum);
    medicalAlerts.innerHTML = "";
    if (alerts.length === 0) {
      medicalAlerts.innerHTML = "<p class='muted'>No critical alerts for selected day.</p>";
    } else {
      alerts.forEach((msg) => {
        const alert = document.createElement("div");
        alert.className = "alert-card";
        alert.textContent = msg;
        medicalAlerts.appendChild(alert);
      });
    }

    const status = statusLevel(score, risk, alerts.length);
    nutritionStatus.textContent = `Status: ${status}`;
    nutritionStatus.classList.remove("good", "warning", "critical");
    nutritionStatus.classList.add(status === "GOOD" ? "good" : status === "WARNING" ? "warning" : "critical");
    renderStepProgress(score);

    const recs = dailyRecommendations(sum);
    todayRecommendationsNode.innerHTML = "";
    recs.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      todayRecommendationsNode.appendChild(li);
    });

    mealList.innerHTML = "";
    if (state.meals.length === 0) {
      mealList.innerHTML =
        "<p class='muted'>You have not logged any meals today. Start by adding your first meal.</p>";
      renderHistory();
      return;
    }

    state.meals.forEach((meal, idx) => {
      const item = document.createElement("div");
      item.className = "meal";
      item.innerHTML = `
        <div>
          <strong>${meal.name}</strong><br>
          <span class="muted">${meal.calories} kcal | P ${meal.protein}g | C ${meal.carbs}g | F ${meal.fat}g | ${meal.servingGrams}g serving</span>
        </div>
        <button type="button" data-remove="${idx}" class="danger">Remove</button>
      `;
      mealList.appendChild(item);
    });
    renderHistory();
  }

  function normalizeFoodName(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ");
  }

  function foodSearchKeys(food) {
    return [food.name, ...(food.aliases || [])].map(normalizeFoodName);
  }

  function foodTags(food) {
    const keys = foodSearchKeys(food);
    const joined = keys.join(" ");
    const tags = [];

    if ((food.macros100g.protein || 0) >= 10) tags.push("high-protein");

    const plantHints = [
      "tofu",
      "lentils",
      "oatmeal",
      "rice",
      "sweet potato",
      "banana",
      "apple",
      "blueberries",
      "avocado",
      "broccoli",
      "carrots",
      "almonds"
    ];
    if (plantHints.some((hint) => joined.includes(hint))) tags.push("plant-based");

    const softHints = [
      "oatmeal",
      "yogurt",
      "cottage cheese",
      "tofu",
      "banana",
      "avocado",
      "egg",
      "sweet potato"
    ];
    if (softHints.some((hint) => joined.includes(hint))) tags.push("soft-texture");

    return tags;
  }

  function filteredFoodLibraryItems() {
    const query = normalizeFoodName(foodLibrarySearch.value || "");
    return CURATED_ONCOLOGY_SAFE_FOODS.filter((food) => {
      const keys = foodSearchKeys(food);
      const tags = foodTags(food);
      const queryMatch =
        !query || keys.some((key) => key.includes(query) || query.includes(key));
      const highProteinMatch =
        !foodFilterHighProtein.checked || tags.includes("high-protein");
      const plantBasedMatch =
        !foodFilterPlantBased.checked || tags.includes("plant-based");
      const softTextureMatch =
        !foodFilterSoftTexture.checked || tags.includes("soft-texture");

      return queryMatch && highProteinMatch && plantBasedMatch && softTextureMatch;
    });
  }

  function renderFoodLibrary() {
    const foods = filteredFoodLibraryItems();
    foodLibraryCount.textContent = `${foods.length} food option${
      foods.length === 1 ? "" : "s"
    } found`;

    foodLibraryResults.innerHTML = "";
    if (foods.length === 0) {
      foodLibraryResults.innerHTML =
        "<p class='muted'>No foods match your filters. Try broadening your search.</p>";
      return;
    }

    foods.forEach((food) => {
      const tags = foodTags(food)
        .map((tag) => `<span class="food-tag">${tag.replace("-", " ")}</span>`)
        .join(" ");
      const card = document.createElement("article");
      card.className = "food-card";
      card.innerHTML = `
        <div>
          <h3>${food.name}</h3>
          <p class="muted">${food.macros100g.calories} kcal | P ${food.macros100g.protein}g | C ${food.macros100g.carbs}g | F ${food.macros100g.fat}g per 100g</p>
          <p class="muted">${food.safety}</p>
          <div class="food-tags">${tags}</div>
        </div>
        <button type="button" data-food-use="${food.name}">Use in tracker</button>
      `;
      foodLibraryResults.appendChild(card);
    });
  }

  function populateCuratedFoodOptions() {
    oncologyFoodOptions.innerHTML = "";
    CURATED_ONCOLOGY_SAFE_FOODS.forEach((food) => {
      const option = document.createElement("option");
      option.value = food.name;
      oncologyFoodOptions.appendChild(option);
    });
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

  function findCuratedFoodMatch(name) {
    const normalized = normalizeFoodName(name);
    if (!normalized) return null;

    const exact = CURATED_ONCOLOGY_SAFE_FOODS.find((food) => {
      const keys = foodSearchKeys(food);
      return keys.includes(normalized);
    });

    if (exact) return exact;

    return (
      CURATED_ONCOLOGY_SAFE_FOODS.find((food) => {
        const keys = foodSearchKeys(food);
        return keys.some((key) => normalized.includes(key) || key.includes(normalized));
      }) || null
    );
  }

  function parseProductMacros(product) {
    if (!product || !product.nutriments) return null;

    const n = product.nutriments;
    const calories100g = Number(
      n["energy-kcal_100g"] ??
      n["energy-kcal_value"] ??
      (n.energy_100g ? n.energy_100g / 4.184 : NaN)
    );
    const protein100g = Number(n.proteins_100g);
    const carbs100g = Number(n.carbohydrates_100g);
    const fat100g = Number(n.fat_100g);

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

  function usdaNutrientValue(food, nutrientId, nutrientNumber, nutrientNames, unitName) {
    const nutrients = Array.isArray(food.foodNutrients) ? food.foodNutrients : [];
    const match = nutrients.find((n) => {
      const id = Number(n.nutrientId ?? NaN);
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
    return Number(match.value ?? match.amount ?? NaN);
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

    if (Number.isNaN(calories100g)) {
      return null;
    }

    return {
      calories: calories100g,
      protein: safeProtein,
      carbs: safeCarbs,
      fat: safeFat
    };
  }

  async function lookupUsdaFoodMacros(name, servingGrams) {
    const apiKey = getUsdaApiKey();
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(
        apiKey
      )}`,
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
        safety:
          "General food database result. Keep oncology food-safety precautions for prep and storage.",
        macros: scaleFoodMacros(macros100g, servingGrams)
      };
    }

    throw new Error("USDA did not return complete macro data for this query");
  }

  async function lookupFoodMacros(name, servingGrams) {
    const curated = findCuratedFoodMatch(name);
    if (curated) {
      return {
        source: `curated oncology-safe database (${curated.name})`,
        safety: curated.safety,
        macros: scaleFoodMacros(curated.macros100g, servingGrams)
      };
    }

    try {
      return await lookupUsdaFoodMacros(name, servingGrams);
    } catch (_err) {
      // Fall through to OpenFoodFacts.
    }

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      name
    )}&search_simple=1&action=process&json=1&page_size=10`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Food lookup failed (${response.status})`);
    }

    const data = await response.json();
    const products = Array.isArray(data.products) ? data.products : [];

    for (const product of products) {
      const macros100g = parseProductMacros(product);
      if (!macros100g) continue;

      return {
        source: `OpenFoodFacts (${product.product_name || "best match"})`,
        safety: "Verify food safety and ingredient tolerance with your care team.",
        macros: scaleFoodMacros(macros100g, servingGrams)
      };
    }

    throw new Error("No nutrition data found for this food name");
  }

  function applyMealMacroValues(macros) {
    mealCaloriesInput.value = macros.calories;
    mealProteinInput.value = macros.protein;
    mealCarbsInput.value = macros.carbs;
    mealFatInput.value = macros.fat;
  }

  function setFoodLookupStatus(message, isError) {
    foodLookupStatus.textContent = message;
    foodLookupStatus.style.color = isError ? "var(--danger)" : "var(--muted)";
  }

  function setFoodSafetyNote(message) {
    foodSafetyNote.textContent = message;
  }

  async function runFoodAutofill() {
    if (isFoodLookupRunning) return;

    const name = mealNameInput.value.trim();
    const servingGrams = Number(mealServingInput.value || 0);

    if (!name) {
      setFoodLookupStatus("Enter a food name first.", true);
      return;
    }

    if (servingGrams <= 0) {
      setFoodLookupStatus("Serving grams must be greater than 0.", true);
      return;
    }

    isFoodLookupRunning = true;
    autofillFoodButton.disabled = true;
    setFoodLookupStatus("Looking up macros...", false);

    try {
      const result = await lookupFoodMacros(name, servingGrams);
      applyMealMacroValues(result.macros);
      setFoodLookupStatus(`Autofilled from ${result.source}.`, false);
      setFoodSafetyNote(`Food safety note: ${result.safety}`);
    } catch (err) {
      setFoodLookupStatus(
        err instanceof Error ? err.message : "Unable to autofill this food.",
        true
      );
      setFoodSafetyNote("");
    } finally {
      isFoodLookupRunning = false;
      autofillFoodButton.disabled = false;
    }
  }

  function applyPersonalizedTargets(profile, chemoState) {
    const personalized = calculatePersonalizedTargets(profile, chemoState);
    state.targets = {
      calories: personalized.calories,
      protein: personalized.protein,
      carbs: personalized.carbs,
      fat: personalized.fat
    };
    syncTargetInputs();
    saveState();
    renderMeals();
    renderProfileSummary();
  }

  function collectProfileFromForm() {
    const heightUnit = profileHeightUnit.value;
    const weightUnit = profileWeightUnit.value;

    let heightCmValue = 0;
    let heightFtValue = null;
    let heightInValue = null;

    if (heightUnit === "cm") {
      heightCmValue = Number(profileHeightCm.value);
    } else {
      heightFtValue = Number(profileHeightFt.value || 0);
      heightInValue = Number(profileHeightIn.value || 0);
      heightCmValue = feetInchesToCm(heightFtValue, heightInValue);
    }

    let weightKgValue = 0;
    let weightLbValue = null;

    if (weightUnit === "kg") {
      weightKgValue = Number(profileWeightKg.value);
    } else {
      weightLbValue = Number(profileWeightLb.value);
      weightKgValue = lbToKg(weightLbValue);
    }

    return {
      name: profileName.value.trim(),
      gender: profileGender.value,
      age: Number(profileAge.value),
      activityFactor: Number(profileActivity.value),
      weightLoss: profileWeightLoss.value,
      appetite: profileAppetite.value,
      treatmentMode: profileTreatmentMode.value,
      heightUnit,
      weightUnit,
      heightCm: roundOne(heightCmValue),
      weightKg: roundOne(weightKgValue),
      heightFt: heightFtValue,
      heightIn: heightInValue,
      weightLb: weightLbValue != null ? roundOne(weightLbValue) : null
    };
  }

  function isValidProfile(profile) {
    return (
      Boolean(profile.gender) &&
      profile.age > 0 &&
      profile.heightCm > 0 &&
      profile.weightKg > 0 &&
      profile.activityFactor > 0 &&
      Boolean(profile.weightLoss) &&
      Boolean(profile.appetite) &&
      Boolean(profile.treatmentMode)
    );
  }

  function hookEvents() {
    cancerSelect.addEventListener("change", renderRecommendations);
    document.querySelectorAll('input[name="chemoStatus"]').forEach((input) => {
      input.addEventListener("change", () => {
        renderRecommendations();
        if (!state.profile) return;
        applyPersonalizedTargets(state.profile, selectedTreatmentState());
      });
    });
    document.querySelectorAll('input[name="dialysisStatus"]').forEach((input) => {
      input.addEventListener("change", renderRecommendations);
    });

    dashboardDate.addEventListener("change", () => {
      if (!dashboardDate.value) return;
      loadDateState(dashboardDate.value);
    });
    prevDayButton.addEventListener("click", () => {
      loadDateState(shiftDate(selectedDate, -1));
    });
    nextDayButton.addEventListener("click", () => {
      loadDateState(shiftDate(selectedDate, 1));
    });

    profileHeightUnit.addEventListener("change", handleHeightUnitChange);
    profileWeightUnit.addEventListener("change", handleWeightUnitChange);
    saveUsdaApiKeyButton.addEventListener("click", () => {
      const key = usdaApiKeyInput.value.trim();
      if (!key) {
        localStorage.removeItem(USDA_API_KEY_STORAGE_KEY);
        usdaApiKeyStatus.textContent =
          "USDA key cleared. Falling back to DEMO_KEY.";
        return;
      }
      localStorage.setItem(USDA_API_KEY_STORAGE_KEY, key);
      usdaApiKeyStatus.textContent = "USDA key saved.";
    });

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const profile = collectProfileFromForm();
      if (!isValidProfile(profile)) {
        renderProfileSummary();
        return;
      }

      state.profile = profile;
      saveProfile();
      applyPersonalizedTargets(profile, selectedTreatmentState());
    });

    weightForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const date = weightDateInput.value || selectedDate;
      const weightKg = roundOne(Number(weightValueKgInput.value || 0));
      if (weightKg <= 0) return;
      const existing = weightHistory.find((x) => x.date === date);
      if (existing) {
        existing.weightKg = weightKg;
      } else {
        weightHistory.push({ date, weightKg });
      }
      saveWeightHistory();
      renderWeightChart();
    });

    saveSymptomsButton.addEventListener("click", () => {
      const symptoms = [];
      symptomForm.querySelectorAll('input[type="checkbox"]').forEach((input) => {
        if (input.checked) symptoms.push(input.value);
      });
      state.symptoms = symptoms;
      saveState();
      renderMeals();
    });

    targetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      state.targets = {
        calories: Number(targetCalories.value || 0),
        protein: roundTwo(Number(targetProtein.value || 0)),
        carbs: roundTwo(Number(targetCarbs.value || 0)),
        fat: roundTwo(Number(targetFat.value || 0))
      };
      saveState();
      renderMeals();
      renderProfileSummary();
    });

    lookupBarcodeButton.addEventListener("click", async () => {
      const servingGrams = Number(mealServingInput.value || 100);
      setFoodLookupStatus("Looking up barcode...", false);
      try {
        const result = await lookupFoodByBarcode(mealBarcodeInput.value, servingGrams);
        mealNameInput.value = result.name;
        applyMealMacroValues(result.macros);
        setFoodLookupStatus(`Autofilled from ${result.source}.`, false);
        setFoodSafetyNote(`Food safety note: ${result.safety}`);
      } catch (err) {
        setFoodLookupStatus(
          err instanceof Error ? err.message : "Barcode lookup failed.",
          true
        );
      }
    });

    exportClinicianReportButton.addEventListener("click", exportClinicianReport);

    autofillFoodButton.addEventListener("click", runFoodAutofill);
    foodLibrarySearch.addEventListener("input", renderFoodLibrary);
    foodFilterHighProtein.addEventListener("change", renderFoodLibrary);
    foodFilterPlantBased.addEventListener("change", renderFoodLibrary);
    foodFilterSoftTexture.addEventListener("change", renderFoodLibrary);

    foodLibraryResults.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const selectedFood = target.getAttribute("data-food-use");
      if (!selectedFood) return;
      mealNameInput.value = selectedFood;
      mealServingInput.value = 100;
      runFoodAutofill();
      mealNameInput.scrollIntoView({ behavior: "smooth", block: "center" });
      mealNameInput.focus();
    });

    historyList.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const openDate = target.getAttribute("data-open-date");
      if (!openDate) return;
      loadDateState(openDate);
    });

    quickAddFoods.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const food = target.getAttribute("data-quick-food");
      if (!food) return;
      mealNameInput.value = food;
      mealServingInput.value = 100;
      runFoodAutofill();
    });

    mealNameInput.addEventListener("blur", () => {
      if (!mealNameInput.value.trim()) return;
      runFoodAutofill();
    });

    mealServingInput.addEventListener("change", () => {
      if (!mealNameInput.value.trim()) return;
      runFoodAutofill();
    });

    mealForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const meal = {
        name: mealNameInput.value.trim(),
        servingGrams: Number(mealServingInput.value || 100),
        calories: Number(mealCaloriesInput.value || 0),
        protein: roundTwo(Number(mealProteinInput.value || 0)),
        carbs: roundTwo(Number(mealCarbsInput.value || 0)),
        fat: roundTwo(Number(mealFatInput.value || 0))
      };

      state.meals.push(meal);
      saveState();
      mealForm.reset();
      mealBarcodeInput.value = "";
      mealServingInput.value = 100;
      setFoodLookupStatus("", false);
      setFoodSafetyNote("");
      renderMeals();
    });

    mealList.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      const idx = target.getAttribute("data-remove");
      if (idx == null) return;
      state.meals.splice(Number(idx), 1);
      saveState();
      renderMeals();
    });

    clearEntriesButton.addEventListener("click", () => {
      state.meals = [];
      saveState();
      renderMeals();
    });
  }

  function init() {
    initCancerOptions();
    populateCuratedFoodOptions();
    renderFoodLibrary();
    loadUsdaApiKeyInput();
    loadWeightHistory();
    loadProfile();
    selectedDate = isoToday();
    dashboardDate.value = selectedDate;
    weightDateInput.value = selectedDate;
    const hasDailyState = loadState(selectedDate);

    updateProfileUnitVisibility();

    if (state.profile) {
      syncProfileInputs();
      if (!hasDailyState) {
        applyPersonalizedTargets(state.profile, selectedTreatmentState());
      }
    }

    syncTargetInputs();
    syncSymptomForm();
    renderProfileSummary();
    hookEvents();
    renderRecommendations();
    renderMeals();
    renderWeightChart();
    renderHistory();
  }

  init();
})();
