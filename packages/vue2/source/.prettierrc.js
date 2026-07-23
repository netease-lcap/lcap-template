module.exports = {
  printWidth: 100,
  useTabs: false,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  embeddedLanguageFormatting: 'off',
  overrides: [
    {
      files: '*.vue',
      options: {
        printWidth: 300,
        singleAttributePerLine: true,
      },
    },
  ],
};
