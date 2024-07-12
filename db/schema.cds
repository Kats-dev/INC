namespace INC;

context M {

    @cds.persistence.exists
    entity EmployeeInfo() {
        key EMPID : String(30);
        EMPNM : String(250);
        EMAIL : String(250);
        MGRID : String(30);
        MGRNM : String(250);
        USRID : String(30);
        POSIT : String(200);
        DEPTC : String(10);
        DEPNM : String(200);
        PHONE : String(50);
        SUPID : String(30);
        SUPNM : String(250);
        EMADD : String(5000);
        EUNIT : String(250);
        SUPML : String(250);
        CNTRY : String(250);
        LICNM : String(250);
    }

    @cds.persistence.exists
    entity MasterDataList() {
        key UNQID : String(10);
        TYVAL : String(50);
        TXVAL : String(1000);
        COLID : Integer;
        INCTY : Integer;
        TXDES : String(5000);
        ISDBL : String(1);
        ISEDT : String(1);
        ISADD : String(1);
    }

    @cds.persistence.exists
    entity LabelsList() {
        key UNQID : Integer;
        LABTY : String(1000);
        LABTX : String(500);
        LABIV : String(1);
        LABIE : String(1);
        LABIM : String(1);
        LBVCA : String(1);
        LBMCA : String(1);
        AFLAG : String(10);
        HTXIV : String(1);
        HLPTX : String(1000);
    }

    @cds.persistence.exists
    entity BodyParts() {
        key UNQID : Int16;
        TXVAL : String(100);
        TYVAL : String(50)
    }
}

context EMP {

    @cds.persistence.exists
    entity BasicIncidentDetails() {
        key INCID : Integer;
        REBEH : Int16;
        INCNM : String(50);
        INCDT : Date;
        INCTM : String(10);
        ICRDT : Date;
        ICRTM : String(10);
        INCLC : Int16;
        INCON : Int16;
        LOCAD : String(1000);
        INCDE : String(5000);
        INCSV : Int16;
        RGNOT : Int16;
        INCPB : Int16;
        WKCOM : Int16;
        EMGSR : Int16;
        EMGNT : String(1000);
        INCST : Int16;
        ISAVE : String(1);
        EMPSG : String(100);
        EMPST : String(100);
        EMPDT : Date;
        SUPSG : String(100);
        SUPST : String(100);
        SUPDT : Date;
        LATIT : String(50);
        LONGI : String(50);
        INCLCTXT : String(1000);
        INCONTXT : String(1000);
        INCSVTXT : String(1000);
        INCPBTXT : String(1000);
        INCSTTXT : String(1000);
        DESLC : String(500);
        RECOM : Integer;
        CSTM1 : String(1000);
        CSTM2 : String(1000);
        CSTM3 : String(1000);
        CSTM4 : String(1000);
        CSTM5 : String(1000);
        CSTM6 : String(1000);
        CSTM7 : String(1000);
        CSTM8 : String(1000);
        CSTM9 : String(1000);
        IncidentType :  Association to many IncidentType on IncidentType.INCID = INCID;
        IncidentReportedByDetails : Association to many IncidentReportedByDetails on IncidentReportedByDetails.INCID = INCID;
        InvolvedPeopleDetails : Association to many InvolvedPeopleDetails on InvolvedPeopleDetails.INCID = INCID;
        NearMissDetails : Association to many NearMissDetails on NearMissDetails.INCID = INCID;
        Ergonomics : Association to many Ergonomics on Ergonomics.INCID = INCID;
        WorkPlaceInjury : Association to many WorkPlaceInjury on WorkPlaceInjury.INCID = INCID;
        OtherIncidentType : Association to many OtherIncidentType on OtherIncidentType.INCID = INCID;
    }

    @cds.persistence.exists
    entity IncidentType() {
        key ICTID : Integer;
        INCID : Integer;
        INCTY : Int16;
        ISDEL : String(1);
        INCTYTXT : String(1000);
    }

    @cds.persistence.exists
    entity IncidentReportedByDetails() {
        key REPID : Integer;
        INCID : Integer;
        EMPNM : String(250);
        EMPID : String(30);
        DEPNM : String(100);
        POSIT : String(100);
        MGRID : String(100);
        MGRNM : String(250);
        EMAIL : String(250);
        CSTM1 : String(1000);
        CSTM2 : String(1000);
        CSTM3 : String(1000);
        CSTM4 : String(1000);
        CSTM5 : String(1000);
        CSTM6 : String(1000);
        CSTM7 : String(1000);
        CSTM8 : String(1000);
    }

    @cds.persistence.exists
    entity InvolvedPeopleDetails() {
        key IPLID: Integer;
        INCID : Integer;
        ROLET : Int16;
        ROLET_TXT : String(1000);
        PERNM : String(250);
        EMPID : String(30);
        PHONE : String(50);
        EMAIL : String(250);
        SUPID : String(30);
        SUPNM : String(250);
        UNQID : String(20);
        ADDIF : String(5000);
        DEPNM : String(200);
        POSIT : String(200);
        MNGID : String(30);
        MANGR : String(250);
        EMADD : String(5000);
        EUNIT : String(250);
        SUPML : String(250);
        CNTRY : String(250);
        OLICN : String(250);
        CSTM1 : String(1000);
        CSTM2 : String(1000);
        CSTM3 : String(1000);
        CSTM4 : String(1000);
        InvolvedPeopleType : Association to many InvolvedPeopleType on InvolvedPeopleType.IPLID = IPLID;
        WorkPlaceInjury : Association to many WorkPlaceInjury on WorkPlaceInjury.IPLID = IPLID;
        FirstAider : Association to many FirstAider on FirstAider.IPLID = IPLID;
    }

    @cds.persistence.exists
    entity InvolvedPeopleType() {
        key IPTID : Integer;
        IPLID : Integer;
        INCID : Integer;
        INVTY : Int16;
        INVTY_TXT : String(1000);
    }

    @cds.persistence.exists
    entity Ergonomics() {
        key ERGID : Integer;
        INCID : Integer;
        ACUDS : String(5000);
        CHRDS : String(5000);
        ERGCP : Int16;
        REQAS : Int16;
        REQASTXT : String(1000);
        MOSTP : Int16;
        MOSTPTXT : String(1000);
        KEYTP : Int16;
        KEYTPTXT : String(1000);
        CRWOK : Int16;
        CRWOKTXT : String(1000);
        SFASC : Int16;
        SFASCTXT : String(1000);
        CSTM1 : String(1000);
        CSTM2 : String(1000);
        CSTM3 : String(5000); 
        ErgonomicsTypes : Association to many ErgonomicsTypes on ErgonomicsTypes.ERGID = ERGID;
        ErgomonomicsMostApplicableTypes : Association to many ErgomonomicsMostApplicableTypes on ErgomonomicsMostApplicableTypes.ERGID = ERGID;
    }

    @cds.persistence.exists
    entity ErgonomicsTypes() {
        key EGTID : Integer;
        ERGID : Integer;
        INCID : Integer;
        ERTYP : Int16;
        ERTYPTXT : String(1000);
        ISDEL : String(1);
    }

    @cds.persistence.exists
    entity ErgomonomicsMostApplicableTypes() {
        key EMAID : Integer;
        ERGID : Integer;
        INCID : Integer;
        MATYP : Int16;
        MATYPTXT : String(1000);
        ISDEL : String(1);
    }

    @cds.persistence.exists
    entity NearMissDetails() {
        key NRMID: Integer;
        INCID : Integer;
        NEADS : String(5000);
        NMAVD : String(5000);
        IMMAC : String(5000);
        CSTM1 : String(1000);
        CSTM2 : String(1000);
        CSTM3 : String(5000);
        NearMissType : Association to many NearMissType on NearMissType.NRMID = NRMID;
        PotentialNearMiss : Association to many PotentialNearMiss on PotentialNearMiss.NRMID = NRMID;
    }

    @cds.persistence.exists
    entity NearMissType() {
        key NMTID: Integer;
        INCID : Integer;
        NRMID : Integer;
        NRMTP : Int16;
        NRMTPTXT : String(1000);
        ISDEL : String(1);
    }

    @cds.persistence.exists
    entity PotentialNearMiss() {
        key NMPID: Integer;
        INCID : Integer;
        NRMID : Integer;
        NRMPT : Int16;
        NRMPTTXT : String(1000);
        ISDEL : String(1);
    }

    @cds.persistence.exists
    entity WorkPlaceInjury() {
        key WPIID : Integer;
        INCID : Integer;
        UNQID : String(20);
        INJIL : Int16;
        FACNM : String(250);
        MEDFC : Int16;
        DOCNM : String(250);
        INJDS : String(5000);
        INJPS : String(5000);
        ISALT : Int16;
        ALTOP : Int16;
        ANWAB : Int16;
        DIMAB : String(5000);
        IPLID : Integer;
        CSTM1 : String(1000);
        CSTM2 : String(1000);
        CSTM3 : String(5000);
        CSTM4 : String(1000);
        CSTM5 : String(1000);
        CSTM6 : String(5000);
        CSTM7 : String(1000);
        CSTM8 : String(1000);
        ISREC : Int16;
        ISREP : Int16;
        BodyPartsNatureInjury : Association to many BodyPartsNatureInjury on BodyPartsNatureInjury.WPIID = WPIID;
    }

    @cds.persistence.exists
    entity FirstAider() {
        key FISID : Integer;
        INCID : Integer;
        UNQID : String(20);
        TRTRD : String(5000);
        ARRAG : String(5000);
        IPLID : Integer;
        CSTM1 : String(1000);
        CSTM2 : String(1000);
        CSTM3 : String(5000);
    }

    @cds.persistence.exists
    entity BodyPartsNatureInjury() {
        key BDPID : Integer;
        WPIID : Integer;
        INCID : Integer;
        BDPRT : Int16;
        NAINJ : Int16;
        ISIDE : Int16;
        UNQID_TXT : String(50);
        NATID_TXT : String(50);
        SIDID_TXT : String(50);
        BDPDS : String(1000);
    }

    @cds.persistence.exists
    entity OtherIncidentType() {
        key OTHID : Integer;
        INCID : Integer;
        OTDES : String(5000);
        CSTM1 : String(1000);
        CSTM2 : String(1000);
    }
}