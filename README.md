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
Inside the `/packages/core/assets/songs` folder, with a subfolder for any supported language:

  - `/songs/es` (Spanish - main language)
  - `/songs/en` (English)
  - `/songs/it` (Italian)
  - `/songs/pt-BR` (Brasil Portugese)
  - `/songs/pt-PT` (Portugal Portugese)
  - `/songs/fr` (French)

Songs are simple plain text files, with `.txt` as extension. The filenames should follow this convention:

         `[song title] - [song source].txt`

  - **song title** The song title, on the specified language
  - **song source** Bible's cite or the song "source", as it appears on the official "Way's Resucito book"

Every song is registered on the index, located at `/packages/core/assets/songs.json`. There is a numeric key for every song, with the following format:

```
 "1": {
  "stage": "catechumenate",
  "lutes and vespers": true,
  "entrance": true,
  "communion": true,
  "files": {
   "es": "Así habla el amén - Ap 3, 14-22",
   "it": "Cosﬁ parla l'amen - Ap 3, 14-22"
  }
```

The `files` key contains a subkey for every i18n language supported, where its value is the `.txt` song filename, without its extension.

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