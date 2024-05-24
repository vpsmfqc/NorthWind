// eslint-disable-next-line no-undef
app.controller('customerEditController', function (customerService, $location, $routeParams, $uibModal, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.currentCustomerId = '0';
    mv.isNew = true;

    //Json parameters
    mv.id = '';
    mv.firstName = '';
    mv.lastName = '';

    mv.companyName = '';
    mv.contactName = '';
    mv.contactTitle = '';
    mv.address = null;
    mv.street = '';
    mv.city = '';
    mv.region = '';
    mv.postalCode = '';
    mv.country = '';
    mv.phone = '';
    mv.isVisible = false;

    /**
     * Constructor
     */
    mv.init = () => {
        mv.isVisible = false;
        mv.currentCustomerId = $routeParams.idCustomer || '0';
        mv.currentCustomerId = mv.currentCustomerId.trimEnd();
        mv.isNew = (mv.currentCustomerId == '0');
        if (!mv.isNew) {
            mv.getCustomerById();
        }
    };

    mv.goBack = () => {
        $location.path('/customers');
    };

    mv.toCustomer = () => {
        return {
            id: mv.id,
            companyName: mv.companyName,
            contactName: mv.contactName,
            contactTitle: mv.contactTitle,
            address: {
                city: mv.city,
                country: mv.country,
                phone: mv.phone,
                postalCode: mv.postalCode,
                region: mv.region,
                street: mv.street,
            }
        };
    };    

    mv.getCustomerById = () => {
        mv.isLoading = true;
        customerService.getCustomerById(mv.currentCustomerId)
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
        mv.id = data.id;
        mv.companyName = data.companyName;
        mv.contactName = data.contactName;
        let arr = data.contactName.split(' ');
        mv.firstName = arr[0];
        mv.lastName = arr[1];
        mv.contactTitle = data.contactTitle;
        mv.street = data.address.street;
        mv.city = data.address.city;
        mv.region = data.address.region;
        mv.postalCode = data.address.postalCode;
        mv.country = data.address.country;
        mv.phone = data.address.phone;
    };

    mv.createCustomer = () => {       
        const data = mv.toCustomer();
        mv.isLoading = true;
        customerService.createCustomer(data)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                toastr.success(`¡Se ha creado exitosamente el usuario con identificación ${value.data.id} !`, 'Información');
                mv.currentCustomerId = value.data.id;
                mv.isLoading = false;
                mv.isNew = false;
            })
            .catch((err) => {
                mv.isLoading = false;
                if (err.status == 409) {
                    toastr.error(`¡Se produjo un error! ¡El ID ${err.config.data.id} está duplicado!`, 'Error');
                } else {
                    toastr.error('¡Se produjo un error!', 'Error');
                }
            });
    };

    mv.updateCustomer = () => {        
        const data = mv.toCustomer();
        mv.isLoading = true;
        customerService.updateCustomer(mv.currentCustomerId, data)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.isLoading = false;
                toastr.success(`¡Se ha actualizado con éxito el usuario con identificación ${value.data.id} !`, 'Información');
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
                toastr.error('¡Se produjo un error!', 'Error');
            });
    };

    mv.submit = () => {
        if (mv.isNew) {
            mv.createCustomer();
        } else {
            mv.updateCustomer();
        }
    };

    mv.open = () => {
        let modalInstance = $uibModal.open({
            templateUrl: './components/modalTable/modalTable.html',
            controller: 'modalTableController',
            controllerAs: 'modalTableCtrl',
            size: 'md',
            resolve: {
                customerId: function () {
                    return mv.currentCustomerId;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    mv.init();
});

