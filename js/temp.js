function initialize1() {

    var Pos_X = "-37.9096655";
    var Pos_Y = "144.7609761";
    if (Pos_X != "0" && Pos_Y != "0") {
        latlng = new google.maps.LatLng(-37.9096655, 144.7609761);

        var MapTypeIds = new Array();
        MapTypeIds[0] = "roadmap";
        MapTypeIds[1] = "bybird";
        var myOptions = {
                zoom: 15,
                center: latlng,
                mapTypeId: 'roadmap',
                scrollwheel: false,
                MapTypeControlOptions: MapTypeIds
            }
        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        var locationMarker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "墨尔本西南区海滨别墅-Paragon",
            draggable: false,
            icon: pin_home
        });
        locationMarker.setVisible(true);

    } else {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': ""
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var myOptions = {
                    zoom: 13,
                    center: results[0].geometry.location,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true
                };
                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                var locationMarker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: "墨尔本西南区海滨别墅-Paragon",
                    draggable: false,
                    icon: pin_home
                });
                locationMarker.setVisible(true);
            } else {
                geocoder.geocode({
                    'address': "Melbourne"
                }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var myOptions = {
                            zoom: 13,
                            center: results[0].geometry.location,
                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                            zoomControl: true
                        };
                        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                        var locationMarker = new google.maps.Marker({
                            position: results[0].geometry.location,
                            map: map,
                            title: "墨尔本西南区海滨别墅-Paragon",
                            draggable: false,
                            icon: pin_home
                        });
                        locationMarker.setVisible(true);
                    } else {
                        geocoder.geocode({
                            'address': "澳大利亚"
                        }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                var myOptions = {
                                    zoom: 13,
                                    center: results[0].geometry.location,
                                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                                    zoomControl: true
                                };
                                map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                                var locationMarker = new google.maps.Marker({
                                    position: results[0].geometry.location,
                                    map: map,
                                    title: "墨尔本西南区海滨别墅-Paragon",
                                    draggable: false,
                                    icon: pin_home
                                });
                                locationMarker.setVisible(true);
                            } else {

                                geocoder.geocode({
                                    'address': ""
                                }, function (results, status) {
                                    if (status == google.maps.GeocoderStatus.OK) {
                                        var myOptions = {
                                            zoom: 13,
                                            center: results[0].geometry.location,
                                            mapTypeId: google.maps.MapTypeId.ROADMAP,
                                            zoomControl: true
                                        };
                                        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
                                        var locationMarker = new google.maps.Marker({
                                            position: results[0].geometry.location,
                                            map: map,
                                            title: "墨尔本西南区海滨别墅-Paragon",
                                            draggable: false,
                                            icon: pin_home
                                        });
                                        locationMarker.setVisible(true);

                                    }
                                });

                            }
                        });

                    }
                });

            }
        });

    }

}