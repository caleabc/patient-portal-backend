// Lib
const express = require("express")
const mongoSanitize = require("express-mongo-sanitize")
const cookieParser = require("cookie-parser")
const sanitizeRequest = require("./middleware/sanitizeRequest");
const limiter = require("./middleware/limiter")
const helmetSetting = require("./middleware/helmetSetting")
const corsSetting = require("./middleware/corsSetting")
const dbConfiguration = require("./databaseConfiguration");
const dotenv = require("dotenv")
dotenv.config(); // Load .env file

// Routes
const sendOtp = require("./routes/sendOtp");
const verifyOtp = require("./routes/verifyOtp")
const verifyPatientAccessCode = require("./routes/verifyPatientAccessCode")
const consultation = require("./routes/consultation")
const registerPhoneNumber = require("./routes/registerPhoneNumber")
const medicalRecord = require("./routes/medicalRecord")
const account = require("./routes/account")

// Create an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// To prevent our backend / server from abuse, added request limit
app.use(limiter);

// sanitize request to protect from nosql and xss attack
app.use(sanitizeRequest)

app.use(mongoSanitize());

// if happens that this server is sending some harmful code then instruct the browser to not run it, this way we are protecting ourselves from xss
app.use(helmetSetting)

// telling the browser that this sites (eg. www.a.com, www.h.com) are only allowed to read my response
app.use(corsSetting)

// required lib so that we can do res.cookie and req.cookies later
app.use(cookieParser());

// Run DB
dbConfiguration()

// Use routes
app.use(sendOtp)
app.use(verifyOtp)
app.use(verifyPatientAccessCode)
app.use(consultation)
app.use(registerPhoneNumber)
app.use(medicalRecord)
app.use(account)

const port = 5000;
app.listen(port, function (){
  console.log("Server is now running...");
})

