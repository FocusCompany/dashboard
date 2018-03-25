const Toast = {
    error: (text, title) => $.toast({
        heading: title || 'Error',
        text: text,
        showHideTransition: 'slide',
        icon: 'error',
        hideAfter: false
    }),
    info: (text, title) => $.toast({
        heading: title || 'Success',
        text: text,
        showHideTransition: 'slide',
        icon: 'info'
    }),
    success: (text, title) => $.toast({
        heading: 'Success',
        text: text,
        showHideTransition: 'slide',
        icon: 'success'
    })
}

function callAPI(endpoint, data, method, extraHeaders) { // API Promise "Generator"
    return ($.ajax({
        type: method || 'POST',
        headers: extraHeaders,
        url: APIRoot + endpoint,
        crossDomain: true,
        data: data,
        dataType: 'json'
    }));
}

function camelToSnake(str) {
    return str.replace(/[A-Z]/g, (m) => '_' + m.toLowerCase());
}