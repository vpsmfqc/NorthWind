// eslint-disable-next-line no-undef
app.controller('productsController', function ($scope, $location, productService, supplierService, categoryService, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.message = '';

    //This array hold the raw data 
    mv.arrayOfProducts = [];
    mv.arrayOfProductsByPage = [];

    mv.listOfAllProducts = [];
    mv.listOfAllSuppliers = [];
    mv.listOfAllCategories = [];

    mv.searchInput = '';
    mv.isFound = false;
    mv.isTyping = false;
    mv.orderArrays = [];

    mv.currentPage = 1;
    mv.rowsByPage = 5;
    mv.listOfPages = [];

    mv.rowsFromTo = [];

    /**
     * Constructor
     */
    mv.init = () => {
        mv.rowsByPage = 10;
        mv.currentPage = 1;
        for (let i = 5; i <= 20; i = i + 5) {
            mv.listOfPages.push(i);
        }
        for (let j = 0; j < 2; j++) {
            mv.orderArrays.push(false);
        }
        mv.getAllProducts();
    };

    // Event to change the currentPage 
    $scope.$on('changePageEvent', function (event, data) {
        mv.currentPage = data;
        mv.splitIntoPage();
    });

    //Get all the Products 
    mv.getAllProducts = () => {
        mv.isLoading = true;
        mv.message = 'Se están cargando los datos.';
        productService.getAllProducts()
            .then((value) => {
                mv.arrayOfProducts = value.data;
                mv.getAllSuppliers();
            })
            .catch((err) => {
                mv.message = err;
                mv.isLoading = false;
            });
    };

    // Get all the suppliers 
    mv.getAllSuppliers = () => {
        mv.message = 'Se estan cargando los datos..';
        supplierService.getAllSuppliers()
            .then((value) => {
                mv.listOfAllSuppliers = value.data;
                mv.getAllCategories();
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    // Get all the categories 
    mv.getAllCategories = () => {
        mv.message = 'Se estan cargando los datos...';
        categoryService.getAllCategories()
            .then((value) => {
                mv.listOfAllCategories = value.data;
                mv.arrayOfProducts = mv.createTable();
                mv.paginate();
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    // Format the obj of the raw list 
    mv.retrieveProduct = (obj) => {
        try {
            return {
                id: obj.id,
                supplierId: obj.supplierId,
                categoryId: obj.categoryId,
                quantityPerUnit: obj.quantityPerUnit,
                unitPrice: obj.unitPrice,
                companyName: mv.getSupplierById(obj.supplierId).companyName,
                categoryName: mv.getCategoryById(obj.categoryId).name,
                name: obj.name
            };
        } catch (err) {
            return undefined;
        }
    };

    //Create the table to show the datas
    //This table takes data from Categorie, Suppliers and Products
    mv.createTable = () => {
        mv.arrayOfProducts.forEach((obj) => {
            let product = mv.retrieveProduct(obj);
            if (product) {
                mv.listOfAllProducts.push(product);
            }
        });
        return mv.listOfAllProducts;
    };

    mv.getSupplierById = (id) => {
        return mv.listOfAllSuppliers.find((obj) => { return obj.id == id; });
    };
    mv.getCategoryById = (id) => {
        return mv.listOfAllCategories.find((obj) => { return obj.id == id; });
    };

    // Split the complete array of cunstomers into the number of pages 
    mv.splitIntoPage = () => {
        let index = mv.currentPage - 1;
        mv.split(mv.rowsFromTo[index]);
    };

    mv.split = (point) => {
        mv.arrayOfProductsByPage = mv.arrayOfProducts.slice(point[0], point[1]);
    };

    // Get the complete customers array divided 
    mv.paginate = () => {
        mv.rowsFromTo = [];
        const length = mv.arrayOfProducts.length;
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
        $location.path(`/products/${id}`);
    };

    //Redirect to create a new Product
    mv.goToNew = () => {
        mv.goTo(0);
    };


    // Search in the complete array for the input info
    mv.search = () => {
        mv.isTyping = mv.searchInput.trim() != '';
        const inputText = mv.searchInput.trim().toLowerCase();
        if (mv.isTyping) {
            let productsArray = [];
            mv.arrayOfProductsByPage = [];
            mv.arrayOfProducts.forEach((obj) => {
                try {
                    if (obj.name.toLowerCase().includes(inputText) ||
                        obj.id.toString().toLowerCase() == inputText ||
                        mv.getSupplierById(obj.supplierId).companyName.toString().toLowerCase().includes(inputText) ||
                        mv.getCategoryById(obj.categoryId).name.toString().toLowerCase().includes(inputText) ||
                        obj.unitPrice.toString().includes(inputText) ||
                        obj.quantityPerUnit.toString().toLowerCase().includes(inputText)) {
                        productsArray.push(obj);
                    }
                } catch (error) {
                    console.log(error);
                }
            });
            mv.isFound = (productsArray.length > 0);
            if (mv.isFound) {
                mv.arrayOfProductsByPage = productsArray;
            } else {
                mv.message = 'No se encontró ningún resultado...';
            }
        } else {
            mv.paginate();
        }
    };

    // Delete the selected Product by its id
    mv.deleteProduct = (id) => {
        mv.isLoading = true;
        mv.message = 'Se está eliminando...';
        productService.deleteProduct(id)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.getAllProducts();
                mv.displaySuccess(`Se eliminó el producto con ID ${id}.`, 'Información');
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
        const index = this.arrayOfProducts.findIndex((obj) => {
            return obj.id == id;
        });
        return index + 1;
    };

    mv.sortColumn = (index) => {
        const fieldNames = ['id', 'name'];
        let name = fieldNames[index];
        if (isNaN(mv.arrayOfProductsByPage[0][name])) {
            if (mv.orderArrays[index]) {
                mv.arrayOfProductsByPage.sort((a, b) => a[name].localeCompare(b[name]));
            } else {
                mv.arrayOfProductsByPage.sort((a, b) => b[name].localeCompare(a[name]));
            }
        } else {
            if (mv.orderArrays[index]) {
                mv.arrayOfProductsByPage.sort((a, b) => a[name] - b[name]);
            } else {
                mv.arrayOfProductsByPage.sort((a, b) => b[name] - a[name]);
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