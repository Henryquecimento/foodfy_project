const Chef = require('../../models/Chef');

module.exports = {
    index(req, res) {
        return res.render('admin/chefs/index');
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    post(req, res) {
        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') {
                return res.send("Please, fill all the fields!");
            }
        }

        Chef.create(req.body, (chef) => {
            return res.redirect('/admin/chefs');
        })
    },
}