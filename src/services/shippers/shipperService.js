// eslint-disable-next-line no-undef
app.service('shipperService', function ($http) {
    this.path = 'https://northwind.vercel.app/api/shippers';
    /**
    * constructor
    */
    this.init = () => { };

    this.getAllShippers = () => {
        return $http.get(`${this.path}`);
    };
    this.init();
});