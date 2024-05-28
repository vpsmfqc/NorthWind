// eslint-disable-next-line no-undef
app.controller('usersController', function (userService, paginatorService, $scope) {
    let mv = this;
    mv.userList = [];
    mv.rawUserList = [];
    mv.isFound = false;
    mv.message = '';
    mv.isLoading = false;
    mv.usersByPage = [];
    mv.paginator = paginatorService.getPaginator();

    /**
     * Contructor
     */
    mv.init = () => {
        mv.getAllUsers();
    };

    /**
     * Components events
     */

    // Event repaginate
    $scope.$on('paginateEvent', function (event, data) {
        mv.paginator.paginate(data);
    });

    // Event to change the currentPage 
    $scope.$on('changePageEvent', function (event, data) {
        mv.paginator.setPage(data);
    });

    // Event to searching the text 
    $scope.$on('searchingEvent', function (event, data) {
        if (data.isTyping) {
            mv.search(data.searchInput);
        } else {
            mv.userList = mv.rawUserList;
            mv.paginator.objList = mv.userList;
            mv.paginator.paginate();
        }
    });

    // Event when clicking on
    $scope.$on('gotoEvent', function (event, data) {
        alert(`${data} enviar a crear nuevo usuario`);
    });

    /**
     * End components 
     */

    mv.getAllUsers = () => {
        mv.isLoading = true;
        userService.getAllUsers()
            .then((value) => {
                mv.userList = value.data;
                mv.rawUserList = value.data;
                mv.paginator.objList = mv.userList;
                mv.paginator.paginate();
                mv.isLoading = false;
            })
            // eslint-disable-next-line no-unused-vars
            .catch((err) => {
                mv.isLoading = false;
            });
    };

    mv.search = (value) => {
        let inputText = value.trim().toLowerCase();
        let filter = [];
        mv.paginator.objBypage = [];
        mv.userList.forEach((obj) => {
            try {
                if (obj.email.toLowerCase().includes(inputText)) {
                    filter.push(obj);
                }
            }
            catch (err) {
                console.log(err);
            }
        });
        mv.isFound = (filter.length > 0);
        if (mv.isFound) {
            mv.userList = filter;
            mv.paginator.objList = mv.userList;
            mv.paginator.paginate();
        } else {
            mv.message = 'No se encontró ningún resultado...';
        }
    };

    mv.delete = (id) => {
        mv.isLoading = true;
        userService.deleteUserById(id)
            // eslint-disable-next-line no-unused-vars
            .then((value) => {
                mv.getAllUsers();
                mv.isLoading = false;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    mv.edit = (id) => {
        console.log(id);
    };

    mv.init();
});