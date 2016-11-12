var myApp = angular.module('myApp', []);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

    var refresh = function(){
      $http.get('/maaltijdList').success(function(response){
        console.log("I got the data I requested");
        $scope.maaltijdList = response;
        $scope.maaltijd = "";
      });
    };

    refresh();


    $scope.addMaaltijd = function() {
      console.log($scope.maaltijd);
      $scope.maaltijd._id = "";
      $http.post('/maaltijdList', $scope.maaltijd).success(function(response){
        console.log(response);
        refresh();
      });
    };

    $scope.remove = function(id){
      console.log(id);
      $http.delete('/maaltijdList/' + id).success(function(response){
        refresh();
      });
    };

    $scope.edit = function(id) {
      console.log(id);
      $http.get('/maaltijdList/' + id).success(function(response){
        $scope.maaltijd = response;
      });
    };

    $scope.update = function(){
      console.log($scope.maaltijd._id);
      $http.put('/maaltijdList/' + $scope.maaltijd._id, $scope.maaltijd).success(function(response){
        refresh();
      });
    };


}]);

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////              RESTO                   ////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


myApp.controller('RestaurantCtrl', ['$scope', '$http', function($scope, $http) {

  var refreshResto = function(){
    $http.get('/restaurantList').success(function(response){
      console.log("I got the data I requested");
      $scope.restaurantList = response;
      $scope.restaurant = "";
    });
  };

refreshResto();

$scope.addResto = function() {
  console.log($scope.restaurant);
  $scope.restaurant._id = "";
  $http.post('/restaurantList', $scope.restaurant).success(function(response){
    console.log(response);
    refreshResto();
  });
};

$scope.removeResto = function(id){
  console.log(id);
  $http.delete('/restaurantList/' + id).success(function(response){
    refreshResto();
  });
};

$scope.editResto = function(id) {
  console.log(id);
  $http.get('/restaurantList/' + id).success(function(response){
    $scope.restaurant = response;
  });
};

$scope.updateResto = function(){
  console.log($scope.restaurant._id);
  $http.put('/restaurantList/' + $scope.restaurant._id, $scope.restaurant).success(function(response){
    refreshResto();
  });
};


}]);
