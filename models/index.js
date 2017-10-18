'use strict';

const mysql = require('mysql2/promise');


let Model = {
	DBPASS: null
};

let pool = null;
Model.getPool = function() {
	if(!pool) {
		pool = mysql.createPool({
			connectionLimit: 10, 
			host: process.env.DBHOST, 
			user: process.env.DBUSER,
			password: Model.DBPASS(), 
			database: process.env.DBNAME,
			typeCast: function castField( field, useDefaultTypeCasting ) {
				// We only want to cast bit fields that have a single-bit in them. If the field
				// has more than one bit, then we cannot assume it is supposed to be a Boolean.
				if ( ( field.type === "BIT" ) && ( field.length === 1 ) ) {
					let bytes = field.buffer();

					// A Buffer in Node represents a collection of 8-bit unsigned integers.
					// Therefore, our single "bit field" comes back as the bits '0000 0001',
					// which is equivalent to the number 1.
					return( bytes[ 0 ] === 1 );
				}

				return( useDefaultTypeCasting() );
			}
		});
	}
	return pool;
}
Model.getDB = async function() {
	let pool = Model.getPool();
	return await pool.getConnection();
}

module.exports = Model;
