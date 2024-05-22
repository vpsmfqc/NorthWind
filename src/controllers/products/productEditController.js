// eslint-disable-next-line no-undef
app.controller('productEditController', function ($scope, productService, supplierService, $location, $routeParams, categoryService, toastr) {
    let mv = this;
    // Properties for the messages an edit a new one or uptade
    mv.isLoading = false;
    mv.message = '';
    mv.currentProductId = 0;
    mv.isNew = true;

    //List of all suppliers
    mv.listOfAllSuppliers = [];
    mv.selectedSupplierId = 0;

    //List of all suppliers
    mv.listOfAllCategories = [];
    mv.selectedCategoryId = 0;

    //Object or model
    mv.productModel = {
        id: 0,
        supplierId: 0,
        categoryId: 0,
        quantityPerUnit: '',
        unitPrice: '',
        unitsInStock: 0,
        unitsOnOrder: 0,
        reorderLevel: 0,
        discontinued: false,
        name: ''
    };
    /**
     * Constructor
     */
    mv.init = () => {
        mv.currentProductId = Number.parseInt($routeParams.idProduct) || 0;
        mv.isNew = (mv.currentProductId == 0);
        mv.productModel.categoryId = 0;
        mv.productModel.supplierId = 0;
        if (!mv.isNew) {
            mv.getProductById();
        }
        mv.getAllSuppliers();
        mv.getAllCategories();
    };

    mv.getProductById = () => {
        mv.isLoading = true;
        mv.message = 'Se estan cargando los datos...';
        productService.getProductById(mv.currentProductId)
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
        mv.message = 'Se estan cargando los datos...';
        supplierService.getAllSuppliers()
            .then((value) => {
                mv.listOfAllSuppliers = value.data;
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    mv.getAllCategories = () => {
        mv.isLoading = true;
        mv.message = 'Se estan cargando los datos...';
        categoryService.getAllCategories()
            .then((value) => {
                mv.listOfAllCategories = value.data;
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

    mv.createProduct = () => {
        mv.isLoading = true;
        mv.message = 'Se está creando un nuevo producto';
        productService.createProduct(mv.productModel)
            .then((value) => {
                mv.displaySuccess(`¡Se ha creado satisfactoriamente el producto con ID ${value.data.id}!`, 'Información');
                mv.productModel.id = value.data.id;
                mv.isLoading = false;
                mv.isNew = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
    };

    mv.updateProduct = () => {
        productService.updateProduct(mv.currentProductId, mv.productModel)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.isLoading = false;
                mv.displaySuccess(`¡Se ha actualizado satisfactoriamente el producto con ID ${value.data.id}!`, 'Información');
                mv.isNew = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
                mv.displayError('¡Se produjo un error!', 'Error');
            });
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

    mv.isValid = () => { return $scope.formEdit.$valid; };

    mv.isValidSupplier = () => { return (mv.productModel.supplierId > 0); };

    mv.isValidCategory = () => { return (mv.productModel.categoryId > 0); };

    mv.submit = () => {
        if (!mv.isValidSupplier()) {
            mv.displayInfo('Debe seleccionar un proveedor.', 'Validación');
        } else if (!mv.isValidCategory()) {
            mv.displayInfo('Debe seleccionar una categoría.', 'Validación');
        } else {
            if (mv.isNew) {
                mv.createProduct();
            } else {
                mv.updateProduct();
            }
        }
    };

    mv.init();

});