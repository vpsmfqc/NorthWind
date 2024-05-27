// eslint-disable-next-line no-undef
const app = angular.module('app', ['ngRoute','ngAnimate','ngTouch', 'toastr','ui.bootstrap']);

app.controller('appController', function (authService) {
    let mv = this;
    /**
     * Constructor
     */
    mv.isLogged = true;

    mv.init = () => {
        mv.isLogged = true;
    };

    mv.isMenu = () => {
        return authService.getIsLogged();
    };

    mv.logOut = () => {
        authService.clearSession();
    };

    mv.init();
});

app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'components/main.html',
            controller: 'mainController',
            controllerAs: 'mainCtrl',
        })
        .when('/customers', {
            templateUrl: 'views/customers/customers.html',
            controller: 'customersController',
            controllerAs: 'customerCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        // api/customers/ALFI
        .when('/customers/:idCustomer', {
            templateUrl: 'views/customers/customerEdit.html',
            controller: 'customerEditController',
            controllerAs: 'customerEditCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/products', {
            templateUrl: 'views/products/products.html',
            controller: 'productsController',
            controllerAs: 'productCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/products/:idProduct', {
            templateUrl: 'views/products/productEdit.html',
            controller: 'productEditController',
            controllerAs: 'productEditCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/products/0/:idSupplier', {
            templateUrl: 'views/products/productEdit.html',
            controller: 'productEditController',
            controllerAs: 'productEditCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/suppliers', {
            templateUrl: 'views/suppliers/suppliers.html',
            controller: 'suppliersController',
            controllerAs: 'supplierCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/suppliers/:idSupplier', {
            templateUrl: 'views/suppliers/supplierEdit.html',
            controller: 'supplierEditController',
            controllerAs: 'supplierEditCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/orders', {
            templateUrl: 'views/orders/orders.html',
            controller: 'ordersController',
            controllerAs: 'orderCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/orders/:idOrder', {
            templateUrl: 'views/orders/orderEdit.html',
            controller: 'orderEditController',
            controllerAs: 'orderEditCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .when('/orders/0/:idCustomer', {
            templateUrl: 'views/orders/orderEdit.html',
            controller: 'orderEditController',
            controllerAs: 'orderEditCtrl',
            resolve: {
                'check': function (authService) {
                    authService.authRoute();
                }
            }
        })
        .otherwise({ redirectTo: '/' });
});


