"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const study_controller_1 = require("./study.controller");
/**
 * Study feature routes.
 * Deleting this file (or the entire /study folder) removes the feature.
 */
const router = (0, express_1.Router)();
router.post('/', (req, res) => study_controller_1.studyController.create(req, res));
router.get('/', (req, res) => study_controller_1.studyController.list(req, res));
router.get('/heatmap', (req, res) => study_controller_1.studyController.heatmap(req, res));
router.get('/:id', (req, res) => study_controller_1.studyController.getOne(req, res));
router.patch('/:id', (req, res) => study_controller_1.studyController.update(req, res));
router.delete('/:id', (req, res) => study_controller_1.studyController.remove(req, res));
exports.default = router;
