window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

window.onerror = function(message, url, lineNumber) {
    console.log("Error: " + message + " in " + url + " at line " + lineNumber);
    //alert("Error: " + message + " in " + url + " at line " + lineNumber);
}

var fb = new MobileApp();

fb.spinner = $("#spinner");
fb.spinner.hide();

fb.slider = new PageSlider($('#container'));

fb.MobileRouter = Backbone.Router.extend({

    routes: {
        "":                         "welcome",
        "me":                       "me",
        "menu":                     "menu",
        "me/friends":               "myfriends",
        "person/:id":               "person",
        "person/:id/friends":       "friends",
        "person/:id/mutualfriends": "mutualfriends",
        "me/feed":                  "myfeed",
        "person/:id/feed":          "feed",
        "revoke":                   "revoke",
        "post":                     "post",
        "postui":                   "postui"
    },

    welcome: function () {
   // alert("welcome");
        // Reset cached views
        fb.myView = null;
        fb.myFriendsView = null;
        var view = new fb.views.Welcome();
        fb.slider.slidePageFrom(view.$el, "left");
    },

    menu: function () {
    //alert("menu");
        fb.slider.slidePageFrom(new fb.views.Menu().$el, "left");
        fb.slider.resetHistory();
    },

    me: function () {
   // alert("me()");
        var self = this;
        if (fb.myView) {
            fb.slider.slidePage(fb.myView.$el);
            return;
        }
        fb.myView = new fb.views.Person({template: fb.templateLoader.get('person')});
        var slide = fb.slider.slidePage(fb.myView.$el).done(function(){
            fb.spinner.show();
        });
        var call = fbWrapper.api("/me");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                fb.myView.model = callResp;
                fb.myView.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.hide();
            });
    },

    person: function (id) {
    //alert("person");
        var self = this;
        var view = new fb.views.Person({template: fb.templateLoader.get('person')});
        var slide = fb.slider.slidePage(view.$el).done(function(){
            fb.spinner.show();
        });
        var call = fbWrapper.api("/" + id);
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.hide();
            });
    },

    myfriends: function () {
   // alert("myfriends");
        var self = this;
        if (fb.myFriendsView) {
            fb.slider.slidePage(fb.myFriendsView.$el);
            return;
        }
        fb.myFriendsView = new fb.views.Friends({template: fb.templateLoader.get('friends')});
        var slide = fb.slider.slidePage(fb.myFriendsView.$el).done(function() {
            fb.spinner.show();
        });
        var call = fbWrapper.api("/me/friends?limit=100");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                fb.myFriendsView.model = callResp.data;
                fb.myFriendsView.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.hide();
            });
    },

    friends: function (id) {
    //alert("friends");
        var self = this;
        var view = new fb.views.Friends({template: fb.templateLoader.get('friends')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.show();
        });
        var call = fbWrapper.api("/" + id + "/friends?limit=100");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.hide();
            });
    },

    mutualfriends: function (id) {
    //alert("mutual");
        var self = this;
        var view = new fb.views.Friends({template: fb.templateLoader.get('friends')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.show();
        });
        var call = fbWrapper.api("/" + id + "/mutualfriends?limit=100");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.hide();
            });
    },

    myfeed: function (id) {
    //alert("myfeed");
        var self = this;
        var view = new fb.views.Feed({template: fb.templateLoader.get('feed')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.show();
        });
        var call = fbWrapper.api("/me/feed?limit=20");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.hide();
            });
    },

    feed: function (id) {
    //alert("feed");
        var self = this;
        var view = new fb.views.Feed({template: fb.templateLoader.get('feed')});
        var slide = fb.slider.slidePage(view.$el).done(function() {
            fb.spinner.show();
        });
        var call = fbWrapper.api("/" + id + "/feed?limit=20");
        $.when(slide, call)
            .done(function(slideResp, callResp) {
                view.model = callResp.data;
                view.render();
            })
            .fail(function() {
                self.showErrorPage();
            })
            .always(function() {
                fb.spinner.hide();
            });
    },

    post: function () {
        fb.slider.slidePage(new fb.views.Post({template: fb.templateLoader.get("post")}).$el);
    },

    postui: function () {
        fb.slider.slidePage(new fb.views.PostUI({template: fb.templateLoader.get("postui")}).$el);
    },

    revoke: function () {
        fb.slider.slidePage(new fb.views.Revoke({template: fb.templateLoader.get("revoke")}).$el);
    },

    showErrorPage: function () {
        fb.slider.slidePage(new fb.views.Error().$el);
    }

});

$(document).on('ready', function () {

    fb.templateLoader.load(['menu', 'welcome', 'login', 'person', 'friends', 'feed', 'post', 'postui', 'error', 'revoke'], function () {
        fb.router = new fb.MobileRouter();
        Backbone.history.start();
        FB.init({ appId: "480506615360650", nativeInterface: CDV.FB, useCachedDialogs: false, status: true });
         
       
    });
 
  
   FB.Event.subscribe('auth.authResponseChange', function(session) {
   // alert("status auth.authResponseChange change " );
        if (session.status === 'connected') {
        //alert("status auth.authResponseChange connected");
            FB.api('/me', function (response) {
                fb.user = response; // Store the newly authenticated FB user
            });
            fb.slider.removeCurrentPage();
            fb.router.navigate("menu", {trigger: true});
        } else {
        //alert("status auth.authResponseChange null");
            fb.user = null; // Reset current FB user
            fb.router.navigate("", {trigger: true});
        }
    });
   
   

});

$(document).on('click', '.button.back', function() {
    window.history.back();
    return false;
});

$(document).on('click', '.logout', function () {
    FB.logout();
    return false;
});

$(document).on('login', function () {
  //alert("login c11111111licked");
  
   FB.login(null,{scope: 'email'});
     //window.location.reload();
     // alert("login1 done");
    return false;
});

$(document).on('permissions_revoked', function () {
    // Reset cached views
    fb.myView = null;
    fb.myFriendsView = null;
    return false;
});
