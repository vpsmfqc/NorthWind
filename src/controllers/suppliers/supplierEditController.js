// eslint-disable-next-line no-undef
app.controller('supplierEditController', function (supplierService, $location, $routeParams, toastr) {
    let mv = this;
    mv.isLoading = false;    
    mv.currentSupplierId = 0;
    mv.isNew = true;

    //Json parameters
    mv.supplierModel = null;

    /**
     * Constructor
     */
    mv.init = () => {
        mv.currentSupplierId = Number.parseInt($routeParams.idSupplier) || 0;        
        mv.isNew = (mv.currentSupplierId == 0);
        if (!mv.isNew) {
            mv.getSupplierById();
        }
    };

    mv.goBack = () => {
        $location.path('/suppliers');
    };

    mv.getSupplierById = () => {
        mv.isLoading = true;        
        supplierService.getSupplierById(mv.currentSupplierId)
            .then((value) => {
                mv.fillForm(value.data);
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.fillForm = (data) => {
        mv.supplierModel = data;
    };

    mv.createSupplier = () => {
        mv.isLoading = true;        
        supplierService.createSupplier(mv.supplierModel)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.displaySuccess(`¡Se ha creado satisfactoriamente el usuario con identificación ${value.data.id}!`, 'Información');
                mv.currentSupplierId = value.data.id;
                mv.supplierModel.id = value.data.id;
                mv.isLoading = false;
                mv.isNew = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
    };

    mv.updateSupplier = () => {
        mv.isLoading = true;        
        supplierService.updateSupplier(mv.currentSupplierId, mv.supplierModel)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.isLoading = false;
                mv.displaySuccess(`¡Se ha actualizado satisfactoriamente el usuario con identificación ${value.data.id}!`, 'Información');
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
    };

    mv.displayError = (message, title) => {
        toastr.error(message, title);
    };

    mv.displaySuccess = (message, title) => {
        toastr.success(message, title);
    };

    // mv.displayInfo = (message, title) => {
    //     toastr.info(message, title);
    // };

    mv.submit = () => {
        if (mv.isNew) {
            mv.createSupplier();
        } else {
            mv.updateSupplier();
        }
    };

    mv.init();
});

