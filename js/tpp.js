    var map = L.map('map', {
      center: [39.44 , -8.12],
      zoom: 7,
      zoomControl: false
    });

    var zoom = L.control.zoom({
      position: 'bottomleft',
      zoomInTitle:"Zoom +",
      zoomOutTitle:"Zoom -"
    }).addTo(map);

    // L.tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      maxZoom: 18,
      // attribution: '<a href="https://openstreetmap.se/" target="_blank">OSM Sweden</a> | &copy; <a href="https://www.openstreetmap.org/copyright"  target="_blank">OpenStreetMap</a>'
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    controlrouting = L.Routing.control({
      timeout: 2500,
      language: 'pt',
      collapsible: true,
      routeWhileDragging: true,
      geocoder: L.Control.Geocoder.nominatim({
        noResultsMessage: 'Nenhum resultado encontrado.',
        serviceUrl: 'https://search.tpp.pt/',
        geocodingQueryParams: {
          countrycodes: 'pt',
          limit: 10
        },
      }),
      router: L.Routing.valhalla({
        reverseWaypoints: false,
        showAlternatives: true,
        routeLine: function (route, options) { return L.Routing.valhallaLine(route, options); },
        directions_options: {
          language: 'pt-PT',
          narrative: true
        },
        costing: 'multimodal',
        date_time: {
          type: 0
          //value: "2018-03-22T06:05"
        },
        costing_options: {
          transit: {
            use_bus: 0.4,
            use_rail: 0.6,
            use_transfers: 0.5,
            turn_penalty_factor: 0,
            transit_transfer_max_distance: 1000,
            transit_start_end_max_distance: 3000
          },
          pedestrian:{
            use_ferry: 0.5,
            turn_penalty_factor: 10
          }
        }
      }),
      formatter: new L.Routing.valhallaFormatter(),
      /*waypoints: [
        L.latLng(38.76779355, -9.098854306),
        L.latLng(40.208912, -8.432007)
      ],*/
      waypointNameFallback: function(latLng) {
        function zeroPad(n) {
          n = Math.round(n);
          return n < 10 ? '0' + n : n;
        }
        function sexagesimal(p, pos, neg) {
          var n = Math.abs(p),
          degs = Math.floor(n),
          mins = (n - degs) * 60,
          secs = (mins - Math.floor(mins)) * 60,
          frac = Math.round((secs - Math.floor(secs)) * 100);
          return (n >= 0 ? pos : neg) + degs + '°' +
          zeroPad(mins) + '\'' +
          zeroPad(secs) + '.' + zeroPad(frac) + '"';
        }
        return sexagesimal(latLng.lat, 'N', 'S') + ' ' + sexagesimal(latLng.lng, 'E', 'W');
      }
    })
    .addTo(map);

    function createButton(label, container) {
      var btn = L.DomUtil.create('button', '', container);
      btn.setAttribute('type', 'button');
      btn.setAttribute('class', 'start-dest-btn btn-primary');
      btn.innerHTML = label;
      return btn;
    };

    var clickCount = 0;

    map.on('click', function(e) {
      clickCount += 1;
      if (clickCount <= 1) {
        setTimeout(function() {
          if (clickCount <= 1) {
            var container = L.DomUtil.create('div');
            container.setAttribute('class', 'start-dest-choice');
            startBtn = createButton('&nbsp;Marcar partida aqui&nbsp;', container);
            destBtn = createButton('Marcar chegada aqui', container);

            L.popup()
            .setContent(container)
            .setLatLng(e.latlng)
            .openOn(map);

            L.DomEvent.on(startBtn, 'click', function() {
              controlrouting.spliceWaypoints(0, 1, e.latlng);
              map.closePopup();
            });

            L.DomEvent.on(destBtn, 'click', function() {
              controlrouting.spliceWaypoints(controlrouting.getWaypoints().length - 1, 1, e.latlng);
              map.closePopup();
            });
          }
          clickCount = 0;
        }, 500);
      }
    });

    var geocoder = L.Control.Geocoder.nominatim({
      serviceUrl: 'https://search.tpp.pt/',
      language: 'pt',
      geocodingQueryParams: {
        countrycodes: 'pt',
        limit: 5
      }
    }),
    controlgeo = L.Control.geocoder({
      defaultMarkGeocode: true,
      showResultIcons: true,
      position: 'topleft',
      placeholder: 'Pesquisar local...',
      errorMessage: 'Nenhum resultado encontrado.',
      routeWhileDragging: true,
      geocoder: geocoder
    })
    .on('markgeocode', function(e) {
        var bbox = e.geocode.bbox;
        var poly = L.polygon([
             bbox.getSouthEast(),
             bbox.getNorthEast(),
             bbox.getNorthWest(),
             bbox.getSouthWest()
        ]).addTo(map);
        map.fitBounds(poly.getBounds());
    })
    .addTo(map);
