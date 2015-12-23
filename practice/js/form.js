var app = angular.module("myTest", []);
app.controller('MyController', function($scope){
    //$scope.user={name:"textName",email:"50377550@qq.com"};
    /*$scope.submitForm = function(isValid) {
        if (!isValid) {
            alert('验证失败');
        }
    };*/
    $scope.set_color = function (payment) {
        if (payment) {
            return { color: "red" }
        }
    }
});