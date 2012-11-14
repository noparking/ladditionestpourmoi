
Meteor.methods({

  invite: function (toId, msg) {
    if (Meteor.isServer)
      sendInvitation(this.userId, toId, msg);
  }
});

Meteor.users.allow({
  // TODO except admin
  insert: function () {
    return false;
  },
  update: function () {
    return Meteor.user() && Meteor.user().admin;
  },
  remove: function () {
    return false;
  }
});

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};
