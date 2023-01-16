export function getSmartlingSecrets() {
  const {
    SANITY_STUDIO_SMARTLING_PLUGIN_ORGANIZATION,
    SANITY_STUDIO_SMARTLING_PLUGIN_PROJECT,
    SANITY_STUDIO_SMARTLING_PLUGIN_SECRET,
  } = import.meta.env

  const smartlingSecrets = {
    organization: SANITY_STUDIO_SMARTLING_PLUGIN_ORGANIZATION || null,
    project: SANITY_STUDIO_SMARTLING_PLUGIN_PROJECT || null,
    secret: SANITY_STUDIO_SMARTLING_PLUGIN_SECRET || null,
  }

  return smartlingSecrets
}
