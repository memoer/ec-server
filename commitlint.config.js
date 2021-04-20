module.exports = {
  extends: ['@commitlint/config-conventional'],
  'type-enum': [
    2,
    'always',
    ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore'],
  ],
};
