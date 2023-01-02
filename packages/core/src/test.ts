import { SongsParser } from './SongsParser';
import { PdfStyles } from './common';

const p = new SongsParser(PdfStyles);
const result = p.getForRender(
  `La-            Sol         La-
C. Tu es bénie, Marie,
                                 Sol                   La-
entre toutes les femmes, Marie !
                           Sol         La-
Béni est ton fruit, Marie,
                             Sol        La-
le fruit de ton sein, Jésus.
       Fa                       Mi
Marie, toi, tu as cru !

                                            La-
A. ET COMMENT SE PEUT-IL

QUE LA MÈRE DU SEIGNEUR
                    Sol                           La-
VIENNE À MOI, VIENNE À MOI ?
repeat

column
                                            Mi
C. À peine ai-je entendu ta voix,
                   Re-                                                     Mi
quelque chose a bougé au dedans de moi,
                Re-                                Mi 
mon enfant a tressailli de joie !

       La-                                             Fa
A. MARIE, BIENHEUREUSE MARIE,
                                                                               Mi               
TOI TU AS CRU À LA PAROLE DU SEIGNEUR !
                                            La-
ET COMMENT SE PEUT-IL

QUE LA MÈRE DU SEIGNEUR
                      Sol                            La-
VIENNE À MOI, VIENNE À MOI ?
`,
  'fr'
);

console.log(result);
