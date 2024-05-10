// eslint-disable-next-line no-undef
app.controller('modalTableController', function ($uibModalInstance, customerId, orderService, $location) {

    let mv = this;
    mv.listOfOrders = [];
    /**
     * Constructor
     */
    mv.init = () => {
        this.getAllOrders();
        console.log('Hoa desde modal table' + customerId);
    };

    mv.getAllOrders = () => {
        orderService.getAllOrders()
            .then((value) => {
                mv.listOfOrders = value.data;
                mv.listOfOrders = mv.filter();
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
    };

    mv.init();

    mv.accept = function () {
        $uibModalInstance.close(true);
    };

    mv.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});