let visitedPoly = null
let cachedData = []
let usedBounds = []
let index

const debounce = (func, wait, immediate) => {
	var timeout
	return function() {
		var context = this, args = arguments
		var later = function() {
			timeout = null
			if (!immediate) func.apply(context, args)
		}
		var callNow = immediate && !timeout
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
		if (callNow) func.apply(context, args)
	}
}

const clusterCaption = {
	en: {
		titleSingle: `This place's average rating's about`,
		titleGrp: `This group of places average rating's about`,
	},
	ru: {
		titleSingle: `Средний рейтинг в данном месте примерно`,
		titleGrp: `Средний рейтинг в данной группе примерно`,
	}
}

const createClusterIcon = (feature, latlng) => {
    if (!feature.properties.cluster) {
		// single point
		const rating = roundToInt(feature.properties.averageRating)
	    const icon = getIcon(Math.floor(rating))
	    const marker = L.marker(latlng, {
	        icon: icon,
	        title: `${clusterCaption[state.lang]['titleSingle']} ${rating}`,
	        riseOnHover: true,
	        rating: rating,
	    })
		marker.on('click', initRatingPopup)
		return marker
	} else {
		// cluster
		const rating = roundToInt(feature.properties.ratingSum / feature.properties.point_count)
		const grpIcon = getGrpIcon(Math.floor(rating))
		const marker = L.marker(latlng, {
			icon: grpIcon,
			title: `${clusterCaption[state.lang]['titleGrp']} ${rating}`,
			riseOnHover: true,
			rating: rating,
		})
		return marker
	}
}

const clusterMarkers = L.geoJson(null, {
    pointToLayer: createClusterIcon
}).addTo(map)

const updateClusters = () => {
	const bounds = map.getBounds()
	const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()]
	const zoom = map.getZoom()
	const clusters = index.getClusters(bbox, zoom)

	clusterMarkers.clearLayers()
	clusterMarkers.addData(clusters)
}

clusterMarkers.on('click', e => {
	state.flow.push('cc')
	const clusterId = e.layer.feature.properties.cluster_id
	const center = e.latlng
	if (clusterId) {
		const expansionZoom = index.getClusterExpansionZoom(clusterId)
		map.setView(center, expansionZoom)
	}
})

const clusterData = (geoData = null) => {
	data = geoData || cachedData
	index = new Supercluster({
        // log: true,
        radius: 150,
        minPoints: 2,
        minZoom: 4
    }).load(data)

	updateClusters()
}

// addPointer cluster 2.0 version (supercluster)
const addPointer = (coordsData, ratingData) => {
    const newPoint = {
		geometry: {
			coordinates: coordsData.reverse(),
			type: 'Point'
		},
		properties: {
			averageRating: ratingData
		},
		type: "Feature"
	}

	cachedData = [ ...cachedData, newPoint ]
	clusterData()
}

const removePointer = (coords) => {
	const [ lat, lng ] = coords.reverse()
	const length = cachedData.length
    for (let i = 0; i < length; i++) {
		const arr = cachedData[i]['geometry']['coordinates']
        if (arr[0] === lat && arr[1] === lng) {
			cachedData.splice(i, 1)
            return
        }
    }
}

const addDataAndDisplay = data => {
	// console.time('fix geojson')
	const geoData = Object.values(data).map(item => {
        const newObj = {
            ...item,
            geometry: {
                coordinates: item['location']['coordinates'],
                type: 'Point'
            },
            type: "Feature"
        }
        delete newObj['location']
        delete newObj['_id']
        return newObj
    })

	if (!state.isFiltersOn) {
		cachedData = [ ...cachedData, ...geoData ]
		// console.log('total number of points in cache: ', cachedData.length)

		// console.timeEnd('fix geojson')

		clusterData()
	} else {
		clusterData(geoData)
	}
}

const updateUrl = (coords, zoom) => {
	const { lat, lng } = coords

    const url = new URL(window.location.href)
    url.searchParams.set('lat', roundToFifthDecimal(lat))
	url.searchParams.set('lng', roundToFifthDecimal(lng))
    url.searchParams.set('zoom', zoom)
	state = { ...state, zoom }

	if (state.filters && state.isFiltersOn) {
		url.searchParams.set('fi', objToString(state.filters))
	}

	window.history.replaceState(null, null, url)
}

const getNewData = async () => {
	state.flow.push('me')
	// console.warn('____________new_try____________')
	// console.time('preparations')
    const bounds = map.getBounds()
    const zoom = map.getZoom()
    const northEast = bounds.getNorthEast()
    const southWest = bounds.getSouthWest()
    const bbox = [
        [ roundToFifthDecimal(northEast.lat), roundToFifthDecimal(northEast.lng) ],
        [ roundToFifthDecimal(southWest.lat), roundToFifthDecimal(southWest.lng) ]
    ]

	updateUrl(bounds.getCenter(), zoom)

	const east = roundToFifthDecimal(bounds.getEast())
	const north = roundToFifthDecimal(bounds.getNorth())
	const west = roundToFifthDecimal(bounds.getWest())
	const south = roundToFifthDecimal(bounds.getSouth())

	const currentScreenPoly = {
		regions: [
			[ [north, west], [north, east], [south, east], [south, west] ]
		],
		inverted: false
	}

	const queryPolygon = visitedPoly !== null && !state.isFiltersOn
		? PolyBool.differenceRev(visitedPoly, currentScreenPoly)
		: currentScreenPoly

	// use data from cache
	if (!queryPolygon.regions[0])
		return clusterData()

	const getQuery = queryPolygon => {
		if (queryPolygon.regions[2]) {
			return currentScreenPoly.regions[0]
		} else if (queryPolygon.regions[1]) {
			const secondRegLength = queryPolygon.regions[1].length
			const [ lastElemLat, lastElemLng ] = queryPolygon.regions[0].pop()
			const [ lastElemLat2, lastElemLng2 ] = queryPolygon.regions[1][secondRegLength - 1]
			const fixedFirstPart = [ ...queryPolygon.regions[0], [lastElemLat, lastElemLng2] ]
			const queryPol = [ ...fixedFirstPart, ...queryPolygon.regions[1].reverse(), [lastElemLat + 0.001, lastElemLng2], [lastElemLat + 0.001, lastElemLng] ]
			return queryPol
		} else {
			return queryPolygon.regions[0]
		}
	}

	addClass($('.overlay__loading'), 'overlay__loading-show')

	const query = getQuery(queryPolygon)
	const poly = L.polygon(query, {
		fillOpacity: 0.05,
		weight: 2
	})
	if (!state.isFiltersOn)
		usedBounds.push(poly)
	if (state.shouldShowLoading && !state.isFiltersOn)
		poly.addTo(map)

	const filters = state.isFiltersOn ? state.filters : null
	// console.timeEnd('preparations')
	// console.time('fetch new data')
    const { error, data } = await fetchBoundsData(query, zoom, filters)
	// console.timeEnd('fetch new data')

	if (error === 'Too many requests, please try again later') {
		blockMap()
		showLimitError()
		return
	} else if (error) {
		showError('unrecognizedError', error)
		return
	}

	const { result, userID } = data
    if (!userID)
        userLoggedOut()

    // console.log('number of downloaded points: ', result.length)

	if (!state.isFiltersOn) {
		visitedPoly = visitedPoly !== null
			? PolyBool.union(visitedPoly, queryPolygon)
			: currentScreenPoly
	}

    // checkSize(result)

	removeClass($('.overlay__loading'), 'overlay__loading-show')
	addDataAndDisplay(result)
}

map.on('moveend', debounce(getNewData, 500))
getNewData()