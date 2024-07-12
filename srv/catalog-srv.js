const cds = require('@sap/cds')
let oInput, Payload;

module.exports = cds.service.impl(function () {

    function lPad(str,len) {
        return new Promise(async function(resolve, reject){
            try {
                var s = str.toString();
                while (s.length < len) {
                    s = "0" + s;
                }
                resolve(s);
            }catch(error) {
                reject();
                throw error.toString();
            }
        })
    }

    function generateIncidentNumber() {
        return new Promise(async function(resolve, reject){
            try{
                var incidentNumber = 0;
                var query = `SELECT INCNUM.NEXTVAL FROM DUMMY`;
                var rs = await cds.run(query)
                if (rs.length != 0) {
                    if(incidentNumber === 0){
                        incidentNumber = Object.values(rs[0])[0];
                        resolve( 'INC-' + new Date().getFullYear() + '-' + await lPad(incidentNumber ,5));
                    }else{
                        resolve( 'INC-' + new Date().getFullYear() + '-' + await lPad('1',5));
                    }
                    
	            } 
            }catch(error) {
                console.error('Error retrieving incident number:', error);
                reject();
                throw error.toString();
            }
        })
    }

    function getSequenceNumber(tableName, columnName) {
        return new Promise(async function(resolve, reject){
            try {
                // Step 1: Find the sequence name
                const findSeqQuery = `
                    SELECT COLUMN_ID
                    FROM TABLE_COLUMNS
                    WHERE TABLE_NAME = '${tableName}'
                    AND COLUMN_NAME = '${columnName}';
                `;
                const findResult = await cds.run(findSeqQuery);
                if (findResult.length === 0) {
                    throw new Error(`No sequence found for table: ${tableName} and column: ${columnName}`);
                }
                const outputSequence = Object.values(findResult[0])[0];
                console.log('Find Sequence Number', outputSequence);
       
                // Step 2: Construct the sequence name
                const sequence = `_SYS_SEQUENCE_${outputSequence}_#0_#`;
                console.log('Sequence', sequence);
       
                // Step 3: Retrieve the current value of the sequence
                const seqQuery = `SELECT "${sequence}".CURRVAL FROM DUMMY;`;
                const seqResult = await cds.run(seqQuery);
                if (seqResult.length === 0) {
                    throw new Error(`No current value found for sequence: ${sequence}`);
                }
       
                outvar = Object.values(seqResult[0])[0];
                console.log('Seq Generated', outvar);
                resolve(outvar);
       
                // return outvar;
            } catch (error) {
                console.error('Error retrieving sequence number:', error);
                reject();
                throw error.toString();
 
            }
        })  
    }

    this.on('func_createIncident', async (req) => {
        try {
            Payload = req.data;
            oInput = JSON.parse(Payload.Payload);
            let oIncidentDetails = oInput.IncidentDetails;
            let aIncidentType = oInput.IncidentType;
            let oReportedBy = oInput.ReportedBy;
            let oNearMissDetails = oInput.NearMissDetails;
            let oErgonomics = oInput.Ergonomics;
            let oOther = oInput.Other;

            /****Basic Incident Tab ****/

            // Procedure for Basic Incident Details
            let dbQuery = `Call "prCreateUpdateIncidentDetails"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let result = await cds.run(dbQuery, [oIncidentDetails.INCID, oIncidentDetails.REBEH, oIncidentDetails.INCDT, oIncidentDetails.INCTM, oIncidentDetails.ICRDT, oIncidentDetails.ICRTM, oIncidentDetails.INCLC, oIncidentDetails.INCON, oIncidentDetails.LOCAD, oIncidentDetails.INCDE, oIncidentDetails.INCSV, oIncidentDetails.RGNOT, oIncidentDetails.INCPB, oIncidentDetails.WKCOM, oIncidentDetails.EMGSR, oIncidentDetails.EMGNT, oIncidentDetails.ISAVE, oIncidentDetails.EMPSG, oIncidentDetails.EMPST, oIncidentDetails.EMPDT, oIncidentDetails.SUPSG, oIncidentDetails.SUPST, oIncidentDetails.SUPDT, oIncidentDetails.LATIT, oIncidentDetails.LONGI, oIncidentDetails.DRFNM, oIncidentDetails.DESLC, 0, oIncidentDetails.CSTM1, oIncidentDetails.CSTM2, oIncidentDetails.CSTM3, oIncidentDetails.CSTM4, oIncidentDetails.CSTM5, oIncidentDetails.CSTM6, oIncidentDetails.CSTM7, oIncidentDetails.CSTM8, oIncidentDetails.CSTM9])
            console.log(result, "Basic Incident Details")

            const oIncidentId= await getSequenceNumber('INC_T_INCDT','INCID');

            if(oIncidentDetails.ISAVE === '0'){
		            
                const IncidentNumber = await generateIncidentNumber();
                console.log(IncidentNumber)
                //Procedure for updating the Incident Number
                let dbQuery17 = `CALL "prUpdateIncidentNumber"(?,?)`;
                let result17 = await cds.run(dbQuery17, [oIncidentId, IncidentNumber])
                console.log(result17, "Update Incident Number")
            }

            // Procedure for Involved People
            let dbQuery1 = `Call "prCreateUpdateInvolvedPeopleDetails"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let dbQuery2 = `Call "prCreateUpdateInvolvedPeopleType"(?,?,?,?,?)`;
            for (var i = 0; i < oIncidentDetails.InvolvedPeople.length; i++) {
                let result1 = await cds.run(dbQuery1, [oIncidentDetails.InvolvedPeople[i].IPLID, oIncidentId, oIncidentDetails.InvolvedPeople[i].ROLET, oIncidentDetails.InvolvedPeople[i].PERNM, oIncidentDetails.InvolvedPeople[i].EMPID, oIncidentDetails.InvolvedPeople[i].PHONE, oIncidentDetails.InvolvedPeople[i].EMAIL, oIncidentDetails.InvolvedPeople[i].SUPID, oIncidentDetails.InvolvedPeople[i].SUPNM, oIncidentDetails.InvolvedPeople[i].UNQID, oIncidentDetails.InvolvedPeople[i].ADDIF, oIncidentDetails.InvolvedPeople[i].DEPNM, oIncidentDetails.InvolvedPeople[i].POSIT, oIncidentDetails.InvolvedPeople[i].MNGID, oIncidentDetails.InvolvedPeople[i].MANGR, oIncidentDetails.InvolvedPeople[i].EMADD, oIncidentDetails.InvolvedPeople[i].EUNIT, oIncidentDetails.InvolvedPeople[i].SUPML, oIncidentDetails.InvolvedPeople[i].CNTRY, oIncidentDetails.InvolvedPeople[i].OLICN, oIncidentDetails.InvolvedPeople[i].CSTM1, oIncidentDetails.InvolvedPeople[i].CSTM2, oIncidentDetails.InvolvedPeople[i].CSTM3, oIncidentDetails.InvolvedPeople[i].CSTM4])
                console.log(result1, "Involved People Details")

                const oInvPeopleId= await getSequenceNumber('INC_T_INVPL','IPLID');

                /**** Person Type ****/
                for (var j = 0; j < oIncidentDetails.InvolvedPeople[i].PersonType.length; j++) {
                    let result2 = await cds.run(dbQuery2, [oIncidentDetails.InvolvedPeople[i].PersonType[j].IPTID, oInvPeopleId, oIncidentId, oIncidentDetails.InvolvedPeople[i].PersonType[j].INVTY, oIncidentDetails.InvolvedPeople[i].PersonType[j].ISDEL])
                    console.log(result2, "Involved People Type")
                }

                /**** Workplace Injury ****/
                let dbQuery12 = `Call "prCreateUpdateWorkPlaceInjury"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                let result12 = await cds.run(dbQuery12, [oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.WPIID,oIncidentId,oInvPeopleId,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.UNQID,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.INJIL,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.FACNM,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.MEDFC,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.DOCNM,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.INJDS,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.INJPS,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ISALT,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ALTOP,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ANWAB,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.DIMAB,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM1,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM2,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM3,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM4,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM5,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM6,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM7,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM8,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ISREC,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ISREP])
                console.log(result12, "WorkplaceHarassment");

                const oWorkInjuryId= await getSequenceNumber('INC_T_WPIDT','WPIID');

                let dbQuery13 = `Call "prCreateUpdateBodyParts"(?,?,?,?,?,?,?)`;

                for (var j = 0; j < oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart.length; j++) 
                {
                    let result13 = await cds.run(dbQuery13, [oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].BDPID,oWorkInjuryId,oIncidentId,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].BDPRT,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].NAINJ,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].ISIDE,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].BDPDS])
                    console.log(result13, "Body Part")
                }

                /**** First Aider ****/
                let dbQuery14 = `Call "prCreateUpdateFirstAider"(?,?,?,?,?,?,?,?,?)`;
                let result14 = await cds.run(dbQuery14, [oIncidentDetails.InvolvedPeople[i].FirstAider.FISID,oIncidentId,oInvPeopleId,oIncidentDetails.InvolvedPeople[i].FirstAider.UNQID,oIncidentDetails.InvolvedPeople[i].FirstAider.TRTRD,oIncidentDetails.InvolvedPeople[i].FirstAider.ARRAG,oIncidentDetails.InvolvedPeople[i].FirstAider.CSTM1,oIncidentDetails.InvolvedPeople[i].FirstAider.CSTM2,oIncidentDetails.InvolvedPeople[i].FirstAider.CSTM3])
                console.log(result14, "First Aider")
            }

            // Code for Incident Type
            let dbQuery3 = `Call "prCreateUpdateIncidentType"(?,?,?,?)`;
            for (var i = 0; i < aIncidentType.length; i++) {
                let result3 = await cds.run(dbQuery3, [aIncidentType[i].ICTID, oIncidentId, aIncidentType[i].INCTY, aIncidentType[i].ISDEL])
                console.log(result3, "Incident Type")
            }

            //Procedure for Reported By
            let dbQuery4 = `Call "prCreateUpdateReportedByDetails"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let result4 = await cds.run(dbQuery4, [oReportedBy.REPID, oIncidentId, oReportedBy.EMPNM, oReportedBy.EMPID, oReportedBy.DEPNM, oReportedBy.POSIT, oReportedBy.MGRID, oReportedBy.EMAIL, oReportedBy.MGRNM, oReportedBy.CSTM1, oReportedBy.CSTM2, oReportedBy.CSTM3, oReportedBy.CSTM4, oReportedBy.CSTM5, oReportedBy.CSTM6, oReportedBy.CSTM7, oReportedBy.CSTM8])
            console.log(result4, "Reported By")

            /**** Near Miss Tab ***/

            let dbQuery5 = `Call "prCreateUpdateNearMissDetails"(?,?,?,?,?,?,?,?)`;
            let result5 = await cds.run(dbQuery5, [oNearMissDetails.NRMID, oIncidentId, oNearMissDetails.NMAVD, oNearMissDetails.IMMAC, oNearMissDetails.NEADS, oNearMissDetails.CSTM1, oNearMissDetails.CSTM2, oNearMissDetails.CSTM3])
            console.log(result5, "Near Miss Details")

            const oNearMissId= await getSequenceNumber('INC_T_NRMIS','NRMID');

            let dbQuery6 = `Call "prCreateUpdateNearMissType"(?,?,?,?,?)`;
            for (var i = 0; i < oNearMissDetails.NearMissType.length; i++) {
                let result6 = await cds.run(dbQuery6, [oNearMissDetails.NearMissType[i].NMTID, oIncidentId, oNearMissId, oNearMissDetails.NearMissType[i].NRMTP, oNearMissDetails.NearMissType[i].ISDEL])
                console.log(result6, "Near Miss Type")
            }

            let dbQuery7 = `Call "prCreateUpdatePotentialNearMiss"(?,?,?,?,?)`;
            for (var i = 0; i < oNearMissDetails.NearMissPotential.length; i++) {
                let result7 = await cds.run(dbQuery7, [oNearMissDetails.NearMissPotential[j].NMPID, oIncidentId, oNearMissId, oNearMissDetails.NearMissPotential[j].NRMPT, oNearMissDetails.NearMissPotential[j].ISDEL])
                console.log(result7, "Near Miss Potential")
            }

            /**** Ergonomics Tab ****/
            let dbQuery8 = `Call "prCreateUpdateErgonomics"(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let result8 = await cds.run(dbQuery8, [oErgonomics.ERGID, oIncidentId, oErgonomics.ACUDS, oErgonomics.CHRDS, oErgonomics.ERGCP, oErgonomics.REQAS, oErgonomics.MOSTP, oErgonomics.KEYTP, oErgonomics.CRWOK, oErgonomics.SFASC, oErgonomics.CSTM1, oErgonomics.CSTM2, oErgonomics.CSTM3])
            console.log(result8, "Ergonomics Tab")

            const oErgonomicId= await getSequenceNumber('INC_T_ERGNM','ERGID');

            // Procedure for Ergonomics Type
            let dbQuery9 = `Call "prCreateUpdateErgonomicsTypes"(?,?,?,?,?)`;
            for (i = 0; i < oErgonomics.ErgonomicsType.length; i++) {
                let result9 = await cds.run(dbQuery9, [oErgonomics.ErgonomicsType[i].EGTID, oIncidentId, oErgonomicId, oErgonomics.ErgonomicsType[i].ERTYP, oErgonomics.ErgonomicsType[i].ISDEL])
                console.log(result9, "Ergonomics Type")
            }

            // Procedure for Ergonomics type which are most applicable
            let dbQuery10 = `Call "prCreateUpdateErgonomicsMostApplicableTypes"(?,?,?,?,?)`;
            for (i = 0; i < oErgonomics.ErgonomicsMAType.length; i++) {
                let result10 = await cds.run(dbQuery10, [oErgonomics.ErgonomicsMAType[j].EMAID, oIncidentId, oErgonomicId, oErgonomics.ErgonomicsMAType[j].MATYP, oErgonomics.ErgonomicsType[i].ISDEL])
                console.log(result10, "Ergonomics Most Applicable Type")
            }

            /**** Other Tab ****/
            let dbQuery11 = `Call "prCreateUpdateOtherIncidentType"(?,?,?,?,?)`;
            let result11 = await cds.run(dbQuery11, [oOther.OTHID, oIncidentId, oOther.OTDES, oOther.CSTM1, oOther.CSTM2])
            console.log(result11, "Other Incident Type")

            return true
        } catch (error) {
            let errorQuery = `Call "prCreateErrorHandling"(?,?,?,?,?)`;
            await cds.run(errorQuery, ["Report Incident", "createIncident", JSON.stringify(oInput), error, "DB"])
            console.error(error)
            return false
        }
    })
    this.on('act_createIncident', async (req) => {
        try {
            Payload = req.data;
            oInput = JSON.parse(Payload.Payload);
            let oIncidentDetails = oInput.IncidentDetails;
            let aIncidentType = oInput.IncidentType;
            let oReportedBy = oInput.ReportedBy;
            let oNearMissDetails = oInput.NearMissDetails;
            let oErgonomics = oInput.Ergonomics;
            let oOther = oInput.Other;

            /****Basic Incident Tab ****/

            // Procedure for Basic Incident Details
            let dbQuery = `Call "prCreateUpdateIncidentDetails"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let result = await cds.run(dbQuery, [oIncidentDetails.INCID, oIncidentDetails.REBEH, oIncidentDetails.INCDT, oIncidentDetails.INCTM, oIncidentDetails.ICRDT, oIncidentDetails.ICRTM, oIncidentDetails.INCLC, oIncidentDetails.INCON, oIncidentDetails.LOCAD, oIncidentDetails.INCDE, oIncidentDetails.INCSV, oIncidentDetails.RGNOT, oIncidentDetails.INCPB, oIncidentDetails.WKCOM, oIncidentDetails.EMGSR, oIncidentDetails.EMGNT, oIncidentDetails.ISAVE, oIncidentDetails.EMPSG, oIncidentDetails.EMPST, oIncidentDetails.EMPDT, oIncidentDetails.SUPSG, oIncidentDetails.SUPST, oIncidentDetails.SUPDT, oIncidentDetails.LATIT, oIncidentDetails.LONGI, oIncidentDetails.DRFNM, oIncidentDetails.DESLC, 0, oIncidentDetails.CSTM1, oIncidentDetails.CSTM2, oIncidentDetails.CSTM3, oIncidentDetails.CSTM4, oIncidentDetails.CSTM5, oIncidentDetails.CSTM6, oIncidentDetails.CSTM7, oIncidentDetails.CSTM8, oIncidentDetails.CSTM9])
            console.log(result, "Basic Incident Details")

            const oIncidentId= await getSequenceNumber('INC_T_INCDT','INCID');

            if(oIncidentDetails.ISAVE === '0'){
		            
                const IncidentNumber = await generateIncidentNumber();
                console.log(IncidentNumber)
                //Procedure for updating the Incident Number
                let dbQuery17 = `CALL "prUpdateIncidentNumber"(?,?)`;
                let result17 = await cds.run(dbQuery17, [oIncidentId, IncidentNumber])
                console.log(result17, "Update Incident Number")
            }

            // Procedure for Involved People
            let dbQuery1 = `Call "prCreateUpdateInvolvedPeopleDetails"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let dbQuery2 = `Call "prCreateUpdateInvolvedPeopleType"(?,?,?,?,?)`;
            for (var i = 0; i < oIncidentDetails.InvolvedPeople.length; i++) {
                let result1 = await cds.run(dbQuery1, [oIncidentDetails.InvolvedPeople[i].IPLID, oIncidentId, oIncidentDetails.InvolvedPeople[i].ROLET, oIncidentDetails.InvolvedPeople[i].PERNM, oIncidentDetails.InvolvedPeople[i].EMPID, oIncidentDetails.InvolvedPeople[i].PHONE, oIncidentDetails.InvolvedPeople[i].EMAIL, oIncidentDetails.InvolvedPeople[i].SUPID, oIncidentDetails.InvolvedPeople[i].SUPNM, oIncidentDetails.InvolvedPeople[i].UNQID, oIncidentDetails.InvolvedPeople[i].ADDIF, oIncidentDetails.InvolvedPeople[i].DEPNM, oIncidentDetails.InvolvedPeople[i].POSIT, oIncidentDetails.InvolvedPeople[i].MNGID, oIncidentDetails.InvolvedPeople[i].MANGR, oIncidentDetails.InvolvedPeople[i].EMADD, oIncidentDetails.InvolvedPeople[i].EUNIT, oIncidentDetails.InvolvedPeople[i].SUPML, oIncidentDetails.InvolvedPeople[i].CNTRY, oIncidentDetails.InvolvedPeople[i].OLICN, oIncidentDetails.InvolvedPeople[i].CSTM1, oIncidentDetails.InvolvedPeople[i].CSTM2, oIncidentDetails.InvolvedPeople[i].CSTM3, oIncidentDetails.InvolvedPeople[i].CSTM4])
                console.log(result1, "Involved People Details")

                const oInvPeopleId= await getSequenceNumber('INC_T_INVPL','IPLID');

                /**** Person Type ****/
                for (var j = 0; j < oIncidentDetails.InvolvedPeople[i].PersonType.length; j++) {
                    let result2 = await cds.run(dbQuery2, [oIncidentDetails.InvolvedPeople[i].PersonType[j].IPTID, oInvPeopleId, oIncidentId, oIncidentDetails.InvolvedPeople[i].PersonType[j].INVTY, oIncidentDetails.InvolvedPeople[i].PersonType[j].ISDEL])
                    console.log(result2, "Involved People Type")
                }

                /**** Workplace Injury ****/
                let dbQuery12 = `Call "prCreateUpdateWorkPlaceInjury"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                let result12 = await cds.run(dbQuery12, [oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.WPIID,oIncidentId,oInvPeopleId,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.UNQID,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.INJIL,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.FACNM,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.MEDFC,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.DOCNM,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.INJDS,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.INJPS,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ISALT,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ALTOP,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ANWAB,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.DIMAB,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM1,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM2,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM3,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM4,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM5,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM6,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM7,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.CSTM8,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ISREC,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.ISREP])
                console.log(result12, "WorkplaceHarassment");

                const oWorkInjuryId= await getSequenceNumber('INC_T_WPIDT','WPIID');

                let dbQuery13 = `Call "prCreateUpdateBodyParts"(?,?,?,?,?,?,?)`;

                for (var j = 0; j < oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart.length; j++) 
                {
                    let result13 = await cds.run(dbQuery13, [oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].BDPID,oWorkInjuryId,oIncidentId,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].BDPRT,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].NAINJ,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].ISIDE,oIncidentDetails.InvolvedPeople[i].WorkplaceInjury.BodyPart[j].BDPDS])
                    console.log(result13, "Body Part")
                }

                /**** First Aider ****/
                let dbQuery14 = `Call "prCreateUpdateFirstAider"(?,?,?,?,?,?,?,?,?)`;
                let result14 = await cds.run(dbQuery14, [oIncidentDetails.InvolvedPeople[i].FirstAider.FISID,oIncidentId,oInvPeopleId,oIncidentDetails.InvolvedPeople[i].FirstAider.UNQID,oIncidentDetails.InvolvedPeople[i].FirstAider.TRTRD,oIncidentDetails.InvolvedPeople[i].FirstAider.ARRAG,oIncidentDetails.InvolvedPeople[i].FirstAider.CSTM1,oIncidentDetails.InvolvedPeople[i].FirstAider.CSTM2,oIncidentDetails.InvolvedPeople[i].FirstAider.CSTM3])
                console.log(result14, "First Aider")
            }

            // Code for Incident Type
            let dbQuery3 = `Call "prCreateUpdateIncidentType"(?,?,?,?)`;
            for (var i = 0; i < aIncidentType.length; i++) {
                let result3 = await cds.run(dbQuery3, [aIncidentType[i].ICTID, oIncidentId, aIncidentType[i].INCTY, aIncidentType[i].ISDEL])
                console.log(result3, "Incident Type")
            }

            //Procedure for Reported By
            let dbQuery4 = `Call "prCreateUpdateReportedByDetails"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let result4 = await cds.run(dbQuery4, [oReportedBy.REPID, oIncidentId, oReportedBy.EMPNM, oReportedBy.EMPID, oReportedBy.DEPNM, oReportedBy.POSIT, oReportedBy.MGRID, oReportedBy.EMAIL, oReportedBy.MGRNM, oReportedBy.CSTM1, oReportedBy.CSTM2, oReportedBy.CSTM3, oReportedBy.CSTM4, oReportedBy.CSTM5, oReportedBy.CSTM6, oReportedBy.CSTM7, oReportedBy.CSTM8])
            console.log(result4, "Reported By")

            /**** Near Miss Tab ***/

            let dbQuery5 = `Call "prCreateUpdateNearMissDetails"(?,?,?,?,?,?,?,?)`;
            let result5 = await cds.run(dbQuery5, [oNearMissDetails.NRMID, oIncidentId, oNearMissDetails.NMAVD, oNearMissDetails.IMMAC, oNearMissDetails.NEADS, oNearMissDetails.CSTM1, oNearMissDetails.CSTM2, oNearMissDetails.CSTM3])
            console.log(result5, "Near Miss Details")

            const oNearMissId= await getSequenceNumber('INC_T_NRMIS','NRMID');

            let dbQuery6 = `Call "prCreateUpdateNearMissType"(?,?,?,?,?)`;
            for (var i = 0; i < oNearMissDetails.NearMissType.length; i++) {
                let result6 = await cds.run(dbQuery6, [oNearMissDetails.NearMissType[i].NMTID, oIncidentId, oNearMissId, oNearMissDetails.NearMissType[i].NRMTP, oNearMissDetails.NearMissType[i].ISDEL])
                console.log(result6, "Near Miss Type")
            }

            let dbQuery7 = `Call "prCreateUpdatePotentialNearMiss"(?,?,?,?,?)`;
            for (var i = 0; i < oNearMissDetails.NearMissPotential.length; i++) {
                let result7 = await cds.run(dbQuery7, [oNearMissDetails.NearMissPotential[j].NMPID, oIncidentId, oNearMissId, oNearMissDetails.NearMissPotential[j].NRMPT, oNearMissDetails.NearMissPotential[j].ISDEL])
                console.log(result7, "Near Miss Potential")
            }

            /**** Ergonomics Tab ****/
            let dbQuery8 = `Call "prCreateUpdateErgonomics"(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
            let result8 = await cds.run(dbQuery8, [oErgonomics.ERGID, oIncidentId, oErgonomics.ACUDS, oErgonomics.CHRDS, oErgonomics.ERGCP, oErgonomics.REQAS, oErgonomics.MOSTP, oErgonomics.KEYTP, oErgonomics.CRWOK, oErgonomics.SFASC, oErgonomics.CSTM1, oErgonomics.CSTM2, oErgonomics.CSTM3])
            console.log(result8, "Ergonomics Tab")

            const oErgonomicId= await getSequenceNumber('INC_T_ERGNM','ERGID');

            // Procedure for Ergonomics Type
            let dbQuery9 = `Call "prCreateUpdateErgonomicsTypes"(?,?,?,?,?)`;
            for (i = 0; i < oErgonomics.ErgonomicsType.length; i++) {
                let result9 = await cds.run(dbQuery9, [oErgonomics.ErgonomicsType[i].EGTID, oIncidentId, oErgonomicId, oErgonomics.ErgonomicsType[i].ERTYP, oErgonomics.ErgonomicsType[i].ISDEL])
                console.log(result9, "Ergonomics Type")
            }

            // Procedure for Ergonomics type which are most applicable
            let dbQuery10 = `Call "prCreateUpdateErgonomicsMostApplicableTypes"(?,?,?,?,?)`;
            for (i = 0; i < oErgonomics.ErgonomicsMAType.length; i++) {
                let result10 = await cds.run(dbQuery10, [oErgonomics.ErgonomicsMAType[j].EMAID, oIncidentId, oErgonomicId, oErgonomics.ErgonomicsMAType[j].MATYP, oErgonomics.ErgonomicsType[i].ISDEL])
                console.log(result10, "Ergonomics Most Applicable Type")
            }

            /**** Other Tab ****/
            let dbQuery11 = `Call "prCreateUpdateOtherIncidentType"(?,?,?,?,?)`;
            let result11 = await cds.run(dbQuery11, [oOther.OTHID, oIncidentId, oOther.OTDES, oOther.CSTM1, oOther.CSTM2])
            console.log(result11, "Other Incident Type")

            return true
        } catch (error) {
            let errorQuery = `Call "prCreateErrorHandling"(?,?,?,?,?)`;
            await cds.run(errorQuery, ["Report Incident", "createIncident", oIncidentDetails, error.toString(), "DB"])
            console.error(error)
            return error;
        }
    })

    this.on('act_DeleteInjuredBodyParts', async (req) => {
        var aBodyPart = [];
        try{
            Payload = req.data;
            oInput = JSON.parse(Payload.Payload);
            aBodyPart = oInput.BodyPart; 

            // Procedure delete Involved people Body Parts
			let dbQuery = `CALL "prUpdateDeleteInjuredBodyParts"(?,?,?)`;
			
			for(i = 0;i < aBodyPart.length;i++) {
                let result = await cds.run(dbQuery, [aBodyPart[i].BDPID,aBodyPart[i].WPIID,aBodyPart[i].INCID])
                console.log(result, "Delete Injured Body Part")
			}

            return true
        }catch(error) {
            let errorQuery = `Call "prCreateErrorHandling"(?,?,?,?,?)`;
            await cds.run(errorQuery, ["Report Incident", "DeleteInjuredBodyParts", aBodyPart, error.toString(), "DB"])
            console.error(error)
            return error;
        }
    })

    this.on('act_DeleteInvolvedPeople', async (req) => {
        var oInvolvedPeople = {};
        try{
            Payload = req.data;
            oInput = JSON.parse(Payload.Payload);
            oInvolvedPeople = oInput.InvolvedPeople;

            // Procedure delete Involved people 
			let dbQuery = `CALL "prUpdateDeleteInvolvedPeopleDetail"(?,?)`;
            let result = await cds.run(dbQuery, [oInvolvedPeople.IPLID,oInvolvedPeople.INCID])
			console.log(result, "Delete Involved People")
					    
		    let dbQuery1 = `CALL "prUpdateDeleteInvolvedPeopleRelatedData"(?,?)`;
            let result1 = await cds.run(dbQuery1, [oInvolvedPeople.INCID,oInvolvedPeople.IPLID])
			console.log(result1, "Delete Involved People Related Data")

            return true
        }catch(error) {
            let errorQuery = `Call "prCreateErrorHandling"(?,?,?,?,?)`;
            await cds.run(errorQuery, ["Report Incident", "DeleteInvolvedPeople", oInvolvedPeople, error.toString(), "DB"])
            console.error(error)
            return error;
        }
    })


})