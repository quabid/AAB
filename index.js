require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("02468ouqtyminv", 13);
const { DB_URI, mongoUserCollection } = require("./config/index");
const chalk = require("chalk");
const { SERVER_STATUS, PORT } = require("./constants");
const { log } = require("./custom_modules/Logger");
const {
  messageUtils: { fyi, errorMessage, informationMessage },
} = require("./custom_modules/utils");

// Handlebars Helpers
const {
  truncate,
  stripTags,
  formatDate,
  select,
  cfc,
} = require("./custom_modules/HandlebarsHelpers");

// Passport Config
require("./config/passport")(passport);

// Routes
const index = require("./routes/index");
const auth = require('./routes/auth');
const user = require('./routes/user');

// Map Global Promise
mongoose.Promise = global.Promise;

// Connect To Mongoose Database
// { useUnifiedTopology: true }
mongoose
  .connect(`${DB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => log(informationMessage(`\t   Datastore Connected\n\n`)))
  .catch((err) => log(errorMessage(err)));

// Configure data store
const store = new MongoDBStore({
  uri: DB_URI,
  collection: mongoUserCollection,
});

store.on("connected", function () {
  store.client; // The underlying MongoClient object from the MongoDB driver
  // log(store);
});

// Catch errors
store.on("error", function (error) {
  assert.ifError(error);
  assert.ok(false);
});

const app = express();
app.use((req, res, next) => {
  res.type("json");

  res.set({
    "Content-Type": "application/json",
    "Content-Length": "123",
    "x-powered-by": "Deez Nuts!@$?%&#",
    "Cache-control": "no-cache,no-store,max-age=0,must-revalidate",
    "X-XSS-Protection": "1;mode=block",
    "X-Content-Type-Options": "nosniff",
    ETag: nanoid(),
  });

  res.setHeader("Cache-Control", "no-cache,no-store,max-age=0,must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "-1");
  res.setHeader("X-XSS-Protection", "1;mode=block");
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Content-Security-Policy", "script-src 'self'");
  res.setHeader("X-Content-Type-Options", "nosniff");
  next();
});

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable cors
// app.use(cors());

// Views Path
// app.set("views", path.join(__dirname, "views"));

// Static Resources
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { secure: false },
  })
);

// Add flash
// app.use(flash());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Set Routes
app.use("/", index);
app.use("/auth", auth);
app.use("/user", user);

app.listen(PORT, SERVER_STATUS);
