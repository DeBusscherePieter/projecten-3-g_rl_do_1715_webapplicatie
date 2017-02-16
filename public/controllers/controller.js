var myApp = angular.module('myApp', ['ngMask','ngMaterial']);
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

    $scope.sortFunc = function(maaltijd){
        return parseInt(maaltijd.id);
    };

    var refresh = function(){
      $http.get('/maaltijdList').success(function(response){
        console.log("I got the data I requested");
          
        $scope.maaltijdList = response;
        $scope.maaltijd = {};
          
        $scope.maaltijd.allergenen = {};
        $scope.maaltijd.allergenen.gluten = false;
        $scope.maaltijd.allergenen.schaaldieren = false;
        $scope.maaltijd.allergenen.eieren = false;
        $scope.maaltijd.allergenen.vis = false;
        $scope.maaltijd.allergenen.aardnoten = false;
        $scope.maaltijd.allergenen.soja = false;
        $scope.maaltijd.allergenen.melk = false;
        $scope.maaltijd.allergenen.noten = false;
        $scope.maaltijd.allergenen.selderij = false;
        $scope.maaltijd.allergenen.mosterd = false;
        $scope.maaltijd.allergenen.sesamzaad = false;
        $scope.maaltijd.allergenen.zwavel = false;
        $scope.maaltijd.allergenen.lupine = false;
        $scope.maaltijd.allergenen.weekdieren = false;

        $scope.maaltijd.id = Object.keys($scope.maaltijdList).length + 1;
      });
    };

    refresh();

    $http.get('/restaurantList').success(function(response){
      console.log("I got the data I requested");
      $scope.restaurantList = response;
    });


    $scope.addMaaltijd = function() {
      console.log($scope.maaltijd);
      $http.get('/maaltijdList').success(function(response){
        if($scope.maaltijd.id <= Object.keys(response).length){
          $scope.maaltijd.id = Object.keys(response).length + 1;
        }
        $scope.maaltijd._id = "";
        $scope.maaltijd.id = $scope.maaltijd.id.toString();
        $http.post('/maaltijdList', $scope.maaltijd).success(function(response){
          console.log(response);
          refresh();
        });
      });
      
    };


    $scope.remove = function(id){
      console.log(id);
      $http.delete('/maaltijdList/' + id).success(function(response){
        $http.get('/maaltijdList').success(function(response){
          if(Object.keys(response).length > 0){
            var list = response;
            for(var item = 0; item < list.length; item++){
              list[item].id = parseInt(item) + 1;
              $http.put('/maaltijdList/' + list[item]._id, list[item]).success(function(response){
              });
              if(item == list.length - 1){
                refresh();
              }
            }
          } else {
            refresh();
          }
        });
      });
    };

    $scope.edit = function(id) {
      console.log($scope.maaltijd);
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


  $scope.sortFunc = function(restaurant){
      return parseInt(restaurant.id);
  };


  var refreshResto = function(){
    $http.get('/restaurantList').success(function(response){
      console.log("I got the data I requested");
      $scope.restaurantList = response;
      $scope.restaurant = {};
      $scope.restaurant.id = Object.keys($scope.restaurantList).length + 1;
    });
  };

refreshResto();

$scope.addResto = function() {
  console.log($scope.restaurant);
  $http.get('/restaurantList').success(function(response){
    if($scope.restaurant.id <= Object.keys(response).length){
          $scope.restaurant.id = Object.keys(response).length + 1;
    }
    $scope.restaurant._id = "";
    $scope.restaurant.id = $scope.restaurant.id.toString();
    $http.post('/restaurantList', $scope.restaurant).success(function(response){
      console.log(response);
      refreshResto();
    });
  });
  
};

$scope.removeResto = function(id){
  console.log(id);
  $http.delete('/restaurantList/' + id).success(function(response){
    $http.get('/restaurantList').success(function(response){
      if(Object.keys(response).length > 0){
        var list = response;
        for(var item = 0; item < list.length; item++){
          list[item].id = parseInt(item) + 1;
          $http.put('/restaurantList/' + list[item]._id, list[item]).success(function(response){
          });
          if(item == list.length - 1){
            refreshResto();
          }
        }
      } else {
        refreshResto();
      }
    });
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






//////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////   ACTIVITEITEN //////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////

myApp.controller('ActiviteitCtrl', ['$scope', '$http', function($scope, $http) {


  $scope.getAddress = function(campus){
    $http.get('/campus/' + campus).success(function(response){
      $scope.adres = response;
    });
  };

  $http.get('/campus').success(function(response){
    $scope.campussen = response;
  });


  var refreshActiviteit = function(){
    $http.get('/activiteitenList').success(function(response){
      console.log("I got the data I requested");
      $scope.activiteitenList = response;
      $scope.activiteit = "";
    });
  };

refreshActiviteit();

$scope.addActiviteit = function(mail) {
  console.log($scope.activiteit);
  $scope.activiteit._id = "";
  $scope.activiteit.email = mail;
  $scope.activiteit.adres = $scope.adres;
  $http.post('/activiteitenList', $scope.activiteit).success(function(response){
    console.log(response);
    refreshActiviteit();
  });
};

$scope.removeActiviteit = function(id){
  console.log(id);
  $http.delete('/activiteitenList/' + id).success(function(response){
    refreshActiviteit();
  });
};

$scope.editActiviteit = function(id) {
  console.log(id);
  $http.get('/activiteitenList/' + id).success(function(response){
    $scope.activiteit = response;
  });
};

$scope.update = function(){
  console.log($scope.activiteit._id);
  $http.put('/activiteitenList/' + $scope.activiteit._id, $scope.activiteit).success(function(response){
    refreshActiviteit();
  });
};


}]);
