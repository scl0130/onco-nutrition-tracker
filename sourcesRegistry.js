const ALLOWED_SOURCE_DOMAINS = [
  "cancer.gov",
  "pubmed.ncbi.nlm.nih.gov",
  "pmc.ncbi.nlm.nih.gov",
  "espen.org",
  "ascopubs.org",
  "www.nccn.org",
  "www.cancer.org",
  "www.mskcc.org",
  "www.med.upenn.edu",
  "www.gastrojournal.org",
  "www.routledge.com"
];

const SOURCES_REGISTRY = {
  espenCancerPractical2021Pdf: {
    title: "ESPEN practical guideline: Clinical Nutrition in cancer (PDF)",
    publisher: "ESPEN",
    evidenceType: "Guideline",
    url: "https://www.espen.org/files/ESPEN-Guidelines/ESPEN-practical-guideline-clinical-nutrition-in-cancer.pdf",
    lastReviewed: "2026-02-12"
  },
  espenCancerPractical2021PubMed: {
    title: "ESPEN practical guideline journal entry",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/33946039/",
    pubmedId: "33946039",
    lastReviewed: "2026-02-12"
  },
  espenCancerGuideline2017PubMed: {
    title: "ESPEN guidelines on nutrition in cancer patients",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/27637832/",
    pubmedId: "27637832",
    lastReviewed: "2026-02-12"
  },
  espenCancerGuideline2017Pdf: {
    title: "ESPEN guidelines on nutrition in cancer patients (PDF)",
    publisher: "ESPEN",
    evidenceType: "Guideline",
    url: "https://www.espen.org/files/ESPEN-Guidelines/ESPEN_guidelines_on_nutrition_in_cancer_patients.pdf",
    lastReviewed: "2026-02-12"
  },
  nciNutritionCarePDQ: {
    title: "NCI Nutrition in Cancer Care PDQ (health professional)",
    publisher: "National Cancer Institute",
    evidenceType: "Government",
    url: "https://www.cancer.gov/about-cancer/treatment/side-effects/appetite-loss/nutrition-hp-pdq",
    lastReviewed: "2026-02-12"
  },
  nciNutritionDuringCancer: {
    title: "NCI Nutrition During Cancer",
    publisher: "National Cancer Institute",
    evidenceType: "Government",
    url: "https://www.cancer.gov/about-cancer/treatment/side-effects/nutrition",
    lastReviewed: "2026-02-12"
  },
  nciEatingHintsPdf: {
    title: "NCI Eating Hints booklet (PDF)",
    publisher: "National Cancer Institute",
    evidenceType: "Government",
    url: "https://www.cancer.gov/publications/patient-education/eatinghints.pdf",
    lastReviewed: "2026-02-12"
  },
  ascoCachexia2020PubMed: {
    title: "ASCO guideline: Management of Cancer Cachexia",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/32432946/",
    pubmedId: "32432946",
    doi: "10.1200/JCO.20.00611",
    lastReviewed: "2026-02-12"
  },
  ascoCachexia2020JCO: {
    title: "ASCO guideline landing page: Management of Cancer Cachexia",
    publisher: "ASCO Publications",
    evidenceType: "Guideline",
    url: "https://ascopubs.org/doi/10.1200/JCO.20.00611",
    lastReviewed: "2026-02-12"
  },
  glimMalnutrition2019: {
    title: "GLIM criteria for diagnosis of malnutrition",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/30181091/",
    pubmedId: "30181091",
    doi: "10.1016/j.clnu.2018.08.002",
    lastReviewed: "2026-02-12"
  },
  acsSurvivorGuideline2022PubMed: {
    title: "American Cancer Society nutrition and physical activity guideline for cancer survivors",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/35286402/",
    pubmedId: "35286402",
    doi: "10.3322/caac.21719",
    lastReviewed: "2026-02-13"
  },
  ravascoNutritionCancer2019PubMed: {
    title: "Nutrition in Cancer Patients",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/31394836/",
    pubmedId: "31394836",
    doi: "10.3390/jcm8081211",
    lastReviewed: "2026-02-13"
  },
  ascoGeriatric2018PubMed: {
    title: "ASCO guideline for geriatric oncology assessment and management",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/29337660/",
    pubmedId: "29337660",
    doi: "10.1200/JCO.2018.78.8687",
    lastReviewed: "2026-02-13"
  },
  sabatinoHemodialysis2017PubMed: {
    title: "Protein-energy wasting and nutritional supplementation in ESRD on hemodialysis",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/27866934/",
    pubmedId: "27866934",
    doi: "10.1016/j.clnu.2016.06.007",
    lastReviewed: "2026-02-13"
  },
  hoshinoDialysis2021PubMed: {
    title: "Renal rehabilitation and nutritional support in dialysis patients",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/33920948/",
    pubmedId: "33920948",
    doi: "10.3390/nu13051444",
    lastReviewed: "2026-02-13"
  },
  diabetesDietGuideline2023PubMed: {
    title: "Evidence-based European recommendations for dietary management of diabetes",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/37062377/",
    pubmedId: "37062377",
    doi: "10.1007/s00125-023-05894-8",
    lastReviewed: "2026-02-13"
  },
  esmoCancerPreventionHandbook2008: {
    title: "ESMO Handbook of Cancer Prevention (2008)",
    publisher: "CRC Press / Routledge",
    evidenceType: "Guideline",
    url: "https://www.routledge.com/ESMO-Handbook-of-Cancer-Prevention/Schrijvers-Senn-Mellstedt-Zakotnik/p/book/9780415390859",
    isbn13: "9780415390859",
    lastReviewed: "2026-02-14"
  },
  nutritionalOncology2022Book: {
    title: "Nutritional Oncology: Nutrition in Cancer Prevention, Treatment, and Survivorship (2022)",
    publisher: "CRC Press / Routledge",
    evidenceType: "Guideline",
    url: "https://www.routledge.com/Nutritional-Oncology-Nutrition-in-Cancer-Prevention-Treatment-and-Survivorship/Heber-Li-Go/p/book/9780367272494",
    isbn13: "9780367272494",
    lastReviewed: "2026-02-14"
  },
  masccEsmoMecCinv2023PubMed: {
    title: "MASCC/ESMO 2023 antiemetic consensus: moderately emetogenic agents",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/38114821/",
    pubmedId: "38114821",
    doi: "10.1007/s00520-023-08222-3",
    lastReviewed: "2026-02-13"
  },
  masccEsmoRinv2023PubMed: {
    title: "MASCC/ESMO 2023 antiemetic consensus: radiotherapy and chemoradiotherapy-induced nausea/vomiting",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/38097904/",
    pubmedId: "38097904",
    doi: "10.1007/s00520-023-08226-z",
    lastReviewed: "2026-02-13"
  },
  masccIsooMucositis2020PubMed: {
    title: "MASCC/ISOO clinical practice guideline for oral and GI mucositis",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/32786044/",
    pubmedId: "32786044",
    doi: "10.1002/cncr.33100",
    lastReviewed: "2026-02-13"
  },
  ascoIsooMasccXerostomia2021PubMed: {
    title: "ISOO/MASCC/ASCO guideline for salivary gland hypofunction and xerostomia",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/34283635/",
    pubmedId: "34283635",
    doi: "10.1200/JCO.21.01208",
    lastReviewed: "2026-02-13"
  },
  onsConstipationGuideline2020PubMed: {
    title: "ONS guideline for opioid and non-opioid cancer-related constipation",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/33063786/",
    pubmedId: "33063786",
    doi: "10.1188/20.ONF.671-691",
    lastReviewed: "2026-02-13"
  },
  ascoFatigueGuideline2024PubMed: {
    title: "ASCO-SIO guideline update: management of fatigue in adult cancer survivors",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/38754041/",
    pubmedId: "38754041",
    doi: "10.1200/JCO.24.00541",
    lastReviewed: "2026-02-13"
  },
  tasteSystematicReview2021PubMed: {
    title: "Taste function during chemo/radiotherapy and implications for nutrition",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/33071205/",
    pubmedId: "33071205",
    doi: "10.1016/j.jand.2020.08.014",
    lastReviewed: "2026-02-13"
  },
  dysphagiaHncConsensus2023PubMed: {
    title: "Expert consensus statement: dysphagia management in head and neck cancer",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/36965195/",
    pubmedId: "36965195",
    doi: "10.1002/ohn.302",
    lastReviewed: "2026-02-13"
  },
  giSymptomsNutritionMeta2025PubMed: {
    title: "Nutrition interventions for GI symptoms during cancer therapy: systematic review and meta-analysis",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/40706958/",
    pubmedId: "40706958",
    doi: "10.1016/j.advnut.2025.100485",
    lastReviewed: "2026-02-13"
  },
  earlySatietyScoping2025PubMed: {
    title: "Early satiety in cancer: scoping review",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/41349893/",
    pubmedId: "41349893",
    doi: "10.1016/j.jand.2025.156250",
    lastReviewed: "2026-02-13"
  },
  agaEpi2023FullText: {
    title: "AGA Clinical Practice Update on Exocrine Pancreatic Insufficiency (full text)",
    publisher: "Gastroenterology (AGA)",
    evidenceType: "PeerReviewed",
    url: "https://www.gastrojournal.org/article/S0016-5085(23)04780-7/fulltext",
    lastReviewed: "2026-02-12"
  },
  agaEpi2023PubMed: {
    title: "AGA EPI Clinical Practice Update",
    publisher: "PubMed",
    evidenceType: "PeerReviewed",
    url: "https://pubmed.ncbi.nlm.nih.gov/37737818/",
    pubmedId: "37737818",
    lastReviewed: "2026-02-12"
  },
  nccnPatientGuidelinesLibrary: {
    title: "NCCN Guidelines for Patients landing library",
    publisher: "NCCN",
    evidenceType: "Guideline",
    url: "https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients",
    lastReviewed: "2026-02-12"
  },
  nccnFatiguePatientPdf: {
    title: "NCCN Guidelines for Patients: Fatigue and Cancer (PDF)",
    publisher: "NCCN",
    evidenceType: "Guideline",
    url: "https://www.nccn.org/patients/guidelines/content/PDF/fatigue-patient.pdf",
    lastReviewed: "2026-02-12"
  },
  acsEatingProblemsHub: {
    title: "American Cancer Society: Drinking and Eating Changes hub",
    publisher: "American Cancer Society",
    evidenceType: "CancerCenter",
    url: "https://www.cancer.org/cancer/managing-cancer/side-effects/eating-problems.html",
    lastReviewed: "2026-02-12"
  },
  acsTasteSmell: {
    title: "American Cancer Society: Taste and Smell Changes",
    publisher: "American Cancer Society",
    evidenceType: "CancerCenter",
    url: "https://www.cancer.org/cancer/managing-cancer/side-effects/eating-problems/taste-smell-changes.html",
    lastReviewed: "2026-02-12"
  },
  mskTasteChanges: {
    title: "MSKCC: Managing Taste Changes During Chemotherapy",
    publisher: "Memorial Sloan Kettering Cancer Center",
    evidenceType: "CancerCenter",
    url: "https://www.mskcc.org/cancer-care/patient-education/managing-taste-changes-during-chemotherapy",
    lastReviewed: "2026-02-12"
  },
  pennMucositisTipSheet: {
    title: "Penn Medicine: Mucositis tip sheet (PDF)",
    publisher: "University of Pennsylvania",
    evidenceType: "CancerCenter",
    url: "https://www.med.upenn.edu/nets2023/assets/user-content/documents/mucositis-tip-sheet.pdf",
    lastReviewed: "2026-02-12"
  }
};

window.ALLOWED_SOURCE_DOMAINS = ALLOWED_SOURCE_DOMAINS;
window.SOURCES_REGISTRY = SOURCES_REGISTRY;
