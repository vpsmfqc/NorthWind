// eslint-disable-next-line no-undef
app.service('productService', function ($http) {
    //this.path = 'https://northwind.vercel.app/api/products';
    this.path = 'https://localhost:44353/api/products';
   
    /**
     * constructor
     */
    this.init = () => { };

    this.getAllProducts = () => {
        return $http.get(this.path);
    };

    this.getProductById = (id) => {       
        return $http.get(`${this.path}/${id}`);
    };

    this.createProduct = (data) => {
        return $http.post(this.path, data);
    };

    this.deleteProduct = (id) => {
        return $http.delete(`${this.path}/${id}`);
    };

    this.updateProduct = (id, data) => {
        return $http.put(`${this.path}/${id}`, data);
    };

    this.patchProduct = (id, data) => {
        return $http.patch(`${this.path}/${id}`, data);
    };



    this.init();
}); 