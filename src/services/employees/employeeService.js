// eslint-disable-next-line no-undef
app.service('employeeService', function ($http) {
    this.path = 'https://northwind.vercel.app/api/employees';
    /**
    * constructor
    */
    this.init = () => { };

    this.getEmployeeById = (id) => {
        return $http.get(`${this.path}/${id}`);
    };
    this.init();
});