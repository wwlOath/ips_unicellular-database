<template>
  <Breadcrumb>
    <span v-if="breadPath != null">
      <BreadcrumbItem :to="breadPath.path">
        <span>{{breadPath.name}}</span>
      </BreadcrumbItem>
    </span>
    <BreadcrumbItem v-for="item in currentPath" :key="item.name"><span>{{ itemTitle(item) }}</span></BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
  import {getStore} from '@/libs/storage';
  export default {
    name: 'breadcrumbNav',
    data(){
      return {

      }
    },
    props: {
      currentPath: Array,
    },
    methods: {
      itemTitle(item) {
        if (typeof item.title === 'object') {
          return this.$t(item.title.i18n);
        } else {
          return item.name;
        }
      }
    },
    created() {
      let path = getStore('breadRouterToPath');
      if(path != null){
        this.breadPath = JSON.parse(path);
      }else{
        this.breadPath = null;
      }
    }
  };
</script>

