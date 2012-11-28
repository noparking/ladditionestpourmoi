
Meteor.startup(function () {
  // code to run on client at startup
  Session.set('limit', 8);
  Session.set('profile', '');
  Session.set('showProfile', '');
});

Meteor.subscribe('allUserData');
Meteor.subscribe('userData');
/*
Meteor.autosubscribe(function() {
  Meteor.subscribe("partialUsers", Session.get("limit"));
});
*/
Meteor.autorun(function () {
  if(!Session.equals('profile', '')) {
    $('#profileDialog').modal('show');  
  }
});

Meteor.autorun(function () {
  if(!Session.equals('showProfile', '')) {
    $('#showProfileDialog').modal('show');  
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


// Users

Template.users.users = function () {
  return Meteor.users.find({'profile.mentor': true, validated: true});
};
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

Template.user.rendered = function () {
  if($(".wrapper").length > 0) {
    $(".wrapper").dotdotdot();
//    console.log("wrapped", this);    
  }
};

Template.user.events({
  'click': function () {
    Session.set("showProfile", this._id);
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

var query = Meteor.users.find({starred:true});
console.log("q",query);
var handle = query.observe({
  added: function(user) {
    console.log('added',user);
  },
  changed: function(user) {
    console.log('chagnged',user);
//    $(".sc").fadeIn();
  }
});


Template.starredProfile.rendered = function () {
//  console.log('render', this);
  if(this.find("#starredWrapper")) {
//  console.log('render2');
    $("#starredWrapper").dotdotdot();
//    $(".sc").animate({left: '+50%'}, 500);
      $(".sc").fadeIn();
  console.log("fade");
    if(this.alreadyfadein === undefined) {
      this.alreadyfadein = true;
 //     console.log('first');
    } else {
//      console.log('alr');
    }
  }
};

Template.starredProfile.events({
  'click #inviteButton': function (e) {
    e.stopImmediatePropagation();
    Session.set("invited", this._id);
    $('#inviteDialog').modal('show');
  },
  'click': function (e) {
    Session.set("showProfile", this._id);
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

// Edit Profile Dialog

Template.profileDialog.mentorchecked = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user && user.profile.mentor)
    return 'checked="checked"';
  else return '';
};

Template.profileDialog.modalLabel = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user === undefined) return 'Profile';
  else if(user._id == Meteor.userId()) return 'Mon profile';
  else return 'Le profile de '+user.profile.name;
};

Template.profileDialog.user = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user === undefined) return undefined;
  return user;
};

Template.profileDialog.rendered = function () {
  $('#profileDialog').on('hidden', function () {
    Session.set('profile', '');
  });
};

Template.profileDialog.events({
  'click #saveProfile' : function () {
    var pic = document.getElementById("profilePicture").value;
    if(pic === "")
      pic = "http://www.gravatar.com/avatar/"+hex_md5(Meteor.user().emails[0].address);
    Meteor.users.update(Meteor.users.findOne(Session.get("profile")), { $set: {
      "profile.name": document.getElementById("profileName").value,
      "profile.picture": pic,
      "profile.twitter": document.getElementById("profileTwitter").value,
      "profile.city": document.getElementById("profileCity").value,
      "profile.bio": document.getElementById("profileBio").value,
      "profile.mentor": ! ! document.getElementById("profileMentor").checked,
    } });
    $('#profileDialog').modal('hide');
  },
  'click #setStarred' : function () {
    $('#profileDialog').modal('hide');
    Meteor.users.update(Meteor.users.findOne({starred:true}), { $unset: { starred: 1 } });
    Meteor.users.update(Meteor.users.findOne(Session.get("profile")), { $set: { starred: true } });
  },
  'click #setAdmin' : function () {
    $('#profileDialog').modal('hide');
    Meteor.users.update(Meteor.users.findOne(Session.get("profile")), { $set: { admin: true } });
  },
  'click #unsetAdmin' : function () {
    $('#profileDialog').modal('hide');
    Meteor.users.update(Meteor.users.findOne(Session.get("profile")), { $unset: { admin: 1 } });
  },
  'click #setValidated' : function () {
    $('#profileDialog').modal('hide');
    Meteor.users.update(Meteor.users.findOne(Session.get("profile")), { $set: { validated: true } });
  },
  'click #unsetValidated' : function () {
    $('#profileDialog').modal('hide');
    Meteor.users.update(Meteor.users.findOne(Session.get("profile")), { $unset: { validated: 1 } });
  }
});

// Show Profile Dialog

Template.showProfileDialog.profile = function () {
  var user = Meteor.users.findOne(Session.get("showProfile"));
  if(user === undefined) return undefined;
  return user.profile;
};

Template.showProfileDialog.rendered = function () {
  $('#showProfileDialog').on('hidden', function () {
    Session.set('showProfile', '');
  });
};

Template.showProfileDialog.events({
  'click .invite': function (e) {
    console.log(this);
    Session.set("invited", Session.get('showProfile'));
    $('#showProfileDialog').modal('hide');
    $('#inviteDialog').modal('show');
  },
  'click .edit': function (e) {
    $('#showProfileDialog').modal('hide');
    Session.set("profile", Session.get('showProfile'));
  },
});
