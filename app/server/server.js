
Meteor.startup(function () {
  // code to run on server at startup
  //process.env.MAIL_URL = 'smtp://postmaster%40ladditionestpourmoi.mailgun.org:4uqczccgs389@smtp.mailgun.org:587';
});
/*
Meteor.publish('partialUsers', function(limit) {
  return Meteor.users.find({}, {limit: limit});
});
*/
Meteor.publish("userData", function () {
  return Meteor.users.find({_id: this.userId}, {fields: {admin: 1, starred: 1, profile: 1, emails: 1, validated: 1}});
});

Meteor.publish("allUserData", function () {
  if(this.userId && Meteor.users.findOne(this.userId).admin)
    return Meteor.users.find({}, {fields: {emails:1, admin: 1, starred: 1, profile: 1, validated: 1}});
  else
    return Meteor.users.find({'profile.mentor': true}, {fields: {admin: 1, starred: 1, profile: 1, validated: 1}});
//  return Meteor.users.find({'profile.mentor': true/*, 'emails[0].verified': true*/, 'validated': true}, {fields: {admin: 1, starred: 1, profile: 1, validated: 1}});
});

Meteor.publish("tags", function () {
  return Tags.find();
});


Accounts.config({sendVerificationEmail: true});

Accounts.validateNewUser(function(user) {
  // We still want the default hook's 'profile' behavior.
  console.log(user);
  m(user._id, 'created profile');
  return true;
});

var contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.facebook && user.services.facebook.email)
    return user.services.facebook.email;
  return null;
};


var sendInvitation = function (fromId, toId, msg) {
  var from = Meteor.users.findOne(fromId);
  var to = Meteor.users.findOne(toId);
  var fromEmail = contactEmail(from);
  var toEmail = contactEmail(to);

  var txt =
    "Bonjour "+to.profile.name+",\n\n"+
    "Vous êtes inscrit à L'addition est pour moi et "+from.profile.name+" vient juste de vous inviter au restaurant !\n\n"+
    "Voici ce qu'il a à vous dire pour vous convaincre d'accepter son invitation :\n\n\n"+msg+"\n\n\n"+
    "Voici maintenant son profil qui vous permettra d'en connaître un peu plus sur "+from.profile.name+" :\n\n\n"+from.profile.bio+"\n\n\n"+
    "Vous pouvez désormais lui répondre directement, en espérant que vous trouverez tous les deux l'expérience intéressante.\n\n"+
    "Merci d'utiliser L'addition est pour moi !\n\n"+
    "L'équipe de L'addition est pour moi.\n"+
    Meteor.absoluteUrl()+"\n";

  Email.send({
    from: fromEmail,
    to: toEmail,
    replyTo: fromEmail || undefined,
    subject: "L'addition est pour moi: "+from.profile.name+" vous invite au restaurant !",
    text: txt
  });

  Email.send({
    from: fromEmail,
    to: "acemtp@gmail.com",
    replyTo: fromEmail || undefined,
    subject: "L'addition est pour moi: "+from.profile.name+" a invité "+to.profile.name+" au restaurant !",
    text: from.profile.name+" a invité "+to.profile.name+" au restaurant !\n\nVoici l'email qui a été envoyé:\n\n\n"+txt
  });
}

var m = function (id, msg) {
  var u = Meteor.users.findOne(id);
  var name;
  if(u && u.profile && u.profile.name)
    name = u.profile.name;
  else if(u && u.emails[0].address)
    name = u.emails[0].address;
  else
    name = id;
  Email.send({
    from: 'acemtp@gmail.com',
    to: 'acemtp@gmail.com',
    replyTo: 'acemtp@gmail.com',
    subject: "L'addition est pour moi: "+name+" "+msg,
    text: name+" "+msg+"\n\n"+
      Meteor.absoluteUrl()+"profile/"+id+"\n\n"
  });
}


var adminMsg = {
  noPic: "Pour pouvoir valider votre profil, vous devez y mettre une photo de vous. Une photo rend votre profil beaucoup plus humain",
  noBio: "Pour pouvoir valider votre profil, vous devez y mettre une biographie. C'est le seul moyen pour ceux qui veulent vous inviter de savoir ce que vous faites",
  noTag: "Vous devriez ajouter des tags à votre profil. C'est un moyen simple pour vous trouver facilement en utiliser les filtres et afficher en un coup d'oeil les domaines que vous maitrisez",
};

var sendAdminMail = function (fromId, toId, msgId) {
  var from = Meteor.users.findOne(fromId);
  var to = Meteor.users.findOne(toId);
  var fromEmail = "acemtp@gmail.com";
  var toEmail = contactEmail(to);

  var txt =
    "Bonjour "+to.profile.name+",\n\n"+
    "Je tenais à vous remercier de vous être inscrit à L'addition est pour moi ! Ce projet ne peut marcher que grace à vous !\n\n"+
    "Nous sommes persuadé pour que ce projet fonctionne, la qualité des personnes s'y trouvant est primordiale. Plus votre profil sera complet, plus vous aurez des chances d'être invités.\n\n\n"+
    adminMsg[msgId]+".\n\n"+
    "Vous pouvez accéder à votre profil à l'adresse suivante:\n\n"+
    Meteor.absoluteUrl()+"profile/"+to._id+"/edit\n\n"+
    "L'équipe de L'addition est pour moi.\n"+
    Meteor.absoluteUrl()+"\n";

  Email.send({
    from: fromEmail,
    to: toEmail,
    replyTo: fromEmail || undefined,
    subject: "L'addition est pour moi: Améliorez votre profil pour être listé",
    text: txt
  });
}

