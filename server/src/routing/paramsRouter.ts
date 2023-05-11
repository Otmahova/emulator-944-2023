import { Router } from "express"

import { ParamsController } from "../controllers"

export const paramsRouter = Router()
const paramsController = new ParamsController()

paramsRouter.post('/sync', paramsController.syncAll)
paramsRouter.get('/', paramsController.getAll)
paramsRouter.get('/:id', paramsController.getOne)
paramsRouter.put('/', paramsController.updateAll)
