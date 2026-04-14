const {
  withAppBuildGradle,
  createRunOncePlugin,
} = require('@expo/config-plugins');

const pkg = require('../package.json');

function ensureAppBuildGradle(content) {
  let next = content;

  if (!next.includes("signingConfigs {\n        debug")) {
    return next;
  }

  if (!next.includes('signingConfigs {\n        debug') || next.includes('signingConfigs {\n        debug') === false) {
    return next;
  }

  if (!next.includes('signingConfigs {\n        debug') || next.includes('signingConfigs {\n        debug') === false) {
    return next;
  }

  if (!next.includes('release {\n            if (')) {
    next = next.replace(
      /signingConfigs \{\n([\s\S]*?)\n    \}/,
      `signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (
                effectiveUploadKeystore != null &&
                project.hasProperty('MYAPP_UPLOAD_STORE_FILE') &&
                project.hasProperty('MYAPP_UPLOAD_STORE_PASSWORD') &&
                project.hasProperty('MYAPP_UPLOAD_KEY_ALIAS') &&
                project.hasProperty('MYAPP_UPLOAD_KEY_PASSWORD')
            ) {
                storeFile effectiveUploadKeystore
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }`
    );
  }

  if (!next.includes('def repoRootUploadKeystore = new File(projectRoot, "questsaveplus-upload.keystore")')) {
    next = next.replace(
      /defaultConfig \{\n([\s\S]*?)\n    \}/,
      (match) =>
        `${match}
    def repoRootUploadKeystore = new File(projectRoot, "questsaveplus-upload.keystore")
    def configuredUploadKeystore = project.hasProperty('MYAPP_UPLOAD_STORE_FILE') ? file(MYAPP_UPLOAD_STORE_FILE) : null
    def effectiveUploadKeystore = configuredUploadKeystore?.exists()
        ? configuredUploadKeystore
        : (repoRootUploadKeystore.exists() ? repoRootUploadKeystore : null)`
    );
  }

  next = next.replace(
    /debug \{\n([\s\S]*?)signingConfig signingConfigs\.release/,
    (match, prefix) => `debug {\n${prefix}signingConfig signingConfigs.debug`
  );

  next = next.replace(
    /release \{\n([\s\S]*?)signingConfig signingConfigs\.debug/,
    (match, prefix) => `release {\n${prefix}signingConfig signingConfigs.release`
  );

  return next;
}

const withAndroidReleaseStability = (config) => {
  config = withAppBuildGradle(config, (mod) => {
    mod.modResults.contents = ensureAppBuildGradle(mod.modResults.contents);
    return mod;
  });

  return config;
};

module.exports = createRunOncePlugin(
  withAndroidReleaseStability,
  'with-android-release-stability',
  pkg.version
);
