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

}

export default {
    get,
    post
}