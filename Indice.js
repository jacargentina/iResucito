const Tiempos = [
  'Adviento',
  'Navidad',
  'Cuaresma',
  'Pascua',
  'Pentecostés',
  'Virgen',
  'Niños',
  'Laúdes/Vísperas',
  'Entrada',
  'Paz/Ofrendas',
  'Fracción del Pan',
  'Comunión',
  'Final'
];

const Indice = {
  'Así habla el amén - Ap 3, 14-22': {
    etapa: 'Catecumenado',
    cuaresma: true
  },
  'Como el impulso que siente la ira - Oda 7 de Salomón': {
    etapa: 'Catecumenado',
    laudes: true,
    entrada: true,
    comunion: true
  },
  'Consolad a mi pueblo - Is 40, 1-11': {
    etapa: 'Catecumenado',
    adviento: true,
    entrada: true,
    paz: true,
    final: true
  },
  'Cuando dormía - Ct 5, 2ss': {
    etapa: 'Catecumenado',
    laudes: true,
    comunion: true,
    pascua: true
  },
  'Débora - Jc 5': {
    etapa: 'Catecumenado',
    adviento: true,
    virgen: true
  },
  'Dichoso el hombre - Sal 1': {
    etapa: 'Catecumenado'
  },
  'El Señor me ha dado lengua de discípulo - Is 50, 4-10': {
    etapa: 'Catecumenado',
    fraccion: true
  },
  'El combate escatológico - Ap 19, 11-20': {
    etapa: 'Catecumenado',
    pascua: true,
    entrada: true
  },
  'El lagarero - Is 63, 1-6': {
    etapa: 'Catecumenado',
    fraccion: true
  },
  'El sembrador - Mc 4, 3ss': {
    etapa: 'Catecumenado',
    entrada: true
  },
  'He aquí que nuestro espejo es el Señor - Oda 13 de Salomón': {
    etapa: 'Catecumenado',
    cuaresma: true,
    pascua: true,
    laudes: true
  },
  'Jacob - Gn 32, 23-29': {
    etapa: 'Catecumenado'
  },
  'Ninguno puede servir a dos señores - Mt 6, 24-33': {
    etapa: 'Catecumenado'
  },
  'Oh Señor, mi corazón ya no es ambicioso - Sal 131 (130)': {
    etapa: 'Catecumenado'
  },
  'Señor, tú me escrutas - Sal 139 (138)': {
    etapa: 'Catecumenado'
  },
  'Shemá Israel - Dt 6, 4-9': {
    etapa: 'Catecumenado',
    pentecostes: true
  },
  'Siéntate solitario y silencioso - Lm 3': {
    etapa: 'Catecumenado',
    cuaresma: true
  },
  'Tú has cubierto de vergüenza la muerte - Melitón de Sardes': {
    etapa: 'Catecumenado',
    viergen: true,
    fraccion: true,
    pascua: true
  },
  'A la víctima pascual - Secuencia de Pascua': {
    etapa: 'Precatecumenado',
    pentecostes: true,
    pascua: true,
    entrada: true,
    comunion: true,
  },
  'A nadie demos ocasión de tropiezo - 2 Co 6, 3ss': {
    etapa: 'Precatecumenado'
  },
  'A ti levanto mis ojos - Sal 123 (122)': {
    etapa: 'Precatecumenado'
  },
  'A ti, Señor, en mi clamor imploro - Sal 142 (141)': {
    etapa: 'Precatecumenado'
  },
  'A ti, Señor, levanto mi alma - Sal 25 (24)': {
    etapa: 'Precatecumenado'
  },
  'A ti, Señor, se debe la alabanza en Sión - Sal 65 (64)': {
    etapa: 'Precatecumenado'
  },
  'Abraham - Gn 18, 1-5': {
    etapa: 'Precatecumenado'
  },
  'Aclamad al Señor - Sal 100 (99)': {
    etapa: 'Precatecumenado'
  },
  'Al despertar - Sal 17 (16)': {
    etapa: 'Precatecumenado'
  },
  'Alabad al Señor en el cielo - Sal 148': {
    etapa: 'Precatecumenado'
  },
  'Aleluya, alabad al Señor - Sal 150': {
    etapa: 'Precatecumenado'
  },
  'Aleluya, bendecid al Señor - Sal 134 (133)': {
    etapa: 'Precatecumenado'
  },
  'Aleluya, ya llegó el reino - Ap 19, 6-9': {
    etapa: 'Precatecumenado'
  },
  'Alzaos puertas - Sal 24 (23)': {
    etapa: 'Precatecumenado'
  },
  'Amo al Señor - Sal 116 (114-115)': {
    etapa: 'Precatecumenado'
  },
  'Aquedah - Gn 22, 1-19': {
    etapa: 'Precatecumenado'
  },
  'Ave María I - Lc 1, 28ss': {
    etapa: 'Precatecumenado'
  },
  'Ave María II (1984) - Lc 1, 28ss': {
    etapa: 'Precatecumenado'
  },
  'Babilonia criminal - Sal 137 (136)': {
    etapa: 'Precatecumenado'
  },
  'Balaam - Nm 23, 7-24': {
    etapa: 'Precatecumenado'
  },
  'Bendeciré al Señor en todo tiempo - Sal 34 (33)': {
    etapa: 'Precatecumenado'
  },
  'Bendice, alma mía, a Yahveh - Sal 103 (102)': {
    etapa: 'Precatecumenado'
  },
  'Bendita eres tú, María - Lc 1, 42-45': {
    etapa: 'Precatecumenado'
  },
  'Bendito eres, Señor - Dn 3, 52-57': {
    etapa: 'Precatecumenado'
  },
  'Benedictus - Lc 1, 67-80': {
    etapa: 'Precatecumenado'
  },
  'Cantad al Señor - Sal 117 (116)': {
    etapa: 'Precatecumenado'
  },
  'Canto de Moisés - Ex 15, 1-18': {
    etapa: 'Precatecumenado'
  },
  'Caritas Christi urget nos - 2 Co 5, 14-15': {
    etapa: 'Precatecumenado'
  },
  'Cántico de los tres jóvenes - Dn 3, 57-58': {
    etapa: 'Precatecumenado'
  },
  'Como la cierva - Sal 42-43 (41-42)': {
    etapa: 'Precatecumenado'
  },
  'Cómo es maravilloso - Sal 133 (132)': {
    etapa: 'Precatecumenado'
  },
  'Cristo es la luz - Himno': {
    etapa: 'Precatecumenado'
  },
  'Cuando Israel salió de Egipto - Sal 114 (113)': {
    etapa: 'Precatecumenado'
  },
  'Cuando el Señor - Sal 126 (125)': {
    etapa: 'Precatecumenado'
  },
  Dayenú: {
    etapa: 'Precatecumenado'
  },
  'De profundis - Sal 130 (129)': {
    etapa: 'Precatecumenado'
  },
  'Decid a los de corazón cansado - Is 35 4ss': {
    etapa: 'Precatecumenado'
  },
  'Delante de los ángeles - Sal 138 (137)': {
    etapa: 'Precatecumenado'
  },
  'Dice el Señor a mi Señor - Sal 110 (109)': {
    etapa: 'Precatecumenado'
  },
  'Día de reposo - Jn 8, 52': {
    etapa: 'Precatecumenado'
  },
  'El Señor anuncia una noticia - Sal 68 (67)': {
    etapa: 'Precatecumenado'
  },
  'El Señor es mi pastor - Sal 23 (24)': {
    etapa: 'Precatecumenado'
  },
  'El jacal de los pastores - Ct 1, 2-8': {
    etapa: 'Precatecumenado'
  },
  'El necio piensa que Dios no existe - Sal 13 (14)': {
    etapa: 'Precatecumenado'
  },
  'El pueblo que caminaba en las tinieblas - Is 9, 1-5': {
    etapa: 'Precatecumenado'
  },
  'Elí, Elí, lamá sabactaní - Sal 22 (21)': {
    etapa: 'Precatecumenado'
  },
  'Eres digno de tomar el libro - Ap 5, 9ss': {
    etapa: 'Precatecumenado'
  },
  'Eres hermoso - Sal 45 (44)': {
    etapa: 'Precatecumenado'
  },
  'Escóndeme en lo oculto de tu tienda - Sal 27 (26)': {
    etapa: 'Precatecumenado'
  },
  'Están rotas mis ataduras - Carmen 63': {
    etapa: 'Precatecumenado'
  },
  'Evenu Shalom Alejem - Canto popular hebreo': {
    etapa: 'Precatecumenado'
  },
  'Exultad, justos, en el Señor - Sal 32': {
    etapa: 'Precatecumenado'
  },
  'Éste es el día en que actuó el Señor - Sal 118 (117)': {
    etapa: 'Precatecumenado'
  },
  'Felicidad para el hombre - Sal 128 (127)': {
    etapa: 'Precatecumenado'
  },
  'Gracias a Yahveh - Sal 136 (135)': {
    etapa: 'Precatecumenado'
  },
  'Gritad jubilosos - Is 12': {
    etapa: 'Precatecumenado'
  },
  'Hacia ti, morada santa - Himno': {
    etapa: 'Precatecumenado'
  },
  'Hasta cuándo - Sal 13 (12)': {
    etapa: 'Precatecumenado'
  },
  'He aquí mi siervo - Is 42': {
    etapa: 'Precatecumenado'
  },
  'He aquí que vengo presto - Ap 22, 12-16': {
    etapa: 'Precatecumenado'
  },
  'He esperado en el Señor - Sal 40 (39)': {
    etapa: 'Precatecumenado'
  },
  'Hijas de Jerusalén - Lc 23, 28-46': {
    etapa: 'Precatecumenado'
  },
  'Himno a Cristo luz - Himno': {
    etapa: 'Precatecumenado'
  },
  'Himno a la kenosis - Flp 2, 1-11': {
    etapa: 'Precatecumenado'
  },
  'Himno de Adviento - Himno': {
    etapa: 'Precatecumenado'
  },
  'Himno de Pascua - Himno': {
    etapa: 'Precatecumenado'
  },
  'Himno de la Ascensión - Himno': {
    etapa: 'Precatecumenado'
  },
  'Huye amado mío - Ct 8, 10-14': {
    etapa: 'Precatecumenado'
  },
  'Id y anunciad a mis hermanos - Mt 28, 7-10': {
    etapa: 'Precatecumenado'
  },
  'Improperios - Himno': {
    etapa: 'Precatecumenado'
  },
  'Jerusalén reconstruida - Tb 13, 11-17': {
    etapa: 'Precatecumenado'
  },
  'La marcha es dura - Himno': {
    etapa: 'Precatecumenado'
  },
  'La salve - Himno': {
    etapa: 'Precatecumenado'
  },
  'La siega de las naciones - Jn 4, 31-38': {
    etapa: 'Precatecumenado'
  },
  'Levanto mis ojos a los montes - Sal 121 (120)': {
    etapa: 'Precatecumenado'
  },
  'Llegue hasta tu presencia mi clamor - Sal 119 (118)': {
    etapa: 'Precatecumenado'
  },
  'Llévame al cielo - Flp 1, 23': {
    etapa: 'Precatecumenado'
  },
  'Magníficat - Lc 1, 46-55': {
    etapa: 'Precatecumenado'
  },
  'María de Jasna Göra - Himno': {
    etapa: 'Precatecumenado'
  },
  'María, casa de bendición - Jn 2,1-11': {
    etapa: 'Precatecumenado'
  },
  'María, madre de la Iglesia - Jn 19, 26-34': {
    etapa: 'Precatecumenado'
  },
  'María, madre del camino ardiente - Himno': {
    etapa: 'Precatecumenado'
  },
  'María, pequena Maria - Himno': {
    etapa: 'Precatecumenado'
  },
  'Me enseñarás el camino de la vida - Sal 15': {
    etapa: 'Precatecumenado'
  },
  'Me has seducido Señor - Jr 20, 7-18': {
    etapa: 'Precatecumenado'
  },
  'Mirad que estupendo - Sal 133 (132)': {
    etapa: 'Precatecumenado'
  },
  'Misericordia mía, misericordia - Sal 51 (50)': {
    etapa: 'Precatecumenado'
  },
  'Mucho me han perseguido - Sal 129': {
    etapa: 'Precatecumenado'
  },
  'No está aquí, resucitó - Mt 28, 1-8': {
    etapa: 'Precatecumenado'
  },
  'No hay en él parecer - Is 53, 2ss': {
    etapa: 'Precatecumenado'
  },
  'Oh Dios, por tu nombre sálvame - Sal 54 (53)': {
    etapa: 'Precatecumenado'
  },
  'Oh Jesús, amor mío - Himno': {
    etapa: 'Precatecumenado'
  },
  'Oh Señor, nuestro Dios - Sal 8': {
    etapa: 'Precatecumenado'
  },
  'Oh cielos, lloved de lo alto - Is 45, 8': {
    etapa: 'Precatecumenado'
  },
  'Oh muerte, dónde está tu victoria - 1 Co 15': {
    etapa: 'Precatecumenado'
  },
  'Os tomaré de entre las naciones - Ez 36, 24-28': {
    etapa: 'Precatecumenado'
  },
  'Pentecostés - Himno': {
    etapa: 'Precatecumenado'
  },
  'Por el amor de mis amigos - Sal 122 (121)': {
    etapa: 'Precatecumenado'
  },
  'Por qué esta noche es diferente - Canto de los niños': {
    etapa: 'Precatecumenado'
  },
  'Por qué las gentes conjuran - Sal 2': {
    etapa: 'Precatecumenado'
  },
  'Porque mi yugo es suave - Mt 11, 28-30': {
    etapa: 'Precatecumenado'
  },
  'Que amables son tus moradas, Señor - Sal 84 (83)': {
    etapa: 'Precatecumenado'
  },
  'Qué estupendo, qué alegría - Sal 133 (132)': {
    etapa: 'Precatecumenado'
  },
  'Quiero andar madre a Jerusalén - Canto sefardí': {
    etapa: 'Precatecumenado'
  },
  'Quiero cantar - Sal 57 (56)': {
    etapa: 'Precatecumenado'
  },
  'Quién es ésta que sube del desierto - Ct 8, 5-7': {
    etapa: 'Precatecumenado'
  },
  'Quién nos separará - Rm 8, 33-39': {
    etapa: 'Precatecumenado'
  },
  'Resucitó - Himno pascual': {
    etapa: 'Precatecumenado'
  },
  'Salve, reina de los cielos - Himno': {
    etapa: 'Precatecumenado'
  },
  'Se encontraron dos ángeles - Canto de los niños': {
    etapa: 'Precatecumenado'
  },
  'Señor, ayúdame a no dudar de ti - Himno': {
    etapa: 'Precatecumenado'
  },
  'Señor, escucha mi oración - Sal 143': {
    etapa: 'Precatecumenado'
  },
  'Señor, no me corrijas en tu cólera - Sal 6': {
    etapa: 'Precatecumenado'
  },
  'Shlom-lej Mariam - Ave María en arameo antiguo': {
    etapa: 'Precatecumenado'
  },
  'Si el Señor no construye la casa - Sal 127 (126)': {
    etapa: 'Precatecumenado'
  },
  'Si hoy escucháis su voz - Sal 95 (94)': {
    etapa: 'Precatecumenado'
  },
  'Si me he refugiado en el Señor - Sal 11 (10)': {
    etapa: 'Precatecumenado'
  },
  'Sión, madre de todos los pueblos - Sal 87 (86)': {
    etapa: 'Precatecumenado'
  },
  'Sola a solo - Himno': {
    etapa: 'Precatecumenado'
  },
  'Stabat mater dolorosa - Himno': {
    etapa: 'Precatecumenado'
  },
  'Te estoy llamando, Señor - Sal 141 (140)': {
    etapa: 'Precatecumenado'
  },
  'Te he manifestado mi pecado - Sal 32 (31)': {
    etapa: 'Precatecumenado'
  },
  'Tú eres mi esperanza, Señor - Oda 29 de Salomón': {
    etapa: 'Precatecumenado'
  },
  'Un retoño brota del tronco de Jesé - Is 11, 1-11': {
    etapa: 'Precatecumenado'
  },
  'Una gran señal - Ap 12': {
    etapa: 'Precatecumenado'
  },
  'Urí, urí, urá - Villancico': {
    etapa: 'Precatecumenado'
  },
  'Vamos ya, pastores - Villancico': {
    etapa: 'Precatecumenado'
  },
  'Ven Espíritu Santo - Secuencia de Pentecostés': {
    etapa: 'Precatecumenado'
  },
  'Ven del Líbano - Ct 4, 8ss': {
    etapa: 'Precatecumenado'
  },
  'Ven, hijo del hombre - Ap 21, 17ss': {
    etapa: 'Precatecumenado'
  },
  'Veni creator - Himno': {
    etapa: 'Precatecumenado'
  },
  'Viene el Señor - Sal 93 (92) - Ap 1, 5-6': {
    etapa: 'Precatecumenado'
  },
  'Virgen de la maravilla - Himno': {
    etapa: 'Precatecumenado'
  },
  'Vivid alegres - Flp 4, 4ss': {
    etapa: 'Precatecumenado'
  },
  'Vosotros sois la luz del mundo - Mt 5, 14-16': {
    etapa: 'Precatecumenado'
  },
  'Ya viene mi Dios - Villancico': {
    etapa: 'Precatecumenado'
  },
  'Yahveh, tú eres mi Dios - Is 25': {
    etapa: 'Precatecumenado'
  },
  'Yo te amo, Señor - Sal 18': {
    etapa: 'Precatecumenado'
  },
  'Yo vengo a reunir - Is 66, 18-21': {
    etapa: 'Precatecumenado'
  },
  'A la cena del cordero - Himno': {
    etapa: 'Eleccion'
  },
  'Abbaá Padre - Rm 8, 15-17': {
    etapa: 'Eleccion'
  },
  'Bendito sea Dios - Ef 1, 3-13': {
    etapa: 'Eleccion'
  },
  'Como condenados a muerte - 1 Co 4, 9': {
    etapa: 'Eleccion'
  },
  'Como destila la miel - Oda 40 de Salomon': {
    etapa: 'Eleccion'
  },
  'Como lirio entre los cardos - Ct 1, 13ss': {
    etapa: 'Eleccion'
  },
  'El Espiritu del Senor está sobre mi - Lc 4, 18 - Is 61, 1-3': {
    etapa: 'Eleccion'
  },
  'El mismo Dios - 2 Co 4, 6-12': {
    etapa: 'Eleccion'
  },
  'En una noche oscura - San Juan de la Cruz': {
    etapa: 'Eleccion'
  },
  'Escuchad islas lejanas - Is 49, 1-16': {
    etapa: 'Eleccion'
  },
  'Extiendo mis manos - Oda 27 de Salomon': {
    etapa: 'Eleccion'
  },
  'Hermosa eres, amiga mia - Ct 6; 7': {
    etapa: 'Eleccion'
  },
  'Himno a la caridad - 1 Co 13, 1-13': {
    etapa: 'Eleccion'
  },
  'Himno a la cruz gloriosa - Himno': {
    etapa: 'Eleccion'
  },
  'Jesus recorria las ciudades - Mt 9, 35ss': {
    etapa: 'Eleccion'
  },
  'La cordera de Dios - Mt 1, 18ss': {
    etapa: 'Eleccion'
  },
  'La paloma volo - Oda 24 de Salomon': {
    etapa: 'Eleccion'
  },
  'La voz de mi amado - Ct 2, 8-17': {
    etapa: 'Eleccion'
  },
  'Las armas de la luz - Ef 6, 11ss': {
    etapa: 'Eleccion'
  },
  'No resistáis al mal - Mt 5, 38ss': {
    etapa: 'Eleccion'
  },
  'No sufras por los malvados - Sal 37 (36)': {
    etapa: 'Eleccion'
  },
  'Noli me tangere - Jn 20, 15-17': {
    etapa: 'Eleccion'
  },
  'Sermon de la montana - Lc 6, 20-38': {
    etapa: 'Eleccion'
  },
  'Aleluya Pascual': {
    etapa: 'Liturgia'
  },
  'Aleluya interleccional antes del Evangelio': {
    etapa: 'Liturgia'
  },
  'Amen, amen, amen - Ap 7, 12-14': {
    etapa: 'Liturgia'
  },
  'Anafora de la Sal': {
    etapa: 'Liturgia'
  },
  'Antifona interleccional para el tiempo de Cuaresma': {
    etapa: 'Liturgia'
  },
  'Bendicion del agua': {
    etapa: 'Liturgia'
  },
  'Bendicion penitencial - oracion conclusiva de accion de gracias': {
    etapa: 'Liturgia'
  },
  'Credo - Simbolo apostolico': {
    etapa: 'Liturgia'
  },
  'Gloria a Dios en lo alto del cielo - Himno liturgico': {
    etapa: 'Liturgia'
  },
  'Letanas penitenciales II': {
    etapa: 'Liturgia'
  },
  'Letania del Cordero de Dios - Himno Agnus Dei': {
    etapa: 'Liturgia'
  },
  'Letanias bautismales de los santos': {
    etapa: 'Liturgia'
  },
  'Letanias penitenciales I': {
    etapa: 'Liturgia'
  },
  'Padre Nuestro': {
    etapa: 'Liturgia'
  },
  'Plegaria Eucaristica II - Anamnesis modelo I': {
    etapa: 'Liturgia'
  },
  'Plegaria Eucaristica II - Consagracion modelo I': {
    etapa: 'Liturgia'
  },
  'Plegaria Eucaristica II - Consagracion modelo II': {
    etapa: 'Liturgia'
  },
  'Plegaria Eucaristica II - Prefacio modelo I': {
    etapa: 'Liturgia'
  },
  'Plegaria Eucaristica II - Prefacio modelo II (1986)': {
    etapa: 'Liturgia'
  },
  'Plegaria Eucaristica IV - Prefacio (1988)': {
    etapa: 'Liturgia'
  },
  'Prefacio Pascual I': {
    etapa: 'Liturgia'
  },
  'Pregon Pascual': {
    etapa: 'Liturgia'
  },
  'Santo 1982 - Tiempo Ordinario': {
    etapa: 'Liturgia'
  },
  'Santo 1988 - Tiempo Ordinario': {
    etapa: 'Liturgia'
  },
  'Santo Hebreo - Cuaresma': {
    etapa: 'Liturgia'
  },
  'Santo Palestina 74 - Pascua': {
    etapa: 'Liturgia'
  },
  'Santo Palomeras 65 - Adviento y Navidad': {
    etapa: 'Liturgia'
  },
  'Santo Roma 77 - Tiempo Ordinario': {
    etapa: 'Liturgia'
  },
  'Secuencia del Corpus Christi': {
    etapa: 'Liturgia'
  },
  'Te deum - Himno': {
    etapa: 'Liturgia'
  }
};

export default Indice;
