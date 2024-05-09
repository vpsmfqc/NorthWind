// eslint-disable-next-line no-undef
app.component('paginatorComponent', {
    templateUrl: 'components/paginator/paginatorComponent.html',
    bindings: {
        isLoading: '=',
        currentPage: '=',
        lastPage: '=',
    },
    controller: 'paginatorController',
    controllerAs: 'paginatorCtrl',

});

// eslint-disable-next-line no-undef
app.controller('paginatorController', function ($scope) {
    let mv = this;
    /**
     * Constructor
     */
    mv.init = () => {
    };

    // triggers the event chnage page
    mv.triggerEvent = function () {
        $scope.$emit('changePageEvent', mv.currentPage);
    };
    // Get de number of the next page
    mv.getNumNextPage = () => { return mv.currentPage + 1; };

    // Get de previous number of the enxt page
    mv.getNumPreviusPage = () => { return mv.currentPage - 1; };

    // Get the last page
    mv.getLastPage = () => {
        return mv.lastPage;
    };
    // Get is the button has to be shown 
    mv.isNextBtn = () => {
        return mv.getNumNextPage() <= mv.getLastPage();
    };
    // Get is the button has to be shown     
    mv.isPreviusBtn = () => {
        return mv.getNumPreviusPage() > 0;
    };
    // Get is the button has to be shown 
    mv.isFirstBtn = () => {
        return mv.currentPage > 1;
    };
    // Get is the button has to be shown 
    mv.isLastBtn = () => {
        return mv.currentPage < mv.getLastPage();
    };
    // Change the current page to the next
    mv.goForward = () => {
        let next = mv.currentPage + 1;
        mv.goToPage(next);
    };
    // Chenge the current page to the previus
    mv.goBackward = () => {
        let next = mv.currentPage - 1;
        mv.goToPage(next);
    };

    // Change the current page into  the specify one 
    mv.goToPage = (page) => {
        if (page > 0 && page <= mv.getLastPage()) {
            mv.currentPage = page;           
            mv.triggerEvent();
        }
    };

    mv.init();
});

