async function get(endpoint) {
    
    var wait = true;
    var result;

    fetch(`http://board-of-war.luihin903.com/${endpoint}`, {
        method : "GET",
    })
        .then(response => response.json())
        .then(data => {
            result = data;
            wait = false;
        })

    while(wait) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return result;
}

async function post(endpoint, body) {
    
    var wait = true;
    var result;

    fetch(`http://board-of-war.luihin903.com/${endpoint}`, {
        method : "POST",
        headers : { "Content-Type" : "application/json" },
        body : JSON.stringify(body)
    })
        .then(response => response.json())
        .then(data => {
            result = data;
            wait = false;
        })

    while(wait) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return result;
}

export default {
    get,
    post
}