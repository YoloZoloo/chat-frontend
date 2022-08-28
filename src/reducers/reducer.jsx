const reducer = (state = 0, action) => {
    switch (action.type) {
        case "setName":
            return {
                ...state,
                // bgColor: action.payload
            };
        case "setID":
            return {
                ...state,
                // activeColor: action.payload
            };
        case "setToken":
            return {
                ...state,
                // activeColor: action.payload
            };
        case "setAsLoggedIn":
            return {
                ...state,
                loggedIn: '1'
            };
        case "setAsLoggedOut":
            return {
                ...state,
                // activeColor: action.payload
            };
        default:
            return state;
    }
};

export default reducer;