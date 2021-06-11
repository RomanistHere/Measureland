const showMoreBtn = document.querySelectorAll('.blog__show_more')

showMoreBtn.forEach(elem => {
    elem.addEventListener('click', e => {
        e.preventDefault()
        const parent = e.currentTarget.parentElement
        const list = parent.parentElement
        list.classList.remove('blog__list-reduced')
        parent.remove()
        list.querySelectorAll('.blog__item-reduced').forEach(elem => {
            console.log(elem.querySelector('.blog__link'))
            elem.querySelector('.blog__link').tabIndex = 0
        })
    })
})
