// eslint-disable-next-line no-undef
app.service('shipperService', function ($http) {
    this.path = 'https://northwind.vercel.app/api/shippers';
    /**
    * constructor
    */
    this.init = () => { };

    this.getShipperById = (id) => {
        return $http.get(`${this.path}/${id}`);
    };
    this.init();
});