import { getLocalesForPicker } from '@iresucito/core';
import { ActionFunction } from '@remix-run/node';
import { json } from '@vercel/remix';
import { commitSession, getSession } from '~/session.server';

export let action: ActionFunction = async ({ request, params }) => {
  const { locale } = params;
  const session = await getSession(request.headers.get('Cookie'));

  const availableLocales = getLocalesForPicker();
  // Buscar coincidencia completa (es-419, es-PE)
  var search = availableLocales.find((v) => v.value == locale);
  console.log(`lang ${locale} valid?: ${search != undefined ? 'YES' : 'NO'}`);
  if (search == undefined && locale?.split('-').length == 2) {
    // Ej "es-419", buscar "es"
    search = availableLocales.find((v) => v.value == locale?.split('-')[0]);
    console.log(
      `lang ${locale?.split('-')[0]} ?: ${search != undefined ? 'YES' : 'NO'}`
    );
  }

  if (!search) {
    search = availableLocales[0];
    console.log(`lang set to first available: ${search.value}`);
  }

  session.set('locale', search.value);
  console.log('lang set', search.value);

  return json(
    { newLocale: locale },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
};
