const { pickBy } = require('lodash');

/**
 * returns null if tags is an array of string with no more than four elements
 * @param {string[]} tags 
 * @returns 
 */
const validateTags = tags => {
    if (!Array.isArray(tags)) {
        return 'tags must be an array';
    }

    if(tags.length > 4) {
        return 'tags must be less than 5 elements';
    }

    return null;
}


module.exports = (req, res, next) => {
    const { user_id, title, tags } = req.body || {};

    // deletes all the null keys
    const errors = pickBy({
        user_id: user_id ? null : 'user_id is required',
        title: title ? null: 'title is required',
        tags: validateTags(tags)
    });

    if(Object.keys(errors).length) {
        return res.status(422).json({
            status: 'error',
            error: errors
        });
    }

    next();
};