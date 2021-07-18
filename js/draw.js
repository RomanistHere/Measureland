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

const initDrawFeature = () => {
    // add a custom one
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

        if (type === 'marker') {
            layer.bindPopup('A popup!')
        }

        drawnItems.addLayer(layer)
    })

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
}

initDrawFeature()
