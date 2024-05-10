// eslint-disable-next-line no-undef
app.controller('orderEditController', function (customerService, employeeService, shipperService, orderService, $location, $routeParams, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.message = '';
    mv.currentOrderId = 0;
    mv.isNew = true;
    mv.updatedDetails = [];
    mv.customersList = [];
    mv.shippersList = [];
    mv.employeesList = [];

    //Json parameters
    mv.orderModel = null;

    /**
     * Constructor
     */
    mv.init = () => {
        mv.customersList = [];
        mv.currentOrderId = Number.parseInt($routeParams.idOrder) || 0;
        mv.isNew = (mv.currentOrderId == 0);
        if (!mv.isNew) {
            mv.getOrderById();
            mv.getAllShippers();
            mv.getAllEmployees();
        } else {
            mv.getAllCustomers();
            mv.getAllShippers();
            mv.getAllEmployees();
        }
    };

    mv.getAllShippers = () => {
        mv.isLoading = true;
        mv.shippersList = [];
        shipperService.getAllShippers()
            .then((value) => {
                mv.shippersList = value.data;
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
            });
    };

    mv.getAllEmployees = () => {
        mv.isLoading = true;
        mv.employeesList = [];
        employeeService.getAllEmployees()
            .then((value) => {
                mv.employeesList = value.data;
                // console.log(value.data);
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
            });
    };

    mv.getAllCustomers = () => {
        mv.isLoading = true;
        mv.customersList = [];
        customerService.getAllCustomers()
            .then((value) => {
                mv.customersList = value.data;
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
            });
    };

    // Go to the table of orders
    mv.goBack = () => {
        $location.path('/orders');
    };

    // retrieve the product by Id
    mv.getOrderById = () => {
        mv.isLoading = true;
        orderService.getOrderById(mv.currentOrderId)
            .then((value) => {
                mv.fillForm(value.data);
                mv.getAllCustomers();
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    // Fill the form 
    mv.fillForm = (data) => {
        let model = data;
        model.orderDate = mv.formatDate(data.orderDate);
        model.requiredDate = mv.formatDate(data.requiredDate);
        model.shippedDate = mv.formatDate(data.shippedDate);
        mv.orderModel = model;
    };

    mv.formatDate = (date) => {
        let fdate = new Date(date);
        return fdate;
    };

    /**
     * Methods for updating the Stock
     */
    mv.updateStock = () => {
        for (let i = 0; i < mv.updatedDetails.length; i++) {
            // eslint-disable-next-line no-unused-vars
            mv.updatedDetails[i].updateStock().then((value) => {
                // console.log(value);               
            }).catch((error) => {
                console.log(error);
            });
        }
        mv.displaySuccess('¡Se ha guardado la order!', 'Información');
        mv.isLoading = false;
    };
    /**
     * end
    */
    mv.createOrder = () => {
        mv.isLoading = true;
        mv.orderModel.details = mv.getDetails();
        orderService.createOrder(mv.orderModel)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.displaySuccess(`¡Se ha creado el pedido con ID ${value.data.id}!`, 'Información');
                mv.currentOrderId = value.data.id;
                mv.orderModel.id = mv.currentOrderId;
                mv.updateStock();
                //mv.isLoading = false;
                mv.isNew = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });            
    };

    // Format the updated details array 
    mv.getDetails = () => {
        let array = [];
        mv.updatedDetails.forEach((obj) => {
            let detail = {
                productId: obj.productId,
                unitPrice: obj.unitPrice,
                quantity: obj.quantity,
                discount: obj.discount
            };
            array.push(detail);
        });
        return array;
    };

    mv.updateOrder = () => {
        mv.isLoading = true;
        mv.orderModel.details = mv.getDetails();
        orderService.updateOrder(mv.currentOrderId, mv.orderModel)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.updateStock();
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
    };

    // Error message
    mv.displayError = (message, title) => {
        toastr.error(message, title);
    };

    // Success message 
    mv.displaySuccess = (message, title) => {
        toastr.success(message, title);
    };

    // mv.displayInfo = (message, title) => {
    //     toastr.info(message, title);
    // };

    mv.verify = () => {
        let isOk = true;
        if (mv.updatedDetails.length > 0) {
            mv.updatedDetails.forEach((obj) => {
                if(obj.isUnChecked()){
                    isOk = false;
                }               
            });
        } else {
            isOk = false;
        }
        return isOk;
    };

    mv.submit = () => {
        if (mv.verify()) {
            if (mv.isNew) {
                mv.createOrder();
            } else {
                mv.updateOrder();
            }
        } else {
            this.displayError('¡Debe guardar y seleccionar al menos una unidad de los productos!', 'Información');
        }
    };

    mv.init();
});
