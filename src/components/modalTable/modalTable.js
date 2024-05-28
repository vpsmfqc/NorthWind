// eslint-disable-next-line no-undef
app.controller('modalTableController', function ($uibModalInstance, customerId, orderService, $location) {

    let mv = this;
    mv.listOfOrders = [];
    mv.isLoading = false;
    /**
     * Constructor
     */
    mv.init = () => {       
        mv.getAllOrders();      
    };

    mv.getAllOrders = () => {
        mv.isLoading = true;
        orderService.getAllOrders()
            .then((value) => {                
                mv.listOfOrders = value.data;              
                mv.listOfOrders = mv.filter();
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
            });
    };
    mv.filter = () => {
        let copy = [];
        mv.listOfOrders.forEach((order) => {
            if (order.customerId == customerId) {
                order.orderDate = new Date(order.orderDate);
                order.requiredDate = new Date(order.requiredDate);
                order.shippedDate = new Date(order.shippedDate);
                copy.push(order);
            }
        });
        return copy;
    };

    mv.goTo = (id) => {
        $location.path(`/orders/${id}`);
        $uibModalInstance.dismiss('accept');
    };
    
    mv.create = ()=>{
        $location.path(`/orders/0/${customerId}`);
        $uibModalInstance.close(true);
    };

    mv.accept = function () {    
        $uibModalInstance.dismiss('accept');
    };

    mv.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    mv.init();    
});