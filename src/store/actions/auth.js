import { AsyncStorage } from 'react-native';

import {TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN} from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs';
import App from '../../../App';

const AUTH_ERRORS = {
    'EMAIL_NOT_FOUND': 'User is not registred yet',
    'INVALID_PASSWORD': 'Username or password are wrong',
    'USER_DISABLED': 'There some problem with your account - account disabled',
    'EMAIL_EXISTS': 'This username already used',
}
const API_KEY = 'AIzaSyAQyzKRpLzTQhRR2CuKFraK9KDf4KKP980';

export const tryAuth = (authData, authMode) => {
    return dispatch => {
        dispatch(uiStartLoading());
        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + API_KEY;
        if(authMode === 'signup') {
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + API_KEY;
        }

        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                email: authData.email,
                password: authData.password,
                returnSecureToken: true
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .catch(err => {
            console.log(err);
            dispatch(uiStopLoading());
            alert('Auth is failed. Please try again');
        })
        .then(res => res.json())
        .then(res => {
            dispatch(uiStopLoading());
            if(!res.idToken) {
                alert(AUTH_ERRORS[res.error.message]);
            } else {
                dispatch(authStoreToken(res.idToken, res.expiresIn, res.refreshToken));
                startMainTabs();
            }
        })
    }
}

export const authStoreToken = (token, expiresIn, refreshToken) => {
    return dispatch => {
        const now = new Date();
        const expiryDate = now.getTime() + expiresIn * 1000;
        dispatch(setAuthToken(token, expiryDate));
        AsyncStorage.setItem('places:auth:token', token);
        AsyncStorage.setItem('places:auth:expiryDate', expiryDate.toString());
        AsyncStorage.setItem('places:auth:refreshToken', refreshToken);
    }
};

export const setAuthToken = (token, expiryDate) => {
    return {
        type: AUTH_SET_TOKEN,
        token: token,
        expiryDate: expiryDate
    }
}

export const authGetToken = () => {
    return (dispatch, getState) => {
        const promise = new Promise((resolve, reject) => {
            const token = getState().auth.token;
            const expiryDate = getState().auth.expiryDate;
            if (!token || new Date(expiryDate) <= new Date()) {
                let fetchedToken;
                AsyncStorage.getItem('places:auth:token')
                    .catch(err => reject())
                    .then(tokenFromStorage => {
                        if(!tokenFromStorage) {
                            reject();
                            return;
                        }
                        fetchedToken = tokenFromStorage;
                        return AsyncStorage.getItem('places:auth:expiryDate')
                    })
                    .then(expiryDate => {
                        const parsedExpiryDate = new Date(parseInt(expiryDate));
                        const now = new Date();
                        if(parsedExpiryDate > now) {
                            dispatch(setAuthToken(fetchedToken));
                            resolve(fetchedToken);
                        } else {
                            reject();
                        }
                    })
                    .catch(err => reject());
            } else {
                resolve(token);
            }
        });
        return promise
            .catch(err => {
                return AsyncStorage.getItem('places:auth:refreshToken')
                    .then(refreshedToken => {
                        return fetch('https://securetoken.googleapis.com/v1/token?key=' + API_KEY, {
                            method: 'POST',
                            body: 'grant_type=refresh_token&refresh_token=' + refreshedToken,
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            }
                        });
                    })
                    .then(res => res.json())
                    .then(res => {
                        if (res.id_token) {
                            console.log('Refreshed token works!');
                            dispatch(authStoreToken(res.id_token, res.expires_in, res.refresh_token));
                            return res.id_token;
                        } else {
                            dispatch(authClearStorage());
                        }
                    });
            })
            .then(token => {
                if(!token) {
                    throw(new Error());
                } else {
                    return token;
                }
            })
    };
};

export const authAutoSigning = () => {
    return dispatch => {
        dispatch(authGetToken())
            .then(token => {
                startMainTabs();
            })
            .catch(err => console.log('Failed to fetch token!'));
    }
}

export const authClearStorage = () => {
    return dispatch => {
        AsyncStorage.removeItem('places:auth:token');
        AsyncStorage.removeItem('places:auth:expiryDate');
        return AsyncStorage.removeItem('places:auth:refreshToken');
    };
};

export const authLogout = () => {
    return dispatch => {
        dispatch(authClearStorage())
            .then(() => {
                App();
            });
        dispatch(authRemoveToken());
    }
};

export const authRemoveToken = () => {
    return {
        type: AUTH_REMOVE_TOKEN
    }
};
