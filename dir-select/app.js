var app = angular.module('myapp',[]);
app.directive('selectBlock',function (selectService) {
	return{
		restrict: 'AE',
		replace: true,
		scope:{},
		templateUrl: 'selectblock.html',
		link: function(scope, elem, attrs){
			scope.isShowCountry = false;
			scope.countrys = selectService.resources;
			scope.country = scope.countrys[0];
			scope.selectCountry = function(index){
				scope.country = scope.countrys[index];
				scope.isShowCountry = false;
			}
		}
	}
});
app.service('selectService', [function(){
	this.resources = {
        '0': {
            "country": '中国',
            "flag": 'img/china.png',
            "code": '+86'
        },
        '1': {
            "country": '加拿大',
            "flag": 'img/canada.png',
            "code": '+1'
        },
        '2': {
            "country": '法国',
            "flag": 'img/france.png',
            "code": '+33'
        },
        '3': {
            "country": '德国',
            "flag": 'img/germany.png',
            "code": '+49'
        },
        '4': {
            "country": '香港',
            "flag": 'img/hk.png',
            "code": '+852'
        },
        '5': {
            "country": '意大利',
            "flag": 'img/italy.png',
            "code": '+39'
        },
        '6': {
            "country": '日本',
            "flag": 'img/japan.png',
            "code": '+81'
        },
        '7': {
            "country": '韩国',
            "flag": 'img/korea.png',
            "code": '+82'
        },
        '8': {
            "country": '英国',
            "flag": 'img/UK.png',
            "code": '+44'
        },
        '9': {
            "country": '美国',
            "flag": 'img/USA.png',
            "code": '+1'
        },
        '10': {
            "country": '西班牙',
            "flag": 'img/apain.png',
            "code": '+34'
        }
    };
}])	