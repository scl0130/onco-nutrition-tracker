(function () {
  function isAllowlisted(url) {
    try {
      const host = new URL(url).hostname.toLowerCase();
      return (window.ALLOWED_SOURCE_DOMAINS || []).some((domain) => host === domain || host.endsWith(`.${domain}`));
    } catch (_err) {
      return false;
    }
  }

  function validateSourcesRegistryDomains() {
    const registry = window.SOURCES_REGISTRY || {};
    const errors = [];
    Object.keys(registry).forEach((id) => {
      const src = registry[id];
      if (!isAllowlisted(src.url)) {
        errors.push(`Source '${id}' is outside allowlist.`);
      }
    });
    return { valid: errors.length === 0, errors };
  }

  function validateRecommendationSourceIds(recommendations) {
    const registry = window.SOURCES_REGISTRY || {};
    const errors = [];
    const validRecommendations = [];

    (Array.isArray(recommendations) ? recommendations : []).forEach((rec) => {
      if (!rec || !rec.id) {
        errors.push("Recommendation missing id.");
        return;
      }
      if (!Array.isArray(rec.sourceIds) || rec.sourceIds.length === 0) {
        errors.push(`${rec.id}: missing sourceIds.`);
        return;
      }

      const invalid = rec.sourceIds.some((sourceId) => {
        const source = registry[sourceId];
        if (!source) return true;
        if (!isAllowlisted(source.url)) return true;
        return false;
      });

      if (invalid) {
        errors.push(`${rec.id}: has invalid sourceId or non-allowlisted source URL.`);
        return;
      }

      validRecommendations.push(rec);
    });

    return {
      valid: errors.length === 0,
      errors,
      validRecommendations
    };
  }

  window.validateSourcesRegistryDomains = validateSourcesRegistryDomains;
  window.validateRecommendationSourceIds = validateRecommendationSourceIds;
})();
