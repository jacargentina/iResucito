/** @type {import('ts-jest').JestConfigWithTsJest} */

// yarn test
// NO FUNCIONA
// al incluir "i18n-js" que no esta transpilado, se obtiene
//  SyntaxError: Unexpected token 'export'
// Se intentó utilizar configuracion para incluir i18n-js
// en la transformacion, pero no se logró
// Parece que los yarn workspaces tienen que ver

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
};
