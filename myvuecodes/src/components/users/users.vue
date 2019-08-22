<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin-top: 5px;">
      <el-input placeholder="请输入内容" v-model="searchData" class="input-with-select">
        <el-button slot="append" icon="el-icon-search" @click.stop="searchGet"></el-button>
      </el-input>
      <el-button type="primary" @click.stop="userShow">添加用户</el-button>
    </div>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="id" width="100"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="220"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop label="状态">
        <template slot-scope="scope">
          <el-switch
            active-color="#13ce66"
            inactive-color="#ff4949"
            v-model="scope.row.mg_state"
            @change="myZhuangTai(scope)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作" width="300">
        <template slot-scope="scope">
          <el-button plain size="mini" @click.stop="editUserisShow(scope)">修改</el-button>
          <el-button plain size="mini" @click="rolesShowClick(scope)">确定</el-button>
          <el-button plain size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="sizeChange"
      @current-change = 'pageChange'
      :page-sizes="[1, 2, 3, 4,20]"
      :page-size="20"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <el-dialog title="添加用户" :visible.sync="addUserShow">
      <el-form :model="userAddData">
        <el-form-item label="用户名" label-width="200px">
          <el-input v-model="userAddData.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="200px">
          <el-input v-model="userAddData.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="200px">
          <el-input v-model="userAddData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="200px">
          <el-input v-model="userAddData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserShow = false">取 消</el-button>
        <el-button type="primary" @click="addUserPost">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="editUserShow">
      <el-form :model="editAddData">
        <el-form-item label="用户名" label-width="200px">
          <el-input v-model="editAddData.username" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="200px">
          <el-input v-model="editAddData.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" label-width="200px">
          <el-input v-model="editAddData.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="quxiaoxiugai">取 消</el-button>
        <el-button type="primary" @click="editUserPut">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="修改用户" :visible.sync="rolesShow">
      <el-form>
        <el-form-item label="用户名" label-width="200px">
          <span>{{rolesData.username}}</span>
        </el-form-item>

        <el-form-item label="角色" label-width="200px">
          <el-select v-model="roleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleName"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesShow = false">取 消</el-button>
        <el-button type="primary" @click="rolePut">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleId: "",
      roleList: [],
      value: "",
      total: 0,
      page:1,
      sizePage:20,

      searchData: "",
      tableData: [],
      addUserShow: false,
      editUserShow: false,
      rolesShow: false,
      editAddData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      userAddData: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rolesData: {}
    };
  },
  methods: {
    getUserList(query = "") {
      if (query == "") {
        var url = `users?pagenum=${this.page}&pagesize=${this.sizePage}}`;
      } else {
        var url = "users?pagenum=1&pagesize=20&query=" + query;
      }
      this.$myHttp({
        url,
        method: "get"
      }).then(back_data => {
        let { data, meta } = back_data.data;
        if (meta.status == 200) {
          this.total = data.total;
          this.tableData = data.users;
        } else {
        }
      });
    },
    searchGet() {
      console.log(this.searchData);
      this.getUserList(this.searchData);
    },
    userShow() {
      this.addUserShow = true;
    },
    addUserPost() {
      this.$myHttp({
        url: "users",
        method: "post",
        data: this.userAddData
      }).then(back_data => {
        let { data, meta } = back_data.data;
        if (meta.status == 201) {
          this.$message({ message: "添加成功", type: "success" });
          this.addUserShow = false;
          this.getUserList();
        }
      });
    },
    myZhuangTai(scope) {
      this.$myHttp({
        url: `users/${scope.row.id}/state/${scope.row.mg_state}`,
        method: "put",
        headers: { Authorization: window.localStorage.getItem("token") }
      }).then(back_data => {
        let { data, meta } = back_data.data;
        if (meta.status == 200) {
          this.$message({ message: "修改成功", type: "success" });
        } else {
          this.tableData[scope.$index].mg.state = !scope.row.mg_state;
        }
      });
    },
    deleteUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$myHttp({
            url: `users/${id}`,
            method: "delete"
          }).then(back_data => {
            this.getUserList();
            let { data, meta } = back_data.data;
            if (meta.status == 200) {
              this.$message({ message: "删除成功", type: "success" });
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
    editUserisShow(scope) {
      this.editAddData = scope.row;
      this.editUserShow = true;
    },
    editUserPut(scope) {
      let id = this.editAddData.id;
      let email = this.editAddData.email;
      let mobile = this.editAddData.mobile;
      this.$myHttp({
        url: `users/${id}`,
        method: "put",
        data: { email, mobile }
      }).then(back_data => {
        let { data, meta } = back_data.data;
        if ((meta.status = 200)) {
          this.$message({ message: "修改成功", type: "success" });
        } else {
          this.$message.console.error("修改失败");
        }
        this.getUserList();
      });
    },
    quxiaoxiugai() {
      this.editUserShow = false;
      this.getUserList();
    },
    rolesShowClick(scope) {
      this.$myHttp({
        url: "roles",
        method: "get"
      }).then(back_data => {
        this.roleList = back_data.data.data;
      });
      this.rolesData = scope.row;
      this.rolesShow = true;
    },
    rolePut() {
      this.$myHttp({
        url: `users/${this.rolesData.id}/role`,
        method: "put",
        data: { rid: this.roleId }
      }).then(back_data => {
        let { data, meta } = back_data.data;
        if (meta.status == 200) {
          this.$message({ message: "成功", type: "success" });
          this.rolesShow = false;
        }
      });
    },
    sizeChange(size){
      this.sizePage = size;
      this.getUserList();
    },
    pageChange(page){
      this.page = page;
      this.getUserList();
    }
  },

  mounted() {
    this.getUserList();
  }
};
</script>

<style>
.el-main {
  line-height: 50px;
  text-align: left;
  width: 30%;
}
.input-with-select {
  width: 30%;
}
</style>