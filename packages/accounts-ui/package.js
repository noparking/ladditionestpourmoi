Package.describe({
  summary: "French simple templates to add login widgets to an app."
});

Package.on_use(function (api) {
  api.use('fr-accounts-ui-unstyled', 'client');
  api.use('less', 'server');

  api.add_files(['login_buttons.less'], 'client');
});
