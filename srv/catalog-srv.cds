using INC as INC from '../db/schema';

service CatalogService{

    // GET

    @readonly
    entity EmployeeInfo as select from INC.M.EmployeeInfo;

    @readonly
    entity MasterDataList as select from INC.M.MasterDataList;

    @readonly
    entity LabelsList as select from INC.M.LabelsList;

    @readonly
    entity BodyParts as select from INC.M.BodyParts;

    @readonly
    entity BasicIncidentDetails as select from INC.EMP.BasicIncidentDetails;

    @readonly
    entity IncidentType as select from INC.EMP.IncidentType;

    @readonly
    entity InvolvedPeopleDetails as select from INC.EMP.InvolvedPeopleDetails;

    @readonly
    entity InvolvedPeopleType as select from INC.EMP.InvolvedPeopleType;

    @readonly
    entity IncidentReportedByDetails as select from INC.EMP.IncidentReportedByDetails;

    @readonly
    entity NearMissDetails as select from INC.EMP.NearMissDetails;

    @readonly
    entity NearMissType as select from INC.EMP.NearMissType;

    @readonly
    entity PotentialNearMiss as select from INC.EMP.PotentialNearMiss;

    @readonly
    entity Ergonomics as select from INC.EMP.Ergonomics;

    @readonly
    entity ErgonomicsTypes as select from INC.EMP.ErgonomicsTypes;

    @readonly
    entity ErgomonomicsMostApplicableTypes as select from INC.EMP.ErgomonomicsMostApplicableTypes;

    @readonly
    entity WorkPlaceInjury as select from INC.EMP.WorkPlaceInjury;

    @readonly
    entity BodyPartsNatureInjury as select from INC.EMP.BodyPartsNatureInjury;

    @readonly 
    entity FirstAider as select from INC.EMP.FirstAider; 

    @readonly
    entity OtherIncidentType as select from INC.EMP.OtherIncidentType;
    



    // POST 
 
    function func_createIncident(Payload : String) returns Boolean;
 
    action act_createIncident(Payload : String) returns String;

    action act_DeleteInjuredBodyParts(Payload : String) returns String;

    action act_DeleteInvolvedPeople(Payload : String) returns String;

}