const plugin = require('tailwindcss/plugin');

// reference: https://stackoverflow.com/a/67458852/11698825
const hoverPlugin = plugin(function({ addVariant, e, postcss }) {
	addVariant('hover', ({ container, separator }) => {
		const hoverRule = postcss.atRule({ name: 'media', params: '(hover: hover) and (pointer: fine)' });
		hoverRule.append(container.nodes);
		container.append(hoverRule);
		hoverRule.walkRules(rule => {
			rule.selector = `.${e(`hover${separator}${rule.selector.slice(1)}`)}:hover`
		});
	});
});

const config = {
	mode: "jit",
	purge: [
		"./src/**/*.{html,js,svelte,ts}",
	],
	theme: {
		extend: {
			screens: {
				'-2xl': { max: '1535px' },
				'-xl': { max: '1279px' },
				'-lg': { max: '1023px' },
				'-md': { max: '767px' },
				'-sm': { max: '639px' },
				'@md': { min: '640px', max: '767px' },
				'@lg': { min: '768px', max: '1023px' },
				'@xl': { min: '1024px', max: '1279px' },
				'@2xl': { min: '1280px', max: '1535px' },
			},
			zIndex: {
				'-1': '-1',
        		'1': 1,
				'2': 2,
				'3': 3,
				'4': 4,
				'5': 5,
			},
			fontFamily: {
				sans: ['"Nunito"', 'sans-serif']
		    },
			height: {
				'100': '25rem',
			},
			colors: {
				'active': '#007097',
				'success': '#146481',
				'non-active': '#31493c54',
				'main-bg': '#d4eff5',
				'add-bg': '#d4eff554',
				'add-bg-non-tr': '#d4eff554',
				'text': '#001A23',
				'good-feeling': '#bcedb5',
				'neutral-feeling': '#fcd9f6',
				'bad-feeling': '#ffbaba',
				'error': '#ffa500',
				'almost-inv': '#dddddd',
			},
		},
	},
	plugins: [ hoverPlugin ],
};

module.exports = config;
