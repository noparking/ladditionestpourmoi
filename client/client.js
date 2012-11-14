
Meteor.startup(function () {
  // code to run on client at startup
  Session.set("limit", 8);
  Session.set("profile", "");

  $('#profileDialog').on('hidden', function () {
    Session.set('profile', '');
  });

});

Meteor.autosubscribe(function() {
  Meteor.subscribe("partialUsers", Session.get("limit"));
});

Meteor.autorun(function () {
  if(!Session.equals('profile', '')) {
    $('#profileDialog').modal('show');  
  }
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
  $('.user').hover(function() {
      $(this).find('.show_on_hover').show();
    },
    function () {
      $(this).find('.show_on_hover').hide();
    }
  );
  $(".show_on_hover").hide();
}

Template.users.events({
  'click .invite': function (e) {
    Session.set("invited", this._id);
    $('#inviteDialog').modal('show');
  },
  'click .edit': function (e) {
    Session.set("profile", this._id);
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

Template.starredProfile.user = function () {
  return Meteor.users.findOne({'profile.mentor':true});
};

Template.starredProfile.events({
  'click #inviteButton': function () {
    Session.set("invited", this._id);
    $('#inviteDialog').modal('show');
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

// Profile Dialog

Template.profileDialog.mentorchecked = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user && user.profile.mentor)
    return 'checked="checked"';
  else return '';
};

Template.profileDialog.profile = function () {
  var user = Meteor.users.findOne(Session.get("profile"));
  if(user === undefined) return undefined;
  return user.profile;
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
