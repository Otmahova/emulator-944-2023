"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBService = void 0;
const models_1 = require("../models");
class DBService {
    constructor() {
        this.getParam = (where) => __awaiter(this, void 0, void 0, function* () {
            return models_1.ParamModel.findOne({
                where
            });
        });
        this.createParam = (data) => __awaiter(this, void 0, void 0, function* () {
            return models_1.ParamModel.create(data);
        });
        this.getParams = () => __awaiter(this, void 0, void 0, function* () {
            return models_1.ParamModel.findAll();
        });
        this.syncParam = ({ where, data }) => __awaiter(this, void 0, void 0, function* () {
            const expectedParam = yield this.getParam(where);
            if (expectedParam) {
                const updatedParam = yield expectedParam.update(Object.assign(Object.assign({}, expectedParam.toJSON()), data));
                const updatedParamData = updatedParam.toJSON();
                return this.getParam({ id: updatedParamData.id });
            }
            else {
                return this.createParam(Object.assign({}, data));
            }
        });
    }
}
exports.DBService = DBService;
