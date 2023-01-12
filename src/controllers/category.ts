import {internalError} from "../utils/controllerUtils";
import * as CategoryBL from "../business/category";
import {AuthRequest} from "../constants/types";
import {Types} from "mongoose";

const CategoryController = {
   create: async (req: AuthRequest, res) => {
      try {
         const {name, tags} = req.body
         const resp = await CategoryBL.create(req.user._id, {name, tags})
         res.json(resp)
      } catch (e) {
         internalError(e, res)
      }
   },
   update: async (req: AuthRequest, res) => {
      try {
         const resp = await CategoryBL.update(req.user._id, new Types.ObjectId(req.params.id), req.body)
         res.json(resp)
      } catch (e) {
         internalError(e, res)
      }
   },
   remove: async (req: AuthRequest, res) => {
      try {
         const resp = await CategoryBL.remove(req.user._id, new Types.ObjectId(req.params.id) )
         res.json(resp)
      } catch (e) {
         internalError(e, res)
      }
   },
   getCategories: async (req: AuthRequest , res) => {
      try {
         const resp = await CategoryBL.getCategories(new Types.ObjectId(req.params.id))
         res.json(resp)
      } catch (e) {
         internalError(e, res)
      }
   },
}

export default CategoryController;
