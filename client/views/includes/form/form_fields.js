// pick default question value, or user input if available.
var getInputValue = function(self){
    // trick to avoid blinking when updating the user profile. (instead of calling Meteor.user())
    var user = Meteor.users.findOne(Meteor.userId(), {reactive: false});
    if(user.profile && user.profile[self.name]){
        return user.profile[self.name]
    } else {
        return self.value;
    }
};
Template.form_field_datepicker.rendered = function() {
    $('#'+this.data.domid).datepicker();
};
Template.form_field_dropdown.rendered = function(){
    $('#'+this.data.domid).val(getInputValue(this.data));
};
Template.form_field_datepicker.helpers({
    'value' : function(){ return getInputValue(this); }
});
Template.form_field_text.helpers({
    'value' : function(){ return getInputValue(this); }
});
Template.form_location.helpers({
    'value' : function(){ return getInputValue(this); }
});
Template.form_geocoding.helpers({
    'value' : function(){ return getInputValue(this); }
});

Template.form_field_dropdown.helpers({
    'value' : function(){ return getInputValue(this); },
    'options': function(){
        var result = [];
        _.each(this.options, function(text, key){
            result.push({value: key, text: text});
        });
        return result;
    }
});

Template.form_profile_picture.helpers({
    'filepickerApiKey': function(){ return Meteor.filePickerKey;},
    value: function(){ return getInputValue(this); }
});

Template.form_profile_picture.events({
    'change #filepicker': function(e){
        e.preventDefault();
        Meteor.call('uploadPhoto', e.fpfile, function(err, res){
            console.log(err, res);
        })
    }
});
Template.form_profile_picture.rendered = function(){
    var fp = document.getElementById('filepicker');
    if(fp){
        filepicker.constructWidget(fp);
    }

};

 var load_gmap = function(callback){
    if(!window.gmaploaded){
        var url = "//maps.googleapis.com/maps/api/js?key="+Meteor.googleMapApiKey+"&sensor=true";
        if(callback){
            url += "&callback="+callback;
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        document.body.appendChild(script);
        window.gmaploaded = true;
    } else {
        // Not loading gmap, but calling the callback nevertheless
        if(callback && window[callback]){
            window[callback]();
        }
    }
};
var reverseGeodecode = function(latlng, callback){
    window.cb = function(){
        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({latLng : new google.maps.LatLng(latlng.lat, latlng.lng)}, function(res, status){
            if(status == google.maps.GeocoderStatus.OK) {
                var result = res[0].formatted_address, best = Infinity;
                result = res[0].formatted_address;
                _.each(res, function(t){
                    _.each(t.types, function(l){
                        if(_.contains(Meteor.GMap.favoriteGeocodingType, l)){
                            if(_.indexOf(Meteor.GMap.favoriteGeocodingType, l) < best){
                                best = _.indexOf(Meteor.GMap.favoriteGeocodingType, l);
                                result = t.formatted_address;
                            }
                        }
                    })
                });

                callback(null, result);
            } else {
                console.log(latlng, status);
                callback(true, null);
            }
        });
    };
    load_gmap('cb');
};

Template.form_location.events({
    'click .show_map': function(){
        var map;
        var center = getInputValue(this);
        var isPointing = false, marker, initPosition;

        if(!center){
            if(center = $('#location').val()){
                center = center.split(',');
                initPosition = center;
            } else{
                center = Meteor.GMap.defaultLocation;
            }
        } else {
            $('.save_change').removeClass('disabled');
            center = center.split(',');
            initPosition = center;
        }

        function updatePosition(coord){
            window.mapposition = coord;
            $('.save_change').removeClass('disabled');
        }

        function updateMarkerPosition(latlng){
            if(isPointing){
                marker.setPosition(latlng);
                updatePosition(latlng);
            } else {
                marker = new google.maps.Marker({
                    map:map,
                    draggable:true,
                    animation: google.maps.Animation.DROP,
                    position: latlng
                });
                updatePosition(latlng);

                google.maps.event.addListener(marker, 'dragend', function(){
                    updatePosition(marker.getPosition());
                });
                isPointing = true;
            }
        }

        // Initialize Google Map
        function initialize() {
            var mapOptions = {
                    center: new google.maps.LatLng(center[0], center[1]),
                    zoom: Meteor.GMap.defaultZoomLevel,
                    disableDefaultUI: true,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    minZoom: Meteor.GMap.minZoomLevel,
                    maxZoom: Meteor.GMap.maxZoomLevel
                };
            map = new google.maps.Map(document.getElementById("googlemap"),
                mapOptions);

            google.maps.event.addListener(map, 'click', function(event){
                updateMarkerPosition(event.latLng);
            });
            // If we already have a position, update the map directly.
            if(initPosition){
                updateMarkerPosition(new google.maps.LatLng(center[0], center[1]));
            }
        }

        // Make sure to only initialize once, 1. once gmap is loaded 2. once the modal is fully shown.
        window.gmapcallback = function(){
            $('#map').on('shown',function(){
                if(!window.maploaded){
                    initialize();
                    window.maploaded = true;
                }
            })
        };

        // Load the gmap script, call previous function on success.
        load_gmap('gmapcallback');
    },
    'click .save_change': function(e){
        e.preventDefault();

        $('#location').val(window.mapposition.lat()+','+window.mapposition.lng());
        $('#map').modal('hide');

        // Get a humanly readable location

        reverseGeodecode({lat: window.mapposition.lat(), lng: window.mapposition.lng()}, function(err, res){
            if(err){
                Errors.notification("Oops, we were unable to determine your location");
            } else {
                $('#geocoding_target').html(res);
                $('#geocoding').val(res);
            }
        });

        return true;
    },
    'click .geolocalisation': function(e){
        e.preventDefault();
        function success(location){
            $('#location').val(location.coords.latitude+","+location.coords.longitude);
            // Get a humanly readable location
            if($('#geocoding_target')){
                reverseGeodecode({lat: location.coords.latitude, lng: location.coords.longitude}, function(err, res){
                    if(err){
                        console.log(err);
                        Errors.notification("Oops, we were unable to determine your location");
                    } else {
                        $('#geocoding_target').html(res);
                        $('#geocoding').val(res);
                    }
                });
            }

            Errors.notification('Got it!', 'center');
        }

        function failure(err){
            Errors.notification('Sorry, we can not determine your position automatically', 'center')
        }

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success, failure,{
                timeout: 2000
            });
        }
    }
});
