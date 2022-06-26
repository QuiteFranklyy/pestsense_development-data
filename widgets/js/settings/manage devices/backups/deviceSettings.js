//# sourceURL=dynamic-script.js
/**
 * Description: 
 * Create Author/Date: 
 * Modified Author/Date Date: 
 * Version: 
 */

/**
 * Initialise script state (run once at startup)
 */
 const devDropDdown = Script.getWidget("deviceDropDown");
 const deviceDataTable = Script.getWidget("deviceDataTable");
 const downloadDevData = Script.getWidget("downloadDevData");
 var deviceData;
 var companyData;
 var branchData;
 var customerData;
 var siteData;
 var locationData;
 var companyData;
 var dowloadData;
 var filteredDev;


var devColumns = [
    "Device Number",
    "Sid",
    "Region",
    "Model",
    "Batch Number",
    "Hardware Version",
    "Location",
    "Activation Status",
    "Date Created",
    "Created By"
]
 Script.on('load', function () {
 
     //var status = ["Status 0", "Status 1", "Status 2", "Status 3",  "Status 4"];
     //devDropDdown

     ClientEvents.subscribe("newFile", processFile);
     ClientEvents.subscribe("selectStatus", (event)=> {

        loadData(event);
    
        
     });
     downloadDevData.subscribe("pressed", ()=>{

        var data = {};
        //console.log("pressed the button " + JSON.stringify(filteredDev, null, 4));
		 
		 // new SensaCollection(this.columns, this.pk, { data: JSON.parse(JSON.stringify(this.data)) });
         var Sids = dowloadData.getColumn("Id");
         for(var id in dowloadData.data) {
             var value = [];
             value.push(dowloadData.data[id][21]);
             value.push(dowloadData.data[id][20]);
             value.push(dowloadData.data[id][93]);
             value.push(dowloadData.data[id][94]);
             value.push(dowloadData.data[id][95]);
             value.push(dowloadData.data[id][96]);
             value.push(dowloadData.data[id][10]);
             value.push(dowloadData.data[id][92]);
             value.push(dowloadData.data[id][40]);
             value.push(dowloadData.data[id][41]);
             data[dowloadData.data[id][21]] = value;
         }
         // new SensaCollection(this.columns, this.pk, { data: JSON.parse(JSON.stringify(this.data)) });
         //console.log("pressed the button " + JSON.stringify(data, null, 4));
         var devSensaCollection = new SensaCollection(devColumns, devColumns[0], {data:data});
		 Script.downloadCSV("device_data.csv", devSensaCollection);
     });
     Database.readRecords("rodent", "Devices", (data) => {
         deviceData = SensaCollection.load(data.value);
 
         //deleteAllRows
 
 
         //deviceDataTable.
         var status = {
             value: "Activation Status 1"
         };
 
         Database.readRecords("rodent", "Locations", (event) => {
             locationData = SensaCollection.load(event.value);
             //console.log("Location data is " + JSON.stringify(locationData, null, 4));
             updateTable(status);
         });
 
     });
 
 
 
     Database.readRecords("rodent", "Sites", (data) => {
         siteData = SensaCollection.load(data.value);
     });
 
     Database.readRecords("rodent", "Customers", (data) => {
         customerData = SensaCollection.load(data.value);
     });
 
     Database.readRecords("rodent", "Branches", (data) => {
         branchData = SensaCollection.load(data.value);
     });
 
     Database.readRecords("rodent", "Companies", (data) => {
         companyData = SensaCollection.load(data.value);
     });
	 
 
 });

 const maxUnixtime = 2147483647;

 function loadData(event) {

    Database.readRecords("rodent", "Devices", (data) => {
        deviceData = SensaCollection.load(data.value);
        updateTable(event);
    

    });
 }
 function updateTable(status) {
 
     console.log("Data received is " + JSON.stringify(status, null, 4));
     var filteredStatus = status.value.split(" ")[2];
     
 
 
     filteredDev = deviceData.query((record, pk) => {
         return (record["Sid"] !== "" || record["DeviceNumber"]) !== "" && record["ActivationStatus"] == filteredStatus;
     });

     dowloadData = filteredDev.clone();
 
     //console.log("DEV data " + JSON.stringify(filteredDev, null, 4));
 
     //console.log("LOca data " + JSON.stringify(locationData.data, null, 4));
     filteredDev.renameColumn("DeviceNumber", "Device Number");
     filteredDev.renameColumn("BatchNumber", "Batch Number");
     filteredDev.renameColumn("DeviceNumber", "Device Number");
     filteredDev.renameColumn("CreatedOn", "Date Created");
     filteredDev.renameColumn("CreatedBy", "Created By");
     filteredDev.renameColumn("HWVersion", "Hardware Version");
     filteredDev.renameColumn("ActivationStatus", "Activation Status");
 
     for (var data in filteredDev.data) {
         //console.log("Data at " + data + " val is " + filteredDev.data[data][23]);
 
         if (filteredDev.data[data][23] in locationData.data) {
             filteredDev.data[data][10] = locationData.data[filteredDev.data[data][23]]['2'];
             //console.log(`data present ${filteredDev.data[data][23]}`);
 
         }
         //if(filteredDev.data[data][23] in locationData.data) {
 
         //filteredDev.data[data][23] = locationData.data[data][2];
         //}
         var createdOn = filteredDev.data[data][40];
 
         //console.log("Created " + createdOn + " updated " + updateOn)
         if (!isNaN(createdOn) && createdOn !== null && createdOn !== "") {
             var date = parseInt(createdOn);
             console.log("find created " + createdOn + " max " + maxUnixtime);
             if (date < maxUnixtime) {
 
                 date = parseInt(createdOn) * 1000;
             }
             filteredDev.data[data][40] = formatDate(date);
         }
     }
 
 
     ClientEvents.publish("deleteAllRows", "");
     deviceDataTable.receiveValue(filteredDev);
 
 }
 
 function formatDate(today) {
 
     var date;
     if (typeof today == "number") {
         date = new Date(today).toLocaleString('en-GB');
     } else {
         date = new Date(parseInt(today)).toLocaleString('en-GB');
     }
     var d = date.split(", ");
     var d0 = d[0].split("/");
     //d0[2] = Math.abs(d0[2] - 2000);
     d0 = d0.join("/");
     //return d[1] + " " + d0;
     console.log("New data is " + d0);
     return d0 + " " + d[1].substring(0, 5);
 }
 
 
 function processFile(event) {
     console.log("start uploading");
     if(event.value === "Invalid Input") {
         return;
     }
     var reader = new FileReader();
     console.log("Files uploaded is " + JSON.stringify(event));
     //reader.readAsBinaryString(event.value);
     reader.onload = function (event) {
         // output results
         console.log("Files uploaded is 2 " + JSON.stringify(event));
         
         var dataLines = reader.result.split(/\r\n|\n/);
         const distributor = Script.getForm("devtemplate").TempDist;
         const model = Script.getForm("devtemplate").TempModels;
 
        
         // Start from index one to avoid including column headers
         for (var i = 1; i < dataLines.length; i++) {
             var row = dataLines[i].split(",");
             if (row.length > 1 && row[0] != "") {
                 // Ensure row is not blank
 
                 // Save to db
                 var dbRec = {};
                 dbRec.DeviceNumber = row[0];
                 dbRec.Sid = row[1];
                 dbRec.Location = row[2];

                 dbRec.LocationId = 0;
                 
                 dbRec.SiteId = 0;
                 dbRec.BranchId = 0;
                 dbRec.CompanyId = 0;
                 dbRec.CustomerId = 0;

                 dbRec.State = 0;
                 dbRec.Status = 0;
                 /*
                  var branchData;
                var customerData;
                var siteData;
                var locationData;
                var companyData;

                 */
                //var relativeId = 0;
                
                 for(var locationId in locationData.data) {

                    // find the location Id
                    if(locationData.data[locationId][2] == dbRec.Location) {
                        dbRec.LocationId = locationData.data[locationId][0];

                        //site Id =
                        dbRec.SiteId =  locationData.data[locationId][1];

                        // look for customer Id
                        for(var siteId in siteData.data) {

                            if(dbRec.SiteId in siteData.data) {
                                dbRec.CustomerId = siteData.data[siteId][3];
                                break;
                            }
                        }

                        for(var customerId in customerData.data) {

                            if(dbRec.CustomerId in customerData.data) {
                                dbRec.BranchId = customerData.data[customerId][3];
                                break;
                            }
                        }

                        for(var branchId in branchData.data) {

                            if(dbRec.BranchId in branchData.data) {
                                dbRec.CompanyId = branchData.data[branchId][3];
                                break;
                            }
                        }

                        // look for branch
                    }
                    
                 }
                 dbRec.Region = row[3];
                 dbRec.Model = row[4];
                 dbRec.BatchNumber = row[5];
                 
                 
                 dbRec.HWVersion = row[6];
                 dbRec.Status = 0;
                 console.log("Save device data..at row " + i + " is " + JSON.stringify(dbRec, null, 4));
                 
                // var newData = saveNewDevice(dbRec);
                var lastTransactionId = Database.readLastPrimaryKey("Rodent", "Devices", function (eventData) { });

                 //console.log("Saving new data " + JSON.stringify(newData, null, 4));
                 // var dbReq = {};
                 // dbReq[dbRec.serialnum] = dbRec;
				 //var k = Object.keys(newData);
				 var data = dbRec;
                 var dbReq =  {
                        "State": 0,
                        "Sid": data.Sid,
                        "DeviceNumber": data.DeviceNumber,
                        "LocationId": data.LocationId,
                        "SiteId": data.SiteId,
                        "CustomerId": data.CustomerId,
                        "BranchId": data.BranchId,
                        "CompanyId": data.CompanyId,
                        "CreatedOn": Math.round(new Date().getTime() / 1000),
                        "CreatedBy": Client.getUser(),
                        "Status": 0,
                        "Region": data.Region,
                        "Model": data.Model,
                        "ModelId": 1,
                        "ActivationStatus": 0,
                        "BatchNumber": data.BatchNumber,
                        "HWVersion": data.HWVersion
                    };

                  saveData(data);
				 
				
                 
                 Client.status(`Uploaded ${i}/${dataLines.length - 2}`, true);
             }
         }
         Client.status("Finshed Bulk Upload", true);
        
     };
     reader.readAsBinaryString(event.value);
     
 }



function saveData(data) {

    Database.readLastPrimaryKey("Rodent","Devices",function(eventData){

        var lastId = parseInt(eventData.value)+1;
        var dbVal = {};
        //DeviceData.NewEntry = lastId;
        dbVal[lastId] = {
            "Id": lastId,
            "DeviceNumber": data.DeviceNumber,
            "Sid":  data.Sid,
            "CreatedOn": Math.round(new Date().getTime() / 1000),
            "CreatedBy": fw.func("GETUSER"),
            
            "State": 1,
            "Status": 0,
            "CompanyId":data.CompanyId,
            "CustomerId":data.CustomerId,
            "BranchId": data.BranchId,
            "LocationId":data.LocationId,
            "SiteId":data.SiteId,
            "Owner": fw.func("GETUSER"),
            "DeviceType":1,
            "PacketType": "",
            "DeviceRange": "",
            "RebaitRange":"",
            "L1": "",
            "L2":"",
            "PState":"",
            "P1Weight":"",
            "P2Weight":"",
            "ActivationStatus": 1,
            "BaitEnalbed":"0",
            "Region": data.Region,
            "Model": data.Model,
            "ModelId": 1,
            "MotionCounters": 0,
            "BatchNumber": data.BatchNumber,
            "HWVersion": data.HWVersion
        };

        // Update a record's values, Fails if the record does not exist.
        Database.saveRecordParam("Rodent", "Devices", dbVal, function (dataEvent) {

            var status = {
                value: "Activation Status 1"
            };
    
           // fw.func("JUMPSCREEN", "Provisioning Step 5");
           //console.log("Success: " + JSON.stringify(dataEvent, null, 4));
           loadData(status);
           alert("Data saved Successfully");
        });
    });
    
}