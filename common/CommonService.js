const mongoose = require("mongoose");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const { itemsPerPage } = require("../config/variables");
const esClient = require("../config/esClient");

class Service {
  constructor(model) {
    this.model = model;
  }
  async getAll(query) {
    let {
      currentPage = 1,
      resultsPerPage = itemsPerPage,
      sortField = "createdAt",
      sortOrder = "desc",
      filters,
      search,
      populate,
      dropdown = "false",
    } = query;
    if (dropdown === "false") {
      currentPage = parseInt(currentPage);
      const filter = { isDeleted: false };

      if (Array.isArray(filters)) {
        for (const filterObj of filters) {
          if (filterObj.field && filterObj.value) {
            filter[filterObj.field] = filterObj.value;
          }
        }
      }

      if (search && search.length > 0) {
        Object.assign(filter, { name: { $regex: search, $options: "i" } });
      }

      const countPromise = this.model.countDocuments(filter);
      let queryPromise = this.model.find(filter);

      if (populate && Array.isArray(populate)) {
        for (const populateItem of populate) {
          if (typeof populateItem === "object" && populateItem.field) {
            const populateField = populateItem.field;
            const selectFields = populateItem.select || { _id: 1, name: 1 };
            queryPromise = queryPromise.populate({
              path: populateField,
              select: selectFields,
            });
          }
        }
      }

      queryPromise = queryPromise
        .skip((currentPage - 1) * resultsPerPage)
        .sort({ [sortField]: sortOrder })
        .limit(parseInt(resultsPerPage))
        .lean();

      const [totalItems, items] = await Promise.all([
        countPromise,
        queryPromise,
      ]);

      const totalPages = Math.ceil(totalItems / resultsPerPage);
      items.forEach((item, index) => {
        item.indexNo = resultsPerPage * (currentPage - 1) + index + 1;
      });
      return {
        items,
        totalPages,
        currentPage,
        totalItems,
      };
    } else {
      const filter = { isDeleted: false, isActive: true };
      if (filters?.length > 0) {
        for (const filterObj of filters) {
          console.log(filterObj.value);
          if (filterObj.field && filterObj.value) {
            filter[filterObj.field] = filterObj.value;
          }
        }
      }

      let queryPromise = this.model.find(filter).select("name id");

      const items = await queryPromise;

      return {
        items,
      };
    }
  }

  async getById(id, populate = []) {
    let queryPromise = this.model.findById(id);

    if (populate && Array.isArray(populate)) {
      for (const populateItem of populate) {
        if (typeof populateItem === "object" && populateItem.field) {
          const populateField = populateItem.field;
          const selectFields = populateItem.select || { _id: 1, name: 1 };
          queryPromise = queryPromise.populate({
            path: populateField,
            select: selectFields,
          });
        }
      }
    }
    const item = await queryPromise.exec();
    return item;
  }

  async create(data) {
    const item = await this.model.create(data);
    return item;
  }

  async update(id, data) {
    const item = await this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return item;
  }
  async searchWithPagination({
    index,
    currentPage = 1,
    resultsPerPage = 10,
    search = "",
    fields = ["name", "description"],
  }) {
    currentPage = parseInt(currentPage);
    resultsPerPage = parseInt(resultsPerPage);

    const query = {
      bool: {
        must: [],
      },
    };

    if (search.length > 0) {
      query.bool.must.push({
        multi_match: {
          query: search,
          fields,
        },
      });
    }

    const from = (currentPage - 1) * resultsPerPage;

 
    const result = await esClient.search({
      index,
      body: {
        from,
        size: resultsPerPage,
        query,
      },
    });


    const totalItems = result?.hits?.total?.value;
    const items = result?.hits?.hits?.map((hit) => hit?._source);
    const totalPages = Math.ceil(totalItems / resultsPerPage);

    
    items.forEach((item, index) => {
      item.indexNo = resultsPerPage * (currentPage - 1) + index + 1;
    });

    return {
      items,
      totalPages,
      currentPage,
      totalItems,
    };
  }
  async delete(id, soft = true) {
    const item = await this.model.findById(id);
    if (item) {
      if (soft) {
        await item.softDelete();
      } else {
        await item.remove();
      }
    }
    return item;
  }
}

module.exports = Service;
