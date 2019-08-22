<template>
  <el-container class="cheight">
    <el-header>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="grid-content bg-purple"><h2>Logo</h2></div>
        </el-col>
        <el-col :span="16">
          <div class="grid-content bg-purple"><h3>后台管理</h3></div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple" ><el-button type="warning" class="exitbtn" @click.stop="logOut">退出</el-button></div>
        </el-col>
      </el-row>
    </el-header>

    <el-container>
      <el-aside width="200px">
      <el-col :span="24">
    <el-menu
        :router="true"
      default-active="2"
      class="el-menu-vertical-demo">
 <el-submenu v-for="item1 in menusList" :index="item1.id" :key='item1.id'>
         <template slot="title">
             <i class="el-icon-location"></i>
             <span>{{item1.authName}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="item2 in item1.children" :index="item2.path" :key="item2.id">  
              <i class="el-icon-menu"></i>
              {{item2.authName}}
            </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

    </el-menu>
  </el-col>
      </el-aside>
      
      <el-main>
          <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
   data(){
        return {
            menusList:[],
        }
    },
    methods:{
       getMenusList(){
            // 获取左侧菜单栏中的所有信息(有关这个用户)
            this.$myHttp({
                url:'menus',
                method:'get'
            }).then((back_data)=>{
                let {data,meta} = back_data.data;
                console.log(data,meta);
                this.menusList = data;
            })
        },
        logOut(){
            window.localStorage.clear('token');
            this.$router.push({name:'login'});
        }
    },
    mounted(){
        this.getMenusList();

        var token = window.localStorage.getItem('token');
        if(!token){
            this.$message.error('请登录');
            this.$router.push({name:'login'});

        }
    }
};
</script>
    
<style>
.cheight {
  height: 100%;
}
.exitbtn{
    margin-top: 10px;
    float: right;
}
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 20px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>