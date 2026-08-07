# Website Zengruppe Linz

## Overview

[www.zengruppe-linz.at](www.zengruppe-linz.at) is an information web site about a small group practising Zazen on a weekly basis. Its primary purpose is to convey information about

- the basic idea why (often) and how this group meets
- the Buddhist lineage the group follows
- the Zendo
- further offers within the group

## Technology Stack

- The whole site is statically generated using Astro (<https://astro.build>).
- Content is provided via md files which, in turn, are built via Pages CMS (<https://pagescms.org>).
- The site is deployed via Github Pages

## Technical and Organizational Constraints

- All repos are hosted by the github organization [zengruppe-linz](https://github.com/zengruppe-linz).
- `.pages.yml` has to conform strictly to the specs of Pages CMS

## Deployment and Releasing of Software

### Procedure

- All deployments are done via Github pages
- All development work is done inside the repository [`development`](https://github.com/zengruppe-linz/development).
- Finished features are merged onto branch `development` of repo `development` which triggers a deployment to the [github page of `development`](https://zengruppe-linz.github.io/development/).
- Release candidates are merged onto branch `main` of repository `development` which triggers a deployment to the repository [staging](https://github.com/zengruppe-linz/staging) which, itself, starts a deployment towards the [github page of `staging`](https://zengruppe-linz.github.io/staging/). At this point new versions get reviewed.
- In case of a release a github release is done on repository `development`. A new tag is to be assigned. Publishing a release triggers a deployment to the repository [`production`](https://github.com/zengruppe-linz/production) which, itself, starts a deployment towards the [github page of `production`](zengruppe-linz.github.io/production).

### Names of Software Releases

Software releases are named after famous zen temples in Japan. If a name is ticked the release name was already used.

- [x] Daitoku-ji
- [ ] Eihei-ji
- [ ] Engaku-ji
- [ ] Hōkoku-ji
- [ ] Jōchi-ji
- [ ] Jōmyō-ji
- [ ] Jufuku-ji
- [ ] Kenchō-ji
- [ ] Kennin-ji
- [ ] Manpuku-ji
- [ ] Myōshin-ji
- [ ] Nanzen-ji
- [ ] Ryōan-ji
- [ ] Saihō-ji
- [ ] Shōkoku-ji
- [ ] Sōji-ji
- [ ] Tenryū-ji
- [ ] Tōfuku-ji

## Deployment and Release of Content
