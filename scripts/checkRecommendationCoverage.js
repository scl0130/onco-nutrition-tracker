const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const context = {
  window: {},
  console
};
context.global = context;

function load(file) {
  const code = fs.readFileSync(path.join(root, file), "utf8");
  vm.runInNewContext(code, context, { filename: file });
}

load("sourcesRegistry.js");
load("src/data/recommendationsCatalog.js");

const registry = context.window.SOURCES_REGISTRY || {};
const catalog = context.window.RECOMMENDATIONS_CATALOG || [];

const errors = [];

if (catalog.length < 30) {
  errors.push(`Expected at least 30 recommendations, found ${catalog.length}.`);
}

const cancerKeys = ["breast", "prostate", "lung", "colorectal", "melanoma", "bladder", "kidney", "lymphoma", "uterine", "pancreatic"];
cancerKeys.forEach((key) => {
  const count = catalog.filter((r) => (r.triggers && Array.isArray(r.triggers.cancerTypes) ? r.triggers.cancerTypes.includes(key) : false)).length;
  if (count < 3) {
    errors.push(`Cancer '${key}' has ${count} recommendations, expected at least 3.`);
  }
});

const treatments = ["chemotherapy", "radiation", "surgery", "immunotherapy", "targeted", "none"];
treatments.forEach((tx) => {
  const count = catalog.filter((r) => (r.triggers && Array.isArray(r.triggers.treatments) ? r.triggers.treatments.includes(tx) : false)).length;
  if (count < 3) {
    errors.push(`Treatment '${tx}' has ${count} recommendations, expected at least 3.`);
  }
});

const commonSymptoms = ["nausea", "vomiting", "taste_changes", "mouth_sores", "diarrhea", "constipation", "appetite_loss"];
commonSymptoms.forEach((symptom) => {
  const count = catalog.filter((r) => {
    const t = r.triggers || {};
    return (Array.isArray(t.symptomsAny) && t.symptomsAny.includes(symptom)) ||
      (Array.isArray(t.symptomsAll) && t.symptomsAll.includes(symptom));
  }).length;
  if (count < 2) {
    errors.push(`Symptom '${symptom}' has ${count} recommendations, expected at least 2.`);
  }
});

catalog.forEach((rec) => {
  if (!Array.isArray(rec.sourceIds) || rec.sourceIds.length === 0) {
    errors.push(`${rec.id}: missing sourceIds.`);
    return;
  }
  rec.sourceIds.forEach((sourceId) => {
    if (!registry[sourceId]) {
      errors.push(`${rec.id}: source '${sourceId}' not found in registry.`);
    }
  });
});

if (errors.length) {
  console.error("Coverage check failed:");
  errors.forEach((e) => console.error(` - ${e}`));
  process.exit(1);
}

console.log(`Coverage check passed with ${catalog.length} recommendations.`);
