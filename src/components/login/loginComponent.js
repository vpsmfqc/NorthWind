// eslint-disable-next-line no-undef
app.component('loginComponent', {
    templateUrl: 'components/login/loginComponent.html',
    // bindings: {

    // },
    controller: 'loginController',
    controllerAs: 'loginCtrl',
});

// eslint-disable-next-line no-undef
app.controller('loginController', function (authService, toastr, $location) {
    let mv = this;
    // action deals with changing the password or create an account  
    // two values signup or password  
    mv.action = 0;
    mv.confirm = '';
    mv.isLoading = false;

    mv.session = null;

    mv.userModel = {
        email: '',
        password: '',
        datePassword: null,
        lastLogin: null,
        oldPassword: ''
    };
    /**
     * Constructor
     */

    mv.init = () => {
        mv.action = 0;
        mv.session = authService.getSession() ? authService.getSession() : null;
        mv.isLoading = false;
        let url = $location.absUrl();
        mv.action = url.endsWith('reset') ? 2 : 0;
    };

    mv.submit = () => {
        if (mv.action == 0) {
            mv.isLoading = true;
            authService.login(mv.userModel)
                .then((value) => {
                    authService.setSession(value.data);
                    toastr.success('Bienvenido', 'Información');
                    mv.isLoading = false;
                    mv.session = authService.getSession();
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
                    mv.session = authService.getSession();
                })
                .catch((err) => {
                    toastr.error(err.data.message, 'Error');
                    mv.isLoading = false;
                    mv.userModel.password = '';
                    mv.userModel.email = '';
                    mv.confirm = '';
                });
        } else if (mv.action == 2) {
            alert('reset password');
        }
    };

    mv.show = (value) => {
        mv.action = value;
    };

    mv.isValidSignup = () => {
        try {
            return mv.isConfirm() && mv.userModel.email.includes('@');
        } catch (err) {
            return false;
        }
    };

    mv.isValidReset = () => {
        try {
            return mv.isConfirm() && mv.userModel.oldPassword.length > 7;
        } catch (err) {
            return false;
        }
    };

    mv.isConfirm = () => {
        try {
            return (mv.userModel.password == mv.confirm && mv.userModel.password.length > 7);
        } catch (err) {
            return false;
        }
    };

    mv.showLogin = () => {
        return !mv.getIsLogged() && (mv.action == 0) && !this.isLoading;
    };

    mv.showSignUp = () => {
        return !mv.getIsLogged() && (mv.action == 1) && !this.isLoading;
    };

    mv.showReset = () => {
        return mv.getIsLogged() && (mv.action == 2) && !this.isLoading;
    };
    mv.showHome = () => {
        return mv.getIsLogged() && !mv.showReset();
    };

    mv.getIsLogged = () => {
        return authService.getIsLogged();
    };

    mv.init();
});
