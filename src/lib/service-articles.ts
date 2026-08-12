/**
 * L'appariement article de blogue <-> hub de service, dans UNE seule carte, lue
 * dans les deux sens.
 *
 * POURQUOI ÇA EXISTE. Mesuré le 2026-08-11 sur `dist/` : une page de blogue
 * n'avait qu'**un seul** lien éditorial sortant, `/soumission/`. Les 8 articles
 * étaient donc des culs-de-sac — ils ne transmettaient rien aux pages qui
 * portent le chiffre d'affaires, et ils ne recevaient eux-mêmes que le lien de
 * l'index et du pied de page. C'est le défaut de maillage le plus coûteux qui
 * restait sur le site, et il ne se voyait pas : `link-audit` ne compte les
 * liens contextuels que sur les pages « money » (services, secteurs, matrice),
 * et le blogue n'en est pas une.
 *
 * LES DEUX SENS VIENNENT DE LA MÊME CARTE, sinon ils divergent au premier
 * ajout : un article lié depuis un hub qui ne le lie pas en retour est une
 * asymétrie que personne ne remarque avant l'audit suivant.
 *
 * ⚠ CHAQUE PAIRE EST ÉDITORIALE, PAS AUTOMATIQUE. Lier les 4 articles depuis
 * les 11 hubs donnerait 44 liens, ferait exploser le compte d'ancres et
 * transformerait un vrai signal topique en mobilier — exactement ce que la
 * grille « sujets liés » des hubs de secteur avait produit avant d'être dérivée
 * des données (PROGRESS session 4). Une paire n'existe que si l'article dit
 * quelque chose sur CE service. En cas de doute, on n'ajoute pas.
 *
 * Les clés sont des `translationKey`, jamais des slugs : les slugs diffèrent
 * d'une langue à l'autre, la carte doit valoir pour les deux (PLAYBOOK §7.2).
 */
import type { ServiceKey } from '../data/slugs.ts';

export const ARTICLE_SERVICES: Record<string, readonly ServiceKey[]> = {
  /**
   * La norme BNQ 3661-500 vise les dépôts d'ocre dans les systèmes de drainage,
   * et la BNQ 3624-130 le tuyau perforé. Elle porte donc directement sur le
   * drain et sur l'ocre — et sur l'inspection, parce que la partie I est un
   * diagnostic, pas une pose.
   */
  'bnq-3661-500': ['drain', 'ocre', 'inspection'],

  /**
   * Les sous-catégories de licence : 3.2 pour un mur de fondation, 2.6 pour la
   * reprise en sous-œuvre, 7 pour l'étanchéité. Chacune correspond à un service
   * précis, et c'est le seul article qui les nomme.
   */
  'rbq-licence-check': ['fissure', 'affaissement', 'impermeabilisation', 'videSanitaire'],

  /**
   * Le plan de garantie couvre les vices de conception, de construction et
   * **les vices du sol** pendant 5 ans. C'est la fenêtre qui vise une fondation
   * qui bouge, une fissure structurale — et le gonflement d'un remblai de
   * pyrite sur une maison récente, qui est justement un sujet de transaction et
   * non de réparation courante.
   */
  'gcr-warranty': ['fissure', 'affaissement', 'pyrite'],

  /**
   * Le R.V.Q. 2978 décide de l'ouvrage lui-même : vers quel réseau le drain se
   * raccorde, la cheminée d'accès de 100 mm qui rend l'inspection caméra
   * possible plus tard, et le bassin de rétention avec pompage quand la gravité
   * ne suffit pas.
   */
  'excavation-permit': ['drain', 'inspection', 'puisard', 'infiltration'],
};

/** Le sens inverse, dérivé — jamais tenu à la main. */
export function articlesForService(service: ServiceKey): string[] {
  return Object.entries(ARTICLE_SERVICES)
    .filter(([, services]) => (services as readonly string[]).includes(service))
    .map(([key]) => key);
}
