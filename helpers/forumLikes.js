var ForumLikes = require('../models/ForumLikes')
const sequelize = require('sequelize');


// const getLikeCount = function get_like_count(forumId, callback) {
//     ForumLikes.findAll({
//         where: { liked: 1 , forumId : forumId},
//         group: ['forumId', 'liked'],
//         attributes: [
//             ['forumId', 'liked'],
//             [sequelize.fn('COUNT', sequelize.col('forumId')), 'n_likes']
//         ]
//     }).then((n_likes) => {
//         return callback(null, n_likes)
//     })
// };

const getLikeCount = function get_like_count(forumId) {
    return ForumLikes.count({where: { liked: 1, forumId: forumId }});
}


module.exports = getLikeCount;