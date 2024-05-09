// eslint-disable-next-line no-undef
app.service('orderService', function ($http) {
    this.path = 'https://northwind.vercel.app/api/orders';   
   
    this.init = () => { };   

    this.getAllOrders = () => {
        return $http.get(this.path);
    }; 

    this.getOrderById = (id) => {
        return $http.get(`${this.path}/${id}`);
    };

    this.createOrder = (data) => {
        return $http.post(this.path, data);
    };

    this.deleteOrder = (id) => {
        return $http.delete(`${this.path}/${id}`);
    };

    this.updateOrder = (id, data) => {
        return $http.put(`${this.path}/${id}`, data);
    };

    this.init();

});
   