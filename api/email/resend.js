import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY); // ✅ Load from .env

export async function sendEmail(req, res) {
    try {


        const {
            apartmentemail,
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
            reservationNo
        } = req.body;

        // ✅ Validate input
        if (!apartmentemail || !subject) {
            return res.status(400).json({
                error: "Missing required fields: 'apartmentemail' or 'subject'",
            });
        }

        // ✅ Your full HTML template
        const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        <!-- Company Name -->
        <div class="company-name">Hi ${apartmentname}</div>

        <!-- Thank You -->
        <div class="thank-you">Thank you for the confirmation</div>

        <!-- Introduction -->
        <div class="intro-text">
            We are happy to confirm booking with following details :
        </div>

        <!-- Apartment Address Section -->
        <div class="section-title">Apartment Address</div>
        <div class="apartment-section">
            <div class="apartment-header">
                <div class="apartment-details">
                    <p><strong>B 1201/1204, Pluto Tower, Sun City Complex</strong></p>
                    <p>Opposite Trikuta Tower JVLS, Powai,</p>
                    <p>Opposite Gandhi Nagar Flyover</p>
                    <p>Powai, Mumbai-400076</p>
                    <div class="contact-info">
                        <p><strong>Contact Person:</strong>${contactperson}</p>
                        <p><strong>Contact Number:</strong> <span class="contact-number">${contactnumber}</span></p>
                    </div>
                </div>
                
            </div>
        </div>

        <!-- Details Grid -->
        <div class="details-grid">
            <div class="detail-item">
                <div class="detail-label">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    Guest Name
                </div>
                <div class="detail-value">${guestname}</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Contact Number
                </div>
                <div class="detail-value">${contactnumberguest}</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Check In
                </div>
                <div class="detail-value">${checkin}</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Check Out
                </div>
                <div class="detail-value">${checkout}</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">Chargeable Days</div>
                <div class="detail-value">${chargeabledays}</div>
            </div>

            ${modeofpayment !== 'BTC' ? `
            <div class="detail-item">
                <div class="detail-label">Amount</div>
                <div class="detail-value">${amount}</div>
            </div>` : ''}

            <div class="detail-item">
                <div class="detail-label">Mode of Payment</div>
                <div class="detail-value">${modeofpayment}</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">Guest Type</div>
                <div class="detail-value">${guesttype}</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">Room Type</div>
                <div class="detail-value">${roomtype}</div>
            </div>

            <div class="detail-item">
                <div class="detail-label">Occupancy</div>
                <div class="detail-value">${occupancy}</div>
            </div>
        </div>

        <!-- Inclusions Section -->
        <div class="info-section">
            <div class="info-title">Inclusions</div>
            <div class="info-text">${inclusions}</div>
        </div>

        <!-- Terms & Conditions Section -->
        <div class="terms-section">
            <div class="info-title">Terms & Conditions :</div>
            <ol class="terms-list">
                <li>Standard Check in time: 01:00 PM & Check out time: 11:00 AM</li>
                <li>Please call the caretaker/property manager on the number provided in the voucher for any assistance like directions for reaching the apartment, help with luggage etc.</li>
                <li>At the time of check in, each guest will need to furnish a printout of the confirmation voucher and a government photo ID (Adhaar/Passport/ Voter Card/Driving License/ Voter ID) and the company ID if the guest is a company guest.</li>
            </ol>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="city-list">
                Mumbai | Pune | Bangalore | Hyderabad | Noida | Delhi | Gurgaon | Chennai
            </div>
        </div>
    </div>
</body>
</html>`;

        // ✅ Send the email
        const { data, error } = await resend.emails.send({
            from: "hosting@pajasa.com", // Replace later with verified domain
            to: [apartmentemail,"harshitshukla6388@gmail.com"],
            subject,
            html,
        });

        if (error) {
            console.error("Resend API error:", error);
            return res.status(400).json({ error });
        }

        // ✅ Success response
        res.status(200).json({
            success: true,
            message: "Email sent successfully",
            data,
        });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            error: "Internal server error while sending email",
        });
    }
}
