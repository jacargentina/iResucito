La app definitiva para el hermano del Camino Neocatecumenal.

<p style="text-align: center">
<img src="img/cristo.jpg" width="200px" />
</p>


## Cantos
Todos los cantos y salmos, categorizados según la etapa y el tiempo litúrgico

## Listas
Posibilidad de confeccionar listas para las Celebraciones de Palabra, y Eucaristías

----

### Contacto
Me puedes contactar a través del correo javier.alejandro.castro@gmail.com, y también registrando en la página de [issues](https://github.com/jacargentina/iResucito/issues)

----

### Desarrollo
En general, seguimos el flujo de trabajo "fork-y-pull" de Git

- **Fork** del repositorio en GitHub
- **Clone** del proyecto en tu propia máquina
- **Commit** de cambios en su propia rama
- **Push** del trabajo de vuelta al fork
- **Enviar Pull Request** para que podamos revisar los cambios

NOTA: ¡asegúrate de hacer merge de los últimos cambios de "upstream" antes de enviar un Pull Request!

### Estructura para los cantos
Los cantos se organizan dentro de la carpeta `/songs`, con una subcarpeta por cada lenguaje soportado:

  - `/songs/es` (Español - lenguaje principal)
  - `/songs/en` (Inglés)
  - `/songs/it` (Italiano)
  - `/songs/pt` (Portugués)

Los cantos estan en archivos de texto plano, con extensión `.txt`. El nombre del archivo debe tener el formato:

         `[nombre del canto] - [fuente].txt`

  - **nombre del canto** Debe contener solo el titulo del canto, en el idioma apropiado
  - **fuente** Es la cita del origen del canto, tal cual se encuentra en el Resucito oficial del camino

Cada canto debe registrarse en el indice, ubicado en `/songs/index.json`. Alli se encuentra una clave numérica por cada canto, con el formato siguiente:

```
 "1": {
  "etapa": "Catecumenado",
  "cuaresma": true,
  "files": {
   "es": "Así habla el amén - Ap 3, 14-22",
   "it": "Cosﬁ parla l'amen - Ap 3, 14-22"
  }
```

La clave `files` contiene a su vez una clave por lenguaje i18n soportado, cuyo valor es el nombre del archivo `.txt` sin la extensión.

### Para agregar un canto
Para agregar un canto titulado `new song - source.txt` en un determinado lenguaje (ej. `en`), los pasos son:

- Crear el archivo `.txt` con el contenido del canto
- Guardar archivo dentro de `/songs/en/New song - Source.txt`
- Editar el archivo `/songs/index.json`

- Si el canto es NUEVO (no existen otras traducciones), agregar al final una nueva clave, tomando como base el formato:

```
"[Ultima clave + 1]": {
  "etapa": [Precatecumenado|Catecumenado|Eleccion|Liturgia],
  "entrada": [true|false],
  "paz": [true|false],
  "comunion": [true|false],
  "final": [true|false],
  "laudes": [true|false],
  "adviento": [true|false],
  "cuaresma": [true|false],
  "pascua": [true|false],
  "virgen": [true|false],
  "fraccion": [true|false],
  "files": {
   "en": "New song - Source"
  }
```
**Nota**: Cualquier clave booleana no agregada se considera `false` y no deben agregarse por simplicidad.

- Si el canto ya existe en otro lenguaje, solo debe buscarse el mismo y agregarse dentro de `files` la clave apropiada a la nueva traducción

### Para generar archivos PDF

Durante la edición de los cantos puede ser muy útil realizar una previsualización en formato PDF de los cantos, para agilizar el trabajo sin la necesidad de generar una nueva compilacion de la app.

Para ello se puede ejecutar el script npm `genpdf` de la siguiente forma:

```
npm run genpdf -- -l pt
// se generan TODOS los cantos de lenguaje 'pt' dentro de la carpeta 'pdf'

npm run genpdf -- -l pt -k 12
// se generan sólo el canto del indice 12, es decir, 'Jacó' de 'pt' en la carpeta 'pdf'
```


## Configurar Gradle para permitir construir un release APK en Release (firmado)

Agregar en archivo $HOME/.gradle/gradle.properties, reemplazando el campo [contraseña] segun corresponde:

IRESUCITO_RELEASE_STORE_FILE=playStorePublishing.jks
IRESUCITO_RELEASE_STORE_PASSWORD=[contraseña]
IRESUCITO_RELEASE_KEY_ALIAS=key0
IRESUCITO_RELEASE_KEY_PASSWORD=[contraseña]