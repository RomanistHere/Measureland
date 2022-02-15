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
				'active': '#4682B4',
			},
		},
	},
	plugins: [],
};

module.exports = config;
