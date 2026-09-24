import { QueryBuilder } from "../../utils/QueryBuilder";
import { IPost } from "./post.interface";
import { Post } from "./post.model";

const createPost = async (payload: Partial<IPost>, userId: string) => {
  const post = await Post.create({
    ...payload,
    author: userId,
  });
  return post;
};



export const PostServices = {
  createPost,
};
