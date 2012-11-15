
Meteor.methods({
  invite: function (toId, msg) {
    if (Meteor.isServer)
      sendInvitation(this.userId, toId, msg);
  }
});

Meteor.users.allow({
  // TODO except admin
  insert: function () {
    return Meteor.user() && Meteor.user().emails[0].address == "acemtp@gmail.com";
  },
  update: function () {
    return Meteor.user() && (Meteor.user().admin || Meteor.user().emails[0].address == "acemtp@gmail.com");
  },
  remove: function () {
    return false;
  }
});
