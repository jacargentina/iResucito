Definitive app for the Neocatecumenal Way's Brother.

<p style="text-align: center">
<img src="packages/native/img/cristo.jpg" width="200px" />
</p>


## Songs
All songs and psalms, categorized on stage and liturgic time

## Lists
Ability to add lists for Word celebrations and Eucharist

----

### Contact
Contact me at javier.alejandro.castro@gmail.com, also posting app issues on [issues](https://github.com/jacargentina/iResucito/issues)

----

### Collaboration and translation
You can collaborate on the adding and translation of new songs with https://iresucito.vercel.app

----

### Songs structure
Inside the `/packages/core/assets/songs` folder, with a JSON file for any supported language:

  - `/packages/core/assets/songs/es.json` (Spanish - main language)
  - `/packages/core/assets/songs/en.json` (English)
  - `/packages/core/assets/songs/it.json` (Italian)
  - `/packages/core/assets/songs/pt-BR.json` (Brasil Portugese)
  - `/packages/core/assets/songs/pt-PT.json` (Portugal Portugese)
  - `/packages/core/assets/songs/fr.json` (French)

Each JSON contains the **Locale Content Index** for every translated song, in the format:

```
{
  "[index]": {
    "name": "First title - song source",
    "source": " ... content ..."
  },
  "[index + 1]": {
    "name": "Other title - song source",
    "source": " ... content ..."
  },
  ...
}
```
  - **index** The song locale "index", which is referenced on the Global Songs Index
  - **title** The song title, on the specified language
  - **source** Bible's cite or the song "source", as it appears on the official "Way's Resucito book"

Every song is registered/referenced on the Global Songs Index, located at `/packages/core/assets/songs.json`. There is a numeric key for every song, with the following format:

```
 "1": {
  "stage": "catechumenate",
  "lutes and vespers": true,
  "entrance": true,
  "communion": true,
  "files": {
   "es": "234",
   "it": "112"
  }
```

The `files` key contains a subkey for every i18n language supported, where its value is the **locale index** for the song contents on the respective **Locale Content Index**

## Configure Gradle to build a release APK en Release (signed)

Add $HOME/.gradle/gradle.properties, replacing the [password] with its value:

IRESUCITO_RELEASE_STORE_FILE=playStoreUpload.jks   
IRESUCITO_RELEASE_STORE_PASSWORD=[password]  
IRESUCITO_RELEASE_KEY_ALIAS=upload  
IRESUCITO_RELEASE_KEY_PASSWORD=[password]  

### error: An organization slug is required (provide with --org)

Add `sentry.properties` at `./packages/native/ios` and `./packages/native/android` with project config and credentials.

### error: node_modules/i18n-js/dist/import/index.js no se puede importar

- Posible solucion: ejecutar `watchman watch-del-all` (probar con `yarn run clean; yarn run bundle`)