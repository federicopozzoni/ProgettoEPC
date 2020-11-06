sap.ui.define([
	"sap/m/MessageBox",
	"sap/ui/core/mvc/Controller",
	"sap/ui/Device",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function (MessageBox, Controller, Device, Export, ExportTypeCSV, Filter, FilterOperator, Sorter) {
	"use strict";

	return Controller.extend("progettoEPC.Nuovo.controller.Dipendenti", {
		
		onInit: function () {
			this._mViewSettingsDialogs = {};
			
			this.mGroupFunctions = {
				Mansione: function(oContext) {
					var mansione = oContext.getProperty("MANSIONE");
					return {
						key: mansione,
						text: mansione
					};
				},
				Unita: function(oContext) {
					var unita = oContext.getProperty("UNITA_ORGANIZZATIVA");
					return {
						key: unita,
						text: unita
					};
				}
			};
		},
		
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

		onPress: function (oEvent) {
			var oItem = oEvent.getSource();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detail", {
				dipPath: window.encodeURIComponent(oItem.getBindingContext("dip").getPath().substr(1))
			});
		},
		
		onExit: function () {
			var oDialogKey,
				oDialogValue;

			for (oDialogKey in this._mViewSettingsDialogs) {
				oDialogValue = this._mViewSettingsDialogs[oDialogKey];

				if (oDialogValue) {
					oDialogValue.destroy();
				}
			}
		},
		
		createViewSettingsDialog: function (sDialogFragmentName) {
			var oDialog = this._mViewSettingsDialogs[sDialogFragmentName];

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(sDialogFragmentName, this);
				this._mViewSettingsDialogs[sDialogFragmentName] = oDialog;

				if (Device.system.desktop) {
					oDialog.addStyleClass("sapUiSizeCompact");
				}
			}
			return oDialog;
		},
		
		handleSortButtonPressed: function () {
			this.createViewSettingsDialog("progettoEPC.Nuovo.view.SortDialog").open();
		},

		handleFilterButtonPressed: function () {
			this.createViewSettingsDialog("progettoEPC.Nuovo.view.FilterDialog").open();
		},

		handleGroupButtonPressed: function () {
			this.createViewSettingsDialog("progettoEPC.Nuovo.view.GroupDialog").open();
		},
		
		handleSortDialogConfirm: function (oEvent) {
			var oTable = this.byId("idDipendentiTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending));

			// apply the selected sort and group settings
			oBinding.sort(aSorters);
		},
		
		handleGroupDialogConfirm: function (oEvent) {
			var oTable = this.byId("idDipendentiTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				sPath,
				bDescending,
				vGroup,
				aGroups = [];

			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aGroups.push(new Sorter(sPath, bDescending, vGroup));
				// apply the selected group settings
				oBinding.sort(aGroups);
			}
		},
		
		handleFilterDialogConfirm: function (oEvent) {
			var oTable = this.byId("idDipendentiTable"),
				mParams = oEvent.getParameters(),
				oBinding = oTable.getBinding("items"),
				aFilters = [],
				aFilterList = [];
			mParams.filterItems.forEach(function(oItem) {
				var aSplit = oItem.getKey(),
					sQuery = aSplit[0];
				//var sQuery = oEvent.getParameter("query");
				if (sQuery) {
					var mansioneFilter = new Filter("MANSIONE", FilterOperator.Contains, sQuery);
					aFilters.push(mansioneFilter);
				}
					aFilterList = new Filter({
					filters: aFilters,
					or: true
				});
			});
			
			// apply filter settings
			oBinding.filter(aFilterList);

			// update filter bar
			this.byId("vsdFilterBar").setVisible(aFilters.length > 0);
			this.byId("vsdFilterLabel").setText(mParams.filterString);
		}
	});
});