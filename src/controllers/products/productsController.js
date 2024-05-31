// eslint-disable-next-line no-undef
app.controller('productsController', function (paginatorService, $scope, $location, productService, supplierService, categoryService, toastr) {
    let mv = this;
    mv.isLoading = false;
    mv.message = '';
    
    mv.products = [];
    mv.suppliers = [];
    mv.categories = [];
    mv.table = [];

    mv.isFound = false;
    mv.orderArrays = [];    

    mv.paginator = paginatorService.getPaginator();

    /**
     * Constructor
     */
    mv.init = () => {      
        for (let j = 0; j < 2; j++) {
            mv.orderArrays.push(false);
        }
        mv.getProducts();
    };

    // Event repaginate
    $scope.$on('paginateEvent', function (event, data) {
        mv.paginator.paginate(data);
    });

    // Event to change the currentPage 
    $scope.$on('changePageEvent', function (event, data) {
        mv.paginator.setPage(data);
    });

    // Event to searching the text 
    $scope.$on('searchingEvent', function (event, data) {
        if (data.isTyping) {
            mv.search(data.searchInput);
        } else {
            mv.paginator.objList = mv.table;
            mv.paginator.paginate();
        }
    });

    // Event when clicking on
    $scope.$on('gotoEvent', function (event, data) {
        mv.goTo(data);
    });

    // Get all the Products 
    mv.getProducts = () => {
        mv.isLoading = true;
        productService.getAllProducts()
            .then((value) => {
                mv.products = value.data;                    
                mv.getSuppliers();
            })
            .catch((err) => {
                mv.message = err;
                mv.isLoading = false;
            });
    };

    // Get all the suppliers 
    mv.getSuppliers = () => {
        supplierService.getAllSuppliers()
            .then((value) => {
                mv.suppliers = value.data;              
                mv.getCategories();
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    // Get all the categories 
    mv.getCategories = () => {
        categoryService.getAllCategories()
            .then((value) => {
                mv.categories = value.data;
                mv.createTable();               
                mv.paginator.objList = mv.table;
                mv.paginator.paginate();
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
                mv.isLoading = false;
            });
    };

    // Format the obj of the raw list 
    mv.getRow = (obj) => {
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
        mv.table = [];
        mv.products.forEach((obj) => {
            let row = mv.getRow(obj);
            if (row) {
                mv.table.push(row);
            }
        });       
    };

    mv.getSupplierById = (id) => {
        return mv.suppliers.find((obj) => { return obj.id == id; });
    };
    mv.getCategoryById = (id) => {
        return mv.categories.find((obj) => { return obj.id == id; });
    };

    mv.goTo = (id) => {
        $location.path(`/products/${id}`);
    };

    // Search in the complete array for the input info
    mv.search = (value) => {
        const inputText = value.toLowerCase().trim();
        let founds = [];       
        mv.table.forEach((obj) => {           
            try {
                if (obj.name.toLowerCase().includes(inputText) ||
                    obj.id.toString().toLowerCase() == inputText ||
                    obj.companyName.toLowerCase().includes(inputText) ||
                    obj.categoryName.toLowerCase().includes(inputText) ||
                    obj.unitPrice.toString().includes(inputText) ||
                    obj.quantityPerUnit.toString().toLowerCase().includes(inputText)) {
                    founds.push(obj);                                     
                }
            } catch (error) {
                console.log(error);
            }
        });
        mv.isFound = (founds.length > 0);
        if (mv.isFound) {
            mv.paginator.objList = founds;
            mv.paginator.paginate();
        } else {
            mv.message = 'No se encontró ningún resultado...';
        }
    };

    // Delete the selected Product by its id
    mv.delete = (id) => {
        mv.isLoading = true;
        productService.deleteProduct(id)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.getProducts();
                toastr.success(`Se eliminó el producto con ID ${id}.`, 'Información');
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
                toastr.error('¡Se produjo un error!', 'Error');
            });
    };

    // Get the index of the Product by its id 
    mv.getIndex = (id) => {
        const index = mv.table.findIndex((obj) => {
            return obj.id == id;
        });
        return index + 1;
    };

    mv.sort = (index) => {      
        const fieldNames = ['id', 'name'];
        let name = fieldNames[index];
        if (isNaN(mv.paginator.objBypage[0][name])) {
            if (mv.orderArrays[index]) {
                mv.paginator.objBypage.sort((a, b) => a[name].localeCompare(b[name]));
            } else {
                mv.paginator.objBypage.sort((a, b) => b[name].localeCompare(a[name]));
            }
        } else {
            if (mv.orderArrays[index]) {
                mv.paginator.objBypage.sort((a, b) => a[name] - b[name]);
            } else {
                mv.paginator.objBypage.sort((a, b) => b[name] - a[name]);
            }
        }
        mv.orderArrays[index] = !mv.orderArrays[index];
    };
    

    // Initialized constructor
    mv.init();
});