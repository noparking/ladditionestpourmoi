
Accounts.emailTemplates.from = "L'équipe de L'addition est pour moi <no-reply@ladditionestpourmoi.fr>";

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
  return "Un compte a été créé pour vous sur " + Accounts.emailTemplates.siteName;
};

Accounts.emailTemplates.enrollAccount.text = function(user, url) {
  var greeting = (user.profile && user.profile.name) ?
        ("Bonjour " + user.profile.name + ",") : "Bonjour,";
  return greeting + "\n"
    + "\n"
    + "Pour commencer à utiliser le service, il vous suffit de cliquer sur le lien ci-dessous.\n"
    + "\n"
    + url + "\n"
    + "\n"
    + "Merci.\n";
};
