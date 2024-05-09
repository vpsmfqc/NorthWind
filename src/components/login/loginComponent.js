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

    mv.email = '';
    mv.password = '';   
    /**
     * Constructor
     */

    mv.init = () => {
        console.log('from login component');
    };

    mv.submit = () => {
        let response = authService.signIn(mv.email, mv.password);
        if (response) {           
            authService.setSession();
            mv.displaySuccess('Bien venido');
        } else {
            mv.displayError('Credenciales incorrectas');
        }
        // authService.signIn(mv.email, mv.password)
        //     .then((value) => {
        //         if (value) {
        //             authService.setSession();                   
        //         }
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });
    };

    mv.getIsLogged = () => {
        return authService.getIsLogged();
    };


    // Error message
    mv.displayError = (message, title) => {
        toastr.error(message, title);
    };

    // Success message 
    mv.displaySuccess = (message, title) => {
        toastr.success(message, title);
    };


    mv.init();
});
