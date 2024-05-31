// eslint-disable-next-line no-undef
app.controller('userEditController', function (authService, userService, $routeParams, $location, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.isNew = false;
    mv.userModel = null;
    mv.confirm = '';

    mv.init = () => {
        mv.userModel = new Object();
        mv.userModel.id = $routeParams.idUser ? Number.parseInt($routeParams.idUser) : 0;
        mv.isNew = (mv.userModel.id == 0);
        if (!mv.isNew) {
            mv.getUserbyId();
        }
    };

    mv.getUserbyId = () => {
        mv.isLoading = true;
        userService.getUserById(mv.userModel.id)
            .then((value) => {
                mv.userModel = value.data;
                mv.getDates();
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.create = () => {
        mv.isLoading = true;
        authService.signup(mv.userModel)
            .then((value) => {
                mv.userModel = value.data;
                mv.isLoading = false;
                mv.isNew = false;
                mv.getDates();
                toastr.success('¡Se creó con exito!', 'Información');
            })
            .catch((err) => {
                toastr.error(err.data.message, 'Error');
                mv.isLoading = false;
            });
    };

    mv.update = () => {
        mv.isLoading = true;
        userService.updateUserById(mv.userModel.id, mv.userModel)
            .then((value) => {
                mv.userModel = value.data;
                mv.isLoading = false;
                mv.isNew = false;
                mv.getDates();
                toastr.success('¡Se modificó la contraseña con exito!', 'Información');
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                toastr.error('¡No se pudo realizar la operación!', 'Error');
                mv.isLoading = false;
            });
    };

    mv.isValid = () => {
        try {
            return mv.isConfirm() && mv.userModel.email.includes('@');
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

    mv.getDates = () => {
        if (mv.userModel.lastLogin)
            // eslint-disable-next-line no-undef
            mv.userModel.lastLogin = moment(mv.userModel.lastLogin).format('DD-MM-YYYY HH:mm:ss');
        
        // eslint-disable-next-line no-undef
        mv.userModel.datePassword = moment(mv.userModel.datePassword).format('DD-MM-YYYY HH:mm:ss');
    };

    mv.goBack = () => {
        $location.path('/users');
    };

    mv.submit = () => {
        if (!mv.isNew) {
            mv.update();
        } else {
            mv.create();
        }
        mv.confirm = '';
    };

    mv.init();
});

