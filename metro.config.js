const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'), // Exclude SVG from being treated as assets
        sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'], // Add SVG to source extensions
    },
});
