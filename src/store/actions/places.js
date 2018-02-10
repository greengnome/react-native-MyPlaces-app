import {SET_PLACES, REMOVE_PLACE} from './actionTypes';
import {uiStartLoading, uiStopLoading, authGetToken} from './index';

export const addPlace = (placeName, location, image) => {
    return dispatch => {
        let authToken = '';
        dispatch(uiStartLoading());
        dispatch(authGetToken())
            .catch(err => {
                alert('No valid token found!');
            })
            .then(token => {
                authToken = token;
                return fetch('https://us-central1-rnapp-1517166956688.cloudfunctions.net/storeImage', {
                    method: 'POST',
                    body: JSON.stringify({
                        image: image.base64
                    }),
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                })
            })
            .then(res => res.json())
            .then(parsedRes => {
                const placeData = {
                    name: placeName,
                    location: location,
                    image: parsedRes.imageUrl
                };
                return fetch('https://rnapp-1517166956688.firebaseio.com/places.json?auth=' + authToken, {
                    method: 'POST',
                    body: JSON.stringify(placeData)
                })
            })
            .then(res => res.json())
            .then(parsedResp => {
                console.log(parsedResp);
                dispatch(uiStopLoading());
            })
            .catch(err => {
                console.log(err);
                alert('Something went wrong. Please try again!');
                dispatch(uiStopLoading());
            })
    };
};

export const getPlaces = () => {
    return (dispatch, getState) => {
        dispatch(authGetToken())
        .catch(err => {
            alert('No valid token found!');
        })
        .then(token => {
            return fetch('https://rnapp-1517166956688.firebaseio.com/places.json?auth=' + token);
        })
        .then(res => res.json())
        .then(parsedRes => {
            const places = [];
            for(let key in parsedRes) {
                places.push({
                    ...parsedRes[key],
                    image: {
                        uri: parsedRes[key].image
                    },
                    key: key
                })
            }
            dispatch(setPlaces(places))
        })
        .catch(err => {
            alert('Error with requested data. Try again');
            console.log(err);
        });
    };
};

export const setPlaces = places => {
    return {
        type: SET_PLACES,
        places: places
    }
}

export const deletePlace = (key) => {
    return dispatch => {
        dispatch(authGetToken())
            .catch(err => {
                alert('No valid token found!');
            })
            .then(token => {
                return fetch('https://rnapp-1517166956688.firebaseio.com/places/' + key + '.json?auth=' + token, {
                    method: 'DELETE'
                })
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log('delete done');
                dispatch(removePlace(key));
            })
            .catch(err => {
                alert('Error with deleting place. Try again');
                console.log(err);
            })
    }
};

export const removePlace = key => {
    return {
        type: REMOVE_PLACE,
        key: key
    }
}
