// eslint-disable-next-line no-undef
app.service('customerService', function ($http) {
    //this.path = 'https://northwind.vercel.app/api/customers';
    this.path = 'https://localhost:44353/api/customers';
   
    /**
     * constructor
     */
    this.init = () => { };   

    this.getAllCustomers = () => {
        return $http.get(this.path);
    };

    this.getCustomerById = (id) => {
        return $http.get(`${this.path}/${id}`);
    };

    this.createCustomer = (data) => {
        return $http.post(this.path, data);
    };

    this.deleteCustomer = (id) => {
        return $http.delete(`${this.path}/${id}`);
    };

    this.updateCustomer = (id, data) => {
        return $http.put(`${this.path}/${id}`, data);
    };

    this.init();
}); 