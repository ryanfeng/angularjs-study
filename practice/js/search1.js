var totalPage = 0;
var nowPage = 1;
var viewtotal =0;
var numberPage = 9;

//参数
var toSend = new Object();
toSend.style = "function";
toSend.method = "search";
toSend.filter = "";
toSend.tips="留学领航,求职就业,创业助力,校园生活,猎奇分享";

function showBorder(){
    $(this).css("box-shadow", "0 0 5px #ccc;");
}
function closeBorder(){
    $(this).css("box-shadow", "0 0 0px #ccc;");
}

var app = angular.module('searchApp', []);
app.controller('searchCon', function($scope, $http) {
    $scope.searchTeacher = function(nowpage) {
        nowPage = nowpage;
        toSend.page = nowPage.toString();

        if($scope.searchKey){
            toSend.word= $scope.searchKey;
        }

        $http({
            method:'POST',
            url:'http://service.1yingli.cn/yiyingliService/manage',
            data: JSON.stringify(toSend),
            headers:{
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function(data, status, headers, config){
            var persons = data.result;
            var state = data.state;
            viewtotal = data.viewtotal;
            if (state == "success") {
                $scope.persons = JSON.parse(persons);
                makePager();
            }
        }).error(function() {});
    }
    $scope.searchTeacher(nowPage);
});
app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);

function makePager() {
    //先删除所有页数
    if(viewtotal==0){
        $(".page").html("没有想要的结果。");
        return;
    } else {
        $(".page").html("");
        totalPage = Math.ceil(viewtotal / numberPage);
    }
    //页码设置
    var basePage = 10;
    var leastPage = 2
    var showPage = 3;
    var mostPage = parseInt(leastPage) + parseInt(showPage);
    var afterShowPage = parseInt(nowPage) + showPage;
    var beforeShowPage = parseInt(nowPage) - showPage;
    function getPageLabel(index){
        return "<label ng-click=\"searchTeacher("+index+");\">"+index+"</label>" ;
    }
    function getPageOverplus(){
        return "<label id=\"pageOverplus\">......</label>";
    }
    //添加页码
    $(".page").append("<img src=\"images/page_person.png\"/>");
    if (totalPage <= basePage) {
        for (var i = 1; i <= totalPage; i++) {
            $(".page").append(getPageLabel(i));
        }
    } else {
        for (var i = 1; i <= totalPage; i++) {
            if (nowPage == 1) {
                $(".page").append(getPageLabel(i));
                if (i == mostPage) {
                    $(".page").append(getPageOverplus());
                    $(".page").append(getPageLabel(totalPage));
                    break;
                }
            } else if (nowPage <= mostPage) {
                $(".page").append(getPageLabel(i));
                if (i == afterShowPage) {
                    $(".page").append(getPageOverplus());
                    $(".page").append(getPageLabel(totalPage));
                    break;
                }
            } else {
                if (i <= leastPage) {
                    $(".page").append(getPageLabel(i));
                    if (i == leastPage) {
                        $(".page").append(getPageOverplus());
                    }
                }
                if (beforeShowPage <= i && i <= afterShowPage) {
                    $("page").append(getPageLabel(i));
                }
                if (i == afterShowPage) {
                    if (afterShowPage != totalPage) {
                        $(".page").append(getPageOverplus());
                        $(".page").append(getPageLabel(totalPage));
                        break;
                    }
                }
            }
        }
    }
    $(".page").append("<img src=\"http://image.1yingli.cn/img/nextPageBlue.png\"/><label>英里</label>");
    $(".page label:nth-of-type("+nowPage+")").attr("id", "pageNow");
}