// Dynamic config — extends app.json and allows per-platform version overrides.
// Set APP_VERSION in the eas.json profile env to control the version string per platform.
/** @param {{ config: import('@expo/config-types').ExpoConfig }} param */
export default ({ config }) => ({
 ...config,
 version: process.env.APP_VERSION ?? config.version,
});
