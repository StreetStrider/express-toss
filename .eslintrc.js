
module.exports =
{
	extends: require.resolve('js-outlander'),

	parser: '@typescript-eslint/parser',
	parserOptions:
	{
		// ecmaVersion: 6,
		sourceType: 'module',
	},

	plugins:
	[
		'@typescript-eslint'
	],

	rules:
	{
		//'no-unused-vars': 0,
		'@typescript-eslint/no-unused-vars': 2,
	}
}
