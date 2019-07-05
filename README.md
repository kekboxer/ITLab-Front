# ITLab-Front

Develop | Master
--- | ---
[![Build Status](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_apis/build/status/ITLabRTUMIREA.ITLab-Front?branchName=develop)](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_build/latest?definitionId=64&branchName=develop) | [![Build status](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_apis/build/status/ITLabRTUMIREA.ITLab-Front?branchName=master)](https://dev.azure.com/rtuitlab/RTU%20IT%20Lab/_build/latest?definitionId=64&branchName=master)


## Project setup
```
npm install
```

Then create config file with name `.env` in the project root with the following minimal sample content
```
NODE_ENV=development                          # or production
VUE_APP_API_URL=https://path.to.backend/api/  # should be an instance of itlab-back
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
