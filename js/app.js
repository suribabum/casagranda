/**
 * Created by DAY on 19-06-2015.
 */
var casagrandaImages = [];
var app = angular.module('myApp', ['ui.bootstrap', 'ngAnimate', 'ngRoute', 'bootstrapLightbox']);
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            templateUrl:'pages/home.html',
            controller:'homeController'
        })
		.when('/Contact', {
            templateUrl:'pages/Contact.html',
            controller:'contactController'
        })
        /*.when('/home', {
            templateUrl:'pages/home.html',
            controller:'homeController'
        })*/
        .otherwise({
            redirectTo:'/'
        });
    //$locationProvider.html5Mode(false);
}]);

app.controller('homeController', ['$scope', '$modal', '$sce', '$modalStack', '$http', '$location', '$route',  function($scope, $modal, $sce, $modalStack, $http, $location, $route,  selectedItem){
    console.log('*homeController*');
    $scope.isSacvCollapsed = true;
    $scope.isKohCollapsed = true;
    $scope.toggleIconSrc = 'images/pluse.png';
    $scope.toggleKohIconSrc = 'images/pluse.png';
    $scope.animationsEnabled = true;
    $scope.showIframe = false;
    $scope.testmonialsInterval = 6000;
    $scope.slideToggle = true;
    $scope.mainBgInterval = 6000;
    $scope.casagrandaImages = [];

    $scope.testimonials = [
        {
            content:'I am very happy with Scavolini kitchens and their service.',
            author:'Mr. Gopichand Actor'
        },
        {
            content:'Casa granda is the best one stop solution for bathrooms and kitchens.',
            author:'Mr. Kumar Architect'
        },
        {
            content:'Amazing showroom and products, would recommend to all.',
            author:'Mr. Hari Businessman'
        }
    ];


    $http.get('data/carouselCollection.json').success(function(response){
        $scope.casagrandaImages = response.data;
        casagrandaImages = response.data;

    });

    $scope.slideToggleSrc = "images/close.png";

    $scope.slideDock = function($event){
        $event.preventDefault();
        $scope.slideToggle = !$scope.slideToggle;
        $scope.slideToggleSrc = $scope.slideToggle ? "images/close.png" : "images/open-arrow.png" ;
    };

    $scope.toggleScavMenu = function($event){
        $event.preventDefault();
        $scope.isSacvCollapsed = !$scope.isSacvCollapsed;
        $scope.toggleIconSrc = $scope.isSacvCollapsed ? 'images/pluse.png' : 'images/miniz.png' ;
    };
    $scope.toggleKohlerMenu = function($event){
        $event.preventDefault();
        $scope.isKohCollapsed = !$scope.isKohCollapsed;
        $scope.toggleKohIconSrc = $scope.isKohCollapsed ? 'images/pluse.png' : 'images/miniz.png' ;
    };

    $scope.switchToPage = function($event, size, controllerName){
        $event.preventDefault();
        $scope.templateUrl = angular.element($event.target).attr('href');

        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: $scope.templateUrl,
            controller: controllerName,
            size: size
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });

    };

    $scope.loadIframe = function($event, url){
        $event.preventDefault();
        $scope.showIframe = true;
        $scope.selectedSrc = $sce.trustAsResourceUrl(url);
        $scope.slideToggle = false;
        $scope.slideToggleSrc = $scope.slideToggle ? "images/close.png" : "images/open-arrow.png" ;
        $scope.$on('$locationChangeSuccess', function (event) {
            console.log("*route Triggered*");
        });
        /*if($location.path().indexOf('home') > 0){

            if($scope.showIframe == true){
                $location.path('/home');
                $route.reload();
            }

        }*/
    };

    $scope.closeModalPopup = function(){
       // console.log($scope.modalInstance);
        
    };

}]);
// app.controller('contactController', ['$scope', '$modal', '$sce', '$modalStack', '$http', '$location', '$route',  function($scope, $modal, $sce, $modalStack, $http, $location, $route,  selectedItem){
	
// }]);

app.controller('contactController', ['$scope',  function($scope){
   
        
    
}]);

app.animation('.left_panel', ['$animateCss', function($animateCss) {
    return {
        addClass: function(element, className, doneFn) {

           if (className == 'collapsed') {
               console.log("*AddClass-expanded*")
            }

            doneFn();
        },
        removeClass: function(element, className, doneFn) {
            if (className == 'expanded') {
                angular.element(element).children('.innerLeftPanel').fadeOut('2000', 'linear', function(){});
                angular.element(element).children('.logoWrapper').fadeOut('2000', 'linear', function(){});
            }
            if(className == 'collapsed'){
                angular.element(element).children('.innerLeftPanel').fadeIn('1600', 'linear', function(){
                    angular.element(element).children('.logoWrapper').fadeIn('2000', 'linear', function(){});
                });
            }
            doneFn();
        }
    };
}]);
app.controller('aboutUsController', ['$scope', '$modalInstance',  function($scope, $modalInstance){
    $scope.closeModalPopup = function(){
        $modalInstance.dismiss('cancel');
    }
}]);
app.controller('contactUsController', ['$scope', '$modalInstance', '$http', '$timeout',  function($scope, $modalInstance, $http, $timeout){


    $http.get('data/locations/locations.json').success(function(response){
        $scope.locationsMap = response.data.locations;

    });

    /*Google Map Code Starts here*/

    $timeout(function(){


    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        // center: new google.maps.LatLng(-33.92, 151.25),
        center: new google.maps.LatLng(17.3700, 78.4800),
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });


    var infowindow = new google.maps.InfoWindow();

    var marker, i;

    angular.forEach($scope.locationsMap, function(location, index){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(location.latitude, location.longitude),
            map: map
        });


        google.maps.event.addListener(marker, 'click', (function(marker, index) {
            return function() {
                infowindow.setContent(location.city, location.state);
                infowindow.open(map, marker);
            }
        })(marker, index));

    });

    }, 1000);

    $scope.submit = function(){
        
        var  dataObj= $("#myform").serialize();

        $http({
          method: "POST",
          url: "sendmail.php",
          data: dataObj,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).
        success(function(response) {
			if(response == 1){
				alert("Thank you for the inquiry we will get back to you as early as we can.");
				$scope.user = {
					"name":null,
					"email":null,
					"phoneNo":null,
					"msg":null
				};
			}
        });
        
    }

    /*Google Map Code Ends here*/
    $scope.closeModalPopup = function(){
        $modalInstance.dismiss('cancel');
    }
}]);
app.controller('galleryController', ['$scope', '$modalInstance', '$modal', '$http', 'Lightbox',  function($scope, $modalInstance, $modal, $http, Lightbox){

    $scope.galleryContainer = [];
    ///angular.element('#gallery a').lightBox();

   $http.get('data/gallery/gallery.json').success(function(response){
   // $scope.galleryContainer = response.data;
    $scope.showroomDisplays = response.showroomDisplays;
    $scope.clientInstallations = response.clientInstallations;

});
$scope.openLightboxModal = function (index, gallery) {
        console.log("gallery::", gallery);
        Lightbox.openModal(gallery, index);
};

    $scope.closeModalPopup = function($event){
        $modalInstance.dismiss('cancel');
    }

}]);
app.controller('galleryThumbnailController', ['$scope', '$modalInstance', 'sendThumbnailsData', function($scope, $modalInstance, sendThumbnailsData){

    $scope.selectedSrc = sendThumbnailsData.selectedSrc.src;
    $scope.selectedTitle = sendThumbnailsData.selectedSrc.title;
    $scope.closeModalPopup = function(){
        $modalInstance.dismiss('cancel');
    }
}]);
app.controller('locationController', ['$scope', '$modal', '$modalInstance', '$http',  function($scope, $modal, $modalInstance, $http){
    $scope.locations = [];
    $scope.animationsEnabled = true;

    $http.get('data/locations/locations.json').success(function(response){
        $scope.locations = response.data.locations;

    });

    $scope.showContactForm = function($event){
        $event.preventDefault();
        var modalInstance = $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'pages/contactUs.html',
            controller: 'contactUsController',
            size: 'lg'
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.stopLocationPropagation = function($event){
        $event.stopPropagation();
    };

    $scope.closeModalPopup = function(){
        $modalInstance.dismiss('cancel');
    }

}]);
app.controller('lightboxController', ['$scope', function($scope){

}]);
