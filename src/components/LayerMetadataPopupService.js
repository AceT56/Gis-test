(function() {
  goog.provide('ga_layer_metadata_popup_service');

  goog.require('ga_map_service');
  goog.require('ga_popup');

  var module = angular.module('ga_layer_metadata_popup_service', [
    'ga_map_service',
    'ga_popup',
    'pascalprecht.translate'
  ]);

  module.provider('gaLayerMetadataPopup', function() {
    this.$get = function($document, $translate, gaPopup, gaLayers) {
          return function(bodid) {
            var waitClass = 'ga-metadata-popup-wait';
            var bodyEl = angular.element($document[0].body);
            bodyEl.addClass(waitClass);
            gaLayers.getMetaDataOfLayer(bodid)
            .success(function(data) {
              bodyEl.removeClass(waitClass);
              gaPopup.create({
                title: $translate('metadata_window_title'),
                content: data,
                className: 'ga-tooltip-metadata',
                x: 400,
                y: 200,
                showPrint: true
              }).open();
            })
            .error(function() {
              bodyEl.removeClass(waitClass);
              //FIXME: better error handling
              var msg = 'Could not retrieve information for ' + bodid;
              alert(msg);
            });
          };
    };
  });
})();
