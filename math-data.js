/**
 * CAHIER DE VACANCES - TERMINALE SPÉ MATHS
 * Base de données de contenu pédagogique (Cours, Exercices, Quiz)
 * Contient 7 chapitres (dont Variables Aléatoires) et 3 exercices par niveau (9 par chapitre)
 */

const CHAPTERS_DATA = [
    {
        id: 1,
        title: "Second Degré",
        tag: "Algèbre",
        desc: "Maîtriser l'outil fondamental du second degré : forme canonique, résolution d'équations et inéquations, signe et factorisation.",
        cours: `
            <p>Un trinôme du second degré est une fonction $f$ définie sur $\\mathbb{R}$ par : 
            $$f(x) = ax^2 + bx + c$$ 
            où $a$, $b$ et $c$ sont des réels avec $a \\neq 0$.</p>

            <h4>1. Forme Canonique</h4>
            <p>Tout trinôme du second degré peut s'écrire sous sa <strong>forme canonique</strong> :
            $$f(x) = a(x - \\alpha)^2 + \\beta$$
            avec :
            $$\\alpha = -\\frac{b}{2a} \\quad \\text{et} \\quad \\beta = f(\\alpha) = -\\frac{b^2 - 4ac}{4a}$$</p>
            <p>Le point $S(\\alpha ; \\beta)$ est le <strong>sommet de la parabole</strong> représentant $f$.</p>

            <div class="math-formula-box">
                <strong>Propriété (Sens de variation) :</strong><br>
                • Si $a > 0$, la parabole est orientée "vers le haut" (les branches montent). La fonction admet un <strong>minimum</strong> en $\\alpha$, égal à $\\beta$.<br>
                • Si $a < 0$, la parabole est orientée "vers le bas" (les branches descendent). La fonction admet un <strong>maximum</strong> en $\\alpha$, égal à $\\beta$.
            </div>

            <h4>2. Résolution d'Équations : le Discriminant</h4>
            <p>Pour résoudre l'équation $ax^2 + bx + c = 0$, on calcule le <strong>discriminant</strong> :
            $$\\Delta = b^2 - 4ac$$</p>

            <div class="math-formula-box">
                • <strong>Si $\\Delta < 0$ :</strong> Pas de solution réelle. Le trinôme ne se factorise pas.<br>
                • <strong>Si $\\Delta = 0$ :</strong> Une unique solution double : $x_0 = -\\frac{b}{2a}$. Le trinôme se factorise sous la forme $a(x-x_0)^2$.<br>
                • <strong>Si $\\Delta > 0$ :</strong> Deux solutions distinctes :
                $$x_1 = \\frac{-b - \\sqrt{\\Delta}}{2a} \\quad \\text{et} \\quad x_2 = \\frac{-b + \\sqrt{\\Delta}}{2a}$$
                Le trinôme se factorise sous la forme $a(x-x_1)(x-x_2)$.
            </div>

            <h4>3. Signe du Trinôme</h4>
            <p>La règle d'or pour le signe d'un trinôme du second degré est : <strong>le trinôme est toujours du signe de $a$ à l'extérieur des racines</strong> (et du signe de $-a$ entre les racines s'il y en a deux).</p>
            <p>• Si $\\Delta < 0$ : Le trinôme est du signe de $a$ partout.<br>
            • Si $\\Delta = 0$ : Le trinôme est du signe de $a$ partout, et s'annule en $x_0$.<br>
            • Si $\\Delta > 0$ : Le trinôme est du signe de $a$ sur $]-\\infty ; x_1[ \\cup ]x_2 ; +\\infty[$ (en supposant $x_1 < x_2$) et du signe de $-a$ sur $]x_1 ; x_2[$.</p>
        `,
        widget: {
            type: "second_degre",
            params: [
                { name: "a", min: -5, max: 5, step: 0.5, default: 1 },
                { name: "b", min: -8, max: 8, step: 0.5, default: -2 },
                { name: "c", min: -6, max: 6, step: 0.5, default: -3 }
            ],
            instructions: "Modifiez les curseurs pour changer $a$, $b$, et $c$. Regardez comment bougent les racines réelles $x_1, x_2$ et la valeur du discriminant $\\Delta$."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "On donne le trinôme $P(x) = 3x^2 - 5x + 2$. Déterminez le nombre de solutions réelles de l'équation $P(x) = 0$.",
                        placeholder: "Ex: 0, 1 ou 2",
                        answer: "2",
                        hint: "Calculez le discriminant $\\Delta = b^2 - 4ac$ en identifiant bien $a = 3$, $b = -5$ et $c = 2$. Son signe vous donnera le nombre de racines.",
                        solution: "On calcule le discriminant : $\\Delta = (-5)^2 - 4 \\times 3 \\times 2 = 25 - 24 = 1$. Puisque $\\Delta > 0$, il y a exactement <strong>2 solutions</strong>."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit le trinôme $Q(x) = x^2 + 6x + 9$. Calculez la valeur de son discriminant $\\Delta$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "0",
                        hint: "Utilisez la formule $\\Delta = b^2 - 4ac$ avec $a=1$, $b=6$ et $c=9$.",
                        solution: "Pour $x^2 + 6x + 9$ : $\\Delta = 6^2 - 4 \\times 1 \\times 9 = 36 - 36 = 0$. Le discriminant vaut <strong>0</strong>."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Le trinôme $R(x) = -2x^2 + 4x - 5$ admet-il des racines réelles ?",
                        choices: [
                            "Oui, deux racines distinctes",
                            "Oui, une racine double",
                            "Non, aucune racine réelle",
                            "On ne peut pas savoir"
                        ],
                        answer: 2,
                        hint: "Calculez $\\Delta$. Si $\\Delta < 0$, il n'admet aucune racine réelle.",
                        solution: "On calcule $\\Delta = 4^2 - 4 \\times (-2) \\times (-5) = 16 - 40 = -24$. Comme $\\Delta < 0$, le trinôme n'admet <strong>aucune racine réelle</strong>."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Résolvez l'équation $x^2 - 4x + 3 = 0$. Saisissez la <strong>plus grande</strong> des deux racines réelles.",
                        placeholder: "Entrez un nombre entier",
                        answer: "3",
                        hint: "$\\Delta = (-4)^2 - 4 \\times 1 \\times 3 = 4$. Les racines sont $x_1 = \\frac{4 - 2}{2} = 1$ et $x_2 = \\frac{4 + 2}{2} = 3$. Saisissez la plus grande.",
                        solution: "Le discriminant vaut $\\Delta = 4$. Les solutions sont $x_1 = 1$ et $x_2 = 3$. La plus grande est <strong>3</strong>."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Trouvez la racine double de l'équation $4x^2 - 12x + 9 = 0$.",
                        placeholder: "Entrez un nombre décimal (ex: 1.5)",
                        answer: "1.5",
                        hint: "Ici $\\Delta = 0$. L'unique racine double est donnée par la formule $x_0 = -\\frac{b}{2a}$.",
                        solution: "$\\Delta = (-12)^2 - 4 \\times 4 \\times 9 = 144 - 144 = 0$. L'unique racine double est $x_0 = -\\frac{-12}{2 \\times 4} = \\frac{12}{8} = 1,5$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Quel est l'ensemble des solutions de l'inéquation $x^2 - 5x + 4 < 0$ ?",
                        choices: [
                            "$S = ]-\\infty ; 1[ \\cup ]4 ; +\\infty[$",
                            "$S = [1 ; 4]$",
                            "$S = ]1 ; 4[$",
                            "$S = \\mathbb{R}$"
                        ],
                        answer: 2,
                        hint: "Les racines de $x^2 - 5x + 4 = 0$ sont $1$ et $4$. Le trinôme est strictement négatif (signe contraire de $a=1$) entre les racines.",
                        solution: "Les racines du trinôme sont $x_1=1$ et $x_2=4$. Puisque le coefficient $a = 1 > 0$, le trinôme est strictement négatif à l'intérieur des racines, soit sur l'intervalle ouvert <strong>$]1 ; 4[$</strong>."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Un éleveur souhaite créer un enclos rectangulaire adossé à un grand mur. Il dispose pour cela de 40 mètres de grillage. S'il nomme $x$ la largeur de l'enclos (perpendiculaire au mur), l'aire de l'enclos est modélisée par la fonction $A(x) = -2x^2 + 40x$ pour $x \\in [0 ; 20]$.<br>Quelle valeur de $x$ (en mètres) maximise l'aire de cet enclos ?",
                        placeholder: "Entrez la largeur en mètres",
                        answer: "10",
                        hint: "Le maximum d'un trinôme $ax^2+bx+c$ avec $a < 0$ est atteint au sommet en $x = \\alpha = -\\frac{b}{2a}$. Identifiez $a$ et $b$.",
                        solution: "L'aire est donnée par $A(x) = -2x^2 + 40x$ avec $a = -2$ et $b = 40$. Le maximum est atteint en $\\alpha = -\\frac{b}{2a} = -\\frac{40}{2 \\times (-2)} = 10$ mètres."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Une entreprise produit des objets. Le bénéfice réalisé (en euros) en fonction du nombre $x$ d'objets fabriqués est modélisé par $B(x) = -x^2 + 100x - 900$.<br>Déterminez le nombre d'objets minimum à fabriquer pour que l'entreprise commence à faire un bénéfice (c'est-à-dire $B(x) \\ge 0$).",
                        placeholder: "Entrez le nombre d'objets entier",
                        answer: "10",
                        hint: "Résolvez l'équation $-x^2 + 100x - 900 = 0$. Le bénéfice est positif entre les deux racines trouvées. Prenez la plus petite pour le seuil minimum.",
                        solution: "On calcule $\\Delta = 100^2 - 4 \\times (-1) \\times (-900) = 10000 - 3600 = 6400$. Les racines sont $x_1 = \\frac{-100 - 80}{-2} = 90$ et $x_2 = \\frac{-100 + 80}{-2} = 10$. Le bénéfice est positif pour $x \\in [10 ; 90]$. La quantité minimale est donc de <strong>10 objets</strong>."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "On considère une parabole d'équation $y = ax^2 + bx + c$. On sait que son sommet a pour coordonnées $S(2 ; 5)$ et qu'elle passe par le point $P(0 ; 1)$. Quelle est la valeur du coefficient $a$ ?",
                        choices: [
                            "$a = -1$",
                            "$a = 1$",
                            "$a = -2$",
                            "$a = -0.5$"
                        ],
                        answer: 0,
                        hint: "Utilisez la forme canonique $y = a(x-\\alpha)^2 + \\beta$. Ici $\\alpha=2$ et $\\beta=5$. Remplacez par le point $P(0 ; 1)$ pour trouver $a$.",
                        solution: "La forme canonique est $y = a(x-2)^2 + 5$. En utilisant le point $P(0 ; 1)$ : $1 = a(0-2)^2 + 5 \\Rightarrow 1 = 4a + 5 \\Rightarrow 4a = -4 \\Rightarrow a = -1$."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Quel est le signe du trinôme $P(x) = -x^2 + 2x - 5$ sur $\\mathbb{R}$ ?",
                choices: [
                    "Toujours strictement positif ($+$)",
                    "Toujours strictement négatif ($-$)",
                    "Positif à l'extérieur des racines, négatif à l'intérieur",
                    "Négatif à l'extérieur des racines, positif à l'intérieur"
                ],
                answer: 1,
                explanation: "Calculons le discriminant de $P(x)$ : $\\Delta = 2^2 - 4 \\times (-1) \\times (-5) = 4 - 20 = -16$. Le discriminant $\\Delta < 0$, donc le trinôme ne s'annule jamais sur $\\mathbb{R}$ et est du signe constant de $a = -1$. Ainsi, $P(x)$ est strictement négatif pour tout réel $x$."
            },
            {
                question: "Si l'équation $ax^2+bx+c = 0$ admet deux racines distinctes $x_1$ et $x_2$, quelle est la formule pour leur produit ?",
                choices: [
                    "$\\frac{b}{a}$",
                    "$-\\frac{b}{a}$",
                    "$\\frac{c}{a}$",
                    "$-\\frac{c}{a}$"
                ],
                answer: 2,
                explanation: "Propriété du cours : pour tout trinôme du second degré ayant deux racines $x_1$ et $x_2$, leur somme $S = x_1 + x_2 = -\\frac{b}{a}$ et leur produit $P = x_1 \\times x_2 = \\frac{c}{a}$."
            },
            {
                question: "Soit la fonction $f(x) = 2(x - 3)^2 + 4$. Quel est le sommet de la parabole représentative de $f$ ?",
                choices: [
                    "$S(-3 ; 4)$",
                    "$S(3 ; 4)$",
                    "$S(3 ; -4)$",
                    "$S(2 ; 4)$"
                ],
                answer: 1,
                explanation: "La forme canonique est $a(x-\\alpha)^2+\\beta$. Ici, $a=2$, $\\alpha = 3$ et $\\beta = 4$. Le sommet $S$ a pour coordonnées $(\\alpha ; \\beta)$, soit $S(3 ; 4)$."
            },
            {
                question: "On veut résoudre $2x^2 - 8x + 8 = 0$. Quelle affirmation est vraie ?",
                choices: [
                    "L'équation n'a pas de solution",
                    "L'équation admet deux solutions distinctes",
                    "L'équation admet une unique solution double $x_0 = 2$",
                    "L'équation admet une unique solution double $x_0 = -2$"
                ],
                answer: 2,
                explanation: "On calcule $\\Delta = (-8)^2 - 4 \\times 2 \\times 8 = 64 - 64 = 0$. $\\Delta = 0$, donc unique solution réelle double : $x_0 = -\\frac{b}{2a} = -\\frac{-8}{2 \\times 2} = \\frac{8}{4} = 2$."
            },
            {
                question: "Pour quelles valeurs de $x$ le trinôme $x^2 - 9$ le trinôme est-il strictement négatif ?",
                choices: [
                    "$x \\in ]-9 ; 9[$",
                    "$x \\in ]-\\infty ; -3[ \\cup ]3 ; +\\infty[$",
                    "$x \\in ]-3 ; 3[$",
                    "Jamais"
                ],
                answer: 2,
                explanation: "$x^2 - 9 = (x-3)(x+3)$. Ses racines sont $-3$ et $3$. Le coefficient devant $x^2$ est $a=1 > 0$. Le trinôme est du signe de $-a$ (donc négatif) entre les racines, ce qui correspond à l'intervalle $]-3 ; 3[$."
            }
        ]
    },
    {
        id: 2,
        title: "Dérivation & Variations",
        tag: "Analyse",
        desc: "Approfondir la notion de taux de variation, de nombre dérivé, de tangente et utiliser la dérivée pour étudier les variations d'une fonction.",
        cours: `
            <p>La dérivation est l'outil phare pour analyser les variations et la géométrie des courbes représentatives de fonctions.</p>

            <h4>1. Nombre dérivé et Tangente</h4>
            <p>Soit $f$ une fonction définie sur un intervalle $I$ et $a \\in I$. Le <strong>taux de variation</strong> de $f$ entre $a$ et $a+h$ (avec $h \\neq 0$) est :
            $$\\tau(h) = \\frac{f(a+h) - f(a)}{h}$$</p>
            <p>Si ce taux de variation tend vers un nombre réel unique lorsque $h$ tend vers 0, on dit que $f$ est dérivable en $a$. Cette limite est appelée le <strong>nombre dérivé</strong> de $f$ en $a$, notée $f'(a)$ :
            $$f'(a) = \\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}$$</p>

            <div class="math-formula-box">
                <strong>Équation de la Tangente :</strong><br>
                La tangente $T_a$ à la courbe de $f$ au point d'abscisse $a$ a pour équation :
                $$y = f'(a)(x - a) + f(a)$$
                $f'(a)$ représente graphiquement le <strong>coefficient directeur</strong> de cette tangente.
            </div>

            <h4>2. Formules des fonctions dérivées usuelles</h4>
            <table class="math-table" style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                        <th style="padding: 8px;">Fonction $f(x)$</th>
                        <th style="padding: 8px;">Dérivée $f'(x)$</th>
                        <th style="padding: 8px;">Intervalle de validité</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 8px;">$k$ (constante)</td>
                        <td style="padding: 8px;">$0$</td>
                        <td style="padding: 8px;">$\\mathbb{R}$</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 8px;">$x$</td>
                        <td style="padding: 8px;">$1$</td>
                        <td style="padding: 8px;">$\\mathbb{R}$</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 8px;">$x^n$ ($n \\in \\mathbb{Z}^*$)</td>
                        <td style="padding: 8px;">$n x^{n-1}$</td>
                        <td style="padding: 8px;">$\\mathbb{R}$ (si $n>0$), $\\mathbb{R}^*$ (si $n<0$)</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 8px;">$\\frac{1}{x}$</td>
                        <td style="padding: 8px;">$-\\frac{1}{x^2}$</td>
                        <td style="padding: 8px;">$\\mathbb{R}^*$</td>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 8px;">$\\sqrt{x}$</td>
                        <td style="padding: 8px;">$\\frac{1}{2\\sqrt{x}}$</td>
                        <td style="padding: 8px;">$]0 ; +\\infty[$</td>
                    </tr>
                </tbody>
            </table>

            <h4>3. Opérations sur les Dérivées</h4>
            <p>Soient $u$ et $v$ deux fonctions dérivables sur un intervalle $I$ et $k$ un réel :
            $$\\text{Somme : } (u+v)' = u' + v' \\quad | \\quad \\text{Produit par réel : } (ku)' = ku'$$
            $$\\text{Produit : } (uv)' = u'v + uv'$$
            $$\\text{Inverse : } \\left(\\frac{1}{v}\\right)' = -\\frac{v'}{v^2} \\quad | \\quad \\text{Quotient : } \\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$$</p>

            <h4>4. Signe de la Dérivée et Variations</h4>
            <p>Le théorème fondamental de l'analyse lie le signe de $f'$ aux variations de $f$ :</p>
            <div class="math-formula-box">
                • Si $f'(x) > 0$ sur $I$, alors $f$ est <strong>strictement croissante</strong> sur $I$.<br>
                • Si $f'(x) < 0$ sur $I$, alors $f$ est <strong>strictement décroissante</strong> sur $I$.<br>
                • Si $f'(x) = 0$ sur $I$, alors $f$ est <strong>constante</strong> sur $I$.
            </div>
        `,
        widget: {
            type: "derivation",
            params: [
                { name: "x0", min: -2, max: 4, step: 0.1, default: 1 }
            ],
            instructions: "Déplacez l'abscisse du point $A$ en faisant glisser le curseur de $x_0$. Regardez comment la droite tangente s'ajuste sur la parabole de $f(x) = x^2 - 2x$."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Soit la fonction $f(x) = 3x^2 - 5x + 4$. Calculez la valeur exacte de son nombre dérivé en $x = 2$, c'est-à-dire $f'(2)$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "7",
                        hint: "Calculez d'abord la dérivée générale $f'(x) = 6x - 5$, puis remplacez $x$ par 2.",
                        solution: "$f'(x) = 6x - 5$. Pour $x=2$ : $f'(2) = 6 \\times 2 - 5 = 7$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit la fonction $g(x) = x^3 - 2x$. Calculez son nombre dérivé en $x = 3$, c'est-à-dire $g'(3)$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "25",
                        hint: "Dérivez $g(x) = x^3 - 2x$, qui donne $g'(x) = 3x^2 - 2$, puis calculez pour $x=3$.",
                        solution: "$g'(x) = 3x^2 - 2$. En $x=3$ : $g'(3) = 3 \\times 3^2 - 2 = 27 - 2 = 25$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Quelle est la fonction dérivée de la fonction $h(x) = \\frac{1}{x} + 4x$ sur $]0 ; +\\infty[$ ?",
                        choices: [
                            "$h'(x) = -\\frac{1}{x^2} + 4$",
                            "$h'(x) = \\frac{1}{x^2} + 4$",
                            "$h'(x) = -\\frac{1}{x^2} + 4x$",
                            "$h'(x) = -\\frac{1}{x} + 4$"
                        ],
                        answer: 0,
                        hint: "Dérivez chaque terme séparément. La dérivée de $1/x$ est $-1/x^2$ et la dérivée de $4x$ est $4$.",
                        solution: "La dérivée est donnée par : $h'(x) = -\\frac{1}{x^2} + 4$."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "qcm",
                        statement: "On considère la fonction $f(x) = x^2$ définie sur $\\mathbb{R}$. Déterminez l'équation de la tangente à la courbe au point d'abscisse $a = 3$.",
                        choices: [
                            "$y = 6x - 9$",
                            "$y = 6x - 3$",
                            "$y = 3x - 9$",
                            "$y = 6x + 9$"
                        ],
                        answer: 0,
                        hint: "Tangente : $y = f'(a)(x-a) + f(a)$. Avec $f(3)=9$, $f'(3)=6$.",
                        solution: "$y = 6(x-3) + 9 = 6x - 18 + 9 = 6x - 9$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit la fonction $k(x) = 2x^2 + 5x$. Déterminez l'abscisse $x$ du point de la courbe de $k$ où la tangente est parallèle à la droite d'équation $y = 13x - 2$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "2",
                        hint: "La tangente est parallèle à la droite si et seulement si son coefficient directeur $k'(x)$ est égal à celui de la droite, soit $k'(x) = 13$.",
                        solution: "On calcule $k'(x) = 4x + 5$. On résout $4x + 5 = 13 \\Rightarrow 4x = 8 \\Rightarrow x = 2$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Si la dérivée d'une fonction $f$ vérifie $f'(x) = (x-2)(x-5)$ sur $\\mathbb{R}$, sur quel intervalle la fonction $f$ est-elle strictement décroissante ?",
                        choices: [
                            "$x \\in ]-\\infty ; 2[$",
                            "$x \\in ]2 ; 5[$",
                            "$x \\in ]5 ; +\\infty[$",
                            "Nulle part"
                        ],
                        answer: 1,
                        hint: "Une fonction est décroissante là où sa dérivée est strictement négative. Étudiez le signe du trinôme de second degré $(x-2)(x-5)$.",
                        solution: "Le trinôme $f'(x) = (x-2)(x-5)$ a pour racines $2$ et $5$. Il est strictement négatif (signe contraire de $a=1 > 0$) entre ses racines, soit sur l'intervalle **$]2 ; 5[$**. Ainsi, $f$ y est strictement décroissante."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Une entreprise produit des batteries. Le coût total en milliers d'euros de fabrication de $x$ milliers de batteries est donné par $C(x) = x^3 - 6x^2 + 15x + 10$ pour $x \\in [0; 5]$. Le coût marginal est représenté par sa dérivée $C'(x)$. Déterminez pour quelle quantité de batteries $x$ produite le coût marginal est <strong>minimal</strong>.",
                        placeholder: "Entrez la valeur de x",
                        answer: "2",
                        hint: "Calculez le coût marginal $f(x) = C'(x)$. Il s'agit d'un trinôme de second degré. Trouvez son sommet $x = -\\frac{b}{2a}$.",
                        solution: "$C'(x) = 3x^2 - 12x + 15$. Il s'agit d'un trinôme de second degré avec $a=3$ et $b=-12$. Il admet un minimum au sommet en $x = -\\frac{-12}{2 \\times 3} = 2$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit la fonction $g(x) = -x^3 + 3x^2 + 9x - 5$. Elle admet un maximum local en une valeur $x_0$. Calculez la valeur de ce maximum local (c'est-à-dire l'image $g(x_0)$).",
                        placeholder: "Entrez un nombre entier",
                        answer: "22",
                        hint: "1) Calculez $g'(x) = -3x^2 + 6x + 9$. 2) Trouvez ses racines (les valeurs qui annulent la dérivée). 3) Dressez le tableau de variations pour identifier le maximum local, puis calculez son image.",
                        solution: "$g'(x) = -3x^2 + 6x + 9 = -3(x-3)(x+1)$. Les racines sont $-1$ et $3$. Le maximum local est atteint en $x_0 = 3$. Son image vaut $g(3) = -(3)^3 + 3(3)^2 + 9(3) - 5 = 22$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "On souhaite concevoir une boîte cylindrique d'un volume constant de 1 litre ($1000\\text{ cm}^3$). On cherche à minimiser la surface de métal utilisée. La formule de la surface totale en fonction du rayon $r$ est $S(r) = 2\\pi r^2 + \\frac{2000}{r}$. Quelle est la valeur de $r$ qui minimise cette surface ?",
                        choices: [
                            "$r \\approx 5,4\\text{ cm}$",
                            "$r \\approx 3,2\\text{ cm}$",
                            "$r \\approx 10,0\\text{ cm}$",
                            "$r \\approx 8,6\\text{ cm}$"
                        ],
                        answer: 0,
                        hint: "Calculez la dérivée $S'(r) = 4\\pi r - \\frac{2000}{r^2}$. Cherchez pour quelle valeur de $r$ cette dérivée s'annule : $4\\pi r^3 = 2000 \\Rightarrow r^3 = \\frac{500}{\\pi}$.",
                        solution: "$S'(r) = 0 \\iff 4\\pi r^3 = 2000 \\iff r = \\sqrt[3]{\\frac{500}{\\pi}} \\approx 5,42\\text{ cm}$. Le rayon optimal est d'environ <strong>5.4 cm</strong>."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Soit $f$ une fonction croissante et dérivable sur un intervalle $I$. Que peut-on dire de sa dérivée $f'$ ?",
                choices: [
                    "f'(x) est négative ou nulle sur I",
                    "f'(x) est positive ou nulle sur I",
                    "f'(x) s'annule obligatoirement sur I",
                    "f'(x) est décroissante sur I"
                ],
                answer: 1,
                explanation: "Par théorème du cours, si une fonction $f$ est croissante sur un intervalle $I$, alors sa dérivée $f'$ est positive ou nulle sur cet intervalle. Inversement, une dérivée strictement positive implique la stricte croissance."
            },
            {
                question: "Calculer la dérivée de la fonction définie sur $\\mathbb{R}^*$ par $f(x) = 4x - \\frac{3}{x}$.",
                choices: [
                    "f'(x) = 4 - \\frac{3}{x^2}",
                    "f'(x) = 4 + \\frac{3}{x^2}",
                    "f'(x) = 4 + 3x^2",
                    "f'(x) = 4 - 3x^2"
                ],
                answer: 1,
                explanation: "La fonction s'écrit $f(x) = 4x - 3 \\times \\frac{1}{x}$. En utilisant les formules de dérivation : la dérivée de $4x$ est $4$ ; la dérivée de $\\frac{1}{x}$ est $-\\frac{1}{x^2}$. On a donc : $f'(x) = 4 - 3 \\times \\left(-\\frac{1}{x^2}\\right) = 4 + \\frac{3}{x^2}$."
            },
            {
                question: "Si la dérivée d'une fonction $f$ s'annule en un point $x_0$ sans changer de signe, alors :",
                choices: [
                    "Il y a un extremum local en $x_0$",
                    "Il y a un minimum local en $x_0$",
                    "Il n'y a pas d'extremum local en $x_0$ (c'est un point d'inflexion)",
                    "La fonction est constante partout"
                ],
                answer: 2,
                explanation: "Pour qu'il y ait un extremum local (maximum ou minimum), il est impératif que la dérivée s'annule ET change de signe en ce point. Par exemple, la fonction cube $x \\mapsto x^3$ a une dérivée qui s'annule en 0 ($3x^2 = 0$), mais sa dérivée reste toujours positive : elle n'admet aucun extremum en 0, c'est un point d'inflexion."
            },
            {
                question: "On considère une fonction $g$ dont le tableau de variations montre une flèche qui descend puis remonte. On sait que sa dérivée $g'$ s'annule en $x = -1$. Quel est le signe de $g'$ sur $] -\\infty ; -1 [ $ ?",
                choices: [
                    "Positif ($+$)",
                    "Négatif ($-$)",
                    "Nul ($0$)",
                    "On ne peut pas savoir"
                ],
                answer: 1,
                explanation: "La fonction descend sur l'intervalle $]-\\infty ; -1[$, ce qui signifie qu'elle est décroissante. Une fonction dérivable est décroissante sur un intervalle si et seulement si sa dérivée y est négative."
            },
            {
                question: "Quelle est la dérivée de la fonction produit $f(x) = x\\sqrt{x}$ sur $]0 ; +\\infty[$ ?",
                choices: [
                    "f'(x) = \\frac{1}{2\\sqrt{x}}",
                    "f'(x) = \\sqrt{x} + \\frac{x}{2\\sqrt{x}} = \\frac{3}{2}\\sqrt{x}",
                    "f'(x) = \\frac{\\sqrt{x}}{2}",
                    "f'(x) = 1 \\times \\frac{1}{2\\sqrt{x}}"
                ],
                answer: 1,
                explanation: "On utilise la formule de la dérivée d'un produit $(uv)' = u'v + uv'$ avec $u(x)=x$ ($u'(x)=1$) et $v(x)=\\sqrt{x}$ ($v'(x)=\\frac{1}{2\\sqrt{x}}$). On obtient : $f'(x) = 1 \\times \\sqrt{x} + x \\times \\frac{1}{2\\sqrt{x}} = \\sqrt{x} + \\frac{\\sqrt{x}}{2} = \\frac{3}{2}\\sqrt{x}$."
            }
        ]
    },
    {
        id: 3,
        title: "Suites Numériques",
        tag: "Algèbre",
        desc: "Étudier les modes de génération des suites, maîtriser les caractéristiques des suites arithmétiques et géométriques, calculer des sommes.",
        cours: `
            <p>Une suite numérique est une liste ordonnée infinie de nombres réels. Elle est notée $(u_n)_{n \\in \\mathbb{N}}$ ou simplement $(u_n)$.</p>

            <h4>1. Définitions et Variations</h4>
            <p>• <strong>Formule explicite :</strong> Chaque terme est calculé directement à partir de son rang $n$ : $u_n = f(n)$.<br>
            • <strong>Formule de récurrence :</strong> Chaque terme est calculé à partir du précédent : $u_{n+1} = g(u_n)$.</p>
            <p>Pour étudier les <strong>variations</strong> d'une suite, on étudie généralement le signe de la différence :
            $$u_{n+1} - u_n$$
            Si $u_{n+1} - u_n \\ge 0$ pour tout $n$, la suite $(u_n)$ est <strong>croissante</strong>.</p>

            <h4>2. Les Suites Arithmétiques</h4>
            <p>Une suite $(u_n)$ est arithmétique s'il existe un réel $r$ appelé <strong>raison</strong> tel que :
            $$u_{n+1} = u_n + r$$</p>

            <div class="math-formula-box">
                <strong>Propriétés clés :</strong><br>
                • <strong>Formule explicite :</strong> $u_n = u_0 + nr$ ou plus généralement $u_n = u_p + (n-p)r$.<br>
                • <strong>Somme des termes :</strong> La somme de termes consécutifs est donnée par :
                $$S = \\text{Nombre de termes} \\times \\frac{\\text{Premier terme} + \\text{Dernier terme}}{2}$$
                Par exemple : $1 + 2 + ... + n = \\frac{n(n+1)}{2}$.
            </div>

            <h4>3. Les Suites Géométriques</h4>
            <p>Une suite $(v_n)$ est géométrique s'il existe un réel $q \\neq 0$ appelé <strong>raison</strong> tel que :
            $$v_{n+1} = v_n \\times q$$</p>

            <div class="math-formula-box">
                <strong>Propriétés clés :</strong><br>
                • <strong>Formule explicite :</strong> $v_n = v_0 \\times q^n$ ou plus généralement $v_n = v_p \\times q^{n-p}$.<br>
                • <strong>Somme des termes :</strong> Si $q \\neq 1$, la somme des termes consécutifs est :
                $$S = \\text{Premier terme} \\times \\frac{1 - q^{\\text{Nombre de termes}}}{1 - q}$$
            </div>
        `,
        widget: {
            type: "suites",
            params: [
                { name: "u0", min: -10, max: 20, step: 1, default: 2 },
                { name: "raison", min: -2, max: 3, step: 0.1, default: 0.5 },
                { name: "type", min: 0, max: 1, step: 1, default: 1 } // 0: arith, 1: geom
            ],
            instructions: "Choisissez le type de suite (0 pour Arithmétique, 1 pour Géométrique). Ajustez le premier terme $u_0$ et la raison $r$ ou $q$ pour visualiser l'évolution des premiers termes $u_0, u_1, ..., u_{10}$."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Soit $(u_n)_{n\\in\\mathbb{N}}$ la suite arithmétique de premier terme $u_0 = 5$ et de raison $r = 3$. Calculez la valeur exacte du terme $u_{10}$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "35",
                        hint: "Utilisez la formule explicite pour une suite arithmétique : $u_n = u_0 + n \\times r$.",
                        solution: "$u_{10} = u_0 + 10r = 5 + 10 \\times 3 = 35$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit $(v_n)$ la suite géométrique de premier terme $v_0 = 2$ et de raison $q = 3$. Calculez la valeur exacte du terme $v_4$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "162",
                        hint: "Utilisez la formule $v_n = v_0 \\times q^n$. Calculez $2 \\times 3^4$.",
                        solution: "$v_4 = v_0 \\times q^4 = 2 \\times 3^4 = 2 \\times 81 = 162$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Quelle est la relation de récurrence d'une suite arithmétique de raison $r = -5$ ?",
                        choices: [
                            "$u_{n+1} = -5u_n$",
                            "$u_{n+1} = u_n - 5$",
                            "$u_{n} = u_0 - 5n$",
                            "$u_{n+1} = u_n + 5$"
                        ],
                        answer: 1,
                        explanation: "Par définition, pour une suite arithmétique, chaque terme s'obtient en ajoutant la raison au terme précédent, soit $u_{n+1} = u_n + r$. Ici $r = -5$, donc $u_{n+1} = u_n - 5$."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Soit $(v_n)$ une suite géométrique à termes positifs telle que $v_1 = 6$ et $v_3 = 54$. Déterminez la raison $q$ de cette suite géométrique.",
                        placeholder: "Entrez la raison q",
                        answer: "3",
                        hint: "On a la formule $v_3 = v_1 \\times q^2$. Remplacez par les valeurs et résolvez.",
                        solution: "$54 = 6 \\times q^2 \\Rightarrow q^2 = 9 \\Rightarrow q = 3$ (la suite étant à termes positifs)."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit $(u_n)$ une suite arithmétique de premier terme $u_0 = 1$ et de raison $r = 2$. Calculez la somme des 10 premiers termes : $S = u_0 + u_1 + ... + u_9$.",
                        placeholder: "Entrez la somme",
                        answer: "100",
                        hint: "S est une somme de termes d'une suite arithmétique. Nombre de termes = 10. Premier terme $u_0 = 1$. Dernier terme $u_9 = 1 + 9 \\times 2 = 19$. Formule : $10 \\times \\frac{1 + 19}{2}$.",
                        solution: "Le dernier terme est $u_9 = 19$. La somme vaut : $S = 10 \\times \\frac{1 + 19}{2} = 10 \\times 10 = 100$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Si $(w_n)$ est une suite géométrique de premier terme $w_0 = 5$ et de raison $q = -2$, comment se comportent les signes des termes successifs ?",
                        choices: [
                            "Ils sont tous positifs",
                            "Ils alternent entre positif et négatif",
                            "Ils sont tous négatifs",
                            "On ne peut pas savoir"
                        ],
                        answer: 1,
                        hint: "Calculez les premiers termes: $w_0 = 5$, $w_1 = -10$, $w_2 = 20$. Observez l'effet de la multiplication par un nombre négatif.",
                        solution: "Puisque la raison $q$ est négative, multiplier à chaque étape par $-2$ va inverser le signe du terme précédent. Les signes sont donc alternés (positif, négatif, positif, négatif...)."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Une réserve compte initialement 1000 oiseaux migrateurs en 2026. On estime que chaque année, 80% des oiseaux reviennent d'une année sur l'autre et que 100 nouveaux oiseaux naissent ou s'installent dans la réserve. La population est modélisée par $p_{n+1} = 0.8p_n + 100$ avec $p_0 = 1000$.<br>Déterminez la valeur numérique de **stabilisation** à long terme de cette population d'oiseaux migrateurs.",
                        placeholder: "Entrez la valeur de stabilisation",
                        answer: "500",
                        hint: "La stabilisation est atteinte lorsque la population ne change plus d'une année sur l'autre, soit $L = 0.8L + 100$. Résolvez cette équation.",
                        solution: "On cherche la valeur de stabilisation $L$ vérifiant l'équation de point fixe : $L = 0.8L + 100 \\Rightarrow 0.2L = 100 \\Rightarrow L = \\frac{100}{0.2} = 500$. La population va donc se stabiliser à <strong>500 oiseaux</strong>."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Un placement financier de 1000 € est rémunéré à un taux d'intérêt composé de 5% par an. Le capital disponible à l'année $n$ est noté $c_n$ (avec $c_0 = 1000$). Chaque année, le client retire 50 € après l'application des intérêts. La relation est $c_{n+1} = 1.05c_n - 50$.<br>Calculez la valeur de son capital (en euros) après 20 ans.",
                        placeholder: "Entrez le capital en euros",
                        answer: "1000",
                        hint: "Calculez le point fixe de la relation de récurrence $L = 1.05L - 50$ pour voir si la suite est constante dès son terme initial.",
                        solution: "Cherchons si la suite est constante : $L = 1.05L - 50 \\Rightarrow 0.05L = 50 \\Rightarrow L = 1000$. Puisque $c_0 = 1000$ (qui est exactement égal au point fixe $L$), la suite $(c_n)$ est constante. Le capital reste donc de <strong>1000 €</strong> après 20 ans."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Un biologiste étudie la propagation d'une bactérie. Il observe qu'une population double toutes les heures. S'il commence avec 100 bactéries, au bout de combien d'heures complètes la population dépassera-t-elle pour la première fois 100 000 bactéries ?",
                        choices: [
                            "10 heures",
                            "8 heures",
                            "14 heures",
                            "11 heures"
                        ],
                        answer: 0,
                        hint: "La population après $n$ heures est modélisée par $u_n = 100 \\times 2^n$. Vous devez chercher le plus petit entier $n$ tel que $100 \\times 2^n > 100000 \\iff 2^n > 1000$.",
                        solution: "On cherche $2^n > 1000$. Nous savons que $2^9 = 512$ et $2^{10} = 1024$. Donc $n = 10$ heures. À $n = 10$, la population est de $100 \\times 1024 = 102400 > 100000$ bactéries."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Quelle est la nature de la suite définie sur $\\mathbb{N}$ par $u_n = 4n - 7$ ?",
                choices: [
                    "Une suite arithmétique de raison 4 et de premier terme $u_0 = -7$",
                    "Une suite arithmétique de raison -7 et de premier terme $u_0 = 4$",
                    "Une suite géométrique de raison 4 et de premier terme $u_0 = -7$",
                    "Une suite qui n'est ni arithmétique ni géométrique"
                ],
                answer: 0,
                explanation: "La forme $u_n = u_0 + nr$ est la forme explicite d'une suite arithmétique. Ici, $u_n = -7 + 4n$. La raison est donc $r = 4$ et le premier terme pour $n=0$ est $u_0 = -7$."
            },
            {
                question: "Quelle est la formule pour calculer la somme des premiers nombres entiers : $S = 1 + 2 + 3 + ... + n$ ?",
                choices: [
                    "$\\frac{n(n-1)}{2}$",
                    "$\\frac{n(n+1)}{2}$",
                    "$n^2$",
                    "$\\frac{n(n+1)(2n+1)}{6}$"
                ],
                answer: 1,
                explanation: "C'est une formule classique d'arithmétique. Il s'agit de la somme des termes d'une suite arithmétique de raison 1 et de premier terme 1. La somme vaut $\\frac{n(n+1)}{2}$."
            },
            {
                question: "Soit la suite géométrique $(w_n)$ de premier terme $w_0 = 3$ et de raison $q = 2$. Quel est le terme $w_5$ ?",
                choices: [
                    "30",
                    "96",
                    "48",
                    "15"
                ],
                answer: 1,
                explanation: "On utilise la formule explicite: $w_5 = w_0 \\times q^5 = 3 \\times 2^5 = 3 \\times 32 = 96$."
            },
            {
                question: "Si une suite $(u_n)$ vérifie la relation $u_{n+1} - u_n = -n^2 - 1$ pour tout entier $n$, que peut-on affirmer ?",
                choices: [
                    "La suite est croissante",
                    "La suite est décroissante",
                    "La suite est constante",
                    "On ne peut pas savoir, cela dépend du premier terme"
                ],
                answer: 1,
                explanation: "Pour tout entier $n \\ge 0$, le carré $n^2$ est positif ou nul. Ainsi, $-n^2 - 1$ est strictement négatif (car au maximum égal à $-1$ pour $n=0$). La différence $u_{n+1} - u_n$ étant négative, la suite $(u_n)$ est donc strictement décroissante."
            },
            {
                question: "On donne la somme $S = 1 + 3 + 9 + 27 + 81 + 243$. À quelle formule de suite correspond-elle ?",
                choices: [
                    "La somme des 6 premiers termes d'une suite arithmétique de raison 3",
                    "La somme des 6 premiers termes d'une suite géométrique de raison 3 et de premier terme 1",
                    "La somme des 5 premiers termes d'une suite géométrique de raison 3",
                    "La somme des carrés de 1 à 6"
                ],
                answer: 1,
                explanation: "Les nombres $1, 3, 9, 27, 81, 243$ sont les puissances successives de 3 : $3^0, 3^1, 3^2, 3^3, 3^4, 3^5$. Il s'agit des 6 premiers termes de la suite géométrique $v_n = 3^n$ (de premier terme $v_0 = 1$ et de raison $q = 3$)."
            }
        ]
    },
    {
        id: 4,
        title: "Fonction Exponentielle",
        tag: "Analyse",
        desc: "Découvrir l'unique fonction égale à sa propre dérivée s'annulant en 0. Maîtriser ses propriétés algébriques et analytiques.",
        cours: `
            <p>La fonction exponentielle est l'une des fonctions les plus importantes en mathématiques et modélise les phénomènes de croissance rapide (biologie, économie, physique).</p>

            <h4>1. Définition de base</h4>
            <p>Il existe une unique fonction dérivable sur $\\mathbb{R}$, notée $\\exp$ (ou $x \\mapsto e^x$), telle que :
            $$\\exp' = \\exp \\quad \\text{et} \\quad \\exp(0) = 1$$</p>

            <h4>2. Propriétés Algébriques</h4>
            <p>La fonction exponentielle transforme les sommes en produits. Pour tous réels $a$ et $b$ et pour tout entier relatif $n$ :</p>
            <div class="math-formula-box">
                • <strong>Relation fondamentale :</strong> $e^{a+b} = e^a \\times e^b$<br>
                • <strong>Inverse :</strong> $e^{-a} = \\frac{1}{e^a}$ et $e^{0} = 1$<br>
                • <strong>Différence :</strong> $e^{a-b} = \\frac{e^a}{e^b}$<br>
                • <strong>Puissance :</strong> $(e^a)^n = e^{na}$
            </div>

            <h4>3. Étude Analytique (Courbe et Variations)</h4>
            <div class="math-formula-box">
                • <strong>Signe :</strong> Pour tout réel $x$, $e^x > 0$. La fonction exponentielle est **strictement positive**.<br>
                • <strong>Variations :</strong> Sa dérivée étant elle-même ($e^x$), elle est strictement positive sur $\\mathbb{R}$. La fonction exponentielle est donc <strong>strictement croissante</strong> sur $\\mathbb{R}$.<br>
                • <strong>Limites aux bornes :</strong>
                $$\\lim_{x \\to -\\infty} e^x = 0 \\quad \\text{et} \\quad \\lim_{x \\to +\\infty} e^x = +\\infty$$
            </div>

            <h4>4. Résolution d'Équations et Inéquations</h4>
            <p>Grâce à sa stricte croissance, l'exponentielle est une fonction injective :
            $$e^a = e^b \\iff a = b$$
            $$e^a < e^b \\iff a < b$$
            En particulier, $e^x = 1 \\iff x = 0$ et $e^x > 1 \\iff x > 0$.</p>

            <h4>5. Dérivée de $e^{u(x)}$</h4>
            <p>Si $u$ est une fonction dérivable sur un intervalle $I$, alors la fonction $f(x) = e^{u(x)}$ est dérivable sur $I$ et :
            $$f'(x) = u'(x) \\times e^{u(x)}$$</p>
        `,
        widget: {
            type: "exponentielle",
            params: [
                { name: "k", min: -2, max: 3, step: 0.2, default: 1 }
            ],
            instructions: "Modifiez le paramètre $k$ avec le curseur pour afficher la courbe de la fonction $f(x) = e^{kx}$. Si $k>0$, la fonction croît extrêmement vite."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "qcm",
                        statement: "Simplifiez au maximum l'expression littérale suivante pour tout réel $x$ :<br>$$A(x) = \\frac{(e^x)^3 \\times e^{-x}}{e^{2x}}$$",
                        choices: [
                            "$A(x) = e^x$",
                            "$A(x) = 1$",
                            "$A(x) = e^{-x}$",
                            "$A(x) = e^{3x}$"
                        ],
                        answer: 1,
                        hint: "Utilisez les formules algébriques des puissances de l'exponentielle : $(e^a)^b = e^{ab}$, $e^a \\times e^b = e^{a+b}$ et $\\frac{e^a}{e^b} = e^{a-b}$.",
                        solution: "$(e^x)^3 \\times e^{-x} = e^{3x} \\times e^{-x} = e^{2x}$. On divise par $e^{2x}$ : $\\frac{e^{2x}}{e^{2x}} = 1$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Calculer la valeur exacte de l'image de 0 par la fonction $f(x) = 4e^x - 3$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "1",
                        hint: "Remplacez $x$ par 0 dans l'expression et sachez que $e^0 = 1$.",
                        solution: "$f(0) = 4e^0 - 3 = 4 \\times 1 - 3 = 1$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Laquelle des expressions suivantes est égale à $e^{-x} \\times e^5$ ?",
                        choices: [
                            "$e^{-5x}$",
                            "$e^{5-x}$",
                            "$e^{x-5}$",
                            "$e^{-x/5}$"
                        ],
                        answer: 1,
                        hint: "Utilisez la formule $e^a \\times e^b = e^{a+b}$ avec $a=-x$ et $b=5$.",
                        solution: "$e^{-x} \\times e^5 = e^{-x+5} = e^{5-x}$."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Résolvez dans $\\mathbb{R}$ l'équation suivante : $e^{2x - 4} = 1$. Saisissez la valeur numérique de la solution $x$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "2",
                        hint: "Rappelez-vous de la propriété du cours : $e^A = 1$ est équivalent à $A = 0$ (car $e^0 = 1$). Posez l'équation correspondante et isolez $x$.",
                        solution: "$e^{2x - 4} = 1 \\iff 2x - 4 = 0 \\iff 2x = 4 \\iff x = 2$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Déterminez la solution de l'équation $e^{3x} \\times e^2 = e^{14}$. Saisissez la valeur entière de $x$.",
                        placeholder: "Entrez la valeur entière de x",
                        answer: "4",
                        hint: "Simplifiez le membre de gauche: $e^{3x} \\times e^2 = e^{3x+2}$. Posez l'égalité des exposants: $3x+2 = 14$.",
                        solution: "$e^{3x+2} = e^{14} \\iff 3x+2 = 14 \\iff 3x = 12 \\iff x = 4$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Quelle est la dérivée de la fonction $g(x) = (2x+3)e^x$ sur $\\mathbb{R}$ ?",
                        choices: [
                            "$g'(x) = 2e^x$",
                            "$g'(x) = (2x+5)e^x$",
                            "$g'(x) = (2x+3)e^x$",
                            "$g'(x) = (2x+1)e^x$"
                        ],
                        answer: 1,
                        hint: "Utilisez la formule de dérivation d'un produit $(uv)' = u'v + uv'$ avec $u(x)=2x+3$ et $v(x)=e^x$.",
                        solution: "$g'(x) = u'v + uv' = 2e^x + (2x+3)e^x = (2 + 2x + 3)e^x = (2x+5)e^x$."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "La température d'un café chaud en degrés dans une pièce est modélisée par $T(t) = 60e^{-0.1t} + 20$ pour $t \\ge 0$ (en minutes).<br>Déterminez la température limite du café (en degrés) lorsqu'on le laisse reposer très longtemps.",
                        placeholder: "Entrez la température",
                        answer: "20",
                        hint: "Calculez la limite de la fonction lorsque $t \\to +\\infty$, sachant que $\\lim_{X \\to -\\infty} e^X = 0$.",
                        solution: "Quand $t \\to +\\infty$, $-0.1t \\to -\\infty$ donc $e^{-0.1t} \\to 0$. On en déduit $\\lim T(t) = 60 \\times 0 + 20 = 20$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Le nombre de personnes touchées par une épidémie de grippe après $t$ semaines est modélisé par $f(t) = \\frac{10000}{1 + 9e^{-0.5t}}$.<br>Calculez le nombre de personnes infectées au bout d'une durée infinie (lorsque l'épidémie s'arrête, c'est-à-dire quand $t \\to +\\infty$).",
                        placeholder: "Entrez le nombre de personnes",
                        answer: "10000",
                        hint: "Cherchez la limite de $e^{-0.5t}$ quand $t \\to +\\infty$, puis déduisez celle de $f(t)$.",
                        solution: "Quand $t \\to +\\infty$, $e^{-0.5t} \\to 0$. Le dénominateur $1 + 9e^{-0.5t}$ tend donc vers $1$. Ainsi, $\\lim f(t) = \\frac{10000}{1} = 10000$ personnes."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "On étudie le signe d'une fonction $f(x) = (x^2 - x - 2)e^x$ sur $\\mathbb{R}$. Sur quel intervalle cette fonction est-elle strictement négative ?",
                        choices: [
                            "$S = ]-1 ; 2[$",
                            "$S = ]-\\infty ; -1[ \\cup ]2 ; +\\infty[$",
                            "$S = ]-2 ; 1[$",
                            "Jamais, elle est toujours positive"
                        ],
                        answer: 0,
                        hint: "Puisque $e^x > 0$ pour tout réel $x$, le signe de $f(x)$ est exactement le même que celui de son trinôme du second degré $x^2 - x - 2$. Déterminez ses racines.",
                        solution: "Les racines de $x^2 - x - 2 = 0$ sont $x_1 = -1$ et $x_2 = 2$. Puisque $a = 1 > 0$ et que l'exponentielle est strictement positive, la fonction est négative entre ses racines, soit sur l'intervalle **$]-1 ; 2[$**."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Quelle est l'affirmation correcte concernant la valeur du nombre $e$ (base de l'exponentielle) ?",
                choices: [
                    "e = 0",
                    "e \\approx 2.718",
                    "e \\approx 3.142",
                    "e est un nombre négatif"
                ],
                answer: 1,
                explanation: "La constante mathématique $e = \\exp(1)$ est un nombre irrationnel valant environ $2,71828...$ tout comme $\\pi \\approx 3,14159$."
            },
            {
                question: "Quelle est la dérivée de la fonction $f(x) = e^{-3x}$ sur $\\mathbb{R}$ ?",
                choices: [
                    "f'(x) = e^{-3x}",
                    "f'(x) = -3e^{-3x}",
                    "f'(x) = -3e^{x}",
                    "f'(x) = -\\frac{1}{3}e^{-3x}"
                ],
                answer: 1,
                explanation: "On applique la formule $(e^u)' = u' e^u$ avec $u(x) = -3x$. La dérivée de $u$ est $u'(x) = -3$. Ainsi, la dérivée est $f'(x) = -3e^{-3x}$."
            },
            {
                question: "Pour tout réel $x$, la quantité $e^x$ est :",
                choices: [
                    "Toujours positive ou nulle ($P(x) \\ge 0$)",
                    "Toujours strictement positive ($P(x) > 0$)",
                    "Du même signe que $x$",
                    "Toujours strictement négative"
                ],
                answer: 1,
                explanation: "D'après les propriétés fondamentales de la fonction exponentielle, pour tout réel $x$, $e^x > 0$. Elle est strictement positive, et sa courbe est entièrement située au-dessus de l'axe des abscisses."
            },
            {
                question: "Résoudre dans $\\mathbb{R}$ l'inéquation $e^{x^2 - 1} < e^{3}$.",
                choices: [
                    "x \\in ]-2 ; 2[",
                    "x \\in ]-\\infty ; -2[ \\cup ]2 ; +\\infty[$",
                    "x \\in ]-4 ; 4[",
                    "Pas de solution"
                ],
                answer: 0,
                explanation: "Puisque la fonction exponentielle est strictement croissante : $e^{x^2 - 1} < e^3 \\iff x^2 - 1 < 3 \\iff x^2 < 4$. L'ensemble des réels dont le carré est strictement inférieur à 4 est l'intervalle ouvert $]-2 ; 2[$."
            },
            {
                question: "Laquelle des expressions suivantes est égale à $e^{5x} \\times e^{-2x}$ ?",
                choices: [
                    "e^{-10x^2}",
                    "e^{3}",
                    "e^{3x}",
                    "e^{7x}"
                ],
                answer: 2,
                explanation: "On utilise la formule de produit : $e^a \\times e^b = e^{a+b}$. Ici : $e^{5x} \\times e^{-2x} = e^{5x + (-2x)} = e^{3x}$."
            }
        ]
    },
    {
        id: 5,
        title: "Produit Scalaire & Géométrie",
        tag: "Géométrie",
        desc: "Maîtriser les différentes définitions du produit scalaire dans le plan, l'orthogonalité, et l'application aux équations cartésiennes de droites et de cercles.",
        cours: `
            <p>Le produit scalaire est un outil algébrique puissant qui permet de généraliser la notion d'orthogonalité et de calculer des angles ou des longueurs dans le plan.</p>

            <h4>1. Définitions du Produit Scalaire</h4>
            <p>Soient $\\vec{u}$ et $\\vec{v}$ deux vecteurs du plan.</p>
            <div class="math-formula-box">
                • <strong>Définition Géométrique (avec angle) :</strong><br>
                Si $\\vec{u}$ et $\\vec{v}$ sont non nuls, en nommant $\\theta$ l'angle orienté $(\\vec{u}, \\vec{v})$ :
                $$\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\times \\|\\vec{v}\\| \\times \\cos(\\theta)$$
                • <strong>Définition Analytique (Repère Orthonormé) :</strong><br>
                Si dans un repère orthonormé, on a $\\vec{u}(x ; y)$ et $\\vec{v}(x' ; y')$ :
                $$\\vec{u} \\cdot \\vec{v} = xx' + yy'$$
                • <strong>Définition par Projection :</strong><br>
                Si $\\vec{u} = \\overrightarrow{AB}$ et $\\vec{v} = \\overrightarrow{AC}$, et $H$ est le projeté orthogonal de $C$ sur $(AB)$ :
                $$\\vec{u} \\cdot \\vec{v} = AB \\times AH \\quad \\text{(si même sens)}$$
                $$\\vec{u} \\cdot \\vec{v} = -AB \\times AH \\quad \\text{(si sens contraires)}$$
            </div>

            <h4>2. Propriétés et Orthogonalité</h4>
            <p>• <strong>Symétrie :</strong> $\\vec{u} \\cdot \\vec{v} = \\vec{v} \\cdot \\vec{u}$<br>
            • <strong>Bilinéarité :</strong> $\\vec{u} \\cdot (\\vec{v} + \\vec{w}) = \\vec{u} \\cdot \\vec{v} + \\vec{u} \\cdot \\vec{w}$ et $(k\\vec{u}) \\cdot \\vec{v} = k(\\vec{u} \\cdot \\vec{v})$</p>
            
            <div class="math-formula-box">
                <strong>Critère d'Orthogonalité :</strong><br>
                Deux vecteurs $\\vec{u}$ et $\\vec{v}$ sont orthogonaux si et seulement si leur produit scalaire est nul :
                $$\\vec{u} \\cdot \\vec{v} = 0$$
            </div>

            <h4>3. Droites du Plan : Vecteur Normal</h4>
            <p>Un vecteur non nul $\\vec{n}$ est dit <strong>normal</strong> à une droite $d$ s'il est orthogonal à tout vecteur directeur de $d$.</p>
            <p>• Une droite passant par $A$ et de vecteur normal $\\vec{n}$ est l'ensemble des points $M$ tels que : $\\overrightarrow{AM} \\cdot \\vec{n} = 0$.<br>
            • Dans un repère orthonormé, la droite $d$ d'équation cartésienne $ax + by + c = 0$ admet pour vecteur normal le vecteur :
            $$\\vec{n}(a ; b)$$</p>
        `,
        widget: {
            type: "produit_scalaire",
            params: [
                { name: "ux", min: -5, max: 5, step: 0.5, default: 3 },
                { name: "uy", min: -5, max: 5, step: 0.5, default: -2 },
                { name: "vx", min: -5, max: 5, step: 0.5, default: 2 },
                { name: "vy", min: -5, max: 5, step: 0.5, default: 4 }
            ],
            instructions: "Modifiez les coordonnées des vecteurs $\\vec{u}$ et $\\vec{v}$ à l'aide des curseurs. Le produit scalaire est calculé par la méthode des coordonnées ($xx' + yy'$). Observez sa valeur quand les vecteurs sont orthogonaux."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Dans un repère orthonormé, on considère les vecteurs $\\vec{u}(3 ; -1)$ et $\\vec{v}(2 ; 4)$. Calculez la valeur numérique de leur produit scalaire $\\vec{u} \\cdot \\vec{v}$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "2",
                        hint: "Appliquez la formule analytique : $\\vec{u} \\cdot \\vec{v} = xx' + yy'$.",
                        solution: "$\\vec{u} \\cdot \\vec{v} = 3 \\times 2 + (-1) \\times 4 = 6 - 4 = 2$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Calculez la norme au carré (c'est-à-dire $\\|\\vec{w}\\|^2$) du vecteur $\\vec{w}(-3 ; 4)$ dans un repère orthonormé.",
                        placeholder: "Entrez un nombre entier",
                        answer: "25",
                        hint: "La norme au carré est le produit scalaire du vecteur avec lui-même: $\\|\\vec{w}\\|^2 = x^2 + y^2$.",
                        solution: "$\\|\\vec{w}\\|^2 = (-3)^2 + 4^2 = 9 + 16 = 25$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Si deux vecteurs $\\vec{a}$ et $\\vec{b}$ non nuls forment un angle de 90° ($\\pi/2$ radians), quel est le résultat de leur produit scalaire ?",
                        choices: [
                            "$1$",
                            "$-1$",
                            "$0$",
                            "On ne peut pas savoir"
                        ],
                        answer: 2,
                        hint: "Utilisez la formule $\\vec{a} \\cdot \\vec{b} = \\|\\vec{a}\\| \\times \\|\\vec{b}\\| \\times \\cos(90°)$. Sachez que $\\cos(90°) = 0$.",
                        solution: "L'angle vaut 90°, donc les vecteurs sont perpendiculaires. Le cosinus de l'angle est nul, le produit scalaire est donc égal à <strong>0</strong>."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "On considère les vecteurs $\\vec{a}(2 ; 3)$ et $\\vec{b}(k ; -4)$ dans le plan orthonormé. Déterminez le réel $k$ pour que ces vecteurs soient <strong>orthogonaux</strong>.",
                        placeholder: "Entrez la valeur de k",
                        answer: "6",
                        hint: "Deux vecteurs sont orthogonaux si et seulement si leur produit scalaire est nul. Posez $2k + 3(-4) = 0$.",
                        solution: "$\\vec{a} \\cdot \\vec{b} = 2k - 12 = 0 \\Rightarrow 2k = 12 \\Rightarrow k = 6$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Dans un repère orthonormé, on donne $A(1 ; 2)$, $B(4 ; 6)$ et $C(-3 ; 5)$. Calculez la valeur absolue du produit scalaire $\\overrightarrow{AB} \\cdot \\overrightarrow{AC}$.",
                        placeholder: "Entrez un nombre entier",
                        answer: "0",
                        hint: "1) Calculez les coordonnées des vecteurs $\\overrightarrow{AB}$ et $\\overrightarrow{AC}$. 2) Calculez leur produit scalaire.",
                        solution: "$\\overrightarrow{AB}(3 ; 4)$ et $\\overrightarrow{AC}(-4 ; 3)$. Produit scalaire: $\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = 3 \\times (-4) + 4 \\times 3 = -12 + 12 = 0$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Dans un repère orthonormé, quelle est l'équation cartésienne de la droite passant par $A(2 ; -1)$ admettant $\\vec{n}(3 ; 4)$ comme vecteur normal ?",
                        choices: [
                            "$3x + 4y - 2 = 0$",
                            "$4x - 3y - 11 = 0$",
                            "$3x + 4y + 2 = 0$",
                            "$3x - 4y - 10 = 0$"
                        ],
                        answer: 0,
                        hint: "L'équation est de la forme $3x + 4y + c = 0$. Injectez les coordonnées du point $A(2; -1)$ pour déterminer la constante $c$.",
                        solution: "Le vecteur normal $\\vec{n}(3;4)$ donne l'équation $3x + 4y + c = 0$. En remplaçant par $A(2; -1)$ : $3(2) + 4(-1) + c = 0 \\Rightarrow 6 - 4 + c = 0 \\Rightarrow c = -2$. L'équation est $3x + 4y - 2 = 0$."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "On s'intéresse à la droite $d$ passant par $A(1 ; 3)$ et de vecteur normal $\\vec{n}(2 ; -1)$. Son équation cartésienne est $2x - y + c = 0$. Déterminez le coefficient $c$.",
                        placeholder: "Entrez la valeur du terme constant c",
                        answer: "1",
                        hint: "Puisque $A$ appartient à la droite, ses coordonnées vérifient l'équation : $2(1) - 3 + c = 0$. Résolvez.",
                        solution: "$2(1) - 3 + c = 0 \\Rightarrow -1 + c = 0 \\Rightarrow c = 1$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Dans un plan orthonormé, on considère le cercle de diamètre $[AB]$ avec $A(1 ; 1)$ et $B(5 ; 4)$. Une équation de ce cercle est $x^2 + y^2 - 6x - 5y + c = 0$. Déterminez la valeur entière du terme constant $c$.",
                        placeholder: "Entrez la valeur entière de c",
                        answer: "9",
                        hint: "Le cercle est l'ensemble des points $M(x;y)$ tels que $\\overrightarrow{AM} \\cdot \\overrightarrow{BM} = 0$. Posez les vecteurs $\\overrightarrow{AM}(x-1; y-1)$ et $\\overrightarrow{BM}(x-5; y-4)$ puis développez.",
                        solution: "$\\overrightarrow{AM} \\cdot \\overrightarrow{BM} = (x-1)(x-5) + (y-1)(y-4) = 0 \\Rightarrow x^2 - 6x + 5 + y^2 - 5y + 4 = 0 \\Rightarrow x^2 + y^2 - 6x - 5y + 9 = 0$. Ainsi, $c = 9$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "On considère les points $A(1 ; 2)$ et $B(5 ; 5)$ dans un repère orthonormé. Quelle est la longueur exacte du segment $[AB]$ ?",
                        choices: [
                            "$AB = 5$",
                            "$AB = 7$",
                            "$AB = 25$",
                            "$AB = \\sqrt{13}$"
                        ],
                        answer: 0,
                        hint: "Utilisez la formule de distance $AB = \\sqrt{(x_B-x_A)^2 + (y_B-y_A)^2}$.",
                        solution: "$AB = \\sqrt{(5-1)^2 + (5-2)^2} = \\sqrt{4^2 + 3^2} = \\sqrt{16+9} = \\sqrt{25} = 5$."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Si l'angle entre deux vecteurs non nuls $\\vec{u}$ et $\\vec{v}$ est un angle aigu (inférieur à 90°), alors leur produit scalaire est :",
                choices: [
                    "Strictement positif ($>0$)",
                    "Strictement négatif ($<0$)",
                    "Nul ($=0$)",
                    "On ne peut pas savoir, cela dépend des normes"
                ],
                answer: 0,
                explanation: "La formule est $\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\|\\vec{v}\\| \\cos(\\theta)$. Les normes étant strictement positives, le signe du produit scalaire est celui du cosinus de l'angle. Pour un angle aigu $\\theta \\in [0 ; 90°[$, $\\cos(\\theta) > 0$. Donc le produit scalaire est strictement positif."
            },
            {
                question: "Dans un repère orthonormé, quelle est l'équation cartésienne de la droite de vecteur normal $\\vec{n}(3 ; 2)$ passant par l'origine du repère $O(0;0)$ ?",
                choices: [
                    "2x - 3y = 0",
                    "3x + 2y = 0",
                    "3x - 2y = 0",
                    "x + y = 5"
                ],
                answer: 1,
                explanation: "Une droite de vecteur normal $\\vec{n}(a;b)$ a une équation de la forme $ax + by + c = 0$. Ici, $a=3$ et $b=2$, donc l'équation est $3x + 2y + c = 0$. Comme elle passe par l'origine $O(0;0)$, on a $3(0) + 2(0) + c = 0 \\Rightarrow c = 0$. L'équation est donc $3x + 2y = 0$."
            },
            {
                question: "Que vaut le produit scalaire de deux vecteurs colinéaires et de sens contraires $\\vec{u}$ et $\\vec{v}$ ?",
                choices: [
                    "\\|\\vec{u}\\| \\times \\|\\vec{v}\\|",
                    "-\\|\\vec{u}\\| \\times \\|\\vec{v}\\|",
                    "0",
                    "1"
                ],
                answer: 1,
                explanation: "Des vecteurs colinéaires de sens contraires forment un angle de 180° ($\\pi$ radians). Comme $\\cos(180°) = -1$, la formule géométrique donne $\\vec{u} \\cdot \\vec{v} = \\|\\vec{u}\\| \\times \\|\\vec{v}\\| \\times \\cos(180°) = -\\|\\vec{u}\\| \\times \\|\\vec{v}\\|$."
            },
            {
                question: "Soit $A$ et $B$ deux points du plan. Quel est l'ensemble des points $M$ qui vérifient la relation $\\overrightarrow{AM} \\cdot \\overrightarrow{AB} = 0$ ?",
                choices: [
                    "Le cercle de diamètre [AB]",
                    "La droite perpendiculaire à (AB) passant par A",
                    "La médiatrice du segment [AB]",
                    "La droite (AB)"
                ],
                answer: 1,
                explanation: "La relation $\\overrightarrow{AM} \\cdot \\overrightarrow{AB} = 0$ indique que les vecteurs $\\overrightarrow{AM}$ et $\\overrightarrow{AB}$ sont orthogonaux. Géométriquement, cela caractérise la droite perpendiculaire à $(AB)$ qui passe par le point $A$."
            },
            {
                question: "Soit un cercle de diamètre $[AB]$. Quelle relation vérifie tout point $M$ appartenant à ce cercle ?",
                choices: [
                    "\\overrightarrow{AM} \\cdot \\overrightarrow{BM} = 0",
                    "\\overrightarrow{AM} \\cdot \\overrightarrow{AB} = 0",
                    "\\|\\overrightarrow{AM}\\| = \\|\\overrightarrow{BM}\\|",
                    "\\overrightarrow{AM} + \\overrightarrow{BM} = \\overrightarrow{0}"
                ],
                answer: 0,
                explanation: "Un triangle inscrit dans un cercle ayant pour côté un diamètre est un triangle rectangle. Ainsi, pour tout point $M$ du cercle, le triangle $AMB$ est rectangle en $M$, ce qui se traduit vectoriellement par l'orthogonalité des vecteurs $\\overrightarrow{MA}$ et $\\overrightarrow{MB}$, soit $\\overrightarrow{AM} \\cdot \\overrightarrow{BM} = 0$."
            }
        ]
    },
    {
        id: 6,
        title: "Probabilités Conditionnelles",
        tag: "Probabilités",
        desc: "Comprendre les probabilités conditionnelles, savoir construire et exploiter un arbre pondéré et maîtriser la formule des probabilités totales et l'indépendance.",
        cours: `
            <p>Les probabilités conditionnelles étudient la chance qu'un événement se réalise sachant qu'un autre événement s'est déjà réalisé.</p>

            <h4>1. Définition Mathématique</h4>
            <p>Soient $A$ et $B$ deux événements d'un univers $\\Omega$, avec $P(A) \\neq 0$. La <strong>probabilité conditionnelle de $B$ sachant $A$</strong>, notée $P_A(B)$, est définie par :
            $$P_A(B) = \\frac{P(A \\cap B)}{P(A)}$$</p>
            <p>On en découle la formule de produit : $P(A \\cap B) = P(A) \\times P_A(B)$.</p>

            <h4>2. Arbre Pondéré (Règles d'utilisation)</h4>
            <div class="math-formula-box">
                • <strong>Règle des nœuds :</strong> La somme des probabilités des branches issues d'un même nœud est égale à 1.<br>
                • <strong>Règle des chemins :</strong> La probabilité d'un chemin complet (intersection d'événements) est égale au produit des probabilités inscrites sur ses branches.<br>
                • <strong>Exemple :</strong> La branche allant du nœud $A$ vers $B$ porte la probabilité conditionnelle $P_A(B)$.
            </div>

            <h4>3. Formule des Probabilités Totales</h4>
            <p>Soit $A_1, A_2, ..., A_n$ une partition de l'univers. Pour tout événement $B$ :
            $$P(B) = P(A_1 \\cap B) + P(A_2 \\cap B) + ... + P(A_n \\cap B)$$
            $$P(B) = P(A_1) \\times P_{A_1}(B) + P(A_2) \\times P_{A_2}(B) + ... + P(A_n) \\times P_{A_n}(B)$$</p>

            <h4>4. Indépendance de deux événements</h4>
            <p>Deux événements $A$ et $B$ de probabilités non nulles sont dits <strong>indépendants</strong> si le fait que l'un se réalise n'influence pas la probabilité de l'autre :
            $$P_A(B) = P(B) \\quad \\text{ou} \\quad P(A \\cap B) = P(A) \\times P(B)$$</p>
        `,
        widget: {
            type: "probabilites",
            params: [
                { name: "pa", min: 0.1, max: 0.9, step: 0.05, default: 0.6 },
                { name: "pab", min: 0.1, max: 0.9, step: 0.05, default: 0.2 },
                { name: "panb", min: 0.1, max: 0.9, step: 0.05, default: 0.4 }
            ],
            instructions: "Modifiez la probabilité $P(A)$ et les conditionnelles $P_A(B)$ et $P_{\\bar{A}}(B)$. L'arbre pondéré et la probabilité totale $P(B)$ sont mis à jour."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Soient $A$ et $B$ deux événements tels que $P(A) = 0.4$, $P(B) = 0.5$ et $P_A(B) = 0.3$. Calculez la valeur exacte de $P(A \\cap B)$.",
                        placeholder: "Entrez un nombre décimal (ex: 0.25)",
                        answer: "0.12",
                        hint: "Appliquez la formule $P(A \\cap B) = P(A) \\times P_A(B)$.",
                        solution: "$P(A \\cap B) = 0.4 \\times 0.3 = 0.12$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit $P(A) = 0.6$. Calculez la probabilité de l'événement contraire, c'est-à-dire $P(\\bar{A})$.",
                        placeholder: "Entrez un nombre décimal",
                        answer: "0.4",
                        hint: "La somme des probabilités d'un événement et de son contraire vaut 1 : $P(\\bar{A}) = 1 - P(A)$.",
                        solution: "$P(\\bar{A}) = 1 - 0.6 = 0.4$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Si $P(A) = 0.3$ et $P(B) = 0.4$, et que $A$ et $B$ sont indépendants, que vaut $P(A \\cap B)$ ?",
                        choices: [
                            "$0.7$",
                            "$0.12$",
                            "$0.75$",
                            "$0$"
                        ],
                        answer: 1,
                        hint: "Deux événements sont indépendants si et seulement si $P(A \\cap B) = P(A) \\times P(B)$.",
                        solution: "Comme ils sont indépendants : $P(A \\cap B) = 0.3 \\times 0.4 = 0.12$."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Dans un lycée, 60% sont des filles. 10% des filles font de la NSI, 20% des garçons font de la NSI. Calculez la probabilité totale qu'un élève choisi au hasard fasse NSI.",
                        placeholder: "Entrez un nombre décimal (ex: 0.15)",
                        answer: "0.14",
                        hint: "Formule des probabilités totales : $P(N) = P(F) \\times P_F(N) + P(G) \\times P_G(N)$ avec $P(F)=0.60$ et $P(G)=0.40$.",
                        solution: "$P(N) = 0.60 \\times 0.10 + 0.40 \\times 0.20 = 0.06 + 0.08 = 0.14$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "On donne $P(A) = 0.5$, $P_A(B) = 0.8$ et $P_{\\bar{A}}(B) = 0.4$. Calculez la probabilité totale $P(B)$.",
                        placeholder: "Entrez la probabilité décimale",
                        answer: "0.6",
                        hint: "Formule des probabilités totales : $P(B) = P(A)P_A(B) + P(\\bar{A})P_{\\bar{A}}(B)$. Remplacez par les valeurs ($P(\\bar{A}) = 0.5$).",
                        solution: "$P(B) = 0.5 \\times 0.8 + 0.5 \\times 0.4 = 0.4 + 0.2 = 0.6$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Soient $A$ et $B$ deux événements tels que $P(A) = 0.4$, $P(B) = 0.5$ et $P(A \\cup B) = 0.7$. Les événements $A$ et $B$ sont-ils indépendants ?",
                        choices: [
                            "Oui, ils sont indépendants",
                            "Non, ils ne sont pas indépendants",
                            "On ne peut pas le déterminer",
                            "Ils sont incompatibles"
                        ],
                        answer: 0,
                        hint: "1) Calculez $P(A \\cap B) = P(A) + P(B) - P(A \\cup B)$. 2) Comparez à $P(A) \\times P(B)$.",
                        solution: "$P(A \\cap B) = 0.4 + 0.5 - 0.7 = 0.2$. On calcule le produit: $P(A) \\times P(B) = 0.4 \\times 0.5 = 0.2$. Comme $P(A \\cap B) = P(A) \\times P(B)$, ils sont indépendants."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Une usine produit des pièces. La machine X produit 70% des pièces, la machine Y le reste. 2% des pièces de X sont défectueuses, 3% des pièces de Y sont défectueuses. On tire une pièce au hasard et on constate qu'elle est défectueuse.<br>Calculez la probabilité conditionnelle exacte (à 4 décimales près) qu'elle vienne de la machine X, c'est-à-dire $P_D(X)$.",
                        placeholder: "Entrez un décimal (ex: 0.6087)",
                        answer: "0.6087",
                        hint: "Appliquez la formule de Bayes : $P_D(X) = \\frac{P(X \\cap D)}{P(D)}$. Calculez $P(D)$ par les probabilités totales en premier.",
                        solution: "1) $P(D) = P(X)P_X(D) + P(Y)P_Y(D) = 0.7 \\times 0.02 + 0.3 \\times 0.03 = 0.014 + 0.009 = 0.023$.<br>2) $P_D(X) = \\frac{0.7 \\times 0.02}{0.023} = \\frac{0.014}{0.023} \\approx 0.6087$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Dans une population, un gène défectueux touche 1% des gens. On met en place un test : si on est malade, le test est positif à 99%. Si on est sain, le test est négatif à 95% (faux positifs de 5%). Une personne passe le test et il est positif.<br>Calculez la probabilité réelle que cette personne soit malade (à 4 décimales près).",
                        placeholder: "Entrez la probabilité décimale",
                        answer: "0.1667",
                        hint: "Calculez d'avance $P(T_{pos}) = P(M)P_M(T_{pos}) + P(S)P_S(T_{pos}) = 0.01(0.99) + 0.99(0.05)$, puis appliquez Bayes : $P_T(M) = \\frac{P(M \\cap T)}{P(T)}$.",
                        solution: "$P(T) = 0.01 \\times 0.99 + 0.99 \\times 0.05 = 0.0099 + 0.0495 = 0.0594$. La probabilité recherchée est $P_T(M) = \\frac{0.0099}{0.0594} \\approx 0.1667$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "On lance deux dés équilibrés. On sait que la somme des dés est supérieure ou égale à 10. Quelle est la probabilité d'avoir obtenu un double (les deux dés identiques) ?",
                        choices: [
                            "$\\frac{1}{3}$",
                            "$\\frac{1}{6}$",
                            "$\\frac{2}{3}$",
                            "$\\frac{1}{2}$"
                        ],
                        answer: 0,
                        hint: "Listez les cas favorables à la somme $\\ge 10$ : (4,6), (5,5), (6,4), (5,6), (6,5), (6,6). Comptez combien de cas sont des doubles.",
                        solution: "Il y a 6 cas où la somme est $\\ge 10$. Parmi ces cas, les doubles sont (5,5) et (6,6), soit 2 issues. La probabilité est de $2/6 = 1/3$."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Soit $A$ et $B$ deux événements indépendants tels que $P(A) = 0.3$ et $P(B) = 0.6$. Calculez $P(A \\cap B)$.",
                choices: [
                    "0.9",
                    "0.18",
                    "0.5",
                    "On ne peut pas savoir sans connaître $P_A(B)$"
                ],
                answer: 1,
                explanation: "Puisque les événements $A$ et $B$ sont indépendants, la probabilité de leur intersection est égale au produit de leurs probabilités individuelles : $P(A \\cap B) = P(A) \\times P(B) = 0.3 \\times 0.6 = 0.18$."
            },
            {
                question: "Si $P(A) = 0.5$ et $P(A \\cap B) = 0.15$. Quelle est la probabilité conditionnelle $P_A(B)$ ?",
                choices: [
                    "0.65",
                    "0.075",
                    "0.30",
                    "0.33"
                ],
                answer: 2,
                explanation: "D'après la définition du cours : $P_A(B) = \\frac{P(A \\cap B)}{P(A)} = \\frac{0.15}{0.5} = 0.30$ (soit 30%)."
            },
            {
                question: "Dans un arbre pondéré, quelle est la somme des probabilités portées par les branches issues d'un même nœud ?",
                choices: [
                    "0.5",
                    "1",
                    "Elle dépend du nombre de branches",
                    "100"
                ],
                answer: 1,
                explanation: "C'est la règle des nœuds fondamentale : la somme des probabilités des branches issues d'un même nœud est toujours égale à 1 (soit 100%)."
            },
            {
                question: "On lance un dé équilibré à 6 faces. On note $A$ l'événement : 'obtenir un chiffre pair' et $B$ l'événement : 'obtenir un multiple de 3'. Les événements $A$ et $B$ sont-ils indépendants ?",
                choices: [
                    "Oui, ils sont indépendants",
                    "Non, ils ne sont pas indépendants",
                    "Cela dépend de la force du lancer",
                    "On ne peut pas calculer"
                ],
                answer: 0,
                explanation: "$P(A) = 0.5$, $P(B) = 1/3$. L'intersection $A \\cap B = \\{6\\} \\Rightarrow P(A \\cap B) = 1/6$. Comme $P(A) \\times P(B) = 1/6$, ils sont indépendants."
            },
            {
                question: "Soient $A$ et $B$ deux événements incompatibles. Quelle affirmation est toujours vraie ?",
                choices: [
                    "P(A ∩ B) = 0",
                    "P(A ∩ B) = P(A)P(B)",
                    "P(A U B) = 0",
                    "P(A) + P(B) = 1"
                ],
                answer: 0,
                explanation: "Deux événements incompatibles ne peuvent pas se réaliser en même temps, leur intersection est l'ensemble vide, donc sa probabilité est nulle : $P(A \\cap B) = 0$."
            }
        ]
    },
    {
        id: 7,
        title: "Variables Aléatoires",
        tag: "Probabilités",
        desc: "Découvrir la notion de variable aléatoire réelle, de loi de probabilité, et maîtriser le calcul de l'espérance, de la variance et de l'écart-type.",
        cours: `
            <p>Une variable aléatoire réelle $X$ est une fonction qui associe un nombre réel à chaque issue d'une expérience aléatoire.</p>

            <h4>1. Loi de Probabilité</h4>
            <p>Définir la loi de probabilité de $X$, c'est déterminer toutes les valeurs possibles $x_1, x_2, ..., x_k$ que peut prendre la variable aléatoire, et associer à chacune sa probabilité $p_i = P(X = x_i)$.</p>
            <p>On présente généralement cette loi sous la forme d'un tableau à double entrée :</p>
            <table class="math-table" style="width: 100%; border-collapse: collapse; margin: 12px 0;">
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <th style="padding: 6px;">$x_i$</th>
                    <td style="padding: 6px;">$x_1$</td>
                    <td style="padding: 6px;">$x_2$</td>
                    <td style="padding: 6px;">...</td>
                    <td style="padding: 6px;">$x_k$</td>
                </tr>
                <tr>
                    <th style="padding: 6px;">$P(X=x_i)$</th>
                    <td style="padding: 6px;">$p_1$</td>
                    <td style="padding: 6px;">$p_2$</td>
                    <td style="padding: 6px;">...</td>
                    <td style="padding: 6px;">$p_k$</td>
                </tr>
            </table>
            <p>La somme des probabilités de la loi doit toujours être égale à 1 : $\\sum p_i = 1$.</p>

            <h4>2. Espérance Mathématique</h4>
            <p>L'<strong>espérance mathématique</strong> de $X$, notée $E(X)$, représente la valeur moyenne de $X$ à long terme (la moyenne arithmétique pondérée des gains/pertes) :
            $$E(X) = p_1x_1 + p_2x_2 + ... + p_kx_k = \\sum_{i=1}^k p_ix_i$$</p>
            <div class="math-formula-box">
                <strong>Interprétation du jeu :</strong><br>
                • Si $E(X) = 0$, le jeu est dit <strong>équitable</strong>.<br>
                • Si $E(X) < 0$, le jeu est dit <strong>défavorable</strong> au joueur.<br>
                • Si $E(X) > 0$, le jeu est dit <strong>favorable</strong> au joueur.
            </div>

            <h4>3. Variance et Écart-Type</h4>
            <p>La **variance** $V(X)$ et l'**écart-type** $\\sigma(X)$ mesurent la dispersion des valeurs prises par la variable autour de son espérance.</p>
            <div class="math-formula-box">
                • <strong>Variance :</strong>
                $$V(X) = \\sum_{i=1}^k p_i(x_i - E(X))^2$$
                Ou par la formule de Kœnig-Huygens (plus simple pour les calculs) :
                $$V(X) = E(X^2) - (E(X))^2 = \\left(\\sum p_ix_i^2\\right) - (E(X))^2$$
                • <strong>Écart-Type :</strong>
                $$\\sigma(X) = \\sqrt{V(X)}$$
            </div>
        `,
        widget: {
            type: "variables_aleatoires",
            params: [
                { name: "x1", min: -10, max: 10, step: 1, default: -5 },
                { name: "p1", min: 0.1, max: 0.8, step: 0.05, default: 0.3 },
                { name: "p2", min: 0.1, max: 0.8, step: 0.05, default: 0.5 }
            ],
            instructions: "Modifiez la valeur de $x_1$ et les probabilités associées $p_1$ et $p_2$ pour voir comment le centre de gravité (l'espérance) se décale."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "La loi de probabilité de $X$ est donnée par $P(X=-5)=0.2$, $P(X=2)=0.5$ et $P(X=10)=p_3$. Calculez la valeur décimale exacte de la probabilité manquante $p_3$.",
                        placeholder: "Entrez un décimal (ex: 0.3)",
                        answer: "0.3",
                        hint: "La somme de toutes les probabilités d'une loi doit être égale à 1 : $0.2 + 0.5 + p_3 = 1$.",
                        solution: "$0.2 + 0.5 + p_3 = 1 \\Rightarrow 0.7 + p_3 = 1 \\Rightarrow p_3 = 0.3$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "On donne la loi : $P(X=-2)=0.3$, $P(X=0)=0.5$ et $P(X=4)=0.2$. Calculez la valeur décimale exacte de l'espérance $E(X)$.",
                        placeholder: "Entrez la valeur décimale",
                        answer: "0.2",
                        hint: "Formule : $E(X) = x_1p_1 + x_2p_2 + x_3p_3$. Remplacez par les valeurs.",
                        solution: "$E(X) = -2 \\times 0.3 + 0 \\times 0.5 + 4 \\times 0.2 = -0.6 + 0 + 0.8 = 0.2$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Un jeu de hasard propose d'obtenir un gain net modélisé par $X$. On calcule $E(X) = -1,5$ €. Comment qualifie-t-on ce jeu ?",
                        choices: [
                            "Favorable au joueur",
                            "Équitable",
                            "Défavorable au joueur",
                            "Impossible à déterminer"
                        ],
                        answer: 2,
                        hint: "Étudiez le signe de l'espérance. Si elle est négative ($<0$), le joueur perd en moyenne de l'argent à chaque partie.",
                        solution: "L'espérance est strictement négative ($E(X) = -1.5$ €), le jeu est donc <strong>défavorable au joueur</strong> (et favorable à l'organisateur)."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Un jeu consiste à lancer un dé équilibré à 6 faces. Si on obtient un 6, on gagne 10 €. Sinon, on perd 2 €. Calculez l'espérance mathématique du gain net (en euros).",
                        placeholder: "Entrez la valeur (peut être négative)",
                        answer: "0",
                        hint: "Identifiez les valeurs prises : $x_1=10$ avec proba $1/6$, $x_2=-2$ avec proba $5/6$. Calculez $10 \\times \\frac{1}{6} + (-2) \\times \\frac{5}{6}$.",
                        solution: "$E(X) = 10 \\times \\frac{1}{6} - 2 \\times \\frac{5}{6} = \\frac{10}{6} - \\frac{10}{6} = 0$. Le jeu est équitable."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Soit une variable aléatoire $Y$ vérifiant la loi : $P(Y=2)=0.4$ et $P(Y=5)=0.6$. On calcule $E(Y) = 3.8$. Calculez la variance $V(Y)$ sous forme décimale.",
                        placeholder: "Entrez la variance décimale",
                        answer: "2.16",
                        hint: "Utilisez la formule $V(Y) = p_1(y_1-E(Y))^2 + p_2(y_2-E(Y))^2$.",
                        solution: "$V(Y) = 0.4 \\times (2-3.8)^2 + 0.6 \\times (5-3.8)^2 = 0.4 \\times (-1.8)^2 + 0.6 \\times (1.2)^2 = 0.4 \\times 3.24 + 0.6 \\times 1.44 = 1.296 + 0.864 = 2.16$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Si la variance d'une variable aléatoire $X$ est égale à $V(X) = 9$, que vaut son écart-type $\\sigma(X)$ ?",
                        choices: [
                            "$\\sigma(X) = 81$",
                            "$\\sigma(X) = 3$",
                            "$\\sigma(X) = 4.5$",
                            "$\\sigma(X) = -3$"
                        ],
                        answer: 1,
                        hint: "L'écart-type est la racine carrée positive de la variance : $\\sigma(X) = \\sqrt{V(X)}$.",
                        solution: "$\\sigma(X) = \\sqrt{9} = 3$."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Un jeu de hasard fait gagner 50 € avec une probabilité de 0.1 et 10 € avec une probabilité de 0.3. Le reste du temps, le joueur ne gagne rien.<br>Quel doit être le prix maximum (en euros) du ticket de participation pour que le jeu reste favorable à l'organisateur (c'est-à-dire que l'espérance de gain net soit négative ou nulle pour le joueur) ?",
                        placeholder: "Entrez le prix maximum entier",
                        answer: "8",
                        hint: "Soit $P$ le prix du ticket. L'espérance brute du gain du joueur (sans payer le ticket) est $50(0.1) + 10(0.3) + 0(0.6)$. Le jeu est favorable à l'organisateur si le prix $P$ est supérieur ou égal à cette espérance de gain brute.",
                        solution: "Le gain brut moyen est de $E_{brute} = 50 \\times 0,1 + 10 \\times 0,3 = 5 + 3 = 8$ €. Le joueur gagne en moyenne 8 € bruts par partie. Si le ticket coûte au moins 8 €, l'espérance de son gain net devient négative ou nulle ($E(X_{net}) = 8 - P \\le 0$). Le prix maximum optimal/seuil est donc de <strong>8 €</strong>."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Une compagnie d'assurance propose un contrat pour couvrir les risques météo d'un festival. La compagnie perçoit une cotisation fixe. En cas d'orage, elle doit verser 50 000 € d'indemnités. La probabilité d'avoir un orage est de 0.04. La compagnie souhaite que son espérance de gain net par contrat soit de 1500 €.<br>Déterminez le prix de la cotisation fixe (en euros) que doit demander la compagnie d'assurance.",
                        placeholder: "Entrez la cotisation",
                        answer: "3500",
                        hint: "Soit $C$ la cotisation. Le gain de la compagnie est $C$ s'il n'y a pas d'orage (probabilité 0.96) et $C - 50000$ s'il y a un orage (probabilité 0.04). Posez l'espérance $0.96C + 0.04(C - 50000) = 1500$. Simplifiez pour trouver $C$.",
                        solution: "$E = C - 0.04 \\times 50000 = 1500 \\Rightarrow C - 2000 = 1500 \\Rightarrow C = 3500$ €. La cotisation fixe doit être de <strong>3500 €</strong>."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "On étudie un jeu de loterie. On a établi la loi du gain net $X$ (en prenant en compte la mise de 2 €) : $P(X=-2)=0.8$, $P(X=3)=0.15$ et $P(X=18)=0.05$. On calcule $E(X) = -0.25$ € (jeu défavorable). Quelle est l'affirmation correcte concernant le risque mesuré par l'écart-type ?",
                        choices: [
                            "$\\sigma(X) \\approx 4,50$ €",
                            "$\\sigma(X) \\approx 20,25$ €",
                            "$\\sigma(X) \\approx 2,12$ €",
                            "$\\sigma(X) \\approx 1,25$ €"
                        ],
                        answer: 0,
                        hint: "1) Calculez $E(X^2) = (-2)^2 \\times 0.8 + 3^2 \\times 0.15 + 18^2 \\times 0.05$. 2) Calculez la variance $V(X) = E(X^2) - (E(X))^2$. 3) Prenez la racine carrée pour trouver $\\sigma(X)$.",
                        solution: "$E(X^2) = 4 \\times 0.8 + 9 \\times 0.15 + 324 \\times 0.05 = 20.75$. Variance $V(X) = 20.75 - (-0.25)^2 = 20.6875$. L'écart-type est $\\sigma(X) = \\sqrt{20.6875} \\approx 4.548$ €, ce qui correspond à l'affirmation <strong>σ(X) ≈ 4.50 €</strong>."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Quelle est la somme de toutes les probabilités $P(X = x_i)$ constituant la loi de probabilité d'une variable aléatoire réelle ?",
                choices: [
                    "0.5",
                    "1",
                    "Elle dépend du nombre de valeurs possibles",
                    "0"
                ],
                answer: 1,
                explanation: "C'est une règle absolue en probabilité. Puisque les événements $(X = x_i)$ forment une partition de l'univers, la somme de leurs probabilités doit être exactement égale à 1."
            },
            {
                question: "Quelle est la bonne formule de l'espérance mathématique d'une variable aléatoire réelle $X$ ?",
                choices: [
                    "E(X) = \\sum P(X=x_i)",
                    "E(X) = \\sum x_i P(X=x_i)",
                    "E(X) = \\sum x_i^2 P(X=x_i)",
                    "E(X) = \\sqrt{V(X)}"
                ],
                answer: 1,
                explanation: "Par définition, l'espérance mathématique est la moyenne des valeurs possibles pondérées par leurs probabilités, soit $E(X) = \\sum x_i P(X=x_i)$."
            },
            {
                question: "La formule de Kœnig-Huygens pour calculer la variance $V(X)$ est :",
                choices: [
                    "V(X) = E(X^2) - (E(X))^2",
                    "V(X) = E(X^2) + (E(X))^2",
                    "V(X) = E(X) - E(X^2)",
                    "V(X) = \\sqrt{E(X^2) - E(X)}"
                ],
                answer: 0,
                explanation: "La formule de Kœnig-Huygens stipule que la variance est égale à l'espérance des carrés moins le carré de l'espérance : $V(X) = E(X^2) - (E(X))^2$."
            },
            {
                question: "Soit un jeu où l'espérance mathématique du gain net du joueur vaut $E(X) = 0$ €. Comment qualifie-t-on ce jeu ?",
                choices: [
                    "Le jeu est favorable",
                    "Le jeu est défavorable",
                    "Le jeu est équitable",
                    "Le jeu est impossible"
                ],
                answer: 2,
                explanation: "Lorsque l'espérance mathématique du gain net est nulle ($E(X) = 0$), cela signifie que le jeu est équitable."
            },
            {
                question: "Soit une variable aléatoire $X$ de loi : $P(X=-10)=0.5$ et $P(X=10)=0.5$. Que valent son espérance $E(X)$ et sa variance $V(X)$ ?",
                choices: [
                    "E(X) = 0 et V(X) = 10",
                    "E(X) = 0 et V(X) = 100",
                    "E(X) = 10 et V(X) = 100",
                    "E(X) = 0 et V(X) = 0"
                ],
                answer: 1,
                explanation: "1) $E(X) = -10(0.5) + 10(0.5) = 0$. 2) $E(X^2) = (-10)^2(0.5) + (10)^2(0.5) = 100$. Ainsi, $V(X) = E(X^2) - (E(X))^2 = 100$."
            }
        ]
    },
    {
        id: 8,
        title: "Trigonométrie",
        tag: "Géométrie",
        desc: "S'approprier le cercle trigonométrique, les mesures d'angles en radians, les fonctions sinus et cosinus et les équations trigonométriques.",
        cours: `
            <p>La trigonométrie est l'étude des relations entre les distances et les angles dans les triangles et sur le cercle.</p>

            <h4>1. Le Cercle Trigonométrique et le Radian</h4>
            <p>Le <strong>cercle trigonométrique</strong> est un cercle orienté de rayon 1, centré à l'origine du repère, muni du sens direct (sens anti-horaire).</p>
            <p>Le <strong>radian</strong> est l'unité de mesure d'angle telle que la longueur de l'arc de cercle intercepté soit égale au rayon. On a la correspondance suivante :
            $$\\pi \\text{ rad} = 180^\\circ$$</p>

            <div class="math-formula-box">
                <strong>Valeurs remarquables à connaître absolument :</strong><br>
                <table class="math-table" style="width:100%; border-collapse: collapse; margin-top: 10px; font-size:12px;">
                    <tr style="border-bottom: 1px solid var(--border-color); font-weight:bold;">
                        <th style="padding: 4px;">Angle $x$ (rad)</th>
                        <th style="padding: 4px;">$0$</th>
                        <th style="padding: 4px;">$\\frac{\\pi}{6}$</th>
                        <th style="padding: 4px;">$\\frac{\\pi}{4}$</th>
                        <th style="padding: 4px;">$\\frac{\\pi}{3}$</th>
                        <th style="padding: 4px;">$\\frac{\\pi}{2}$</th>
                        <th style="padding: 4px;">$\\pi$</th>
                    </tr>
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 4px; font-weight:bold;">$\\cos(x)$</td>
                        <td style="padding: 4px;">$1$</td>
                        <td style="padding: 4px;">$\\frac{\\sqrt{3}}{2}$</td>
                        <td style="padding: 4px;">$\\frac{\\sqrt{2}}{2}$</td>
                        <td style="padding: 4px;">$\\frac{1}{2}$</td>
                        <td style="padding: 4px;">$0$</td>
                        <td style="padding: 4px;">$-1$</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px; font-weight:bold;">$\\sin(x)$</td>
                        <td style="padding: 4px;">$0$</td>
                        <td style="padding: 4px;">$\\frac{1}{2}$</td>
                        <td style="padding: 4px;">$\\frac{\\sqrt{2}}{2}$</td>
                        <td style="padding: 4px;">$\\frac{\\sqrt{3}}{2}$</td>
                        <td style="padding: 4px;">$1$</td>
                        <td style="padding: 4px;">$0$</td>
                    </tr>
                </table>
            </div>

            <h4>2. Propriétés des Fonctions Sinus et Cosinus</h4>
            <p>Pour tout réel $x$ et tout entier relatif $k$, on a les relations fondamentales :</p>
            <div class="math-formula-box">
                • <strong>Relation fondamentale :</strong> $\\cos^2(x) + \\sin^2(x) = 1$<br>
                • <strong>Périodicité :</strong> $\\cos(x + 2k\\pi) = \\cos(x)$ et $\\sin(x + 2k\\pi) = \\sin(x)$ (période $2\\pi$).<br>
                • <strong>Parité :</strong> La fonction cosinus est <strong>paire</strong> : $\\cos(-x) = \\cos(x)$. La fonction sinus est <strong>impaire</strong> : $\\sin(-x) = -\\sin(x)$.
            </div>

            <h4>3. Relations d'angles associés</h4>
            <p>Par symétries sur le cercle trigonométrique, on établit pour tout réel $x$ :
            $$\\cos(\\pi - x) = -\\cos(x) \\quad | \\quad \\sin(\\pi - x) = \\sin(x)$$
            $$\\cos(\\pi + x) = -\\cos(x) \\quad | \\quad \\sin(\\pi + x) = -\\sin(x)$$
            $$\\cos\\left(\\frac{\\pi}{2} - x\\right) = \\sin(x) \\quad | \\quad \\sin\\left(\\frac{\\pi}{2} - x\\right) = \\cos(x)$$</p>

            <h4>4. Équations Trigonométriques</h4>
            <div class="math-formula-box">
                • <strong>$\\cos(x) = \\cos(a) \\iff x = a + 2k\\pi$ ou $x = -a + 2k\\pi$</strong> (où $k \\in \\mathbb{Z}$)<br>
                • <strong>$\\sin(x) = \\sin(a) \\iff x = a + 2k\\pi$ ou $x = \\pi - a + 2k\\pi$</strong> (où $k \\in \\mathbb{Z}$)
            </div>
        `,
        widget: {
            type: "trigonometrie",
            params: [
                { name: "theta", min: -3.14, max: 3.14, step: 0.05, default: 0.78 }
            ],
            instructions: "Faites varier l'angle $\\theta$ (en radians) à l'aide du curseur pour observer sa position sur le cercle trigonométrique et les valeurs associées de $\\cos(\\theta)$ (en vert) et $\\sin(\\theta)$ (en rose)."
        },
        exercises: [
            {
                level: 1,
                title: "Application Directe",
                questions: [
                    {
                        id: 1,
                        type: "qcm",
                        statement: "Quelle est la mesure en radians d'un angle de $120^\\circ$ ?",
                        choices: [
                            "$\\frac{\\pi}{3}$ rad",
                            "$\\frac{2\\pi}{3}$ rad",
                            "$\\frac{3\\pi}{4}$ rad",
                            "$\\frac{5\\pi}{6}$ rad"
                        ],
                        answer: 1,
                        hint: "Utilisez la relation de proportionnalité: un angle $d$ en degrés correspond à $r = d \\times \\frac{\\pi}{180}$ radians.",
                        solution: "On applique la formule de conversion : $120 \\times \\frac{\\pi}{180} = \\frac{120}{180}\\pi = \\frac{2}{3}\\pi$ rad."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "Déterminez la valeur exacte de $\\cos(\\frac{\\pi}{3})$. Saisissez la réponse sous sa forme décimale.",
                        placeholder: "Ex: 0.5",
                        answer: "0.5",
                        hint: "Référez-vous aux valeurs remarquables du cours ou au cercle trigonométrique pour l'abscisse de l'angle $\\frac{\\pi}{3}$ (60°).",
                        solution: "D'après le cours, la valeur exacte de $\\cos(\\frac{\\pi}{3})$ est $\\frac{1}{2} = 0,5$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Quelle est la valeur exacte de $\\sin(-\\frac{\\pi}{4})$ ?",
                        choices: [
                            "$-\\frac{1}{2}$",
                            "$-\\frac{\\sqrt{2}}{2}$",
                            "$\\frac{\\sqrt{2}}{2}$",
                            "$-\\frac{\\sqrt{3}}{2}$"
                        ],
                        answer: 1,
                        hint: "Utilisez la propriété d'imparité de la fonction sinus: $\\sin(-x) = -\\sin(x)$, combinée avec la valeur remarquable en $\\frac{\\pi}{4}$.",
                        solution: "La fonction sinus étant impaire, on a : $\\sin(-\\frac{\\pi}{4}) = -\\sin(\\frac{\\pi}{4}) = -\\frac{\\sqrt{2}}{2}$."
                    }
                ]
            },
            {
                level: 2,
                title: "Entraînement",
                questions: [
                    {
                        id: 1,
                        type: "input",
                        statement: "Soit $x$ un réel tel que $\\sin(x) = 0.6$ et $x \\in [0 ; \\frac{\\pi}{2}]$. Calculez la valeur décimale exacte de $\\cos(x)$.",
                        placeholder: "Saisissez un décimal",
                        answer: "0.8",
                        hint: "Utilisez la relation fondamentale $\\cos^2(x) + \\sin^2(x) = 1$. Isolez $\\cos^2(x)$, puis prenez sa racine positive car $x \\in [0 ; \\frac{\\pi}{2}]$.",
                        solution: "On a : $\\cos^2(x) + \\sin^2(x) = 1 \\Rightarrow \\cos^2(x) + (0.6)^2 = 1 \\Rightarrow \\cos^2(x) = 1 - 0.36 = 0.64$. Comme $x$ est dans $[0 ; \\frac{\\pi}{2}]$, son cosinus est positif, donc $\\cos(x) = \\sqrt{0.64} = 0,8$."
                    },
                    {
                        id: 2,
                        type: "qcm",
                        statement: "Simplifiez l'expression suivante pour tout réel $x$ : $A(x) = \\cos(\\pi - x) + \\cos(\\pi + x)$.",
                        choices: [
                            "$2\\cos(x)$",
                            "$-2\\cos(x)$",
                            "$0$",
                            "$-2\\sin(x)$"
                        ],
                        answer: 1,
                        hint: "Utilisez les formules d'angles associés: $\\cos(\\pi - x) = -\\cos(x)$ et $\\cos(\\pi + x) = -\\cos(x)$. Sommez les deux expressions.",
                        solution: "$A(x) = \\cos(\\pi - x) + \\cos(\\pi + x) = -\\cos(x) + (-\\cos(x)) = -2\\cos(x)$."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Résolvez dans l'intervalle $]-\\pi ; \\pi]$ l'équation : $\\cos(x) = \\frac{1}{2}$.",
                        choices: [
                            "$S = \\{\\frac{\\pi}{3}\\}$",
                            "$S = \\{-\\frac{\\pi}{3} ; \\frac{\\pi}{3}\\}$",
                            "$S = \\{\\frac{\\pi}{6} ; \\frac{5\\pi}{6}\\}$",
                            "$S = \\{-\\frac{\\pi}{6} ; \\frac{\\pi}{6}\\}$"
                        ],
                        answer: 1,
                        hint: "Cherchez les angles sur le cercle trigonométrique dont l'abscisse (le cosinus) vaut $1/2$. Pensez aux angles symétriques par rapport à l'axe des abscisses.",
                        solution: "Dans $]-\\pi ; \\pi]$, l'équation $\\cos(x) = \\cos(\\frac{\\pi}{3})$ admet exactement deux solutions symétriques : $x_1 = \\frac{\\pi}{3}$ et $x_2 = -\\frac{\\pi}{3}$."
                    }
                ]
            },
            {
                level: 3,
                title: "Problèmes de Synthèse",
                questions: [
                    {
                        id: 1,
                        type: "qcm",
                        statement: "Déterminez la fonction dérivée de $f(x) = \\cos(3x + 1)$ sur $\\mathbb{R}$.",
                        choices: [
                            "$f'(x) = -\\sin(3x + 1)$",
                            "$f'(x) = -3\\sin(3x + 1)$",
                            "$f'(x) = 3\\sin(3x + 1)$",
                            "$f'(x) = -3\\cos(3x + 1)$"
                        ],
                        answer: 1,
                        hint: "Appliquez la formule de dérivation d'une fonction composée: $(\\cos(ax+b))' = -a \\sin(ax+b)$.",
                        solution: "La dérivée de $\\cos(u(x))$ est $-u'(x)\\sin(u(x))$. Ici $u(x) = 3x+1$ donc $u'(x) = 3$. La dérivée est donc $f'(x) = -3\\sin(3x+1)$."
                    },
                    {
                        id: 2,
                        type: "input",
                        statement: "La hauteur d'une marée dans un port (en mètres) est modélisée par $h(t) = 5 + 3\\sin(\\frac{\\pi}{6} t)$ où $t \\ge 0$ est l'heure. Déterminez la hauteur maximale (en mètres) atteinte dans ce port.",
                        placeholder: "Saisissez un entier",
                        answer: "8",
                        hint: "Rappelez-vous que pour tout réel $X$, $-1 \\le \\sin(X) \\le 1$. La hauteur est maximale quand le sinus atteint sa valeur maximale de 1.",
                        solution: "La fonction sinus étant bornée supérieurement par 1, le maximum de $h(t)$ est atteint lorsque $\\sin(\\frac{\\pi}{6} t) = 1$. La hauteur vaut alors $h_{max} = 5 + 3 \\times 1 = 8$ mètres."
                    },
                    {
                        id: 3,
                        type: "qcm",
                        statement: "Dans un triangle $ABC$, on donne $AB = 5$, $AC = 8$ et l'angle $\\widehat{A} = 60^\\circ$ ($\\frac{\\pi}{3}$ rad). Calculez la longueur exacte du troisième côté $BC$.",
                        choices: [
                            "$BC = 7$",
                            "$BC = \\sqrt{129}$",
                            "$BC = 9$",
                            "$BC = \\sqrt{97}$"
                        ],
                        answer: 0,
                        hint: "Appliquez la formule d'Al-Kashi (théorème de Pythagore généralisé) : $BC^2 = AB^2 + AC^2 - 2 \\times AB \\times AC \\times \\cos(\\widehat{A})$.",
                        solution: "$BC^2 = 5^2 + 8^2 - 2 \\times 5 \\times 8 \\times \\cos(60^\\circ) = 25 + 64 - 80 \\times 0.5 = 89 - 40 = 49$. D'où $BC = \\sqrt{49} = 7$."
                    }
                ]
            }
        ],
        quiz: [
            {
                question: "Quelle est la mesure principale de l'angle orienté de vecteurs de mesure $\\frac{17\\pi}{3}$ ?",
                choices: [
                    "$\\frac{\\pi}{3}$",
                    "$-\\frac{\\pi}{3}$",
                    "$\\frac{5\\pi}{3}$",
                    "$\\frac{2\\pi}{3}$"
                ],
                answer: 1,
                explanation: "On cherche la mesure principale dans l'intervalle $]-\\pi ; \\pi]$. On écrit : $\\frac{17\\pi}{3} = \\frac{18\\pi - \\pi}{3} = 6\pi - \\frac{\\pi}{3}$. Comme $6\pi$ est un multiple pair de $\\pi$ ($3 \\times 2\\pi$), l'angle est congru à $-\\frac{\\pi}{3}$ modulo $2\\pi$, qui appartient bien à $]-\\pi ; \\pi]$."
            },
            {
                question: "Pour tout réel $x$, la quantité $\\sin(-x)$ est égale à :",
                choices: [
                    "$\\sin(x)$",
                    "$-\\sin(x)$",
                    "$\\cos(x)$",
                    "$-\\cos(x)$"
                ],
                answer: 1,
                explanation: "Par définition géométrique et propriétés de symétrie, la fonction sinus est impaire sur $\\mathbb{R}$. Ainsi, pour tout réel $x$, $\\sin(-x) = -\\sin(x)$."
            },
            {
                question: "La fonction sinus possède l'une des propriétés suivantes. Laquelle ?",
                choices: [
                    "Elle est paire",
                    "Elle est impaire",
                    "Elle est périodique de période $\\pi$",
                    "Elle est strictement croissante sur $\\mathbb{R}$"
                ],
                answer: 1,
                explanation: "Comme vu précédemment, la fonction sinus est impaire. Elle est périodique de période $2\\pi$ (et non $\\pi$), et elle oscille continuellement entre -1 et 1, donc elle n'est pas strictement croissante."
            },
            {
                question: "Quelle est la valeur exacte de $\\cos(\\frac{5\\pi}{6})$ ?",
                choices: [
                    "$\\frac{\\sqrt{3}}{2}$",
                    "$-\\frac{\\sqrt{3}}{2}$",
                    "$\\frac{1}{2}$",
                    "$-\\frac{1}{2}$"
                ],
                answer: 1,
                explanation: "On utilise l'angle associé : $\\frac{5\\pi}{6} = \\pi - \\frac{\\pi}{6}$. Donc : $\\cos(\\frac{5\\pi}{6}) = \\cos(\\pi - \\frac{\\pi}{6}) = -\\cos(\\frac{\\pi}{6}) = -\\frac{\\sqrt{3}}{2}$."
            },
            {
                question: "L'équation $\\sin(x) = 2$ admet sur $\\mathbb{R}$ :",
                choices: [
                    "Une unique solution",
                    "Une infinité de solutions périodiques",
                    "Aucune solution réelle",
                    "Deux solutions sur $]-\\pi ; \\pi]$"
                ],
                answer: 2,
                explanation: "Pour tout réel $x$, la fonction sinus est strictement encadrée par -1 et 1 ($-1 \\le \\sin(x) \\le 1$). La valeur 2 étant strictement supérieure à 1, l'équation n'admet aucune solution réelle."
            }
        ]
    }
];

/**
 * BASE DE DONNÉES DE L'ÉVALUATION GLOBALE (12 questions transversales de synthèse)
 * Supprime les questions sur les limites et intègre les variables aléatoires.
 */
const GLOBAL_QUIZ_QUESTIONS = [
    {
        id: 1,
        category: "Second Degré",
        question: "Soit le trinôme $f(x) = x^2 - 6x + 9$. Combien de fois sa courbe représentative coupe-t-elle l'axe des abscisses ?",
        choices: [
            "Aucune fois",
            "Exactement 1 fois (tangence en $x = 3$)",
            "Exactement 2 fois",
            "On ne peut pas le déterminer"
        ],
        answer: 1,
        explanation: "$f(x) = (x-3)^2$ est une identité remarquable (discriminant $\\Delta = (-6)^2 - 4 \\times 1 \\times 9 = 36-36 = 0$). Puisque $\\Delta = 0$, il y a une unique racine double $x_0 = 3$. La courbe coupe donc l'axe en $(3 ; 0)$."
    },
    {
        id: 2,
        category: "Second Degré",
        question: "Quelle est l'expression factorisée du trinôme $2x^2 - 10x + 12$, sachant que ses racines sont 2 et 3 ?",
        choices: [
            "$(x - 2)(x - 3)$",
            "$2(x - 2)(x - 3)$",
            "$2(x + 2)(x + 3)$",
            "$-2(x - 2)(x - 3)$"
        ],
        answer: 1,
        explanation: "Un trinôme se factorise sous la forme $a(x-x_1)(x-x_2)$. Ici $a=2$, $x_1=2$ et $x_2=3$, donc la factorisation est $2(x-2)(x-3)$."
    },
    {
        id: 3,
        category: "Dérivation",
        question: "Soit $f$ une fonction dérivable sur $\\mathbb{R}$ dont l'équation de la tangente au point d'abscisse 1 est $y = -3x + 5$. Que valent $f(1)$ et $f'(1)$ ?",
        choices: [
            "f(1) = 5 et f'(1) = -3",
            "f(1) = 2 et f'(1) = -3",
            "f(1) = -3 et f'(1) = 5",
            "f(1) = 2 et f'(1) = 5"
        ],
        answer: 1,
        explanation: "Le coefficient directeur de la tangente en 1 est égal au nombre dérivé $f'(1) = -3$. L'image est $f(1) = -3(1) + 5 = 2$."
    },
    {
        id: 4,
        category: "Dérivation",
        question: "Quelle est la dérivée de la fonction quotient $g(x) = \\frac{2x+1}{x-3}$ sur $]3 ; +\\infty[$ ?",
        choices: [
            "$g'(x) = \\frac{2}{(x-3)^2}$",
            "$g'(x) = -\\frac{7}{(x-3)^2}$",
            "$g'(x) = \\frac{2x-7}{(x-3)^2}$",
            "$g'(x) = \\frac{2(x-3) - (2x+1)}{(x-3)^2} = -\\frac{7}{(x-3)^2}$"
        ],
        answer: 3,
        explanation: "On utilise la formule $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$ avec $u(x) = 2x+1$ et $v(x) = x-3$. On obtient $g'(x) = \\frac{2(x-3) - (2x+1)(1)}{(x-3)^2} = -\\frac{7}{(x-3)^2}$."
    },
    {
        id: 5,
        category: "Suites Numériques",
        question: "Soit la suite géométrique de premier terme $u_0 = 3$ et de raison $q = 2$. Que vaut la somme des 4 premiers termes $S = u_0 + u_1 + u_2 + u_3$ ?",
        choices: [
            "24",
            "45",
            "15",
            "30"
        ],
        answer: 1,
        explanation: "Les 4 premiers termes sont $u_0=3$, $u_1=6$, $u_2=12$, $u_3=24$. Leur somme directe est $3+6+12+24 = 45$."
    },
    {
        id: 6,
        category: "Suites Numériques",
        question: "Une suite arithmétique $(u_n)$ vérifie $u_3 = 12$ et $u_7 = 24$. Quelle est la raison $r$ de cette suite ?",
        choices: [
            "r = 3",
            "r = 4",
            "r = 2",
            "r = 6"
        ],
        answer: 0,
        explanation: "Pour une suite arithmétique : $u_7 = u_3 + 4r \\Rightarrow 24 = 12 + 4r \\Rightarrow 4r = 12 \\Rightarrow r = 3$."
    },
    {
        id: 7,
        category: "Fonction Exponentielle",
        question: "Résoudre dans $\\mathbb{R}$ l'inéquation $e^{2x} - e > 0$.",
        choices: [
            "$x \\in ]0.5 ; +\\infty[$",
            "$x \\in ]1 ; +\\infty[$",
            "$x \\in ]-\\infty ; 0.5[$",
            "Pas de solution"
        ],
        answer: 0,
        explanation: "$e^{2x} > e^1 \\iff 2x > 1 \\iff x > 0.5$. Les solutions forment l'intervalle $]0.5 ; +\\infty[$."
    },
    {
        id: 8,
        category: "Fonction Exponentielle",
        question: "Déterminer la dérivée de la fonction $f(x) = (x+2)e^x$ sur $\\mathbb{R}$.",
        choices: [
            "$f'(x) = 1 \\times e^x = e^x$",
            "$f'(x) = (x+3)e^x$",
            "$f'(x) = (x+2)e^x$",
            "$f'(x) = (x+1)e^x$"
        ],
        answer: 1,
        explanation: "En appliquant la formule $(uv)' = u'v + uv'$ : $f'(x) = 1 \\times e^x + (x+2)e^x = (x+3)e^x$."
    },
    {
        id: 9,
        category: "Produit Scalaire",
        question: "Dans le repère orthonormé, on considère la droite d'équation $3x - 4y + 7 = 0$. Lequel des vecteurs suivants est normal à cette droite ?",
        choices: [
            "\\vec{u}(4 ; 3)",
            "\\vec{n}(3 ; -4)",
            "\\vec{v}(-4 ; 7)",
            "\\vec{w}(3 ; 4)"
        ],
        answer: 1,
        explanation: "Une droite $ax+by+c=0$ admet pour vecteur normal $\\vec{n}(a;b)$. En identifiant avec $3x - 4y + 7 = 0$, le vecteur normal est $\\vec{n}(3 ; -4)$."
    },
    {
        id: 10,
        category: "Produit Scalaire",
        question: "Soit un triangle équilatéral $ABC$ de côté $a = 4$. Quelle est la valeur de leur produit scalaire $\\overrightarrow{AB} \\cdot \\overrightarrow{AC}$ ?",
        choices: [
            "16",
            "8",
            "8\\sqrt{3}",
            "0"
        ],
        answer: 1,
        explanation: "Le triangle étant équilatéral, l'angle vaut 60°. $\\overrightarrow{AB} \\cdot \\overrightarrow{AC} = AB \\times AC \\times \\cos(60°) = 4 \\times 4 \\times 0.5 = 8$."
    },
    {
        id: 11,
        category: "Variables Aléatoires",
        question: "Soit la variable aléatoire $X$ modélisant le gain net à un jeu. On a : $P(X=-5)=0.8$ et $P(X=15)=0.2$. Quelle est l'espérance de ce jeu ?",
        choices: [
            "-1 €",
            "0 € (Jeu équitable)",
            "1 €",
            "-2 €"
        ],
        answer: 0,
        explanation: "$E(X) = -5 \\times 0.8 + 15 \\times 0.2 = -4 + 3 = -1$ €."
    },
    {
        id: 12,
        category: "Variables Aléatoires",
        question: "Soit une variable aléatoire $Y$ dont la variance vaut $V(Y) = 16$. Quel est son écart-type $\\sigma(Y)$ ?",
        choices: [
            "256",
            "8",
            "4",
            "-4"
        ],
        answer: 2,
        explanation: "L'écart-type est égal à la racine carrée positive de la variance : $\\sigma(Y) = \\sqrt{V(Y)} = \\sqrt{16} = 4$."
    },
    {
        id: 13,
        category: "Trigonométrie",
        question: "Pour tout réel $x$, simplifiez l'expression $\\cos(\\pi - x) + \\sin(\\frac{\\pi}{2} - x)$.",
        choices: [
            "$0$",
            "$2\\cos(x)$",
            "$\\cos(x) - \\sin(x)$",
            "$-\\cos(x) + \\sin(x)$"
        ],
        answer: 0,
        explanation: "D'après les formules d'angles associés : $\\cos(\\pi - x) = -\\cos(x)$ et $\\sin(\\frac{\\pi}{2} - x) = \\cos(x)$. En sommant les deux termes, on obtient $-\\cos(x) + \\cos(x) = 0$."
    },
    {
        id: 14,
        category: "Trigonométrie",
        question: "Quelle est la valeur exacte de $\\sin(\\frac{4\\pi}{3})$ ?",
        choices: [
            "$\\frac{\\sqrt{3}}{2}$",
            "$-\\frac{\\sqrt{3}}{2}$",
            "$\\frac{1}{2}$",
            "$-\\frac{1}{2}$"
        ],
        answer: 1,
        explanation: "On écrit $\\frac{4\\pi}{3} = \\pi + \\frac{\\pi}{3}$. D'après la relation d'angle associé : $\\sin(\\pi + x) = -\\sin(x)$. Donc $\\sin(\\frac{4\\pi}{3}) = -\\sin(\\frac{\\pi}{3}) = -\\frac{\\sqrt{3}}{2}$."
    }
];
