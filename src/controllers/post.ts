import {internalError} from '../utils/controllerUtils';
import * as PostBL from '../business/post';
import {AuthRequest, PostReactType} from "../constants/types";
import {Types} from "mongoose";

const PostController = {
   create: async (req: AuthRequest, res) => {
     try {
        const {categories, type, text, textVi, textEn, audio, photos, videos, tags, of} = req.body;
        const ofPost = of ? new Types.ObjectId(of) : null;
        const post = await PostBL.create({
           categories,
           type, text, textVi, textEn, audio, photos, videos, tags,
           createdBy: req.user._id, of: ofPost
        })
        res.send({data: post})
     } catch (e) {
        internalError(e, res)
     }
   },
   getPosts: async (req, res) => {
      try {
         const {uid, cid, p} = req.query;
         if (!uid)
            throw new Error("Uid is missing");
         const posts = await PostBL.getPosts(new Types.ObjectId(uid), cid === '0' ? null : new Types.ObjectId(cid), +p || 1);
         res.send({data: posts})
      } catch (e) {
         internalError(e, res)
      }
   },
   getPost: async (req, res) => {
      try {
         const postId = req.params.id
         if (!postId)
            throw new Error("PostId is missing");
         const post = await PostBL.getPost(new Types.ObjectId(postId));
         res.send({data: post});
      } catch (e) {
         internalError(e, res);
      }
   },
   getComments: async (req, res) => {
      try {
         const postId = req.params.id;
         if (!postId)
            throw new Error("PostId is missing");
         const page = +req.query.page || 1;
         const post = await PostBL.getComments(new Types.ObjectId(postId), page);
         res.send({data: post});
      } catch (e) {
         internalError(e, res);
      }
   },
   update: async (req: AuthRequest, res) => {
      try {
         const postId = req.params.id
         if (!postId)
            throw new Error("PostId is missing");
         const post = await PostBL.update(new Types.ObjectId(postId), req.user._id, req.body);
         res.send({data: post});
      } catch (e) {
         internalError(e, res);
      }
   },
   react: async (req: AuthRequest, res) => {
      try {
         const postId = req.params.id
         if (!postId)
            throw new Error("PostId is missing");
         const {reactType} = req.query
         const rs = await PostBL.react(reactType as PostReactType, new Types.ObjectId(postId), req.user._id);
         res.send({data: rs})
      } catch (e) {
         internalError(e, res)
      }
   },
   unReact: async (req: AuthRequest, res) => {
      try {
         const postId = req.params.id
         if (!postId)
            throw new Error("PostId is missing");
         await PostBL.unReact(new Types.ObjectId(postId), req.user._id);
         res.send({data: true})
      } catch (e) {
         internalError(e, res)
      }
   },
   remove: async (req: AuthRequest, res) => {
      try {
         const postId = req.params.id
         if (!postId)
            throw new Error("PostId is missing");
         await PostBL.remove(new Types.ObjectId(postId), req.user._id);
         res.send({data: true})
      } catch (e) {
         internalError(e, res)
      }
   }
}

export default PostController;
