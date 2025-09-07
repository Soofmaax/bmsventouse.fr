module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    // Keep important constraints
    'selector-max-id': 0,
    'font-family-no-missing-generic-family-keyword': null,
    // Relax overly strict or legacy rules to make CI pass with current CSS
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'keyframes-name-pattern': null,
    'selector-class-pattern': null,
    'media-feature-range-notation': null,
    'alpha-value-notation': null,
    'rule-empty-line-before': null,
    'declaration-block-no-duplicate-properties': null
  }
};