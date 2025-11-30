import pool from "../../client.js";








// working fine 

export async function getallProperty(req,res) {
   try {
    await pool.query('BEGIN');
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 30;
     const offset = (page - 1) * limit;
 
 
     const countQuery = `SELECT COUNT(*) FROM properties`;
     const countResult = await pool.query(countQuery);
     const totalItems = parseInt(countResult.rows[0].count);
     const totalPages = Math.ceil(totalItems / limit);
 
     const propQuery = `
     SELECT  * FROM properties p
     LIMIT $1 OFFSET $2
     `;
     
     const propResult = await pool.query(propQuery,[limit,offset]);

      await pool.query('COMMIT');
     res.json({
         data : propResult.rows,
         pagination: {
         currentPage: page,
         totalPages,
         totalItems,
         count : totalItems,
         itemsPerPage: limit,
         hasNext: page < totalPages,
         hasPrev: page > 1
       }
     });
   } catch (error) {
    await pool.query('ROLLBACK');
    console.error('Error Fetching property : ',error);
    res.status(500).json({
        error : 'internal server error while fetching property'
    })
    
   }
}


// working fine 
export async function deleteProperty ( req, res){
    try {
        const property_Id = parseInt(req.params.id);
        if(isNaN(property_Id)){
            return res.status(400).json({
                error : 'Invalid property ID'
            });
        }
        const existsQuery = 'SELECT COUNT(*) FROM properties WHERE property_id = $1'
        const existsResult = await pool.query(existsQuery,[property_Id]);
        if(existsResult.rows.length === 0){
            return res.status(404).json({
                error : 'Property not found'
            });
        }
        const deleteQuery = `DELETE FROM properties WHERE property_id = $1`;
        await pool.query(deleteQuery,[property_Id]);

        res.json({
            message : `Property ${property_Id} deleted successfully`
        });
    } catch (error) {
         console.error('Error deleting property:', error);
        res.status(500).json({
        error: 'Internal server error while deleting property '
        });
    }
};


export async function UpdateProperty(req, res){
    await pool.query('BEGIN');
    const property_Id = parseInt(req.params.id);
    const {

    } = req.body;
    
     if (isNaN(property_Id)) {
      return res.status(400).json({
        error: 'Invalid property_Id ID'
      });
    }
}