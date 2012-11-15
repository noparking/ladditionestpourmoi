
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
