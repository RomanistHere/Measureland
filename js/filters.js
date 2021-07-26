const initSlider = (slider) => {
    const key = slider.getAttribute('data-key')
    const setFilter = (values, handle, unencoded) => {
        const [leftVal, rightVal] = unencoded
        console.log(key, leftVal, rightVal)
    }

    noUiSlider.create(slider, {
        start: [1, 5],
        connect: true,
        tooltips: true,
        step: 1,
        range: {
            'min': 1,
            'max': 5
        }
    })

    slider.noUiSlider.on('end', setFilter)
}

const initSliders = () => {
    const sliders = document.querySelectorAll('.filter__slider')
    sliders.forEach(initSlider)

    const connect = document.querySelectorAll('.noUi-connect')
    connect.forEach(elem => { addClass(elem, 'connect-colored') })
}

initSliders()
