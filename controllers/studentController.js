const Student = require('../models/student');
const passport = require("passport");
const bcrypt = require('bcrypt');
const pdfkit = require('pdfkit');
const Noc = require("../models/noc");
const fs = require('fs')
const path = require("path");
const multer = require('multer');
const { request } = require('http');

module.exports.login = async (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
          console.error(err); // Log the error for debugging
          return res.status(500).json({ error: 'Internal server error' });
      }
      if (!user) {
          console.error('Invalid credentials:', info); // Log the info for debugging
          return res.status(401).json({ message: 'Invalid credentials', error: info });
      }
      req.logIn(user, (err) => {
          if (err) {
              console.error(err); // Log the error for debugging
              return res.status(500).json({ error: 'Internal server error' });
          }
          const sessionData = {
            user: {
              email: req.user.email,
              name: req.user.name,
              role: req.user.role,
              roll: req.user.roll,
              id: req.user._id
            },
            sessionID: req.sessionID
          }
          return res.status(200).json({ message: 'Login successful', session: sessionData });
      });
  })(req, res, next);
}


module.exports.signup = async (req, res) => { 
    try {
        const student = await Student.findOne({ email: req.body.email });
        if(student){
            return res.status(409).json({message: "Student already exists"});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // console.log(req.body);
        const newUser = await Student.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            roll: req.body.roll,
            role: req.body.role
        });

        // console.log(newUser);

        return res.status(200).json({ user: newUser });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error in finding/creating the student!: "});
    }
}


module.exports.logout = async (req, res, next) => {
    console.log(res);
    await req.logout(function(err) {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        req.session = null;
        res.clearCookie('connect.sid');
        return res.status(200).json({"message": "Logout done!"});
    });
};

module.exports.addLeetcodeUrl = async (req, res) => {
    try {
        const studentId = req.body.id;
        const url = req.body.leetcodeurl;
        console.log(url);
        const student = await Student.findByIdAndUpdate(studentId, {"leetcodeurl": url});
        if(!student){
            return res.status(401).json({error: "Student not found!"});
        }
        return res.status(200).json(student);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"error": error});
    }
}

module.exports.getLeetCodeUrl = async (req, res) => {
    try {
        // console.log(req.query.id);
        const student = await Student.findById(req.params.studentId);
        console.log(student);
        if(!student){
            return res.status(401).json({error: "Student not found!"});
        }
        const url = student.leetcodeurl;
        return res.status(200).json(url);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"error": error});
    }
}


module.exports.getUser = async (req, res) => {
    try {
        // console.log(req.query.id);
        const student = await Student.findById(req.query.id);
        if(!student){
            return res.status(401).json({error: "Student not found!"});
        }
        return res.status(200).json(student);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"error": error});
    }
}

module.exports.getAllStudents = async (req, res) => {
    try {
        let students = {};
        students = await Student.find();
        if(!students){
            return res.status(401).json({error: "No Student Found"});
        }
        // console.log(students)
        return res.status(200).json(students);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "Unable to fetch Students"})
    }
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Folder where files will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

module.exports.upload = multer({ storage: storage });

module.exports.uploadNoc = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const studentId = req.body.userId;
        const nocFileUrl = req.file.path; // Get file path
        // Save the NOC file URL to the database for the student (associate with student ID)
        const student = await Student.findById(studentId);
        // console.log(student);
        if(student.nocFileUrl.toString().length > 1){
            return res.status(400).json({"message": "NOC already uploaded"});
        }
        await Student.findByIdAndUpdate(studentId, { nocFileUrl });

        res.status(200).json({ message: "File uploaded successfully!" });
    } catch (error) {
        console.error("Error uploading file: ", error);
        res.status(500).json({ error: "Error uploading file" });
    }
}

module.exports.downloadNocPhysical = async (req, res) => {
    try {
        const student = await Student.findById(req.params.studentId);

        if (!student || !student.nocFileUrl) {
            return res.status(404).json({ message: "NOC file not found" });
        }

        const filePath = path.resolve(student.nocFileUrl);
        res.download(filePath, 'noc.pdf', (err) => {
            if (err) {
                console.error("Error downloading file: ", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    } catch (error) {
        console.error("Error downloading file: ", error);
        res.status(500).json({ message: "Error downloading file" });
    }
};

module.exports.downloadNoc = async (req, res) => {
    try {
        console.log(req.params.nocId);
        const nocData = await Noc.findById(req.params.nocId);
        const doc = new pdfkit({
            layout: 'landscape',
            size: 'A4'
        });

        function jumpLine(doc, lines) {
            for (let index = 0; index < lines; index++) {
              doc.moveDown();
            }
        }
        // doc.text(`Name: ${nocData.name}`);
        const logoPath = path.join(__dirname, 'logo.png'); // Replace 'college_logo.png' with the actual file name and path
        const fontPath = path.join(__dirname);

        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#fff');
        doc.fontSize(10);

        // Margin
        const distanceMargin = 18;

        doc
        .fillAndStroke('#0e8cc3')
        .lineWidth(20)
        .lineJoin('round')
        .rect(
            distanceMargin,
            distanceMargin,
            doc.page.width - distanceMargin * 2,
            doc.page.height - distanceMargin * 2,
        )
        .stroke();

        // Header
        const maxWidth = 140;
        const maxHeight = 70;

        doc.image(logoPath, doc.page.width / 2 - maxWidth / 2, 60, {
        fit: [maxWidth, maxHeight],
        align: 'center',
        });

        jumpLine(doc, 5)

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Light.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('Kiet Group of Institutions', {
            align: 'center',
        });

        jumpLine(doc, 2)

        // Content
        doc
        .font(`${fontPath}/fonts/NotoSansJP-Regular.otf`)
        .fontSize(16)
        .fill('#021c27')
        .text('NON OBJECTIONAL CERTIFICATE', {
            align: 'center',
        });

        jumpLine(doc, 1)

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Light.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('Present to', {
            align: 'center',
        });

        jumpLine(doc, 2)

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Bold.otf`)
        .fontSize(24)
        .fill('#021c27')
        .text(`${nocData.name}`, {
            align: 'center',
        });

        jumpLine(doc, 1)

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Light.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text(`Successfully recieved the NOC for: ${nocData.company}`, {
            align: 'center',
        });

        jumpLine(doc, 7)

        doc.lineWidth(1);

        // Signatures
        const lineSize = 174;
        const signatureHeight = 390;

        doc.fillAndStroke('#021c27');
        doc.strokeOpacity(0.2);

        const startLine1 = 128;
        const endLine1 = 128 + lineSize;
        doc
        .moveTo(startLine1, signatureHeight)
        .lineTo(endLine1, signatureHeight)
        .stroke();

        const startLine2 = endLine1 + 32;
        const endLine2 = startLine2 + lineSize;
        doc
        .moveTo(startLine2, signatureHeight)
        .lineTo(endLine2, signatureHeight)
        .stroke();

        const startLine3 = endLine2 + 32;
        const endLine3 = startLine3 + lineSize;
        doc
        .moveTo(startLine3, signatureHeight)
        .lineTo(endLine3, signatureHeight)
        .stroke();

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Bold.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('HOD', startLine1, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Light.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('Verified', startLine1, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Bold.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('Dean', startLine2, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Light.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('Verified', startLine2, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Bold.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('CRPC', startLine3, signatureHeight + 10, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        doc
        .font(`${fontPath}/fonts/NotoSansJP-Light.otf`)
        .fontSize(10)
        .fill('#021c27')
        .text('Verified', startLine3, signatureHeight + 25, {
            columns: 1,
            columnGap: 0,
            height: 40,
            width: lineSize,
            align: 'center',
        });

        jumpLine(doc, 6);

        const text = `To validate the NOC, the credential id is: ${nocData._id}`;
        doc.fontSize(10)
        const linkWidth = doc.widthOfString(text);
        const linkHeight = doc.currentLineHeight();
        doc
        .underline(
            doc.page.width / 2 - linkWidth / 2,
            450,
            linkWidth,
            linkHeight,
        )
        doc
        .fontSize(10)
        .fill('#021c27')
        .text(
            text,
            doc.page.width / 2 - linkWidth / 2,
            448,
            linkWidth,
            linkHeight,
        );

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=noc.pdf`);

        doc.pipe(res);

        doc.end();
    } catch (error) {
        console.error('Error generating PDF: ', error);
        res.status(500).json({ error: 'Unable to generate PDF' });
    }
}