// eslint-disable-next-line no-undef
app.service('authService', function ($window, $location, $http) {
    this.sessionKey = 'token';
    this.path = 'https://localhost:44353/api/users';

    /**
  * constructor
  */
    this.init = () => {
        // this.sessionKey = 'token';
    };

    this.login = (data) => {
        return $http.post(`${this.path}/login`, data);
    };

    this.signup = (data) => {
        return $http.post(`${this.path}/signup`, data);
    };

    this.setSession = (data) => {
        // eslint-disable-next-line no-undef
        amplify.store.sessionStorage('isLogged', true);
        // eslint-disable-next-line no-undef
        amplify.store.sessionStorage('session', data);
        //$window.localStorage.setItem(this.sessionKey, 'something');
    };

    this.getSession = () => {
        // eslint-disable-next-line no-undef
        return amplify.store.sessionStorage('session');
    };

    this.getIsLogged = () => {
        // console.log(amplify.store('isLogged'));
        // eslint-disable-next-line quotes, no-undef
        return amplify.store.sessionStorage('isLogged') ? amplify.store.sessionStorage('isLogged') : false;
        // const value = $window.localStorage.getItem(this.sessionKey);
        // return value ? true : false;
    };

    this.clearSession = () => {
        // $window.localStorage.clear();
        // eslint-disable-next-line no-undef
        amplify.store.sessionStorage('isLogged', false);
        // eslint-disable-next-line no-undef
        amplify.store.sessionStorage('session','');
    };

    this.authRoute = () => {
        if (!this.getIsLogged()) {
            $location.path('/');
        }
    };

    this.init();
}); 