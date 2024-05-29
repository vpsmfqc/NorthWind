// eslint-disable-next-line no-undef
app.controller('productEditController', function ($scope, productService, supplierService, $location, $routeParams, categoryService, toastr) {
    let mv = this;
    // Properties for the messages an edit a new one or uptade
    mv.isLoading = false;   
    mv.isNew = true;
    //List of all suppliers
    mv.listOfAllSuppliers = [];
    //List of all suppliers
    mv.listOfAllCategories = []; 
    //Object or model
    mv.productModel = null;
    /**
     * Constructor
     */
    mv.init = () => {
        mv.productModel = new Object();
        mv.productModel.id = Number.parseInt($routeParams.idProduct) || 0;
        mv.isNew = (mv.productModel.id == 0);       
        if (!mv.isNew) {
            mv.getProductById();
        }
        mv.getAllSuppliers();
        mv.getAllCategories();
    };

    mv.getProductById = () => {
        mv.isLoading = true;
        productService.getProductById(mv.productModel.id)
            .then((value) => {
                mv.productModel = value.data;
                mv.isNew = false;
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.getAllSuppliers = () => {
        mv.isLoading = true;
        supplierService.getAllSuppliers()
            .then((value) => {
                mv.listOfAllSuppliers = value.data;               
                mv.listOfAllSuppliers.sort((a, b) => {
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
                if ($routeParams.idSupplier) {
                    console.log($routeParams.idSupplier);
                    mv.productModel.supplierId = $routeParams.idSupplier;
                }
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.getAllCategories = () => {
        mv.isLoading = true;
        categoryService.getAllCategories()
            .then((value) => {
                mv.listOfAllCategories = value.data;
                mv.listOfAllCategories.sort((a, b) => {
                    var nameA = a.name.toUpperCase();
                    var nameB = b.name.toUpperCase();
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
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.goBack = () => {
        $location.path('/products');
    };

    mv.create = () => {
        mv.isLoading = true;
        productService.createProduct(mv.productModel)
            .then((value) => {
                toastr.success(`¡Se ha creado satisfactoriamente el producto con ID ${value.data.id}!`, 'Información');
                mv.productModel.id = value.data.id;
                mv.isLoading = false;
                mv.isNew = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
                toastr.error('¡Se produjo un error!', 'Error');
            });
    };

    mv.update = () => {
        productService.updateProduct(mv.productModel.id, mv.productModel)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.isLoading = false;
                toastr.success(`¡Se ha actualizado satisfactoriamente el producto con ID ${value.data.id}!`, 'Información');
                mv.isNew = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
                toastr.error('¡Se produjo un error!', 'Error');
            });
    };

    mv.isValid = () => { return $scope.formEdit.$valid; };

    mv.isValidSupplier = () => { return (mv.productModel.supplierId > 0); };

    mv.isValidCategory = () => { return (mv.productModel.categoryId > 0); };

    mv.submit = () => {
        if (!mv.isValidSupplier()) {
            toastr.info('Debe seleccionar un proveedor.', 'Validación');
        } else if (!mv.isValidCategory()) {
            toastr.info('Debe seleccionar una categoría.', 'Validación');
        } else {
            if (mv.isNew) {
                mv.create();
            } else {
                mv.update();
            }
        }
    };

    mv.init();
});