<template>
  <div class="group-content">
    <Card class="content-info">
      <Row class="operation">
        <div class="left">
          <div class="search-input-style">
            <Input search placeholder="Search" enter-button v-model="searchValueKey" @on-search="searchGroupList"/>
          </div>
        </div>
        <div class="right">
          <Button @click="addGroup" type="primary" icon="md-add">Add</Button>
          <Button @click="editGroup" type="primary" icon="md-create">Edit</Button>
          <Button @click="deleteGroup" type="primary" icon="md-trash">Delete</Button>
        </div>
      </Row>

      <Row>
        <Table :loading="loading" border :columns="columns" :data="data" ref="selection" @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
      </Row>
      <Row type="flex" justify="end" class="page">
        <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50,100]" size="small" show-total show-elevator show-sizer></Page>
      </Row>
    </Card>

    <!--修改模态框-->
    <Modal :title="titleValue" v-model="modalVisible" :mask-closable='false' :width="800">
      <Row>
        <Form ref="form" :model="form" label-position="right" :label-width="120" :rules="rulesForm">
          <FormItem label="groupName" prop="groupName">
            <Input v-model="form.groupName"/>
          </FormItem>
          <FormItem label="groupDescription" prop="groupDescription">
            <Input v-model="form.groupDescription" type="textarea" :rows="5"/>
          </FormItem>
        </Form>
      </Row>

      <div slot="footer">
        <Button type="primary" :loading="addLoading" @click="saveAdd" v-if="isOperateBtn == 'add'">Add</Button>
        <Button type="primary" :loading="editLoading" @click="saveEdit" v-if="isOperateBtn == 'edit'">Edit</Button>
        <Button type="default" @click="modalVisible = false">Cancel</Button>
      </div>
    </Modal>

  </div>

</template>

<style lang="less">
  .invite-share-content {
    .operation {
      margin-bottom: 15px;
      .left {
        float: left;
      }
    }
    .page {
      margin-top: 2vh;
    }
  }
  .group-content {
    .content-info {
      min-height: calc(~'100vh - 130px');
    }
    .operation {
      margin-bottom: 15px;
      .left {
        float: left;
      }

      .right {
        float: right;
      }
    }
    .page {
      margin-top: 2vh;
    }
  }
</style>

<script>
  import {
    getGroupDataList,
    addGroupInterface,
    queryGroupMessage,
    editGroupInterface,
    deleteGroupInterface,
    inviteGroupList,
    saveInviteInterface,
    queryExistGroupList,
    removeUserInterface
  } from '@/api/index';

  export default {
    name: '',
    data() {
      return {
        searchValueKey: '',
        selectCount: 0,
        selectList: [], //多选数据
        loading: true,
        columns: [
          {
            type: 'selection',
            width: 60,
            fixed: 'left',
            align: 'center',
          },
          {
            title: 'Group',
            align: "left",
            key: 'groupName',
            sortable: true,
            minWidth: 200,
          },
          {
            title: 'Member',
            align: "left",
            key: 'groupMember',
            sortable: true,
            minWidth: 200,
            render: (h,params) => {
              return h('div', params.row.groupMember.join(','));
            }
          },
          {
            title: 'Description',
            align: "left",
            key: 'groupDescription',
            sortable: true,
            width: 350,
          },
          {
            title: 'Creater',
            align: "left",
            key: 'groupOwner',
            sortable: true,
            width: 250,
          },
        ],
        data: [],
        pageNumber: 1, // 当前页数
        pageSize: 10, // 页面大小
        total: 0, // 表单数据总数
        sortValue: '',
        orderType: 'asc',
        userId: '',
        titleValue: '',
        modalVisible: false,
        form: {

        },
        rulesForm: {
          groupName: [
            { required: true, message: 'The groupName cannot be empty', trigger: 'blur' }
          ],
        },
        addLoading: false,
        editLoading: false,
        isOperateBtn: 'add',


      }
    },
    methods: {
      searchGroupList() {
        this.pageNumber = 1;
        this.getDataList();
      },
      getDataList() {
        let _this = this;
        _this.loading = true;
        let params = {
          page: _this.pageNumber.toString(),
          limit: _this.pageSize.toString(),
          sidx: _this.sortValue,
          order: _this.orderType,
          queryString: _this.searchValueKey,
        };

        getGroupDataList(params).then(res => {
          _this.loading = false;
          if(res.status == '0'){
            if(res.data != null){
              _this.data = res.data.groups;
              _this.total = res.data.totalCount;
            }else{
              _this.data = [];
              _this.total = 0;
            }
          }
        })
      },
      changeSelect(e) {
        this.selectList = e;
        this.selectCount = e.length;
      },
      changePage(v) {
        this.pageNumber = v;
        this.getDataList();
      },
      //返回切换后的每页条数
      changePageSize(v) {
        this.pageSize = v;
        this.getDataList();
      },
      changeSort(e) {
        this.sortValue = e.key;
        this.orderType = e.order;
        this.getDataList();
      },
      addGroup() {
        this.titleValue = 'Add';
        this.modalVisible = true;
        this.isOperateBtn = 'add';
        this.form = {};
      },
      saveAdd() {
        let _this = this;

        _this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = {
              groupName: _this.form.groupName,
              groupDescription: _this.form.groupDescription,
              groupOwner: this.userId
            };
            _this.addLoading = true;
            addGroupInterface(params).then(res => {
              _this.addLoading = false;
              if(res.status == '0'){
                _this.$Message.success('Success');
                _this.modalVisible = false;
                _this.getGroupDataList();
              }else{
                _this.$Message.error(res.msg);
              }
            })
          }
        })
      },
      editGroup() {
        if(this.selectCount == 1){
          queryGroupMessage(this.selectList[0]['groupId']).then(res => {
            if(res.status == '0'){
              this.form = res.data;
            }
          });
          this.modalVisible = true;
          this.isOperateBtn = 'edit';
          this.titleValue =  'Edit';

        }else if(this.selectCount == 0){
          this.$Message.warning('Please select the data to modify');
        }else{
          this.$Message.warning('Only one data can be selected for modification');
        }
      },
      saveEdit() {
        let _this = this;

        _this.$refs['form'].validate((valid) => {
          if (valid) {
            let params = {
              groupName: _this.form.groupName,
              groupDescription: _this.form.groupDescription,
              groupId: _this.form.id,
              userId: this.userId
            };

            _this.editLoading = true;
            editGroupInterface(params).then(res => {
              _this.editLoading = false;
              if(res.status == '0'){
                _this.$Message.success('Success');
                _this.getGroupDataList();
                _this.modalVisible = false;
              }else{
                _this.$Message.error(res.msg);
              }
            })
          }
        })
      },
      deleteGroup() {
        if(this.selectCount == 1){
          this.$Modal.confirm({
            title: "Sure",
            content: "Are you sure you want to delete the selected data?",
            onOk: () => {
              deleteGroupInterface({
                groupId: this.selectList[0]['groupId'],
                userId: this.userId
              }).then(res => {
                if(res.status == '0'){
                  this.$Message.success('Success');
                  this.getGroupDataList();
                }else{
                  this.$Message.error(res.msg);
                }
              });
            }
          });
        }else if(this.selectCount == 0){
          this.$Message.warning('Please select the data to delete');
        }else{
          this.$Message.warning('Only one data can be selected for delete');
        }
      },
    },
    mounted() {
      this.getDataList();
    }
  }

</script>
