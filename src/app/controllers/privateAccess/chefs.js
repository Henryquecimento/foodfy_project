const Chef = require('../../models/Chef');

module.exports = {
    index(req, res) {

        Chef.all((chefs) => {
            return res.render('admin/chefs/index', { chefs });
        })

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
        });
    },
    show(req, res) {
        Chef.find(req.params.id, (chef) => {
            return res.render('admin/chefs/show', { chef });
        });
    },
    edit(req, res) {
        return res.render('admin/chefs/edit');
    },
    put(req, res) {
        return res.render('admin/chefs');
    },
    delete(req, res) {
        return res.render('admin/chefs/delete');
    }
}