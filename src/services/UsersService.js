export const LS_USERS_KEY = 'LS_USERS';
const LS_USER_ID_KEY = 'LS_USER_ID'
const DEFAULT_USERS = require('../data/users.json');

export class UsersService {
    constructor() {
        this.init();
    }

    getUsers() {
        try {
            const usersStr = localStorage.getItem(LS_USERS_KEY);
            return JSON.parse(usersStr);
        } catch {
            return [];
        }
    }

    generateUserId(users) {
        console.log("users in generateUserId() ", users);
        let id = Math.max(...users.map(user => user.id), 0) + 1;
        localStorage.setItem(LS_USER_ID_KEY, (id).toString());

        return id;
    }

    createUser(data) {
        let users = this.getUsers();
        data['id'] = this.generateUserId(users);
        users.push(data);
        localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));

        return users;
    }

    updateUser(data) {
        let users = this.getUsers();
        let recordIndex = users.findIndex(user => user.id == data.id);
        users[recordIndex] = { ...data }
        localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));
        
        return users;
    }

    deleteUser(id) {
        let users = this.getUsers();
        users = users.filter(user => user.id != id);
        localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));

        return users;
    }

    deleteSelectedUsers(ids) {
        let users = this.getUsers();
        users = users.filter(user => !ids.includes(user.id));
        localStorage.setItem(LS_USERS_KEY, JSON.stringify(users));

        return users;
    }

    init() {
        const usersStr = localStorage.getItem(LS_USERS_KEY);
        if (usersStr) return;

        localStorage.setItem(LS_USERS_KEY, JSON.stringify(DEFAULT_USERS));
    }
}

export default new UsersService();