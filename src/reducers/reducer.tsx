import { configureStore, PayloadAction, Reducer } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

export interface UserState {
    name: string,
    id: string,
    token: string,
    userName: string,
    loggedIn: string
}

const initialState: UserState = {
    name: '',
    id: '',
    token: '',
    userName: '',
    loggedIn: ''
}


const rootReducer: Reducer<{}, PayloadAction<UserState>> = (state = initialState, action: PayloadAction<UserState>) => {
    switch (action.type) {
        case "initializeUser":
            return {
                ...state,
                name: action.payload.name,
                id: action.payload.id,
                token: action.payload.token,
                userName: action.payload.userName,
                loggedIn: '1'
            };
        case "setName":
            return {
                ...state,
                name: action.payload.name
            };
        case "setID":
            return {
                ...state,
                id: action.payload.id
            };
        case "setToken":
            return {
                ...state,
                token: action.payload.token
            };
        case "setAsLoggedIn":
            return {
                ...state,
                loggedIn: '1'
            };
        case "getUserState":
            return {
                ...state,
            };
        case "setAsLoggedOut":
            return {};
        default:
            return state;
    }
};

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({ reducer: persistedReducer });
export const persistor = persistStore(store);
export default store;
