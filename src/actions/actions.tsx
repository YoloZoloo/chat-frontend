import type { UserState } from "../reducers/reducer"
export const initUser = (data: UserState) => {
    return {
        type: 'initializeUser',
        payload: {
            name: data.name,
            id: data.id,
            token: data.token,
            userName: data.userName,
            loggedIn: data.loggedIn
        }
    }
}

export const login = () => {
    return {
        type: 'setAsLoggedIn'
    }
}
export const logout = () => {
    return {
        type: 'setAsLoggedOut'
    }
}
export const setToken = (token: string) => {
    return {
        type: 'setToken',
        payload: {
            token: token
        }
    }
}
export const setID = (id: string) => {
    return {
        type: 'setID',
        payload: {
            id: id
        }
    }
}
export const setName = (name: string) => {
    return {
        type: 'setName',
        payload: {
            name: name
        }
    }
}