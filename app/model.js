
Tags = new Meteor.Collection("tags");

Meteor.users.allow({
  insert: function () {
    return Meteor.user() && Meteor.user().emails[0].address == "acemtp@gmail.com";
  },
  update: function (userId, docs, fields, modifier) {
    return Meteor.user() && (Meteor.user().admin || Meteor.user().emails[0].address == "acemtp@gmail.com");
  },
  remove: function () {
    return false;
  }
});

Tags.allow({
  insert: function (userId, doc) {
    if(Tags.findOne({name:doc.name}) !== undefined) return false; // tag already exists
    return Meteor.user() && (Meteor.user().admin || Meteor.user().emails[0].address == "acemtp@gmail.com");
  },
  update: function () {
    return Meteor.user() && (Meteor.user().admin || Meteor.user().emails[0].address == "acemtp@gmail.com");
  },
  remove: function () {
    return Meteor.user() && (Meteor.user().admin || Meteor.user().emails[0].address == "acemtp@gmail.com");
  }
});

Meteor.methods({
  invite: function (toId, msg) {
    if (Meteor.isServer)
      sendInvitation(this.userId, toId, msg);
  },

  adminMail: function (toId, msgId) {
    if (Meteor.isServer && Meteor.user() && Meteor.user().admin)
      sendAdminMail(this.userId, toId, msgId);
  },

  m: function (id, msg) {
    if (Meteor.isServer)
      m(id, msg);
  },

});
