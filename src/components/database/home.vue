<template>
  <div class="home-content">
    <Row :gutter="16">
      <Col :span="16">
        <Card>
          <h3>INTRODUCTION</h3>
          <br>
          <p>Transcripts fusion as a result of genomic rearrangement is an important class of somatic alteration, as a cancer initiating event and as a molecular therapeutic target for specific tumors. Our Pipeline for RNA sequencing Data Analysis (PRADA) enables us to detect fusion transcripts with high confidence comprehensively. Based on integrated analysis of paired-end RNA sequencing and DNA copy number data from The Cancer Genome Atlas(TCGA), The Tumor Fusion Gene Data Portal provides a bona-fide fusion list across many tumor types.</p>
          <div class="img-align">

          </div>
        </Card>
      </Col>
      <Col :span="8">
        <Card>
          <h3>Database statistics</h3>

        </Card>
        <br>

      </Col>
    </Row>
  </div>
</template>

<style lang="less">
  .home-content {
    .ivu-list-item {
      padding-top: 10px;
      padding-bottom: 10px;
    }
    .img-align {
      text-align: center;
      margin-top: 20px;
      margin-bottom: 10px;
      img {
        width: 70%;
      }
    }
    .count-style {
      padding: 1px 7px !important;
      color: #fff;
      background: #2d8cf0;
      border-radius: 15px;
    }

    .link-row {
      margin-bottom: 15px;
      .link-item {
        border: 1px solid #ccc;
        border-radius: 5px;
        height: 80px;
        text-align: center;
        .link-info {
          display: block;
          height: 80px;
          line-height: 60px;
          padding: 10px 20px;
        }
        img {
          width: 100%;
          height: 50px;
        }
        .link-name {
          display: inline-block;
          font-size: 38px;
          font-weight: bold;
        }
        .tools-name {
          display: inline-block;
          font-size: 27px;
          font-weight: bold;
          color: #fff;
        }
      }
      .color-3 {
        background: #428bca;
        a {
          color: #fff;
        }
      }
      .color-4 {
        background: #01B4CA;
      }
      .color-5 {
        background: #1d3954;
        a {
          color: #fff;
        }
      }
      .color-6 {
        background: #900;
      }
      .color-8 {
        background: #005daa;
      }
      .color-10 {
        background: #455372;
      }
    }
  }
</style>

<script>
  import {
    countNumberInterface
  } from '@/api/index';

  export default {
    name: '',
    data() {
      return {
        countList: [],
      }
    },
    methods: {
      getCountNumber() {
        countNumberInterface().then(res => {
          if(res.status == 0){
            this.countList = res.data;
          }
        })
      }
    },
    mounted() {
      this.getCountNumber();
    }
  }

</script>
