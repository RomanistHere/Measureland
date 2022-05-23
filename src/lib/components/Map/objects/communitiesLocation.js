const batumiProps = {
	"city_ru": "Батуми",
	"city_en": "Batumi",
	"isCommunity_ru": true,
	"isCommunity_en": false,
	"id": "1",
	"center": [ 41.62, 41.62 ],
};

const tbilisiProps = {
	"city_ru": "Тбилиси",
	"city_en": "Tbilisi",
	"isCommunity_ru": true,
	"isCommunity_en": true,
	"id": "2",
	"center": [ 44.8, 41.7 ],
};

const baliProps = {
	"city_ru": "Бали",
	"city_en": "Bali",
	"isCommunity_ru": true,
	"isCommunity_en": false,
	"id": "3",
	"center": [ 115.2, -8.4 ],
};

const berlinProps = {
	"city_ru": "Берлин",
	"city_en": "Berlin",
	"isCommunity_ru": true,
	"isCommunity_en": false,
	"id": "4",
	"center": [ 13.4, 52.5 ],
};

export const communitiesLocation = {
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"properties": batumiProps,
		"geometry": {
			"type": "Point",
			"coordinates": batumiProps.center,
		},
	}, {
		"type": "Feature",
		"properties": tbilisiProps,
		"geometry": {
			"type": "Point",
			"coordinates": tbilisiProps.center,
		},
	}, {
		"type": "Feature",
		"properties": baliProps,
		"geometry": {
			"type": "Point",
			"coordinates": baliProps.center,
		},
	}, {
		"type": "Feature",
		"properties": berlinProps,
		"geometry": {
			"type": "Point",
			"coordinates": berlinProps.center,
		},
	}],
};

export const communitiesLocationNearby = {
	"type": "FeatureCollection",
	"features": [{
		"type": "Feature",
		"properties": batumiProps,
		"geometry": {
			"type": "Polygon",
			"coordinates": [
				[
					[ 41.766, 41.989 ],
					[ 42.3084, 41.9197 ],
					[ 41.921, 41.1352 ],
					[ 41.214, 41.309 ],
					[ 41.4116, 41.3984 ],
					[ 41.5833, 41.636 ],
					[ 41.751, 41.758 ],
					[ 41.766, 41.989 ],
				],
			],
		},
	}, {
		"type": "Feature",
		"properties": tbilisiProps,
		"geometry": {
			"type": "Polygon",
			"coordinates": [
				[
					[ 44.3381, 42.0666 ],
					[ 43.9618, 41.6924 ],
					[ 44.3587, 41.2313 ],
					[ 45.1346, 41.2324 ],
					[ 45.5013, 41.6637 ],
					[ 45.1895, 42.0758 ],
					[ 44.3381, 42.0666 ],
				],
			],
		},
	}, {
		"type": "Feature",
		"properties": baliProps,
		"geometry": {
			"type": "Polygon",
			"coordinates": [
				[
					[ 114.46, -8.06	],
					[ 114.4, -8.2	],
					[ 115.1, -8.9	],
					[ 115.66, -8.9	],
					[ 115.73, -8.3	],
					[ 115.18, -8	],
					[ 114.46, -8.05	],
				],
			],
		},
	}, {
		"type": "Feature",
		"properties": berlinProps,
		"geometry": {
			"type": "Polygon",
			"coordinates": [
				[
					[ 13.4, 52.79 ],
					[ 12.7, 52.57 ],
					[ 12.93, 52.19 ],
					[ 13.75, 52.17 ],
					[ 13.97, 52.5 ],
					[ 13.4, 52.8 ],
				],
			],
		},
	}],
};
