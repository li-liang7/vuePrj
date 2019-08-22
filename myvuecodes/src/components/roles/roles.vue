<template>
    <div>
        <el-button class="addjuese" @click="rolesisShow"  type="primary">添加角色</el-button>
        <!-- :data 整个表格中所有数据的数据源 -->
        <el-table
        :data="roleListsData"
        style="width: 100%">

        <!-- 折叠数据 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <!-- el-row是一个大盒子 -->
                <el-row  v-for="item1 in  scope.row.children" :key="item1.id">
                    <!-- el-col是两个小盒子 -->
                    <el-col :span="6">
                        <!-- el-tag 直接方式数据 -->
                        <el-tag :key="item1.id"  closable>{{item1.authName}}</el-tag> 
                        > 
                    </el-col>
                    <!-- 这是另一个小盒子 -->
                    <el-col :span="18">
                        <!-- 小盒子里面的小盒子 -->
                        <el-row :key="item2.id" v-for="item2 in item1.children">
                            <!-- 小盒子里面的小盒子分为两块 -->
                            <el-col :span="6">
                                <el-tag :key="item2.id" type="success" closable>{{item2.authName}}</el-tag>
                                > 
                            </el-col>
                            <el-col :span="18" >
                                <!-- 角色 scope.row.id 角色id -->
                                <!-- 权限的ID item3.id -->
                                <el-tag @close="deleteTag(item2,key3,scope.row.id,item3.id)" v-for="(item3,key3) in item2.children" :key="item3.id" type="warning" closable>{{item3.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>

        <!-- 表头信息 -->
        <el-table-column
        type="index"
        width="50">
        </el-table-column>
        <el-table-column
        label="角色名称"
        prop="roleName">
        </el-table-column>
        <el-table-column
        label="角色描述"
        prop="roleDesc">
        </el-table-column>
        <el-table-column
        label="操作"
        prop="desc">
        <template slot-scope="scope">
           <el-button @click="roleEdit(scope.row)" type="primary" size="mini" icon="el-icon-edit" round></el-button>
            <el-button  @click="roleDelete(scope.row.id)" type="success"  size="mini" icon="el-icon-delete" round></el-button>
            <el-button @click="rightsisShow(scope.row)" type="info"  size="mini"  icon="el-icon-check"  round></el-button>
        </template>

        </el-table-column>


  </el-table>

    <!-- 分配权限的展示面板 -->
    <el-dialog title="分配权限" :visible.sync="rightsShow">
        <el-tree
        ref="tree"
        default-expand-all
        :data="rightsData"
        show-checkbox
        node-key="id"
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="checkedArr"
        :props="defaultProps">
        </el-tree>
    <div slot="footer" class="dialog-footer">
        <el-button @click="rightsShow = false">取 消</el-button>
        <el-button type="primary" @click="rightsEditPost">确 定</el-button>
    </div>
    </el-dialog>

    <!-- 添加角色窗口面板 -->
  <el-dialog title="添加角色" :visible.sync="addRolesShow">
        <el-form :model="addRolesData"  >
            <el-form-item label="角色名称" label-width="200px" prop="username">
                <el-input v-model="addRolesData.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" label-width="200px" prop="username">
                <el-input v-model="addRolesData.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
           
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addRolesShow = false">取 消</el-button>
            <el-button type="primary" @click="addRolePost">确 定</el-button>
        </div>
    </el-dialog>



  <el-dialog title="修改角色" :visible.sync="editRolesShow">
        <el-form :model="editRolesData"  >
            <el-form-item label="角色名称" label-width="200px" prop="username">
                <el-input v-model="editRolesData.roleName" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" label-width="200px" prop="username">
                <el-input v-model="editRolesData.roleDesc" autocomplete="off"></el-input>
            </el-form-item>
           
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editRolesShow = false">取 消</el-button>
            <el-button type="primary" @click="editRolePut">确 定</el-button>
        </div>
    </el-dialog>


</div>
</template>

<script>
export default {
  data() {
    return {
      editRolesShow:false,
      editRolesData:{
        roleName: "",
        roleDesc: ""
      },


      // 添加角色面板
      addRolesShow: false,
      addRolesData: {
        roleName: "",
        roleDesc: ""
      },

      roleId: 0,

      // 所有选中权限的数组集
      checkedArr: [],
      // 权限数据
      rightsData: [],
      //   设置展示节点内容
      defaultProps: {
        children: "children", 
        label: "authName" 
      },
      rightsShow: false,

      roleListsData: []
    };
  },

  methods: {

    // 修改角色信息
    editRolePut(){
      // 获取表单数据及角色id
      this.$myHttp({
        url:`roles/${this.roleId}`,
        method:'put',
        data:this.editRolesData
      }).then(back=>{
        let {data,meta} = back.data;
        // console.log(data,meta);
        if(meta.status == 200){
          this.$message({message:meta.msg,type:'success'});
          this.editRolesShow = false;
          this.getRoleLists();
        }
      });
      
    },

    // 修改角色弹窗
    roleEdit(row){
      this.editRolesData.roleName = row.roleName;
      this.editRolesData.roleDesc = row.roleDesc;
      this.roleId = row.id;// 被修改角色的id 记录下来,方面提交数据时使用
      this.editRolesShow = true;
    },

    // 删除角色事件:
    roleDelete(roleId) {
      // 弹窗的二次确认
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$myHttp({
            url: "roles/" + roleId,
            method: "delete"
          }).then(back => {
            let { data, meta } = back.data;
            // console.log(data,meta);
            if (meta.status == 200) {
              this.getRoleLists();
              this.$message({
                type: "success",
                message: meta.msg
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    // 展示添加角色弹窗
    rolesisShow() {
      this.addRolesShow = true;
    },

    // 添加角色按钮
    addRolePost() {
      this.$myHttp({
        url: "roles",
        method: "post",
        data: this.addRolesData
      }).then(back => {
        let { data, meta } = back.data;
        // console.log(data,meta);
        if (meta.status == 201) {
          this.$message({ message: meta.msg, type: "success" });
          this.addRolesShow = false;
          this.getRoleLists();
        }
      });
    },

    //   获取所有角色信息
    getRoleLists() {
      this.$myHttp({
        url: "roles",
        method: "get"
      }).then(back => {
        let { data, meta } = back.data;
        console.log(data, meta);
        if (meta.status == 200) {
          this.roleListsData = data;
        }
      });
    },

    // 删除角色权限标签
    deleteTag(item, key, roleId, rightId) {
      this.$myHttp({
        url: `roles/${roleId}/rights/${rightId}`,
        method: "delete"
      }).then(back => {
        let { data, meta } = back.data;
        console.log(data, meta);
        if (meta.status == 200) {
          this.$message({ message: meta.msg, type: "success" });
          item.children.splice(key, 1);
        }
      });
    },

    // 控制权限分配面板的显示
    rightsisShow(row) {
      this.roleId = row.id;
      this.checkedArr = [];
      var arr = row.children;
      arr.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            this.checkedArr.push(item3.id);
          });
        });
      });

      // 获取所有权限
      this.$myHttp({
        url: `rights/tree`,
        method: "get"
      }).then(back => {
        let { data, meta } = back.data;
        if (meta.status == 200) {
          this.rightsData = data;
        }
      });
      this.rightsShow = true;
    },

    // 修改角色权限的事件
    rightsEditPost() {
      var rids = this.$refs.tree
        .getCheckedKeys()
        .concat(this.$refs.tree.getHalfCheckedKeys())
        .join();
      this.$myHttp({
        url: `roles/${this.roleId}/rights`,
        method: "post",
        data: { rids }
      }).then(back => {
        let { meta } = back.data;
        console.log(meta);
        if (meta.status == 200) {
          this.$message({ message: meta.msg, type: "success" });
          // 修改成功后,重新获取数据
          this.getRoleLists();
        }
      });
      this.rightsShow = false;
    }
  },
  mounted() {
    this.getRoleLists();
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-main {
  line-height: 20px;
}
.addjuese {
  float: left;
}
.el-tag {
  margin-top: 10px;
  margin-right: 5px;
}
</style>