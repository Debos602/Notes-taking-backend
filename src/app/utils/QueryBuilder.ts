import { FilterQuery, Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    if (!searchTerm) return this;

    const searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };

    this.modelQuery = this.modelQuery.find(searchQuery as FilterQuery<T>);
    return this;
  }

  filter(): this {
    const filter = Object.fromEntries(
      Object.entries(this.query).filter(([key]) => !excludeField.includes(key))
    );
    this.modelQuery = this.modelQuery.find(filter as FilterQuery<T>);
    return this;
  }

  sort(): this {
    const sortBy = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sortBy);
    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const totalDocuments = await this.modelQuery.model.countDocuments();
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const totalPage = Math.ceil(totalDocuments / limit);
    return { page, limit, total: totalDocuments, totalPage };
  }
}
