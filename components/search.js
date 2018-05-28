// @flow
import badges from './badges';
import I18n from './translations';

/* eslint-disable */
const buildItems = (): Array<SearchItem> => {
  var items: Array<SearchItem> = [
    {
      title: I18n.t('search_title.alpha'),
      note: I18n.t('search_note.alpha'),
      route: 'SalmoList',
      chooser: I18n.t('search_tabs.all'),
      params: {},
      badge: badges.Alfabético,
    },
    {
      title: I18n.t('search_title.stage'),
      divider: true
    },
    {
      title: I18n.t('search_title.precatechumenate'),
      note: I18n.t('search_note.precatechumenate'),
      route: 'SalmoList',
      params: { filter: { etapa: 'Precatecumenado' } },
      badge: badges.Precatecumenado
    },
    {
      title: I18n.t('search_title.catechumenate'),
      note: I18n.t('search_note.catechumenate'),
      route: 'SalmoList',
      params: { filter: { etapa: 'Catecumenado' } },
      badge: badges.Catecumenado
    },
    {
      title: I18n.t('search_title.election'),
      note: I18n.t('search_note.election'),
      route: 'SalmoList',
      params: { filter: { etapa: 'Eleccion' } },
      badge: badges.Eleccion
    },
    {
      title: I18n.t('search_title.liturgy'),
      note: I18n.t('search_note.liturgy'),
      route: 'SalmoList',
      params: { filter: { etapa: 'Liturgia' } },
      badge: badges.Liturgia
    },
    {
      title: I18n.t('search_title.liturgical time'),
      divider: true
    },
    {
      title: I18n.t('search_title.advent'),
      note: I18n.t('search_note.advent'),
      route: 'SalmoList',
      params: { filter: { adviento: true } },
      badge: null
    },
    {
      title: I18n.t('search_title.christmas'),
      note: I18n.t('search_note.christmas'),
      route: 'SalmoList',
      params: { filter: { navidad: true } },
      badge: null
    },
    {
      title: I18n.t('search_title.lent'),
      note: I18n.t('search_note.lent'),
      route: 'SalmoList',
      params: { filter: { cuaresma: true } },
      badge: null
    },
    {
      title: I18n.t('search_title.easter'),
      note: I18n.t('search_note.easter'),
      route: 'SalmoList',
      params: { filter: { pascua: true } },
      badge: null
    },
    {
      title: I18n.t('search_title.pentecost'),
      note: I18n.t('search_note.pentecost'),
      route: 'SalmoList',
      params: { filter: { pentecostes: true } },
      badge: null
    },
    {
      title: I18n.t('search_title.liturgical order'),
      divider: true
    },
    {
      title: I18n.t('search_title.entrance'),
      note: I18n.t('search_note.entrance'),
      route: 'SalmoList',
      params: { filter: { entrada: true } },
      badge: null,
      chooser: I18n.t('search_tabs.entrance')
    },
    {
      title: I18n.t('search_title.peace and offerings'),
      note: I18n.t('search_note.peace and offerings'),
      route: 'SalmoList',
      params: { filter: { paz: true } },
      badge: null,
      chooser: I18n.t('search_tabs.peace and offerings')
    },
    {
      title: I18n.t('search_title.fraction of bread'),
      note: I18n.t('search_note.fraction of bread'),
      route: 'SalmoList',
      params: { filter: { fraccion: true } },
      badge: null,
      chooser: I18n.t('search_tabs.fraction of bread')
    },
    {
      title: I18n.t('search_title.communion'),
      note: I18n.t('search_note.communion'),
      route: 'SalmoList',
      params: { filter: { comunion: true } },
      badge: null,
      chooser: I18n.t('search_tabs.communion')
    },
    {
      title: I18n.t('search_title.exit'),
      note: I18n.t('search_note.exit'),
      route: 'SalmoList',
      params: { filter: { final: true } },
      badge: null,
      chooser: I18n.t('search_tabs.exit')
    },
    {
      title: I18n.t('search_title.signing to the virgin'),
      note: I18n.t('search_note.signing to the virgin'),
      route: 'SalmoList',
      params: { filter: { virgen: true } },
      badge: null,
      chooser: I18n.t('search_tabs.signing to the virgin')
    },
    {
      title: I18n.t("search_title.children's songs"),
      note: I18n.t("search_note.children's songs"),
      route: 'SalmoList',
      params: { filter: { niños: true } },
      badge: null
    },
    {
      title: I18n.t('search_title.lutes and vespers'),
      note: I18n.t('search_note.lutes and vespers'),
      route: 'SalmoList',
      params: { filter: { laudes: true } },
      badge: null
    }
  ];
  items = items.map(item => {
    if (item.params) {
      item.params.title = item.title;
    }
    return item;
  });
  return items;
};

export default buildItems;
