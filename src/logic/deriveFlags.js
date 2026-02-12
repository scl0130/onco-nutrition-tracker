(function () {
  function roundOne(value) {
    return Math.round(value * 10) / 10;
  }

  function recentWeightLossPercent(weightHistory) {
    if (!Array.isArray(weightHistory) || weightHistory.length < 2) return 0;
    const sorted = [...weightHistory].sort((a, b) => (a.date > b.date ? 1 : -1));
    const latest = sorted[sorted.length - 1];
    const latestDate = new Date(latest.date);
    if (Number.isNaN(latestDate.getTime())) return 0;

    const prior = [...sorted]
      .reverse()
      .find((item) => {
        const d = new Date(item.date);
        if (Number.isNaN(d.getTime())) return false;
        const days = (latestDate - d) / (1000 * 60 * 60 * 24);
        return days >= 30 && days <= 90;
      });

    if (!prior || !prior.weightKg || !latest.weightKg) return 0;
    const loss = Number(prior.weightKg) - Number(latest.weightKg);
    if (loss <= 0) return 0;
    return roundOne((loss / Number(prior.weightKg)) * 100);
  }

  function deriveFlags(input) {
    const profile = input.profile || {};
    const symptoms = Array.isArray(input.symptoms) ? input.symptoms : [];
    const dailyTotals = input.dailyTotals || { calories: 0, protein: 0 };
    const targets = input.targets || { calories: 0, protein: 0 };
    const weightHistory = input.weightHistory || [];

    const flags = new Set();

    const proteinRemaining = Math.max(0, Number(targets.protein || 0) - Number(dailyTotals.protein || 0));
    const caloriesRemaining = Math.max(0, Number(targets.calories || 0) - Number(dailyTotals.calories || 0));

    if (Number(targets.protein || 0) > 0 && proteinRemaining > Math.max(20, Number(targets.protein) * 0.2)) {
      flags.add("protein_deficit");
    }

    if (Number(targets.calories || 0) > 0 && caloriesRemaining > Math.max(300, Number(targets.calories) * 0.2)) {
      flags.add("calorie_deficit");
    }

    const lossPct = recentWeightLossPercent(weightHistory);
    if (lossPct >= 5) {
      flags.add("weight_loss_concerning");
    }

    if (profile.weightLoss === "moderate" || profile.weightLoss === "severe") {
      flags.add("weight_loss_concerning");
    }

    const hasGiLossSymptom = symptoms.includes("diarrhea") || symptoms.includes("vomiting");
    if (hasGiLossSymptom && (flags.has("calorie_deficit") || profile.appetite === "very_low" || profile.appetite === "reduced")) {
      flags.add("dehydration_risk");
    }

    const pancreatic = profile.cancerType === "Pancreatic Cancer";
    const malabsorptionSymptoms = symptoms.includes("diarrhea") || symptoms.includes("greasy_stools") || symptoms.includes("floating_stools");
    if (pancreatic && malabsorptionSymptoms) {
      flags.add("possible_malabsorption");
    }

    return {
      flags: Array.from(flags),
      proteinRemaining: roundOne(proteinRemaining),
      caloriesRemaining: Math.round(caloriesRemaining),
      recentWeightLossPercent: lossPct
    };
  }

  window.deriveFlags = deriveFlags;
})();
