
module.exports = app => {
    const ratings = require('../controllers/rating.controller')
    var router = require('express').Router()

    router.post('/:intercontratId/:userId',ratings.addRating)

    router.get('/', ratings.getAllRatings)

    router.get('/:intercontratId',ratings.getRating)

    router.get('/average/:intercontratId', ratings.averageRating)

    app.use('/api/test/ratings', router);
}