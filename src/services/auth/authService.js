// eslint-disable-next-line no-undef
app.service('authService', function ($window, $location) {
    this.sessionKey = 'token';
    /**
  * constructor
  */
    this.init = () => {
        this.sessionKey = 'token';
    };

    // this.signIn = (email, password) => {
    //     return new Promise((resolve, reject) => {
    //         if (email.trim().toLowerCase() == 'admin@mail.com' && password == '123456789') {
    //             // amplify.store.sessionStorege("isLoged", true);
    //             resolve(true);
    //         } else {
    //             reject('Contraseña o correo incorectos');
    //         }
    //     });
    // };

    this.signIn = (email, password) => {
        return (email.trim().toLowerCase() == 'admin@mail.com' && password == '123456789');
    };


    this.setSession = () => {
        // eslint-disable-next-line no-undef
        amplify.store.sessionStorage('isLogged', true);
        //$window.localStorage.setItem(this.sessionKey, 'something');
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
    };

    this.authRoute = () => {
        if (!this.getIsLogged()) {
            $location.path('/');
        }
    };


    this.init();
}); 