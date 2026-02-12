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
  },
  breastDietSurvival: {
    title: "Pre- to Postdiagnosis Dietary Pattern Trajectories and Survival in Breast Cancer",
    org: "JNCI Cancer Spectrum",
    url: "https://pubmed.ncbi.nlm.nih.gov/33928215/",
    type: "Peer-reviewed"
  },
  prostateDietReview2024: {
    title: "Nutritional Interventions in Prostate Cancer: A Systematic Review (2024)",
    org: "Nutrients",
    url: "https://pubmed.ncbi.nlm.nih.gov/40941553/",
    type: "Peer-reviewed"
  },
  prostateMediterranean: {
    title: "Mediterranean Dietary Pattern and Prostate Cancer Risk/Mortality: Systematic Review and Meta-analysis",
    org: "Cancer Epidemiology, Biomarkers & Prevention",
    url: "https://pubmed.ncbi.nlm.nih.gov/33467042/",
    type: "Peer-reviewed"
  },
  lungCachexiaMeta: {
    title: "Prognostic Significance of Cachexia in Lung Cancer: Systematic Review and Meta-analysis",
    org: "Lung Cancer",
    url: "https://pubmed.ncbi.nlm.nih.gov/38788267/",
    type: "Peer-reviewed"
  },
  colorectalPostDxDiet: {
    title: "Postdiagnosis Dietary Patterns and Colorectal Cancer Outcomes: Systematic Review",
    org: "Nutrients",
    url: "https://pubmed.ncbi.nlm.nih.gov/40317134/",
    type: "Peer-reviewed"
  },
  colorectalPlantPattern: {
    title: "Plant-based Dietary Patterns and Colorectal Cancer Survival: UK Biobank Cohort",
    org: "American Journal of Clinical Nutrition",
    url: "https://pubmed.ncbi.nlm.nih.gov/39212617/",
    type: "Peer-reviewed"
  },
  melanomaFiberImmunotherapy: {
    title: "Gut Microbiome Modulates Response to Anti-PD-1 Immunotherapy in Melanoma",
    org: "Science",
    url: "https://pubmed.ncbi.nlm.nih.gov/34941392/",
    type: "Peer-reviewed"
  },
  bladderImmunonutrition: {
    title: "Impact of Perioperative Immunonutrition on Radical Cystectomy Outcomes",
    org: "Indian Journal of Urology",
    url: "https://pubmed.ncbi.nlm.nih.gov/26654125/",
    type: "Peer-reviewed"
  },
  kidneyNutritionStatus: {
    title: "Nutritional Status and Long-term Prognosis in Renal Cell Carcinoma",
    org: "Nutrients",
    url: "https://pubmed.ncbi.nlm.nih.gov/35715363/",
    type: "Peer-reviewed"
  },
  hemeNeutropenicDiet: {
    title: "Neutropenic Diet in Hematopoietic Stem Cell Transplantation: Meta-analysis",
    org: "Journal of Human Nutrition and Dietetics",
    url: "https://pubmed.ncbi.nlm.nih.gov/30628912/",
    type: "Peer-reviewed"
  },
  uterineDietPrognosis: {
    title: "Diet Quality and Prognosis in Endometrial Cancer Survivors",
    org: "American Journal of Clinical Nutrition",
    url: "https://pubmed.ncbi.nlm.nih.gov/36477189/",
    type: "Peer-reviewed"
  },
  pancreaticNutritionProtocol: {
    title: "Nutrition in Pancreatic Cancer: Evidence and Expert Consensus (NUTRI-PAK)",
    org: "Clinical Nutrition",
    url: "https://pubmed.ncbi.nlm.nih.gov/34363594/",
    type: "Peer-reviewed"
  },
  pancreaticCachexiaMeta: {
    title: "Cachexia and Survival in Pancreatic Cancer: Systematic Review and Meta-analysis",
    org: "Clinical Nutrition ESPEN",
    url: "https://pubmed.ncbi.nlm.nih.gov/39397738/",
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
      title: "Breast cancer nutrition priorities",
      bullets: [
        "Use a high-quality, mostly plant-forward dietary pattern with consistent lean-protein distribution across meals.",
        "Alcohol reduction is high priority in survivorship planning; discuss individualized targets with your oncology team.",
        "Track body weight and unintentional loss each week during active treatment to trigger early nutrition support."
      ],
      sourceIds: ["breastDietSurvival", "acsGuideline", "espenGuideline", "nciNutrition"]
    },
    {
      title: "Breast treatment-phase strategy",
      bullets: [
        "During periods of poor intake, prioritize calorie-dense snacks and oral nutrition supplements before severe deficit develops.",
        "When nausea or taste changes occur, switch to small frequent meals with lower odor foods and hydration spacing.",
        "Escalate to dietitian-led intervention if protein or energy intake stays below goal for several days."
      ],
      sourceIds: ["espenGuideline", "esmoCachexia", "nciNutrition"]
    }
  ],
  "Prostate Cancer": [
    {
      title: "Prostate cancer dietary pattern",
      bullets: [
        "Favor Mediterranean-style patterns emphasizing vegetables, legumes, whole grains, fish, and unsaturated fats.",
        "Minimize ultra-processed foods and monitor cardiometabolic markers, especially during androgen-deprivation therapy.",
        "Preserve lean mass with consistent daily protein distribution and resistance activity as tolerated."
      ],
      sourceIds: ["prostateDietReview2024", "prostateMediterranean", "acsGuideline", "espenGuideline"]
    }
  ],
  "Lung Cancer (including bronchus)": [
    {
      title: "Lung cancer high-risk nutrition profile",
      bullets: [
        "Cachexia risk is substantial; monitor weekly weight trend and appetite decline and intervene early.",
        "Use calorie-dense, low-volume meals when dyspnea or fatigue reduces oral intake capacity.",
        "Escalate rapidly to oral supplements or specialized nutrition support if intake remains sub-target."
      ],
      sourceIds: ["lungCachexiaMeta", "espenGuideline", "esmoCachexia", "nciNutrition"]
    }
  ],
  "Colorectal Cancer (colon and rectum)": [
    {
      title: "Colorectal cancer GI-focused plan",
      bullets: [
        "Use symptom-adapted fiber and texture based on bowel pattern (constipation vs diarrhea) and treatment stage.",
        "Pair hydration tracking with stool pattern tracking to guide day-to-day diet adjustments.",
        "Post-diagnosis high-quality dietary patterns are associated with better outcomes in cohort data."
      ],
      sourceIds: ["colorectalPostDxDiet", "colorectalPlantPattern", "nciNutrition", "espenGuideline"]
    },
    {
      title: "Peri-treatment strategy",
      bullets: [
        "Prioritize protein adequacy to support surgical and treatment recovery.",
        "Use smaller meals and lower residue options during severe GI symptom flares.",
        "Coordinate early with GI/oncology dietitian if intake is unstable for more than a few days."
      ],
      sourceIds: ["espenGuideline", "nciNutrition"]
    }
  ],
  "Melanoma of the Skin": [
    {
      title: "Melanoma and immunotherapy support",
      bullets: [
        "Maintain high diet quality and hydration; adjust meal frequency and texture during treatment-related GI symptoms.",
        "Emerging evidence links microbiome-supportive patterns (including adequate dietary fiber) with checkpoint therapy response.",
        "Avoid restrictive elimination plans unless medically indicated; prioritize intake consistency and symptom control."
      ],
      sourceIds: ["melanomaFiberImmunotherapy", "nciNutrition", "espenGuideline", "nciFoodSafety"]
    }
  ],
  "Bladder Cancer": [
    {
      title: "Bladder cancer perioperative and recovery focus",
      bullets: [
        "If surgery is planned, prehabilitation-style nutrition (protein + energy optimization) can support recovery trajectories.",
        "Use hydration plans individualized to urinary symptoms and urology guidance rather than fixed universal targets.",
        "Track tolerability triggers (irritative foods, timing) and maintain protein adequacy through treatment."
      ],
      sourceIds: ["bladderImmunonutrition", "nciNutrition", "espenGuideline"]
    }
  ],
  "Pancreatic Cancer": [
    {
      title: "Pancreatic cancer aggressive nutrition intervention",
      bullets: [
        "High risk for cachexia requires early, proactive calorie/protein intervention rather than wait-and-see monitoring.",
        "Assess fat malabsorption and pancreatic enzyme replacement needs with care team when stool/fat intolerance is present.",
        "Reassess intake and weight frequently during chemotherapy or perioperative windows."
      ],
      sourceIds: ["pancreaticNutritionProtocol", "pancreaticCachexiaMeta", "espenGuideline", "nciNutrition"]
    },
    {
      title: "Symptom-prioritized meal framework",
      bullets: [
        "Use small frequent meals with higher calorie density when early satiety or nausea is active.",
        "Prefer easier-to-digest proteins and liquid nutrition options during severe symptom days.",
        "Escalate to oncology dietitian rapidly when unintentional loss persists."
      ],
      sourceIds: ["nciNutrition", "espenGuideline", "esmoCachexia"]
    }
  ],
  "Kidney and Renal Pelvis Cancer": [
    {
      title: "Kidney cancer + renal function stratification",
      bullets: [
        "Nutritional status and body-composition markers correlate with prognosis; monitor trends intentionally.",
        "If CKD or dialysis is present, coordinate oncology targets with renal-specific sodium/potassium/phosphorus guidance.",
        "Avoid unreviewed supplements and unsupervised electrolyte changes."
      ],
      sourceIds: ["kidneyNutritionStatus", "niddkDialysis", "espenGuideline", "nciNutrition"]
    }
  ],
  "Non-Hodgkin Lymphoma": [
    {
      title: "Non-Hodgkin lymphoma infection-risk and intake strategy",
      bullets: [
        "During intensive therapy and neutropenia risk windows, prioritize strict food safety and rapid symptom escalation.",
        "Use proactive calorie/protein support to prevent cumulative intake deficits between cycles.",
        "Coordinate with hematology nutrition support when mucositis, nausea, or prolonged low intake persists."
      ],
      sourceIds: ["hemeNeutropenicDiet", "nciFoodSafety", "cdcNeutropenia", "espenGuideline"]
    }
  ],
  "Uterine Corpus Cancer": [
    {
      title: "Uterine corpus cancer survivorship-metabolic focus",
      bullets: [
        "Emphasize diet quality and weight-stability strategy because metabolic risk is common in survivorship.",
        "Use adequate protein and progressive activity to preserve lean mass during/after treatment.",
        "Apply symptom-directed meal adaptation when therapy causes appetite or GI disruption."
      ],
      sourceIds: ["uterineDietPrognosis", "acsGuideline", "nciNutrition", "espenGuideline"]
    }
  ]
};

const CANCER_DAILY_TIPS = {
  "Breast Cancer": ["Aim for 25-30 g protein per meal and reduce alcohol exposure days to improve consistency."],
  "Prostate Cancer": ["Use a Mediterranean-style plate pattern and monitor waist/weight trend during therapy."],
  "Lung Cancer (including bronchus)": ["Prioritize calorie-dense small meals every 2-3 hours on low-appetite days."],
  "Colorectal Cancer (colon and rectum)": ["Match meal texture/fiber to bowel symptoms and record stool + hydration daily."],
  "Melanoma of the Skin": ["Keep fiber and hydration steady during immunotherapy unless team advises restriction."],
  "Bladder Cancer": ["Use a timed hydration schedule and track foods that worsen urinary irritation."],
  "Kidney and Renal Pelvis Cancer": ["Use renal-safe sodium/electrolyte limits from your renal-oncology team plan."],
  "Non-Hodgkin Lymphoma": ["On neutropenia-risk days, enforce strict food safety and avoid high-risk foods."],
  "Uterine Corpus Cancer": ["Keep protein consistent and track long-term weight trajectory, not just daily scale noise."],
  "Pancreatic Cancer": ["Screen early for malabsorption and consider enzyme discussion if fatty stools/weight loss occur."]
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
