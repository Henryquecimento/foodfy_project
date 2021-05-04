const Chef = require('../../models/Chef');

module.exports = {
    async index(req, res) {
        const results = await Chef.all();
        const chefs = results.rows;
       
        try {
            return res.render('admin/chefs/index', { chefs });
        } catch (err) {
            throw new Error({
                message: `Database Error ${err}`
            });
        }
        
    },
    create(req, res) {
        return res.render('admin/chefs/create');
    },
    async post(req, res) {

        const keys = Object.keys(req.body);

        for (let key of keys) {
            if (req.body[key] == '') {
                return res.send("Please, fill all the fields!");
            }
        }

        const results = await Chef.create(req.body);
        const chefId = results.rows[0].id;

        return res.redirect(`/admin/${chefId}`);

    },
    async show(req, res) {
        let results = await Chef.find(req.params.id);
        const chef = results.rows[0];
        
        results = await Chef.findRecipe(req.params.id);
        const recipes = results.rows;

        return res.render('admin/chefs/show', { chef, recipes });
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
        Chef.find(req.body.id, (chef) => {
            if (chef.total_recipes != 0) {
                return res.send('Chef possui receitas! Você não pode apagá-lo(a)!');
            } else {
                Chef.delete(req.body.id, () => {

                    return res.redirect('/admin/chefs');
                });
            }



        });

    }
}