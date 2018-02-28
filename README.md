# npoint

## Setup

```
npm install
```

## Development

```
rails s -p 3001
npm start
```

## Production build

1. Build files

```
npm run build
```

2. Make an "add build files" commit

## Deploying

Set up heroku branches:

```
heroku git:remote -a npoint-io-staging
git remote rename heroku staging

heroku git:remote -a npoint-io
git remote rename heroku production
```

Push:

```
git push staging master
git push production master
```

Maybe run migrations:

```
heroku run rake db:migrate --app npoint-io-staging
heroku run rake db:migrate --app npoint-io
```

## Bookmarks

* [JSON in Postgres](https://blog.codeship.com/unleash-the-power-of-storing-json-in-postgres/)
