const foods = require('../data'); 

exports.index = (req, res) => {
    return res.render('admin/recipes', { foods });
}