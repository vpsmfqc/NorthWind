// eslint-disable-next-line no-undef
app.service('categoryService', function ($http) {
    // this.path = 'https://northwind.vercel.app/api/categories';  
    this.path = 'https://localhost:44353/api/categories'; 
   
    this.getAllCategories = () => {
        return $http.get(this.path);
    };    
});
   