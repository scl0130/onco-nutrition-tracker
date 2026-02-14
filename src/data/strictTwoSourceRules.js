(function () {
  // User-provided structured extraction from:
  // 1) Nutritional Oncology (CRC Press, 2022)
  // 2) ESMO Handbook of Cancer Prevention
  window.STRICT_TWO_SOURCE_RULES = {
    dataset_name: "onco_nutrition_rules_strict_two_sources",
    sources: {
      nutritionalOncology2022Book: {
        source_id: "nutritional_oncology_2022_crc_press_pdf",
        allowed_use: "nutrition during cancer prevention, treatment, survivorship, nutrition support, symptom discussions"
      },
      esmoCancerPreventionHandbook2008: {
        source_id: "esmo_cancer_prevention_handbook_2007_pdf",
        allowed_use: "prevention focused nutrition and lifestyle recommendations"
      }
    },
    global_principles: {
      individualization_required: true,
      malnutrition_can_exist_at_any_bmi: true
    },
    energy_rules: {
      lean_mass_energy_context_kcal_per_kg: 30,
      small_sedentary_woman_example_kcal: 1450
    },
    protein_rules: {
      lean_mass_primary_prescription_g_per_lb_lbm: 1,
      protein_distribution_across_meals: true,
      avoid_rda_0_8_as_oncology_target: true
    },
    intake_escalation: {
      trigger_percent_energy_needs_lt: 50,
      anticipated_days_threshold: 10,
      actual_days_threshold: 14
    },
    symptom_notes: {
      chemo_related_nausea: {
        ginger_adjunct_supported: true,
        forms: ["lozenges", "candy"]
      },
      taste_smell_change_intake_risk: true,
      xerostomia_bad_taste_association: true
    }
  };
})();
