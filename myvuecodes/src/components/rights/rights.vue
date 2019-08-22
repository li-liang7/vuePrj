<template>
  <div>
       <el-table
      :data="tableRightsData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="id"
        width="220"
        height="50">
      </el-table-column>
      <el-table-column
        prop="authName"
        label="权限名称"
        width="220"
        height="50">
      </el-table-column>
      <el-table-column
        prop="path"
        label="路径"
        width="220">
      </el-table-column>
      <el-table-column
        prop="level"
        label="层级">
        <template slot-scope="scope">
            <span v-if="scope.row.level==0">一级</span>
            <span v-if="scope.row.level==1">二级</span>
            <span v-if="scope.row.level==2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
    data(){
        return{
            tableRightsData:[],
        }
    }
    ,
    methods:{
        getRightsList(){
            this.$myHttp({
                url:'rights/list',
                method:'get'
            }).then((back_data)=>{
                let {data,meta} = back_data.data;
                console.log(back_data);
                this.tableRightsData = data;
            })
        }
    },
    mounted(){
        this.getRightsList();
    }

}
</script>

<style>
    .el-table__header{
        line-height: 50px;
    }
</style>