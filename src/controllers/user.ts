import _ from 'lodash';
import {Request, Response} from 'express';
import {
  getUserPublicInfoById,
  updateUser
} from '../business/user';
import {internalError} from "../utils/controllerUtils";
import User, {IUser} from "../models/user";
import PostModel from '../models/post';
import {Types} from "mongoose";

const UserController = {
  getAll: async (req: Request, res: Response): Promise<any> => {
    try {
      const ITEM_PER_PAGES = 20
      const skip = ((+req.query.page - 1) || 0) * ITEM_PER_PAGES
      const rs = await User.find().skip(skip).limit(ITEM_PER_PAGES)
      res.send({data: rs})
    } catch (e) {
      internalError(e, res);
    }
  },
  count: async (req: Request, res: Response): Promise<any> => {
    try {
      const rs = await User.count()
      res.send({data: rs})
    } catch (e) {
      internalError(e, res);
    }
  },
  user: async (req: Request, res: Response): Promise<any> => {
    try {
      let user;
      if (req.params.id === 'me') {
        const authUser = req.user as IUser;
        user = await getUserPublicInfoById(authUser._id);
      } else if (req.params.id) {
        user = await getUserPublicInfoById(new Types.ObjectId(req.params.id));
      } else {
        throw "Missing :id";
      }

      return res.send({data: user});
    } catch (e) {
      internalError(e, res);
    }
  },
  updateProfile: async (req: Request, res: Response): Promise<any> => {
    try {
      const {avatar, fullName} = req.body;
      const authUser = req.user as IUser;
      const response = await updateUser(authUser._id, {avatar, fullName});
      const requireRevalidateComputedUser = !_.isEmpty(avatar) || !_.isEmpty(fullName)
      if (requireRevalidateComputedUser)
        PostModel.updateMany({createdBy: authUser._id}, {byUser: _.pick(response, ['_id', 'fullName', 'username', 'avatar'])}).then(console.log).catch(console.error);
      res.send({data: response});
    } catch (e) {
      internalError(e, res);
    }
  }
};

export default UserController;
