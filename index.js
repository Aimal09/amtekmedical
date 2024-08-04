import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ExecuteQueryAsync, ExecuteSPAsync } from './database.js';
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
    const {formId, formData, formImageUrl} = req.body;

    try{
        let consentFormEntryQuery = `SET @formId=1; SET @formData='${formData}'; SET @formImageUrl='${formImageUrl}'; SET @newId = 0; CALL AddConsentFormEntry(@formId, @formData, @formImageUrl, @newId); SELECT @newId AS newId;`;
        let ress = await ExecuteQueryAsync(consentFormEntryQuery);
        
        res.status(200).send(ress[ress.length - 1][0]);
    }
    catch(err){
        res.status(500).send(err);
    }
});

app.post('/api/AddPatient', authMiddleware, async (req,res) => {
    if(req.user.Role != 1){
        res.status(401).send('User is Unauthorize for this API');
        return;
    }
    const  { name, age, regno, contact, email, nationality, occupation, emergencyPhone, refferdBy, doctor, newId } = req.body;

    try{
        let patientQuery = `SET @p0='${name}'; SET @p1='${age}'; SET @p2='${regno}'; SET @p3='${contact}'; SET @p4='${email}'; 
        SET @p5='${nationality}'; SET @p6='${occupation}'; SET @p7='${emergencyPhone}'; SET @p8='${refferdBy}'; 
        SET @p9='${doctor}'; SET @p10='${newId}'; SET @p11='${req.user['BranchId']}'; 
        CALL AddPatient(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7, @p8, @p9, @p10);`;
        await ExecuteSPAsync(patientQuery);
        
        res.status(200).send(true);
    }
    catch(err){
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
        let DoctorQuery = `SET @p0='${name}'; SET @p1='${contact}'; SET @p2='${email}'; 
        SET @p3='${availableDays}'; SET @p4='${availableHours}'; SET @p5='${exceptionalDates}'; SET @p7='${req.user.Id}'; 
        SET @p6='${req.user.BranchId}';
        CALL AddDoctor(@p0, @p1, @p2, @p3, @p4, @p5, @p6, @p7);`;
        await ExecuteSPAsync(DoctorQuery);
        
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



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});