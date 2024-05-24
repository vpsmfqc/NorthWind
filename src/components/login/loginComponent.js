// eslint-disable-next-line no-undef
app.component('loginComponent', {
    templateUrl: 'components/login/loginComponent.html',
    // bindings: {

    // },
    controller: 'loginController',
    controllerAs: 'loginCtrl',
});

// eslint-disable-next-line no-undef
app.controller('loginController', function (authService, toastr) {
    let mv = this;
    // action deals with changing the password or create an account  
    // two values signup or password  
    mv.action = 0;
    mv.confirm = '';
    mv.isLoading = false;

    mv.userModel = {
        email: '',
        password: '',
        datePassword: null,
        lastLogin: null
    };
    /**
     * Constructor
     */

    mv.init = () => {
        mv.isLoading = false;
        mv.action = 0;
    };

    mv.submit = () => {
        if (mv.action == 0) {
            mv.isLoading = true;
            authService.login(mv.userModel)
                .then((value) => {
                    authService.setSession(value.data);
                    toastr.success('Bienvenido', 'Información');
                    mv.isLoading = false;
                    mv.userModel.lastLogin = authService.getSession().lastLogin;
                })
                .catch((err) => {
                    toastr.error(err.data.message, 'Error');
                    mv.isLoading = false;
                    mv.userModel.password = '';
                    mv.userModel.email = '';
                });
            // eslint-disable-next-line no-empty
        } else if (mv.action == 1) {
            mv.isLoading = true;
            authService.signup(mv.userModel)
                .then((value) => {
                    authService.setSession(value.data);
                    toastr.success('Su cuenta ha sido creada', 'Información');
                    mv.isLoading = false;
                    mv.userModel.lastLogin = authService.getSession().lastLogin;
                })
                .catch((err) => {
                    toastr.error(err.data.message, 'Error');
                    mv.isLoading = false;
                    mv.userModel.password = '';
                    mv.userModel.email = '';
                    mv.confirm = '';
                });
        }        
    };

    mv.show = (value) => {
        mv.action = value;
    };

    mv.isConfirm = () => {
        return (mv.userModel.password == mv.confirm && mv.userModel.password.length > 7);
    };

    mv.showLogin = () => {
        return !mv.getIsLogged() && (mv.action == 0) && !this.isLoading;
    };

    mv.showSignUp = () => {
        return !mv.getIsLogged() && (mv.action == 1) && !this.isLoading;
    };

    mv.showChange = () => {
        return !mv.getIsLogged() && (mv.action == 2) && !this.isLoading;
    };

    mv.getIsLogged = () => {
        return authService.getIsLogged();
    };


    mv.init();
});
