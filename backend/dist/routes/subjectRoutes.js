"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectController_1 = require("../controllers/subjectController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * Subject routes
 */
router.get('/stream/:streamId', subjectController_1.getSubjectsByStream);
router.post('/', auth_1.authenticate, auth_1.isAdmin, subjectController_1.createSubject);
router.put('/:id', auth_1.authenticate, auth_1.isAdmin, subjectController_1.updateSubject);
router.delete('/:id', auth_1.authenticate, auth_1.isAdmin, subjectController_1.deleteSubject);
exports.default = router;
