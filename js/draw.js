const localizeDrawBar = () => {
    if (state.lang === 'en')
        return

    L.drawLocal.draw.toolbar.buttons.polygon = 'Нарисовать многоугольник (полигон)'
    L.drawLocal.draw.toolbar.buttons.rectangle = 'Нарисовать прямоугольник'
    L.drawLocal.draw.toolbar.buttons.circle = 'Нарисовать круг'

    L.drawLocal.draw.toolbar.actions.text = 'Отменить'
    L.drawLocal.draw.toolbar.actions.title = 'Отменить рисование'

    L.drawLocal.draw.toolbar.finish.text = 'Закончить'
    L.drawLocal.draw.toolbar.finish.title = 'Закончить рисование'

    L.drawLocal.draw.toolbar.undo.text = 'Отменить последнее действие'
    L.drawLocal.draw.toolbar.undo.title = 'Отменить последнюю нарисованную точку'

    L.drawLocal.draw.handlers.circle.radius = 'Радиус'
    L.drawLocal.draw.handlers.circle.tooltip.start = 'Нажми и потяни, чтобы нарисовать круг'

    L.drawLocal.draw.handlers.polygon.tooltip.start = 'Нажми, чтобы начать рисовать'
    L.drawLocal.draw.handlers.polygon.tooltip.end = 'Нажми на первую точку, чтобы закончить фигуру'
    L.drawLocal.draw.handlers.polygon.tooltip.cont = 'Нажми что бы поставить новую точку'

    L.drawLocal.draw.handlers.rectangle.tooltip.start = 'Нажми и потяни, чтобы нарисовать прямоугольник'
    L.drawLocal.draw.handlers.simpleshape.tooltip.end = 'Отпусти мышь, чтобы закончить рисование'

    L.drawLocal.edit.handlers.edit.tooltip.text = 'Перемещай точки (квадратики), чтобы изменять фигуры'
    L.drawLocal.edit.handlers.edit.tooltip.subtext = 'Нажми "отменить", чтобы отменить изменения'

    L.drawLocal.edit.handlers.remove.tooltip.text = 'Нажми на фигуру, чтобы удалить её'

    L.drawLocal.edit.toolbar.actions.cancel.text = 'Отменить'
    L.drawLocal.edit.toolbar.actions.cancel.title = 'Отменить все изменения и закончить'

    L.drawLocal.edit.toolbar.actions.clearAll.text = 'Удалить всё'
    L.drawLocal.edit.toolbar.actions.clearAll.title = 'Удалить все фигуры'

    L.drawLocal.edit.toolbar.actions.save.text = 'Сохранить'
    L.drawLocal.edit.toolbar.actions.save.title = 'Сохранить изменения'

    L.drawLocal.edit.toolbar.buttons.edit = 'Изменить фигуры'
    L.drawLocal.edit.toolbar.buttons.editDisabled = 'Не можем найти фигуры для изменения'
    L.drawLocal.edit.toolbar.buttons.remove = 'Удалить фигуры'
    L.drawLocal.edit.toolbar.buttons.removeDisabled = 'Не можем найти фигуры для удаления'
}

const initStateOfShapes = {
    "type" : "FeatureCollection",
    "features" : null
}

let shapesGeoJSON = { ...initStateOfShapes }

const concatGeoJSON = (g1, g2) => {
    return {
        "type" : "FeatureCollection",
        "features": [...g1.features, g2]
    }
}

const addToCommongGeoJSON = shape => {
    if (shape.geometry.type !== 'Point') {
        try {
            shape.geometry.coordinates[0] = shape.geometry.coordinates[0].map(coordsArr => {
                const [lat, lng] = coordsArr
                return [roundToFifthDecimal(lat), roundToFifthDecimal(lng)]
            })
            delete shape['properties']
        } catch (e) {
            console.log(e)
        }
    }

    if (shapesGeoJSON['features'] === null)
        shapesGeoJSON['features'] = [shape]
    else
        shapesGeoJSON = concatGeoJSON(shapesGeoJSON, shape)

    const string = JSON.stringify(shapesGeoJSON)
    const toURL = encodeURIComponent(string)

    if (toURL.length >= 2000) {
        showError('LengthOfShapes')
        return
    }

    const url = new URL(window.location.href)
    url.searchParams.set('shades', toURL)

    window.history.pushState(null, null, url)
}

const initDrawFeature = () => {
    const drawnItems = new L.FeatureGroup()
    map.addLayer(drawnItems)
    const drawOptions = {
        position: 'bottomright',
        draw: {
            marker: false,
            circlemarker: false,
            polyline: false,
        },
        edit: {
            featureGroup: drawnItems
        }
    }
    const drawControl = new L.Control.Draw(drawOptions)

    localizeDrawBar()
    map.addControl(drawControl)

    map.on(L.Draw.Event.CREATED, e => {
        const type = e.layerType
        const layer = e.layer
        drawnItems.addLayer(layer)
        const shape = layer.toGeoJSON()

        if (type === 'circle') {
            const radius = layer.getRadius()
            shape.properties.radius = roundToTen(radius)
        }

        addToCommongGeoJSON(shape)
    })

    const takeAllShapesToURL = () => {
        // reset previous changes
        const url = new URL(window.location.href)
        url.searchParams.delete('shades')
        window.history.pushState(null, null, url)
        shapesGeoJSON = { ...initStateOfShapes }
        // get all drawn items
        drawnItems.eachLayer((layer) => {
            const shape = layer.toGeoJSON()

            if (layer instanceof L.Circle) {
                const radius = layer.getRadius()
                shape.properties.radius = roundToTen(radius)
            }

            addToCommongGeoJSON(shape)
        })
    }

    map.on(L.Draw.Event.EDITED, takeAllShapesToURL)
    map.on(L.Draw.Event.DELETED, takeAllShapesToURL)

    // editing ON
    map.on(L.Draw.Event.DRAWSTART, () => {
        map.off('click', onMapClick)
    })

    map.on(L.Draw.Event.EDITSTART, () => {
        map.off('click', onMapClick)
    })

    map.on(L.Draw.Event.DELETESTART, () => {
        map.off('click', onMapClick)
    })

    // editing OFF
    map.on(L.Draw.Event.DRAWSTOP, () => {
        setTimeout(() => { map.on('click', onMapClick) }, 100)
    })

    map.on(L.Draw.Event.EDITSTOP, () => {
        setTimeout(() => { map.on('click', onMapClick) }, 100)
    })

    map.on(L.Draw.Event.DELETESTOP, () => {
        setTimeout(() => { map.on('click', onMapClick) }, 100)
    })

    // draw from url if any
    const drawFromURL = () => {
        const url = new URL(window.location.href)
        const shades = url.searchParams.get('shades')

        if (!shades)
            return

        const string = decodeURIComponent(shades)
        shapesGeoJSON = JSON.parse(string)

        L.geoJson(shapesGeoJSON, {
            pointToLayer: (feature, latlng) => {
                if (feature.properties.radius) {
                    return new L.Circle(latlng, feature.properties.radius)
                }
                return
            }
        }).eachLayer((layer) => {
            layer.addTo(drawnItems)
        })
    }

    drawFromURL()
}

initDrawFeature()
