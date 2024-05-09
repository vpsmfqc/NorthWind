// eslint-disable-next-line no-undef
app.controller('ordersController', function ($scope, $location, orderService, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.message = '';

    //This array holds  the raw data
    mv.rawArrayOfOrders = [];
    mv.arrayOfOrders = [];
    mv.arrayOfOrdersByPage = [];


    mv.isFound = false;
    mv.orderArrays = [];

    mv.currentPage = 1;
    mv.rowsByPage = 5;

    mv.rowsFromTo = [];

    /**
     * Constructor
     */
    mv.init = () => {
        mv.rowsByPage = 10;
        mv.currentPage = 1;
        mv.message = 'Se están cargando los datos...';
        mv.getAllOrders();
        for (let j = 0; j < 5; j++) {
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
            mv.arrayOfOrders = mv.rawArrayOfOrders;
            mv.paginate();
        }
    });

    // Event when clicking on
    $scope.$on('gotoEvent', function (event, data) {
        mv.goTo(data);
    });

    //Get all the orders 
    mv.getAllOrders = () => {
        mv.isLoading = true;       
        orderService.getAllOrders()
            .then((value) => {
                mv.rawArrayOfOrders = mv.formatDate(value.data);
                mv.arrayOfOrders = mv.rawArrayOfOrders;              
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
        mv.arrayOfOrdersByPage = mv.arrayOfOrders.slice(point[0], point[1]);
    };

    // Get the complete orders array divided 
    mv.paginate = () => {
        mv.rowsFromTo = [];
        const length = mv.arrayOfOrders.length;
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

    //Redirect to the order detail by its id
    mv.goTo = (id) => {
        $location.path(`/orders/${id}`);
    };

    // Search in the complete array for the input info
    mv.search = (value) => {
        let inputText = value.toLowerCase().trim();
        let orderArray = [];
        mv.arrayOfOrdersByPage = [];
        mv.arrayOfOrders.forEach((obj) => {
            try {
                if (obj.id.toString().includes(inputText) ||
                    obj.customerId.toLowerCase().includes(inputText) ||
                    obj.orderDate.toLowerCase().includes(inputText) ||
                    obj.shippedDate.toLowerCase().includes(inputText) ||
                    obj.requiredDate.toLowerCase().includes(inputText)) {
                    orderArray.push(obj);
                }
            } catch (err) {
                console.log(err);
            }
        });
        mv.isFound = (orderArray.length > 0);
        if (mv.isFound) {
            mv.arrayOfOrders = orderArray;
            mv.paginate();
        } else {
            mv.message = 'No se encontró ningún resultado...';
        }
    };

    // Delete the selected order by its id
    mv.deleteOrder = (id) => {
        mv.isLoading = true;
        mv.message = 'Se está eliminando...';
        orderService.deleteOrder(id)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.getAllOrders();
                mv.displaySuccess('Se eliminó el proveedor...', 'Información');
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
    };

    // Get the index of the order by its id 
    mv.getIndex = (id) => {
        const index = this.arrayOfOrders.findIndex((element) => {
            return element.id == id;
        });
        return index + 1;
    };

    mv.sortColumn = (index) => {
        const fieldNames = ['id', 'customerId', 'orderDate', 'shippedDate', 'requiredDate'];
        let name = fieldNames[index];
        if (isNaN(mv.arrayOfOrdersByPage[0][name])) {
            if (mv.orderArrays[index]) {
                mv.arrayOfOrdersByPage.sort((a, b) => a[name].localeCompare(b[name]));
            } else {
                mv.arrayOfOrdersByPage.sort((a, b) => b[name].localeCompare(a[name]));
            }
        } else {
            if (mv.orderArrays[index]) {
                mv.arrayOfOrdersByPage.sort((a, b) => a[name] - b[name]);
            } else {
                mv.arrayOfOrdersByPage.sort((a, b) => b[name] - a[name]);
            }
        }
        mv.orderArrays[index] = !mv.orderArrays[index];
    };

    mv.formatDate = (ordersArray) => {
        let copyArray = [];
        ordersArray.forEach(order => {
            let copy = order;
            copy.orderDate = order.orderDate.replace(' 00:00:00.000', '').replace('T05:00:00.000Z','');
            copy.shippedDate = order.shippedDate.replace(' 00:00:00.000', '').replace('T05:00:00.000Z','');
            copy.requiredDate = order.requiredDate.replace(' 00:00:00.000', '').replace('T05:00:00.000Z','');
            copyArray.push(copy);
        });
        return copyArray;
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