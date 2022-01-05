# uk-river-data

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Run your unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Notes

c. 0.5 million readings each day (451,712).
c. 10 thousand different measures (9,801).
c. 5 thousand stations (4,595 active, 4,906 total)

### API

### `/stations?{param}={value}`

Show information for a selection of stations.

### `/station/{id}`

Show information for a station.

### `/station/{id}/data`

Show a station with all recent time series data.

### Embed

Target for embed: 2 requests < 100k.

Need 3 requests: iframe (or script), station details, station name.

Timestamps: 20220101T1234Z - valid ISO8601 basic format, unambiguous however JS
does not parse it!
So use 2022-01-01T12:34Z - valid ISO8601, unambiguous and can be parsed by JS.
