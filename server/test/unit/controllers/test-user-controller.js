// import chai from 'chai';
// import sinon from 'sinon';
// import sinonChai from 'sinon-chai';

// import {
//     getUsers, 
//     addUser, 
//     deleteUser, 
//     updateUser, 
//     loginUser
// } from '../../server/controllers/user-controller';

// import res from 'express/lib/response.js';

// const expect = chai.expect;
// const sandbox = sinon.createSandbox();
// chai.use(sinonChai);

// describe('test user controller : getUsers()', () => {
//   before(() => {
//     sandbox.stub(res, 'json');
//   });

//   afterEach(() => {
//     sandbox.reset();
//   });

//   after(() => {
//     sandbox.restore();
//   });

//   it('should return all users in database', () => {
//     const mockReq = {};
//     getUsers(mockReq, res);
//     //expect(res.json).to
//   });
// });