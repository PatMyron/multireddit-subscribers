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
    window.open(`https://old.reddit.com/r/${array[0].element.$context.chart.data.labels[array[0].index]}`, '_blank').focus();
}

function multiFromHref(href) {
    return (href.split('multi=')[1] || '').split('&')[0];
}

function populateMultiOptions() {
    const datalist = document.getElementById('multiOptions');
    if (!datalist) {
        return;
    }

    const seen = {};
    Array.from(document.querySelectorAll('#otherStuff a[href^="?multi="]')).forEach(function (link) {
        const multi = decodeURIComponent(multiFromHref(link.getAttribute('href')));
        if (!multi || seen[multi]) {
            return;
        }

        const option = document.createElement('option');
        option.value = multi;
        datalist.appendChild(option);
        seen[multi] = true;
    });
}

populateMultiOptions();

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
                            label: '# of Subreddit Subscribers',
                            data: _.values(teamSubs)
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                grid: {
                                    display: false
                                },
                                ticks: {
                                    autoSkip: false,
                                }
                            },
                            y: {
                                ticks: {
                                    beginAtZero: true
                                }
                            }
                        },
                        onClick: barClick
                    }
                });
            }
        })
    });
});
