<template>
  <div id="app" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  html,
  body {
    width: 100%;
    height: 100%;
    background: #f0f0f0;
    /* overflow: hidden; */
  }

  .app-main {
    width: 100%;
    height: 100%;
  }

  .br button {
    margin-right: 5px;
  }

  .operation button {
    margin-right: 5px;
  }

  .ivu-btn-text:focus {
    box-shadow: none !important;
  }

  ins {
    background-color: #cfc;
    text-decoration: inherit;
  }

  del {
    color: #999;
    background-color: #FEC8C8;
  }
</style>
