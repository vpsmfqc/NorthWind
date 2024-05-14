// eslint-disable-next-line no-undef
app.service('employeeService', function ($http) {
    this.path = 'https://northwind.vercel.app/api/employees';
    this.path = 'https://localhost:44353/api/employees';
    /**
    * constructor
    */
    this.init = () => { };

    this.getAllEmployees = () => {
        return $http.get(`${this.path}`);
    };
    this.init();
});