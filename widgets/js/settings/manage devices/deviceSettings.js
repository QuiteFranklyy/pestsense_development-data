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

var curentSelection;
var column = [
    "serialnum",
	"name",
	"application",
	"version",
	"lastserviced",
	"location",
	"groupname",
	"department",
	"branch",
	"status",
	"account",
	"owner",
	"notes",
	"lastseen",
	"iccid",
	"imei",
	"apn",
	"number",
	"lastvalue",
	"connections",
	"whenadded",
	"whoadded",
	"whenmodified",
	"whomodified",
	"whendisabled",
	"whodisabled",
	"whenenabled",
	"whoenabled",
	"long",
	"lat",
	"signal",
	"battery",
	"url",
	"imagename",
];

var devColumns = [
    "Device Number",
    "Serial ID",
    "Region",
    "Model",
    "Batch Number",
    "Hardware Version",
    "Location",
    "Activation Status",
    "Date Created",
    "Created By"
];
var lastNewId = 0;
 Script.on('load', function () {
 
     //var status = ["Status 0", "Status 1", "Status 2", "Status 3",  "Status 4"];
     //devDropDdown
    //Client.alert("from main live");
     ClientEvents.subscribe("newFile", processFile);
     ClientEvents.subscribe("selectStatus", (event)=> {

        loadData(event);
    
        
     });
	 console.log("len is " + column.length);
    Database.readLastPrimaryKey("Rodent","Devices",function(eventData){

        lastNewId = parseInt(eventData.value);
	});
     downloadDevData.subscribe("pressed", ()=>{
		 var formData =  Script.getFormByKey("master");
         var devices = formData.devices;
		
		 //console.log("Table data is " + JSON.stringify(Object.keys(devices.data).length, null, 4));
		 if(curentSelection != 1 || Object.keys(devices.data).length == 0) { // 1
			 return;
		 }
		 
		 var ids = devices.getColumn("id");
		 for (var i = 0; i < ids.length; i++) {
             deviceDataTable.deleteRows(ids[i]);
             let req = {};
             req[{"Id": ids[i], "UpdatedOn": Math.round(new Date().getTime() / 1000), "UpdatedBy": Client.getUser(),"ActivationStatus": 2}] = {"Id": ids[i], "UpdatedOn": Math.round(new Date().getTime() / 1000), "UpdatedBy": Client.getUser(),"ActivationStatus": 2};
             Database.updateRecord("rodent", "Devices", req);
             //Database.deleteRecord("rodent", "Products", "Id", ids[i]);
         }
		 sleep(3000);
        var data = {};
		var i = 0;
      
        for(var id in devices.data) {
             var value = [];
             
            
             
            value.push(devices.data[id][21]);
			value.push(devices.data[id][20]); 
			value.push(devices.data[id][93]); 
			value.push(devices.data[id][94]); 
			value.push(devices.data[id][95]); 
			value.push(devices.data[id][96]); 
			value.push(devices.data[id][10]); 
			value.push(devices.data[id][92]); 
			value.push(devices.data[id][40]); 
			 //value.push("Pestsense");
			value.push(devices.data[id][41]);
			
			
           
             data[formData.devices.data[id][21]] = value;
         }
         // new SensaCollection(this.columns, this.pk, { data: JSON.parse(JSON.stringify(this.data)) });
        // console.log("pressed the button " + JSON.stringify(data, null, 4));
         //var devSensaCollection = new SensaCollection(devColumns, devColumns[0], {data:JSON.parse(JSON.stringify(data))});
		 var devSensaCollection = new SensaCollection(devColumns, devColumns[0], {data:data});
		 //console.log("Table data is " + JSON.stringify(devSensaCollection, null, 4));
		 Script.downloadCSV("device_data.csv", devSensaCollection);
     });
     Database.readRecords("rodent", "Devices", (data) => {
         deviceData = SensaCollection.load(data.value);
 
         var status = {
             value: "Activation Status 0"
         };
		 //cuurentSelection = 0;
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


function devManufacturing(formData) {

	var data = {};
		 for(var id in formData.devices.data) {
        var value = [];
        
        i = 0;
        
        value.push(formData.devices.data[id][20]);
        value.push(formData.devices.data[id][21]); 
        value.push("Pestsense");
    
        for(; i < 6; i++) {
        
            value.push("");
        }
        value.push(1);
        value.push("unassigned");
        value.push("");
        value.push("");
        value.push(Math.round(new Date().getTime() / 1000));
        i = 0;
        for(; i < 5; i++) {
        
            value.push("");
        }
        value.push(0);
        value.push(Math.round(new Date().getTime() / 1000));
        value.push(fw.func("GETUSER"));
        for(; i < 13; i++) {
        
            value.push("");
        }
    
        data[formData.devices.data[id][20]] = value;
    }var i = 0;
      
    

}
const maxUnixtime = 2147483647;

function loadData(event) {

    Database.readRecords("rodent", "Devices", (data) => {
        deviceData = SensaCollection.load(data.value);
        updateTable(event);
    

    });
 }
 function updateTable(status) {
 
     //console.log("Data received is " + JSON.stringify(status, null, 4));
     var filteredStatus = status.value.split(" ")[2];
	 curentSelection = filteredStatus;
     
 
 
     filteredDev = deviceData.query((record, pk) => {
         return (record["Sid"] !== "" || record["DeviceNumber"]) !== "" && record["ActivationStatus"] == filteredStatus;
     });

     dowloadData = filteredDev.clone();
 
   
     filteredDev.renameColumn("BatchNumber", "Batch Number");
     filteredDev.renameColumn("DeviceNumber", "Device Number");
     filteredDev.renameColumn("CreatedOn", "Date Created");
     filteredDev.renameColumn("CreatedBy", "Created By");
     filteredDev.renameColumn("HWVersion", "Hardware Version");
     filteredDev.renameColumn("Sid", "Serial ID");
     filteredDev.renameColumn("ActivationStatus", "Activation Status");//Serial ID
 
     for (var data in filteredDev.data) {
         //console.log("Data at " + data + " val is " + filteredDev.data[data][23]);
 
         if (filteredDev.data[data][23] in locationData.data) {
             filteredDev.data[data][10] = locationData.data[filteredDev.data[data][23]]['2'];
             //console.log(`data present ${filteredDev.data[data][23]}`);
 
         }
       
         var createdOn = filteredDev.data[data][40];
 
         //console.log("Created " + createdOn + " updated " + updateOn)
         if (!isNaN(createdOn) && createdOn !== null && createdOn !== "") {
             var date = parseInt(createdOn);
             //console.log("find created " + createdOn + " max " + maxUnixtime);
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
     //console.log("New data is " + d0);
     return d0 + " " + d[1].substring(0, 5);
 }
 
 function processFile(event) {
     //console.log("start uploading");
     if(event.value === "Invalid Input") {
         return;
     }
     var reader = new FileReader();
     //console.log("Files uploaded is " + JSON.stringify(event));
     //reader.readAsBinaryString(event.value);
     reader.onload = function (event) {
         // output results
         //console.log("Files uploaded is 2 " + JSON.stringify(event));
         
         var dataLines = reader.result.split('\r'); ///\r\n|\n/
         const distributor = Script.getForm("devtemplate").TempDist;
         const model = Script.getForm("devtemplate").TempModels;
 
		 //debugger;
        
         // Start from index one to avoid including column headers
         for (var i = 1; i < dataLines.length; i++) {
             var row = dataLines[i].split(",");
             if (row.length > 1 && row[0] != "") {
                 // Ensure row is not blank
 
                 // Save to db
                 var dbRec = {};
                 dbRec.DeviceNumber = row[0].trim();
                 dbRec.Region = row[1].trim();
                 dbRec.Model = row[2].trim();
                 dbRec.BatchNumber = row[3].trim();
                 
                 
                 dbRec.HWVersion = row[4].trim();
                 dbRec.Location = row[5].trim();
                 dbRec.Status = 0;
            
        
                 dbRec.LocationId = 0;
                 
                 dbRec.SiteId = 0;
                 dbRec.BranchId = 0;
                 dbRec.CompanyId = 0;
                 dbRec.CustomerId = 0;

                 dbRec.State = 0;
                 dbRec.Status = 0;
             
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
                 
                 //console.log("Save device data..at row " + i + " is " + JSON.stringify(dbRec, null, 4));
                 
				 if(dbRec.DeviceNumber.trim().length > 4) {
				 
					 saveDevData(dbRec);
				 }
				 
				 // console.log("Savenow saved " + i ); 
				 //debugger;
				
                 
                 Client.status(`Uploaded ${i}/${dataLines.length - 2}`, true);
             }
         }
         //Client.status("Finshed Bulk Upload", true);
		 var status = {
                value: "Activation Status 0"
            };
    
           // fw.func("JUMPSCREEN", "Provisioning Step 5");
           //console.log("Success: " + JSON.stringify(dataEvent, null, 4));
           loadData(status);
		   ClientEvents.publish("newVal", "Activation Status 0", false);
           Client.alert("Data saved Successfully");
        
     };
     reader.readAsBinaryString(event.value);
     
 }

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function saveDevData(data) {
  
	sleep(1000);
	saveData(data);
}

function saveData(data) {
	
        var dbVal = {};
	
		 // we have to make sure that we are not overriding the data at 0
		if(lastNewId == 0) {
			return;
		}
		lastNewId = lastNewId + 1;
        //DeviceData.NewEntry = lastId;
		console.log("primary key is " + lastNewId);
        dbVal[lastNewId] = {
            "Id": lastNewId,
            "DeviceNumber": data.DeviceNumber,
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
            "ActivationStatus": 0,
            "BaitEnalbed":"0",
            "Region": data.Region,
            "Model": data.Model,
            "ModelId": 1,
            "MotionCounters": 0,
            "BatchNumber": data.BatchNumber,
            "HWVersion": data.HWVersion
        };

        // Update a record's values, Fails if the record does not exist.
        Database.saveRecordParam("Rodent", "Devices", dbVal); //, function (dataEvent) {
			
        //});
    //});
    
}