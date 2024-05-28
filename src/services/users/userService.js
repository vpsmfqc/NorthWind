// eslint-disable-next-line no-undef
app.service('userService', function ($window, $location, $http) {
    this.path = 'https://localhost:44353/api/users';

    /**
     * constructor
     */
    this.init = () => { };

    this.getAllUsers = () => {
        return $http.get(this.path);
    };

    this.deleteUserById = (id) => {
        return $http.delete(`${this.path}/${id}`);
    };

    this.init();
}); 