// eslint-disable-next-line no-undef
app.component('tableComponent', {
    templateUrl: 'components/table/tableComponent.html',
    bindings: {
        isVisible: '=',
        customerId: '='
    },
    controller: 'tableController',
    controllerAs: 'tableCtrl',
});

// eslint-disable-next-line no-undef
app.controller('tableController', function (orderService, $location) {

    let mv = this;
    mv.isLoading = false;
    mv.orderList = [];

    mv.rowsFromTo = [];
    /**
     * Contructor
     */
    mv.init = () => {
        // customerId    
        mv.isVisible = false;
        mv.getAllOrders();
    };

    mv.getAllOrders = () => {
        mv.isLoading = true;
        orderService.getAllOrders()
            .then((value) => {
                mv.orderList = value.data;               
                mv.filteredList();
                mv.isLoading = false;
            })
            .catch((err) => {
                mv.message = err;
                mv.isLoading = false;
            });
    };

    mv.filteredList = () => {
        let newList = [];
        mv.orderList.forEach((order) => {
            if (order.customerId == mv.customerId) {                 
                // eslint-disable-next-line no-undef
                order.orderDate = moment(order.orderDate).format('dd-MM-yyyy');                                               
                // eslint-disable-next-line no-undef
                order.requiredDate = moment(order.requiredDate).format('dd-MM-yyyy');                
                // eslint-disable-next-line no-undef
                order.shippedDate = moment(order.shippedDate).format('dd-MM-yyyy');
                newList.push(order);
            }
        });
        mv.orderList = newList;
    };

    mv.goTo = (id) => {
        $location.path(`/orders/${id}`);
    };

    mv.close = () => {
        mv.isVisible = false;
    };


    mv.init();
});