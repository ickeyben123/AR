process.env.NODE_ENV = 'test';

import Tag from '../models/tags.js'
import User from '../models/users.js'
import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js';
let should = chai.should();
var user_id;

chai.use(chaiHttp);

// Tests...