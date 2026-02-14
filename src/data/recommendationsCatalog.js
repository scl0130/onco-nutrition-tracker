(function () {
  const SAFETY_NOTE = "Educational only. Contact your care team for medical advice.";

  function rec(data) {
    return {
      safetyNote: SAFETY_NOTE,
      ...data
    };
  }

  const RECOMMENDATIONS_CATALOG = [
    rec({
      id: "universal_monitor_intake_weight",
      priority: 100,
      title: "Daily intake and weight monitoring",
      patientTextShort: "Track food, fluid, and weight trends so concerning decline is identified early.",
      patientTextActions: [
        "Log meals and fluids every day, not only on symptom days",
        "Record weight at least weekly and more often if appetite is poor",
        "Contact your care team if intake is low for several days or weight keeps falling"
      ],
      whyThisMatters: "ESPEN and NCI sources emphasize routine monitoring because nutrition decline is common during treatment and can worsen outcomes when detected late.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionCarePDQ"],
      evidenceTags: ["Guideline", "Government"]
    }),
    rec({
      id: "universal_energy_protein_support",
      priority: 98,
      title: "Use protein and energy targets proactively",
      patientTextShort: "Set calorie and protein targets early and adjust quickly when intake drops.",
      patientTextActions: [
        "Use an initial energy range near 25 to 30 kcal per kg per day unless your team gives a different plan",
        "Aim for protein at least above 1.0 g per kg per day and often closer to 1.2 to 1.5 g per kg during active treatment",
        "Add oral nutrition supplements when regular meals are not enough",
        "Request oncology dietitian support early instead of waiting for severe decline"
      ],
      whyThisMatters: "ESPEN and ASCO cachexia guidance support early nutrition intervention to reduce cumulative deficits.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["protein_deficit", "calorie_deficit"] },
      sourceIds: ["espenCancerGuideline2017Pdf", "espenCancerPractical2021PubMed", "ascoCachexia2020JCO"],
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),
    rec({
      id: "consensus_on_treatment_macro_range",
      priority: 97,
      title: "On-treatment macro range anchor",
      patientTextShort: "For active treatment, keep targets near 25 to 30 kcal/kg/day and protein 1.2 to 1.5 g/kg/day unless your team sets a different goal.",
      patientTextActions: [
        "Use your current body weight to estimate daily calorie and protein targets",
        "Move toward the upper end when there is weight loss, sarcopenia, or high symptom burden",
        "Review targets with your oncology dietitian if intake trends stay low"
      ],
      whyThisMatters: "The consensus evidence summary and oncology guidelines align on these ranges for adults during active treatment.",
      confidence: "High confidence",
      triggers: { cancerTypes: [], treatments: ["chemotherapy", "radiation", "immunotherapy", "targeted"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["espenCancerGuideline2017Pdf", "espenCancerPractical2021PubMed", "ravascoNutritionCancer2019PubMed"],
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),
    rec({
      id: "consensus_active_treatment_carb_fat_pattern",
      priority: 89,
      title: "Active-treatment carbohydrate and fat pattern",
      patientTextShort: "Use balanced macros during treatment; a practical range is about 45 to 55% carbohydrate and 25 to 35% fat when tolerated.",
      patientTextActions: [
        "Avoid highly restrictive macro plans during active treatment unless prescribed",
        "Use about 50% carbohydrate and 30% fat as a practical default when symptoms are stable",
        "Temporarily reduce insoluble fiber during active diarrhea or obstruction risk"
      ],
      whyThisMatters: "Evidence supports balanced patterns and symptom-based adaptation, while exact carb/fat percentages are less strongly established than energy/protein targets.",
      confidence: "Medium confidence",
      triggers: { cancerTypes: [], treatments: ["chemotherapy", "radiation", "immunotherapy", "targeted"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciEatingHintsPdf", "acsSurvivorGuideline2022PubMed", "espenCancerGuideline2017Pdf"],
      evidenceTags: ["Government", "PeerReviewed", "Guideline"]
    }),
    rec({
      id: "consensus_low_intake_step_up",
      priority: 96,
      title: "Step-up support when intake stays low",
      patientTextShort: "If intake stays below about half of needs for more than 1 to 2 weeks, escalate support from counseling to supplements and then tube or parenteral options when needed.",
      patientTextActions: [
        "Track days where intake is under 50% of your target",
        "Start oral nutrition supplements early when regular food is not enough",
        "Ask your team when enteral or parenteral nutrition should be considered"
      ],
      whyThisMatters: "Consensus guidance highlights early escalation to prevent prolonged deficits and treatment interruptions.",
      confidence: "High confidence",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["calorie_deficit", "protein_deficit", "weight_loss_concerning"] },
      sourceIds: ["espenCancerGuideline2017Pdf", "ravascoNutritionCancer2019PubMed", "ascoCachexia2020PubMed"],
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),
    rec({
      id: "consensus_survivorship_pattern_weight",
      priority: 88,
      title: "Survivorship plant-forward pattern and weight stability",
      patientTextShort: "Outside active treatment, prioritize weight stability and a plant-forward eating pattern over strict macro ratios.",
      patientTextActions: [
        "Center meals on vegetables, fruits, whole grains, legumes, and nuts",
        "Limit added sugars, refined grains, and processed meats",
        "Use individualized protein goals when frailty or sarcopenia risk is present",
        "Spread protein intake across meals rather than concentrating it in one meal"
      ],
      whyThisMatters: "Survivorship guidance is strongest for dietary quality and body-weight management rather than fixed kcal/kg or carb/fat ratios.",
      confidence: "High confidence",
      triggers: { cancerTypes: [], treatments: ["none"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["acsSurvivorGuideline2022PubMed", "nciNutritionDuringCancer", "diabetesDietGuideline2023PubMed", "esmoCancerPreventionHandbook2008", "nutritionalOncology2022Book"],
      sourceLocators: {
        esmoCancerPreventionHandbook2008: "pp. 100-103 (vegetable/fruit targets, minimally processed plant foods, red meat avoidance), p. 178 (alcohol moderation)",
        nutritionalOncology2022Book: "pp. 126-127, 130 (low-GI whole-food pattern; fruits/vegetables and minimally refined grains; fiber-rich plant pattern)"
      },
      evidenceTags: ["PeerReviewed", "Government", "Guideline"]
    }),
    rec({
      id: "survivorship_esmo_prevention_portions",
      priority: 87,
      title: "ESMO prevention-pattern portion targets (off treatment)",
      patientTextShort: "Use practical portion anchors from ESMO prevention guidance when building daily meals in survivorship.",
      patientTextActions: [
        "Aim for about 400 to 800 g vegetables daily plus at least two pieces of fruit",
        "Use about 600 to 800 g per day of minimally processed grains, legumes, nuts, and seeds",
        "Limit or avoid red and processed meat, and prefer low-charring cooking methods",
        "If alcohol is used, keep intake low and discuss individualized limits with your care team"
      ],
      whyThisMatters: "ESMO prevention guidance provides concrete food-pattern targets that can make survivorship nutrition plans more specific and easier to implement.",
      confidence: "Medium confidence",
      triggers: { cancerTypes: [], treatments: ["none"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["esmoCancerPreventionHandbook2008", "acsSurvivorGuideline2022PubMed"],
      sourceLocators: {
        esmoCancerPreventionHandbook2008: "pp. 100, 103 (400-800 g vegetables + at least 2 fruit pieces; 600-800 g minimally processed grains/legumes/nuts/seeds), p. 178 (alcohol moderation)"
      },
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),
    rec({
      id: "kidney_dialysis_macro_override",
      priority: 99,
      title: "Kidney cancer on dialysis macro override",
      patientTextShort: "If you are on dialysis, use renal-focused goals; protein around 1.2 g/kg/day with adequate energy is usually prioritized over standard oncology defaults.",
      patientTextActions: [
        "Confirm protein, fluid, potassium, phosphate, and sodium goals with renal and oncology teams together",
        "Ask about oral renal supplements during dialysis if intake is low",
        "Report poor intake and post-dialysis fatigue quickly to prevent protein-energy wasting"
      ],
      whyThisMatters: "Dialysis changes nutrition priorities and requires renal-specific constraints alongside cancer treatment support.",
      confidence: "High confidence",
      triggers: { cancerTypes: ["kidney"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["kidney_on_dialysis"] },
      sourceIds: ["sabatinoHemodialysis2017PubMed", "hoshinoDialysis2021PubMed", "espenCancerGuideline2017Pdf"],
      evidenceTags: ["PeerReviewed", "Guideline"]
    }),
    rec({
      id: "kidney_off_dialysis_protein_caution",
      priority: 93,
      title: "Kidney cancer off dialysis protein caution",
      patientTextShort: "If kidney function is reduced and you are not on dialysis, protein targets may need to be lower than active-treatment oncology ranges.",
      patientTextActions: [
        "Request CKD-stage specific protein goals from your renal team",
        "Avoid self-increasing protein without nephrology review",
        "Track appetite, edema, and weight trends and bring logs to visits"
      ],
      whyThisMatters: "Off-dialysis CKD often requires individualized protein restriction and electrolyte management, which can conflict with standard oncology targets.",
      confidence: "High confidence",
      triggers: { cancerTypes: ["kidney"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["kidney_off_dialysis"] },
      sourceIds: ["sabatinoHemodialysis2017PubMed", "hoshinoDialysis2021PubMed", "diabetesDietGuideline2023PubMed"],
      evidenceTags: ["PeerReviewed"]
    }),

    rec({
      id: "tx_chemo_small_frequent_meals",
      priority: 90,
      title: "Chemotherapy meal pacing",
      patientTextShort: "During chemotherapy, frequent small meals are usually better tolerated than large meals.",
      patientTextActions: [
        "Eat 5 to 6 small meals or snacks through the day",
        "Choose bland or cool foods when smells trigger nausea",
        "Drink most liquids between meals if you feel full quickly",
        "Keep ready to eat foods nearby for low energy periods"
      ],
      whyThisMatters: "NCI Eating Hints and PDQ guidance show chemotherapy symptoms can reduce meal tolerance and total intake without practical meal adjustments.",
      triggers: { cancerTypes: [], treatments: ["chemotherapy"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf", "acsEatingProblemsHub"],
      evidenceTags: ["Government", "CancerCenter"]
    }),
    rec({
      id: "tx_chemo_early_escalation",
      priority: 88,
      title: "Escalate care when chemotherapy intake falls",
      patientTextShort: "Do not wait for severe decline before asking for nutrition support.",
      patientTextActions: [
        "Track number of days when intake is clearly below target",
        "Report persistent calorie or protein deficits to your oncology team this week",
        "Ask for symptom focused support plus dietitian referral when deficits continue"
      ],
      whyThisMatters: "ASCO cachexia and ESPEN recommendations support early escalation because cumulative deficits can progress quickly.",
      triggers: { cancerTypes: [], treatments: ["chemotherapy"], symptomsAny: [], symptomsAll: [], flagsAny: ["calorie_deficit", "weight_loss_concerning"] },
      sourceIds: ["ascoCachexia2020PubMed", "espenCancerPractical2021Pdf"],
      evidenceTags: ["PeerReviewed", "Guideline"]
    }),
    rec({
      id: "tx_chemo_food_safety",
      priority: 86,
      title: "Chemotherapy food safety focus",
      patientTextShort: "Use careful food handling and preparation during active treatment.",
      patientTextActions: [
        "Avoid undercooked animal foods and unpasteurized products",
        "Use clean preparation surfaces and hand hygiene",
        "Ask your team how to adjust safety during low blood counts"
      ],
      whyThisMatters: "Infection risk can rise during treatment and food safety practices become more important.",
      triggers: { cancerTypes: [], treatments: ["chemotherapy"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf"],
      evidenceTags: ["Government"]
    }),

    rec({
      id: "tx_radiation_protein_energy",
      priority: 85,
      title: "Radiation recovery protein and energy support",
      patientTextShort: "During radiation, consistent protein and energy intake can support recovery.",
      patientTextActions: [
        "Include a protein source at every meal and snack",
        "Use softer textures if swallowing or mouth discomfort limits intake",
        "Shift most calories to times of day when symptoms are less intense",
        "Use snacks or supplements to close daily calorie gaps"
      ],
      whyThisMatters: "ESPEN and NCI guidance indicate radiation related symptoms can lower intake and raise malnutrition risk if deficits are not corrected.",
      triggers: { cancerTypes: [], treatments: ["radiation"], symptomsAny: [], symptomsAll: [], flagsAny: ["protein_deficit", "calorie_deficit"] },
      sourceIds: ["espenCancerPractical2021Pdf", "nciEatingHintsPdf"],
      evidenceTags: ["Guideline", "Government"]
    }),
    rec({
      id: "tx_radiation_fatigue_support",
      priority: 84,
      title: "Radiation fatigue supportive pacing",
      patientTextShort: "Use energy-conserving meal plans when fatigue is high during radiation.",
      patientTextActions: [
        "Prepare food in batches on better days",
        "Use convenience options that still meet nutrition goals",
        "Ask for caregiver help when fatigue limits meal prep"
      ],
      whyThisMatters: "Fatigue can reduce meal preparation and intake, leading to avoidable deficits.",
      triggers: { cancerTypes: [], treatments: ["radiation"], symptomsAny: ["fatigue"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nccnFatiguePatientPdf", "nciEatingHintsPdf"],
      evidenceTags: ["Guideline", "Government"]
    }),
    rec({
      id: "tx_radiation_hydration_tracking",
      priority: 82,
      title: "Radiation hydration tracking",
      patientTextShort: "Track fluids daily during radiation, especially with GI symptoms.",
      patientTextActions: [
        "Record daily fluid intake",
        "Use oral hydration options regularly",
        "Contact your team if dehydration symptoms appear"
      ],
      whyThisMatters: "Dehydration can worsen fatigue and reduce treatment tolerance.",
      triggers: { cancerTypes: [], treatments: ["radiation"], symptomsAny: ["diarrhea", "vomiting"], symptomsAll: [], flagsAny: ["dehydration_risk"] },
      sourceIds: ["nciNutritionDuringCancer", "acsEatingProblemsHub"],
      evidenceTags: ["Government", "CancerCenter"]
    }),

    rec({
      id: "tx_surgery_prehab_nutrition",
      priority: 80,
      title: "Surgery phase nutrition preparation",
      patientTextShort: "Before surgery, optimize intake and hydration with your care team plan.",
      patientTextActions: [
        "Prioritize protein and consistent meals",
        "Report low intake before surgery dates",
        "Follow procedure specific fasting instructions"
      ],
      whyThisMatters: "Nutrition status before surgery can affect recovery trajectory.",
      triggers: { cancerTypes: [], treatments: ["surgery"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionDuringCancer"],
      evidenceTags: ["Guideline", "Government"]
    }),
    rec({
      id: "tx_surgery_postop_progression",
      priority: 79,
      title: "Postoperative intake progression",
      patientTextShort: "After surgery, advance intake according to your surgical and oncology team guidance.",
      patientTextActions: [
        "Start with tolerated textures",
        "Add protein sources as tolerated",
        "Escalate if nausea pain or low intake persists"
      ],
      whyThisMatters: "Early postoperative deficits can delay recovery and functional return.",
      triggers: { cancerTypes: [], treatments: ["surgery"], symptomsAny: ["nausea", "pain"], symptomsAll: [], flagsAny: ["calorie_deficit"] },
      sourceIds: ["nciEatingHintsPdf", "espenCancerGuideline2017Pdf"],
      evidenceTags: ["Government", "Guideline"]
    }),
    rec({
      id: "tx_surgery_high_risk_loss",
      priority: 78,
      title: "Surgery phase weight loss escalation",
      patientTextShort: "Concerning weight loss around surgery should be escalated early.",
      patientTextActions: [
        "Track weight weekly",
        "Share trends with care team",
        "Request dietitian follow up when losses continue"
      ],
      whyThisMatters: "Unintentional weight loss around procedures can worsen outcomes.",
      triggers: { cancerTypes: [], treatments: ["surgery"], symptomsAny: [], symptomsAll: [], flagsAny: ["weight_loss_concerning"] },
      sourceIds: ["espenCancerPractical2021Pdf", "glimMalnutrition2019"],
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),

    rec({
      id: "tx_immunotherapy_intake_stability",
      priority: 76,
      title: "Immunotherapy intake stability",
      patientTextShort: "During immunotherapy, maintain intake stability and symptom logs.",
      patientTextActions: [
        "Log food symptoms and fluids daily",
        "Use small frequent meals when appetite is unstable",
        "Report persistent intake decline"
      ],
      whyThisMatters: "Systematic symptom and intake tracking supports early supportive care decisions.",
      triggers: { cancerTypes: [], treatments: ["immunotherapy"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciNutritionDuringCancer", "nciNutritionCarePDQ"],
      evidenceTags: ["Government"]
    }),
    rec({
      id: "tx_immunotherapy_diarrhea_hydration",
      priority: 75,
      title: "Immunotherapy GI symptom hydration plan",
      patientTextShort: "GI symptoms during immunotherapy may require rapid hydration and care team contact.",
      patientTextActions: [
        "Track stool frequency and fluid intake",
        "Use oral hydration throughout the day",
        "Contact care team if symptoms worsen"
      ],
      whyThisMatters: "Hydration and early symptom escalation reduce risk of rapid decline.",
      triggers: { cancerTypes: [], treatments: ["immunotherapy"], symptomsAny: ["diarrhea", "vomiting"], symptomsAll: [], flagsAny: ["dehydration_risk"] },
      sourceIds: ["nciEatingHintsPdf", "acsEatingProblemsHub"],
      evidenceTags: ["Government", "CancerCenter"]
    }),
    rec({
      id: "tx_immunotherapy_weight_protein",
      priority: 74,
      title: "Immunotherapy weight and protein protection",
      patientTextShort: "Protect lean mass by monitoring weight and protein intake during treatment.",
      patientTextActions: [
        "Track protein grams each day",
        "Use nutrient dense snacks",
        "Seek dietitian review if deficits persist"
      ],
      whyThisMatters: "Persistent deficits can progress to clinically meaningful malnutrition.",
      triggers: { cancerTypes: [], treatments: ["immunotherapy"], symptomsAny: [], symptomsAll: [], flagsAny: ["protein_deficit", "weight_loss_concerning"] },
      sourceIds: ["espenCancerPractical2021Pdf", "glimMalnutrition2019"],
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),

    rec({
      id: "tx_targeted_symptom_tracking",
      priority: 73,
      title: "Targeted therapy symptom informed intake plan",
      patientTextShort: "Adjust intake pattern to targeted therapy symptoms and report persistent issues.",
      patientTextActions: [
        "Keep a daily symptom and meal log",
        "Use simple tolerated foods during flare days",
        "Contact care team when intake is not recovering"
      ],
      whyThisMatters: "Treatment related symptoms can alter intake and hydration quickly.",
      triggers: { cancerTypes: [], treatments: ["targeted"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf"],
      evidenceTags: ["Government"]
    }),
    rec({
      id: "tx_targeted_appetite_support",
      priority: 72,
      title: "Targeted therapy appetite support",
      patientTextShort: "Use structured meal timing if appetite drops on treatment.",
      patientTextActions: [
        "Set reminders for meals and snacks",
        "Start with highest calorie protein foods first",
        "Discuss persistent decline with care team"
      ],
      whyThisMatters: "Consistent intake can be difficult without planning when appetite fluctuates.",
      triggers: { cancerTypes: [], treatments: ["targeted"], symptomsAny: ["appetite_loss", "early_satiety"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciNutritionCarePDQ", "nciEatingHintsPdf"],
      evidenceTags: ["Government"]
    }),
    rec({
      id: "tx_targeted_dehydration_watch",
      priority: 71,
      title: "Targeted therapy dehydration watch",
      patientTextShort: "Watch for dehydration risk when GI symptoms and low intake overlap.",
      patientTextActions: [
        "Log fluids and stool or vomiting episodes",
        "Use oral hydration early",
        "Escalate to urgent care if unable to keep fluids"
      ],
      whyThisMatters: "Combined GI losses and low intake can lead to rapid instability.",
      triggers: { cancerTypes: [], treatments: ["targeted"], symptomsAny: ["diarrhea", "vomiting"], symptomsAll: [], flagsAny: ["dehydration_risk"] },
      sourceIds: ["nciEatingHintsPdf", "acsEatingProblemsHub"],
      evidenceTags: ["Government", "CancerCenter"]
    }),

    rec({
      id: "tx_none_survivorship_pattern",
      priority: 69,
      title: "Survivorship dietary pattern",
      patientTextShort: "If off active treatment, maintain a high quality dietary pattern and monitor trends.",
      patientTextActions: [
        "Center meals around whole foods",
        "Keep regular weight and symptom review",
        "Discuss sustained changes at follow up visits"
      ],
      whyThisMatters: "Long term monitoring helps identify new nutrition concerns early.",
      triggers: { cancerTypes: [], treatments: ["none"], symptomsAny: [], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciNutritionDuringCancer", "espenCancerPractical2021Pdf", "esmoCancerPreventionHandbook2008"],
      sourceLocators: {
        esmoCancerPreventionHandbook2008: "pp. 100-103, 177 (healthy dietary pattern and prevention-oriented lifestyle guidance)"
      },
      evidenceTags: ["Government", "Guideline"]
    }),
    rec({
      id: "tx_none_weight_loss_alert",
      priority: 68,
      title: "Survivorship weight loss alert",
      patientTextShort: "Unintentional weight loss outside active treatment still needs clinical review.",
      patientTextActions: [
        "Track weekly weight",
        "Document appetite and symptoms",
        "Contact your team for persistent decline"
      ],
      whyThisMatters: "Weight loss can signal ongoing nutrition risk even after active treatment.",
      triggers: { cancerTypes: [], treatments: ["none"], symptomsAny: [], symptomsAll: [], flagsAny: ["weight_loss_concerning"] },
      sourceIds: ["glimMalnutrition2019", "nciNutritionCarePDQ"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "tx_none_fatigue_intake",
      priority: 67,
      title: "Survivorship fatigue and intake planning",
      patientTextShort: "Fatigue can still reduce intake in survivorship and needs planning.",
      patientTextActions: [
        "Use simpler meals on low energy days",
        "Prepare backup options",
        "Discuss persistent fatigue with care team"
      ],
      whyThisMatters: "Fatigue and nutrition can reinforce each other when not addressed.",
      triggers: { cancerTypes: [], treatments: ["none"], symptomsAny: ["fatigue"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nccnFatiguePatientPdf", "nciEatingHintsPdf"],
      evidenceTags: ["Guideline", "Government"]
    }),

    rec({
      id: "symptom_nausea_core",
      priority: 95,
      title: "Nausea meal pattern",
      patientTextShort: "Use symptom paced small meals and hydration when nausea is active.",
      patientTextActions: [
        "Eat small amounts every 2 to 3 hours instead of large meals",
        "Choose bland and easy to digest foods first",
        "Sip clear fluids through the day and separate fluids from meals if needed",
        "Avoid foods with strong odors when nausea is worse"
      ],
      whyThisMatters: "Antiemetic consensus guidance and oncology nutrition evidence indicate nausea rapidly lowers intake without early meal-pattern and medication support.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["nausea"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["masccEsmoMecCinv2023PubMed", "masccEsmoRinv2023PubMed", "nciEatingHintsPdf"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_nausea_with_deficit",
      priority: 93,
      title: "Nausea with intake deficit escalation",
      patientTextShort: "If nausea causes sustained intake deficits, escalate quickly to your oncology team.",
      patientTextActions: [
        "Track nausea episodes, fluid intake, and missed meals each day",
        "Use your prescribed anti nausea plan exactly as directed",
        "Contact your care team when intake remains below target for several days"
      ],
      whyThisMatters: "NCI and ASCO cachexia sources support early action when symptoms keep intake below needs.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["nausea"], symptomsAll: [], flagsAny: ["calorie_deficit", "protein_deficit"] },
      sourceIds: ["nciNutritionCarePDQ", "ascoCachexia2020PubMed"],
      evidenceTags: ["Government", "PeerReviewed"]
    }),
    rec({
      id: "symptom_vomiting_hydration",
      priority: 94,
      title: "Vomiting hydration protection",
      patientTextShort: "Vomiting can cause rapid dehydration and requires early fluid support.",
      patientTextActions: [
        "Take very small frequent sips instead of large volumes",
        "Track vomiting episodes, fluids kept down, and urine output",
        "Seek urgent care if you cannot keep liquids down"
      ],
      whyThisMatters: "Antiemetic consensus and supportive nutrition sources highlight fast dehydration and deficit risk when vomiting is sustained.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["vomiting"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["masccEsmoMecCinv2023PubMed", "masccEsmoRinv2023PubMed", "nciEatingHintsPdf"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_vomiting_deficit",
      priority: 92,
      title: "Vomiting plus low intake",
      patientTextShort: "When vomiting overlaps with low intake, escalate supportive care promptly.",
      patientTextActions: [
        "Track fluids calories and symptoms",
        "Use rehydration approach from care team",
        "Call oncology team for worsening symptoms"
      ],
      whyThisMatters: "Combined fluid and calorie deficits can worsen treatment tolerance.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["vomiting"], symptomsAll: [], flagsAny: ["dehydration_risk", "calorie_deficit"] },
      sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf"],
      evidenceTags: ["Government"]
    }),
    rec({
      id: "symptom_taste_core",
      priority: 89,
      title: "Taste change meal adaptation",
      patientTextShort: "Taste changes can be managed with targeted food and preparation adjustments.",
      patientTextActions: [
        "Rinse your mouth before and after meals",
        "Try tart flavors such as lemon or vinegar marinades unless you have mouth sores",
        "If food tastes metallic, use plastic utensils and glass cookware",
        "Use mild herbs and seasonings and rotate protein choices"
      ],
      whyThisMatters: "Systematic evidence links treatment-related taste dysfunction with poorer intake, supporting structured flavor and food-format adaptation.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["taste_changes"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["tasteSystematicReview2021PubMed", "mskTasteChanges", "acsTasteSmell"],
      evidenceTags: ["PeerReviewed", "CancerCenter"]
    }),
    rec({
      id: "symptom_taste_with_loss",
      priority: 87,
      title: "Taste changes with weight loss",
      patientTextShort: "When taste changes cause weight loss or deficits, escalate to team support.",
      patientTextActions: [
        "Track tolerated foods and avoid repeated trial of foods you cannot keep eating",
        "Prioritize calorie and protein add-ons in foods you can tolerate",
        "Request oncology dietitian guidance when weight or intake keeps declining"
      ],
      whyThisMatters: "Taste driven food avoidance can lead to clinically meaningful deficits.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["taste_changes"], symptomsAll: [], flagsAny: ["weight_loss_concerning", "protein_deficit"] },
      sourceIds: ["tasteSystematicReview2021PubMed", "nciEatingHintsPdf", "ascoCachexia2020PubMed"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_mouth_sores_core",
      priority: 91,
      title: "Mouth sore texture plan",
      patientTextShort: "Use soft non irritating textures when mouth sores are present.",
      patientTextActions: [
        "Choose soft moist foods and cool or room temperature items",
        "Avoid acidic spicy rough or dry foods that worsen pain",
        "Use oral care and rinsing routines from your care team",
        "Use liquid nutrition options if solids are too painful"
      ],
      whyThisMatters: "Mucositis guidelines describe major oral intake barriers during treatment and support symptom-adapted texture and hydration strategies.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["mouth_sores", "dry_mouth", "difficulty_swallowing"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["masccIsooMucositis2020PubMed", "pennMucositisTipSheet", "nciEatingHintsPdf"],
      evidenceTags: ["PeerReviewed", "CancerCenter", "Government"]
    }),
    rec({
      id: "symptom_mouth_sores_deficit",
      priority: 88,
      title: "Mouth sores with intake decline",
      patientTextShort: "If oral symptoms are reducing intake, contact your care team early.",
      patientTextActions: [
        "Monitor fluid and calorie intake",
        "Use oral nutrition options if solids are hard",
        "Escalate persistent pain or poor intake"
      ],
      whyThisMatters: "Oral pain can drive rapid nutrition decline without early intervention.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["mouth_sores", "difficulty_swallowing"], symptomsAll: [], flagsAny: ["calorie_deficit"] },
      sourceIds: ["masccIsooMucositis2020PubMed", "nciNutritionCarePDQ"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_diarrhea_core",
      priority: 90,
      title: "Diarrhea hydration and intake support",
      patientTextShort: "With diarrhea, hydration and tolerated food choices are immediate priorities.",
      patientTextActions: [
        "Increase fluid replacement throughout the day",
        "Choose tolerated lower fiber and lower fat foods during active diarrhea",
        "Track stool frequency and associated symptoms",
        "Do not start antidiarrheal medicines without clinician guidance"
      ],
      whyThisMatters: "Systematic evidence and supportive-care guidance show persistent diarrhea drives fluid and nutrient loss unless early nutrition support is applied.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["diarrhea"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["giSymptomsNutritionMeta2025PubMed", "nciEatingHintsPdf", "acsEatingProblemsHub"],
      evidenceTags: ["PeerReviewed", "Government", "CancerCenter"]
    }),
    rec({
      id: "symptom_diarrhea_dehydration_risk",
      priority: 89,
      title: "Diarrhea with dehydration risk",
      patientTextShort: "If diarrhea and low intake occur together, escalate to your care team quickly.",
      patientTextActions: [
        "Track fluids and signs of dehydration",
        "Use oral rehydration strategies",
        "Seek urgent care if unable to keep up with losses"
      ],
      whyThisMatters: "Dehydration can worsen quickly when GI losses are persistent.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["diarrhea"], symptomsAll: [], flagsAny: ["dehydration_risk"] },
      sourceIds: ["nciNutritionDuringCancer", "nciEatingHintsPdf"],
      evidenceTags: ["Government"]
    }),
    rec({
      id: "symptom_constipation_core",
      priority: 86,
      title: "Constipation supportive strategy",
      patientTextShort: "Constipation support includes fluids food pattern review and care team symptom plans.",
      patientTextActions: [
        "Increase fluids if your team has not restricted fluid intake",
        "Increase fiber gradually and pair fiber changes with fluid increases",
        "Use food pattern changes recommended by your care team for constipation",
        "Review constipation causing medicines and bowel plan with clinicians"
      ],
      whyThisMatters: "Constipation guidelines in oncology settings support early bowel-plan management to prevent appetite decline and discomfort-related intake loss.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["constipation"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["onsConstipationGuideline2020PubMed", "nciEatingHintsPdf", "acsEatingProblemsHub", "nutritionalOncology2022Book"],
      sourceLocators: {
        nutritionalOncology2022Book: "p. 127 (low-fiber patterns linked with constipation; higher-fiber plant intake context)"
      },
      evidenceTags: ["PeerReviewed", "Government", "CancerCenter"]
    }),
    rec({
      id: "symptom_constipation_fiber_titration",
      priority: 85,
      title: "Constipation fiber titration plan",
      patientTextShort: "When constipation is present, step fiber up gradually and monitor tolerance rather than making abrupt large increases.",
      patientTextActions: [
        "Increase fiber in small increments over several days",
        "Track stool pattern, bloating, and fluid intake together",
        "Pause or slow fiber increases if bloating worsens",
        "Escalate to your care team when constipation persists despite plan"
      ],
      whyThisMatters: "Evidence in nutrition oncology supports gradual, paired fiber and fluid adjustments to improve tolerance and bowel regularity.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["constipation"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nutritionalOncology2022Book", "onsConstipationGuideline2020PubMed"],
      sourceLocators: {
        nutritionalOncology2022Book: "p. 127 (higher fiber intake context and constipation association)"
      },
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),
    rec({
      id: "symptom_constipation_with_deficit",
      priority: 84,
      title: "Constipation with appetite decline",
      patientTextShort: "Constipation plus appetite decline should be discussed early with your care team.",
      patientTextActions: [
        "Track stool pattern and intake",
        "Use smaller frequent meals",
        "Report persistent symptoms to oncology team"
      ],
      whyThisMatters: "GI discomfort can create a cycle of lower intake and worsening symptoms.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["constipation", "appetite_loss"], symptomsAll: [], flagsAny: ["calorie_deficit"] },
      sourceIds: ["onsConstipationGuideline2020PubMed", "nciNutritionCarePDQ"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_appetite_loss_core",
      priority: 97,
      title: "Appetite loss immediate plan",
      patientTextShort: "Use high value foods first when appetite is reduced.",
      patientTextActions: [
        "Start each eating opportunity with the most calorie and protein dense items",
        "Use 5 to 6 smaller meals instead of waiting for hunger",
        "Keep ready to eat high protein snacks nearby",
        "Use liquid nutrition when solid intake is low"
      ],
      whyThisMatters: "Cachexia and oncology nutrition guidance consistently identify appetite loss and early satiety as key drivers of progressive deficits.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["appetite_loss", "early_satiety"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciNutritionCarePDQ", "ascoCachexia2020PubMed", "earlySatietyScoping2025PubMed"],
      evidenceTags: ["Government", "PeerReviewed"]
    }),
    rec({
      id: "symptom_appetite_loss_weight_risk",
      priority: 96,
      title: "Appetite loss with concerning weight trend",
      patientTextShort: "If appetite loss is paired with weight decline, escalate support quickly.",
      patientTextActions: [
        "Track weight and intake daily",
        "Use supplements when food volume is low",
        "Request urgent nutrition review"
      ],
      whyThisMatters: "Concerning weight loss may indicate progression toward cachexia or malnutrition.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["appetite_loss"], symptomsAll: [], flagsAny: ["weight_loss_concerning"] },
      sourceIds: ["ascoCachexia2020JCO", "espenCancerPractical2021Pdf", "glimMalnutrition2019"],
      evidenceTags: ["Guideline", "PeerReviewed"]
    }),
    rec({
      id: "symptom_dry_mouth_core",
      priority: 90,
      title: "Dry mouth hydration and texture strategy",
      patientTextShort: "Dry mouth can reduce swallowing comfort and intake; use moisture-focused food and fluid tactics.",
      patientTextActions: [
        "Use sauces, gravies, and moist textures with meals",
        "Sip fluids regularly during and between meals if not fluid-restricted",
        "Avoid very dry, crumbly, or irritating foods when symptoms flare",
        "Ask your team about saliva-support options for persistent symptoms"
      ],
      whyThisMatters: "Xerostomia guideline recommendations support early symptom management to preserve oral intake and reduce treatment burden.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["dry_mouth"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["ascoIsooMasccXerostomia2021PubMed", "nciEatingHintsPdf"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_dysphagia_core",
      priority: 92,
      title: "Difficulty swallowing safety and nutrition plan",
      patientTextShort: "When swallowing is difficult, texture modification and early escalation are important to protect intake and safety.",
      patientTextActions: [
        "Use soft, smooth, and easy-to-swallow textures",
        "Take small bites and frequent sips while eating",
        "Stop eating and seek urgent review if choking or aspiration symptoms occur",
        "Request speech/swallow specialist and dietitian input early"
      ],
      whyThisMatters: "Head and neck dysphagia consensus guidance emphasizes early multidisciplinary management to reduce complications and preserve nutrition.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["difficulty_swallowing"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["dysphagiaHncConsensus2023PubMed", "masccIsooMucositis2020PubMed"],
      evidenceTags: ["PeerReviewed"]
    }),
    rec({
      id: "symptom_fatigue_core",
      priority: 85,
      title: "Fatigue low-effort nutrition planning",
      patientTextShort: "With fatigue, simplify meal prep and preserve intake using low-effort high-value foods.",
      patientTextActions: [
        "Batch prepare meals on better-energy days",
        "Use ready-to-eat protein options and oral supplements as needed",
        "Set reminder-based meal timing when appetite cues are weak"
      ],
      whyThisMatters: "Fatigue guideline updates support structured activity and symptom management; practical nutrition simplification helps prevent avoidable deficits.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["fatigue"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["ascoFatigueGuideline2024PubMed", "nciEatingHintsPdf"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_bloating_core",
      priority: 83,
      title: "Bloating symptom-directed intake adjustment",
      patientTextShort: "Bloating may reduce meal tolerance; use smaller portions and symptom-linked food pattern adjustments.",
      patientTextActions: [
        "Shift to smaller and more frequent meals on bloating days",
        "Limit foods that repeatedly worsen abdominal distension",
        "Track bloating with stool pattern and appetite to identify triggers",
        "Contact your team if bloating persists or worsens"
      ],
      whyThisMatters: "Recent oncology nutrition meta-analysis supports symptom-targeted dietary strategies for GI symptom burden during treatment.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["bloating"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["giSymptomsNutritionMeta2025PubMed", "nciNutritionDuringCancer"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),
    rec({
      id: "symptom_pain_affecting_eating_core",
      priority: 91,
      title: "Pain affecting eating escalation",
      patientTextShort: "Pain that limits eating should trigger rapid symptom control and nutrition support.",
      patientTextActions: [
        "Document pain timing relative to meals and foods",
        "Use soft and easy-to-chew foods during pain flares",
        "Ask for pain-plan adjustment if pain is reducing daily intake",
        "Escalate same week when pain and intake deficits overlap"
      ],
      whyThisMatters: "Pain and GI symptom burden are linked with lower intake; early symptom control is needed to prevent cumulative nutrition decline.",
      triggers: { cancerTypes: [], treatments: [], symptomsAny: ["pain"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["giSymptomsNutritionMeta2025PubMed", "nciNutritionCarePDQ"],
      evidenceTags: ["PeerReviewed", "Government"]
    }),

    rec({
      id: "pancreatic_chemo_malabsorption",
      priority: 99,
      title: "Pancreatic chemotherapy malabsorption prompt",
      patientTextShort: "Pancreatic cancer with GI fat malabsorption symptoms may need enzyme related evaluation.",
      patientTextActions: [
        "Track stool changes, abdominal symptoms, and weekly weight trend",
        "Report greasy, floating, urgent, or frequent stools promptly",
        "Discuss evaluation for pancreatic exocrine insufficiency and enzyme therapy with your care team",
        "Ask whether fat-soluble vitamin monitoring is needed in your case"
      ],
      whyThisMatters: "AGA EPI guidance supports active evaluation for exocrine insufficiency in high-risk pancreatic cancer contexts.",
      triggers: { cancerTypes: ["pancreatic"], treatments: ["chemotherapy"], symptomsAny: ["diarrhea", "greasy_stools", "floating_stools"], symptomsAll: [], flagsAny: ["possible_malabsorption"] },
      sourceIds: ["agaEpi2023FullText", "agaEpi2023PubMed", "espenCancerPractical2021Pdf"],
      evidenceTags: ["PeerReviewed", "Guideline"]
    }),
    rec({
      id: "pancreatic_chemo_cachexia",
      priority: 98,
      title: "Pancreatic chemotherapy cachexia support",
      patientTextShort: "Weight loss during pancreatic chemotherapy needs early cachexia informed support.",
      patientTextActions: [
        "Track weekly weight and compare with one to three month trend",
        "Escalate promptly if weight loss approaches or exceeds 5 percent",
        "Use structured calorie and protein support with dietitian guidance",
        "Request early symptom management when intake drops"
      ],
      whyThisMatters: "ASCO cachexia and ESPEN sources support early intervention for concerning weight loss during active therapy.",
      triggers: { cancerTypes: ["pancreatic"], treatments: ["chemotherapy"], symptomsAny: [], symptomsAll: [], flagsAny: ["weight_loss_concerning"] },
      sourceIds: ["ascoCachexia2020PubMed", "espenCancerGuideline2017Pdf"],
      evidenceTags: ["PeerReviewed", "Guideline"]
    }),
    rec({
      id: "pancreatic_chemo_nausea",
      priority: 97,
      title: "Pancreatic chemotherapy nausea strategy",
      patientTextShort: "Use nausea focused meal planning early in pancreatic chemotherapy.",
      patientTextActions: [
        "Use small frequent low odor meals and snacks",
        "Choose bland foods first and avoid greasy foods on bad nausea days",
        "Separate fluids from meals if fullness worsens",
        "Ask your care team early for escalation if nausea persists"
      ],
      whyThisMatters: "Nausea can compound pancreatic related intake challenges.",
      triggers: { cancerTypes: ["pancreatic"], treatments: ["chemotherapy"], symptomsAny: ["nausea"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nciEatingHintsPdf", "nciNutritionDuringCancer"],
      evidenceTags: ["Government"]
    }),

    rec({
      id: "breast_radiation_protein_energy",
      priority: 95,
      title: "Breast radiation protein and energy support",
      patientTextShort: "During breast radiation, intake support should target protein and calorie adequacy.",
      patientTextActions: [
        "Add protein to every meal and snack",
        "Use high calorie snacks or supplements to close daily gaps",
        "Track calorie and protein deficits and share trends with your team",
        "Shift larger meals to times of better symptom control"
      ],
      whyThisMatters: "Radiation related fatigue and symptoms can lower intake if not addressed.",
      triggers: { cancerTypes: ["breast"], treatments: ["radiation"], symptomsAny: [], symptomsAll: [], flagsAny: ["protein_deficit", "calorie_deficit"] },
      sourceIds: ["espenCancerPractical2021Pdf", "nciEatingHintsPdf"],
      evidenceTags: ["Guideline", "Government"]
    }),
    rec({
      id: "breast_radiation_fatigue",
      priority: 94,
      title: "Breast radiation fatigue nutrition pacing",
      patientTextShort: "Fatigue during breast radiation may require simplified high value meal routines.",
      patientTextActions: [
        "Prepare meals in batches on better energy days",
        "Keep ready options with protein available for low energy periods",
        "Use hydration reminders during fatigue-heavy days",
        "Coordinate caregiver support when fatigue limits meal prep"
      ],
      whyThisMatters: "Fatigue can reduce meal preparation and intake consistency.",
      triggers: { cancerTypes: ["breast"], treatments: ["radiation"], symptomsAny: ["fatigue"], symptomsAll: [], flagsAny: [] },
      sourceIds: ["nccnFatiguePatientPdf", "nciEatingHintsPdf"],
      evidenceTags: ["Guideline", "Government"]
    }),

    rec({ id: "breast_specific_1", priority: 60, title: "Breast cancer treatment phase nutrition review", patientTextShort: "Breast cancer care should include regular nutrition review and symptom checks.", patientTextActions: ["Track intake and symptoms weekly", "Bring logs to oncology visits", "Request dietitian input for sustained deficits"], whyThisMatters: "Structured monitoring supports earlier supportive care decisions.", triggers: { cancerTypes: ["breast"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciNutritionDuringCancer", "nccnPatientGuidelinesLibrary"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "breast_specific_2", priority: 59, title: "Breast cancer appetite and weight surveillance", patientTextShort: "In breast cancer, appetite and weight changes should be followed consistently.", patientTextActions: ["Record weekly weight", "Log appetite quality", "Escalate persistent decline"], whyThisMatters: "Weight and appetite trends help identify when intervention is needed.", triggers: { cancerTypes: ["breast"], treatments: [], symptomsAny: ["appetite_loss"], symptomsAll: [], flagsAny: ["weight_loss_concerning"] }, sourceIds: ["nciNutritionCarePDQ", "espenCancerPractical2021Pdf"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "breast_specific_3", priority: 58, title: "Breast cancer survivorship nutrition planning", patientTextShort: "After breast cancer treatment, keep nutrition planning active with follow up teams.", patientTextActions: ["Keep a consistent meal routine", "Review changes at follow up", "Contact team for new persistent symptoms"], whyThisMatters: "Nutrition needs can continue to evolve after active treatment.", triggers: { cancerTypes: ["breast"], treatments: ["none"], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nccnPatientGuidelinesLibrary", "nciNutritionDuringCancer"], evidenceTags: ["Guideline", "Government"] }),

    rec({ id: "prostate_specific_1", priority: 57, title: "Prostate cancer monitoring framework", patientTextShort: "Use regular intake and weight tracking in prostate cancer care.", patientTextActions: ["Track meals and weight weekly", "Discuss trends in clinic", "Escalate sustained deficits"], whyThisMatters: "Routine monitoring supports early intervention.", triggers: { cancerTypes: ["prostate"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nccnPatientGuidelinesLibrary", "espenCancerPractical2021Pdf"], evidenceTags: ["Guideline"] }),
    rec({ id: "prostate_specific_2", priority: 56, title: "Prostate cancer fatigue and intake", patientTextShort: "Fatigue can interfere with intake and should trigger meal simplification strategies.", patientTextActions: ["Use easy high protein meals", "Schedule eating reminders", "Contact team if low intake persists"], whyThisMatters: "Fatigue associated intake declines can become cumulative.", triggers: { cancerTypes: ["prostate"], treatments: [], symptomsAny: ["fatigue"], symptomsAll: [], flagsAny: ["protein_deficit"] }, sourceIds: ["nccnFatiguePatientPdf", "nciEatingHintsPdf"], evidenceTags: ["Guideline", "Government"] }),
    rec({ id: "prostate_specific_3", priority: 55, title: "Prostate cancer symptom directed intake adaptation", patientTextShort: "Adjust texture and timing based on active symptoms during prostate cancer care.", patientTextActions: ["Use symptom matched food textures", "Keep hydration steady", "Review persistent symptoms with care team"], whyThisMatters: "Practical adaptation can protect intake during treatment periods.", triggers: { cancerTypes: ["prostate"], treatments: [], symptomsAny: ["nausea", "constipation", "diarrhea"], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciNutritionDuringCancer", "acsEatingProblemsHub"], evidenceTags: ["Government", "CancerCenter"] }),

    rec({ id: "lung_specific_1", priority: 57, title: "Lung cancer high risk intake tracking", patientTextShort: "Lung cancer care often needs close intake and weight trend review.", patientTextActions: ["Track weight weekly", "Monitor protein and calories", "Escalate ongoing decline"], whyThisMatters: "High symptom burden can accelerate nutrition decline.", triggers: { cancerTypes: ["lung"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionCarePDQ"], evidenceTags: ["Guideline", "Government"] }),
    rec({ id: "lung_specific_2", priority: 56, title: "Lung cancer dyspnea fatigue intake support", patientTextShort: "When fatigue and breathing burden limit eating, use lower effort meal strategies.", patientTextActions: ["Use frequent small meals", "Choose easy to chew textures", "Request dietitian support early"], whyThisMatters: "Reduced eating capacity can cause persistent deficits.", triggers: { cancerTypes: ["lung"], treatments: [], symptomsAny: ["fatigue", "early_satiety"], symptomsAll: [], flagsAny: ["calorie_deficit"] }, sourceIds: ["nciEatingHintsPdf", "espenCancerGuideline2017Pdf"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "lung_specific_3", priority: 55, title: "Lung cancer dehydration risk surveillance", patientTextShort: "GI symptoms in lung cancer treatment should trigger hydration surveillance.", patientTextActions: ["Track fluids daily", "Use oral hydration early", "Escalate if unable to maintain intake"], whyThisMatters: "Dehydration worsens fatigue and treatment tolerance.", triggers: { cancerTypes: ["lung"], treatments: [], symptomsAny: ["vomiting", "diarrhea"], symptomsAll: [], flagsAny: ["dehydration_risk"] }, sourceIds: ["nciEatingHintsPdf", "acsEatingProblemsHub"], evidenceTags: ["Government", "CancerCenter"] }),

    rec({ id: "colorectal_specific_1", priority: 57, title: "Colorectal cancer bowel symptom guided intake", patientTextShort: "Bowel symptoms should guide food texture and hydration strategy in colorectal care.", patientTextActions: ["Track stool pattern", "Adjust food choices to current symptoms", "Keep fluid logs"], whyThisMatters: "Bowel symptom variation can change tolerance day to day.", triggers: { cancerTypes: ["colorectal"], treatments: [], symptomsAny: ["diarrhea", "constipation", "bloating"], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciEatingHintsPdf", "nccnPatientGuidelinesLibrary"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "colorectal_specific_2", priority: 56, title: "Colorectal cancer deficit prevention", patientTextShort: "Prevent cumulative deficits by early intervention when intake drops.", patientTextActions: ["Track calories and protein", "Use snacks between meals", "Discuss persistent deficits with care team"], whyThisMatters: "Early deficit management can prevent worsening malnutrition risk.", triggers: { cancerTypes: ["colorectal"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["protein_deficit", "calorie_deficit"] }, sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionCarePDQ"], evidenceTags: ["Guideline", "Government"] }),
    rec({ id: "colorectal_specific_3", priority: 55, title: "Colorectal cancer postoperative intake progression", patientTextShort: "After colorectal procedures, progress intake based on tolerance and team guidance.", patientTextActions: ["Use tolerated textures", "Increase protein gradually", "Escalate persistent poor intake"], whyThisMatters: "Procedure related symptoms can delay normal intake without support.", triggers: { cancerTypes: ["colorectal"], treatments: ["surgery"], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["espenCancerGuideline2017Pdf", "nciNutritionDuringCancer"], evidenceTags: ["Guideline", "Government"] }),

    rec({ id: "melanoma_specific_1", priority: 57, title: "Melanoma treatment phase intake stability", patientTextShort: "Use consistent intake and hydration tracking during melanoma treatment.", patientTextActions: ["Track daily intake and symptoms", "Use symptom guided food choices", "Report persistent deficits"], whyThisMatters: "Consistent tracking helps identify when escalation is needed.", triggers: { cancerTypes: ["melanoma"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciNutritionDuringCancer", "nccnPatientGuidelinesLibrary"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "melanoma_specific_2", priority: 56, title: "Melanoma immunotherapy GI risk support", patientTextShort: "GI symptom periods may require temporary meal and hydration adaptation.", patientTextActions: ["Shift to tolerated lower irritation foods", "Hydrate steadily through the day", "Contact team for worsening symptoms"], whyThisMatters: "GI flares can quickly reduce intake and fluids.", triggers: { cancerTypes: ["melanoma"], treatments: ["immunotherapy"], symptomsAny: ["diarrhea", "nausea"], symptomsAll: [], flagsAny: ["dehydration_risk"] }, sourceIds: ["nciEatingHintsPdf", "acsEatingProblemsHub"], evidenceTags: ["Government", "CancerCenter"] }),
    rec({ id: "melanoma_specific_3", priority: 55, title: "Melanoma weight trend escalation", patientTextShort: "Unexpected weight decline in melanoma care should be reviewed early.", patientTextActions: ["Record weekly weight", "Track appetite and intake", "Request nutrition review if decline persists"], whyThisMatters: "Weight loss can indicate developing nutrition risk.", triggers: { cancerTypes: ["melanoma"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["weight_loss_concerning"] }, sourceIds: ["glimMalnutrition2019", "nciNutritionCarePDQ"], evidenceTags: ["PeerReviewed", "Government"] }),

    rec({ id: "bladder_specific_1", priority: 57, title: "Bladder cancer hydration and intake coordination", patientTextShort: "Hydration and nutrition timing should be coordinated with bladder symptom burden.", patientTextActions: ["Track fluid timing and symptoms", "Use tolerated meal scheduling", "Discuss persistent issues with team"], whyThisMatters: "Symptom patterns can disrupt routine intake and hydration.", triggers: { cancerTypes: ["bladder"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciNutritionDuringCancer", "nccnPatientGuidelinesLibrary"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "bladder_specific_2", priority: 56, title: "Bladder cancer perioperative nutrition readiness", patientTextShort: "Perioperative periods benefit from early protein and energy planning.", patientTextActions: ["Optimize intake before procedures", "Track appetite and symptoms", "Escalate deficits before surgery"], whyThisMatters: "Pre procedure nutrition decline can affect recovery.", triggers: { cancerTypes: ["bladder"], treatments: ["surgery"], symptomsAny: [], symptomsAll: [], flagsAny: ["calorie_deficit"] }, sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionDuringCancer"], evidenceTags: ["Guideline", "Government"] }),
    rec({ id: "bladder_specific_3", priority: 55, title: "Bladder cancer low intake escalation", patientTextShort: "Persistent low intake in bladder cancer treatment should trigger supportive care escalation.", patientTextActions: ["Track deficits by day", "Use oral nutrition support options", "Contact oncology team for sustained decline"], whyThisMatters: "Cumulative deficits can worsen tolerance and quality of life.", triggers: { cancerTypes: ["bladder"], treatments: [], symptomsAny: ["appetite_loss"], symptomsAll: [], flagsAny: ["protein_deficit", "calorie_deficit"] }, sourceIds: ["nciNutritionCarePDQ", "ascoCachexia2020PubMed"], evidenceTags: ["Government", "PeerReviewed"] }),

    rec({ id: "kidney_specific_1", priority: 57, title: "Kidney cancer renal and oncology nutrition alignment", patientTextShort: "Kidney cancer nutrition plans should align oncology and renal considerations.", patientTextActions: ["Use shared plan from oncology and renal teams", "Avoid independent electrolyte changes", "Track tolerance and weight"], whyThisMatters: "Conflicting restrictions can occur without coordinated planning.", triggers: { cancerTypes: ["kidney"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nccnPatientGuidelinesLibrary", "nciNutritionCarePDQ"], evidenceTags: ["Guideline", "Government"] }),
    rec({ id: "kidney_specific_2", priority: 56, title: "Kidney cancer treatment phase deficit prevention", patientTextShort: "Prevent deficits in kidney cancer by early intake adjustment and support.", patientTextActions: ["Track protein and calories", "Use symptom adapted meals", "Escalate persistent deficits"], whyThisMatters: "Early support reduces risk of worsening malnutrition.", triggers: { cancerTypes: ["kidney"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["protein_deficit", "calorie_deficit"] }, sourceIds: ["espenCancerPractical2021Pdf", "glimMalnutrition2019"], evidenceTags: ["Guideline", "PeerReviewed"] }),
    rec({ id: "kidney_specific_3", priority: 55, title: "Kidney cancer dialysis context reminder", patientTextShort: "If dialysis is part of care, ask for individualized fluid and nutrition guidance.", patientTextActions: ["Confirm daily fluid limits", "Confirm protein goals with renal team", "Report rapid weight changes"], whyThisMatters: "Dialysis context changes practical daily nutrition decisions.", triggers: { cancerTypes: ["kidney"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciNutritionDuringCancer", "espenCancerGuideline2017Pdf"], evidenceTags: ["Government", "Guideline"] }),

    rec({ id: "lymphoma_specific_1", priority: 57, title: "Lymphoma treatment cycle nutrition tracking", patientTextShort: "For lymphoma, monitor nutrition pattern across treatment cycles.", patientTextActions: ["Track intake by cycle day", "Identify low intake windows", "Plan support before expected low periods"], whyThisMatters: "Cyclic treatment effects can cause recurring deficits.", triggers: { cancerTypes: ["lymphoma"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciNutritionDuringCancer", "espenCancerPractical2021Pdf"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "lymphoma_specific_2", priority: 56, title: "Lymphoma mucosal symptom response", patientTextShort: "If oral and GI symptoms develop, quickly adapt meal texture and hydration pattern.", patientTextActions: ["Use soft tolerated foods", "Increase fluids in small intervals", "Escalate persistent pain or inability to eat"], whyThisMatters: "Symptom clusters can produce rapid intake decline.", triggers: { cancerTypes: ["lymphoma"], treatments: [], symptomsAny: ["mouth_sores", "nausea", "vomiting"], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciEatingHintsPdf", "pennMucositisTipSheet"], evidenceTags: ["Government", "CancerCenter"] }),
    rec({ id: "lymphoma_specific_3", priority: 55, title: "Lymphoma deficit escalation plan", patientTextShort: "Escalate lymphoma related intake deficits early with your oncology team.", patientTextActions: ["Track protein and calorie gaps", "Use supplements when intake drops", "Request oncology dietitian review"], whyThisMatters: "Persistent deficits can worsen fatigue and treatment tolerance.", triggers: { cancerTypes: ["lymphoma"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: ["protein_deficit", "calorie_deficit"] }, sourceIds: ["ascoCachexia2020PubMed", "nciNutritionCarePDQ"], evidenceTags: ["PeerReviewed", "Government"] }),

    rec({ id: "uterine_specific_1", priority: 57, title: "Uterine cancer nutrition monitoring", patientTextShort: "In uterine cancer care, monitor intake symptoms and weight trends consistently.", patientTextActions: ["Track weekly weight", "Track appetite and meal completion", "Discuss trends at follow up"], whyThisMatters: "Routine monitoring helps identify changes early.", triggers: { cancerTypes: ["uterine"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["nciNutritionDuringCancer", "nccnPatientGuidelinesLibrary"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "uterine_specific_2", priority: 56, title: "Uterine cancer fatigue and nutrition", patientTextShort: "Fatigue in uterine cancer treatment may require lower effort nutrition strategies.", patientTextActions: ["Use ready high protein foods", "Plan meals around energy patterns", "Request support for persistent fatigue"], whyThisMatters: "Fatigue can reduce meal prep and total intake.", triggers: { cancerTypes: ["uterine"], treatments: [], symptomsAny: ["fatigue"], symptomsAll: [], flagsAny: ["calorie_deficit"] }, sourceIds: ["nccnFatiguePatientPdf", "nciEatingHintsPdf"], evidenceTags: ["Guideline", "Government"] }),
    rec({ id: "uterine_specific_3", priority: 55, title: "Uterine cancer appetite decline escalation", patientTextShort: "Persistent appetite decline in uterine cancer should be escalated early.", patientTextActions: ["Use frequent smaller meals", "Track calorie and protein intake", "Contact team if decline persists"], whyThisMatters: "Appetite decline can progress to meaningful weight loss without intervention.", triggers: { cancerTypes: ["uterine"], treatments: [], symptomsAny: ["appetite_loss"], symptomsAll: [], flagsAny: ["weight_loss_concerning"] }, sourceIds: ["nciNutritionCarePDQ", "ascoCachexia2020JCO"], evidenceTags: ["Government", "Guideline"] }),

    rec({ id: "pancreatic_specific_1", priority: 96, title: "Pancreatic cancer high risk nutrition surveillance", patientTextShort: "Pancreatic cancer often requires intensified nutrition surveillance.", patientTextActions: ["Track weight at least weekly", "Track stool and appetite changes", "Escalate trends early"], whyThisMatters: "Pancreatic cancer has high risk of severe nutrition decline.", triggers: { cancerTypes: ["pancreatic"], treatments: [], symptomsAny: [], symptomsAll: [], flagsAny: [] }, sourceIds: ["espenCancerPractical2021Pdf", "nciNutritionCarePDQ"], evidenceTags: ["Guideline", "Government"] }),
    rec({ id: "pancreatic_specific_2", priority: 95, title: "Pancreatic cancer low intake rapid response", patientTextShort: "Low intake in pancreatic cancer should trigger rapid supportive intervention.", patientTextActions: ["Track daily intake deficits", "Use supplemental nutrition options", "Contact care team quickly"], whyThisMatters: "Deficits can become clinically significant in a short period.", triggers: { cancerTypes: ["pancreatic"], treatments: [], symptomsAny: ["appetite_loss", "early_satiety"], symptomsAll: [], flagsAny: ["calorie_deficit", "protein_deficit"] }, sourceIds: ["nciNutritionCarePDQ", "espenCancerGuideline2017Pdf"], evidenceTags: ["Government", "Guideline"] }),
    rec({ id: "pancreatic_specific_3", priority: 94, title: "Pancreatic cancer GI symptom and stool monitoring", patientTextShort: "GI and stool symptom tracking supports early recognition of malabsorption patterns.", patientTextActions: ["Record stool consistency and frequency", "Record floating or greasy stool episodes", "Discuss findings with your care team"], whyThisMatters: "Targeted evaluation is important when pancreatic symptoms suggest malabsorption.", triggers: { cancerTypes: ["pancreatic"], treatments: [], symptomsAny: ["diarrhea", "greasy_stools", "floating_stools", "bloating"], symptomsAll: [], flagsAny: ["possible_malabsorption"] }, sourceIds: ["agaEpi2023FullText", "agaEpi2023PubMed"], evidenceTags: ["PeerReviewed"] })
  ];

  window.RECOMMENDATIONS_CATALOG = RECOMMENDATIONS_CATALOG;
})();
