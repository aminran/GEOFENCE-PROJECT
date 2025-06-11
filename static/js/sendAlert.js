document.addEventListener('DOMContentLoaded', function() {

    function showToastMessage(message) {
        toastr.options = {
          closeButton: true,
          positionClass: "toast-bottom-right",
          timeOut: 5000, // Time in milliseconds to auto-close the notification
        };

        toastr.success(message);
      }

    function callAjaxFunction() {
        // Create a new XMLHttpRequest object
        var xhr = new XMLHttpRequest();
        var add = document.getElementById("address").innerText;
        var dateTime = document.getElementById("local-datetime").innerText;
        // Configure the AJAX request
        var url = `/sendMail?address=${encodeURIComponent(add)}&dateTime=${encodeURIComponent(dateTime)}`;
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        // Handle the AJAX response
        xhr.onload = function() {

            var msg1 = xhr.response;

            // console.log(msg1);
            if (xhr.status >= 200 && xhr.status < 300) {
                // Request was successful, handle the response from Flask app
                if(msg1 == 'success'){
                    // Example usage:
                    console.log("Message Sent Successfully..");
                    showToastMessage("Target is outside \nthe Geofence.\nMail has been sent\nsuccessfully.");
                }
                else{
                    //window.alert("Error..\nCouldn't send message.");
                    console.log("Error: "+msg1);
                    // showToastMessage("Message Couldn't Sent Successfully.."+"Error: "+msg1);
                }

            } else {
                // Request was not successful, handle errors
                console.log("Error..");
                alert(xhr.responseText);
            }
        };

        // Send the AJAX request
        xhr.send();
        // intVal = 30000
    }

    var isOutside = false;
    var count = 0
    let intervalId;
    var checkOutside;

    // Function to run at regular intervals (e.g., every 1 second)
    function checkText() {
        // const text = getTextFromSomeSource(); // Replace this with your logic to get the text
        checkOutside =  document.getElementById('status').textContent.trim();
        console.log("status: ", checkOutside);

        // Check if the text is equal to "terminator"
        if (checkOutside === "Outside") {
            showToastMessage("Target has been tracked \noutside the Geofence.\nSending mail is in process..");
            clearInterval(intervalId); // Terminate the interval
        }
    }

    // Start the interval and store the interval ID in the 'intervalId' variable
    intervalId = setInterval(checkText, 1000); // Interval runs every 1 second (1000 milliseconds)


    //Interval2
    var intervalId2;
    function intervalCheck2(){
        if (document.getElementById('status').textContent.trim() === 'Outside' && !isOutside) {
            callAjaxFunction();
            if (count > 2) {
                isOutside = true;
            }
            count++;
        } else if (document.getElementById('status').textContent.trim() === 'Inside' && isOutside) {
            isOutside = false;
            count = 0
        }

    }

    intervalId2 = setInterval(intervalCheck2, 8000); // Interval runs every 1 second (1000 milliseconds)
})
