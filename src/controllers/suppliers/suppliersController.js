// eslint-disable-next-line no-undef
app.controller('suppliersController', function ($scope, $location, supplierService, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.message = '';

    //This array holds the raw data 
    mv.rawArrayOfSuppliers = [];
    mv.arrayOfSuppliers = [];
    mv.arrayOfSuppliersByPage = [];

    mv.searchInput = '';
    mv.isFound = false;
    mv.orderArrays = [];
    mv.isTyping = false;
    
    mv.currentPage = 1;
    mv.rowsByPage = 10;


    mv.rowsFromTo = [];

    /**
     * Constructor
     */
    mv.init = () => {
        mv.rowsByPage = 10;
        mv.currentPage = 1;
        mv.message = 'Se están cargando los datos...';
        mv.getAllSuppliers();
        for (let j = 0; j < 4; j++) {
            mv.orderArrays.push(false);
        }
    };

    // Event repaginate
    $scope.$on('paginateEvent', function (event, data) {
        mv.rowsByPage = data;
        mv.paginate();
    });

    // Event to change the currentPage 
    $scope.$on('changePageEvent', function (event, data) {
        mv.currentPage = data;
        mv.splitIntoPage();
    });

    // Event to searching the text 
    $scope.$on('searchingEvent', function (event, data) {
        if (data.isTyping) {
            mv.search(data.searchInput);
        } else {
            mv.arrayOfSuppliers = mv.rawArrayOfSuppliers;
            mv.paginate();
        }
    });

    // Event when clicking on
    $scope.$on('gotoEvent', function (event, data) {
        mv.goTo(data);
    });

    //Get all the Suppliers 
    mv.getAllSuppliers = () => {
        mv.isLoading = true;
        mv.message = 'Se están cargando los datos.';
        supplierService.getAllSuppliers()
            .then((value) => {
                mv.rawArrayOfSuppliers = value.data;
                mv.arrayOfSuppliers = mv.rawArrayOfSuppliers;
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

    // Get the array determinated by the two values of point
    mv.split = (point) => {
        mv.arrayOfSuppliersByPage = mv.arrayOfSuppliers.slice(point[0], point[1]);
    };

    // Get the complete customers array divided 
    mv.paginate = () => {
        mv.rowsFromTo = [];
        const length = mv.arrayOfSuppliers.length;
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

    //Redirect to the Product detail by its id
    mv.goTo = (id) => {
        $location.path(`/suppliers/${id}`);
    };

    // Search in the complete array for the input info
    mv.search = (value) => {
        let inputText = value.toLowerCase().trim();
        let supplierArray = [];        
        mv.arrayOfSuppliersByPage = [];
        mv.arrayOfSuppliers.forEach((obj) => {
            try {
                if (obj.id.toString().toLowerCase() == inputText || obj.companyName.toLowerCase().includes(inputText) || obj.contactName.toLowerCase().includes(inputText) || obj.contactTitle.toLowerCase().includes(inputText)) {
                    supplierArray.push(obj);
                }
            } catch (err) {
                console.log(err);
            }
        });
        mv.isFound = (supplierArray.length > 0);
        if (mv.isFound) {
            mv.arrayOfSuppliers= supplierArray;
            mv.paginate();
        } else {
            mv.message = 'No se encontró ningún resultado...';
        }
    };

    // Delete the selected Product by its id
    mv.deleteSupplier = (id) => {
        mv.isLoading = true;
        mv.message = 'Se está eliminando...';
        supplierService.deleteSupplier(id)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.getAllSuppliers();
                mv.displaySuccess('Se eliminó el proveedor...', 'Información');
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
    };

    // Get the index of the Product by its id 
    mv.getIndex = (id) => {
        const index = this.arrayOfSuppliers.findIndex((obj) => {
            return obj.id == id;
        });
        return index + 1;
    };

    mv.sortColumn = (index) => {
        const fieldNames = ['id', 'companyName', 'contactName', 'contactTitle'];
        let name = fieldNames[index];
        if (isNaN(mv.arrayOfSuppliersByPage[0][name])) {
            if (mv.orderArrays[index]) {
                mv.arrayOfSuppliersByPage.sort((a, b) => a[name].localeCompare(b[name]));
            } else {
                mv.arrayOfSuppliersByPage.sort((a, b) => b[name].localeCompare(a[name]));
            }
        } else {
            if (mv.orderArrays[index]) {
                mv.arrayOfSuppliersByPage.sort((a, b) => a[name] - b[name]);
            } else {
                mv.arrayOfSuppliersByPage.sort((a, b) => b[name] - a[name]);
            }
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