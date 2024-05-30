// eslint-disable-next-line no-undef
app.service('userService', function ($http) {
    this.path = 'https://localhost:44353/api/users';

    /**
     * constructor
     */
    this.init = () => { };

    this.getAllUsers = () => {
        return $http.get(this.path);
    };

    this.getUserById = (id) => {
        return $http.get(`${this.path}/${id}`);
    };

    this.deleteUserById = (id) => {
        return $http.delete(`${this.path}/${id}`);
    };

    this.updateUserById = (id, user) => {
        return $http.put(`${this.path}/${id}`, user);
    };

    this.init();
}); 