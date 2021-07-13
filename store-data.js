const database = require('./database');
const { countBy, method } = require('lodash');
const webhook = require('./call-webhook');


module.exports = async (req, res, next) => {
    // save the ticket
    const { user_id, title, tags } = req.body;
    const data = await database('tickets').insert({
        user_id,
        title
    });

    // { tag: number of times tag occured in tags array }
    const tagsCounted = countBy(tags, method('valueOf'));

    for (let tag in tagsCounted) {
        // increment in DB
        const count = await database('tags').where({
            tag_name: tag
        })
        .increment('count', tagsCounted[tag]);

        if(!count) {
            // insert new record
            await database('tags').insert({
                tag_name: tag,
                count: tagsCounted[tag]
            });
        }
    }

    // fetch highest counting tag and send to webhook
    const [ [ highestCountTag ] ] = await database.raw(`SELECT MAX(count) as count, tag_name FROM tags GROUP BY tag_name LIMIT 1`);
    if (highestCountTag) {
        webhook(highestCountTag.tag_name);
    }

    res.json({data});
};