import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ExecuteQueryAsync, ExecuteSPAsync, ExecutePostAndGet } from './database.js';
import { GetUserByUsername } from './models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authMiddleware from './middlewares/auth.js';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
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
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await GetUserByUsername(username);
    const hashedPassword = password;

    console.log(user);
    if (!user || !await bcrypt.compare(hashedPassword, user.Password)) {
        return res.status(400).send('Invalid credentials');
    }
    
    const token = jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '1h' });
    const userData = {role: user["Role"], firstName: user["FirstName"], lastName: user["LastName"]}
    res.send({ token, userData });
});

app.post('/logout', authMiddleware, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        req.tokenBlacklist.add(token);
    }
    res.send('Logged out');
});

app.get('/api/GetAllForms', authMiddleware, async (req, res) => {
    let data = await ExecuteSPAsync("CALL GetAllFormsType();");
    console.log('GetAllForms: ' + data);
    res.status(200).send(data);
});

app.post('/api/AddFormEntry', authMiddleware, async (req,res) => {
    if(req.user.Role != 1){
        res.status(401).send(false);
        return;
    }
    // const {formId, formData, formImageUrl} = req.body;
    const  { name, age, regno, contact, email, nationality, occupation, emergencyPhone, refferdBy, doctor } = req.body;

    try{
        let consentFormEntryQuery = ` CALL AddConsentFormEntry(1, '${JSON.stringify(req.body)}', '', @newId);`;
        let newIdQuery = 'SELECT @newId as newId';

        // Add consent form entry
        let ress = await ExecutePostAndGet(consentFormEntryQuery,newIdQuery);
        const newId = ress[0]?.newId;

        newId ?? res.status(500).send('unable to add Consent form enty API:LINE 73');

        // add data to patient
        let patientQuery = `CALL AddPatient('${name}', '${age}', '${regno}', '${contact}', '${email}', '${nationality}', '${occupation}', '${emergencyPhone}', '${refferdBy}', '${doctor}', '${newId}', '${req.user['BranchId']}');`;
        await ExecuteSPAsync(patientQuery);
        
        res.status(200).send(true);
    }
    catch(err){
        console.log(err)
        res.status(500).send(err);
    }
});

app.post('/api/AddDoctor', authMiddleware, async (req,res) => {
    if(req.user.Role != 1){
        res.status(401).send(false);
        return;
    }
    const {name, contact, email, availableDays, availableHours, exceptionalDates} = req.body;
    
    try{
        let doctorQuery = `CALL AddDoctor('${name}', '${contact}', '${email}', '${availableDays}', '${availableHours}', '${exceptionalDates}', '${req.user.BranchId}', '${req.user.Id}');`;
        await ExecuteSPAsync(doctorQuery);
        
        res.status(200).send(true);
    }
    catch(err){
        res.status(500).send(err);
    }
});

app.get('/api/GetPatients', authMiddleware, async (req,res) => {
    let data = await ExecuteSPAsync('CALL GetPatients');
    res.status(200).send(data);
});
app.get('/api/GetAllDoctor', authMiddleware, async (req,res) => {
    let data = await ExecuteSPAsync('CALL GetAllDoctor');
    res.status(200).send(data);
});
app.get('/api/GetAppointmentsByDate', authMiddleware, async (req,res) => {
    let {startDate, endDate} = req.query;
    let data = await ExecuteSPAsync(`CALL GetAppointmentsByDate ('${startDate}', '${endDate}')`);
    res.status(200).send(data);
});
app.post('/api/AddAppointment', authMiddleware, async (req,res) => {
    let {doctorId, patientId, appointmentDate, startTime, endTime} = req.body;
    try{
        const appointmentQuery = `CALL AddAppoinment ('${doctorId}','${patientId}','${appointmentDate}','${startTime}', '${endTime}',@msg)`;
        const appointmentRes = 'SELECT @msg as Msg';
        const ress = await ExecutePostAndGet(appointmentQuery,appointmentRes);
        res.status(200).send(ress[0]?.Msg);
    }
    catch(err){
        console.log(err)
        res.status(500).send(err);
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});