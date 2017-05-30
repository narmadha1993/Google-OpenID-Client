var OpenIDApp=angular.module('OpenId',[]);
OpenIDApp.controller('Control',function($scope,$http){
     console.log('get');
     $scope.FBlogin=function(){
     	var login_data={
     		'username':$scope.username,
            'password':$scope.pass
     	}
     	console.log('get');
     	$http.get('/googlelogin').then(function(err){
     		if(err){
     			return err;
     		}
     		console.log('success');
     	})
     }
})
