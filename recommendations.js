const TOP_CANCERS = [
  "Breast Cancer",
  "Prostate Cancer",
  "Lung Cancer (including bronchus)",
  "Colorectal Cancer (colon and rectum)",
  "Melanoma of the Skin",
  "Bladder Cancer",
  "Kidney and Renal Pelvis Cancer",
  "Non-Hodgkin Lymphoma",
  "Uterine Corpus Cancer",
  "Pancreatic Cancer"
];

const RECOMMENDATION_SAFETY_NOTE =
  "Educational only. Contact your care team for medical advice.";

const RECOMMENDATION_CATALOG = [
  {
    id: "universal-monitoring",
    title: "Monitor intake and weight trends consistently",
    patientText:
      "Track food intake, symptoms, and weekly weight trends. If intake declines or weight drops unexpectedly, contact your oncology care team promptly.",
    triggers: {
      cancerType: [],
      treatmentType: [],
      symptoms: [],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionCarePDQ", "glimMalnutrition2019"],
    evidenceTags: ["Guideline", "Government", "PeerReviewed"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "universal-protein-energy",
    title: "Use protein and energy goals as a treatment support tool",
    patientText:
      "During cancer care, protein and energy targets support function and recovery. If you cannot meet targets for several days, contact your oncology dietitian/care team.",
    triggers: {
      cancerType: [],
      treatmentType: [],
      symptoms: [],
      intakeDeficits: ["low_intake", "appetite_reduced", "weight_loss_moderate", "weight_loss_severe"],
      weightTrendFlags: []
    },
    sourceIds: ["espenCancerGuideline2017Pdf", "espenCancerPractical2021PubMed", "ascoCachexia2020JCO"],
    evidenceTags: ["Guideline", "PeerReviewed"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "treatment-chemo",
    title: "Chemotherapy phase meal pattern",
    patientText:
      "If chemotherapy affects appetite, use small frequent meals and fluids between meals. If symptoms keep worsening, contact your care team.",
    triggers: {
      cancerType: [],
      treatmentType: ["chemotherapy"],
      symptoms: [],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf", "acsEatingProblemsHub"],
    evidenceTags: ["Government", "CancerCenter"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "treatment-radiation",
    title: "Radiation phase nutrition support",
    patientText:
      "When radiation side effects reduce intake, prioritize soft and easy-to-tolerate foods and hydration. Contact your care team if you cannot maintain intake.",
    triggers: {
      cancerType: [],
      treatmentType: ["radiation"],
      symptoms: [],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf", "espenCancerPractical2021Pdf"],
    evidenceTags: ["Government", "Guideline"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "treatment-surgery",
    title: "Perioperative recovery nutrition",
    patientText:
      "Around surgery, maintaining intake and protein is important for recovery. If intake is poor before or after surgery, contact your care team quickly.",
    triggers: {
      cancerType: [],
      treatmentType: ["surgery"],
      symptoms: [],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionDuringCancer"],
    evidenceTags: ["Guideline", "Government"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "treatment-immunotherapy-targeted",
    title: "Immunotherapy/targeted treatment symptom tracking",
    patientText:
      "During immunotherapy or targeted treatment, keep close symptom and intake logs so changes can be reviewed early with your care team.",
    triggers: {
      cancerType: [],
      treatmentType: ["immunotherapy", "targeted"],
      symptoms: [],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["nciNutritionDuringCancer", "nciNutritionCarePDQ", "espenCancerPractical2021Pdf"],
    evidenceTags: ["Government", "Guideline"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "symptom-fatigue",
    title: "Fatigue-aware energy conservation for meals",
    patientText:
      "If fatigue limits cooking/eating, use simpler meal setups, nutrition supplements, and support from caregivers; contact your care team if this persists.",
    triggers: {
      cancerType: [],
      treatmentType: [],
      symptoms: ["fatigue"],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["nccnFatiguePatientPdf", "nciNutritionDuringCancer"],
    evidenceTags: ["Guideline", "Government"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "symptom-appetite-loss",
    title: "Appetite-loss supportive eating plan",
    patientText:
      "When appetite is low, prioritize nutrient-dense foods first, eat small frequent meals, and contact your care team if intake stays low.",
    triggers: {
      cancerType: [],
      treatmentType: [],
      symptoms: ["appetite_loss", "early_satiety"],
      intakeDeficits: ["appetite_reduced", "low_intake"],
      weightTrendFlags: []
    },
    sourceIds: ["nciNutritionCarePDQ", "nciEatingHintsPdf", "ascoCachexia2020PubMed"],
    evidenceTags: ["Government", "PeerReviewed"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "symptom-taste-changes",
    title: "Taste and smell change support",
    patientText:
      "Taste or smell changes can reduce intake. Trial temperature, seasoning, texture, and oral-care adjustments; contact your care team if eating continues to decline.",
    triggers: {
      cancerType: [],
      treatmentType: [],
      symptoms: ["taste_changes"],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["mskTasteChanges", "acsTasteSmell", "nciEatingHintsPdf"],
    evidenceTags: ["CancerCenter", "Government"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "symptom-mouth-sores",
    title: "Mouth sore and mucositis food texture plan",
    patientText:
      "If mouth soreness makes eating painful, use softer foods and avoid irritating textures/flavors; contact your care team when pain limits hydration or intake.",
    triggers: {
      cancerType: [],
      treatmentType: [],
      symptoms: ["mouth_sores", "dry_mouth", "difficulty_swallowing"],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["pennMucositisTipSheet", "nciEatingHintsPdf", "acsEatingProblemsHub"],
    evidenceTags: ["CancerCenter", "Government"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "symptom-gi-pattern",
    title: "GI symptom hydration and escalation plan",
    patientText:
      "For ongoing nausea, vomiting, diarrhea, or constipation, maintain hydration tracking and contact your care team when symptoms interfere with food/fluid intake.",
    triggers: {
      cancerType: [],
      treatmentType: [],
      symptoms: ["nausea", "vomiting", "diarrhea", "constipation", "bloating"],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf", "acsEatingProblemsHub"],
    evidenceTags: ["Government", "CancerCenter"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "cancer-pancreatic-epi",
    title: "Pancreatic cancer malabsorption and enzyme discussion prompt",
    patientText:
      "With pancreatic cancer and possible malabsorption symptoms, discuss pancreatic enzyme evaluation and nutrition strategy with your care team.",
    triggers: {
      cancerType: ["Pancreatic Cancer"],
      treatmentType: [],
      symptoms: ["bloating", "diarrhea", "weight_loss_signal"],
      intakeDeficits: ["weight_loss_moderate", "weight_loss_severe", "low_intake"],
      weightTrendFlags: ["recent_loss"]
    },
    sourceIds: ["agaEpi2023FullText", "agaEpi2023PubMed", "espenCancerPractical2021Pdf"],
    evidenceTags: ["PeerReviewed", "Guideline"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "cancer-kidney-dialysis",
    title: "Kidney cancer and dialysis coordination",
    patientText:
      "If kidney cancer care overlaps with dialysis or renal restrictions, use oncology and renal team guidance together before changing protein/fluid/electrolyte intake.",
    triggers: {
      cancerType: ["Kidney and Renal Pelvis Cancer"],
      treatmentType: [],
      symptoms: [],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["espenCancerGuideline2017Pdf", "nciNutritionCarePDQ", "nccnPatientGuidelinesLibrary"],
    evidenceTags: ["Guideline", "Government"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  },
  {
    id: "cancer-general-nccn-module",
    title: "Cancer-type education module",
    patientText:
      "Review your cancer-type education materials and nutrition symptom guidance, then bring questions to your care team.",
    triggers: {
      cancerType: TOP_CANCERS,
      treatmentType: [],
      symptoms: [],
      intakeDeficits: [],
      weightTrendFlags: []
    },
    sourceIds: ["nccnPatientGuidelinesLibrary", "nciNutritionDuringCancer"],
    evidenceTags: ["Guideline", "Government"],
    safetyNote: RECOMMENDATION_SAFETY_NOTE
  }
];

function overlaps(triggerValues, contextValues) {
  if (!Array.isArray(triggerValues) || triggerValues.length === 0) return true;
  if (!Array.isArray(contextValues) || contextValues.length === 0) return false;
  return triggerValues.some((item) => contextValues.includes(item));
}

function recommendationMatches(rec, context) {
  const triggers = rec.triggers || {};
  const ctx = context || {};

  const cancerOk = overlaps(triggers.cancerType, [ctx.cancerType]);
  const treatmentOk = overlaps(triggers.treatmentType, [ctx.treatmentType]);
  const symptomOk = overlaps(triggers.symptoms, ctx.symptoms || []);
  const intakeOk = overlaps(triggers.intakeDeficits, ctx.intakeDeficits || []);
  const weightTrendOk = overlaps(triggers.weightTrendFlags, ctx.weightTrendFlags || []);

  return cancerOk && treatmentOk && symptomOk && intakeOk && weightTrendOk;
}

function buildRecommendationContext(profile, dayTotals, dayTargets) {
  const symptoms = Array.isArray(profile.symptoms) ? [...profile.symptoms] : [];
  const intakeDeficits = [];
  const weightTrendFlags = [];

  if (profile.appetite === "reduced" || profile.appetite === "very_low") {
    intakeDeficits.push("appetite_reduced");
  }
  if (profile.weightLoss === "moderate") {
    intakeDeficits.push("weight_loss_moderate");
    weightTrendFlags.push("recent_loss");
  }
  if (profile.weightLoss === "severe") {
    intakeDeficits.push("weight_loss_severe");
    weightTrendFlags.push("recent_loss");
  }

  if (dayTargets && dayTotals) {
    if (dayTargets.calories > 0 && dayTotals.calories < dayTargets.calories * 0.8) {
      intakeDeficits.push("low_intake");
    }
  }

  return {
    cancerType: profile.cancerType,
    treatmentType: profile.treatmentType,
    symptoms,
    intakeDeficits,
    weightTrendFlags
  };
}

function getPolicyRecommendations(profile, dayTotals, dayTargets) {
  const context = buildRecommendationContext(profile, dayTotals, dayTargets);
  return RECOMMENDATION_CATALOG.filter((rec) => recommendationMatches(rec, context));
}

window.TOP_CANCERS = TOP_CANCERS;
window.RECOMMENDATION_CATALOG = RECOMMENDATION_CATALOG;
window.getPolicyRecommendations = getPolicyRecommendations;
