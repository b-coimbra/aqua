const $ = (e) => document.querySelector(e);
const $A = (e) => document.querySelectorAll(e);

(function() {
    'use strict';

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

    document.onkeypress = (e) => {
        if (e.key == 's')
            search.classList.add('active');

        input.focus();
        input.scrollIntoView();

        $('.close').onclick = (e) => search.classList.remove('active');

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
            }
        };
    };

    // +-------+
    // | CLOCK |
    // +-------+
    let setTime = (div, time) => div.innerHTML = time;

    setTime($('p[hour]'), strftime('h'));
    setTime($('p[mins]'), strftime(':M'));
    setTime($('p[ord]'),  strftime('p'));

    function httpGet(url) {
        let xmlHttp  = new XMLHttpRequest();

        xmlHttp.onreadystatechange = () => {
            if (this.readyState == 4 && this.status == 200)
                callback(xmlHttp.responseText);
        }
        xmlHttp.open("GET", url, true); // true for asynchronous 
        xmlHttp.send(null);
    }

    function weather() {
        let location = "Sao Paulo";
        let query = `http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=50a34e070dd5c09a99554b57ab7ea7e2`;

        console.log(JSON.parse(httpGet(query)));
    }

    weather();
})();