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
  off: [
    {
      title: "Core dietary pattern (off chemotherapy)",
      bullets: [
        "Prioritize vegetables, fruits, whole grains, legumes, and lean proteins.",
        "Limit ultra-processed foods, processed/red meat, added sugars, and alcohol.",
        "Review weight trends and appetite regularly with your care team."
      ],
      sourceIds: ["acsGuideline", "nciNutrition"]
    },
    {
      title: "Nutrition monitoring",
      bullets: [
        "Screen for malnutrition risk and involve an oncology dietitian early.",
        "Adjust plan based on symptoms, treatment history, and lab trends."
      ],
      sourceIds: ["nciNutrition", "espenGuideline"]
    }
  ],
  on: [
    {
      title: "Energy and protein support (on chemotherapy)",
      bullets: [
        "If intake is reduced, use small frequent meals and energy-dense options.",
        "Increase protein intake as tolerated to support tissue repair and recovery.",
        "Escalate early for persistent weight loss or poor oral intake."
      ],
      sourceIds: ["nciNutrition", "espenGuideline"]
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
  ]
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
