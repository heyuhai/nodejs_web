var loading = null;
var Common = {
    init: function(){

    },
    //list checkbox 全选、全不选
    checkall: function(e){
        if($(e).is(':checked')){
            $("input.checkbox").prop("checked", true);
        }else{
            $("input.checkbox").prop("checked", false);
        }
    },
    //access checkbox 全选、全不选
    checkAllAccess: function(e, select){
        if($(e).is(':checked')){
            $(select).prop("checked", true);
        }else{
            $(select).prop("checked", false);
        }
    },
    checkAllSelect: function(select){
        $(select).prop("checked", true);
    },
    checkAllNoselect: function(select){
        $(select).prop("checked", false);
    },
    //list 反选
    checkrev: function(){
        $("input.checkbox").each(function(){
            this.checked = !this.checked;
        });
    },
    checkRevSelect: function(select){
        $(select).each(function(){
            this.checked = !this.checked;
        });
    },
    //loading show
    loadingShow: function(){
        //$("#loading").show();
        loading = layer.load(1, {
            shade: [0.1,'#fff'] //0.1透明度的白色背景
        });
    },
    //loading hide
    loadingHide: function(){
        //$("#loading").hide();
        layer.close(loading);
    }
}
Common.init();
