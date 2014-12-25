var module;

module = angular.module('angularBootstrapNavTree', []);

module.directive('abnTree', ['$timeout','$parse','$window',function($timeout,$parse,$window) {
  return {
    restrict: 'E',
    replace:true,
    templateUrl: 'abn_tree_template.html',
    scope: {
      treeData: '=',
      onSelect: '&',
      initialSelection: '=',
      selectedBranch:'=',
      onExpand: '&',
      initSelectedBranch:'=',
      onDrop:'&',
      onHeaderClick:'&',
      showHeaderBtn:'=',
      showMsgIcon:'=',
      orderBy:'='
    },
    link: function(scope, element, attrs) {
      var expand_level, for_each_branch, on_treeData_change, select_branch, selected_branch,expand_branch,index;
       index  = 20;

      if (attrs.iconExpand == null) {
        attrs.iconExpand = 'icon-plus';
      }
      if (attrs.iconCollapse == null) {
        attrs.iconCollapse = 'icon-minus';
      }

      if (attrs.iconLeaf == null) {
        attrs.iconLeaf = 'icon-chevron-right';
      }
      if (attrs.expandLevel == null) {
        attrs.expandLevel = '3';
      }
      expand_level = parseInt(attrs.expandLevel, 10);
      scope.header = attrs.header;
      if (!scope.treeData) {
          scope.treeData = [];
      }
      if (scope.treeData.length == null) {
        if (treeData.label != null) {
          scope.treeData = [treeData];
        } else {
         // alert('treeData should be an array of root branches');
        }
      }

      for_each_branch = function(f) {
        var do_f, root_branch, _i, _len, _ref, _results;
        do_f = function(branch, level) {
          var child, _i, _len, _ref, _results;
          f(branch, level);
          if (branch.children != null) {
            _ref = branch.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              _results.push(do_f(child, level + 1));
            }
            return _results;
          }
        };
        _ref = scope.treeData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root_branch = _ref[_i];
          _results.push(do_f(root_branch, 1));
        }
        return _results;
      };

      for_each_branch(function(b, level) {
        b.level = level;
        //return b.expanded = b.level < expand_level;
          return b.expanded = b.children !== undefined;
      });

        /**
         * 已选择的节点
         * @type {null}
         */
      selected_branch = null;

         /**
         * 选择节点
         * @param branch
         * @returns {*}
         */
      select_branch = function(branch,showChat) {
          showChat = angular.isDefined(showChat)?showChat:false;
        //if (branch !== scope.selectedBranch) {
//          if (scope.selectedBranch != null) {
//              scope.selectedBranch.selected = false;
//          }
          //branch.selected = true;
          //  scope.selectedBranch = branch;
          if (branch.onSelect != null) {
            return $timeout(function() {
              return branch.onSelect(branch);
            },0);
          } else {
            if (scope.onSelect != null) {
              return $timeout(function() {
                return scope.onSelect({
                  branch: branch
                });
              },0);
            }
          }
        //}
      };


        /**
         * 展开节点
         * @param branch
         * @returns {*}
         */
      expand_branch = function(branch){
          if(!branch.hasChildren) return;
          branch.expanded = !branch.expanded;
          if (branch.onExpand != null) {
              return $timeout(function() {
                  return branch.onExpand(branch);
              },0);
          } else {
              if (scope.onExpand != null) {
                  return $timeout(function() {
                      return scope.onExpand({
                          branch: branch
                      });
                  },0);
              }
          }
      };

        /**
         * 点击节点
         * @param $event
         * @param branch
         * @returns {*}
         */
      scope.user_clicks_branch = function($event,branch) {
        if(angular.element($event.target).hasClass('tree-icon') || angular.element($event.target).parents('.tree-icon').size()){
            return expand_branch(branch);
        }else{
            var showChat = false;
            if(angular.element($event.target).hasClass('hint_wrapper') || angular.element($event.target).parents('.hint_wrapper').size()){
                showChat = true;
            }
            //if (branch !== scope.selectedBranch) {
                return select_branch(branch,showChat);
            //}
        }

      };
        /**
         * 双击节点
         * @param branch
         */
      scope.user_dblclicks_branch = function(branch){
          expand_branch(branch);
          select_branch(branch);
      }
      scope.tree_rows = [];
        /**
         * 树数据改变后的回调
         * @returns {Array}
         */
      on_treeData_change = function() {
        var add_branch_to_list, root_branch, _i, _len, _ref, _results;
        scope.tree_rows = [];
        for_each_branch(function(branch) {
          if (branch.children) {
            if (branch.children.length > 0) {
              return branch.children = branch.children.map(function(e) {
                if (typeof e === 'string') {
                  return {
                    label: e,
                    children: []
                  };
                } else {
                  return e;
                }
              });
            }
          } else {
            return branch.children = [];
          }
        });
        for_each_branch(function(b, level) {
          if (!b.uid) {
            return b.uid = "" + Math.random();
          }
        });
        add_branch_to_list = function(level, branch, visible) {
          var child, child_visible, tree_icon, _i, _len, _ref, _results,node_icon,node_img;
          if (branch.expanded == null) {
            branch.expanded = false;
          }
          if (!branch.isParent) {
            tree_icon = '';
          } else {
            if (branch.expanded) {
              tree_icon = attrs.iconCollapse;
            } else {
              tree_icon = attrs.iconExpand;
            }
          }
            if(branch.expanded){
                node_icon =branch.iconNodeCollapse?branch.iconNodeCollapse: attrs.iconNodeCollapse;
            }else{
                node_icon =branch.iconNodeExpand?branch.iconNodeExpand: attrs.iconNodeExpand;
            }
            node_img = branch.nodeImg||'';
          scope.tree_rows.push({
            level: level,
            branch: branch,
            label: branch.label,
            tree_icon: tree_icon,
            visible: visible,
            node_icon:node_icon,
            node_img:node_img
          });
          if (branch.children != null) {
            _ref = branch.children;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              child = _ref[_i];
              child_visible = visible && branch.expanded;
              _results.push(add_branch_to_list(level + 1, child, child_visible));
            }
            return _results;
          }
        };
        _ref = scope.treeData;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          root_branch = _ref[_i];
          _results.push(add_branch_to_list(1, root_branch, true));
        }
        return _results;
      };

        /**
         * 初始选择
          */
      if (scope.initSelectedBranch != null) {
        for_each_branch(function(b) {
          if (b == scope.initSelectedBranch) {
            return select_branch(b);
          }
        });
      }


     var expandedTimer;
      scope.drop = function(event,branch){
          console.log('arguments',arguments);
          branch.hover = false;
          if (scope.onDrop != null) {
              return $timeout(function() {
                  return scope.onDrop({
                      branch:branch
                  });
              });
          }
      };
      scope.dropOver = function(event,branch){
          branch.hover = true;
      };

      scope.dropOut = function(event,branch){
          branch.hover = false;
      };
      return scope.$watch('treeData', on_treeData_change, true);
    }
  };
}]);
