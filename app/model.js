
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

Meteor.methods({
  invite: function (toId, msg) {
    if (Meteor.isServer)
      sendInvitation(this.userId, toId, msg);
  }
/*
  // just call on the client Meteor.call('enroll');
  ,enroll: function () {
    console.log('create');
    if (Meteor.isServer) {
      console.log('serve');
try {
      var id = Accounts.createUser({email:'toto'+Math.random().toString()+'@gmail.com', profile:{name:'titi', mentor:true}});
//      var id = Accounts.createUser({email:'toto'+Math.random().toString()+'@gmail.com'});
      console.log('created:'+id);
      Accounts.sendEnrollmentEmail(id);
} catch(e) {
  console.log(e);
}
      console.log("enrolled");
    }
  }
*/
});
