async function get(endpoint) {
    
    var wait = true;
    var result;

    fetch(`http://localhost:3000/${endpoint}`, {
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