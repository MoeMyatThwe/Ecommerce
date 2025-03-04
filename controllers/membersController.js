const memberModel = require('../models/members');

module.exports.login = function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: 'Account Number and password are required' });
    }

    memberModel.retrieveByUsername(username)
        .then(function (member) {
            if (!member) {
                return res.status(401).json({ message: 'Invalid Account Number or password' });
            }
            res.locals.hash = member.password;
            res.locals.username = member.username;
            res.locals.member_id = member.id;
            res.locals.role = member.role;
            next();
        })
        .catch(function (error) {
            return res.status(500).json({ message: error.message });
        });
}
// done age group spending
exports.getAgeGroupSpending = async (req, res) => {

    const gender = req.query.gender || null;
    const minTotalSpending = +req.query.minTotalSpending || 0;
     const minMemberTotalSpending = +req.query.minMemberTotalSpending || 0;

     memberModel.fetchAgeGroupSpending(gender, minTotalSpending, minMemberTotalSpending)
 
    .then(function(age_group_spending){
        return res.json({spendings: age_group_spending});
    })
    .catch(function(error){
  console.error(error);
    return res.status(500).json({error: error.message});
    });

};

//done clv
module.exports.generateCustomerLifetimeValue = function (req, res) {
    return memberModel.generateCustomerLifetimeValue()
        .then(function(result){
            return res.json({ message: "Generating CLV" })
        } )
        .catch(function(error){
            console.error(error);
            res.status(500).send({error: error.message});
        });
}
