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

        Chef.create(req.body, () => {
            return res.redirect('/admin/chefs');
        });
    },
    show(req, res) {
        Chef.find(req.params.id, (chef) => {
            Chef.findRecipe(req.params.id, (recipes) => {

                return res.render('admin/chefs/show', { chef, recipes });
            })
        });
    },
    edit(req, res) {
        Chef.find(req.params.id, (chef) => {
            return res.render('admin/chefs/edit', { chef });
        });
    },
    put(req, res) {
        Chef.update(req.body, () => {

            return res.redirect('/admin/chefs');
        });
    },
    delete(req, res) {
        Chef.delete(req.body.id, () => {
            return res.redirect('/admin/chefs');
        })

    }
}