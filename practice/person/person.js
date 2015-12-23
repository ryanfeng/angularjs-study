var app = angular.module("personApp", ['ngRoute']);
app.config(['$routeProvider',function ($routeProvider) {
        $routeProvider
        .when('/:tid', {
            templateUrl: 'person-route.html',
            controllerAS: 'personInfoCon'
        })
        .otherwise({
            templateUrl: 'person-route.html',
            controllerAs: 'personInfoCon'
        });
}]);
app.controller("personInfoCon", function($scope, $routeParams, PersonService, AboutTopicService, CommentService){
    $scope.tid = "127";
    $scope.page = "1";
    $scope.pagesArray = [];

    if($routeParams.tid) {
        $scope.tid = $routeParams.tid;
    }
    //数据加载
    $scope.load = function() {
        PersonService.GetData($scope.tid).success(function (data, status, headers, config) {
            $scope.person = data;
           // $scope.totalPage = Math.ceil($scope.person.commentNo/9);
            $scope.totalPage = Math.ceil(100/9);
            $scope.person.studyExperience = JSON.parse($scope.person.studyExperience);
            $scope.person.workExperience = JSON.parse($scope.person.workExperience);
            $scope.person.tips = JSON.parse($scope.person.tips);
            $scope.person.tipsArray = [];
            for(var i=0; i<$scope.person.tips.length;  i++) {
                $scope.person.tipsArray[$scope.person.tips[i].id]= $scope.person.tips[i].id;
            }
            for (var i = 1; i <= $scope.totalPage; i++){
                $scope.pagesArray.push(i);
            }
        });
        AboutTopicService.GetData($scope.tid).success(function (data, status, headers, config) {
            if(data.state == "success") {
                $scope.persons = eval("("+data.data+")");
            }
        });
        CommentService.GetData($scope.tid, $scope.page).success(function(data, status, headers, config){
            if(data.state == "success") {
                $scope.comments = eval("("+data.data+")");
            }
        })
    };
    //评论分页
    $scope.pages = function(page) {
        $scope.page = page;
        CommentService.GetData($scope.tid, $scope.page).success(function(data, status, headers, config){
            if(data.state == "success") {
                $scope.comments = eval("("+data.data+")");
            }
        })
    }
    //初始化加载
    $scope.load();
});
//业务个人信息
app.factory('PersonService', ['$http', function ($http) {
    var data = function (tid) {
        var toSend = new Object();
        toSend.style = "user";
        toSend.method = "getTeacherInfo";
        toSend.teacherId = tid;
        return $http({
            method: 'POST',
            url: 'http://service.1yingli.cn/yiyingliService/manage',
            data: JSON.stringify(toSend),
            headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
    return {
        GetData: function (tid) {
            return data(tid);
        }
    };
}]);
//业务相关话题
app.factory('AboutTopicService', ['$http', function ($http) {
    var data = function (tid) {
        var toSend = new Object();
        toSend.style = "function";
        toSend.method = "getRecommendTeacherList";
        toSend.teacherId = tid;
        return $http({
            method: 'POST',
            url: 'http://service.1yingli.cn/yiyingliService/manage',
            data: JSON.stringify(toSend),
            headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
    return {
        GetData: function (tid) {
            return data(tid);
        }
    };
}]);
//业务导师评论话题
app.factory('CommentService', ['$http', function ($http) {
    var data = function (tid, page) {
        var toSend = new Object();
        toSend.style = "teacher";
        toSend.method = "getCommentList";
        toSend.teacherId = tid;
        toSend.page = page.toString();
        return $http({
            method: 'POST',
            url: 'http://service.1yingli.cn/yiyingliService/manage',
            data: JSON.stringify(toSend),
            headers:{ 'Content-Type': 'application/x-www-form-urlencoded'}
        });
    };
    return {
        GetData: function (tid,page) {
            return data(tid,page);
        }
    };
}]);
//html的过滤器
app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);