import badges from './badges';

var search = [
  {
    title: 'Alfabético',
    note: 'Todos los cantos en orden alfabético',
    route: 'SalmoList',
    params: {},
    badge: badges.Alfabético,
    chooser: 'Todos'
  },
  {
    title: 'Etapa del Camino',
    divider: true
  },
  {
    title: 'Precatecumenado',
    note: 'Los cantos para la etapa del Precatecumenado',
    route: 'SalmoList',
    params: { filter: { etapa: 'Precatecumenado' } },
    badge: badges.Precatecumenado
  },
  {
    title: 'Catecumenado',
    note: 'Los cantos para la etapa del Catecumenado',
    route: 'SalmoList',
    params: { filter: { etapa: 'Catecumenado' } },
    badge: badges.Catecumenado
  },
  {
    title: 'Elección',
    note: 'Los cantos para la etapa de la Elección',
    route: 'SalmoList',
    params: { filter: { etapa: 'Eleccion' } },
    badge: badges.Eleccion
  },
  {
    title: 'Liturgia',
    note: 'Los cantos para las celebraciones litúrgicas',
    route: 'SalmoList',
    params: { filter: { etapa: 'Liturgia' } },
    badge: badges.Liturgia
  },
  {
    title: 'Tiempo litúrgico',
    divider: true
  },
  {
    title: 'Adviento',
    note: 'Los cantos para tiempo de Adviento',
    route: 'SalmoList',
    params: { filter: { adviento: true } },
    badge: null
  },
  {
    title: 'Navidad',
    note: 'Los cantos para tiempo de Navidad',
    route: 'SalmoList',
    params: { filter: { navidad: true } },
    badge: null
  },
  {
    title: 'Cuaresma',
    note: 'Los cantos para tiempo de Cuaresma',
    route: 'SalmoList',
    params: { filter: { cuaresma: true } },
    badge: null
  },
  {
    title: 'Pascua',
    note: 'Los cantos para tiempo de Pascua',
    route: 'SalmoList',
    params: { filter: { pascua: true } },
    badge: null
  },
  {
    title: 'Pentecostés',
    note: 'Los cantos para tiempo de Pentecostés',
    route: 'SalmoList',
    params: { filter: { pentecostes: true } },
    badge: null
  },
  {
    title: 'Orden litúrgico',
    divider: true
  },
  {
    title: 'Entrada',
    note: 'Los cantos para inicio de las liturgias',
    route: 'SalmoList',
    params: { filter: { entrada: true } },
    badge: null,
    chooser: 'Entrada'
  },
  {
    title: 'Paz y Ofrendas',
    note: 'Los cantos para el saludo de la paz y las ofrendas',
    route: 'SalmoList',
    params: { filter: { paz: true } },
    badge: null,
    chooser: 'Paz/Ofrendas'
  },
  {
    title: 'Fracción del Pan',
    note: 'Los cantos para la fracción del pan',
    route: 'SalmoList',
    params: { filter: { fraccion: true } },
    badge: null,
    chooser: 'Fracción Pan'
  },
  {
    title: 'Comunión',
    note: 'Los cantos para la comunión',
    route: 'SalmoList',
    params: { filter: { comunion: true } },
    badge: null,
    chooser: 'Comunión'
  },
  {
    title: 'Salida',
    note: 'Los cantos para la salida de las liturgias',
    route: 'SalmoList',
    params: { filter: { final: true } },
    badge: null,
    chooser: 'Salida'
  },
  {
    title: 'Cantos a la Virgen',
    note: 'Los cantos dedicados a la Virgen María',
    route: 'SalmoList',
    params: { filter: { virgen: true } },
    badge: null,
    chooser: 'Virgen'
  },
  {
    title: 'Cantos de los Niños',
    note: 'Los cantos para los niños',
    route: 'SalmoList',
    params: { filter: { niños: true } },
    badge: null
  },
  {
    title: 'Laúdes y Vísperas',
    note: 'Los cantos de Laúdes y Vísperas',
    route: 'SalmoList',
    params: { filter: { laudes: true } },
    badge: null
  }
];

search = search.map(item => {
  if (item.params) {
    item.params.title = item.title;
  }
  return item;
});

export default search;
