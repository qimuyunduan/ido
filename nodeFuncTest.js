/**
 *
 * ProjectName：blogme
 * Description：
 * Created by qimuyunduan on 16/4/4 .
 * Revise person：qimuyunduan
 * Revise Time：16/4/4 下午3:06
 * @version
 *
 */
var _      = require('lodash'),
	uuid   = require('node-uuid'),
	utils  = require('./core/server/utils'),
	models   = require('./core/server/models'),
	Promise  = require('bluebird'),
	config   = require('./core/server/config');


var salt = uuid.v4();
var id = uuid.v1();
var pass = utils.checkUser.cryptPass('101410',salt);
//
//console.log(salt);
//console.log(id);
//console.log(pass);
//models['insuredUnit'].model().forge({
//		unit_code: '0055',
//		unit_name: 'insureunit',
//		contact_name: 'xiaoli',
//		contact_mobile: '19912325589',
//		contact_email: '',
//		unit_parent_id: 1,
//		del_tag: '1',
//		unit_address: ''
//	})
//	.save()
//	.then(function (user) {
//		console.log(user);
//	});

console.log(config.paths);


