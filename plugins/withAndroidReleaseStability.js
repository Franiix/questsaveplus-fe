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
    def effectiveUploadKeystore = repoRootUploadKeystore.exists()
        ? repoRootUploadKeystore
        : (configuredUploadKeystore?.exists() ? configuredUploadKeystore : null)`
    );
  }

  next = next.replace(
    /def effectiveUploadKeystore = configuredUploadKeystore\?\.(?:exists\(\))\n\s*\? configuredUploadKeystore\n\s*: \(repoRootUploadKeystore\.exists\(\) \? repoRootUploadKeystore : null\)/,
    `def effectiveUploadKeystore = repoRootUploadKeystore.exists()
        ? repoRootUploadKeystore
        : (configuredUploadKeystore?.exists() ? configuredUploadKeystore : null)`
  );

  next = next.replace(/project\.hasProperty\('MYAPP_UPLOAD_STORE_FILE'\) &&\n\s*/g, '');

  next = next.replace(/buildTypes \{[\s\S]*?\n    \}/, (buildTypesBlock) => {
    let normalizedBlock = buildTypesBlock;

    normalizedBlock = normalizedBlock.replace(
      /debug \{\n([\s\S]*?)signingConfig signingConfigs\.(debug|release)/,
      (match, prefix) => `debug {\n${prefix}signingConfig signingConfigs.debug`
    );

    normalizedBlock = normalizedBlock.replace(
      /release \{\n([\s\S]*?)signingConfig signingConfigs\.(debug|release)/,
      (match, prefix) => `release {\n${prefix}signingConfig signingConfigs.release`
    );

    return normalizedBlock;
  });

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
