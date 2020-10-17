module.exports = {
  presets: ['next/babel', '@babel/flow'],
  ignore: [
    (filename) => {
      return filename.indexOf('pdfkit.standalone.js') !== -1;
    },
  ],
};
