# oslo-bysykkel

Hello! This is a small webapp made by me, Igor Orlov, on the 13. january for Oslo Origo.

It shows city bike stations in Oslo, Norway in real time and their bike/dock availability.

Completely based on the following open API (Norwegian!): https://oslobysykkel.no/apne-data/sanntid

Technology stack is vanilla HTML/CSS/JS packed by Webpack and running by node (express.js).

Use `npm run dev` in root directory for dev run (supports hot reload).

Use `npm run start` for production build.


---

The following endpoints were used:

https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json

https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json

