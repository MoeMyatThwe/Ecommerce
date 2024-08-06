const { query } = require('../database');

module.exports.isAdmin = function isAdmin(memberId) {
    const sql = `SELECT * FROM member m JOIN member_role r ON m.role=r.id WHERE m.id = $1 AND role = 2`;
    return query(sql, [memberId])
        .then(function (result) {
            const rows = result.rows;
            console.log(rows, rows.length);
            if (rows.length == 1)
                return true;
            return false;
        })
        .catch(function (error) {
            throw error;
        });
};

module.exports.retrieveByUsername = function retrieveByUsername(username) {
    const sql = 'SELECT * FROM member WHERE username = $1';
    return query(sql, [username]).then(function (result) {
        const rows = result.rows;
        return rows[0];
    });
};


//done age group spending
module.exports.fetchAgeGroupSpending = async (gender, minTotalSpending, minMemberTotalSpending) => {
    let sql = `
        SELECT * FROM get_age_group_spending($1, $2, $3);
    `;
    let values = [gender, minTotalSpending, minMemberTotalSpending];

    // Check if all parameters are null or undefined
    if (gender === null && minTotalSpending === 0 && minMemberTotalSpending === 0) {
        sql = `
            SELECT * FROM get_age_group_spending(null, 0, 0);
        `;
        values = []; // No need for values since parameters are default
    }

    const result = await query(sql, values);
    return result.rows;
};

//done clv
module.exports.generateCustomerLifetimeValue = function generateCustomerLifetimeValue() {
    const sql = 'CALL compute_customer_lifetime_value()';
    return query(sql)
        .then(function (result) {
            console.log('Calculating students GPA');
        })
        .catch(function (error) {
            throw error;
        });
};
