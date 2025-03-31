Goal is to make a data visualisation platform for youtube streamers.
It will leverage both youtube's public api (Youtube Data API v3) and youtube's internal api (known as innertube).

It will include visualisations on data such as ccv, revenue, memberships, likes, dislikes, comment count, subscriber count, and will also include statistical inference techniques to predict channel growth and other factors.
It will also include features of tracking upcoming videos, compare channels/streams with each other, and have youtube channel profiles.

Application will be developed with Angular as the frontend, and NestJS as the backend, both leveraging TypeScript. The primary database will be PostGreSQL. Still unsure about using cloud services (AWS or Azure) because of pricing but we'll see.

For storage and compute reasons, only a small subset of youtube channels will be included, and streaming data will be deleted every 30 days. I have an idea to make this into a PWA that runs on the user's local computer (server and database running on their computer), so they can see visualisations on their choice of streamer.

This is just a readme placeholder.
