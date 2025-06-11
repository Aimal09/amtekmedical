import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import {
  ExecuteQueryAsync,
  ExecuteSPAsync,
  ExecutePostAndGet,
} from "./database.js";
import { GetUserByUsername } from "./models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middlewares/auth.js";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
const tokenBlacklist = new Set();
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.tokenBlacklist = tokenBlacklist;
  next();
});
dotenv.config();
const env = process.env;
const port = env.PORT || 3000;

//APIs
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await GetUserByUsername(username);
  const hashedPassword = password;

  console.log(user);
  if (!user || !(await bcrypt.compare(hashedPassword, user.Password))) {
    return res.status(400).send("Invalid credentials");
  }

  const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const userData = {
    id: user["Id"],
    role: user["Role"],
    firstName: user["FirstName"],
    lastName: user["LastName"],
  };
  res.send({ token, userData });
});

app.post("/logout", authMiddleware, async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token) {
    req.tokenBlacklist.add(token);
  }
  res.send("Logged out");
});

app.get("/api/GetAllForms", authMiddleware, async (req, res) => {
  let data = await ExecuteSPAsync("CALL GetAllFormsType();");
  console.log("GetAllForms: " + data);
  res.status(200).send(data);
});

app.post("/api/AddFormEntry", authMiddleware, async (req, res) => {
  if (req.user.Role != 1) {
    res.status(401).send(false);
    return;
  }

  const {
    name,
    age,
    regno,
    contact,
    email,
    nationality,
    occupation,
    emergencyPhone,
    refferdBy,
    doctor,
    healthProblem,
    bloodPresure,
    allergyProblems,
    thyroidProblems,
    asthama,
    anyOther,
    medication,
    pregnant,
    painScale,
    initialStatement,
    passportNo,
    emiratesNo,
    signImg,
    residenceAddress,
    bleedingDisorder,
    diabetic, // ✅ Added signImg here
  } = req.body;

  console.log("Received PainScale:", req.body.painScale);

  try {
    let consentFormEntryQuery = `CALL AddConsentFormEntry(100, '${JSON.stringify(
      req.body
    )}', '', @newId);`;
    let newIdQuery = "SELECT @newId as newId";

    // Add consent form entry
    let ress = await ExecutePostAndGet(consentFormEntryQuery, newIdQuery);
    const newId = ress[0]?.newId;

    if (!newId) {
      res.status(500).send("Unable to add Consent form entry API:LINE 73");
      return;
    }

    // ✅ Add passportNo, emiratesNo, and signImg into query
    let patientQuery = `CALL AddPatient(
            '${name}', '${age}', '${regno}', '${contact}', '${email}', '${nationality}', '${occupation}', '${emergencyPhone}',
            '${refferdBy}', '${doctor}', '${newId}', '${req.user["BranchId"]}',
            '${healthProblem ? 1 : 0}', '${bloodPresure ? 1 : 0}', '${
      allergyProblems ? 1 : 0
    }', '${thyroidProblems ? 1 : 0}',
            '${asthama ? 1 : 0}', '${anyOther}', '${medication}', '${
      pregnant ? 1 : 0
    }', '${painScale}', '${initialStatement}',
            '${passportNo}', '${emiratesNo}', '${signImg}','${residenceAddress}',
            '${bleedingDisorder ? 1 : 0}', '${diabetic ? 1 : 0}'
        );`;

    console.log("Executing Query:", patientQuery);
    await ExecuteSPAsync(patientQuery);

    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post("/api/AddDoctor", authMiddleware, async (req, res) => {
  if (req.user.Role != 1) {
    res.status(401).send(false);
    return;
  }
  const {
    name,
    contact,
    email,
    availableDays,
    availableHours,
    exceptionalDates,
    departmentOfDoctor,
  } = req.body;
  console.log(
    "han bhai department of Docctor kaisa araha hai",
    departmentOfDoctor
  );

  try {
    let doctorQuery = `CALL AddDoctor('${name}', '${contact}', '${email}', '${availableDays}', '${availableHours}', '${exceptionalDates}', '${req.user.BranchId}', '${departmentOfDoctor}', '${req.user.Id}');`;

    await ExecuteSPAsync(doctorQuery);

    res.status(200).send(true);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get("/api/GetPatients", authMiddleware, async (req, res) => {
  let data = await ExecuteSPAsync("CALL GetPatients");
  res.status(200).send(data);
});
app.get("/api/GetAllDoctor", authMiddleware, async (req, res) => {
  let data = await ExecuteSPAsync("CALL GetAllDoctor");
  res.status(200).send(data);
});
app.get("/api/GetAppointmentById", authMiddleware, async (req, res) => {
  console.log("Query Params: ", req.query); // Debugging ke liye

  let { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID is required" });
  }

  try {
    let data = await ExecuteSPAsync(`CALL GetAppointmentById(${id})`);
    res.status(200).send(data);
  } catch (error) {
    console.error("Database Error: ", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

app.get(
  "/api/GetAppointmentByAppointmentId",
  authMiddleware,
  async (req, res) => {
    console.log("Query Params: ", req.query);

    let { appoinmentId } = req.query; // Make sure frontend sends correct key

    if (!appoinmentId) {
      return res.status(400).json({ error: "ID is required" });
    }

    try {
      let data = await ExecuteSPAsync(
        `CALL GetAppointmentByAppointmentId(${appoinmentId})`
      );
      res.status(200).send(data);
    } catch (error) {
      console.error("Database Error: ", error);
      res.status(500).json({ error: "Database error", details: error.message });
    }
  }
);

app.get("/api/GetAppointmentsByDate", authMiddleware, async (req, res) => {
  let { startDate, endDate } = req.query;
  let data = await ExecuteSPAsync(
    `CALL GetAppointmentsByDate ('${startDate}', '${endDate}')`
  );
  res.status(200).send(data);
});
app.post("/api/AddAppointment", authMiddleware, async (req, res) => {
  let { doctorId, patientId, appointmentDate, startTime, endTime } = req.body;
  try {
    // Stored procedure call with @msg as an OUT parameter
    const appointmentQuery = `CALL AddAppoinment('${doctorId}','${patientId}','${appointmentDate}','${startTime}', '${endTime}', @msg)`;
    const appointmentRes = `SELECT @msg AS Msg`; // Correcting the SELECT statement

    // Execute the stored procedure
    const ress = await ExecutePostAndGet(appointmentQuery, appointmentRes);

    res.status(200).send(ress[0]?.Msg); // Sending the message back
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post("/api/InsertConsentFormSigned", authMiddleware, async (req, res) => {
  console.log("Received Payload:", req.body); // Debugging line

  const { formId, signatureUrl, patientId, appointmentId } = req.body;

  try {
    const query = `CALL InsertConsentFormSigned('${formId}', '${signatureUrl}', '${patientId}', '${appointmentId}')`;

    console.log("Executing query:", query); // Debugging line

    const dbResponse = await ExecuteSPAsync(query);

    res.status(200).send({ success: true, data: dbResponse });
  } catch (err) {
    console.log("Error in InsertConsentFormSigned:", err);
    res.status(500).send(err);
  }
});

app.post("/api/AddCasesheet", authMiddleware, async (req, res) => {
  console.log("Received Payload:", req.body); // Debugging line

  const { createdOn, amount, appointmentId, prescription, doctorDiagnosis } =
    req.body;

  try {
    const query = `CALL AddCasesheet('${createdOn}', '${amount}', '${appointmentId}', '${prescription}', '${doctorDiagnosis}')`;

    console.log("Executing query:", query); // Debugging line

    const dbResponse = await ExecuteSPAsync(query);

    res.status(200).send({ success: true, data: dbResponse });
  } catch (err) {
    console.log("Error in AddCasesheet:", err);
    res.status(500).send(err);
  }
});

app.get("/api/GetDiagnosis", async (req, res) => {
  try {
    const query = "SELECT * FROM Diagnosis WHERE isactive = 1;";
    const data = await ExecuteQueryAsync(query);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching diagnosis:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/doctor-departments", async (req, res) => {
  try {
    let query = "SELECT * FROM DoctorDepartment";
    let result = await ExecuteQueryAsync(query);

    console.log("DB Result:", JSON.stringify(result, null, 2)); // ✅ Full Result Print

    res.status(200).json(result);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).send(err);
  }
});

app.post("/api/EditFormEntry", authMiddleware, async (req, res) => {
  if (req.user.Role != 1) {
    res.status(401).send(false);
    return;
  }

  const {
    patientID,
    name,
    age,
    regno,
    contact,
    email,
    nationality,
    occupation,
    emergencyPhone,
    refferdBy,
    doctor,
    healthProblem,
    bloodPresure,
    allergyProblems,
    thyroidProblems,
    asthama,
    anyOther,
    medication,
    pregnant,
    painScale,
    initialStatement,
    passportNo,
    emiratesNo,
  } = req.body;

  try {
    let updatePatientQuery = `CALL UpdatePatient(
            '${patientID}', '${name}', '${age}', '${regno}', '${contact}', '${email}', '${nationality}', '${occupation}', '${emergencyPhone}',
            '${refferdBy}', '${doctor}',
            '${healthProblem ? 1 : 0}', '${bloodPresure ? 1 : 0}', '${
      allergyProblems ? 1 : 0
    }', '${thyroidProblems ? 1 : 0}',
            '${asthama ? 1 : 0}', '${anyOther}', '${medication}', '${
      pregnant ? 1 : 0
    }', '${painScale}', '${initialStatement}',
            '${passportNo}', '${emiratesNo}'
        );`;

    console.log("Executing Edit Query:", updatePatientQuery);
    await ExecuteSPAsync(updatePatientQuery);

    res.status(200).send(true);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/api/consultantforms", async (req, res) => {
  try {
    let query = `SELECT * FROM ConsentForms WHERE asForm = 0`;
    let result = await ExecuteQueryAsync(query);

    console.log("DB Result:", JSON.stringify(result, null, 2)); // ✅ Full Result Print

    res.status(200).json(result);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).send(err);
  }
});

app.get("/api/ConsentFormsSigned", async (req, res) => {
  try {
    let query = `SELECT * FROM ConsentFormsSigned `;
    let result = await ExecuteQueryAsync(query);

    console.log("DB Result:", JSON.stringify(result, null, 2)); // ✅ Full Result Print
    console.log(result);

    res.status(200).json(result);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).send(err);
  }
});

app.put("/api/doctor/deletedoctor/:id", async (req, res) => {
  let doctorId = req.params.id;
  try {
    let query = `UPDATE Doctor SET isactive = 0 WHERE ID = ${doctorId} `;
    let result = await ExecuteQueryAsync(query);
    console.log("deletedoctorapi error", result);
    res.status(200).json(result);
  } catch (err) {
    console.log("delete doctor api error", err);
  }
});

app.get("/api/GetDoctorClients", authMiddleware, async (req, res) => {
  console.log("Query Params: ", req.query);

  const { doctorId } = req.query; // Make sure frontend sends ?doctorId=XYZ

  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required" });
  }

  try {
    const data = await ExecuteSPAsync(`CALL DoctorClientById(${doctorId})`);
    res.status(200).send(data); // first index because MySQL wraps results in array
  } catch (error) {
    console.error("Database Error: ", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

app.get("/api/GetDoctorClientsById", authMiddleware, async (req, res) => {
  console.log("Query Params: ", req.query);

  const { doctorId } = req.query; // Make sure frontend sends ?doctorId=XYZ

  if (!doctorId) {
    return res.status(400).json({ error: "Doctor ID is required" });
  }

  try {
    const data = await ExecuteSPAsync(`CALL DoctorClient(${doctorId})`);
    res.status(200).send(data); // first index because MySQL wraps results in array
  } catch (error) {
    console.error("Database Error: ", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

app.post("/api/UpdateAmount", authMiddleware, async (req, res) => {
  const { CaseSheetId, amount } = req.body;
  console.log("Update Amount Request:", { CaseSheetId, amount });

  if (!CaseSheetId || amount == null) {
    console.error("Invalid input:", { caseSheetId, amount });
    return res.status(400).json({ success: false, message: "Invalid input" });
  }

  try {
    await ExecuteSPAsync(`CALL UpdatePatientAmount(${CaseSheetId}, ${amount})`);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Update Amount Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// console.log("DB Result:", user);  // Check what data is coming from DB
// console.log("Hashed Password:", user.Password); // Check password field
// console.log("Entered Password:", req.body.password); // Check entered password

// console.log("Entered Password:", password);
// console.log("Hashed Password from DB:", user.Password);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
