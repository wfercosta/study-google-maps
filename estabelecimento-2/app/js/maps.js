(function(app, $, $maps){

    'use strict';

    var BuscaEstabelecimentos = function ($maps, geo) {

        var _map = null;
        var _marker = null;
        var _autoComplete = null;
        var _markers = [];
        var _onResultCallback = function (err, data) {
            
        };

        var _default = {
            center: { lat: -34.397, lng: 150.644},
            zoom: 14,
            streetViewControl: false,
            mapTypeId: $maps.MapTypeId.ROADMAP,
            panControl:true,
            panControlOptions: {
                position:$maps.ControlPosition.RIGHT_TOP
            },
            zoomControl:true,
            zoomControlOptions: {
                position:$maps.ControlPosition.RIGHT_TOP
            }
        };

        var _init = function () {
            _setInitialUserLocation();


        };

        var _setSearchBoxAutoCompleteConfig = function () {

            var circle = new $maps.Circle({
                center: _marker.getPosition(),
                radius: (8/6371)
            });

            var options = {
                types: ['geocode'],
                componentRestrictions: {country: 'br'}
            };

            _autoComplete = new $maps.places.Autocomplete(document.getElementById("searchBox"), options);

            //                _autoComplete.setBounds(circle.getBounds());

            $maps.event.addListener(_autoComplete, 'place_changed', function() {

                var place = _autoComplete.getPlace();

                if (!place.geometry) {
                    return;   
                }

                var loc = place.geometry.location;

                _setMarker(_marker, {lat:loc.lat(), lng:loc.lng()});
                _findPlacesArroundCurrentLocation();

            });

        };

        var _setInitialUserLocation = function() {
            var _options = $.extend({}, _default);

            geo.getLocation(function(err, position) {
                if (position) {
                    $.extend(_options.center, position); 
                }
                _map = new $maps.Map(document.getElementById('map-canvas'), _options);

                _map.controls[$maps.ControlPosition.LEFT_TOP ].push(document.getElementById('map-options'));
                $('#map-options').removeClass('hidden');

                _marker = _setMarker(null, _options.center);
                _setSearchBoxAutoCompleteConfig();
            });
        };

        var _setMarker = function (marker, position, label) {

            var m = marker;

            if (_map) {
                if (!m) {

                    var l  = label || "Você está aqui";

                    m = new $maps.Marker({
                        map: _map,
                        position: new $maps.LatLng(
                            position.lat,
                            position.lng
                        ),
                        title: l
                    });

                    console.log("Criação de marker(" + l + "): " + JSON.stringify(position)); 

                } else {

                    m.setPosition(
                        new $maps.LatLng(
                            position.lat,
                            position.lng
                        )
                    );

                    console.log("Atualização de localização de marker existente(" + m.getTitle() + "): " + JSON.stringify(position)); 

                    _map.panTo(m.getPosition());

                    if (label){
                        m.setTitle( label );
                    }
                }
            }

            return m;
        };

        var _findPlacesArroundCurrentLocation = function () {

            var url = "http://localhost:3000/estabelecimento-api/estabelecimentos?";

            $.each(_markers, function(i, item) {
                item.map(null);
            });

            _markers.splice(0, _markers.length);

            $.getJSON(url, {
                limit:10,
                lng:_marker.getPosition().lng(),
                lat:_marker.getPosition().lat(),
                distance:10
            }).done(function(data){
                var rdata = data;
                
                $.each(data, function(i, item){
                    console.log("Find Places(" + i + "): " + JSON.stringify(item)); 
                    _markers.push(_setMarker(null, {lng:item.loc[0], lat: item.loc[1]}, "Rede de Benefícios"));    
                });
                
                if (_onResultCallback) {
                    _onResultCallback(null, rdata);
                }
            });

        };
        
        
        var _setAdvancedFilter = function (filter) {
          console.log('Advanced Filter Update: ' + JSON.stringify(filter));  
        };
        
        var _update = function () {
          console.log('update fired');  
        };
        
        var _callback = function (callback) {
            _onResultCallback = callback || _onResultCallback; 
        };

        return {
            init: _init,
            setAdvancedFilter: _setAdvancedFilter,
            update: _update,
            callback: _callback
        };

    };

    var UserGeoLocation = function () {

        var _getLocation = function (callback) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    _onSucess(position, callback);
                }, function(error){
                    _onError(error,callback);
                });
            }
        };

        var _onSucess = function (postition, callback) {
            var _current = { 
                lat: postition.coords.latitude, 
                lng: postition.coords.longitude
            };   
            callback(null, _current);
        };

        var _onError = function (error, callback) {
            console.log("Erro ao obter o geo location do usuário: " + JSON.stringify(error));
            callback(error, null);
        };

        return {
            getLocation: _getLocation
        };
    };

    app.busca = new BuscaEstabelecimentos($maps, new UserGeoLocation());
    app.busca.init();


    var FormularioFiltroPesquisa = function ($busca) {

        var _init = function () {

            if ($busca) {
                $busca.callback(_renderData);
            }
            

            $('.btn-filtro').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                _toggle();
            });

            $('.btn-aplicar').click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                var filtro = {
                   segmento: 0,
                   distancia: 0,
                   produtos: []
                };
                
                
                filtro.distancia = $( "#slider-distance" ).slider( "value" );
                filtro.segmento = $('#segmento').val();
                filtro.produtos.splice(0, filtro.produtos.length);
                $('input[name="produto"]:checked').each(function() {
                    filtro.produtos.push($(this).val());
                });
                
            });

        };

        var _renderData = function(err, data) {
            
            var $resultado = $('.pesquisa-resultado');
            $resultado.empty();
            
            if (data) {   
                if (data.length > 0) {
                    
                    $.each(data, function(i, item) {
                        
                        var ocorrencia = ""
                            + "<div class='resultado-ocorrencia'>"
                            + "<span><b>" + item.nome + "</b></span>"
                            + "<br /><span>" + item.endereco + "</span>"
                            + "</div>";
                        
                        $resultado.append(ocorrencia);
                        
                    });
                } else {
                    $resultado.append($('span').text('Não há estabelecimentos credenciados nesta área'));
                }
            }
            
            _close();
            
        };

        var _isHidden = function () {
            return $('.pesquisa-filtro').hasClass('hidden');
        };

        var _close = function() {
            $('.pesquisa-filtro').addClass('hidden');
            $('.pesquisa-resultado').removeClass('hidden');
        };

        var _open = function () {
            $('.pesquisa-filtro').removeClass('hidden');
            $('.pesquisa-resultado').addClass('hidden');
        };

        var _toggle = function () {
            if (_isHidden()) {
                _open();
            } else {
                _close();
            }
        };

        return {
            init: _init
        };


    };

    app.filtro = new FormularioFiltroPesquisa(app.busca);
    app.filtro.init();

})(window.app = window.app || {}, jQuery, google.maps);   