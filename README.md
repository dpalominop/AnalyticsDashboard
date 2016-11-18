# Analytics Dashboard

Dashboard personalizado de Google Analytics especializado en el sector de turismo.

## Compartir Feedback / Reportar Bugs

#### Para nuevas características y Bugs

- Puedes reportar un bug a [reportar un bug](https://github.com/dpalominop/AnalyticsDashboard/issues/new).
- Puedes reportar un requerimiento a [solicitar una nueva característica](https://github.com/dpalominop/AnalyticsDashboard/issues/new).

#### Para conocer la plataforma de Google Analytics

- Documentación de toda la API de Google Analytics, librerías y SDKs puede ser encontrada en [Google Analytics Developers](http://developers.google.com/analytics).

## Construir y Ejecutar localmente

Analytics Dashboard corre sobre [Google App Engine](https://cloud.google.com/appengine/) y es construído con [node.js](http://nodejs.org/). Para correr la plataforma localmente se necesita las siguientes dependencias instaladas en tu sistema:

- [Node.js](https://nodejs.org/en/download/) (v6.0.0+)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/) (v132.0.0+, with `dev_appserver.py` in your `PATH`)
- [pip](https://pypi.python.org/pypi/pip)
- [GraphicsMagick](http://www.graphicsmagick.org/) (with `gm` in your `PATH`)

Una vez instalados todas las dependencias, sigue estos pasos para construir y correr la plataforma localmente:

```sh
# Clone the repository.
git clone https://github.com/googleanalytics/ga-dev-tools.git
cd ga-dev-tools

# Install the build dependencies.
pip install -r requirements.txt -t python_modules
npm install

# Install the 'gcloud app Python Extensions' component
gcloud components install app-engine-python

# Build the site and run the local App Engine server.
npm start
```

If you're wanting to load any of the pages that require server-side authorization, you'll also need to create a service account, add the private JSON key to your project's root directory, and name it `service-account-key.json`. You can follow the instructions described in the [Server-side Authorization demo](https://ga-dev-tools.appspot.com/embed-api/server-side-authorization/) for more details.

Now you should be able to load [http://localhost:8080/](http://localhost:8080/) in your browser and see the site. (Note, the client ID associated with this project has the origin `localhost:8080` whitelisted. If you load the site on another port, authentication may not work properly.)

If you're running App Engine on Windows or Mac, you can use the App Engine Launcher GUI to run the site as an alternative to running the above command.

## Deploying the site

To deploy your changes to production, follow the steps described in the pervious section to install dependencies and then run the `deploy` npm script with the `NODE_ENV` environment variable set to "production":

```sh
NODE_ENV=production npm run deploy
```

If you wish to preview your changes prior to releasing them in production, run the `stage` npm script:

```sh
NODE_ENV=production npm run stage
```

When running the `deploy` or `stage` scripts, the App Engine version number is automatically generated for you. However, the version can be overridden by setting the `APP_ENGINE_VERSION` environment variable.

```sh
NODE_ENV=production APP_ENGINE_VERSION=feature-test npm run stage
```

**Note:** running the `deploy` or `stage` script requires permissions for their respective App Engine projects.
