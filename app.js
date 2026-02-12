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
  const mealList = document.getElementById("mealList");
  const clearEntriesButton = document.getElementById("clearEntries");

  const targetCalories = document.getElementById("targetCalories");
  const targetProtein = document.getElementById("targetProtein");
  const targetCarbs = document.getElementById("targetCarbs");
  const targetFat = document.getElementById("targetFat");

  const mealNameInput = document.getElementById("mealName");
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
  const foodFilterHighProtein = document.getElementById("foodFilterHighProtein");
  const foodFilterPlantBased = document.getElementById("foodFilterPlantBased");
  const foodFilterSoftTexture = document.getElementById("foodFilterSoftTexture");
  const foodLibraryCount = document.getElementById("foodLibraryCount");
  const foodLibraryResults = document.getElementById("foodLibraryResults");

  const PROFILE_STORAGE_KEY = "oncoNutritionProfile:v2";

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
    }
  ];

  const storageKeyForDate = () => {
    const today = new Date().toISOString().slice(0, 10);
    return `oncoNutritionLog:${today}`;
  };

  let isFoodLookupRunning = false;

  let state = {
    profile: null,
    targets: { calories: 2000, protein: 90, carbs: 230, fat: 70 },
    meals: []
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

  function loadState() {
    const raw = localStorage.getItem(storageKeyForDate());
    if (!raw) return false;

    try {
      const parsed = JSON.parse(raw);
      if (parsed.targets && parsed.meals) {
        state.targets = parsed.targets;
        state.meals = parsed.meals;
        return true;
      }
    } catch (_err) {
      // Ignore malformed local storage.
    }

    return false;
  }

  function saveState() {
    localStorage.setItem(
      storageKeyForDate(),
      JSON.stringify({ targets: state.targets, meals: state.meals })
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
      state.profile = parsed;
    } catch (_err) {
      // Ignore malformed profile storage.
    }
  }

  function saveProfile() {
    if (!state.profile) return;
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state.profile));
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

  function calculatePersonalizedTargets(profile) {
    const { gender, age, heightCm, weightKg, activityFactor } = profile;

    const bmrBase = 10 * weightKg + 6.25 * heightCm - 5 * age;
    const bmr = gender === "male" ? bmrBase + 5 : bmrBase - 161;
    const tdee = bmr * activityFactor;

    const calories = Math.max(1200, Math.round(tdee / 10) * 10);
    const protein = Math.round(weightKg * 1.4);
    const fat = Math.round((calories * 0.3) / 9);
    const carbs = Math.max(50, Math.round((calories - protein * 4 - fat * 9) / 4));

    return { calories, protein, carbs, fat };
  }

  function renderProfileSummary() {
    if (!state.profile) {
      profileSummary.innerHTML = "<p class='muted'>No profile saved yet.</p>";
      return;
    }

    const helloName = state.profile.name ? `${state.profile.name}` : "there";
    const convertedHeight = cmToFeetInches(state.profile.heightCm);

    profileSummary.innerHTML = `
      <p><strong>Hello, ${helloName}.</strong></p>
      <p class="muted">Profile: ${state.profile.gender}, ${state.profile.age} years, ${roundOne(state.profile.heightCm)} cm (${convertedHeight.feet} ft ${convertedHeight.inches} in), ${roundOne(state.profile.weightKg)} kg (${roundOne(kgToLb(state.profile.weightKg))} lb).</p>
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

    mealList.innerHTML = "";
    if (state.meals.length === 0) {
      mealList.innerHTML = "<p class='muted'>No entries yet for today.</p>";
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
      protein: roundOne(macros100g.protein * factor),
      carbs: roundOne(macros100g.carbs * factor),
      fat: roundOne(macros100g.fat * factor)
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

  async function lookupFoodMacros(name, servingGrams) {
    const curated = findCuratedFoodMatch(name);
    if (curated) {
      return {
        source: `curated oncology-safe database (${curated.name})`,
        safety: curated.safety,
        macros: scaleFoodMacros(curated.macros100g, servingGrams)
      };
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

  function applyPersonalizedTargets(profile) {
    state.targets = calculatePersonalizedTargets(profile);
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
      profile.activityFactor > 0
    );
  }

  function hookEvents() {
    cancerSelect.addEventListener("change", renderRecommendations);
    document.querySelectorAll('input[name="chemoStatus"]').forEach((input) => {
      input.addEventListener("change", renderRecommendations);
    });
    document.querySelectorAll('input[name="dialysisStatus"]').forEach((input) => {
      input.addEventListener("change", renderRecommendations);
    });

    profileHeightUnit.addEventListener("change", handleHeightUnitChange);
    profileWeightUnit.addEventListener("change", handleWeightUnitChange);

    profileForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const profile = collectProfileFromForm();
      if (!isValidProfile(profile)) {
        renderProfileSummary();
        return;
      }

      state.profile = profile;
      saveProfile();
      applyPersonalizedTargets(profile);
    });

    targetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      state.targets = {
        calories: Number(targetCalories.value || 0),
        protein: Number(targetProtein.value || 0),
        carbs: Number(targetCarbs.value || 0),
        fat: Number(targetFat.value || 0)
      };
      saveState();
      renderMeals();
      renderProfileSummary();
    });

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
        protein: Number(mealProteinInput.value || 0),
        carbs: Number(mealCarbsInput.value || 0),
        fat: Number(mealFatInput.value || 0)
      };

      state.meals.push(meal);
      saveState();
      mealForm.reset();
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
    loadProfile();
    const hasDailyState = loadState();

    updateProfileUnitVisibility();

    if (state.profile) {
      syncProfileInputs();
      if (!hasDailyState) {
        applyPersonalizedTargets(state.profile);
      }
    }

    syncTargetInputs();
    renderProfileSummary();
    hookEvents();
    renderRecommendations();
    renderMeals();
  }

  init();
})();
