# Studio Plugin for Sanity & Smartling

A fork of the official [sanity-plugin-studio-smartling](https://github.com/sanity-io/sanity-plugin-studio-smartling) plugin.

Differences to the official plugin:

- Works in Sanity Studio V3
- Use both field and document level at the same time
  - Uses document level translation when `i18n: true` is added to a `schema`.

Instructions:

- Configure `.env` with the following keys:
  - `SANITY_STUDIO_SMARTLING_PLUGIN_ORGANIZATION`
  - `SANITY_STUDIO_SMARTLING_PLUGIN_PROJECT`
  - `SANITY_STUDIO_SMARTLING_PLUGIN_SECRET`
