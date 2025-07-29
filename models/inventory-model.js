const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

// Added the method to fetch a single vehicle by ID W03 lines 29 - 39.
async function getInventoryById(inv_id) {
  try {
    const sql = "SELECT * FROM public.inventory WHERE inv_id = $1"
    const result = await pool.query(sql, [inv_id])
    return result.rows[0] // only one item is expected to be returned
  } catch (error) {
    throw error
  }
}

module.exports = {getClassifications, getInventoryByClassificationId,getInventoryById}




