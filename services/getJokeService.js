//** Fetch one joke from external API */

async function getJoke () {
    const url = 'https://icanhazdadjoke.com/';

    const customerHeaders = {
        "User-Agent": "My Project (https://github.com/jesus-vc/websocket-express-groupchat)",
        "Accept": "application/json",
    }

    try {
        const joke = await fetch(url,{method:"GET", headers: customerHeaders});
        const body = await joke.json();
        return body.joke;
    } catch (error) {
        return ('There was an error getting your joke. We have logged this and will investigate.')
    }
}

module.exports = getJoke;
