const fs = require("fs");
const modelToSwagger = require("mongoose-to-swagger");
const swaggerAutogen = require("swagger-autogen")();
const User = require("./models/user.js");
const Fish = require("./models/fish");
const Post = require("./models/post");
const Type = require("./models/type");
const Voucher = require("./models/voucher");
const Order = require("./models/order");

const outputFile = "./swagger-output.json";
const routes = ["./routes/routes.js"];

const userDefinition = modelToSwagger(User);
const fishDefinition = modelToSwagger(Fish);
const postDefinition = modelToSwagger(Post);
const typeDefinition = modelToSwagger(Type);
const voucherDefinition = modelToSwagger(Voucher);
const orderDefinition = modelToSwagger(Order);

const doc = {
  info: {
    title: "Koi-Farm API",
    description: "API Documentation for Koi-Farm",
  },
  host: "localhost:8000",
  basePath: "/api",
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      name: "authorization",
      in: "header",
      description: "Please enter a valid token in the format: Bearer <token>",
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  definitions: {
    User: userDefinition,
  },
};

if (fs.existsSync(outputFile)) {
  console.log("File exists. Updating existing Swagger file...");
  const existingSwaggerData = JSON.parse(fs.readFileSync(outputFile, "utf-8"));

  existingSwaggerData.definitions.User = userDefinition;
  existingSwaggerData.definitions.Fish = fishDefinition;
  existingSwaggerData.definitions.Type = typeDefinition;
  existingSwaggerData.definitions.Post = postDefinition;
  existingSwaggerData.definitions.Voucher = voucherDefinition;
  existingSwaggerData.definitions.Order = orderDefinition;

  fs.writeFileSync(outputFile, JSON.stringify(existingSwaggerData, null, 2));
  console.log("Swagger file updated successfully");
  require("./index.js");
} else {
  console.log("File does not exist. Creating new Swagger file...");
  swaggerAutogen(outputFile, routes, doc).then(() => {
    console.log("Swagger file generated successfully");
    require("./index.js");
  });
}
