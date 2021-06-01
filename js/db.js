const path = 'http://localhost:3000'

const sendFeedback = () =>
    state.flow.length > 6 && navigator.sendBeacon(`${path}/flow/add`, new URLSearchParams({ flow: state.flow }))


const saveToDB = async (coords, rating, averageRating, comment, isPersonalExperience) => {
    const url = `${path}/geo/add`
    console.log('coords:', coords)
    console.log('rating:', rating)
    console.log('averageRating:', averageRating)
    console.log('comment:', comment)
    console.log('isPersonalExperience:', isPersonalExperience)

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                properties: {
                    rating,
                    averageRating,
                    comment,
                    isPersonalExperience,
                },
                location: {
                    type: 'Point',
                    coordinates: [ ...coords ]
                }
            })
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return null
    }
}

const checkIfExist = async (latlng) => {
    const url = `${path}/geo/read_same/${new URLSearchParams({ latlng })}`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return null
    }
}

const getSinglePointData = async (latlng) => {
    const url = `${path}/geo/read_loc/${new URLSearchParams({ latlng })}`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        // TODO: change to return ({ error: e })
        return null
    }
}

const fetchAllData = async () => {
    const url = `${path}/geo/read_all`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const fetchBoundsData = async (box, zoom) => {
    const bounds = JSON.stringify(box)
    const url = `${path}/geo/read_bounds/${new URLSearchParams({ bounds, zoom })}`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

// comments

const fetchComments = async (geoID) => {
    const url = `${path}/geo/read_comments/${new URLSearchParams({ geoID })}`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const reactOnComment = async (goal, key) => {
    const url = `${path}/geo/react_comment`

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key,
                goal
            })
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

// users

const register = async (email, password, lang) => {
    const url = `${path}/user/register`

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                email,
                lang
            })
        })

        return await resp.json()
    } catch (e) {
        return ({ error: e })
    }
}

const login = async (email, password) => {
    const url = `${path}/user/login`

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })

        return await resp.json()
    } catch (e) {
        return ({ error: e })
    }
}

const onboard = async (userName, ageGrp, moneyGrp, userID) => {
    const url = `${path}/user/onboard`

    console.log(userName, ageGrp, moneyGrp, userID)

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName,
                ageGrp,
                moneyGrp,
                userID
            })
        })

        return await resp.json()
    } catch (e) {
        return ({ error: e })
    }
}

const verifyUser = async (token) => {
    const url = `${path}/user/verify/${new URLSearchParams({ token })}`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const checkUser = async () => {
    const url = `${path}/user/check_user`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const fetchRatedPlace = async () => {
    const url = `${path}/user/read_places`

    try {
        const resp = await fetch(url, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        return ({ error: e })
    }
}

const logout = async () => {
    const url = `${path}/user/logout`

    try {
        const resp = await fetch(url, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const reverify = async (email) => {
    const url = `${path}/user/reverify`

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const reset = async (password, token) => {
    const url = `${path}/user/change_pass`

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                token
            })
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const sendResetPass = async (email) => {
    const url = `${path}/user/reset_pass`

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const saveLang = async (lang) => {
    const url = `${path}/user/language`

    try {
        const resp = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                lang
            })
        })

        return await resp.json()
    } catch (e) {
        return ({ error: e })
    }
}
