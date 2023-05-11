import { IParam } from "../types";
import { ParamModel } from "../models";

export class DBService {
    public getParam = async (where: Partial<IParam>) => {
        return ParamModel.findOne({
            where
        })
    }
    public createParam = async (data: Omit<IParam, 'id'>) => {
        return ParamModel.create(data)
    }

    public getParams = async () => {
        return ParamModel.findAll()
    }
    public syncParam = async ({ where, data }: { where: Partial<IParam>, data: Partial<Omit<IParam, 'id'>> }) => {
        const expectedParam = await this.getParam(where)
        if (expectedParam) {
            const updatedParam = await expectedParam.update({
                ...expectedParam.toJSON(),
                ...data
            })
            const updatedParamData = updatedParam.toJSON()
            return this.getParam({ id: updatedParamData.id })
        } else {
            return this.createParam({
                ...data as Omit<IParam, 'id'>
            })
        }
    }
}