// eslint-disable-next-line no-undef
app.controller('orderEditController', function ($scope, customerService, employeeService, shipperService, orderService, $location, $routeParams, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.currentOrderId = 0;
    mv.isNew = true;
    mv.updatedDetails = [];
    mv.customersList = [];
    mv.shippersList = [];
    mv.employeesList = [];
    mv.shippedDays = 3;

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
                mv.shippersList.sort((a, b) => {
                    var nameA = a.companyName.toUpperCase();
                    var nameB = b.companyName.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
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
                mv.employeesList.sort((a, b) => {
                    var nameA = `${a.firstName.toUpperCase()} ${a.lastName.toUpperCase()}`;
                    var nameB = `${b.firstName.toUpperCase()} ${b.lastName.toUpperCase()}`;
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
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
                mv.customersList.sort((a, b) => {
                    var nameA = a.contactName.toUpperCase();
                    var nameB = b.contactName.toUpperCase();
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    return 0;
                });
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
            });
    };

    mv.setCompanyName = () => {
        let id = mv.orderModel.customerId;
        if (id != null) {
            let customer = mv.customersList.find(c => c.id == id);
            mv.orderModel.shipName = customer.companyName;
        }
    };

    mv.getDates = () => {
        mv.orderModel.shippedDate = mv.getDate(mv.shippedDays);
        mv.orderModel.requiredDate = mv.getDate(mv.shippedDays + 2);
    };

    mv.getDate = (days) => {
        let count = 0;
        let newDate = new Date(mv.orderModel.orderDate);
        while (count < days) {
            if (newDate.getDay() !== 0 && newDate.getDay() !== 6) {
                count++;
            }
            newDate.setDate(newDate.getDate() + 1);
        }
        return newDate;
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
            }).catch((err) => {
                console.log(err);
            });
        }
        if (mv.isNew) {
            mv.displaySuccess(`¡Se ha creado la order con ID ${mv.currentOrderId}!`, 'Información');
        } else {
            mv.displaySuccess(`¡Se ha actualizado la order con ID ${mv.currentOrderId}!`, 'Información');
        }
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
                mv.currentOrderId = value.data.id;
                mv.orderModel.id = mv.currentOrderId;
                mv.updateStock();
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
        mv.orderModel.id = mv.currentOrderId;
        orderService.updateOrder(mv.currentOrderId, mv.orderModel)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                this.fillForm(value.data);
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

    mv.displayInfo = (message, title) => {
        toastr.info(message, title);
    };

    mv.isValidEmployee = () => {
        try {
            return (mv.orderModel.employeeId != null && mv.orderModel.employeeId > 0);
        } catch (error) {
            return false;
        }
    };

    mv.isValidShipper = () => {
        try {
            return (mv.orderModel.shipVia != null && mv.orderModel.shipVia > 0);
        } catch (error) {
            return false;
        }
    };

    mv.isValidCustomer = () => {
        try {
            return (mv.orderModel.customerId != null);
        } catch (error) {
            return false;
        }
    };

    mv.verify = () => {
        let isOk = true;

        if (!mv.isValidCustomer()) {
            isOk = false;
        } else if (!mv.isValidShipper()) {
            isOk = false;
        } else if (!mv.isValidEmployee()) {
            isOk = false;
        }

        if (mv.updatedDetails.length > 0) {
            mv.updatedDetails.forEach((obj) => {
                if (obj.isUnChecked()) {
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
            if (!mv.isValidCustomer()) {
                mv.displayInfo('Debe seleccionar un cliente.', 'Información');
            } else if (!mv.isValidShipper()) {
                mv.displayInfo('Debe seleccionar un repartidor.', 'Información');
            } else if (!mv.isValidEmployee()) {
                mv.displayInfo('Debe seleccionar un empleado.', 'Información');
            } else {
                mv.displayInfo('¡Debe agregar un producto y seleccionar al menos una unidad!', 'Información');
            }
        }
    };

    mv.init();
});
