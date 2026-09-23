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

const getAllPosts = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(
    Post.find().populate("author", "-password"),
    query
  );
  const postsQuery = queryBuilder.sort().paginate();

  const [data, meta] = await Promise.all([postsQuery.build(), queryBuilder.getMeta()]);

  return {
    data,
    meta,
  };
};

export const PostServices = {
  createPost,
  getAllPosts,
};
