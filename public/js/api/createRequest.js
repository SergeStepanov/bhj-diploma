/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest();
    let method = options.method;
    let url = 'http://localhost:8000';
    let formData;

    if (options.method === 'GET' && options.data) {
        if (options.data) {
            let urlOption = Object.entries(options.data)
                .map(([key, value]) => `${key}=${value}`)
                .join('&');
            url += `${options.url}?${urlOption}`;
        }
    } else {
        url += options.url;

        formData = new FormData();

        for (let item in options.data) {
            formData.append(item, options.data[item]);
        }
    }

    xhr.addEventListener('readystatechange', function () {
        if (xhr.readyState === 4) {
            let parseResp = JSON.parse(xhr.response);

            if (parseResp['success']) {
                options.callback(null, parseResp);
            } else {
                options.callback(parseResp['error'], null);
            }
        }
    });

    try {
        xhr.open(options.method, url);

        if (formData !== undefined) {
            xhr.send(formData);
        } else {
            xhr.send();
        }
    } catch (e) {
        console.log(e);
        options.callback(e);
    }
};
