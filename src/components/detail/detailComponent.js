// eslint-disable-next-line no-undef
app.component('detailComponent', {
    templateUrl: 'components/detail/detailComponent.html',
    bindings: {
        detailsArray: '=',
        listOfDetailedProducts: '='
    },
    controller: 'detailController',
    controllerAs: 'detailCtrl',
});

// eslint-disable-next-line no-undef
app.controller('detailController', function (productService, toastr) {

    let mv = this;
    mv.isLoading = false;
    mv.rawArrayOfProducts = [];
    mv.filterArrayOfProducts = [];
    mv.listOfProducts = [];
    // mv.listOfDetailedProducts = [];    
    mv.productId = 0;

    /**
     * Bootstrap UI
     */
    mv.info = '';
    /**
     * end
     */


    /**
     * Contructor
     */
    mv.init = () => {
        mv.productId = 0;
        mv.listOfDetailedProducts = [];
        mv.getAllProducts();
    };

    // Get all the products
    mv.getAllProducts = () => {
        mv.isLoading = true;
        productService.getAllProducts()
            .then((value) => {
                mv.rawArrayOfProducts = value.data;
                mv.listOfProducts = mv.detailsArray;
                mv.createTable();
                mv.filter();
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
            });
    };

    // Create the new table 
    mv.createTable = () => {
        mv.listOfDetailedProducts = [];
        mv.listOfProducts.forEach((obj) => {
            let fProduct = mv.rawArrayOfProducts.find((product) => {
                return product.id == obj.productId;
            });
            let product = mv.createProductObj(fProduct.unitsInStock, false, obj.productId, obj.unitPrice, obj.quantity, obj.discount, fProduct.name);
            mv.listOfDetailedProducts.push(product);
        });
    };

    //  Generate the total of all products
    mv.getGreatTotal = () => {
        let total = 0;
        mv.listOfDetailedProducts.forEach((obj) => {
            total = total + obj.totalPrice();
        });
        return total;
    };

    // Product Class
    mv.createProductObj = (unitsInStock, isEditable, productId, unitPrice, quantity, discount, name) => {
        let product = {
            unitsInStock: unitsInStock,
            isEditable: isEditable,
            productId: productId,
            unitPrice: unitPrice,
            quantity: quantity,
            discount: discount,
            name: name,
            addUnits: function () {
                if (this.unitsInStock > 0) {
                    this.quantity++;
                    this.unitsInStock--;
                    this.isEditable = false;
                }
            },
            subUnits: function () {
                if (this.quantity > 0) {
                    this.quantity--;
                    this.unitsInStock++;
                    this.isEditable = false;
                }
            },
            toggle: function () {
                this.isEditable = !this.isEditable;
            },
            totalPrice: function () {
                return (this.unitPrice - (this.unitPrice * this.discount)) * this.quantity;
            },
            setProduct: function (productId) {
                let fProduct = mv.rawArrayOfProducts.find((obj) => {
                    return obj.id == productId;
                });
                this.unitsInStock = fProduct.unitsInStock;
                this.productId = fProduct.id;
                this.unitPrice = fProduct.unitPrice;
                this.quantity = 0;
                this.discount = 0;
                this.name = fProduct.name;
            },
            updateStock: function () {
                let obj = {
                    productId: this.productId,
                    unitsInStock: (this.unitsInStock - this.discount)
                };
                return productService.updateProduct(this.productId, obj);
            },
            isUnChecked: function () {
                return this.isEditable || (this.quantity == 0);
            },
        };
        return product;
    };

    mv.remove = (id) => {
        let index = mv.listOfDetailedProducts.findIndex((obj) => {
            return obj.productId == id;
        });
        mv.listOfDetailedProducts.splice(index, 1);
    };

    mv.edit = (id) => {
        mv.productId = id;
        mv.filterToEdit(mv.productId);
        let index = mv.listOfDetailedProducts.findIndex((obj) => {
            return obj.productId == id;
        });
        mv.listOfDetailedProducts.forEach((obj) => {
            obj.isEditable = false;
        });
        mv.listOfDetailedProducts[index].toggle();
    };

    mv.save = (id) => {
        mv.productId = id;
        let index = mv.listOfDetailedProducts.findIndex((obj) => {
            return obj.productId == id;
        });
        mv.listOfDetailedProducts[index].toggle();
    };

    mv.add = () => {
        if (mv.listOfDetailedProducts.length > 0) {
            let index = mv.listOfDetailedProducts.length - 1;
            if (!mv.listOfDetailedProducts[index].isUnChecked()) {
                mv.info = '';
                mv.filter();
                mv.productId = 0;
                mv.listOfDetailedProducts.forEach((obj) => {
                    obj.isEditable = false;
                });
                let product = mv.createProductObj(0, true, 0, 0, 0, 0, 0, '');
                mv.listOfDetailedProducts.push(product);
            } else {
                mv.info = '¡Elija un producto, una cantidad y guarde!';
            }
        } else {
            mv.filter();
            let product = mv.createProductObj(0, true, 0, 0, 0, 0, 0, '');
            mv.listOfDetailedProducts.push(product);
        }
    };

    // Remove all the products that are not available
    mv.filter = () => {
        let filterList = [];
        mv.rawArrayOfProducts.forEach((product) => {
            if (product.unitsInStock > 0 && product.discontinued == false && product.unitsOnOrder < product.unitsInStock) {
                filterList.push(product);
            }
        });
        mv.listOfDetailedProducts.forEach((product) => {
            let index = filterList.findIndex((obj) => {
                return obj.id == product.productId;
            });
            filterList.splice(index, 1);
        });
        mv.filterArrayOfProducts = filterList;
        console.log(mv.filterArrayOfProducts);
    };

    //Filter adn add the current product
    mv.filterToEdit = (productId) => {
        mv.filter();
        let fproduct = mv.rawArrayOfProducts.find((product) => {
            return product.id == productId;
        });
        if (fproduct) {
            mv.filterArrayOfProducts.push(fproduct);
        }
    };

    mv.init();
});