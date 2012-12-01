
Tags = new Meteor.Collection("tags");

Meteor.users.allow({
  // TODO except admin
  insert: function () {
    return Meteor.user() && Meteor.user().emails[0].address == "acemtp@gmail.com";
  },
  update: function (userId) {
    return Meteor.user() && (Meteor.user().admin || Meteor.user().emails[0].address == "acemtp@gmail.com");
  },
  remove: function () {
    return false;
  }
});

Tags.allow({
  // TODO except admin
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
  }

  // just call on the client Meteor.call('enroll');
  ,enroll: function () {
    console.log('Invite old user');
    if (Meteor.isServer) {
      console.log('server');

      var u = oldUsers[0];
      u.email = "a"+u.email; 
      u.profile.picture = "http://www.gravatar.com/avatar/"+hex_md5(u.email);
      var id = Accounts.createUser(u);
      Accounts.sendEnrollmentEmail(id);
      console.log('created:',u);

/*
        _.each(oldUsers, function(u) {
          try {
            u.profile.picture = "http://www.gravatar.com/avatar/"+hex_md5(u.email);
            var id = Accounts.createUser(u);
            Accounts.sendEnrollmentEmail(id);
          //      var id = Accounts.createUser({email:'toto'+Math.random().toString()+'@gmail.com', profile:{name:'titi', mentor:true}});
          //      var id = Accounts.createUser({email:'toto'+Math.random().toString()+'@gmail.com'});
          //      Accounts.sendEnrollmentEmail(id);
                console.log('created:',u);
          } catch(e) {
            console.log("exception:", e);
          }
        });
*/
      console.log("enrolled");
    }
  }

});
