describe('ga_backgroundselector_directive', function() {

  describe('Background layer insertion', function () {
    var element, map, layer1, layer2, $rootScope, $compile, def, globalOptions;
    beforeEach(function() {

      map = new ol.Map({});
      layer1 = new ol.layer.Tile();
      layer2 = new ol.layer.Tile();

      module(function($provide) {
        $provide.value('gaLayers', {
          loadConfig: function() {
            return def.promise;
          },
          getLayer: function(id) {
            return {};
          },
          getOlLayerById: function(id) {
            return id === 'ch.swisstopo.swissimage' ? layer1 : layer2;
          },
          getLayerProperty: function(id, propertyName) {
            if (propertyName === 'label') {
              switch(id) {
                case 'ch.swisstopo.swissimage':
                  return 'bg_luftbild';
                case 'ch.swisstopo.pixelkarte-farbe':
                  return 'bg_pixel_color';
                case 'ch.swisstopo.pixelkarte-grau':
                  return 'bg_pixel_grey';
              }
            }
          }
        });
        $provide.value('gaTopic', {
          loadConfig: function() {
            return def.promise;
          },
          get: function() {
            return {
              id: 'sometopic',
              langs: [{
                value: 'somelang',
                label: 'somelang'
              }],
              backgroundLayers: [
                'ch.swisstopo.swissimage',
                'ch.swisstopo.pixelkarte-farbe',
                'ch.swisstopo.pixelkarte-grau'
              ]
            };
          }
        });
      });

      inject(function(_$rootScope_, _$compile_, $q, gaGlobalOptions) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        def = $q.defer();
        globalOptions = gaGlobalOptions;
      });

      $rootScope.map = map;
      element = angular.element(
        '<div>' +
            '<div ga-background-selector ' +
                'ga-background-selector-map="map">' +
            '</div>' +
        '</div>');
      $compile(element)($rootScope);
      def.resolve();
      $rootScope.$digest();
    });

    describe('initialization', function() {
      it('creates a toggle div', function() {
        var divToggle = element.find('.ga-bg-layer-bt');
        var div = divToggle[0];
        expect(div).not.to.be(undefined);
      });
      it('creates the correct number of layer bgselectors div', function() {
        var divsBg = element.find('.ga-bg-layer');
        if (globalOptions.dev3d) {
          expect(divsBg.length).to.equal(5);
        } else {
          // to be removed once 3d goes live
          expect(divsBg.length).to.equal(4);
        }
      });
    });

    describe('toggle activation', function() {
      it('shows and hides bgselectors div', function() {
        expect(element.find('.ga-swissimage').hasClass('ga-bg-layer')).to.be(true);
        expect(element.find('.ga-swissimage').hasClass('ga-bg-layer-0')).to.be(false);

        element.find('.ga-bg-layer-bt').click();
        $rootScope.$digest();
        expect(element.find('.ga-swissimage').hasClass('ga-bg-layer-0')).to.be(true);

        element.find('.ga-bg-layer-bt').click();
        $rootScope.$digest();
        expect(element.find('.ga-swissimage').hasClass('ga-bg-layer')).to.be(true);

        element.find('.ga-bg-layer-bt').click();
        $rootScope.$digest();
        expect(element.find('.ga-swissimage').hasClass('ga-bg-layer-0')).to.be(true);

        element.find('.ga-swissimage').click();
        $rootScope.$digest();
        expect(element.find('.ga-swissimage').hasClass('ga-bg-layer')).to.be(true);
      });
    });
  });

  describe('void layer insertion', function() {
    var element, map, layer1, layer2, $rootScope, $compile, def, globalOptions;
    beforeEach(function() {
      layer1 = new ol.layer.Tile();
      layer2 = new ol.layer.Tile();
      map = new ol.Map({});

      module(function($provide) {
        $provide.value('gaLayers', {
          loadConfig: function() {
            return def.promise;
          },
          getLayer: function(id) {
            return {};
          },
          getOlLayerById: function(id) {
            return id === 'ch.swisstopo.swissimage' ? layer1 : layer2;
          },
          getLayerProperty: function(id, propertyName) {
            if (propertyName === 'label') {
              switch(id) {
                case 'ch.swisstopo.swissimage':
                  return 'bg_luftbild';
                case 'ch.swisstopo.pixelkarte-farbe':
                  return 'bg_pixel_color';
                case 'ch.swisstopo.pixelkarte-grau':
                  return 'bg_pixel_grey';
              }
            }
          }
        });
        $provide.value('gaTopic', {
          loadConfig: function() {
            return def.promise;
          },
          get: function() {
            return {
              id: 'sometopic',
              langs: [{
                value: 'somelang',
                label: 'somelang'
              }],
              backgroundLayers: [
                'ch.swisstopo.swissimage',
                'voidLayer',
                'ch.swisstopo.pixelkarte-farbe',
                'ch.swisstopo.pixelkarte-grau'
              ]
            };
          }
        });
      });

      inject(function(_$rootScope_, _$compile_, $q, gaGlobalOptions) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        globalOptions = gaGlobalOptions;
        def = $q.defer();
      });

      $rootScope.map = map;
      element = angular.element(
        '<div>' +
            '<div ga-background-selector ' +
                'ga-background-selector-map="map">' +
            '</div>' +
        '</div>');
      $compile(element)($rootScope);
      def.resolve();
      $rootScope.$digest();
    });

    it('voidLayer is only added once', function() {
      var divsBg = element.find('.ga-bg-layer');
      if (globalOptions.dev3d) {
        expect(divsBg.length).to.equal(5);
      } else {
        // to be removed once 3d goes live
        expect(divsBg.length).to.equal(4);
      }
      expect(divsBg[1].className).to.contain('ga-voidLayer');
    });
  });
});