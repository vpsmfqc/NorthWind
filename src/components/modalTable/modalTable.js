// eslint-disable-next-line no-undef
app.controller('modalTableController', function ($uibModalInstance, customerId) {

    let mv = this;
    /**
     * Constructor
     */
    mv.init = () => {
        console.log('Hoa desde modal table' + customerId);
    };

    mv.getAllOrders = () => {
       
    };


    mv.init();

    mv.ok = function () {
        $uibModalInstance.close(true);
    };

    mv.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});