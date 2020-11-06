sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterApplication"
], function (MessageBox, Controller, Export, ExportTypeCSV, Filter, FilterOperator, FilterApplication) {
	"use strict";

	return Controller.extend("progettoEPC.Nuovo.controller.Dipendenti", {
		onDataExport: function (oEvent) {
			var oExport = new Export({
				exportType: new ExportTypeCSV({
					separatorChar: ";"
				}),

				models: this.getView().getModel(),

				rows: {
					path: "dip>/dipendenteSet"
				},

				columns: [{
					name: "CID",
					template: {
						content: "{CID}"
					}
				}, {
					name: "Bagde Id",
					template: {
						content: "{BADGE}"
					}
				}, {
					name: "Nome Completo",
					template: {
						content: "{NOME} {COGNOME}"
					}
				}, {
					name: "Mansione",
					template: {
						content: "{MANSIONE}"
					}
				}, {
					name: "Responsabile",
					template: {
						content: "{RESPONSABILE}"
					}
				}]
			});

			oExport.saveFile().catch(function (oError) {
				MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
			}).then(function () {
				oExport.destroy();
			});
		},

		onFilterEmployees: function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				var badgeFilter = new Filter("BADGE", FilterOperator.Contains, sQuery);
			//	var mansioneFilter = new Filter("MANSIONE", FilterOperator.Contains, sQuery);
			//	var responsabileFilter = new Filter("RESPONSABILE", FilterOperator.Contains, sQuery);
				aFilter.push(badgeFilter);
			//	aFilter.push(mansioneFilter);
			//	aFilter.push(responsabileFilter);
			}
			var aFilterList = new Filter({
				filters: aFilter
			//	or: true
			});

			// filter binding
			var oTable = this.byId("idDipendentiTable");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilterList, sap.ui.model.FilterType.Application);
		},
		
		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				dipPath: window.encodeURIComponent(oItem.getBindingContext("dip").getPath().substr(1))
			});
		}

	});
});