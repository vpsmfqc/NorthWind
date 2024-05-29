/* eslint-disable no-undef */
app.component('productsTable', {
    templateUrl: 'components/productsTable/productsTable.html',
    bindings: {
        supplierId: '='
    },
    controller: 'productsTableController',
    controllerAs: 'productsTableCtrl'
});

app.controller('productsTableController', function ($scope, productService, categoryService, supplierService, paginatorService, $location) {
    let mv = this;
    mv.isLoading = false;
    mv.productList = [];
    mv.categoryList = [];
    mv.items = [];
    mv.supplier = null;
    mv.paginator = paginatorService.getPaginator();
    /**
     * Contrucctor
     */
    this.init = () => {
        mv.getAllProducts();
    };

    // Event to change the currentPage 
    $scope.$on('changePageEvent', function (event, data) {
        mv.paginator.setPage(data);
    });

    mv.getAllProducts = () => {
        mv.isLoading = true;
        productService.getAllProducts()
            .then((value) => {
                mv.productList = value.data;
                mv.getAllCategories();
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.getAllCategories = () => {
        mv.isLoading = false;
        categoryService.getAllCategories()
            .then((value) => {
                mv.categoryList = value.data;
                mv.items = mv.filter();
                mv.paginator.objList = mv.items;
                mv.paginator.paginate(10);
                mv.getSupplier();
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.filter = () => {
        let copy = [];
        mv.productList.forEach((p) => {
            if (p.supplierId == mv.supplierId) {
                let item = {
                    id: p.id,
                    name: p.name,
                    categoryName: function () {
                        let category = mv.categoryList.find(c => c.id == p.categoryId);
                        return category ? category.name : '';
                    },
                    unitPrice: p.unitPrice,
                };
                copy.push(item);
            }
        });
        return copy;
    };

    mv.getSupplier = () => {
        mv.isLoading = true;
        supplierService.getSupplierById(mv.supplierId)
            .then((value) => {
                mv.supplier = value.data;
                mv.isLoading = false;
            })
            .catch((err) => {
                mv.isLoading = false;
                console.log(err);
            });
    };

    mv.goTo = (id) => {
        $location.path(`/products/${id}`);
    };

    mv.create = (id) =>{
        $location.path(`/products/0/${id}`);
    };

    mv.init();
});