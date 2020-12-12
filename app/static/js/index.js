//$( document ).ready (function() {
//  PAGE LOAD ROUTINES
// Declare global variables)

// clientLocation, staffID will be set in localStorage within login routine
var curCoordinatorID = 'All' //UPDATED FROM COORDINATOR SELECTION
var clientLocation = ''  // Client location indicates where the computer (device) is operating or is being used on behalf of the location (RA/BW)
var todaysDate = new Date();
var shopNames = ['Rolling Acres', 'Brownwood']


// UPDATED ON LOAD AND SHOP CHANGE
var curShopNumber = ''
var curShopName = ''

//UPDATED FROM WEEK CHANGE ROUTINE
var curWeekDate = '' 
var curWeekDisplayDate = '' 
var curCoordinatorName = '' 
var curCoordinatorEmail = ''
var curCoordinatorPhone = ''
//var curManagersEmail = ''

// UPDATED FROM SEND TO SELECTION OF 'COORDINATOR AND MONITORS'
var curMonitorsEmailAddresses = []
var curMonitorsNames = []


// SET INITIAL PAGE VALUES
// SESSION STORAGE VARIABLES (Note - as global variable are erased on page load they need to be set to the last used values)
if (!sessionStorage.getItem('curWeekDate')) {
    sessionStorage.setItem('curWeekDate','')
    curWeekDate = ''
}
else {
    curWeekDate = sessionStorage.getItem('curWeekDate')
}
if (!sessionStorage.getItem('curShopNumber')) {
    sessionStorage.setItem('curShopNumber','')
    curShopNumber = ''
}
else {
    curShopNumber = sessionStorage.getItem('curShopNumber')
}
if (!sessionStorage.getItem('curCoordinatorID')) {
    sessionStorage.setItem('curCoordinatorID','All')
    curCoordinatorID = 'All'
}
else {
    curCoordinatorID = sessionStorage.getItem('curCoordinatorID')
}

// SET BACKGROUND TO OPAQUE FOR EMAIL SECTION
if (!sessionStorage.getItem('processingEmail') ){
    sessionStorage.setItem('processingEmail','FALSE')
}
if (sessionStorage.getItem('processingEmail') == 'FALSE') {
    hideEmailForm()
}
else {
    showEmailForm()
}



// DEFINE EVENT LISTENERS
document.getElementById("weekSelected").addEventListener("change", weekChanged);
document.getElementById("weekSelected").addEventListener("click", weekChanged);
document.getElementById("shopChoice").addEventListener("change", shopChanged);
document.getElementById("coordChoice").addEventListener("change", coordinatorChanged);
document.getElementById("selectpicker").addEventListener("change",memberSelectedRtn)
// document.getElementById("sendEmail").addEventListener("click",showEmailSections)
document.getElementById("eMailReportBtn").addEventListener("click",function(){prepareAttachments();},false);

// GET STAFFID THAT WAS STORED BY THE LOGIN ROUTINE
if (!localStorage.getItem('staffID')) {
    staffID = prompt("Staff ID - ")
    localStorage.setItem('staffID',staffID)
}
else {
    staffID = localStorage.getItem('staffID')
}



// GET clientLocation THAT WAS STORED BY THE LOGIN ROUTINE
if (!localStorage.getItem('clientLocation')) {
    alert("local storage for 'clientLocation' is missing; RA assumed.")
    localStorage.setItem('clientLocation','RA')
}
clientLocation = localStorage.getItem('clientLocation')

// IS THIS THE INITIAL PAGE LOAD?
// IF THERE IS NO SESSION VARIABLE FOR 'weekSelected' THEN THIS MUST BE THE FIRST PAGE LOAD.
// AND THE PRINT BUTTONS AND ATTACHMENT CHOICES SHOULD BE HIDDEN.
// 
if (sessionStorage.getItem('weekSelected')) {
    // REDIRECTS, NOT INITIAL PAGE LOAD SETTINGS
    // Restore variables
    curWeekDate = sessionStorage.getItem('weekSelected')
    curCoordinatorID = sessionStorage.getItem('coordID')
    curCoordinatorName = sessionStorage.getItem('coordName')
    curCoordinatorEmail = sessionStorage.getItem('coordEmail')
    curCoordinatorPhone = sessionStorage.getItem('coordPhone')
    //curManagersEmail = sessionStorage.getItem('coordManagersEmail')
    curWeekDisplayDate = sessionStorage.getItem('curWeekDisplayDate')
    
    // Restore drop down list indexes
    document.getElementById('coordChoice').selectedIndex=sessionStorage.getItem('coordIndex')
    document.getElementById('weekSelected').selectedIndex = sessionStorage.getItem('weekIndex')
    
    //curCoordinatorID = document.getElementById('coordChoice').value
   
    buildCoordinatorLine()
     
}
else {
    // INITIAL PAGE LOAD SETTINGS
    document.getElementById('coordChoice').selectedIndex=0
    document.getElementById('weekSelected').selectedIndex=0
    hidePrintReports()
    hideAttachmentChoices()
    hideEmailForm()
}

// SET DROP DOWN MENU INITIAL VALUES
setShopFilter(clientLocation)

// END PAGE LOAD ROUTINES



// BEGIN FUNCTIONS

// PRINT THE MONITOR DUTY WEEKLY SCHEDULE
$('#printMonitorScheduleID').click(function(){
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    }
    window.location.href = '/printWeeklyMonitorSchedule?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PRINT' 
})

$('#printMonitorNotesID').click(function(){
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    }
    window.location.href = '/printWeeklyMonitorNotes?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PRINT' 
})

$('#printMonitorContactsID').click(function(){
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    }
    window.location.href = '/printWeeklyMonitorContacts?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PRINT' 
})

$('#printMonitorSubListID').click(function(){
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    }
    window.location.href = '/printSubList?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PRINT' 
})

$('#printTrainingNeededID').click(function(){
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    }
    window.location.href = '/printMonitorsNeedingTraining?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PRINT' 
})

$('#printTrainingClassID').click(function(){
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    }
    window.location.href = '/printTrainingClass?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PRINT' 
})


$('#printMonitorSchedule2').click(function(){
    alert('begin printMonitorSchedule function ...')
    
    $.ajax({
        url : "/printWeeklyMonitorSchedule",
        type: "GET",
        data : {
            date: curWeekDate,
            shop: curShopNumber,
            destination: 'PRINT'},
        success: function(data, textStatus, jqXHR)
        {
            alert(data)

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('ERROR from printMonitorSchedule')
        }
    });    
})

// function MonitorsNeedingTraining() {
//     alert('printMonitorsNeedingTraining')
//     curWeekDate = document.getElementById('weekSelected').value
//     if (curWeekDate == ''){
//         alert("Please select a date.")
//         return 
//     }
//     window.location.href = '/printMonitorsNeedingTraining?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PRINT' 
// }

// THE FOLLOWING ROUTINE RETRIEVES THE MESSAGE THAT IS TO BE INSERTED INTO A 'COORDINATORS ONLY' EMAIL
$('#coordinatorOnlyID').click(function(){
    // THE FOLLOWING LINE IS TEMPORARY;  THE VARIABLE curWeekDate IS BEING RESET BECAUSE AFTER THE THE WINDOW.PRINT COMMAND THE PAGE IS RELOADED
    curWeekDate = document.getElementById('weekSelected').value
    
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    }
    clearEmailData()

    // INSERT RECIPIENT
    document.getElementById('eMailRecipientID').value = curCoordinatorEmail
            
    // BUILD SUBJECT LINE
    subject = "Monitor Duty for Week Of " + curWeekDisplayDate + " at " + curShopName
    document.getElementById('eMailSubjectID').value=subject 


    // GET TEXT TO BE USED IN MESSAGE
    $.ajax({
        url : "/eMailCoordinator",
        type: "GET",
        data : {
            weekOf: curWeekDate,
            shopNumber: curShopNumber},
        success: function(data, textStatus, jqXHR)
        {
            
            // BUILD MESSAGE, INCLUDING TEXT RETRIEVED FROM EMAIL MESSAGE TABLE
            message = "DO NOT SEND EMAILS REGARDING MONITOR DUTY TO THE WORKSHOP.\n\n"
            message += "CALL OR EMAIL ACCORDING TO THE INSTRUCTIONS BELOW.\n"
            message += "THIS SCHEDULE IS FOR THE " + curShopName.toUpperCase() + " LOCATION\n\n"
            message += "Please remember to contact your coordinator, " + curCoordinatorName + ", if you make any changes or have questions.\n"
            message += "My phone number is " + curCoordinatorPhone + " and my Email is " + curCoordinatorEmail + "."
            message += '\n' + data.eMailMsg
            document.getElementById('eMailMsgID').value=message 

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('ERROR from eMailCoordinator\ntextStatus - '+ textStatus + '\nerrorThrown - '+errorThrown)
        }
    });
})

$('#coordinatorAndMonitorsID').click(function(){
    // THE FOLLOWING LINE IS TEMPORARY;  THE VARIABLE curWeekDate IS BEING RESET BECAUSE AFTER THE THE WINDOW.PRINT COMMAND THE PAGE IS RELOADED
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == ''){
        alert("Please select a date.")
        return 
    } 

    clearEmailData()
    $.ajax({
        url : "/eMailCoordinatorAndMonitors",
        type: "GET",
        data : {
            weekOf: curWeekDate,
            shopNumber: curShopNumber},
        success: function(data, textStatus, jqXHR)
        {
            // COPY LIST OF MONITORS TO GLOBAL VARIABLE
            curMonitorsEmailAddresses = data.monitorDict

            // INSERT COORDINATOR'S EMAIL INTO 'TO' LINE
            document.getElementById('eMailRecipientID').value = curCoordinatorEmail
            

            // BUILD SUBJECT LINE
            subject = "Monitor Duty for Week Of " + curWeekDisplayDate + " at " + curShopName
            document.getElementById('eMailSubjectID').value=subject 

            // BUILD MESSAGE
            message = "CALL OR EMAIL ACCORDING TO THE INSTRUCTIONS BELOW.\n"
            message += "Coordinators: Please copy the email addresses below into the 'To... ' field of your email.  "
            message += "Then delete them from the text below and send the email out.\n"

            // APPEND MONITOR EMAIL ADDRESSES TO END OF MESSAGE (COORDINATORS WILL COPY THEN PASTE INTO A NEW EMAIL)
            for (i=0; i < curMonitorsEmailAddresses.length; i++) {
                message += curMonitorsEmailAddresses[i]['eMail'] + ';'
            }

            // APPEND REST OF MSG TO 'MESSAGE'
            message += "\n\nDO NOT SEND EMAILS REGARDING MONITOR DUTY TO THE WORKSHOP.\n\n"
            message += "CALL OR EMAIL ACCORDING TO THE INSTRUCTIONS BELOW"
            message += "THIS SCHEDULE IS FOR THE " + curShopName.toUpperCase() + " LOCATION\n\n"
            message += "Please remember to contact your coordinator, " + curCoordinatorName + ", if you make any changes or have questions.\n"
            message += "My phone number is " + curCoordinatorPhone + " and my Email is " + curCoordinatorEmail + "."
            message += '\n' + data.eMailMsg + '\n'
            // COPY 'MESSAGE' TO FORM
            document.getElementById('eMailMsgID').value=message 

        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('ERROR from eMailCoordinatorAndMonitors\n'+textStatus+'\n' + errorThrown)
        }
    });
})
    
// RESPOND TO CLICK OF ONE OF THE EMAIL BUTTONS
// SET ACTIVE BUTTON; EXECUTE 'SEND', 'SAVE', OR 'CLEAR' FUNCTION
// DEPENDING ON WHICH BUTTON WAS CLICKED
$('.eMailBtn').click(function() {
    
    // REMOVE 'ACTIVE' FROM BUTTONS
    $('button.eMailBtn.active').removeClass('active');
    
    // ADD ACTIVE TO BUTTON JUST CLICKED
    $(this).addClass('active');

    // CALL APPROPRIATE FUNCTION
    if (this.id == 'sendBtn') {
        sendEmail()
    }
    if (this.id == 'clearBtn') {
        clearEmailData()
    }
})


// CLEAR THE EMAIL FORM OF DATA
function clearEmailData() {
    curMonitorEmailAddresses = []
    document.getElementById('eMailRecipientID').value = ''
    document.getElementById('eMailSubjectID').value=''
    document.getElementById('eMailMsgID').value=''
}
// PREPARE PDF FILES FOR ATTACHMENT TO EMAIL
function prepareAttachments(destination) {
    // TURN ON SPINNER IN BUTTON
    document.getElementById("spinnerElement").style.display='block'

    // THE FOLLOWING LINE IS TEMPORARY;  THE VARIABLE curWeekDate IS BEING RESET BECAUSE AFTER THE THE WINDOW.PRINT COMMAND THE PAGE IS RELOADED
    curWeekDate = document.getElementById('weekSelected').value
    if (curWeekDate == '') {
        if (sessionStorage.getItem('curWeekDate')) {
            curWeekDate = sessionStorage.getItem('curWeekDate')
        }
        else {
            alert("Please select a week date.")
        }
        return
    }
    // SET FLAG TO INDICATE THAT THEIR IS AN EMAIL IN PROCESS; OTHERWISE PAGE LOAD WOULD HIDE THE EMAIL SECTIONS
    sessionStorage.setItem('processingEmail','TRUE')

    // FILL EMAIL FIELDS
    //shopInitials = document.getElementById('shopChoice').value
    // if (shopInitials == '') {
    //     alert("Please select a location.")
    //     return
    // }
    // if (shopInitials == 'RA') {
    //     curShopNumber = '1'
    // }
    // else {
    //     curShopNumber = '2'
    // }
    sessionStorage.setItem('curShopNumber',curShopNumber)
    
    // CREATE MONITOR SCHEDULE REPORT PDF
    if (document.getElementById('scheduleID').checked) {
        console.log('schedule checked')
        window.location.href = '/printWeeklyMonitorSchedule?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PDF' 
    }
    // CREATE MONITOR NOTES PDF
    if (document.getElementById('notesID').checked) {
        window.location.href = '/printWeeklyMonitorNotes?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PDF' 
    }
    // CREATE MONITOR CONTACTS PDF
    if (document.getElementById('contactsID').checked) {
        window.location.href = '/printWeeklyMonitorContacts?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PDF' 
    }
    // CREATE SUB LIST PDF
    if (document.getElementById('subListID').checked) {
        window.location.href = '/printSubList?date=' + curWeekDate + '&shop=' + curShopNumber + '&destination=PDF' 
    }

    showEmailForm()

    // TURN OFF SPINNER  (may need timer or other logic to detect when PDF's have been created)
    document.getElementById("spinnerElement").style.display='none'
}


function shopChanged() {
    setShopFilter(this.value)
    filterTheWeeksShown()
}

function setShopFilter(shopLocation) {
    switch(shopLocation){
        case 'RA':
            localStorage.setItem('shopFilter','RA')
            document.getElementById("shopChoice").selectedIndex = 0; //optItemion Rolling Acres
            shopFilter = 'RA'
            curShopNumber = '1'
            curShopName = shopNames[0]
            break;
        case 'BW':
            localStorage.setItem('shopFilter','BW')
            document.getElementById("shopChoice").selectedIndex = 1; //optItemion Brownwood
            shopFilter = 'BW'
            curShopNumber = '2'
            curShopName = shopNames[1]
            break;
        default:
            alert('Missing local storage variable for shop location; RA assumed')
            localStorage.setItem('shopFilter','RA')
            document.getElementById("shopChoice").selectedIndex = 0; //optItemion Rolling Acres
            shopFilter = 'RA'
            curShopNumber = '1'
            curShopName = shopNames[0]
    } 
}


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    yyyymmdd = year + month + day
    return yyyymmdd;
}

 // FILTER WEEKS DROPDOWN ON SHOPNUMBER AND COORDINATOR ID
function filterTheWeeksShown() {
    var weeks = document.querySelectorAll('.optWeeks')
    for (i=0; i < weeks.length; i++) {
        thisWeeksCoordID = weeks[i].getAttribute('data-coordID')
        shop = weeks[i].getAttribute('data-shop')
        if ((shop == curShopNumber && curCoordinatorID == 'All')
        || (shop == curShopNumber && thisWeeksCoordID == curCoordinatorID)){
            weeks[i].style.display = ''
        }
        else {
            weeks[i].style.display = 'none'
            continue
        }
    }
    document.getElementById('weekSelected').selectedIndex = 0
}
  
function weekChanged () {
    console.log('... begin weekChanged routine ')
    // DID THE USER CLICK ON 'Select a date ... '?
    if (this.selectedIndex == 0) {
        return
    }
    // SAVE SELECTED OPTION INDEX TO BE USED DURING PAGE LOAD
    sessionStorage.setItem('weekIndex',this.selectedIndex)
    sessionStorage.setItem('weekSelected',this.value)
    curWeekDate = this.value
    sessionStorage.setItem('curWeekDate',this.value)

    // HIDE EMAIL FORM
    sessionStorage.setItem('processingEmail','FALSE')
    hideEmailForm()
    showPrintReports()
    showAttachmentChoices()

    // CLEAR REPORTS CHECKED
    document.getElementById('scheduleID').checked = false

    // RETRIEVE COORDINATOR INFORMATION FROM SERVER
    $.ajax({
        url : "/getCoordinatorData",
        type: "GET",
        data : {
            weekOf: curWeekDate,
            shopNumber: curShopNumber},
        success: function(data, textStatus, jqXHR)
        {
            console.log('... return from getCoordinatorData ')
            curCoordinatorID = data.coordID 
            curCoordinatorName = data.coordName
            curCoordinatorEmail = data.coordEmail
            curCoordinatorPhone = data.coordPhone
            //curManagersEmail = data.curManagersEmail
            curWeekDisplayDate = data.curWeekDisplayDate
            sessionStorage.setItem('coordID',data.coordID)
            sessionStorage.setItem('coordName',data.coordName)
            sessionStorage.setItem('coordEmail',data.coordEmail)
            sessionStorage.setItem('coordPhone',data.coordPhone)
            //sessionStorage.setItem('coordManagersEmail',data.coordManagersEmail)
            sessionStorage.setItem('curWeekDisplayDate',data.curWeekDisplayDate)
            

            // BUILD MESSAGE FOR coordinatorInfoID
            buildCoordinatorLine()
            // if (curCoordinatorID != '') {
            //     document.getElementById('coordHdgBeforeDate').innerHTML = "The coordinator for the week of " 
            //     document.getElementById('coordHdgDate').innerHTML = curWeekDisplayDate 
            //     document.getElementById('coordHdgBeforeName').innerHTML = ' is ' 
            //     document.getElementById('coordHdgName').innerHTML = curCoordinatorName 
            //     document.getElementById('coordHdgBeforePhone').innerHTML = ' and may be contacted at '
            //     document.getElementById('coordHdgPhone').innerHTML = curCoordinatorPhone 
            //     document.getElementById('coordHdgBeforeEmail').innerHTML = ' or by email at '
            //     document.getElementById('coordHdgEmailLink').href = 'mailto:' + curCoordinatorEmail
            //     document.getElementById('coordHdgEmailLink').innerHTML = curCoordinatorEmail
            // }
            // else {
            //     document.getElementById('coordHdgBeforeDate').innerHTML = "A coordinator has not been assigned for this week."
            //     document.getElementById('coordHdgDate').innerHTML = ''
            //     document.getElementById('coordHdgBeforeName').innerHTML = '' 
            //     document.getElementById('coordHdgName').innerHTML = ''
            //     document.getElementById('coordHdgBeforePhone').innerHTML = ''
            //     document.getElementById('coordHdgPhone').innerHTML = ''
            //     document.getElementById('coordHdgBeforeEmail').innerHTML = ''
            //     document.getElementById('coordHdgEmailLink').href = '#'
            //     document.getElementById('coordHdgEmailLink').innerHTML = ''
            // }
            //console.log('curShopNumber - ' + curShopNumber)

            // SET UP LINKS FOR PRINT SCHEDULE BUTTON
            // prtSchedule = document.getElementById("printMonitorScheduleID")
            // address = "/printWeeklyMonitorSchedule?date="+ curWeekDate + "&shop=" + curShopNumber + "&destination=" + 'PRINT'
            // lnk = "window.location.href='" + address +"'"
            // prtSchedule.setAttribute("onclick",lnk)

            // SET UP LINKS FOR PRINT NOTES BUTTON
            // prtNotes = document.getElementById("printMonitorNotesID")
            // address = "/printWeeklyMonitorNotes?date="+ curWeekDate + "&shop=" + curShopNumber + "&destination=" + 'PRINT'
            // lnk = "window.location.href='" + address +"'"
            // prtNotes.setAttribute("onclick",lnk)

            // SET UP LINKS FOR PRINT CONTACTS BUTTON
            // prtContacts = document.getElementById("printMonitorContactsID")
            // address = "/printWeeklyMonitorContacts?date="+ curWeekDate + "&shop=" + curShopNumber + "&destination=" + 'PRINT'
            // lnk = "window.location.href='" + address +"'"
            // prtContacts.setAttribute("onclick",lnk)

            // SET UP LINKS FOR PRINT SUB LIST BUTTON
            // prtSubList = document.getElementById("printMonitorSubListID")
            // address = "/printSubList?date="+ curWeekDate + "&shop=" + curShopNumber + "&destination=" + 'PRINT'
            // lnk = "window.location.href='" + address +"'"
            // prtSubList.setAttribute("onclick",lnk)

            
            showPrintReports()
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert('ERROR from getCoordinatorData\n textStatus -' + textStatus + '\n errorThrown - ' + errorThrown)
        }
        
    });
    }

    function coordinatorChanged () {
        curCoordinatorID = this.value
        sessionStorage.setItem('coordIndex',this.selectedIndex)
        filterTheWeeksShown()
    }

    function memberSelectedRtn() {
        if (curWeekDate == ''){
            alert("Please select a date.")
            return 
        } 
        selectedMember = this.value
        lastEight = selectedMember.slice(-8)
        curMemberID= lastEight.slice(1,7)

        // REQUEST MEMBER's EMAIL ADDRESS FROM SERVER
        $.ajax({
            url : "/getMembersEmailAddress",
            type: "GET",
            data : {memberID: curMemberID,
                    weekOf: curWeekDate,
                    shopNumber: curShopNumber},

            success: function(data, textStatus, jqXHR)
            { 
                clearEmailData() 
                // INSERT RECIPIENT EMAIL ADDRESS
                document.getElementById('eMailRecipientID').value = data.eMail

                // BUILD SUBJECT LINE
                subject = "Monitor Duty for Week Of " + curWeekDisplayDate + " at " + curShopName
                document.getElementById('eMailSubjectID').value=subject 

                // BUILD MESSAGE
                message = data.eMailMsg
                document.getElementById('eMailMsgID').value=message 

            },
            
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('ERROR from getMembersEmailAddress\ntextStatus - ' + textStatus + '\nerrorThrown - ' + errorThrown)
            }
        })
    }


    function sendEmail() {
        // attachments = []
        
        // if (document.getElementById('scheduleID').checked)
        //     attachments.push('SCHEDULE')    
        // if (document.getElementById('notesID').checked)
        //     attachments.push('NOTES')
        // if (document.getElementById('contactsID').checked)
        //     attachments.push('CONTACTS')
        // if (document.getElementById('subListID').checked)
        //     attachments.push('SUBLIST')
        // alert('attachments selected - ' + attachments)
        $.ajax({
            url : "/sendEmail",
            type: "GET",
            data : {
                recipient:document.getElementById('eMailRecipientID').value,
                subject:document.getElementById('eMailSubjectID').value,
                message:document.getElementById('eMailMsgID').value
            },
            success: function(data, textStatus, jqXHR)
            {
                // add code to erase current PDF's
                //  add code to produce PDF's for attachments /or/ just send names of docs to be attached
                alert('SUCCESS')
                return
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('ERROR from eMailCoordinator\ntextStatus - '+textStatus+'\nerrorThrown - '+errorThrown)
            }
        });
    }
    

function showEmailForm() {
    document.getElementById('emailBody').style.opacity=1;
    document.getElementById('sendToOptions').style.opacity=1;
    document.getElementById('emailButtons').style.opacity=1;
}

function hideEmailForm() {
    document.getElementById('emailBody').style.opacity=.2;
    document.getElementById('sendToOptions').style.opacity=.2;
    document.getElementById('emailButtons').style.opacity=.2;
}

function showPrintReports() {
    console.log('showing print reports section')
    document.getElementById('printReportBtns').style.opacity=1;
    document.getElementById('printMonitorScheduleID').style.opacity=1;
    document.getElementById('printMonitorNotesID').style.opacity=1;
    document.getElementById('printMonitorContactsID').style.opacity=1;
    document.getElementById('printMonitorSubListID').style.opacity=1;
}
function hidePrintReports() {
    document.getElementById('printReportBtns').style.opacity=.2;
    document.getElementById('printMonitorScheduleID').style.opacity=.2;
    document.getElementById('printMonitorNotesID').style.opacity=.2;
    document.getElementById('printMonitorContactsID').style.opacity=.2;
    document.getElementById('printMonitorSubListID').style.opacity=.2;
}
function showAttachmentChoices() {
    document.getElementById('attachmentCheckboxes').style.opacity=1;
}
function hideAttachmentChoices() {
    document.getElementById('attachmentCheckboxes').style.opacity=.2;
}

function buildCoordinatorLine() {
    // BUILD MESSAGE FOR coordinatorInfoID
    console.log('curCoordinatorID at buildCoordinatorLine - '+ curCoordinatorID)
    if (curCoordinatorID != '') {

        document.getElementById('coordHdgBeforeDate').innerHTML = "The coordinator for the week of " 
        document.getElementById('coordHdgDate').innerHTML = curWeekDisplayDate 
        document.getElementById('coordHdgBeforeName').innerHTML = ' is ' 
        document.getElementById('coordHdgName').innerHTML = curCoordinatorName 
        document.getElementById('coordHdgBeforePhone').innerHTML = ' and may be contacted at '
        document.getElementById('coordHdgPhone').innerHTML = curCoordinatorPhone 
        document.getElementById('coordHdgBeforeEmail').innerHTML = ' or by email at '
        document.getElementById('coordHdgEmailLink').href = 'mailto:' + curCoordinatorEmail
        document.getElementById('coordHdgEmailLink').innerHTML = curCoordinatorEmail
    }
    else {
        document.getElementById('coordHdgBeforeDate').innerHTML = "A coordinator has not been assigned for this week."
        document.getElementById('coordHdgDate').innerHTML = ''
        document.getElementById('coordHdgBeforeName').innerHTML = '' 
        document.getElementById('coordHdgName').innerHTML = ''
        document.getElementById('coordHdgBeforePhone').innerHTML = ''
        document.getElementById('coordHdgPhone').innerHTML = ''
        document.getElementById('coordHdgBeforeEmail').innerHTML = ''
        document.getElementById('coordHdgEmailLink').href = '#'
        document.getElementById('coordHdgEmailLink').innerHTML = ''
    }
    
}
// END OF FUNCTIONS
