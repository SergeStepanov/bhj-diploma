/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const responseXHR = new XMLHttpRequest();
    let url = 'http://localhost:8000/' + options.url;

    responseXHR.responseType = 'json';

    responseXHR.onreadystatechange = function () {
        if (responseXHR.readyState === 4) {
            if (responseXHR.response['success']) {
                options.callback(null, responseXHR.response);
            } else {
                options.callback(responseXHR.response['error'], null);
            }
        }
    };

    try {
        responseXHR.open(options.method, url);
        responseXHR.send(options.data);
    } catch (err) {
        options.callback(new Error(err.message), null);
    }
};
