import pool from "../../client.js";

export const createInvoice = async (req, res) => {
  const client = await pool.connect(); // FIX: use client instead of pool

  // Helper: convert empty strings to number
  const toNum = (v) => {
    if (v === "" || v === null || v === undefined) return 0;
    return Number(v);
  };

  // Helper: convert MM/DD/YYYY → YYYY-MM-DD
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return null; // prevents crash
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  try {
    await client.query("BEGIN");

    const {
      stateForBilling,
      displayFoodCharge,
      extraServices,
      servicesName,
      servicesAmount,
      date,
      pan,
      roundOffValue,
      guestNameWidth,
      displayCurrencyConversion,
      status,
      paymentMethod,
      pdfPassword,
      invoiceTo,
      pageBreak,
      displayTaxes,
      apartmentBillNo,
      currency,
      conversionRate,
      reservationId,
      lineItems
    } = req.body;

    // ====================================
    // 1️⃣ CALCULATE TOTALS
    // ====================================
    let subTotal = 0;
    let taxTotal = 0;
    let grandTotal = 0;

    lineItems.forEach(item => {
      subTotal += toNum(item.tariff);
      taxTotal += toNum(item.tax);
      grandTotal += toNum(item.total);
    });

    // ====================================
    // 2️⃣ INSERT INVOICE
    // ====================================
    const invoiceQuery = `
      INSERT INTO invoices (
        invoice_number, reservation_id, invoice_date, invoice_to,
        state_for_billing, pan_number, status, payment_method, currency,
        conversion_rate, sub_total, tax_total, grand_total,
        display_taxes, display_food_charge, extra_services,
        services_name, services_amount, pdf_password, page_break,
        guest_name_width, round_off_value
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
      )
      RETURNING id
    `;

    const invoiceValues = [
      apartmentBillNo,
      reservationId,
      formatDate(date),              // 🔥 FIXED DATE ISSUE
      invoiceTo,
      stateForBilling,
      pan,
      status,
      paymentMethod,
      currency,
      toNum(conversionRate),         // 🔥 FIXED NUMERIC
      subTotal,
      taxTotal,
      grandTotal,
      displayTaxes,
      displayFoodCharge === "Yes",
      extraServices === "Yes",
      servicesName,
      toNum(servicesAmount),         // 🔥 FIXED NUMERIC
      pdfPassword,
      toNum(pageBreak),              // 🔥 FIXED NUMERIC
      toNum(guestNameWidth),         // 🔥 FIXED NUMERIC
      toNum(roundOffValue)           // 🔥 FIXED NUMERIC
    ];

    const invoiceResult = await client.query(invoiceQuery, invoiceValues);
    const invoiceId = invoiceResult.rows[0].id;

    // ====================================
    // 3️⃣ INSERT LINE ITEMS
    // ====================================
    const itemQuery = `
      INSERT INTO invoice_items (
        invoice_id, location, description,
        hsn_sac_code, days, rate, tax_amount, total_amount
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `;

    for (const item of lineItems) {
      await client.query(itemQuery, [
        invoiceId,
        item.location,
        item.foodTariff,
        item.gstId,
        toNum(item.days),
        toNum(item.tariff),
        toNum(item.tax),
        toNum(item.total)
      ]);
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Invoice created successfully",
      invoiceId,
      totals: { subTotal, taxTotal, grandTotal }
    });

  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Failed to create invoice" });
  } finally {
    client.release(); // FIX: release client
  }
};
