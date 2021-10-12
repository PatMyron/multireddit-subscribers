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

function barClick(event, array){
    window.open(`https://old.reddit.com/r/${array[0]._model.label}`, '_blank').focus();
}

reddit.multi(param('multi')).fetch(function (res) {
    teams = res.data.subreddits.map(x => x.name);
    teamSubs = {};
    ajaxCallsRemaining = teams.length;
    teams.forEach(function (team) {
        reddit.about(team).fetch(function (res2) {
            teamSubs[team] = res2.data.subscribers;
            ajaxCallsRemaining--;
            if (ajaxCallsRemaining <= 0) {
                document.title = 'Multireddit Subscribers | ' + param('multi').split('/').pop();
                $('#otherStuff').remove();
                teamSubs = sortMap(teamSubs);

                ctx = document.getElementById("myChart").getContext('2d');
                myChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: _.keys(teamSubs),
                        datasets: [{
                            label: '# of Subscribers',
                            data: _.values(teamSubs)
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    autoSkip: false,
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        },
                        onClick: barClick
                    }
                });
            }
        })
    });
});
