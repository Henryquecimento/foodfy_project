const { create } = require("./recipes");

module.exports = {
    index(req, res) {
        return res.render('admin/chefs/index');
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    }

}