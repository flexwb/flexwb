import HomeController from './table.controller.js'

export default class ItemController extends HomeController {

  edsInit() {

    this.linkedTables = [];
    this.ngDialog = this.injector.get('ngDialog')
    this.stateParams = this.injector.get('$stateParams');
    this.resName = this.stateParams.resName
    this.http = this.injector.get('$http')
    console.log("init in child " + this.resName);
    this.get();
    return true;
  }

  getLinkedTables() {

      return this.http({method: "GET", 'url' : "/api/relations/" + this.resName  })
        .then((response) => {
          
          angular.forEach(response.data, function (relation) {

            this.loadLinkedTable(relation).then(
              (data) => {
                this.linkedTables.push(data);
              }
            );
          }, this);

          
        });


  }

  loadLinkedTable(relation) {

      return this.http({method: "GET", 'url' : "/api/" + relation.link_table  })
        .then((response) => {
          return {name : relation.link_table, data: response.data } ;

        });



  }

  addRelatedItem(table, linkField) {

    const _scope = this.scope;
    this.targetTable = table
    let resKey =linkField;
    let resId = this.stateParams.resId;
    _scope.dialogType='add'
    
    _scope.form = {}
    _scope.form[resKey] = resId
    this.addDialog = this.ngDialog.open({
                template: '/forms/' + this.targetTable + "?exclude=" + linkField,
                scope: _scope,
                width: '80%'
            });
  }
  
  updateRelatedItem(subRes, linkField, value) {

    const _scope = this.scope;
    this.targetTable = subRes;
    let resKey =linkField;
    let topRes = this.stateParams.topRes;
    let resId = this.stateParams.resId;
    _scope.dialogType='edit'
    
    _scope.form = value
//    _scope.form[resKey] = resId
    this.addDialog = this.ngDialog.open({
                template: '/forms/' + this.targetTable + "?exclude=" + linkField,
                scope: _scope,
                width: '80%'
            });
  }

  attachRes(table, linkField) {


    const _scope = this.scope;
    let resKey =linkField;
    let resId = this.stateParams.resId;
    _scope.dialogType='add'
    this.targetTable = this.resName + "_" + table;


    _scope.form = {}
    _scope.form[resKey] = resId
    this.addDialog = this.ngDialog.open({
                template: '/forms/' + this.targetTable + "?exclude=" + linkField,
                scope: _scope,
                width: '80%'
            });
  }
  
  delHasMany(table, subResId) {


    const _scope = this.scope;

    _scope.form = {}
    this.http({method: "DELETE", url : "/api/" + table + "/" + subResId })
        .then((response) => {
          this.get();
          // this.items.splice(index, 1);
        });
  }


  detachRes(table, subResId) {


    const _scope = this.scope;

    this.targetTable = this.resName + "_" + table;

    this.http({method: "DELETE", url : "/api/" + this.targetTable + "/" + subResId })
        .then((response) => {
          this.get();
          // this.items.splice(index, 1);
        });
  }


  list() {
    return this.get();
  }

  



  get() {

    return this.http({method: "GET", 'url' : "/api/" + this.resName + "/" + this.stateParams.resId })
        .then((response) => {
          // console.log(response);
          return this.item = response.data[0]
        });

  }




}
