
Accounts.emailTemplates.from = "L'équipe de L'addition est pour moi <contact@ladditionestpourmoi.fr>";

Accounts.emailTemplates.resetPassword.subject = function(user) {
  return "Comment réinitialiser votre mot de passe sur " + Accounts.emailTemplates.siteName;
};

Accounts.emailTemplates.resetPassword.text = function(user, url) {
  var greeting = (user.profile && user.profile.name) ?
        ("Bonjour " + user.profile.name + ",") : "Bonjour,";
  return greeting + "\n"
    + "\n"
    + "Pour réinitialiser votre mot de passe, il vous suffit de cliquer sur le lien ci-dessous.\n"
    + "\n"
    + url + "\n"
    + "\n"
    + "Merci.\n";
};

Accounts.emailTemplates.verifyEmail.subject = function(user) {
  return "Comment vérifier votre adresse email sur " + Accounts.emailTemplates.siteName;
};

Accounts.emailTemplates.verifyEmail.text = function(user, url) {
  var greeting = (user.profile && user.profile.name) ?
        ("Bonjour " + user.profile.name + ",") : "Bonjour,";
  return greeting + "\n"
    + "\n"
    + "Pour vérifier votre adresse email, il vous suffit de cliquer sur le lien ci-dessous.\n"
    + "\n"
    + url + "\n"
    + "\n"
    + "Merci.\n";
};

Accounts.emailTemplates.enrollAccount.subject = function(user) {
  return "Refonte du site L'addition est pour moi; votre compte a été recréé";
//  return "Un compte a été créé pour vous sur " + Accounts.emailTemplates.siteName;
};

Accounts.emailTemplates.enrollAccount.text = function(user, url) {
  var greeting = (user.profile && user.profile.name) ?
        ("Bonjour " + user.profile.name + ",") : "Bonjour,";
  return greeting + "\n"
    + "\n"
    + "Nous venons de changer la plateforme technique qui gère le projet 'ladditionestpourmoi.fr', de nouvelles évolutions sont arrivés et d'autres encore sont dans les tuyaux.\n"
    + "\n"
    + "Votre compte a bien été rapatrié et toutes vos données (email, nom, description) ont bien été migrés ! Il y a juste le mot de passe qui a été modifié : il vous suffit donc de cliquer sur le lien ci-desous pour remettre un nouveau mot de passe.\n"
    + "\n"
    + url + "\n"
    + "\n"
    + "Profitez-en pour mettre à jour votre profile; mettre des tags, une photo de vous (seuls les profiles avec de vrais photos seront affichés).\n"
    + "\n"
    + "Merci de votre compréhension et à bientôt,\n"
    + "\n"
    + "L'équipe de L'addition est pour moi\n"
    + "\n"
    + "PS : pour les fans de technique, c'est Meteor qui propulse désormais ladditionestpourmoi.fr. Javascript Rules ;-)\n";

/*
  return greeting + "\n"
    + "\n"
    + "Pour commencer à utiliser le service, il vous suffit de cliquer sur le lien ci-dessous.\n"
    + "\n"
    + url + "\n"
    + "\n"
    + "Merci.\n";
*/
};
