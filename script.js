function param(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
}