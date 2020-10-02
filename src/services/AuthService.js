export const LS_AUTH_KEY = 'LS_AUTH';
export const LOGIN_DATA = require('../data/auth_data.json');

export class AuthService {
    constructor() {
        this.isLoggedIn = false;
    }

    login(username, password) {
        const details = LOGIN_DATA.auth_data.find(
            x => x.username === username && x.password === password);

        if (details) {
            localStorage.setItem(LS_AUTH_KEY, details.username);
            this.isLoggedIn = true;
            return this.isLoggedIn;
        } else {
            this.isLoggedIn = false;
            return this.isLoggedIn;
        }
    }

    logout(callBack) {
        this.isLoggedIn = false;
        localStorage.removeItem(LS_AUTH_KEY);
        callBack();
    }

    loggedIn() {
        return this.isLoggedIn;
    }
}

export default new AuthService();