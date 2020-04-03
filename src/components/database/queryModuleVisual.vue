<template>
  <div class="visual-content">
    <Card class="content-info">
      <Row>
        <Menu mode="horizontal" active-name="umap" @on-select="loadCurrentModule">
          <MenuItem name="umap">
            <Icon type="ios-paper" />
            Umap细胞类型
          </MenuItem>
          <MenuItem name="gene">
            <Icon type="ios-people" />
            基因表达查询
          </MenuItem>
          <MenuItem name="histogram">
            <Icon type="ios-stats" />
            细胞数/比例统计图
          </MenuItem>
          <MenuItem name="cluster">
            <Icon type="ios-construct" />
            细胞类型比例相关数
          </MenuItem>
        </Menu>

        <div class="item">
          <div v-show="currentMenuValue == 'umap'">
            umap
          </div>
          <div v-show="currentMenuValue == 'gene'">
            gene
          </div>
          <div v-show="currentMenuValue == 'histogram'">
            <div style="width:150vh;height:600px" id="echarts"></div>
          </div>
          <div v-show="currentMenuValue == 'cluster'">
            <div ref="expression_info">
              <!--<TsnePlot id="tsneExpression" :option="expressionOption"/>-->
            </div>
          </div>
        </div>
      </Row>
    </Card>
  </div>
</template>

<style lang="less">
  .visual-content {
    .content-info {
      min-height: calc(~'100vh - 130px');
      .item {
        padding: 15px;
        width: 100%;
      }
    }
  }
</style>

<script>
  import TsnePlot from '../plot/TsnePlot.vue'

  export default {
    name: '',
    data() {
      return {
        currentMenuValue: 'umap',
        expressionOption:{
          data:{

          },
          showLegend:false,
          "legendType": "onlyCluster", //onlyCluster, onlyPtShape, both
          "plotType": "expression", //tsne,expression
          "headerMapping": {
            "cluster": {"index": 3},//"value": "Cell_type", "default": ""
            "ptSize": {"index": -1, "default": 1}, //不是必须的,目前有且仅有它可以是 -1
            "ptShape": {"index": 3},//"value": "Cell_type", "default": "c"
            "ptId": {"index": 0},//"value": "Barcode", "default": "cell_id"
            "x": {"index": 1},//"value": "tSNE_1", "default": "cell_id"
            "y": {"index": 2}, //, "value":"tSNE_2", "default": "cell_id"
            "expression": {"index": 4, "default": 1}
          },
          "title": "xxx",
          "axisLabel": {
            "x": "tsne_1",
            "y": "tsne_2"
          }
        },
      }
    },
    components: {
      TsnePlot
    },
    methods: {
      loadCurrentModule(value) {
        this.currentMenuValue = value;
        if(value == 'umap'){
          this.getUmapDataList();
        }else if(value == 'gene'){
          this.getGeneDataList();
        }else if(value == 'histogram') {
          this.getHistogramDataList();
        }else if(value == 'cluster'){
          this.getClusterDataList();
        }
      },
      getUmapDataList() {

      },
      getGeneDataList() {

      },
      getHistogramDataList() {
        let myChart = this.$echarts.init(document.getElementById('echarts'))

        let option = {
          color: ['#3398DB'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '直接访问',
              type: 'bar',
              barWidth: '60%',
              data: [10, 52, 200, 334, 390, 330, 220]
            }
          ]
        };

        myChart.setOption(option);
      },
      getClusterDataList() {

      },
      getParams() {
        this.expressionOption.width = this.$refs.expression_info.clientWidth;
        this.getTsnePlot();
      },
      //绘制tsneplot
      getTsnePlot() {
        let _this = this;
        /*createTsnePlotData({

        }).then(res => {
          if(res.code == 0){
            _this.expressionOption.data = res.data;
          }
        })*/
      }
    },
    mounted() {
      this.getParams();
    }
  }

</script>
