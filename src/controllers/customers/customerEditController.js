// eslint-disable-next-line no-undef
app.controller('customerEditController', function (customerService, $location, $routeParams, $uibModal, toastr) {
    let mv = this;
    mv.isLoading = false;    
    mv.currentCustomerId = '0';
    mv.isNew = true;

    //Json parameters
    mv.id = '';
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

    // mv.customerEditCtrl = null;

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

    mv.createAddressObject = () => {
        return customerService.retrieveAddress(mv.street, mv.city, mv.region, mv.postalCode, mv.country, mv.phone);
    };

    mv.createCustomerObject = () => {
        return customerService.retrieveCostumer(mv.id, mv.companyName, mv.contactName, mv.contactTitle, mv.address);
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
        mv.contactTitle = data.contactTitle;
        mv.street = data.address.street;
        mv.city = data.address.city;
        mv.region = data.address.region;
        mv.postalCode = data.address.postalCode;
        mv.country = data.address.country;
        mv.phone = data.address.phone;
    };

    mv.createCustomer = () => {
        mv.address = mv.createAddressObject();
        const data = mv.createCustomerObject();
        mv.isLoading = true;       
        customerService.createCustomer(data)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.displaySuccess(`¡Se ha creado exitosamente el usuario con identificación ${value.data.id} !`, 'Información');
                mv.currentCustomerId = value.data.id;
                mv.isLoading = false;
                mv.isNew = false;
            })
            .catch((err) => {
                mv.isLoading = false;
                if(err.status == 409){
                    mv.displayError(`¡Se produjo un error! El ID ${err.config.data.id} está duplicado.`,'Error');
                }else{
                    mv.displayError('¡Se produjo un error!', 'Error');
                }                
            });
    };

    mv.updateCustomer = () => {
        mv.address = mv.createAddressObject();
        const data = mv.createCustomerObject();
        mv.isLoading = true;       
        customerService.updateCustomer(mv.currentCustomerId, data)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.isLoading = false;
                mv.displaySuccess(`¡Se ha actualizado con exito el usuario con identificación ${value.data.id}!`, 'Información');
            })
            .catch((err) => {
                console.log(err);
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

