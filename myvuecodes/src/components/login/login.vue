<template>
  <div class="login-wrap">
    <el-form status-icon ref="ruleForm" :rules="rules" :model="form" label-width="80px" class="demo-ruleForm login-from">
      <h2>用户登录</h2>
      <el-form-item label="用户名" prop="username">
        <el-input type="text" autocomplete="off" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" autocomplete="off" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="loginClick">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  data() {
    return { 
      form:{
        password:'',
        username:''
      },
      rules:{
        //使用prop验证
        username:[
          {required: true,message:'请输入用户名',triggle:'blur'}
          ],
        password:[
          {required: true,message:'请输入密码',triggle:'blur'},
          {min:3,max:8,message:'长度三到八个字符',triggle:'blur'}
        ]
      }
     };
  },
  methods:{
    loginClick(){
      this.$refs.ruleForm.validate((res)=>{
        if(res){
          return;
        }
      });

      // console.log(this.pwd+this.username);
      this.$myHttp.post('login',this.form)
      .then((back_data)=>{
        // console.log(back_data);
        if(back_data.data.meta.status==200){
          window.localStorage.setItem('token',back_data.data.data.token);
          this.$message({
            message:'登录成功',
            type:'success'
          });
          this.$router.push({name:'home'});
        }
      });
    }
  }
};
</script>



<style>
.login-wrap {
  background-color: #324152;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-wrap .login-from {
  background-color: #fff;
  width: 400px;
  padding: 30px;
  border-radius: 5px;
}

.login-wrap .login-from .login-btn {
  width: 100%;
}
</style>