
Meteor.startup(function () {
  // code to run on server at startup
  process.env.MAIL_URL = 'smtp://postmaster%40ladditionestpourmoi.mailgun.org:4uqczccgs389@smtp.mailgun.org:587';
});

Meteor.publish('partialUsers', function(limit) {
  return Meteor.users.find({'profile.mentor':true}, {limit: limit});
});

var sendInvitation = function (fromId, toId, msg) {
  var from = Meteor.users.findOne(fromId);
  var to = Meteor.users.findOne(toId);
  var fromEmail = contactEmail(from);
  var toEmail = contactEmail(to);

  var txt =
    "Bonjour "+to.profile.name+",\n\n"+
    "Vous êtes inscrit à L'addition est pour moi et "+from.profile.name+" vient juste de vous inviter au restaurant !\n\n"+
    "Voici ce qu'il a à vous dire pour vous convaincre d'accepter son invitation :\n\n\n"+msg+"\n\n\n"+
    "Vous pouvez désormais lui répondre directement, en espérant que vous trouvriez tous les deux l'expérience interessante.\n\n"+
    "Merci d'utiliser L'addition est pour moi !\n\n"+
    "L'équipe de L'addition est pour moi.\n"+
    Meteor.absoluteUrl()+"\n";

  Email.send({
//        from: "noreply@ladditionestpourmoi.fr",
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
    text: from.profile.name+" a invité "+to.profile.name+" au restaurant !\n\nVoici le mail qui a été envoié:\n\n\n"+txt
  });
}