function param(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
}

function sortMap(mapName) {
    return _.chain(mapName)
        .map((val, key) => {
            return {name: key, count: val}
        })
        .sortBy('count')
        .reverse()
        .keyBy('name')
        .mapValues('count')
        .value();
}