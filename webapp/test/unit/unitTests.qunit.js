/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"progettoEPC/Nuovo/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});