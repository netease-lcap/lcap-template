module.exports = {
  printWidth: 120,
  useTabs: false,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
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
