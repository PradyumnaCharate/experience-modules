const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({ node: process.env.ELASTIC_SEARCH_URL });

module.exports = esClient;
