# Photos de secteurs — région de Québec

49 photos de lieux réels de la Communauté métropolitaine de Québec, exportées du dépôt
`exterminateur-qc` le 2026-08-11. Chacune a une provenance vérifiée et une licence connue.

```
images/          49 fichiers, ≤ 2400 px sur le grand côté, JPEG qualité 72–88
CREDITS.md       auteur + licence + page source pour chaque fichier — À CONSERVER
alt-text.json    texte alternatif FR/EN déjà rédigé pour chaque image
```

---

## LA VRAIE QUESTION N'EST PAS LA LICENCE

Côté droits, c'est réglé : 29 fichiers sont CC0 ou domaine public (aucune mention requise),
20 sont CC BY / CC BY-SA (auteur et licence à nommer — voir `CREDITS.md` §2). Vous pouvez les
réutiliser.

**Le risque est ailleurs. Ces photos montrent des endroits nommés et reconnaissables :** la chute
Kabir Kouba à Wendake, l'église Saint-Sauveur et la rue Victoria, le boulevard Wilfrid-Hamel, une
vue aérienne de Charny, la maison Morisset sur le chemin Royal. Chaque fichier a été choisi et
vérifié à l'œil pour **prouver** que la page parle bien de cet endroit-là.

### Elles ne sont donc réutilisables que sur un site qui couvre le même territoire

| Cas | Verdict |
|---|---|
| Autre site, **même région** (Québec, Lévis, CMQ) | ✅ Réutilisez-les. C'est exactement leur usage. |
| Autre site, **autre région** (Estrie, Montréal, Trois-Rivières…) | ❌ **Ne les utilisez pas.** |
| Autre **niche**, même région (toiture, déneigement…) | ✅ Sans problème : ce sont des photos de lieux, pas de ravageurs. |

**Pourquoi le non est catégorique.** Mettre une photo de Charny sur une page « exterminateur à
Sherbrooke » est faux, et c'est faux de la manière la plus coûteuse : un lecteur local reconnaît
l'endroit et comprend que le site ne connaît pas sa ville. C'est l'erreur exacte que le projet
`exterminateur-qc` a payée une fois — un fichier nommé
`exterminateur-estrie-quartier-residentiel.webp` s'est révélé être une photo de **Leiwen, un
village allemand de la Moselle**, panneau visible. Elle a été exclue plutôt que renommée. Deux
autres candidats ont été rejetés pour la même raison : une photo du *Vanier Cup* (le championnat
de football, pas le quartier Vanier) et une église *Saint-Nicolas* qui était à **Nantes, en
France**.

Le nom de fichier ne prouve rien. **Seul le contenu de l'image compte.**

### Si l'autre site est en Estrie

Ne prenez rien ici. La méthode qui a fonctionné, elle, se transpose entièrement — c'est elle qui
a de la valeur, pas les fichiers :

1. **Toponyme + marqueur administratif** dans la requête Wikimedia Commons, pas le toponyme seul.
   `Charny` ne donne rien d'exploitable; `Charny Lévis` donne douze photos. Pour l'Estrie :
   `Lennoxville Sherbrooke`, `Magog Estrie`, `Coaticook Québec`.
2. **Lire les catégories Commons, pas la description**, qui est souvent vide. `Churches in Lévis`
   ou `March 2010 in Quebec` est un marqueur régional fiable.
3. **Chercher par point de repère** quand la municipalité n'a pas d'article : un pont, une chute,
   une gare, une église, une artère nommée.
4. **Rejeter tout CC BY / CC BY-SA sans auteur nommé.** Une licence qui exige l'attribution mais
   dont l'auteur est introuvable est inutilisable.
5. **Regarder chaque image avant de la brancher.** Deux rejets récents étaient géographiquement
   corrects et quand même mauvais : un mur d'église avec un conteneur de chantier et un cône
   orange, et une photo impeccable mais en 450 × 600 px, trop petite pour un hero.

Le script de recherche Commons utilisé pour cette passe vérifie licence et auteur **depuis l'API
au moment du téléchargement** et refuse d'écrire un fichier dont la licence ne correspond pas.
Il est reproductible en une trentaine de lignes; `docs/PLAYBOOK.md` du dépôt décrit la méthode.

---

## Installation dans l'autre dépôt

1. Copier `images/*` dans `src/assets/img/` (ou l'équivalent).
2. Reprendre les entrées de `alt-text.json` dans le registre d'alt du projet. **Relire chaque
   alt** : il nomme un lieu précis, donc il ne vaut que si la page parle de ce lieu.
3. Recopier les lignes de `CREDITS.md` dans le fichier de crédits du nouveau projet.
   **Les 20 fichiers de la section 2 en ont besoin pour être publiables légalement.**
4. Renommer si la convention diffère — mais garder la correspondance fichier ↔ crédit intacte.

## Un fichier volontairement absent

`secteur-sainte-foy-tours-boulevard.jpg` n'est **pas** dans cet export : sa provenance est
indéterminée et il est en attente de suppression dans le dépôt d'origine. Le copier ailleurs
dupliquerait le risque d'ayant droit au lieu de le contenir.
