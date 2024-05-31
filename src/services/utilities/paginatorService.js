// eslint-disable-next-line no-undef
app.service('paginatorService', function () {

    this.init = () => {

    };

    this.getPaginator = () => {
        let obj = {
            rowsFromTo: [],
            currentPage: 1,
            objBypage: [],
            objList: [],
            rowsByPage: 10,
            // Split the complete array of customers into the number of pages 
            splitIntoPage: function () {
                let index = this.currentPage - 1;
                this.split(this.rowsFromTo[index]);
            },
            setPage: function (page) {
                this.currentPage = page;
                this.splitIntoPage();
            },
            split: function (point) {
                this.objBypage = this.objList.slice(point[0], point[1]);
            },
            // Get the complete objects array divided 
            paginate: function (rows) {                
                if(rows){
                    if (rows > 0) {
                        this.rowsByPage = rows;
                    }
                }               
                this.rowsFromTo = [];
                const length = this.objList.length;
                const rest = length % this.rowsByPage;
                const pages = Number.parseInt((length - rest) / this.rowsByPage);
                const lastPage = (rest > 0) ? pages + 1 : pages;
                for (let i = 0; i < lastPage; i++) {
                    let startIndex = i * this.rowsByPage;
                    let endIndex = (i < (lastPage - 1)) ? startIndex + this.rowsByPage : length;
                    let pair = [startIndex, endIndex];
                    this.rowsFromTo.push(pair);
                }
                this.currentPage = 1;
                this.splitIntoPage();
            },
            // Get the last page
            getLastPage: function () {
                return this.rowsFromTo.length;
            },
        };
        return obj;
    };

    this.init();
});