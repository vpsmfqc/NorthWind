// eslint-disable-next-line no-undef
app.controller('modalPasswordController', function ($uibModalInstance, authService, toastr) {

    let mv = this;   
    mv.isLoading = false;

    mv.confirm = '';
    mv.password = '';
    mv.oldPassword = '';

    /**
     * Constructor
     */
    mv.init = () => {

    };

    mv.submit = () => {
        mv.isLoading = true;
        let data = authService.getSession();
        data.oldPassword = mv.oldPassword;
        data.password = mv.password;
        authService.reset(data)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {            
                toastr.success('¡Se ha cambiado la contraseña exitosamente!', 'Información');
                mv.isLoading = false;
                mv.accept();
            })
            .catch((err) => {
                toastr.error(err.data.message, 'Error');
                mv.isLoading = false;
            });
        mv.confirm = '';
        mv.oldPassword = '';
        mv.password = '';
    };


    mv.isValidReset = () => {
        try {
            return mv.isConfirm() && mv.oldPassword.length > 7;
        } catch (err) {
            return false;
        }
    };

    mv.isConfirm = () => {
        try {
            return (mv.password == mv.confirm && mv.password.length > 7);
        } catch (err) {
            return false;
        }
    };

    mv.accept = function () {
        $uibModalInstance.dismiss('accept');
    };

    mv.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    mv.init();
});