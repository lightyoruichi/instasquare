// get instagram photos with a text search query and a ll (latlong)
function get_instagram_photos(options, callback) {
  
  // search foursquare for venues with our query string
  get_instagram_photos_by_foursquare_location_id(options.query, options, function(data) {      
    console.log("data is:");
    console.log(data);
    if (callback)
      callback(data ? data.data : null);
    
  });
  
  // if (Number(options.query)) {
  //   console.log("number!");
  // 
  // } else {
  //   search_foursquare_venues(options, function(data) {
  //     if (data.response.venues.length > 0) {
  //       // get the location id of the first venue in list
  //       var location_id = data.response.venues[0].id;
  //       // search instagram with the location id
  //       get_instagram_photos_by_foursquare_location_id(location_id, options, function(data) {
  //         if (callback)
  //           callback(data.data);
  //       });
  //     } else {
  //       // no venues found
  //     }
  //   });
  // }


}

// get instagram photos by a foursquare location id
function get_instagram_photos_by_foursquare_location_id(id, options, callback) {
  // get the instagram id with our foursquare id
  $.get("https://api.instagram.com/v1/locations/search?foursquare_v2_id="+id+"&client_id="+options.instagram_client_id, function(data) {

    // get the photos from instagram with our id!
    if (data.data.length > 0)
      $.get("https://api.instagram.com/v1/locations/"+data.data[0].id+"/media/recent/?client_id="+options.instagram_client_id, callback, "jsonp");
    else 
      callback(null);
      
  }, "jsonp")
}

// search foursquare for venues with a query and a ll (latlong)
function search_foursquare_venues(options, callback) {
  var params = {
    ll: options.ll,
    oauth_token: options.oath_token,
    v: "20120321"
  };
  if (options.query)
    params.options = options.query;
  if (options.categoryId)
    params.categoryId = options.categoryId;
  if (options.radius)
    params.radius = options.radius;
  if (options.limit)
    params.limit = options.limit;  
  if (options.intent)
    params.intent = options.intent;
    
  $.get("https://api.foursquare.com/v2/venues/search", params, callback, "jsonp");
}