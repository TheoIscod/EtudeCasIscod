const articlesService = require("./articles.service")
const NotFoundError = require("../../errors/not-found")

class ArticlesController {
  async create(req, res, next) {
    try {

    const dataUser = {
        ...req.body, 
        user: req.user.id,
    };
      const article = await articlesService.create(dataUser)
      req.io.emit("article:create", article)
      res.status(201).json(article)
    } catch (err) {
    console.log("Erreur de création", err)
      next(err)
    }
  }

  async update(req, res, next) {
    try {
    if (req.user.role !== "admin") {
        throw new UnauthorizedError("non admin")
    }
      const id = req.params.id
      const data = req.body
      const updatedArticle = await articlesService.update(id, data)
      if (!updatedArticle) {
        throw new NotFoundError()
      }
      req.io.emit("article:update", updatedArticle)
      res.json(updatedArticle);
    } catch (err) {
        console.log("Erreur de modification", err)
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
    if (req.user.role !== "admin") {
        throw new UnauthorizedError("non admin")
    }
      const id = req.params.id
      await articlesService.delete(id)
      req.io.emit("article:delete", { id })
      res.status(204).send()
    } catch (err) {
        console.log("Erreur de suppression", err)
      next(err)
    }
  }
}

module.exports = new ArticlesController()
