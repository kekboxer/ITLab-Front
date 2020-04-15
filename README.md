# ITLab-Front

Develop | Master
--- | ---
[![Build Status](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_apis/build/status/ITLabRTUMIREA.ITLab-Front?branchName=develop)](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_build/latest?definitionId=64&branchName=develop) | [![Build status](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_apis/build/status/ITLabRTUMIREA.ITLab-Front?branchName=master)](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_build/latest?definitionId=64&branchName=master)


## Project setup
```
npm install
```

Then create config file with name `config.json` in the project root with the following content
```
VUE_APP_AUTHORITY=https://path.to.authrorization.service # path to your authority OIDC service
VUE_APP_CLIENT_ID="id"                                   # client application's identifier as registered with the OIDC
VUE_APP_REDIRECT_URI=https://path.to.login.callback.page # redirect page that will receive a response from OIDC service
VUE_APP_RESPONSE_TYPE="type"                             # the type of response desired from the OIDC
VUE_APP_SCOPE="scope1 scope2..."                         # the scopes being requested from the OIDC
VUE_APP_POST_LOGOUT_REDIRECT_URL=https://path.to.logout  # path to page after logout
VUE_APP_SILENT_REDIRECT_URI=https://path.to.silent.login # path to page when silent login
VUE_APP_VK_GROUP_DIALOG_URL="https://vk.com/...          # url to dialog with group at vk.com
VUE_APP_DEV_FUNC_ENABLED=true/false                      # enable/disable development settings
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test:unit
```
