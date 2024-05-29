// eslint-disable-next-line no-undef
app.controller('userEditController', function (userService, $routeParams, $location, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.isNew = false;
    mv.userModel = null;
    mv.confirm = '';

    mv.init = () => {
        mv.userModel = new Object();
        mv.userModel.id = $routeParams.idUser ? Number.parseInt($routeParams.idUser) : 0;
        mv.isNew = (mv.userModel.id == 0);
        mv.getUserbyId();
    };

    mv.getUserbyId = () => {
        mv.isLoading = true;
        userService.getAllUserById(mv.userModel.id)
            .then((value) => {
                mv.userModel = value.data;
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.update = () => {
        mv.isLoading = true;
        userService.updateUserById(mv.userModel.id, mv.userModel)
            .then((value) => {
                mv.userModel = value.data;
                mv.isLoading = false;
                toastr.success('¡Se modificó la contraseña con exito!','Información');
            })
            .catch((err) => {
                console.log(err);
                toastr.success('¡No se pudo realizar la operación!','Error');
                mv.isLoading = false;
            });
    };

    mv.isConfirm = () => {
        try {
            return (mv.userModel.password == mv.confirm && mv.userModel.password.length > 7);
        } catch (err) {
            return false;
        }
    };

    mv.format = (value) => {
        let num = Number.parseInt(value);
        if(isNaN(num)){
            return '00';
        }else{
            return num < 10 ? `0${num}` : `${num}`;
        }        
    };

    mv.formatDate = (value) => {
        let d = new Date(value);
        let date = `${mv.format(d.getDate())}-${mv.format(d.getMonth() + 1)}-${mv.format(d.getFullYear())}`;
        let time = `${mv.format(d.getHours())}:${mv.format(d.getMinutes())}:${mv.format(d.getSeconds())}`;
        return `${date} ${time}`;
    };

    mv.getLastLogin = () => {
        return mv.formatDate(mv.userModel.lastLogin);
    };

    mv.getDatePassword = () => {
        return mv.formatDate(mv.userModel.datePassword);
    };

    mv.goBack = () => {
        $location.path('/users');
    };

    mv.submit = () => {
        if(!mv.isNew){
            mv.update();
        }
        mv.confirm = '';
    };

    mv.init();
});

