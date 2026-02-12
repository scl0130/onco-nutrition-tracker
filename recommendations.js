const APP_SOURCES = {
  nciStats: {
    title: "NCI Cancer Statistics (2025 common cancers)",
    org: "National Cancer Institute",
    url: "https://www.cancer.gov/about-cancer/understanding/statistics",
    type: "Government"
  },
  nciNutrition: {
    title: "Nutrition During Cancer Treatment",
    org: "National Cancer Institute",
    url: "https://www.cancer.gov/about-cancer/treatment/side-effects/nutrition",
    type: "Government"
  },
  nciFoodSafety: {
    title: "Food Safety for People with Cancer",
    org: "National Cancer Institute",
    url: "https://www.cancer.gov/about-cancer/treatment/side-effects/nutrition#food-safety-during-cancer-treatment",
    backupUrl: "https://www.cancer.gov/about-cancer/treatment/side-effects/nutrition",
    type: "Government"
  },
  cdcNeutropenia: {
    title: "Neutropenia and Risk for Infection",
    org: "CDC",
    url: "https://www.cdc.gov/cancer-preventing-infections/patients/neutropenia.html",
    type: "Government"
  },
  fdaHighRisk: {
    title: "Food Safety for People with Cancer/Weakened Immune Systems",
    org: "U.S. FDA",
    url: "https://www.fda.gov/food/people-risk-foodborne-illness/food-safety-older-adults-and-people-cancer-diabetes-hivaids-organ-transplants-and-autoimmune",
    backupUrl: "https://www.fda.gov/food/people-risk-foodborne-illness",
    type: "Government"
  },
  niddkDialysis: {
    title: "Eating & Nutrition for Hemodialysis",
    org: "NIDDK (NIH)",
    url: "https://www.niddk.nih.gov/health-information/kidney-disease/kidney-failure/hemodialysis/eating-nutrition",
    type: "Government"
  },
  acsGuideline: {
    title: "ACS Nutrition and Physical Activity Guideline for Cancer Survivors (2022)",
    org: "CA: A Cancer Journal for Clinicians",
    url: "https://pubmed.ncbi.nlm.nih.gov/35294043/",
    backupUrl: "https://acsjournals.onlinelibrary.wiley.com/doi/10.3322/caac.21719",
    type: "Peer-reviewed"
  },
  espenGuideline: {
    title: "ESPEN Practical Guideline: Clinical Nutrition in Cancer (2021)",
    org: "Clinical Nutrition",
    url: "https://pubmed.ncbi.nlm.nih.gov/33946039/",
    backupUrl: "https://doi.org/10.1016/j.clnu.2021.02.005",
    type: "Peer-reviewed"
  },
  esmoCachexia: {
    title: "Cancer Cachexia in Adult Patients: ESMO Clinical Practice Guideline (2021)",
    org: "ESMO Open",
    url: "https://pubmed.ncbi.nlm.nih.gov/34144781/",
    backupUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8233663/",
    type: "Peer-reviewed"
  }
};

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

const BASE_RECOMMENDATIONS = {
  normal: [
    {
      title: "Maintenance nutrition framework (normal / no active treatment)",
      bullets: [
        "Use balanced maintenance intake and monitor weight trends to keep lean mass stable.",
        "Protein remains important for recovery and long-term survivorship (often around 1.0-1.2 g/kg/day, individualized).",
        "Reassess needs when treatment status or symptoms change."
      ],
      sourceIds: ["acsGuideline", "espenGuideline", "nciNutrition"]
    },
    {
      title: "Long-term dietary pattern",
      bullets: [
        "Emphasize vegetables, fruits, whole grains, legumes, and high-quality proteins.",
        "Limit alcohol, processed meats, and high added-sugar foods.",
        "Keep regular follow-up with care team for nutrition and body composition changes."
      ],
      sourceIds: ["acsGuideline", "nciNutrition"]
    }
  ],
  off: [
    {
      title: "Energy and protein framework (off chemotherapy)",
      bullets: [
        "For many stable adult cancer patients, starting energy range is about 25-30 kcal/kg/day unless individualized testing is available.",
        "Protein is commonly targeted above 1.0 g/kg/day and up to about 1.5 g/kg/day when tolerated.",
        "Review weight, appetite, and intake trends regularly and adjust targets with your oncology dietitian."
      ],
      sourceIds: ["espenGuideline", "esmoCachexia", "nciNutrition"]
    },
    {
      title: "Diet quality and survivorship pattern",
      bullets: [
        "Prioritize vegetables, fruits, whole grains, legumes, and high-quality protein sources.",
        "Limit ultra-processed foods, processed/red meat, added sugars, and alcohol.",
        "Screen for malnutrition risk and involve oncology nutrition support early when weight or intake declines."
      ],
      sourceIds: ["acsGuideline", "nciNutrition", "espenGuideline"]
    }
  ],
  on: [
    {
      title: "Energy and protein support (on chemotherapy)",
      bullets: [
        "Baseline energy often starts in a similar range (about 25-30 kcal/kg/day), but should move toward higher intensity when appetite drops or unintentional weight loss appears.",
        "Protein needs are frequently pushed toward the upper end (for example ~1.2-1.5 g/kg/day) during active treatment and catabolic stress.",
        "If oral intake remains inadequate, escalate early to oral nutrition supplements and dietitian-led intervention."
      ],
      sourceIds: ["espenGuideline", "esmoCachexia", "nciNutrition"]
    },
    {
      title: "Symptom-driven meal planning",
      bullets: [
        "Use small, frequent meals and softer/easier foods during nausea, mouth soreness, taste changes, or early satiety.",
        "Track symptom days and hydration so calorie/protein goals can be adapted week-to-week.",
        "Ask your care team for medication and nutrition strategies early if intake drops for more than a few days."
      ],
      sourceIds: ["nciNutrition", "esmoCachexia"]
    },
    {
      title: "Food safety priority",
      bullets: [
        "Avoid undercooked/raw animal foods and unpasteurized dairy/juices.",
        "Use strict hand hygiene and safe food handling/storage temperatures.",
        "Ask your team when neutrophil counts are expected to be lowest after chemo."
      ],
      sourceIds: ["nciFoodSafety", "fdaHighRisk", "cdcNeutropenia"]
    }
  ]
};

const CANCER_OVERRIDES = {
  "Breast Cancer": [
    {
      title: "Breast cancer focus",
      bullets: [
        "Prioritize a high-fiber, plant-forward eating pattern with adequate lean protein.",
        "Limit alcohol and ultra-processed foods where possible.",
        "Track weight changes and discuss body-composition goals during and after treatment."
      ],
      sourceIds: ["acsGuideline", "nciNutrition", "espenGuideline"]
    }
  ],
  "Prostate Cancer": [
    {
      title: "Prostate cancer focus",
      bullets: [
        "Use a heart-healthy pattern emphasizing vegetables, legumes, whole grains, and fish when tolerated.",
        "Monitor weight and metabolic health, especially if hormonal therapy affects body composition.",
        "Maintain consistent protein intake to support muscle mass."
      ],
      sourceIds: ["acsGuideline", "nciNutrition", "espenGuideline"]
    }
  ],
  "Lung Cancer (including bronchus)": [
    {
      title: "Lung cancer focus",
      bullets: [
        "Risk of early weight loss can be high; prioritize calorie density and frequent protein feedings.",
        "If breathlessness or fatigue limits intake, use smaller frequent meals and oral nutrition supplements.",
        "Escalate nutrition support early when intake drops."
      ],
      sourceIds: ["espenGuideline", "esmoCachexia", "nciNutrition"]
    }
  ],
  "Colorectal Cancer (colon and rectum)": [
    {
      title: "GI-specific attention",
      bullets: [
        "Digestive cancers may raise risk of nutrition problems during treatment.",
        "Track bowel changes and hydration, and involve GI/oncology dietitian early."
      ],
      sourceIds: ["nciNutrition", "espenGuideline"]
    }
  ],
  "Melanoma of the Skin": [
    {
      title: "Melanoma focus",
      bullets: [
        "Maintain a balanced anti-inflammatory dietary pattern with adequate protein and hydration.",
        "During systemic therapy, monitor appetite and GI side effects and adjust meal texture/frequency.",
        "Use food safety precautions if immunosuppression risk is present."
      ],
      sourceIds: ["nciNutrition", "espenGuideline", "nciFoodSafety"]
    }
  ],
  "Bladder Cancer": [
    {
      title: "Bladder cancer focus",
      bullets: [
        "Prioritize hydration strategy individualized by clinical team guidance.",
        "If urinary symptoms affect tolerance, use smaller meals and avoid foods that worsen irritation for you.",
        "Maintain protein intake during active treatment and recovery."
      ],
      sourceIds: ["nciNutrition", "espenGuideline"]
    }
  ],
  "Pancreatic Cancer": [
    {
      title: "Early nutrition support",
      bullets: [
        "Pancreatic cancer is commonly associated with nutrition-impact symptoms.",
        "Prioritize early symptom-driven nutrition planning and frequent reassessment."
      ],
      sourceIds: ["nciNutrition", "espenGuideline"]
    }
  ],
  "Kidney and Renal Pelvis Cancer": [
    {
      title: "Renal comorbidity check",
      bullets: [
        "If kidney function is reduced, coordinate oncology and renal nutrition plans.",
        "Avoid unreviewed supplements unless approved by your oncology/renal team."
      ],
      sourceIds: ["nciNutrition", "niddkDialysis"]
    }
  ],
  "Non-Hodgkin Lymphoma": [
    {
      title: "Lymphoma focus",
      bullets: [
        "Use strict food safety practices during periods of neutropenia risk.",
        "Prioritize energy/protein repletion if appetite declines or treatment toxicities limit intake.",
        "Track symptoms and hydration closely around treatment cycles."
      ],
      sourceIds: ["nciFoodSafety", "cdcNeutropenia", "espenGuideline"]
    }
  ],
  "Uterine Corpus Cancer": [
    {
      title: "Uterine cancer focus",
      bullets: [
        "Use a balanced dietary pattern supporting healthy weight and lean mass retention.",
        "If treatment affects appetite/GI tolerance, use symptom-directed meal planning.",
        "Maintain consistent protein intake while monitoring long-term metabolic health."
      ],
      sourceIds: ["acsGuideline", "nciNutrition", "espenGuideline"]
    }
  ]
};

const CANCER_DAILY_TIPS = {
  "Breast Cancer": ["Use fiber-rich meals plus protein at each meal; limit alcohol exposure."],
  "Prostate Cancer": ["Lean proteins + plant-forward meals can support cardiometabolic health."],
  "Lung Cancer (including bronchus)": ["Aim for energy-dense, smaller frequent meals when appetite is low."],
  "Colorectal Cancer (colon and rectum)": ["Track bowel pattern and hydration; choose GI-tolerable textures."],
  "Melanoma of the Skin": ["Monitor treatment-related appetite changes and maintain hydration consistency."],
  "Bladder Cancer": ["Use a hydration routine and identify foods that worsen urinary irritation for you."],
  "Kidney and Renal Pelvis Cancer": ["Coordinate sodium/protein/fluid decisions with renal and oncology teams."],
  "Non-Hodgkin Lymphoma": ["Prioritize food safety and report prolonged poor intake quickly."],
  "Uterine Corpus Cancer": ["Balance protein and overall intake to support recovery and healthy weight."],
  "Pancreatic Cancer": ["Use early calorie/protein support if weight or appetite is falling."]
};

const KIDNEY_DIALYSIS = {
  on: {
    title: "Kidney cancer + on dialysis",
    bullets: [
      "Use a renal dietitian-guided plan for sodium, potassium, phosphorus, and fluids.",
      "Maintain adequate high-quality protein intake based on dialysis plan.",
      "Do not make independent fluid or electrolyte changes without team guidance."
    ],
    sourceIds: ["niddkDialysis"]
  },
  off: {
    title: "Kidney cancer + off dialysis",
    bullets: [
      "Continue routine nutrition screening and kidney function monitoring.",
      "If CKD is present, ask for individualized sodium/protein/electrolyte guidance."
    ],
    sourceIds: ["nciNutrition", "niddkDialysis"]
  }
};
