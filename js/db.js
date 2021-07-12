const path = 'https://measureland.org/api'
// const path = 'http://localhost:3000/api'

const sendFeedback = () =>
    state.flow.length > 6 && navigator.sendBeacon(`${path}/flow/add`, new URLSearchParams({ flow: state.flow }))

const fetchFunction = async ({ url, method, credentials, headers, body }) => {
    if (!url)
        return ({ error: 'Not valid URL' })
    // default values
    method = method ? method : 'GET'
    credentials = credentials ? credentials : 'include'
    headers = headers ? headers : {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }

    // console.log(url, method, credentials, headers, body)
    try {
        const resp = method === 'POST'
            ? await fetch(url, {
                method,
                credentials,
                headers,
                body
            })
            : await fetch(url, {
                method,
                credentials,
                headers
            })

        return await resp.json()
    } catch (e) {
        console.log(e)
        return ({ error: e })
    }
}

const saveToDB = async (coords, rating, averageRating, comment, isPersonalExperience) => {
    const url = `${path}/geo/add`

    return await fetchFunction({
        url,
        method: 'POST',
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
}

// const checkIfExist = async (latlng) => {
//     const url = `${path}/geo/read_same/${new URLSearchParams({ latlng })}`
//
//     try {
//         const resp = await fetch(url, {
//             method: 'GET',
//             credentials: 'include',
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'application/json'
//             }
//         })
//
//         return await resp.json()
//     } catch (e) {
//         return null
//     }
// }

const getSinglePointData = async (latlng) => {
    const url = `${path}/geo/read_loc/${new URLSearchParams({ latlng })}`

    return await fetchFunction({ url })
}

// not used. Fetch all markers
// const fetchAllData = async () => {
//     const url = `${path}/geo/read_all`
//
//     return await fetchFunction({ url })
// }

const fetchBoundsData = async (box, zoom) => {
    const bounds = JSON.stringify(box)
    const url = `${path}/geo/read_bounds/${new URLSearchParams({ bounds, zoom })}`

    return await fetchFunction({ url })
}

// comments

const fetchComments = async (geoID) => {
    const url = `${path}/geo/read_comments/${new URLSearchParams({ geoID })}`

    return await fetchFunction({ url })
}

const reactOnComment = async (goal, key) => {
    const url = `${path}/geo/react_comment`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            key,
            goal
        })
    })
}

// users

const register = async (email, password, lang) => {
    const url = `${path}/user/register`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            password,
            email,
            lang
        })
    })
}

const login = async (email, password) => {
    const url = `${path}/user/login`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            email,
            password
        })
    })
}

const onboard = async (userName, ageGrp, moneyGrp, userID) => {
    const url = `${path}/user/onboard`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            userName,
            ageGrp,
            moneyGrp,
            userID
        })
    })
}

const verifyUser = async (token) => {
    const url = `${path}/user/verify/${new URLSearchParams({ token })}`

    return await fetchFunction({ url })
}

const checkUser = async () => {
    const url = `${path}/user/check_user`

    return await fetchFunction({ url })
}

const fetchRatedPlace = async () => {
    const url = `${path}/user/read_places`

    return await fetchFunction({ url })
}

const logout = async () => {
    const url = `${path}/user/logout`

    return await fetchFunction({ url, method: 'DELETE' })
}

const reverify = async (email) => {
    const url = `${path}/user/reverify`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            email
        })
    })
}

const reset = async (password, token) => {
    const url = `${path}/user/change_pass`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            password,
            token
        })
    })
}

const sendResetPass = async (email) => {
    const url = `${path}/user/reset_pass`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            email
        })
    })
}

const saveLang = async (lang) => {
    const url = `${path}/user/language`

    return await fetchFunction({
        url,
        method: 'POST',
        body: JSON.stringify({
            lang
        })
    })
}
