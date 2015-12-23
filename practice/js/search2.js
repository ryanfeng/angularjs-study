//窗体动摇样式
function showBorder(){
    $(this).css("box-shadow", "0 0 5px #ccc;");
}
function closeBorder(){
    $(this).css("box-shadow", "0 0 0px #ccc;");
}

//angularjs配置
var app = angular.module('searchApp', []);
//html的过滤器
app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);
//angularjs的控制器
app.controller('searchCon',['$scope', 'SearchService', function($scope, SearchService){
    $scope.totalPage = 0;
    $scope.pageSize = 9;
    $scope.endPage = 1;
    $scope.currentPage = 1;
    $scope.word = "";
    $scope.tips = "";
    $scope.filter = "";
    //数据加载
    $scope.load  = function() {
        SearchService.GetData($scope.currentPage, $scope.filter, $scope.tips, $scope.word).success(function (data, status, headers, config) {
            var persons = data.result;
            var state = data.state;
            if (state == "success") {
                $scope.persons = JSON.parse(persons);
                $scope.totalPage =Math.ceil(data.viewtotal / $scope.pageSize);
            }

            //生成页码
            $scope.pages = [];
            var basePage = 10;
            var leastPage = 2
            var showPage = 3;
            var mostPage = parseInt(leastPage) + parseInt(showPage);
            var afterShowPage = parseInt($scope.currentPage) + showPage;
            var beforeShowPage = parseInt($scope.currentPage) - showPage;
            if ($scope.totalPage <= basePage) {
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
                        if (i == leastPage) { $scope.pages.push("....."); }
                    }
                    if (beforeShowPage <= i && i <= afterShowPage) {
                        $scope.pages.push(i);
                    }
                    if (i == afterShowPage) {
                        if (afterShowPage != $scope.totalPage) { $scope.pages.push("......"); $scope.pages.push($scope.totalPage); break; }
                    }
                }
            }
        });
    };

    //初始化加载
    $scope.load();
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
}]);
//搜索业务类服务
app.factory('SearchService', ['$http', function ($http) {
    var data = function (page, filter, tips, word) {
        var toSend = new Object();
        toSend.style = "function";
        toSend.method = "search";
        toSend.page = page.toString();
        if(word){
            toSend.word = word;
        } else {
            toSend.tips = "留学领航,求职就业,创业助力,校园生活,猎奇分享";
        }
        toSend.filter = filter;
        return $http({
            method: 'POST',
            url: 'http://service.1yingli.cn/yiyingliService/manage',
            data: JSON.stringify(toSend),
            headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
    return {
        GetData: function (page, filter, tips, word) {
            return data(page, filter, tips, word);
        }
    };
}]);
