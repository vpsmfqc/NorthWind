// eslint-disable-next-line no-undef
app.controller('customersController', function ($scope, $location, customerService, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.message = '';

    //This array holds  the raw data
    mv.arrayOfCustomers = [];
    mv.arrayOfCustomersByPage = [];

    mv.searchInput = '';
    mv.isFound = false;
    mv.isTyping = false;
    mv.orderArrays = [];

    mv.currentPage = 1;
    mv.rowsByPage = 5;
    mv.listOfPages = [];

    mv.rowsFromTo = [];

    /**
     * Constructor
     */
    mv.init = () => {
        mv.rowsByPage = 10;
        mv.currentPage = 1;
        mv.message = 'Se están cargando los datos...';
        mv.getAllCustomers();
        for (let i = 5; i <= 20; i = i + 5) {
            mv.listOfPages.push(i);
        }
        for (let j = 0; j < 4; j++) {
            mv.orderArrays.push(false);
        }
    };

    // Event to change the currentPage 
    $scope.$on('changePageEvent', function (event, data) {
        mv.currentPage = data;
        mv.splitIntoPage();
    });

    //Get all the customers 
    mv.getAllCustomers = () => {
        mv.isLoading = true;
        mv.message = 'Se están cargando los datos.';
        customerService.getAllCustomers()
            .then((value) => {
                mv.arrayOfCustomers = value.data;
                mv.isLoading = false;
                mv.paginate();
            })
            .catch((err) => {
                mv.message = err;
                mv.isLoading = false;
            });
    };

    // Split the complete array of cunstomers into the number of pages 
    mv.splitIntoPage = () => {
        let index = mv.currentPage - 1;
        mv.split(mv.rowsFromTo[index]);
    };

    mv.split = (point) => {
        mv.arrayOfCustomersByPage = mv.arrayOfCustomers.slice(point[0], point[1]);
    };

    // Get the complete customers array divided 
    mv.paginate = () => {
        mv.rowsFromTo = [];
        const length = mv.arrayOfCustomers.length;
        const rest = length % mv.rowsByPage;
        const pages = Number.parseInt((length - rest) / mv.rowsByPage);
        const lastPage = (rest > 0) ? pages + 1 : pages;
        for (let i = 0; i < lastPage; i++) {
            let startIndex = i * mv.rowsByPage;
            let endIndex = (i < (lastPage - 1)) ? startIndex + mv.rowsByPage : length;
            let pair = [startIndex, endIndex];
            mv.rowsFromTo.push(pair);
        }
        mv.currentPage = 1;
        mv.splitIntoPage();
    };

    // Get the las page
    mv.getLastPage = () => {
        return mv.rowsFromTo.length;
    };

    //Redirect to the customer detail by its id
    mv.goTo = (id) => {
        $location.path(`/customers/${id}`);
    };

    //Redirect to create a new customer
    mv.goToNew = () => {
        mv.goTo(0);
    };

    // Search in the complete array for the input info
    mv.search = () => {
        const inputText = mv.searchInput.trim().toLowerCase();
        mv.isTyping = mv.searchInput.trim() != '';
        if (mv.isTyping) {
            let customerArray = [];
            mv.arrayOfCustomersByPage = [];
            mv.arrayOfCustomers.forEach((obj) => {
                try {
                    if (obj.id.toLowerCase().includes(inputText) ||
                        obj.companyName.toLowerCase().includes(inputText) ||
                        obj.contactName.toLowerCase().includes(inputText) ||
                        obj.contactTitle.toLowerCase().includes(inputText) ||
                        obj.address.phone.toLowerCase().includes(inputText) ||
                        obj.address.country.toLowerCase().includes(inputText)) {
                        customerArray.push(obj);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            mv.isFound = (customerArray.length > 0);
            if (mv.isFound) {
                mv.arrayOfCustomersByPage = customerArray;
            } else {
                mv.message = 'No se encontró ningún resultado...';
            }
        } else {
            mv.paginate();
        }
    };

    // Delete the selected customer by its id
    mv.deleteCustomer = (id) => {
        mv.isLoading = true;
        mv.message = 'Se está eliminando...';
        customerService.deleteCustomer(id)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.getAllCustomers();
                mv.displaySuccess('Se eliminó el proveedor...', 'Información');
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
    };

    // Get the index of the customer by its id 
    mv.getIndex = (id) => {
        const index = this.arrayOfCustomers.findIndex((element) => {
            return element.id == id;
        });
        return index + 1;
    };

    mv.sortColumn = (index) => {
        const fieldNames = ['id', 'companyName', 'contactName', 'contactTitle'];
        let name = fieldNames[index];
        if (mv.orderArrays[index]) {
            mv.arrayOfCustomersByPage.sort((a, b) => a[name].localeCompare(b[name]));
        } else {
            mv.arrayOfCustomersByPage.sort((a, b) => b[name].localeCompare(a[name]));
        }
        mv.orderArrays[index] = !mv.orderArrays[index];
    };

    mv.displayError = (message, title) => {
        toastr.error(message, title);
    };

    mv.displaySuccess = (message, title) => {
        toastr.success(message, title);
    };

    mv.displayInfo = (message, title) => {
        toastr.info(message, title);
    };
    // Initialized constructor
    mv.init();

});