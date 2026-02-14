(function () {
  function cancerKeyFromLabel(label) {
    const value = String(label || "");
    if (value.includes("Breast")) return "breast";
    if (value.includes("Prostate")) return "prostate";
    if (value.includes("Lung")) return "lung";
    if (value.includes("Colorectal")) return "colorectal";
    if (value.includes("Melanoma")) return "melanoma";
    if (value.includes("Bladder")) return "bladder";
    if (value.includes("Kidney")) return "kidney";
    if (value.includes("Non-Hodgkin")) return "lymphoma";
    if (value.includes("Uterine")) return "uterine";
    if (value.includes("Pancreatic")) return "pancreatic";
    return "";
  }

  function normalizeSymptoms(symptoms) {
    return (Array.isArray(symptoms) ? symptoms : []).filter((s) => s && s !== "none");
  }

  function isGenericTrackingRecommendation(rec) {
    const id = String(rec && rec.id || "");
    if (id === "universal_monitor_intake_weight") return true;
    if (/_specific_[123]$/.test(id)) return true;
    const actions = Array.isArray(rec && rec.patientTextActions) ? rec.patientTextActions : [];
    const text = actions.join(" ").toLowerCase();
    const hasTrackingVerbs = text.includes("track ") || text.includes("log ") || text.includes("record ");
    const hasSpecificClinicalContent =
      text.includes("g/kg") ||
      text.includes("kcal") ||
      text.includes("ons") ||
      text.includes("enteral") ||
      text.includes("parenteral") ||
      text.includes("epa") ||
      text.includes("carbohydrate loading") ||
      text.includes("mucositis");
    return hasTrackingVerbs && !hasSpecificClinicalContent;
  }

  function recommendationSpecificity(rec) {
    const t = rec.triggers || {};
    const symptomsAny = Array.isArray(t.symptomsAny) ? t.symptomsAny.length : 0;
    const symptomsAll = Array.isArray(t.symptomsAll) ? t.symptomsAll.length : 0;
    const flagsAny = Array.isArray(t.flagsAny) ? t.flagsAny.length : 0;
    const hasTreatment = Array.isArray(t.treatments) && t.treatments.length > 0 ? 1 : 0;
    const hasCancerType = Array.isArray(t.cancerTypes) && t.cancerTypes.length > 0 ? 1 : 0;
    return symptomsAny * 2 + symptomsAll * 2 + flagsAny * 2 + hasTreatment + hasCancerType;
  }

  function validateSourcesForRecommendation(rec) {
    const registry = window.SOURCES_REGISTRY || {};
    const allowlist = window.ALLOWED_SOURCE_DOMAINS || [];
    if (!Array.isArray(rec.sourceIds) || rec.sourceIds.length === 0) {
      return { valid: false, error: `${rec.id}: missing sourceIds` };
    }

    for (const sourceId of rec.sourceIds) {
      const source = registry[sourceId];
      if (!source) return { valid: false, error: `${rec.id}: missing source ${sourceId}` };
      try {
        const host = new URL(source.url).hostname.toLowerCase();
        const allowed = allowlist.some((domain) => host === domain || host.endsWith(`.${domain}`));
        if (!allowed) return { valid: false, error: `${rec.id}: source ${sourceId} outside allowlist` };
      } catch (_err) {
        return { valid: false, error: `${rec.id}: invalid URL for source ${sourceId}` };
      }
    }

    return { valid: true };
  }

  function triggerMatch(rec, context) {
    const t = rec.triggers || {};
    let score = 0;
    const reasons = [];
    let profileSelectionMatch = false;

    if (Array.isArray(t.cancerTypes) && t.cancerTypes.length > 0) {
      if (!t.cancerTypes.includes(context.cancerType)) return { matched: false, score: 0 };
      score += 4;
      reasons.push(`Cancer type: ${context.cancerType}`);
      profileSelectionMatch = true;
    }

    if (Array.isArray(t.treatments) && t.treatments.length > 0) {
      if (!t.treatments.includes(context.treatmentType)) return { matched: false, score: 0 };
      score += 3;
      reasons.push(`Treatment: ${context.treatmentType}`);
      profileSelectionMatch = true;
    }

    if (Array.isArray(t.symptomsAny) && t.symptomsAny.length > 0) {
      const overlap = t.symptomsAny.filter((s) => context.symptoms.includes(s));
      if (!overlap.length) return { matched: false, score: 0 };
      score += Math.min(3, overlap.length);
      reasons.push(`Symptoms: ${overlap.join(", ")}`);
      profileSelectionMatch = true;
    }

    if (Array.isArray(t.symptomsAll) && t.symptomsAll.length > 0) {
      const allPresent = t.symptomsAll.every((s) => context.symptoms.includes(s));
      if (!allPresent) return { matched: false, score: 0 };
      score += 2;
      reasons.push(`Symptoms (all): ${t.symptomsAll.join(", ")}`);
      profileSelectionMatch = true;
    }

    if (Array.isArray(t.flagsAny) && t.flagsAny.length > 0) {
      const overlap = t.flagsAny.filter((f) => context.flags.includes(f));
      if (!overlap.length) return { matched: false, score: 0 };
      score += Math.min(4, overlap.length);
      reasons.push(`Risk flags: ${overlap.join(", ")}`);
    }

    return { matched: true, score, reasons, profileSelectionMatch };
  }

  function getRecommendationsForUser(input) {
    const profile = input.profile || {};
    const dailyTotals = input.dailyTotals || {};
    const targets = input.targets || {};
    const weightTrendFlagsInput = Array.isArray(input.weightTrendFlags) ? input.weightTrendFlags : [];
    const catalog = Array.isArray(window.RECOMMENDATIONS_CATALOG) ? window.RECOMMENDATIONS_CATALOG : [];

    const derived = typeof window.deriveFlags === "function"
      ? window.deriveFlags({
        profile,
        symptoms: profile.symptoms,
        dailyTotals,
        targets,
        weightHistory: input.weightHistory || []
      })
      : { flags: [] };

    const context = {
      cancerType: cancerKeyFromLabel(profile.cancerType),
      treatmentType: String(profile.treatmentType || "none"),
      symptoms: normalizeSymptoms(profile.symptoms),
      flags: [...new Set([...(derived.flags || []), ...weightTrendFlagsInput])]
    };

    const validRecs = [];
    const validationErrors = [];

    catalog.forEach((rec) => {
      const sourceValidation = validateSourcesForRecommendation(rec);
      if (!sourceValidation.valid) {
        validationErrors.push(sourceValidation.error);
        return;
      }
      const match = triggerMatch(rec, context);
      if (!match.matched) return;
      // User preference: show recommendations only for profile-selected context
      // (cancer type, treatment, and selected symptoms), not generic/global cards.
      if (!match.profileSelectionMatch) return;
      validRecs.push({ ...rec, _matchScore: match.score, _matchReasons: match.reasons || [] });
    });

    if (validationErrors.length) {
      console.warn("Recommendation validation errors", validationErrors);
    }

    validRecs.sort((a, b) => {
      const aScore = Number(a.priority || 0) + Number(a._matchScore || 0) + recommendationSpecificity(a) - (isGenericTrackingRecommendation(a) ? 6 : 0);
      const bScore = Number(b.priority || 0) + Number(b._matchScore || 0) + recommendationSpecificity(b) - (isGenericTrackingRecommendation(b) ? 6 : 0);
      if (bScore !== aScore) return bScore - aScore;
      if (b.priority !== a.priority) return b.priority - a.priority;
      return b._matchScore - a._matchScore;
    });

    const diversified = [];
    let genericCancerSpecificCount = 0;
    let universalGenericCount = 0;
    validRecs.forEach((rec) => {
      const id = String(rec.id || "");
      if (/_specific_[123]$/.test(id)) {
        if (genericCancerSpecificCount >= 1) return;
        genericCancerSpecificCount += 1;
      }
      if (id === "universal_monitor_intake_weight") {
        if (universalGenericCount >= 1) return;
        universalGenericCount += 1;
      }
      diversified.push(rec);
    });

    const maxResults = Math.min(12, Math.max(1, Number(input.maxResults || 6)));

    return {
      recommendations: diversified.slice(0, maxResults),
      allRecommendations: diversified.slice(0, 12),
      validationErrors
    };
  }

  window.getRecommendationsForUser = getRecommendationsForUser;
})();
