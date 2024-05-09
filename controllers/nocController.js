const Noc = require("../models/noc");

module.exports.addNocReq = async (req, res) => {
    try{
        // console.log(req.body);
        const newNoc = await Noc.create({
            studentId: req.body.userId,
            name: req.body.name,
            email: req.body.email,
            roll: req.body.roll,
            ctc: req.body.ctc,
            company: req.body.company,
            joiningDate: req.body.joiningDate,
            isApproved: req.body.isApproved,
            hodApproval: req.body.hodApproval,
            crpcApproval: req.body.crpcApproval,
            deanApproval: req.body.deanApproval,
            isRejected: req.body.isRejected
        })
    
        return res.status(200).json({noc: newNoc});
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: "Error in creating the noc! "});
    }   
}


module.exports.getNoc = async (req, res) => {
    try {
        console.log(req.query.id);
        const noc = await Noc.findOne({studentId: req.query.id});
        if(!noc){
            return res.status(401).json({error: "Noc not found!"});
        }
        // console.log(noc);
        return res.status(200).json(noc);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"error": error});
    }
}


module.exports.getAllNocs = async (req, res) => {
    try {
        let nocs = {};
        nocs = await Noc.find();
        if(!nocs){
            return res.status(401).json({error: "No NOC Found"});
        }
        // console.log(students)
        return res.status(200).json(nocs);
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message": "Unable to fetch NOCs"})
    }
}

module.exports.approveNoc = async (req, res) => {
    try {
        const { nocId, role, ctc } = req.body;

        let updatedNoc;

        if(role === "HOD"){
            updatedNoc = await Noc.findOneAndUpdate(
                { _id: nocId },
                { $set: { 
                     hodApproval: true
                    }
                },
                { new: true } // Return the updated document
            );
        }
        else if(role === "CRPC"){
            updatedNoc = await Noc.findOneAndUpdate(
                { _id: nocId },
                { $set: { 
                     crpcApproval: true
                    }
                },
                { new: true } // Return the updated document
            );
        }
        else if(role === "Dean" && ctc < 7){
            updatedNoc = await Noc.findOneAndUpdate(
                { _id: nocId },
                { $set: {
                    deanApproval: true,
                    isApproved: true
                    }
                },
                { new: true } // Return the updated document
            );
        }
        else if(role === "Dean" && ctc >= 7){
            updatedNoc = await Noc.findOneAndUpdate(
                { _id: nocId },
                { $set: {
                    hodApproval: true,
                    crpcApproval: true,
                    deanApproval: true,
                    isApproved: true
                    }
                },
                { new: true } // Return the updated document
            );
        }

        if (!updatedNoc) {
            return res.status(404).json({ message: 'NOC not found' });
        }

        return res.status(200).json({ message: 'NOC approval successful', noc: updatedNoc });
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message" : "Unable to approve the NOC"});
    }
}


module.exports.rejectNoc = async (req, res) => {
    try {
        const { nocId, rejectedBy } = req.body;

        const updatedNoc = await Noc.findOneAndUpdate(
            { _id: nocId },
            { $set: { isRejected: true, rejectedBy: rejectedBy } },
            { new: true } // Return the updated document
        );

        if (!updatedNoc) {
            return res.status(404).json({ message: 'NOC not found' });
        }

        return res.status(200).json({ message: 'NOC rejection successful', noc: updatedNoc });
    } catch (error) {
        console.log(error);
        return res.status(500).json({"message" : "Unable to reject the NOC"});
    }
}