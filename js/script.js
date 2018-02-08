const $ = (e) => document.querySelector(e);
const $A = (e) => document.querySelectorAll(e);

(function() {
    'use strict';

    var location = localStorage.location || "new york";

    document.body.setAttribute('style', `--accent: ${localStorage.accent || '#76dedf'}`);

    function engines () {
        return {
            g: ['https://google.com/search?q=', 'Google'],
            i: ['https://ixquick.com/do/search?q=', 'Ixquick'],
            d: ['https://duckduckgo.com/html?q=', 'DuckDuckGo'],
            y: ['https://youtube.com/results?search_query=', 'Youtube'],
            w: ['https://en.wikipedia.org/w/index.php?search=', 'Wikipedia']
        };
    }

    // +--------+
    // | SEARCH |
    // +--------+
    var search  = $('#search'),
        input   = $('#search input[type="text"]'),
        engines = engines();

    for (var key in engines)
        $('.search-engines').innerHTML += `<li><p title="${engines[key][1]}">!${key}</p></li>`;

    $('.open-search').onclick = () =>
        search.classList.add('active');

    $('#search .close').onclick = () => search.classList.remove('active');

    document.onkeypress = (e) => {
        if (!$('.settings').classList.contains('active')) {
            if (e.key == 's')
                search.classList.add('active');

            input.focus();
            input.scrollIntoView();

            $('#search .close').onclick = () =>
                search.classList.remove('active');

            search.onkeyup = (e) => {
                let args   = e.target.value.split(' '),
                    prefix = args[0],
                    engine = engines['g'][0], // default engine
                    str    = 0;

                $A('.search-engines li p').forEach((eng) => {
                    let current = eng.parentNode;

                    (prefix == eng.innerHTML)
                        ? current.classList.add('active')
                        : current.classList.remove('active');
                });

                if (e.key == 'Enter') {
                    if (prefix.indexOf('!') == 0)
                        (engine = engines[prefix.substr(1)][0], str = 3);

                    window.location = engine + args.join(' ').substr(str).toString().replace(/\s+/m, '%20');
                } else if (e.keyCode == 27)
                    search.classList.remove('active');
            };
        }
    };

    // +-------+
    // | CLOCK |
    // +-------+
    let setTime = (div, time) => div.innerHTML = time;

    setTime($('p[hour]'), strftime('h'));
    setTime($('p[mins]'), strftime(':M'));
    setTime($('p[ord]'), strftime('p'));
    setTime($('p[month]'), strftime('b'));
    setTime($('p[day]'), strftime('d'));

    // +---------+
    // | WEATHER |
    // +---------+
    function fetchWeather() {
        var weatherRequest = new XMLHttpRequest();
        var url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=50a34e070dd5c09a99554b57ab7ea7e2`;

        weatherRequest.open('GET', url, true);

        weatherRequest.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                let weather = JSON.parse(this.response);

                let temperature    = weather.main.temp.toString(),
                    currentTemp    = (temperature.indexOf('-') != 0 && temperature.indexOf('.') != 2 && temperature.length != 2) ? temperature.substr(0, 1)  : temperature.substr(0, 2),
                    currentWeather = weather.weather[0].main;

                $('.weather p').innerHTML = currentTemp + '&ordm;'
                $('.stats p[location]').innerHTML = location + ', ' + weather.sys.country;
                $('.stats p[description]').innerHTML = currentWeather;

                if (currentWeather == 'Clouds' || currentWeather == 'Mist')
                    $('.weather p[weather]').innerHTML = '<i class="material-icons" cloudy>cloud_queue</i>';
                else if (currentWeather == 'Drizzle' || currentWeather == 'Snow')
                    $('.weather p[weather]').innerHTML = '<i class="material-icons" cloudy>opacity</i>';
                else
                    $('.weather p[weather]').innerHTML = '<i class="material-icons" sunny>wb_sunny</i>';
            }
            else {
                console.log("Weather API returned an error: " + this.response);
                callback(null);
            }
        };

        weatherRequest.onerror = () => {
            console.log("Request to weather API failed.");
            callback(null);
        };

        weatherRequest.send();
    }
    fetchWeather();

    // +--------+
    // | CONFIG |
    // +--------+
    $('.open-config').onclick = () =>
        $('.settings').classList.add('active');

    $('.config .close').onclick = () =>
        $('.settings').classList.remove('active');

    $('input[name=accent]').onkeyup = (e) => {
        let color = e.target.value;

        e.target.setAttribute("style", `--accent: ${color}`);

        if (e.key == 'Enter') {
            localStorage.accent = color;
            window.location.reload();
        }
    };

    $('input[name=location]').onkeyup = (e) => {
        let location = e.target.value;

        if (e.key == 'Enter') {
            localStorage.location = location;
            window.location.reload();
        }
    };
})();