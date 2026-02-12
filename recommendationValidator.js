(function () {
  function domainAllowed(url) {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return (window.ALLOWED_SOURCE_DOMAINS || []).some((allowed) => {
        const normalized = String(allowed || "").toLowerCase();
        return host === normalized || host.endsWith(`.${normalized}`);
      });
    } catch (_err) {
      return false;
    }
  }

  function validateRecommendationCatalog(recommendations) {
    const registry = window.SOURCES_REGISTRY || {};
    const errors = [];

    if (!Array.isArray(recommendations)) {
      return {
        valid: false,
        errors: ["Recommendation catalog is missing or invalid."]
      };
    }

    recommendations.forEach((rec) => {
      if (!rec || !rec.id) {
        errors.push("Recommendation missing id.");
        return;
      }

      if (!Array.isArray(rec.sourceIds) || rec.sourceIds.length === 0) {
        errors.push(`${rec.id}: missing sourceIds.`);
        return;
      }

      rec.sourceIds.forEach((sourceId) => {
        const source = registry[sourceId];
        if (!source) {
          errors.push(`${rec.id}: sourceId '${sourceId}' not found in sourcesRegistry.js.`);
          return;
        }
        if (!domainAllowed(source.url)) {
          errors.push(`${rec.id}: source '${sourceId}' uses non-allowlisted domain.`);
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  function validateAllSourcesRegistryDomains() {
    const registry = window.SOURCES_REGISTRY || {};
    const errors = [];
    Object.keys(registry).forEach((id) => {
      const src = registry[id];
      if (!domainAllowed(src.url)) {
        errors.push(`Source '${id}' has non-allowlisted domain.`);
      }
    });
    return {
      valid: errors.length === 0,
      errors
    };
  }

  window.validateRecommendationCatalog = validateRecommendationCatalog;
  window.validateAllSourcesRegistryDomains = validateAllSourcesRegistryDomains;
})();
