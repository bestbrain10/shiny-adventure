const webhook = 'https://webhook.site/2653cf4e-11b4-4a20-a604-61e364deae48';

const axios = require('axios').default;


module.exports = async (tag) => {
    try {
        const { data } = await axios.get(`${webhook}?tag=${tag}`);
        console.log(data);
        return data;
    } catch(e) {
        console.log(e);
        return Promise.reject('request to webhook failed');
    }
}