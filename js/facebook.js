// Wrap FB.api with a Deferred
fbWrapper = {

    api: function(url) {
        var deferred = $.Deferred();
        try {
           // alert('calling fb api');
            FB.api(url, function (response) {
                deferred.resolve(response);
            });
        } catch (e) {
            //alert("fail facebook call")
            deferred.fail();
        }
      //  alert(deferred);
        return deferred;
    }

}
