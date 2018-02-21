var AWS = require('aws-sdk')
AWS.config.update({
	region: "YOUR REGION e.g us-west-2",
	endpoint: "YOUR ENDPOINT e.g. https://dynamodb.us-west-2.amazonaws.com"
})

var dynamodb = new AWS.DynamoDB();
var docClient = new AWS.DynamoDB.DocumentClient();

var create_table = function(table_name, keys, types, tp)
{

	var params = {
		TableName : table_name,
		KeySchema: [
			{	AttributeName: keys[0], KeyType: types[0]},
			{	AttributeName: keys[1], KeyType: types[1]}
		],
		AttributeDefinitions: [
			{	AttributeName: keys[0], AttributeType: types[2]},
			{	AttributeName: keys[1], AttributeType: types[3]}
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: tp,
			WriteCapacityUnits: tp
		}
	};

	dynamodb.createTable(params, function(error, data) {
		if(error) {
			console.error("Couldn't create table. Error:", JSON.stringify(error, null, 2));
		}

		else {
			console.log("Created Table. Table description JSON:", JSON.stringify(data, null, 2));
		}
	});
}


var add_items = function(table_name, items)
{

	var params = {
		TableName: table_name,
		Item: items
	}

	docClient.put(params, function(err, data) {
	   if (err) {
	       console.error("Unable to add " + table_name +". Error JSON:", JSON.stringify(err, null, 2));
	   } else {
	       console.log("Added " + data);
	   }
	});

}

var get_data = function(table_name, query, value, callback) {
	var params = {
		TableName : table_name,
		KeyConditionExpression: "#q = :q",
		ExpressionAttributeNames: {
			"#q": query

		},
		ExpressionAttributeValues: {
			":q": value
		}
	};

	docClient.query(params, function(err, data) {
		if(err) {
			console.error("Unable to query. Error:", JSON.stringify(err,null, 2));
		} else {
			console.log("Query succeeded.");
			callback(data.Items);
		}	
	});

}

var update_data = function(table_name, key, update_expr, updates) {
	var params = {
		TableName : table_name,
		Key: key,
		UpdateExpression: update_expr,
		ExpressionAttributeValues: updates,
		ReturnValues:"UPDATED_NEW"
	};

	console.log("Attempting update.");
	docClient.update(params, function(err, data) {
    	if (err) {
    	    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    	} else {
    	    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    	}
	});

}


var delete_data = function(table_name, keys) {
	var params = {
		TableName: table_name,
		Key: keys
	}

	console.log("Attempting Deletion of Record")
	docClient.delete(params, function(err, data) {
		if(err) {
			console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("DeleteItem Succeeded: ", JSON.stringify(data, null, 2));
		}
	});
}

module.exports.create_table = create_table;
module.exports.add = add_items;
module.exports.query = get_data;
module.exports.del = delete_data;
module.exports.update = update_data;