
Meteor.startup(function () {
  // code to run on client at startup
  Session.set('limit', 8);
  Session.set('profile', '');
  Session.set('showProfile', '');
});

Meteor.subscribe('userData');

Meteor.autosubscribe(function() {
  Meteor.subscribe("partialUsers", Session.get("limit"));
});

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
  return new Handlebars.SafeString(bio.replace(/\n/g, '<br />'));
}); 

// Users

Template.users.users = function () {
  return Meteor.users.find({_id: {$ne: Meteor.userId()}});
};

Template.users.events({
  'click #moreUsersButton': function () {
    Session.set('limit', Session.get('limit')+8);
  }
});

Template.users.rendered = function ( ) {
  $(".wrapper").dotdotdot();
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
  return Meteor.users.findOne({'profile.mentor':true});
};

Template.starredProfile.rendered = function ( ) {
  $(".starredWrapper").dotdotdot();
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

Template.profileDialog.profile = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user === undefined) return undefined;
  return user.profile;
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

Template.showProfileDialog.adminUser = function () {
  return Meteor.user() && Meteor.user().admin;
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
