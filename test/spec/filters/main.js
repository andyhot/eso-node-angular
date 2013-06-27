'use strict';

describe('filter', function () {
	beforeEach(module('esoNodeApp'));

	describe('publicDate', function(){
		it('should hide day', inject(function($filter){
			var publicDate = $filter('publicDate');
			expect(publicDate('2000-7-8')).toEqual('7/2000');
		}));
	})

});