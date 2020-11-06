function initModel() {
	var sUrl = "/DB_HANA_NEW/totem/services/data.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}