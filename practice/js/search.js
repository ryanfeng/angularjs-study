//angularjs配置
var app = angular.module('searchApp', []);
app.run(function($rootScope){

});

//angularjs的控制器
app.controller('searchCon',['$scope', 'SearchService', '$scope',function($scope, SearchService,$scope){
    $scope.scopeTest = '你好我是rootScoptTest';
    //初始化数据
    $scope.countrys = [{  label:'请选择', value:'' }, { label:'美国',value: '美国' }, {  label:'英国', value: '英国'}, {  label:'法国', value: '法国'}, {  label:'加拿大', value: '加拿大'}, { label:'新加坡',  value: '新加坡'}];
    $scope.selectCountry = $scope.countrys[0];
    $scope.degrees = [{  label:'请选择', value:'' }, {  label:'研究生', value: '研究生' }, {  label:'本科', value: '本科'}, { label:'博士',  value: '博士'}];
    $scope.selectDegree = $scope.degrees[0];
    $scope.professionals = [{ label:'请选择', value:'' }, { label:'土木工程', value: '土木工程' }, {  label:'计算机',value: '计算机'}, { label:'软件', value: '软件'}, {  label:'金融',value: '金融'}, { label:'物流', value: '物流'}];
    $scope.selectProfessional = $scope.countrys[0];
    $scope.likes = [{  label:'请选择',value:'' }, { label:'骑马', value: '骑马' }, { label:'赛车', value: '赛车'}, { label:'摄影', value: '摄影'}, {  label:'旅游',value: '旅游'}, {  label:'健身',value: '健身'}];
    $scope.selectLike = $scope.countrys[0];
    $scope.themes = ['留学领航,求职就业,创业助力,校园生活,猎奇分享','留学领航','求职就业','创业助力','校园生活','猎奇分享'];
    $scope.totalPage = 0;
    $scope.pageSize = 9;

    //请求参数
    $scope.isSearchWord = false;
    $scope.currentPage = 1;
    $scope.word = "";
    $scope.tips = "";
    $scope.filter = "";
    //数据加载
    $scope.load  = function() {
        SearchService.GetData($scope.currentPage, $scope.filter, $scope.tips, $scope.word,  $scope.isSearchWord).success(function (data, status, headers, config) {
            var persons = data.result;
            var state = data.state;
            if (state == "success") {
                $scope.persons = JSON.parse(persons);
                $scope.totalPage =Math.ceil(data.viewtotal / $scope.pageSize);
            }
           /* //生成页码
            $scope.pages = [];
            for (var i = 1; i <= $scope.totalPage; i++) {
                    $scope.pages.push(i);
            }
            //判断是否显示当前页码
            var currentPage = $scope.currentPage;
            var totalPage = $scope.totalPage;
            var showPage = 2;
            var beforeShowPage = parseInt(currentPage) - showPage;
            var afterShowPage = parseInt(currentPage) + showPage;
            $scope.isPageShow = function(page) {
                var n = ((page <= showPage || page > totalPage-showPage)||(page >= beforeShowPage && page <= afterShowPage))?true:false;
                return n;
            }
            //判断是否显示省略号
            $scope.isOverplusShow = function(page){
                return ((showPage <= page <=totalPage-showPage)&&(page <= beforeShowPage || page >= afterShowPage))?true:false;
            }*/

            //生成页码
            $scope.pages = [];
            var totalPage = $scope.totalPage;
            var currentPage = $scope.currentPage;
            var showPage = 2;
            var afterShowPage = currentPage + showPage;
            var beforeShowPage = currentPage - showPage;
            for (var i = 1; i <= totalPage; i++) {
                if((i==showPage + 1 && i > showPage && i < afterShowPage ) || (i==totalPage-2  && i<= totalPage-showPage) && (i < beforeShowPage || i > afterShowPage)){
                    $scope.pages.push("......");
                }
                if ((i <= showPage || i > totalPage-showPage)||(i >= beforeShowPage && i <= afterShowPage)) {
                    $scope.pages.push(i);
                }
            }

           /* if ($scope.totalPage <= basePage) {
                for (var i = 1; i <= $scope.totalPage; i++) { $scope.pages.push(i); }
            } else for (var i = 1; i <= $scope.totalPage; i++) {
                if ($scope.currentPage == 1) {
                    $scope.pages.push(i);
                    if (i == mostPage) { $scope.pages.push("......"); $scope.pages.push($scope.totalPage); break; }
                } else if ($scope.currentPage <= mostPage) {
                    $scope.pages.push(i);
                    if (i == afterShowPage) { $scope.pages.push("......"); $scope.pages.push($scope.totalPage); break; }
                } else {
                    if (i <= leastPage) {
                        $scope.pages.push(i);
                        if (i == leastPage) { $scope.pages.push("......"); }
                    }
                    if (beforeShowPage <= i && i <= afterShowPage) {
                        $scope.pages.push(i);
                    }
                    if (i == afterShowPage) {
                        if (afterShowPage != $scope.totalPage) { $scope.pages.push("......"); $scope.pages.push($scope.totalPage); break; }
                    }
                }
            }*/

            //下一页
            $scope.next = function () {
                if ($scope.currentPage < $scope.totalPage) {
                    $scope.currentPage++;
                    $scope.load();
                }
            };
            //指定页码
            $scope.loadPage = function (page) {
                if(page != "......"){
                    $scope.currentPage = page;
                    $scope.load();
                }
            };
        });
    };

    $scope.showFonter = function($event) {
    }

    //初始化加载
    $scope.load();
}]);
//搜索业务类服务
app.factory('SearchService', ['$http', function ($http) {
    var data = function (page, filter, tips, word ,isSearchWord) {
        var toSend = new Object();
        toSend.style = "function";
        toSend.method = "search";
        toSend.page = page.toString();
        toSend.filter = filter;
        //console.log($scope.scopeTest);
        (isSearchWord)?toSend.word = word:toSend.tips = tips;
        return $http({
            method: 'POST',
            url: 'http://service.1yingli.cn/yiyingliService/manage',
            data: JSON.stringify(toSend),
            headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
    return {
        GetData: function (page, filter, tips, word, isSearchWord ) {
            return data(page, filter, tips, word, isSearchWord);
        }
    };
}]);
//html的过滤器
app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
