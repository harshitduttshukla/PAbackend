import pool from "../../client.js";

export async function Pincode(req,res){
    try {
        const {pincode, city} = req.body;

        if(!pincode || !city) {
            return res.status(400).json({
                message : `Pincode and city both are required`
            })}
        const query  =  `
        INSERT INTO pincodes(
        pincode,city)
        VALUES (
        $1,$2
        )
        RETURNING * ;
        `
        const result = await pool.query(query,[pincode,city]);
        res.status(201).json({
            success : true,
            message : "Client inserted successfully",
            data:result.rows[0],
        })

    } catch (error) {
        console.error("Error inserting pincode",error);
        res.status(500).json({
            success : false,
            message : error.message || "Internal Server Error",
        });
        
    }
}