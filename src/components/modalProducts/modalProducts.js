// eslint-disable-next-line no-undef
app.controller('modalProductsController', function ($uibModalInstance, supplierId, productService, $location) {
    let mv = this;
    mv.isLoading = false;
    mv.listOfProducts = [];
    /**
     * Constructor
     */
    mv.init = () => {
        mv.getAllProducts();
    };

    mv.getAllProducts = () => {
        mv.isLoading = true;
        productService.getAllProducts()
            .then((value) => {
                mv.listOfProducts = value.data;
                mv.listOfProducts = mv.filter();
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    mv.filter = () => {
        let copy = [];
        mv.listOfProducts.forEach((product) => {
            if (product.supplierId == supplierId) {
                copy.push(product);
            }
        });
        return copy;
    };

    mv.goTo = (id) => {
        $location.path(`/products/${id}`);
    };

    mv.create = ()=>{
        $location.path(`/products/0/${supplierId}`);
        $uibModalInstance.dismiss('done');
    };

    mv.accept = function () {
        $uibModalInstance.close(true);       
        $uibModalInstance.dismiss('done');
    };

    mv.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    mv.init();
});

