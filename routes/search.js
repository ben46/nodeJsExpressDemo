/*
 * search query
 */

exports.query = function(req, res){
	console.log(req.query.order);
	console.log(req.query.shoe.color);
	console.log(req.query.shoe.type);
};