
var Instasquare = {
  // get instagram photos with either location_id or a text query
  // @param options = {
  //   query: "search string", // required if not location id is used
  //   location_id: "foursquare location id", // required if not query is used
  //   ll: "59.23232,18.4223" // required 
  // }
  // @param callback the callback to run when photos are loaded or when there's an error
  get_instagram_photos: function(options, callback) {
    var self = this;
    
    // get instagrams from a specific foursquare location
    if (options.location_id) {
      this.get_instagram_photos_by_foursquare_location_id(options.location_id, options, function(data) {      
        if (callback)
          callback(data ? data.data : null);
      });
    } else {
      // otherwise we search foursquare with a text query and coordinates and use the first we find in the list
      this.search_foursquare_venues(options, function(data) {
        if (data.response.venues.length > 0) {
          // get the location id of the first venue in list
          var location_id = data.response.venues[0].id;
          // search instagram with the location id
          self.get_instagram_photos_by_foursquare_location_id(location_id, options, function(data) {
            if (callback)
              callback(data.data);
          });
        } else {
          // no venues found
          if (callback)
            callback(null);
        }
      });
    }

  },

  // get instagram photos by a foursquare location id
  get_instagram_photos_by_foursquare_location_id: function(id, options, callback) {
    // get the instagram id with our foursquare id
    $.get("https://api.instagram.com/v1/locations/search?foursquare_v2_id="+id+"&client_id="+options.instagram_client_id, function(data) {
      // get the photos from instagram with our id!
      if (data.data.length > 0)
        $.get("https://api.instagram.com/v1/locations/"+data.data[0].id+"/media/recent/?client_id="+options.instagram_client_id, callback, "jsonp");
      else 
        callback(null); 
    }, "jsonp")
  },

  // search foursquare for venues with a query and a ll (latlong)
  search_foursquare_venues: function(options, callback) {
    // the required params
    var params = {
      ll: options.ll,
      oauth_token: options.oath_token,
      v: "20120321"
    };
    // set optional params to the foursquare api request
    if (options.query)
      params.query = options.query;
    if (options.categoryId)
      params.categoryId = options.categoryId;
    if (options.radius)
      params.radius = options.radius;
    if (options.limit)
      params.limit = options.limit;  
    if (options.intent)
      params.intent = options.intent;
      
    // console.log("params:");
    // console.log(params);
    
    $.get("https://api.foursquare.com/v2/venues/search", params, callback, "jsonp");
  }

};