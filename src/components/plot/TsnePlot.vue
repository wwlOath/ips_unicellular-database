<template>
     
  <div>
    <div :id="id" :style="containerStyle">
      <div :id="id + '_plotRegion' "></div>
      <div :id="id + '_tip'" :style="tips.style" v-html="tips.content"></div>
    </div>
  </div>

</template>

<style></style>

<script>
  import * as d3 from 'd3'

  export default {
    name: 'TsnePlot',
    data() {
      return {
        cleanPlotData: [], //[{"x":1,"y":1,"cluster":""},{}]
        tips: {
          content: "",
          style: {
            "position": "absolute",
            "will-change": "top, left",
            'visibility': 'hidden',
            "top": 0,
            "left": 0,
            "padding":"5px",
            "position":"absolute",
            "border-style":"solid",
            "white-space":"nowrap",
            "z-index":"9999999",
            "transition":"left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
            "background-color":"rgba(50, 50, 50, 0.7)",
            "border-width":"0px",
            "border-color":"rgb(51, 51, 51)",
            "border-radius":"4px",
            "color":"rgb(255, 255, 255)",
            "font-style":"normal",
            "font-variant":"normal",
            "font-weight":"normal",
            "font-stretch":"normal",
            "font-size":"14px",
          }
        },
        containerStyle: {
          "width": "100%",
          "height": "100%",
          "padding": "10px"
        }
      }
    },
    props: {
      id: {
        type: String,
        required: true,
      },
      option: {
        type: Object,
        default: () => {
          return {
            "data": {"header": [], "data": []},
            "showLegend":true,
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
            },
            "width": 1000,
          }
        }
      }
    },
    methods: {
      formatPlotData() {
        let _this = this
        let mapping = _this.option["headerMapping"]
        _this.cleanPlotData = []
        _this.option["data"]["data"].forEach(d => {
          _this.cleanPlotData.push({
            "cluster": d[mapping["cluster"]["index"]],
            "ptSize": parseFloat(mapping["ptSize"]["index"] < 0 ? mapping["ptSize"]["default"] : d[mapping["ptSize"]["index"]]),
            "ptShape": d[mapping["ptShape"]["index"]],
            "ptId": d[mapping["ptId"]["index"]],
            "x": parseFloat(d[mapping["x"]["index"]]),
            "y": parseFloat(d[mapping["y"]["index"]]),
            "expression": parseFloat(d[mapping["expression"]["index"]])
          })
        })
      },
      initPlot() {
        let _this = this;
        let legendType = _this.option["legendType"];
        let label = ["x", "y"]
        let minMaxMapping = {} //x,y 轴的最大最小值
        label.forEach(function (d) {
          minMaxMapping[d] = {
            min: Infinity,
            max: -Infinity
          }
        })
        let rMin = Infinity, rMax = -Infinity, expMin = Infinity, expMax = -Infinity
        let set_originCategory = {}; //ptShape
        let maxOriginLabelLength = 0; //ptShape名称的长度，以便控制页面显示比例，防止超长
        let set_cluster = {}; //cluster


        //计算值的类别及最大最小值
        _this.cleanPlotData.forEach(function (d) {
          set_originCategory[d["ptShape"]] = 1
          if (d["ptShape"].length > maxOriginLabelLength) {
            maxOriginLabelLength = d["ptShape"].length
          }
          set_cluster[d["cluster"]] = 1
          label.forEach(p => {
            if (d[p] < minMaxMapping[p]["min"]) {
              minMaxMapping[p]["min"] = d[p]
            } else if (d[p] > minMaxMapping[p]["max"]) {
              minMaxMapping[p]["max"] = d[p]
            }
          })
          rMin = d["ptSize"] < rMin ? d["ptSize"] : rMin
          rMax = d["ptSize"] > rMax ? d["ptSize"] : rMax
          expMin = d["expression"] < expMin ? d["expression"] : expMin
          expMax = d["expression"] > expMax ? d["expression"] : expMax
        })


        let tmp_wordLength = (maxOriginLabelLength - 23) > 0 ? (maxOriginLabelLength - 23) : 0
        let rightWidth = 150 + tmp_wordLength * 7.6;

        let tmp_fontSize = Math.ceil(4 - Math.log(maxOriginLabelLength / rightWidth) * 3);
        let lengendFontSize = tmp_fontSize > 15 ? 15 : (tmp_fontSize < 8 ? 8 : tmp_fontSize);




        let attr = {
          width: 1000,
          height: 1000,
          left: 60,
          right: rightWidth > 200 ? rightWidth : 200,
          top: 40,
          bottom: 60
        }

        let defaultX = label[0]
        let defaultY = label[1]

        let xScale = d3.scaleLinear().domain([minMaxMapping[defaultX]["min"], minMaxMapping[defaultX]["max"]]).range([0, attr["width"] - attr["left"] - attr["right"]])
        let yScale = d3.scaleLinear().domain([minMaxMapping[defaultY]["max"], minMaxMapping[defaultY]["min"]]).range([0, attr["height"] - attr["top"] - attr["bottom"]])

        //基因表达
        if(expMin == expMax){
          expMax += 0.1
        }
        let _negtInterpolate = d3.interpolate(d3.rgb("blue"), d3.rgb("#d3d3d3"))
        let _posiInterpolate = d3.interpolate(d3.rgb("#d3d3d3"), d3.rgb("red"))
        let _positiveLinear = d3.scaleLinear().domain([0, expMax]).range([0, 1])
        let _nagtiveLinear = d3.scaleLinear().domain([expMin, 0]).range([0, 1])

        if (rMin == rMax) {
          rMin = 0
        }
        //当点数比较多时，尽量把点画小，这样有利于减少重叠
        let num = _this.cleanPlotData.length
        let rScale = d3.scaleLinear().domain([rMin, rMax]).range([200 / Math.sqrt(num), 400 / Math.sqrt(num)]);
        //目前只放20个cluster的颜色，其他用序数比例尺扩展
        let colors20 = [
          "#ff7f0e",
          "#2ca02c",
          "#d62728",
          "#1f77b4",
          "#ff9896",
          "#8c564b",
          "#e377c2",
          "#FFD700",
          "#FF1493",
          "#bcbd22",
          "#0000FF",
          "#ADFF2F",
          "#8B668B",
          "#00FFFF",
          "#20B2AA",
          "#ffbb78",
          "#98df8a",
          "#FFBBFF",
          "#BFEFFF",
          "#7f7f7f",
          "#625B57",
          "#F08080",
          "#CD5C5C",
          "#B22222",
          "#8B0000",
          "#FF0000",
          "#FF4D40",
          "#FFE4E1",
          "#FFA07A",
          "#A0522D",
          "#FF8033",
          "#E69966",
          "#4D1F00",
          "#8B4513",
          "#FFDAB9",
          "#F4A460",
          "#B87333",
          "#CD853F",
          "#704214",
          "#FF9900",
          "#B8860B",
          "#4D3900",
          "#E6C35C",
          "#EEE8AA",
          "#CCFF00",
          "#6B8E23",
          "#9ACD32",
          "#66FF59",
          "#228B22",
          "#00FF00",
          "#4DE680",
          "#A6FFCC",
          "#00FF80",
          "#00A15C",
          "#7FFFD4",
          "#AFEEEE",
          "#2F4F4F",
          "#AFDFE4",
          "#5F9EA0",
          "#4798B3",
          "#87CEEB",
          "#003153",
          "#4682B4",
          "#1E90FF",
          "#004D99",
          "#B0C4DE",
          "#0047AB",
          "#6495ED",
          "#4D80E6",
          "#003399",
          "#2A52BE",
          "#4169E1",
          "#24367D",
          "#0033FF",
          "#191970",
          "#00008B",
          "#5C50E6",
          "#483D8B",
          "#6A5ACD",
          "#B399FF",
          "#9370DB",
          "#FF00FF",
          "#C71585",
          "#FF73B3",
          "#990036",
          "#FF8099",
          "#DC143C"
        ];
        let color_cluster = d3.scaleOrdinal().domain(Object.keys(set_cluster)).range(colors20);
        if (legendType == "onlyPtShape") {
          color_cluster = d3.scaleOrdinal().domain(Object.keys(set_originCategory)).range(colors20);
        }

        //d3.symbols
        let shape_originCategory = d3.scaleOrdinal().domain(Object.keys(set_originCategory)).range([d3.symbolCircle, d3.symbolTriangle, d3.symbolDiamond, d3.symbolCross, d3.symbolStar, d3.symbolSquare, d3.symbolWye]);

        let svg = d3.select("#" + _this.id + '_plotRegion')
          .append("svg")
          .attr("preserveAspectRatio", "xMidYMid meet")
          .attr("viewBox", "0 0 1000 1000")
          .attr("height", "100%")
          .attr("width", "100%")


        let area = svg.append("rect").attr("class", "target")
          .attr("width", attr["width"])
          .attr("height", attr["height"])//.attr("transform", "translate(" + attr["left"] + "," + attr["top"]+ ")")
          .style("opacity", 1)
          .style("fill", "#fff")


        //定义坐标轴
        let xAxis = d3.axisBottom(xScale).ticks(10);
        let yAxis = d3.axisLeft(yScale).ticks(10);
        //添加X轴文字
        let mainRegion = svg.append("g").attr("transform", "translate(" + attr["left"] + "," + attr["top"] + ")");

        mainRegion.append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", attr["width"] - attr["right"] - attr["left"])
          .attr("height", attr["height"] - attr["bottom"] - attr["top"]);

        let xSvgAxis = mainRegion.append("g")
          .attr("class", "xAxis")
          .attr("transform", "translate(0 ," + (attr["height"] - attr["bottom"] - attr["top"]) + ")")
          .call(xAxis);
        xSvgAxis.append('text').attr("id", "xLabel")
          .attr('x', (attr["width"] - attr["left"] - attr["right"]) / 2)
          .attr('y', '40')
          .style('font-size', '12')
          .style('fill', '#333333')
          .text(_this.option["axisLabel"]["x"]);

        //添加y轴文字
        let ySvgAxis = mainRegion.append("g")
          .attr("class", "yAxis")
          .call(yAxis);
        ySvgAxis.append('text').attr("id", "yLabel")
          .attr('transform', 'rotate(-90)')
          .attr('x', '-' + (attr["height"] - attr["top"] - attr["bottom"]) / 2)
          .attr('y', '-30')
          .style('font-size', '12')
          .style('fill', '#333333')
          .text(_this.option["axisLabel"]["y"]);

        //添加基因表达的colorbar
        if (_this.option["plotType"] == "expression") {
          svg.append("g").attr("class", "geneExpColorBar").attr("transform", "translate(" + (attr["width"] - attr["right"] + 50) + "," + (attr["height"] - attr["bottom"] - 20) + ")")

          //添加color bar
          var barValueArray = new Array();
          var dataExpL = []

          //如果有正负则各五个方块
          if (expMin < 0 & expMax > 0) {
            dataExpL = d3.merge([d3.range(expMin, 0, (0 - expMin) / 5), d3.range(0, expMax, (expMax - 0) / 5)])
          } else {
            dataExpL = d3.range(expMin, expMax, (expMax - expMin) / 10)
          }

          dataExpL.forEach(function (d) {
            if (d >= 0) {
              barValueArray.push(_posiInterpolate(_positiveLinear(d)));
            } else {
              barValueArray.push(_negtInterpolate(_nagtiveLinear(d)));
            }
          })


          /*颜色bar*/
          var expRect = svg.select(".geneExpColorBar")
            .selectAll("rect")
            .data(barValueArray)
          var expText = svg.select(".geneExpColorBar")
            .selectAll("text")
            .data([d3.format(".4f")(expMin), d3.format(".4f")(expMax), ""])

          expRect = expRect.enter().append("rect")
          expText = expText.enter().append("text")

          expRect.attr("x", function (d, i) {
            return i * 12
          }).attr("y", 0)
            .attr("height", 12)
            .attr("width", 12)
            .style("fill", function (d) {
              return d
            })

          expText.attr('x', function (d, i) {
            return i == 1 ? (barValueArray.length - 1) * 12 : 0
          }).attr('y', function (d, i) {
            return i == 2 ? -12 : 24
          }).style('font-size', lengendFontSize)
            .style('fill', '#333333')
            .text(function (d) {
              return d
            })
        }


        //添加图形元素点
        let cells = mainRegion.append("g")
          .attr("class", "cell_ids")
          .attr("clip-path", "url(#clip)")
          .append('g')
          .attr('class', 'cells')
          .selectAll(".cell")
          .data(_this.cleanPlotData)
          .enter()
          .append("path")
          .attr("d", d3.symbol().type(function (d) {
            if (legendType == "both") {
              return shape_originCategory(d["ptShape"])
            } else {
              return d3.symbolCircle
            }
          }).size(function (e) {
            return rScale(e["ptSize"])
          }))
          .attr("transform", function (d) {
            return "translate(" + xScale(d[defaultX]) + "," + yScale(d[defaultY]) + ")"
          })
          .attr('id', function (d) {
            return d["ptId"];
          })
          .attr('class', function (d) {
            return 'cell cluster_' + d["cluster"] + " originCa_" + d["ptShape"];
          })
          .style("fill", function (d) {
            if (_this.option["plotType"] == "expression") {
              if (d["expression"] >= 0) {
                return _posiInterpolate(_positiveLinear(d["expression"]))
              } else {
                return _negtInterpolate(_nagtiveLinear(d["expression"]))
              }
            }
            if (legendType == "onlyPtShape") {
              return color_cluster(d["ptShape"]);
            } else {
              return color_cluster(d["cluster"]);
            }
          })
          .style('opacity', '0.9')
          .style('cursor', 'pointer')
          .on('mouseover', function (d) {
            let content = ""
            if (_this.option["plotType"] == "expression") {
              content = '<div>'
                + '<p style="margin: 5px auto">Cell: ' + d["ptId"] + '</p>'
                + '<p style="margin: 5px auto">Cell Type: <span style="color:' + color_cluster(d["ptShape"]) + '">' + d["ptShape"] + '</span></p>'
                + '<p style="margin: 5px auto">Expression: ' + d["expression"] + '</p>'
                + '</div>'
            } else {
              content = '<div>'
              + '<p style="margin: 5px auto">Cell: ' + d["ptId"] + '</p>'
              + '<p style="margin: 5px auto">Cell Type: <span style="color:' + color_cluster(d["ptShape"]) + '">' + d["ptShape"] + '</span></p>'
              + '</div>'
            }
            _this.$set(_this.tips,"content",content)
            _this.$set(_this.tips.style,"visibility","visible")
            _this.$set(_this.tips.style,"top", `${d3.event.layerY - 10}px`)
            _this.$set(_this.tips.style,"left",`${d3.event.layerX + 10}px`)
          })
          .on('mouseout', function () {
            _this.$set(_this.tips.style,"visibility","hidden")
          })


        //图例标签
        let shape = Object.keys(set_originCategory);
        let shapeArr = [];
        shape.forEach(function (d) {
          if (d != "undefined") {
            shapeArr.push(d);
          }
        });

        if ((legendType == "both" || legendType == "onlyPtShape") && _this.option["showLegend"]) {
          svg.append("g")
            .attr("class", "shapeLegend")
            .attr("transform", "translate(" + (attr["width"] - attr["right"] + 15) + "," + (attr["top"] + 20) + ")")
            .selectAll(".origin")
            .data(shapeArr)
            .enter()
            .append("g")
            .attr("id", function (d) {
              return "originCa_" + d
            })
            .attr("class", "legend")
            .each(function (d, i) {
              let legend = d3.select(this);
              let shape_p = legendType == "both" ? d3.symbol().type(shape_originCategory(d)).size(100) : d3.symbol().type(d3.symbolCircle).size(200)
              legend.append("path")
                .attr("d", shape_p)
                .style("fill", function () {
                  if (legendType == "onlyPtShape") {
                    return color_cluster(d)
                  } else {
                    return '#000'
                  }
                })
                .style('opacity', '0.9')
                .attr("transform", "translate(" + 10 + "," + i * 22 + ")");
              legend.append("text")
                .attr("transform", "translate(" + 30 + "," + (i * 22 + 5) + ")")
                .style("fill", '#000')
                .style('font-size', lengendFontSize)
                .text(d)
            })
            .style('cursor', 'pointer')
            .on("click", "alert(1)")
        }

        let cluster = Object.keys(set_cluster);
        if ((legendType == "both" || legendType == "onlyCluster") && _this.option["showLegend"]) {
          let startYposi = attr["top"];
          if (legendType == "both") {
            startYposi = startYposi + (attr["top"] + 80 + shape.length * 20);
          }
          let cluster_1 = [];
          let cluster_2 = [];
          let cluster_3 = [];

          let space = 20
          if(legendType == "onlyCluster"){
              space = 30
          }

          for (let i = 0; i < cluster.length; i++) {
            if (i <= space) {
              cluster_1.push(cluster[i]);
            } else if (i > space && i <= space * 2) {
              cluster_2.push(cluster[i]);
            } else {
              cluster_3.push(cluster[i]);
            }
          }

          svg.append("g")
            .attr("class", "clusterLegend_1")
            .attr("transform", "translate(" + (attr["width"] - attr["right"] + 15) + "," + startYposi + ")")
            .selectAll(".origin")
            .data(cluster_1)
            .enter()
            .append("g")
            .attr("id", function (d) {
              return "cluster_" + d
            })
            .attr("class", "legend")
            .each(function (d, i) {
              let legend = d3.select(this);
              legend.append("path")
                .attr("d", d3.symbol().type(d3.symbolCircle).size(200))
                .style("fill", color_cluster(d))
                .style('opacity', '0.9')
                .attr("transform", "translate(" + 10 + "," + i * 22 + ")");
              legend.append("text")
                .attr("transform", "translate(" + 30 + "," + (i * 22 + 6) + ")")
                .style("fill", '#000')
                .style('font-size', lengendFontSize)
                .text(d)
            })
            .style('cursor', 'pointer')
            .on("click", "alert(2)")

          if (cluster_2.length > 0) {
            svg.append("g")
              .attr("class", "clusterLegend_2")
              .attr("transform", "translate(" + (attr["width"] - attr["right"] + 75) + "," + startYposi + ")")
              .selectAll(".origin")
              .data(cluster_2)
              .enter()
              .append("g")
              .attr("id", function (d) {
                return "cluster_" + d
              })
              .attr("class", "legend")
              .each(function (d, i) {
                let legend = d3.select(this);
                legend.append("path")
                  .attr("d", d3.symbol().type(d3.symbolCircle).size(200))
                  .style("fill", color_cluster(d))
                  .style('opacity', '0.9')
                  .attr("transform", "translate(" + 10 + "," + i * 22 + ")");
                legend.append("text")
                  .attr("transform", "translate(" + 30 + "," + (i * 22 + 6) + ")")
                  .style("fill", '#000')
                  .style('font-size', lengendFontSize)
                  .text(d)
              })
              .style('cursor', 'pointer')
              .on("click", "alert(3)")
          }

          if (cluster_3.length > 0) {
            svg.append("g")
              .attr("class", "clusterLegend_3")
              .attr("transform", "translate(" + (attr["width"] - attr["right"] + 135) + "," + startYposi + ")")
              .selectAll(".origin")
              .data(cluster_3)
              .enter()
              .append("g")
              .attr("id", function (d) {
                return "cluster_" + d
              })
              .attr("class", "legend")
              .each(function (d, i) {
                let legend = d3.select(this);
                legend.append("path")
                  .attr("d", d3.symbol().type(d3.symbolCircle).size(200))
                  .style("fill", color_cluster(d))
                  .style('opacity', '0.9')
                  .attr("transform", "translate(" + 10 + "," + i * 22 + ")");
                legend.append("text")
                  .attr("transform", "translate(" + 30 + "," + (i * 22 + 6) + ")")
                  .style("fill", '#000')
                  .style('font-size', lengendFontSize)
                  .text(d)
              })
              .style('cursor', 'pointer')
              .on("click", "alert(4)")
          }

        }

        //定义缩放及选择
        let zoom = d3.zoom()
          .scaleExtent([0.8, 10])
          .on("zoom", zoomed);

        function zoomed() {
          svg.select(".cells").attr("transform", d3.event.transform);
          xSvgAxis.call(xAxis.scale(d3.event.transform.rescaleX(xScale)));
          ySvgAxis.call(yAxis.scale(d3.event.transform.rescaleY(yScale)));
        }

        svg.call(zoom)
        //缩放及圈选cell结束


      }
    },
    mounted() {

      this.initPlot()
    },
    created() {
      this.formatPlotData()
    }

  }

</script>
<style scoped>

</style>
