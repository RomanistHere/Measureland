module.exports = {
	root: true,
	extends: ['eslint:recommended'],
	plugins: ['svelte3'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2021,
	},
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	rules: {
		// "curly": [2, "multi"], // enabling this spoils some of if-else blocks across the app
		"object-curly-spacing": [2, "always"],
		"brace-style": [2, "1tbs", { "allowSingleLine": true }],
		"nonblock-statement-body-position": [2, "below"],
		"indent": [2, "tab"],
		"func-style": [1, "expression", { "allowArrowFunctions": true }],
		"no-console": 1,
		"no-debugger": 2,
		"no-alert": 2,
		"no-constant-condition": 2,
		"comma-dangle": [2, "always-multiline"],
		"no-cond-assign": [2, "always"],
		"no-dupe-args": 2,
		"no-dupe-keys": 2,
		"no-empty": 2,
		"no-ex-assign": 2,
		"no-extra-semi": 2,
		"no-extra-boolean-cast": 2,
		"no-func-assign": 2,
		"no-inner-declarations": [2, "both"],
		"no-unexpected-multiline": 2,
		"semi": [2, "always", { "omitLastInOneLineBlock": true }],
		"no-unreachable": 2,
		"no-eval": 2,
		"no-implied-eval": 2,
		"no-lonely-if": 1,
		"array-callback-return": 1,
		"block-scoped-var": 1,
		"eqeqeq": [2, "smart"],
		"no-empty-pattern": 1,
		"no-extend-native": 1,
		"no-implicit-coercion": 1,
		"no-iterator": 2,
		"no-lone-blocks": 2,
		"no-loop-func": 1,
		"no-multi-spaces": 1,
		"no-multi-str": 1,
		"no-native-reassign": 2,
		"no-new-func": 1,
		"no-new-wrappers": 1,
		"no-new": 1,
		"no-param-reassign": [2, { "props": false }],
		"no-process-env": 0,
		"no-proto": 1,
		"no-redeclare": 2,
		"no-return-assign": 2,
		"no-script-url": 2,
		"no-self-assign": 1,
		"no-self-compare": 2,
		"no-sequences": 2,
		"no-unmodified-loop-condition": 1,
		"no-unused-expressions": [2, { "allowShortCircuit": true, "allowTernary": true }],
		"no-useless-concat": 2,
		"no-void": 1,
		"no-with": 1,
		"yoda": [1, "never"],
		"no-catch-shadow": 1,
		"no-shadow-restricted-names": 1,
		"no-shadow": 1,
		"no-undef": [2, { typeof: true }],
		"array-bracket-spacing": [2, "always", { "objectsInArrays": false, "arraysInArrays": false }],
		"block-spacing": [2, "always"],
		"camelcase": [2, { "properties": "always" }],
		"comma-spacing": [2, { "before": false, "after": true }],
		"comma-style": [2, "last"],
		"computed-property-spacing": [2, "never"],
		"jsx-quotes": [1, "prefer-single"],
		"keyword-spacing": [2, { "before": true, "after": true }],
		"max-depth": [1, 5],
		"max-len": [2, { "code": 140, "tabWidth": 4, "ignoreUrls": true }],
		"max-nested-callbacks": [2, 2],
		"no-mixed-spaces-and-tabs": [2, "smart-tabs"],
		"no-multiple-empty-lines": [2, { "max": 2, "maxEOF": 1, "maxBOF": 0 }],
		"no-nested-ternary": 1,
		"no-ternary": 0,
		"no-trailing-spaces": 2,
		"no-unneeded-ternary": 0,
		"one-var": [2, "never"],
		"operator-assignment": [1, "never"],
		"padded-blocks": [2, "never"],
		"quote-props": [2, "consistent"],
		"semi-spacing": [2, { "before": false, "after": true }],
		"space-before-function-paren": [2, "always"],
		"space-in-parens": [2, "never"],
		"space-infix-ops": 2,
		"spaced-comment": [2, "always"],
		"arrow-body-style": [2, "as-needed"],
		"arrow-parens": [2, "as-needed"],
		"arrow-spacing": 2,
		"no-var": 2,
		"object-shorthand": 1,
		"prefer-arrow-callback": 1,
		"prefer-const": 2,
		"prefer-template": 2,
		"template-curly-spacing": [2, "never"],
        "no-unused-vars": 1
	}
};
