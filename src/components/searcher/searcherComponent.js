// eslint-disable-next-line no-undef
app.component('searcherComponent', {
    templateUrl: 'components/searcher/searcherComponent.html',
    bindings: {
        isLoading: '=',
        rowsByPage: '=',
        message: '=',
        isFound: '='
    },
    controller: 'searcherController',
    controllerAs: 'searcherCtrl',
});

// eslint-disable-next-line no-undef
app.controller('searcherController', function ($scope) {
    let mv = this;
    mv.isTyped = false;
    mv.listOfPages = [];
    mv.searchInput = '';

    mv.init = () => {
        mv.isTyped = false;
        mv.isFound = false;
        mv.isLoading = false;
        mv.message = '';
        mv.rowsByPage = 10;
        for (let i = 5; i <= 20; i = i + 5) {
            mv.listOfPages.push(i);
        }
    };

    mv.paginate = () => {
        $scope.$emit('paginateEvent', mv.rowsByPage);
    };

    mv.goToNew = () => {
        $scope.$emit('gotoEvent', 0);
    };

    mv.search = () => {
        mv.isTyped = true;
        const data = {
            searchInput: mv.searchInput,
            isTyping: mv.isTyping()
        };
        $scope.$emit('searchingEvent', data);
    };

    mv.isTyping = () => {
        return mv.searchInput.trim() != '' && mv.isTyped;
    };

    mv.init();
});