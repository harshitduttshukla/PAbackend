# Email Modification Display - Implementation Plan

## Problem
When sending emails for modified reservations (preponed, postponed, extended, shortened), the emails should:
1. Show BOTH previous and current check-in/check-out dates AND times
2. Highlight changes in RED color
3. Work for both Guest and Apartment emails
4. Handle all modification types

## Current Issues
- Only shows previous checkout date for extensions
- Doesn't show check-in/check-out TIMES
- Doesn't handle all modification types (preponed, postponed, shortened)
- Changes not highlighted in red clearly

## Solution Architecture

### 1. Fetch Original Booking Data
When sending email, query `booking_history` table to get original dates/times:

```javascript
// In sendEmail function, before creating email template
let originalBooking = null;
if (modification_tags) {
  const historyQuery = `
    SELECT old_check_in_date, old_check_out_date, old_check_in_time, old_check_out_time
    FROM booking_history
    WHERE reservation_id = (SELECT id FROM reservations WHERE reservation_no = $1)
    ORDER BY changed_at ASC
    LIMIT 1
  `;
  const historyResult = await pool.query(historyQuery, [reservationNo]);
  originalBooking = historyResult.rows[0];
}
```

### 2. Determine Modification Type
```javascript
const getModificationType = (original, current) => {
  if (!original) return null;
  
  const modifications = [];
  
  // Check-in changes
  if (new Date(current.checkin) < new Date(original.old_check_in_date)) {
    modifications.push('preponed');
  } else if (new Date(current.checkin) > new Date(original.old_check_in_date)) {
    modifications.push('postponed');
  }
  
  // Check-out changes
  if (new Date(current.checkout) > new Date(original.old_check_out_date)) {
    modifications.push('extended');
  } else if (new Date(current.checkout) < new Date(original.old_check_out_date)) {
    modifications.push('shortened');
  }
  
  return modifications;
};
```

### 3. Email Template Updates

#### For Guest Email (lines 271-346):
```html
<!-- Check In Section -->
<table class="stack-t" width="270" align="left" border="0" cellpadding="0" cellspacing="0">
    <tbody>
        <tr>
            <td width="270" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td>
                                <p style="font:bold 12px tahoma;color:#333333">Check In</p>
                                ${originalBooking ? `
                                    <p style="font:bold 11px tahoma;color:#666;margin:0">Previous:</p>
                                    <span style="font-family:tahoma;font-size:13px;color:#999;text-decoration:line-through">
                                        ${formatDateExact(originalBooking.old_check_in_date, true)} at ${originalBooking.old_check_in_time}
                                    </span>
                                    <br><br>
                                    <p style="font:bold 11px tahoma;color:red;margin:0">Current:</p>
                                ` : ''}
                                <span style="font-family:tahoma;font-size:14px;color:${originalBooking ? 'red' : '#858585'};font-weight:${originalBooking ? 'bold' : 'normal'}">
                                    ${formatDateExact(checkin, true)} at ${check_in_time}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>

<!-- Check Out Section -->
<table class="stack-t" width="270" align="left" border="0" cellpadding="0" cellspacing="0">
    <tbody>
        <tr>
            <td width="270" align="left" style="padding:5px 0">
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tbody>
                        <tr>
                            <td>
                                <p style="font:bold 12px tahoma;color:#333333">Check Out</p>
                                ${originalBooking ? `
                                    <p style="font:bold 11px tahoma;color:#666;margin:0">Previous:</p>
                                    <span style="font-family:tahoma;font-size:13px;color:#999;text-decoration:line-through">
                                        ${formatDateExact(originalBooking.old_check_out_date, false)} at ${originalBooking.old_check_out_time}
                                    </span>
                                    <br><br>
                                    <p style="font:bold 11px tahoma;color:red;margin:0">Current:</p>
                                ` : ''}
                                <span style="font-family:tahoma;font-size:14px;color:${originalBooking ? 'red' : '#858585'};font-weight:${originalBooking ? 'bold' : 'normal'}">
                                    ${formatDateExact(checkout, false)} at ${check_out_time}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
```

### 4. Add Modification Badge
```html
${originalBooking ? `
    <tr>
        <td style="padding:10px 30px">
            <div style="background: linear-gradient(to right, #fef3c7, #fed7aa); border: 2px solid #f59e0b; border-radius: 8px; padding: 12px; margin: 10px 0;">
                <p style="font:bold 14px tahoma;color:#92400e;margin:0">
                    ⚠️ Booking Modified
                </p>
                <p style="font:12px tahoma;color:#78350f;margin:5px 0 0 0">
                    This reservation has been ${modifications.join(' and ')}. 
                    Please note the updated dates and times highlighted in red above.
                </p>
            </div>
        </td>
    </tr>
` : ''}
```

### 5. Update Apartment Email Similarly
Apply the same logic to the apartment email template (starting around line 729).

## Implementation Steps

1. **Update sendEmail function** (line 13):
   - Add query to fetch original booking from booking_history
   - Pass originalBooking to email templates
   - Calculate modification types

2. **Update GUEST_TEMPLATE_HTML** (line 106):
   - Replace check-in section (lines 277-296)
   - Replace check-out section (lines 297-346)
   - Add modification warning banner

3. **Update sendEmailtoApartment function** (line 729):
   - Add same originalBooking parameter
   - Update apartment email template similarly

4. **Test all scenarios**:
   - Preponed (check-in moved earlier)
   - Postponed (check-in moved later)
   - Extended (check-out moved later)
   - Shortened (check-out moved earlier)
   - Combined (e.g., postponed + extended)

## Visual Design

### Before (Current):
```
Check In: 25 Jan 2026
Check Out: 30 Jan 2026
```

### After (Modified):
```
Check In
Previous: 25 Jan 2026 at 14:00 (strikethrough, gray)
Current: 23 Jan 2026 at 14:00 (RED, BOLD)

Check Out  
Previous: 30 Jan 2026 at 11:00 (strikethrough, gray)
Current: 02 Feb 2026 at 11:00 (RED, BOLD)

[Warning Banner]
⚠️ Booking Modified
This reservation has been preponed and extended.
Please note the updated dates and times highlighted in red above.
```

## Files to Modify
1. `/PAbackend/api/email/resend.js` - Main email sending logic
2. Test with actual modified reservations

## Benefits
✅ Clear visual distinction between old and new dates/times
✅ Red highlighting makes changes impossible to miss
✅ Shows complete information (dates AND times)
✅ Works for all modification types
✅ Professional warning banner
✅ Consistent across guest and apartment emails
