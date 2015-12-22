var appName = 'thonglorLife';
var appLocsPath = 'json/locs.json';
var appLocs = [];
/* all types
 * 
 * Office
 * Restaurant
 * - Japan
 * - Italian
 * - Thai A La Carte
 * - Cooked to order
 * Street Food
 * - Noodle
 * - Papaya Salad
 * - Grilled Pork
 * - Meat Ball
 * Drink
 * - Coffee
 * Mall
 * Bar
 * Spa
 * Utility
 * - Drugstore
 * - Copy and Photo
 * - Beauty Clinic
 * - Convenience Store
 * Parking
 */

angular.module(appName, ['uiGmapgoogle-maps'])
.controller('mainCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {
  $scope.map = {
    center: {
      latitude: 13.734292,
      longitude: 100.582681
    },
    zoom: 18,
    bounds: {}
  };

  $scope.options = {
    scrollwheel: false
  };

  $scope.randomMarkers = []; // unused
  $scope.thonglorMarkers = [];  

  /* ================================================================ PRIVATE
  */
  
  // unused
  var createRandomMarker = function (i, bounds, idKey) {
    if (idKey == null) idKey = 'id';

    var latMin = bounds.southwest.latitude;
    var latRange = bounds.northeast.latitude - latMin;
    var lngMin = bounds.southwest.longitude;
    var lngRange = bounds.northeast.longitude - lngMin;

    var lat = latMin + (Math.random() * latRange);
    var lng = lngMin + (Math.random() * lngRange);

    var markerWindowHtml = 'Marker No. ' + i;

    var ret = {
      latitude: lat,
      longitude: lng,
      windowHtml: markerWindowHtml
    };
    ret[idKey] = i;
    
    return ret;
  };

  // unused
  var getRandomMarkersWithBounds = function (n, bounds) {
    var markers = [];
    for (var i = 0; i < n; i++) markers.push(createRandomMarker(i, $scope.map.bounds))

    return markers;
  };

  var getAllAppMarkers = function () {
    var markers = [];

    var logs = [];
    angular.forEach(appLocs, function (val, key) {
      var markerWindowHtml = '';

      // require field
      markerWindowHtml += 'Name: ' + val.name + '<br>';
      markerWindowHtml += 'Type: ' + val.type + '<br>';

      if (val.cat) markerWindowHtml += 'Cat: ' + val.cat + '<br>'; 

      var ret = {
        id: key,
        latitude: val.lat,
        longitude: val.lng,
        windowHtml: markerWindowHtml
      };

      markers.push(ret);
    }, logs);

    $log.debug('logs', logs);

    return markers;
  };

  var initMap = function () {
    // get the bounds from the map once it's loaded
    $scope.$watch(function () {
      return $scope.map.bounds;

    }, function (nv, ov) {
      // only need to regenerate once
      if (! ov.southwest && nv.southwest) {
        var markers = [];

        $log.debug('nv', nv);
        $log.debug('ov', ov);

        // markers = getRandomMarkersWithBounds(50, $scope.map.bounds);
        markers = getAllAppMarkers();

        $scope.thonglorMarkers = markers;
      }
    }, true);
  }

  var init = function () {
    $http.get(appLocsPath).then(function (res) {
      $log.log('get location data - success');
      $log.debug(res, res);

      appLocs = res.data;
      initMap();
      
    }, function (res) {

      $log.log('get location data - fail');
    });
  }

  /* ================================================================ PUBLIC
  */
 
  $scope.onClick = function(marker, eventName, model) {
    model.show = ! model.show;
  };

  /* ================================================================ INIT
  */

  init();
}]);
