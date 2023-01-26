find . -type f -name 'package.json' -not -path './.git/*' -not -path '*/node_modules/*' -execdir npx npm-check-updates --upgrade
yarn