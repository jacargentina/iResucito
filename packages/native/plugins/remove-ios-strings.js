// Agregado para solucionar error en build ANDROID
// desde Expo 54, se agregan las claves "NSContactsUsageDescription"
// en los archivos de "strings.xml" de cada idioma
// pero son solo para ios, por ello deben quitarse
const fs = require('fs');
const path = require('path');
const { withDangerousMod } = require('@expo/config-plugins');

module.exports = function withRemoveIosStrings(config) {
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const resPath = path.join(
        config.modRequest.projectRoot,
        'android',
        'app',
        'src',
        'main',
        'res'
      );

      if (!fs.existsSync(resPath)) return config;

      // Buscar todas las carpetas que empiecen con 'values'
      const folders = fs.readdirSync(resPath).filter(f => f.startsWith('values'));

      folders.forEach(folder => {
        const filePath = path.join(resPath, folder, 'strings.xml');
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');
          // Remover NSContactsUsageDescription
          content = content.replace(
            /<string name="NSContactsUsageDescription">.*?<\/string>\s*/g,
            ''
          );
          fs.writeFileSync(filePath, content, 'utf8');
        }
      });

      return config;
    },
  ]);
};
