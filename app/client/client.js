
Meteor.startup(function () {
  // code to run on client at startup
  Session.set('limit', 8);
  Session.set('editingAddtag', null);
  Session.set('usersFilter', '');
});

Meteor.subscribe('allUserData');
Meteor.subscribe('userData');
Meteor.subscribe('tags');

/*
Meteor.autosubscribe(function() {
  Meteor.subscribe("partialUsers", Session.get("limit"));
});
*/
Meteor.autorun(function () {
  if(!Session.equals('profile', '')) {
    $('#profilePage').modal('show');  
  }
});

Meteor.autorun(function () {
  if(!Session.equals('showProfile', '')) {
    $('#showProfilePage').modal('show');  
  }
});

Handlebars.registerHelper('bio', function (bio) {
  if(bio) return new Handlebars.SafeString(bio.replace(/\n/g, '<br />'));
});

Handlebars.registerHelper('isAdmin', function (fn) {
  if(Meteor.user() && Meteor.user().admin)
    return fn(this);
  else
    return '';
});



Meteor.Router.add({
    '/': 'homePage',
    '/about': 'aboutPage',
    '/users': 'usersPage',
    '/profile/:id': function(id) {
      Session.set('profile', id);
      return 'showProfilePage';
    },
    '/profile/:id/edit': function(id) {
      Session.set('profile', id);
      return 'profilePage';
    }
});




////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);
      } else if (evt.type === "keyup" && evt.which === 13 /*||
                 evt.type === "focusout"*/) {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        evt.stopImmediatePropagation();
        evt.stopPropagation();
        evt.preventDefault();
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };
  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};


// Tags

Template.tags.tag = function () {
  return Tags.findOne(this.toString());
};

Template.tags.rendered = function () {
  $('.tag').tooltip();
};


// Users

Template.usersPage.filterTags = function ( ) {
  return Tags.find();
};

Template.usersPage.rendered = function ( ) {
  if($(".wrapper").length > 0) {
    $(".wrapper").dotdotdot();
  }
  $('.tag').tooltip();
  $('.bigtag').tooltip();
};

Template.usersPage.filtered = function () {
  if(Session.equals('usersFilter', this._id))
    return 'success';
  else
    return 'default';
};

Template.usersPage.users = function () {
  if(Session.equals('usersFilter', ''))
    return Meteor.users.find({'profile.mentor': true, validated: true});
  else
    return Meteor.users.find({'profile.mentor': true, validated: true, 'profile.tags': Session.get('usersFilter')});
};

Template.usersPage.events({
  'click .bigtag': function () {
    if(Session.equals('usersFilter', this._id))
      Session.set('usersFilter', '');
    else
      Session.set('usersFilter', this._id);
  }
});

/*
Template.users.events({
  'click #moreUsersButton': function () {
    Session.set('limit', Session.get('limit')+8);
  }
});
*/

// Potential Users

Template.potentialUsers.users = function () {
  return Meteor.users.find({'profile.mentor': true, validated: { $exists: false }});
};


// User

Template.user.events({
  'click': function () {
    Meteor.Router.to('/profile/' + this._id);
  }
});


// Welcome

Template.welcome.events({
  'click #signupButton': function () {
    Accounts._loginButtonsSession.set('dropdownVisible', true);
    Accounts._loginButtonsSession.set('inSignupFlow', true);
    Accounts._loginButtonsSession.set('inForgotPasswordFlow', false);
    // force the ui to update so that we have the approprate fields to fill in
    Meteor.flush();
  }
});

// Starred Profile

/*
Auto resize the name to fill the total width, doesnt work
Template.users.rendered = function ( ) {
  var sectionWidth = $('.fullwidth').parent().width();
  console.log(sectionWidth);
  $('.fullwidth').each(function(){
    var originalFontSize = $(this).css('font-size');
    var spanWidth = $(this).width();
    console.log("span"+spanWidth);
    console.log("origfs"+parseInt(originalFontSize));
    var newFontSize = sectionWidth * parseInt(originalFontSize) / spanWidth;
    console.log("fs "+newFontSize);
    $(this).css({"font-size" : newFontSize+"px", "line-height" : newFontSize/1.2 + "px"});
  });
};
*/

Template.starredProfile.user = function () {
  return Meteor.users.findOne({starred:true});
};

// it s a test to try to fade the starred user
var query = Meteor.users.find({starred:true});
//console.log("q",query);
var handle = query.observe({
  added: function(user) {
//    console.log('added',user);
  },
  changed: function(user) {
//    console.log('changed',user);
//    $(".sc").fadeIn();
  }
});


Template.starredProfile.rendered = function () {
// it s a test to try to fade the starred user
//  console.log('render', this);
  if(this.find("#starredWrapper")) {
  //console.log('render2');
    $("#starredWrapper").dotdotdot();
//    $(".sc").animate({left: '+50%'}, 500);
//      $(".sc").fadeIn();
//  console.log("fade");
//    if(this.alreadyfadein === undefined) {
 //     this.alreadyfadein = true;
 //     console.log('first');
 //   } else {
//      console.log('alr');
 //   }
  }
};

Template.starredProfile.events({
  'click #inviteButton': function (e) {
    e.stopImmediatePropagation();
    Session.set("invited", this._id);
    $('#inviteDialog').modal('show');
  },
  'click a, click .tag': function (e) {
    e.stopImmediatePropagation();
  },
  'click': function (e) {
    Meteor.Router.to('/profile/' + this._id);
  }
});

// Invite Dialog

Template.inviteDialog.user = function () {
  if(Session.get("invited"))
    return Meteor.users.findOne(Session.get("invited"));
};

Template.inviteDialog.events({
  'click #sendInvitation' : function () {
    var msg = document.getElementById("inviteMessage").value;
    Meteor.call('invite', Session.get("invited"), msg);
    $('#inviteDialog').modal('hide');
  }
});

// Tag Dialog

Template.tagDialog.tag = function () {
  if(Session.get("tag"))
    return Tags.findOne(Session.get("tag"));
};

Template.tagDialog.events({
  'click #saveTag' : function () {
    if(Meteor.user() && Meteor.user().admin) {
      var name = document.getElementById("tagName").value;
      var desc = document.getElementById("tagDesc").value;

      Tags.update(Session.get('tag'), { $set: {name: name, desc: desc }});

      $('#tagDialog').modal('hide');
    }
  },
  'click #deleteTag' : function () {
    if(Meteor.user() && Meteor.user().admin) {
      var tag = Tags.findOne(Session.get("tag"));
      var r = confirm("Vous voulez vraiment effacer le tag "+tag.name+" ? Ca le retirera des tous les utisateurs qui l'ont mis.");
      if(r==true) {
        var u = Meteor.users.find({'profile.tags': Session.get('tag')});
        u.forEach(function (u) {
          Meteor.users.update(u._id, {$pull: {'profile.tags': Session.get('tag')}});
        });
        Tags.remove(Session.get('tag'));
        $('#tagDialog').modal('hide');
      }
    }
  }
});

// Edit Profile Page

Template.profilePage.mentorchecked = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user && user.profile && user.profile.mentor)
    return 'checked="checked"';
  else return '';
};

Template.profilePage.modalLabel = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user === undefined) return 'Profil';
  else if(user._id == Meteor.userId()) return 'Mon profil';
  else return 'Le profil de '+user.profile.name;
};

Template.profilePage.user = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user === undefined) return undefined;
  return user;
};

Template.profilePage.rendered = function () {
  $('#profilePage').on('hidden', function () {
    Session.set('profile', '');
  });
  $('.bigtag').tooltip();
};

Template.profilePage.tagObjs = function () {
  var tags = Meteor.users.findOne(Session.get('profile')).profile.tags;
  return _.map(tags || [], function (tid) {
    return Tags.findOne(tid) || { _id: tid, name: '<deleted>', desc: 'outch the tag was deleted but still in your profile' };
  });
};

Template.profilePage.tags = function () {
  var v = Tags.find().map(function (tag) {
    return tag.name;
  });
  v = JSON.stringify(v);
  return v;
};

Template.profilePage.addingTag = function () {
  return Session.equals('editingAddtag', this._id);
};

Template.profilePage.events({
  'click #saveProfile' : function () {
    var pic = document.getElementById("profilePicture").value;
    if(pic === "")
      pic = "http://www.gravatar.com/avatar/"+hex_md5(Meteor.users.findOne(Session.get("profile")).emails[0].address);
    Meteor.users.update(Session.get("profile"), { $set: {
      "profile.name": document.getElementById("profileName").value,
      "profile.picture": pic,
      "profile.twitter": document.getElementById("profileTwitter").value,
      "profile.city": document.getElementById("profileCity").value,
      "profile.bio": document.getElementById("profileBio").value,
      "profile.mentor": ! ! document.getElementById("profileMentor").checked,
    } });
    $('#profilePage').modal('hide');
  },
  'click #setStarred' : function () {
    $('#profilePage').modal('hide');
    Meteor.users.update(Meteor.users.findOne({starred:true}), { $unset: { starred: 1 } });
    Meteor.users.update(Session.get("profile"), { $set: { starred: true } });
  },
  'click #setAdmin' : function () {
    $('#profilePage').modal('hide');
    Meteor.users.update(Session.get("profile"), { $set: { admin: true } });
  },
  'click #unsetAdmin' : function () {
    $('#profilePage').modal('hide');
    Meteor.users.update(Session.get("profile"), { $unset: { admin: 1 } });
  },
  'click #setValidated' : function () {
    $('#profilePage').modal('hide');
    Meteor.users.update(Session.get("profile"), { $set: { validated: true } });
  },
  'click #unsetValidated' : function () {
    $('#profilePage').modal('hide');
    Meteor.users.update(Session.get("profile"), { $unset: { validated: 1 } });
  },

  'click .addtag': function (evt, tmpl) {
    Session.set('editingAddtag', this._id);
    Meteor.flush(); // update DOM before focus
    activateInput(tmpl.find("#edittag-input"));
  },

  'click .remove': function (evt) {
    Meteor.users.update(Session.get('profile'), {$pull: {'profile.tags': this._id}});
  },

  'dblclick .name': function (evt, tmpl) { // start editing tag name
    var t = Tags.findOne({name:this.name});
    if(t !== undefined && Meteor.user() && Meteor.user().admin) {
      Session.set("tag", t._id);
      $('#tagDialog').modal('show');
    }
  }

});

Template.profilePage.events(okCancelEvents(
  '#edittag-input',
  {
    ok: function (value) {
      var tid = Tags.findOne({name:value});
      if(tid === undefined)
        tid = Tags.insert({name: value, creatorId: Meteor.userId});
      else
        tid = tid._id;
      Meteor.users.update(Session.get('profile'), {$addToSet: {'profile.tags': tid}});
      Session.set('editingAddtag', null);
    },
    cancel: function () {
      Session.set('editingAddtag', null);
    }
  }));

// Show Profile Page

Template.showProfilePage.user = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  return user;
};

Template.showProfilePage.events({
  'click .invite': function (e) {
    Session.set("invited", Session.get('profile'));
    $('#inviteDialog').modal('show');
  }
});
