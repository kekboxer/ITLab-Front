# ITLab-Front

Develop | Master
--- | ---
[![Build status](https://capchik.visualstudio.com/MTU%20Work/_apis/build/status/RTU%20Work%20control%20front)](https://capchik.visualstudio.com/MTU%20Work/_build/latest?definitionId=20) | [![Build status](https://capchik.visualstudio.com/MTU%20Work/_apis/build/status/RTU%20IT%20Lab%20front-master)](https://capchik.visualstudio.com/MTU%20Work/_build/latest?definitionId=33)

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
