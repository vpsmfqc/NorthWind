// eslint-disable-next-line no-undef
app.service('supplierService', function ($http) {    
    
    this.path = 'https://localhost:44353/api/suppliers';
    //this.path = 'https://northwind.vercel.app/api/suppliers';   
   
    this.init = () => { };   

    this.getAllSuppliers = () => {
        return $http.get(this.path);
    }; 

    this.getSupplierById = (id) => {
        return $http.get(`${this.path}/${id}`);
    };

    this.createSupplier = (data) => {
        return $http.post(this.path, data);
    };

    this.deleteSupplier = (id) => {
        return $http.delete(`${this.path}/${id}`);
    };

    this.updateSupplier = (id, data) => {
        return $http.put(`${this.path}/${id}`, data);
    };

    this.init();

});
   