module.exports = {
	asInt: function(obj, property, min, max) {
		if (!min)
			min = 0;
		var value = parseInt(obj[property]) || min;
		if (value < min)
			value = min;

		if (max && value>max)
			value=max;

		return value;
	}
};