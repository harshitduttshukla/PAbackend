import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // ✅ Load from .env



export async function sendEmail(req, res) {
    try {
        const {
            guestemail,
            subject,
            apartmentname,
            contactperson,
            contactnumber,
            guestname,
            contactnumberguest,
            checkin,
            checkout,
            chargeabledays,
            occupancy,
            amount,
            modeofpayment,
            guesttype,
            roomtype,
            inclusions,
            reservationNo,
            created_at,
            host_email,
            clientName,
            address1,
            address2,
            address3,
        } = req.body;

        // Convert guestemail -> array
        const emailList = guestemail
            .split(",")
            .map(e => e.trim())
            .filter(e => e);


    const date = new Date(created_at)
    const formatted = date.toISOString().split("T")[0]

    const GUEST_TEMPLATE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>


    <tbody>
 <tr>
 <td width="100%">
 <table width="100%" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody><tr>
 <td align="left" bgcolor="#ffffff" width="40%">
 <a>
 <img width="120" border="0" alt="" style="display:block;border:none;outline:none;text-decoration:none" src="https://ci3.googleusercontent.com/meips/ADKq_NYKoMISuvorFIpkwyNeleh158If7bBLNRWg1Ad_3zcs0sq0ivLeKz6svCPsRAdZvz3cXQ65U1--NOMCpIoKot9DPz6V7JAtvgsxKwJ8OFa2IRjJ2lgYhFKs4A=s0-d-e1-ft#https://www.pajasaapartments.com/wp-content/uploads/2019/08/logo.png" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a>
 </td>
 <td width="45%" valign="middle" align="right">
 <p style="font:bold 12px tahoma;color:#333333;margin:0;padding-bottom:5px">Booked on: <span style="font-size:12px tahoma;color:#858585;margin:0;padding-bottom:5px">${formatted}</span></p>
 <p style="font:bold 12px tahoma;color:#333333;margin:0;padding-bottom:5px">Reservation No.: <span style="color:#f59f0d;font-weight:bold;font-size:12px tahoma">${reservationNo}</span>
 </p></td></tr></tbody></table></td></tr>
 </tbody>



    <tbody><tr><td><hr>


 


 <table width="630" cellpadding="0" cellspacing="0" border="0" align="center" style="background:#ffffff;margin:0 auto">
 <tbody>
 <tr>
 <td width="100%" style="padding:20px">
 <table width="100%" align="left" cellpadding="0" cellspacing="0" border="0">
 <tbody>
 <tr>
 <td>
 <h1 style="font-family:tahoma;font-size:35px;color:#333333;text-align:left;line-height:1.3">
 Booking Confirmed 
 
 </h1>
 <p style="font:bold 12px tahoma;color:#333333;margin:0;padding-bottom:5px">Hi, <br><br>Thank you for choosing this Apartment</p><br>
 <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
 
 We are happy to confirm booking with following details :</p>
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 
 <tbody><tr><td style="padding:0 30px" width="100%">
 <table cellpadding="0" cellspacing="0" border="0" width="100%">
 <tbody><tr>
 <td width="100%" style="padding:0px 0">
									
									 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0" id="m_-127422732672041899m_-4314589597065577272">
 <tbody><tr>
 <td width="100%" align="left" style="padding:5px;color:#858585">
 <p style="color:#3b7dc0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:20px;margin-top:0;margin-bottom:5px;font-weight:normal"><a style="color:#f59f0d;font-weight:bold">Apartment Address</a>
 </p>
 <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">${address1},${address2}, <br>${address3}</p><p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">Contact Person: ${contactperson} </p>
 <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">Contact Number: <a style="color:#858585"> 								 
 </a><a href="tel:%207669990203" target="_blank"> <span style="font-family:tahoma;font-size:14px;color:#858585">NA</span></a>
								 </p> </td></tr></tbody>
 </table>
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody><tr>
 <td width="100%" align="left" style="padding:5px 20px 5px 0">
 

 <a href="https://www.pajasaapartments.com/?p=8825" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.com/?p%3D8825&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw1gIXtdl-yTOJ_HhrsP_LEN">
 <img id="m_-127422732672041899m_-4314589597065577272abc" src="https://ci3.googleusercontent.com/meips/ADKq_Nan-x-C5r-OHd8YR-3NqovJfgaFO0gQmT4ULFq13R2wS5p2jEI08z4Ko_ATD0PUvdQar4Yf-0NIp0XMGZpEnRCxluu1XfVjAq4nYbyjYUVZ1zhJD2TDthP8ChOck3aKWHoOA3qVF9Uo_HEjefi_XkXBu-LRR0TFY8vRVZRnWp1kia87ZNe1A4g4HdD2Ah8phfTaPVSCK7om=s0-d-e1-ft#https://www.pajasaapartments.com/wp-content/uploads/2019/04/3-BHK-Service-Apartment-in-Kanjurmarg-west-in-Mumbai-living-room1.jpg" width="260" alt="Service Apartment" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a> </td></tr>
 </tbody></table>
 
 
 </td></tr>
 </tbody></table>
 </td>
 





 </tr><tr>
 <td style="padding:0 30px" width="100%">
 <table cellpadding="0" cellspacing="0" border="0" width="100%">
 <tbody><tr>
 <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody><tr>
 <td width="270" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tbody>
 <tr><td width="45%">
 <img style="float:left;padding-right:10px" src="https://ci3.googleusercontent.com/meips/ADKq_NbRo2H3Om_l08yyqDfKMG-HDwxSimiG6UhMkLlaa6e4Uck3degXgdbVVBncdRlOkf-t2KieZgzx326aKca1lVijDqLD7rMiLKYT2CQ=s0-d-e1-ft#http://gos3.ibcdn.com/hjuls8bqkp4op248fja84esc003i.png" class="CToWUd" data-bit="iit">
 <p style="font:bold 12px tahoma;color:#333333">Guest Name</p>
 
 
 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
 Corporate Guest</span>
 <br>
 
 
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>


 


 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="270" align="left">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td>
 
 <p style="font:bold 12px tahoma;color:#333333">Contact Number</p>
 <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">NA</p>
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 
 </td>
 </tr>
 </tbody></table>
 </td>
 </tr>
 <tr>
 <td style="padding:0 30px" width="100%">
 <table cellpadding="0" cellspacing="0" border="0" width="100%">
 <tbody><tr>
 <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="270" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 
 
 <td><p style="font:bold 12px tahoma;color:#333333">Check In</p>
 
 
 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
 ${checkin}</span></span> 
<br>
 </td></tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 
 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="270" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td width="45%">

 
 <p style="font:bold 12px tahoma;color:#333333">Check Out</p>
 
 
 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
 ${checkout}</span></span>
 <br>

 
 
 
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 
 </td>
 </tr>
 </tbody></table>
 </td>
 </tr>
 <tr>
 <td style="padding:0 30px" width="100%">
 <table cellpadding="0" cellspacing="0" border="0" width="100%">
 <tbody><tr>
 <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="100%" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td width="45%">
 <p style="font:bold 12px tahoma;color:#333333">Chargeable Days</p>
 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">${chargeabledays}</span>
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="100%" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td>
 
 <p style="font:bold 12px tahoma;color:#333333">Amount</p><span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">${modeofpayment === "Bill to Company" ? "As Per Contract" : amount}
</span> 

 </td>



 </tr> </tbody>
 </table></td>
 </tr></tbody>
 </table>
 </td>
 </tr>
 </tbody></table>
 </td>
 </tr>
 <tr>

 <td style="padding:0 30px" width="100%">
 <table cellpadding="0" cellspacing="0" border="0" width="100%">
 <tbody><tr>
 <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="100%" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td width="45%">
 <p style="font:bold 12px tahoma;color:#333333">Mode of Payment</p>
 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">${modeofpayment}</span>
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 
 
 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="100%" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td>
 
 <p style="font:bold 12px tahoma;color:#333333">Client Name</p>

 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">${clientName}</span>
 
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 
 
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 

 <tr>
 <td style="padding:0 30px" width="100%">
 <table cellpadding="0" cellspacing="0" border="0" width="100%">
 <tbody><tr>
 <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="100%" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td width="45%">
 
 
 <p style="font:bold 12px tahoma;color:#333333">Room Type</p>
 
 
 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
 ${roomtype}</span>
 <br>
 
 
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 
 
 
 <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="100%" align="left" style="padding:5px 0">
 <table width="100%" cellspacing="0" cellpadding="0">
 <tbody>
 <tr>
 <td width="45%">
 
 <p style="font:bold 12px tahoma;color:#333333">Occupancy</p>
 
 
 <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">${occupancy}</span>
 <br>
 
 
 
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>
 </tbody>
 </table>
 
 
 </td>
 </tr>
 </tbody>
 </table>
 </td>
 </tr>






 <tr><td width="100%" style="padding:0 30.0px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td style="border-bottom:1.0px solid rgb(216,216,216);padding:15.0px 0" width="100%"><table cellspacing="0" cellpadding="0" border="0" align="left" width="170"><tbody><tr><td style="padding:5.0px 0" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="30%"><span style="color:rgb(74,74,74)"><b><span style="font-family:Helvetica,arial,sans-serif"><span style="color:#f59f0d;font-weight:bold">Inclusions</span></span></b></span><br></td></tr></tbody></table></td></tr></tbody></table><table cellspacing="0" cellpadding="0" border="0" align="left" width="370"><tbody><tr><td style="padding:5.0px 0" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><span style="color:rgb(74,74,74)"><span style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px">

Morning Breakfast, Wi-fi 


</span></span><br></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr>


<tr><td width="100%" style="padding:0 30.0px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding:15.0px 0" width="100%"><table cellspacing="0" cellpadding="0" border="0" align="left" width="170"><tbody><tr><td style="padding:5.0px 0" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="30%"><span style="color:rgb(74,74,74)"><b><span style="font-family:Helvetica,arial,sans-serif"><span style="color:#f59f0d;font-weight:bold">Cancellation Charges :</span></span></b></span><br></td></tr></tbody></table></td></tr></tbody></table><table cellspacing="0" cellpadding="0" border="0" align="left" width="370"><tbody><tr><td style="padding-bottom:5.0px" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><p style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px;text-align:justify"><span style="color:rgb(74,74,74)"><span style="font-family:Helvetica,arial,sans-serif"><span style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px">1. 10% of booking amount if cancellation is done after booking confirmation.
 <br>
2. 20% of booking amount or one day retention (whichever is higher) if cancellation is done between 72 hours to 24 hours prior to the booking confirmation.
<br>
3. 100% of booking amount or two days retention (whichever is higher) if cancellation is done less than 24 hours prior to the booking confirmation.
<br>
4. Credit/Debit card cancellations will be charged 3% extra. </span></span></span><br></p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr>

<tr><td width="100%" style="padding:0 30.0px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding:15.0px 0" width="100%"><table cellspacing="0" cellpadding="0" border="0" align="left" width="170"><tbody><tr><td style="padding:5.0px 0" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="30%"><span style="color:rgb(74,74,74)"><b><span style="font-family:Helvetica,arial,sans-serif"><span style="color:#f59f0d;font-weight:bold">Terms &amp; Conditions :</span></span></b></span><br></td></tr></tbody></table></td></tr></tbody></table><table cellspacing="0" cellpadding="0" border="0" align="left" width="370"><tbody><tr><td style="padding-bottom:5.0px" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><p style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px;text-align:justify"><span style="color:rgb(74,74,74)"><span style="font-family:Helvetica,arial,sans-serif"><span style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px">1. Standard Check in time 01:00 PM &amp; Check out time 11.00 AM
 <br>
 2. Please call the caretaker/property manager on the number provided in the voucher for any assistance like directions for reaching the apartment, help with luggage etc. 
 <br> 3. It is advised to call Property manager/Care-taker 15 mins prior reaching to apartment to avoid any hassels on check-in.
 <br>
4. At the time of check in, each guest will need to furnish a printout of the confirmation voucher and a government photo ID (Adhaar/Passport/Pan Card/Driving License/Voter ID) and the company ID if the guest is a company guest.</span></span></span><br></p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr>
 


 <tr>
 <td style="padding:0 30px">
 

 
 
 

 </td></tr><tr style="background-color:#f59f0d">
 <td style="padding:0 30px" width="100%">

 <table cellpadding="0" cellspacing="0" border="0" width="100%">
 <tbody>

 <tr>
 <td width="100%%" style="padding:15px 0">
 
 
 
 <table width="100%" align="left" border="0" cellpadding="0" cellspacing="0">
 <tbody>
 <tr>
 <td width="100%" align="left" style="padding:5px 0;color:black;text-align:-webkit-center">
 <table width="90%" cellspacing="0" cellpadding="0">

 <tbody>

 
 
 <tr style="text-align:-webkit-center">

 
 <td><div>
 <div style="display:-webkit-box">
 <a href="https://www.pajasaapartments.co.in/city/mumbai/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/mumbai/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw3eG7rgdWp0J8LnfFLk597P">Mumbai</a>&nbsp;&nbsp;
 <a href="https://www.pajasaapartments.co.in/city/pune/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/pune/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw2D_vVm5VJcllVNkDaj3kMW">Pune</a>&nbsp;&nbsp;
 <a href="https://www.pajasaapartments.co.in/city/bangalore/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/bangalore/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw2oWUVul5sU2RCmCSad3G6A">Bangalore</a>&nbsp;&nbsp;
 <a href="https://www.pajasaapartments.co.in/city/hyderabad/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/hyderabad/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw1vP8EbZ539mSbcTWd47oTn">Hyderabad</a>&nbsp;&nbsp;
 
 <a href="https://www.pajasaapartments.co.in/city/noida/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/noida/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw3gzYC6lE022dDVjeQZzilS">Noida</a>&nbsp;&nbsp;
 <a href="https://www.pajasaapartments.co.in/city/delhi/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/delhi/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw0n4p6c77W7e9lyDj3sNiLd">Delhi</a>&nbsp;&nbsp;
 <a href="https://www.pajasaapartments.co.in/city/gurgaon/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/gurgaon/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw3PFsfio3qi4bVZSUnWA70e">Gurgaon</a>&nbsp;&nbsp;
 <a href="https://www.pajasaapartments.co.in/city/chennai/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/chennai/&amp;source=gmail&amp;ust=1765384314609000&amp;usg=AOvVaw3rKRtaKXL_sOHH0Y9-gtUY">Chennai</a>
 </div>


 </div>
 </td></tr>
 
 </tbody>

 </table>
 </td>
 </tr>
 </tbody>
 </table>

 
 </td>
 </tr>
 </tbody></table>
 </td></tr>
 
 
 

 
 

 </tbody></table>

 </td>
 
 

 </tr></tbody>
</body>
</html>`;



        // -----------------------------
        // 1️⃣ SEND EMAIL TO APARTMENT
        // -----------------------------
        const aptResult = await sendEmailtoApartment(
            subject,
            apartmentname,
            contactperson,
            contactnumber,
            guestname,
            contactnumberguest,
            checkin,
            checkout,
            chargeabledays,
            amount,
            modeofpayment,
            guesttype,
            roomtype,
            inclusions,
            reservationNo,
            formatted,
            host_email,
            address1,
            address2,
            address3,
        );

        if (aptResult.error) {
            console.log("Apartment email error:", aptResult.error);
        }

        // -----------------------------
        // 2️⃣ SEND EMAIL TO GUEST
        // -----------------------------
        const guestResult = await resend.emails.send({
            from: "hosting@pajasa.com",
            to: emailList,
            subject,
            html: GUEST_TEMPLATE_HTML,
        });

        if (guestResult.error) {
            return res.status(400).json({ error: guestResult.error });
        }

        // -----------------------------
        // 3️⃣ SUCCESS RESPONSE
        // -----------------------------
        res.json({
            success: true,
            apartmentEmail: aptResult.data,
            guestEmail: guestResult.data,
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}










async function sendEmailtoApartment(
    
    
    apartmentname,
    contactperson,
    contactnumber,
    guestname,
    contactnumberguest,
    checkin,
    checkout,
    chargeabledays,
    amount,
    modeofpayment,
    guesttype,
    roomtype,
    inclusions,
    formatted,
    reservationNo,
    host_email,
    address1,
    address2,
    address3,
) {
        const html =   `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>
                    <table width="630" cellpadding="15" bgcolor="#ffffff" cellspacing="0" border="0" align="center" style="padding-top:2em;border-top-left-radius:7px;border-top-right-radius:7px;margin:0 auto">
                <tbody>
                <tr>
                <td width="100%">
                <table width="100%" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody><tr>
                <td align="left" bgcolor="#ffffff" width="40%">
                <a>
                <img width="120" border="0" alt="" style="display:block;border:none;outline:none;text-decoration:none" src="https://ci3.googleusercontent.com/meips/ADKq_NYKoMISuvorFIpkwyNeleh158If7bBLNRWg1Ad_3zcs0sq0ivLeKz6svCPsRAdZvz3cXQ65U1--NOMCpIoKot9DPz6V7JAtvgsxKwJ8OFa2IRjJ2lgYhFKs4A=s0-d-e1-ft#https://www.pajasaapartments.com/wp-content/uploads/2019/08/logo.png" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a>
                </td>
                <td width="45%" valign="middle" align="right">
                <p style="font:bold 12px tahoma;color:#333333;margin:0;padding-bottom:5px">Booked on: <span style="font-size:12px tahoma;color:#858585;margin:0;padding-bottom:5px">${formatted}</span></p>
                <p style="font:bold 12px tahoma;color:#333333;margin:0;padding-bottom:5px">Reservation No.: <span style="color:#f59f0d;font-weight:bold;font-size:12px tahoma">${reservationNo}</span>
                </p></td></tr></tbody></table></td></tr>
                </tbody>
                <tbody><tr><td><hr>

                

                <table width="630" cellpadding="0" cellspacing="0" border="0" align="center" style="background:#ffffff;margin:0 auto">
                <tbody>
                <tr>
                <td width="100%" style="padding:20px">
                <table width="100%" align="left" cellpadding="0" cellspacing="0" border="0">
                <tbody>
                <tr>
                <td>
                <h1 style="font-family:tahoma;font-size:35px;color:#333333;text-align:left;line-height:1.3">
                Booking Confirmed 
                </h1>
                <p style="font:bold 12px tahoma;color:#333333;margin:0;padding-bottom:5px">Hi,Veridical Hospitality <br>
                <br>Thank you for the confirmation</p><br>
                <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
                We are happy to confirm booking with following details :</p>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                
                <tbody><tr><td style="padding:0 30px" width="100%">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tbody><tr>
                <td width="100%" style="padding:0px 0">
                                                    <table width="290" align="left" border="0" cellpadding="0" cellspacing="0" id="m_2450834815802175052m_-6000102758310738402">
                <tbody><tr>
                <td width="100%" align="left" style="padding:5px;color:#858585">
                <p style="color:#3b7dc0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:20px;margin-top:0;margin-bottom:5px;font-weight:normal"><a style="color:#f59f0d;font-weight:bold">Apartment Address</a>
                </p>
                <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">${address1},${address2} <br> ${address3}</p><p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">Contact Person: Anindita </p>
                <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">Contact Number: <a style="color:#858585"> 								 
                </a><a href="tel:%207669990203" target="_blank"> <span style="font-family:tahoma;font-size:14px;color:#858585">7669990203</span></a>
                                                </p> </td></tr></tbody>
                </table>
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody><tr>
                <td width="100%" align="left" style="padding:5px 20px 5px 0">
                

                <a href="https://www.pajasaapartments.com/?p=8825" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.com/?p%3D8825&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw1mVcIzWsoVD9OwdnFrW9N-">
                <img id="m_2450834815802175052m_-6000102758310738402abc" src="https://ci3.googleusercontent.com/meips/ADKq_Nan-x-C5r-OHd8YR-3NqovJfgaFO0gQmT4ULFq13R2wS5p2jEI08z4Ko_ATD0PUvdQar4Yf-0NIp0XMGZpEnRCxluu1XfVjAq4nYbyjYUVZ1zhJD2TDthP8ChOck3aKWHoOA3qVF9Uo_HEjefi_XkXBu-LRR0TFY8vRVZRnWp1kia87ZNe1A4g4HdD2Ah8phfTaPVSCK7om=s0-d-e1-ft#https://www.pajasaapartments.com/wp-content/uploads/2019/04/3-BHK-Service-Apartment-in-Kanjurmarg-west-in-Mumbai-living-room1.jpg" width="260" alt="Service Apartment" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a> </td></tr>
                </tbody></table>
                
                
                </td></tr>
                </tbody></table>
                </td>
                





                </tr><tr>
                <td style="padding:0 30px" width="100%">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tbody><tr>
                <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody><tr>
                <td width="270" align="left"><table width="100%" cellspacing="0" cellpadding="0"><tbody>
                <tr><td width="45%">
                <img style="float:left;padding-right:10px" src="https://ci3.googleusercontent.com/meips/ADKq_NbRo2H3Om_l08yyqDfKMG-HDwxSimiG6UhMkLlaa6e4Uck3degXgdbVVBncdRlOkf-t2KieZgzx326aKca1lVijDqLD7rMiLKYT2CQ=s0-d-e1-ft#http://gos3.ibcdn.com/hjuls8bqkp4op248fja84esc003i.png" class="CToWUd" data-bit="iit">
                <p style="font:bold 12px tahoma;color:#333333">Guest Name</p>
                
                
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
                Ankita Kamthan</span>
                <br>
                
                
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>


                


                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="270" align="left">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td>
                <p style="font:bold 12px tahoma;color:#333333">Contact Number</p>
                <p style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">NA</p>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                
                </td>
                </tr>
                </tbody></table>
                </td>
                </tr>
                <tr>
                <td style="padding:0 30px" width="100%">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tbody><tr>
                <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="270" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                
                
                <td><p style="font:bold 12px tahoma;color:#333333">Check In</p>
                
                
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
                05 Feb,2023&nbsp;<span style="font-family:tahoma;font-size:11px;color:#777777">12:00 PM</span></span> <br> 

                </td></tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                
                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="270" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td width="45%">

                
                <p style="font:bold 12px tahoma;color:#333333">Check Out</p>
                
                
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
                07 Feb,2023&nbsp;<span style="font-family:tahoma;font-size:11px;color:#777777">11:00 AM</span></span>
                <br> 

                
                
                
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                
                </td>
                </tr>
                </tbody></table>
                </td>
                </tr>
                <tr>
                <td style="padding:0 30px" width="100%">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tbody><tr>
                <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="100%" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td width="45%">
                <p style="font:bold 12px tahoma;color:#333333">Chargeable Days</p>
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">2</span>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="100%" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td>
                
                <p style="font:bold 12px tahoma;color:#333333">Amount</p><span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">As Per Contract</span> 

                </td>



                </tr> </tbody>
                </table></td>
                </tr></tbody>
                </table>
                </td>
                </tr>
                </tbody></table>
                </td>
                </tr>
                <tr>

                <td style="padding:0 30px" width="100%">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tbody><tr>
                <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="100%" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td width="45%">
                <p style="font:bold 12px tahoma;color:#333333">Mode of Payment</p>
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">Bill To PAJASA</span>
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                
                
                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="100%" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td>
                
                <p style="font:bold 12px tahoma;color:#333333">Guest Type</p>
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">Corporate Guest</span>
                
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                
                
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                

                <tr>
                <td style="padding:0 30px" width="100%">
                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tbody><tr>
                <td width="100%" style="border-bottom:1px solid #d8d8d8;padding:15px 0">
                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="100%" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td width="45%">
                
                
                <p style="font:bold 12px tahoma;color:#333333">Room Type</p>
                
                
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
                One Room in 2 BHK</span>
                <br>
                
                
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                
                
                
                <table width="270" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="100%" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                <tbody>
                <tr>
                <td width="45%">
                
                <p style="font:bold 12px tahoma;color:#333333">Occupancy</p>
                
                
                <span style="font-family:tahoma;font-size:14px;color:#858585;margin:0;padding-bottom:5px">
                Single Occupancy</span> 
                <br>
                
                
                
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>
                </tbody>
                </table>
                
                
                </td>
                </tr>
                </tbody>
                </table>
                </td>
                </tr>






                <tr><td width="100%" style="padding:0 30.0px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td style="border-bottom:1.0px solid rgb(216,216,216);padding:15.0px 0" width="100%"><table cellspacing="0" cellpadding="0" border="0" align="left" width="170"><tbody><tr><td style="padding:5.0px 0" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="30%"><span style="color:rgb(74,74,74)"><b><span style="font-family:Helvetica,arial,sans-serif"><span style="color:#f59f0d;font-weight:bold">Inclusions</span></span></b></span><br></td></tr></tbody></table></td></tr></tbody></table><table cellspacing="0" cellpadding="0" border="0" align="left" width="370"><tbody><tr><td style="padding:5.0px 0" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><span style="color:rgb(74,74,74)"><span style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px">

                Morning Breakfast, Wi-fi

                </span></span><br></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr>




                <tr><td width="100%" style="padding:0 30.0px"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tbody><tr><td style="padding:15.0px 0" width="100%"><table cellspacing="0" cellpadding="0" border="0" align="left" width="170"><tbody><tr><td style="padding:5.0px 0" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="30%"><span style="color:rgb(74,74,74)"><b><span style="font-family:Helvetica,arial,sans-serif"><span style="color:#f59f0d;font-weight:bold">Terms &amp; Conditions :</span></span></b></span><br></td></tr></tbody></table></td></tr></tbody></table><table cellspacing="0" cellpadding="0" border="0" align="left" width="370"><tbody><tr><td style="padding-bottom:5.0px" align="left" width="100%"><table cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><p style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px;text-align:justify"><span style="color:rgb(74,74,74)"><span style="font-family:Helvetica,arial,sans-serif"><span style="font-family:tahoma;font-size:13px;color:#858585;margin:0;padding-bottom:5px">1. Standard Check in time 01:00 PM &amp; Check out time 11.00 AM
                <br>
                2. Please call the caretaker/property manager on the number provided in the voucher for any assistance like directions for reaching the apartment, help with luggage etc.
                <br>
                3. At the time of check in, each guest will need to furnish a printout of the confirmation voucher and a government photo ID (Adhaar/Passport/Pan Card/Driving License/Voter ID) and the company ID if the guest is a company guest.</span></span></span><br></p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></td></tr>
                


                <tr>
                <td style="padding:0 30px">
                

                
                
                

                </td></tr><tr style="background-color:#f59f0d">
                <td style="padding:0 30px" width="100%">

                <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tbody>

                <tr>
                <td width="100%%" style="padding:15px 0">
                
                
                
                <table width="100%" align="left" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                <td width="100%" align="left" style="padding:5px 0;color:black;text-align:-webkit-center">
                <table width="90%" cellspacing="0" cellpadding="0">

                <tbody>

                
                
                <tr style="text-align:-webkit-center">

                
                <td><div>
                <div style="display:-webkit-box">
                <a href="https://www.pajasaapartments.co.in/city/mumbai/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/mumbai/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw2k7sWu7U98CXlvcFo2-IZr">Mumbai</a>&nbsp;&nbsp;
                <a href="https://www.pajasaapartments.co.in/city/pune/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/pune/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw3zypjPdzw89_g0-zrSKIGp">Pune</a>&nbsp;&nbsp;
                <a href="https://www.pajasaapartments.co.in/city/bangalore/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/bangalore/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw3xlw4M5P_pnbTMVvbZZlps">Bangalore</a>&nbsp;&nbsp;
                <a href="https://www.pajasaapartments.co.in/city/hyderabad/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/hyderabad/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw06NfpFJ00mvt-gC3fOrCKh">Hyderabad</a>&nbsp;&nbsp;
                
                <a href="https://www.pajasaapartments.co.in/city/noida/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/noida/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw1UjNkljJFcP8K4CwaxQGXg">Noida</a>&nbsp;&nbsp;
                <a href="https://www.pajasaapartments.co.in/city/delhi/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/delhi/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw3Q24-oKamXO-OQqI8TYfIK">Delhi</a>&nbsp;&nbsp;
                <a href="https://www.pajasaapartments.co.in/city/gurgaon/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/gurgaon/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw3nRs_lM_RAobtu-rBoml5B">Gurgaon</a>&nbsp;&nbsp;
                <a href="https://www.pajasaapartments.co.in/city/chennai/" style="font-family:tahoma;font-size:14px;color:white;margin:0;padding-bottom:4px;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.pajasaapartments.co.in/city/chennai/&amp;source=gmail&amp;ust=1765475165922000&amp;usg=AOvVaw1HyrWpIjjrbk1lf0LDvFiV">Chennai</a>
                </div>


                </div>
                </td></tr>
                
                </tbody>

                </table>
                </td>
                </tr>
                </tbody>
                </table>

                
                </td>
                </tr>
                </tbody></table>
                </td></tr>
                
                
                

                
                

                </tbody></table>

                </td>
                
                

                </tr></tbody></table>
                </body>
                </html>`



    const { data, error } = await resend.emails.send({
    from: "hosting@pajasa.com",
    to: [host_email, "accounts@pajasaapartments.com","ps@pajasaapartments.com"],
    subject: `Fwd: Apartments Booking Confirmation (${reservationNo})`,
    html,
    });


    return { data, error };
}
