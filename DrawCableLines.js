class DrawCableLines {

  getAngle(x1, y1, x2, y2) {
    // 直角的边长
    var x = Math.abs(x1 - x2);
    var y = Math.abs(y1 - y2);
    // 斜边长
    var z = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    // 余弦
    var cos = y / z;
    // 弧度
    var radina = Math.acos(cos);
    // 角度
    var angle = 180 / (Math.PI / radina);
    if (x2 >= x1 && y2 <= y1) {
      return angle;
    } else if (x2 <= x1 && y2 <= y1) {
      var result = 180 - angle;
      return result;
    } else if (x2 <= x1 && y2 >= y1) {
      var result = 180 + angle;
      return result;
    } else if (x2 >= x1 && y2 >= y1) {
      var result = 360 - angle;
      return result;
    }
  };

  //计算两个坐标点之间的距离
  getDistance(point, dot) {
    var lat1 = point.y;
    var lng1 = point.x;
    var lat2 = dot.y;
    var lng2 = dot.x;
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  };

  //顺时针旋转点
  rotateByPointClockwise (pt,point,angle){
    var point_x = (pt.x-point.x)*Math.cos(Math.PI/(180/angle))-(pt.y-point.y)*Math.sin(Math.PI/(180/angle))+point.x;
    var point_y = (pt.y-point.y)*Math.cos(Math.PI/(180/angle))+(pt.x-point.x)*Math.sin(Math.PI/(180/angle))+point.y;
    var point_dx = new mapboxgl.Point(point_x,point_y);
    return point_dx;
  }

  //画切线
  //point 圆外的一点
  //dot 圆心
  //r 半径
  drawCircleTangent(point, dot, tablename, line_num, zoomNum, map) {
    var lineFeatures = {
      "type": "FeatureCollection",
      "features": []
    };
    // 屏幕坐标向地图坐标的转换
    var lonlat = map.unproject(new mapboxgl.Point(30, 30));
    var r = "";
    if (zoomNum < 18) {
      r = (Number(lonlat.lat) - Number(30.60)) / 12000;
    } else if (zoomNum >= 18) {
      r = (Number(lonlat.lat) - Number(30.60)) / 7500;
    }
    var x1 = point.x;
    var x2 = dot.x;
    var y1 = point.y;
    var y2 = dot.y;
    var angle = this.getAngle(x1, y1, x2, y2);

    var a = Number(point.x) - Number(r);
    var c = Number(point.x) + Number(r);
    var b = Number(point.y) + Number(r);
    var d = Number(point.y) - Number(r);

    //旋转前
    var point_1_1 = new mapboxgl.Point(a, b);//-+
    var point_1_2 = new mapboxgl.Point(c, b);//++
    var point_1_3 = new mapboxgl.Point(c, d);//+-
    var point_1_4 = new mapboxgl.Point(a, d);//--

    //旋转后
    point_1_1 = this.rotateByPointClockwise (point_1_1,point,angle);
    point_1_2 = this.rotateByPointClockwise (point_1_2,point,angle);
    point_1_3 = this.rotateByPointClockwise (point_1_3,point,angle);
    point_1_4 = this.rotateByPointClockwise (point_1_4,point,angle);

    var d1 = this.getDistance(point_1_1, dot);
    var d2 = this.getDistance(point_1_2, dot);
    var d3 = this.getDistance(point_1_3, dot);
    var d4 = this.getDistance(point_1_4, dot);
    //alert("d1:"+d1+"<br>d2:"+d2+"<br>d3:"+d3+"<br>d4:"+d4);

    var e = Number(dot.x) - Number(r);
    var f = Number(dot.x) + Number(r);
    var g = Number(dot.y) + Number(r);
    var h = Number(dot.y) - Number(r);

    var point_11_1 = new mapboxgl.Point(e, g);//-+
    var point_11_2 = new mapboxgl.Point(f, g);//++
    var point_11_3 = new mapboxgl.Point(f, h);//+-
    var point_11_4 = new mapboxgl.Point(e, h);//--

    //旋转后
    point_11_1 = this.rotateByPointClockwise (point_11_1,dot,angle);
    point_11_2 = this.rotateByPointClockwise (point_11_2,dot,angle);
    point_11_3 = this.rotateByPointClockwise (point_11_3,dot,angle);
    point_11_4 = this.rotateByPointClockwise (point_11_4,dot,angle);

    var d11 = this.getDistance(point_11_1, point);
    var d12 = this.getDistance(point_11_2, point);
    var d13 = this.getDistance(point_11_3, point);
    var d14 = this.getDistance(point_11_4, point);
    //alert("d11:"+d11+"<br>d12:"+d12+"<br>d13:"+d13+"<br>d14:"+d14);

    //判断距离原点最近的点，计算等分点坐标
    if (((d1 + d2) >= (d3 + d4)) && ((d11 + d12) >= (d13 + d14))) {
      //d3 d4 d13 d14
      //计算等分点坐标
      var x_3 = point_1_3.x;
      var y_3 = point_1_3.y;
      var x_4 = point_1_4.x;
      var y_4 = point_1_4.y;

      var x_13 = point_11_3.x;
      var y_13 = point_11_3.y;
      var x_14 = point_11_4.x;
      var y_14 = point_11_4.y;

      for (var i = 0; i < line_num; i++) {
        var point_df1 = {};
        var point_df11 = {};
        //等分点坐标
        if ((x_3 >= x_4) && (y_3 >= y_4)) {
          var x_df = (x_3 - x_4) / (line_num + 1);
          var y_df = (y_3 - y_4) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_4 + x_df * (i + 1), y_4 + y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        } else if ((x_3 >= x_4) && (y_3 <= y_4)) {
          var x_df = (x_3 - x_4) / (line_num + 1);
          var y_df = (y_4 - y_3) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_4 + x_df * (i + 1), y_4 - y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        } else if ((x_3 <= x_4) && (y_3 >= y_4)) {
          var x_df = (x_4 - x_3) / (line_num + 1);
          var y_df = (y_3 - y_4) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_3 + x_df * (i + 1), y_3 - y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        } else if ((x_3 <= x_4) && (y_3 <= y_4)) {
          var x_df = (x_4 - x_3) / (line_num + 1);
          var y_df = (y_4 - y_3) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_3 + x_df * (i + 1), y_3 + y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        }
        var lineObj = this.show_dl(point_df1, point_df11, tablename, i, line_num, map);
        if (lineObj != null) {
          lineFeatures.features.push(lineObj);
        }
      }
    } else if (((d1 + d2) <= (d3 + d4)) && ((d11 + d12) >= (d13 + d14))) {
      //d1 d2 d13 d14
      //计算等分点坐标
      var x_1 = point_1_1.x;
      var y_1 = point_1_1.y;
      var x_2 = point_1_2.x;
      var y_2 = point_1_2.y;

      var x_13 = point_11_3.x;
      var y_13 = point_11_3.y;
      var x_14 = point_11_4.x;
      var y_14 = point_11_4.y;

      for (var i = 0; i < line_num; i++) {
        var point_df1 = {};
        var point_df11 = {};
        //等分点坐标
        if ((x_1 >= x_2) && (y_1 >= y_2)) {
          var x_df = (x_1 - x_2) / (line_num + 1);
          var y_df = (y_1 - y_2) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_2 + x_df * (i + 1), y_2 + y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        } else if ((x_1 >= x_2) && (y_1 <= y_2)) {
          var x_df = (x_1 - x_2) / (line_num + 1);
          var y_df = (y_2 - y_1) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_2 + x_df * (i + 1), y_2 - y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        } else if ((x_1 <= x_2) && (y_1 >= y_2)) {
          var x_df = (x_2 - x_1) / (line_num + 1);
          var y_df = (y_1 - y_2) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_1 + x_df * (i + 1), y_1 - y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        } else if ((x_1 <= x_2) && (y_1 <= y_2)) {
          var x_df = (x_2 - x_1) / (line_num + 1);
          var y_df = (y_2 - y_1) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_1 + x_df * (i + 1), y_1 + y_df * (i + 1));
          if ((x_13 >= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 + y_df1 * (i + 1));
          } else if ((x_13 >= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_13 - x_14) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_14 + x_df1 * (i + 1), y_14 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 >= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_13 - y_14) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 - y_df1 * (i + 1));
          } else if ((x_13 <= x_14) && (y_13 <= y_14)) {
            var x_df1 = (x_14 - x_13) / (line_num + 1);
            var y_df1 = (y_14 - y_13) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_13 + x_df1 * (i + 1), y_13 + y_df1 * (i + 1));
          }
        }
        var lineObj = this.show_dl(point_df1, point_df11, tablename, i, line_num, map);
        if (lineObj != null) {
          lineFeatures.features.push(lineObj);
        }
      }
    } else if (((d1 + d2) >= (d3 + d4)) && ((d11 + d12) <= (d13 + d14))) {
      //d3 d4 d11 d12
      //计算等分点坐标
      var x_3 = point_1_3.x;
      var y_3 = point_1_3.y;
      var x_4 = point_1_4.x;
      var y_4 = point_1_4.y;

      var x_11 = point_11_1.x;
      var y_11 = point_11_1.y;
      var x_12 = point_11_2.x;
      var y_12 = point_11_2.y;

      for (var i = 0; i < line_num; i++) {
        var point_df1 = {};
        var point_df11 = {};
        //等分点坐标
        if ((x_3 >= x_4) && (y_3 >= y_4)) {
          var x_df = (x_3 - x_4) / (line_num + 1);
          var y_df = (y_3 - y_4) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_4 + x_df * (i + 1), y_4 + y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        } else if ((x_3 >= x_4) && (y_3 <= y_4)) {
          var x_df = (x_3 - x_4) / (line_num + 1);
          var y_df = (y_4 - y_3) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_4 + x_df * (i + 1), y_4 - y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        } else if ((x_3 <= x_4) && (y_3 >= y_4)) {
          var x_df = (x_4 - x_3) / (line_num + 1);
          var y_df = (y_3 - y_4) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_3 + x_df * (i + 1), y_3 - y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        } else if ((x_3 <= x_4) && (y_3 <= y_4)) {
          var x_df = (x_4 - x_3) / (line_num + 1);
          var y_df = (y_4 - y_3) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_3 + x_df * (i + 1), y_3 + y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        }
        var lineObj = this.show_dl(point_df1, point_df11, tablename, i, line_num, map);
        if (lineObj != null) {
          lineFeatures.features.push(lineObj);
        }
      }

    } else if (((d1 + d2) <= (d3 + d4)) && ((d11 + d12) <= (d13 + d14))) {
      //d1 d2 d11 d12
      //计算等分点坐标
      var x_1 = point_1_1.x;
      var y_1 = point_1_1.y;
      var x_2 = point_1_2.x;
      var y_2 = point_1_2.y;

      var x_11 = point_11_1.x;
      var y_11 = point_11_1.y;
      var x_12 = point_11_2.x;
      var y_12 = point_11_2.y;

      for (var i = 0; i < line_num; i++) {
        var point_df1 = {};
        var point_df11 = {};
        //等分点坐标
        if ((x_1 >= x_2) && (y_1 >= y_2)) {
          var x_df = (x_1 - x_2) / (line_num + 1);
          var y_df = (y_1 - y_2) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_2 + x_df * (i + 1), y_2 + y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_12 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        } else if ((x_1 >= x_2) && (y_1 <= y_2)) {
          var x_df = (x_1 - x_2) / (line_num + 1);
          var y_df = (y_2 - y_1) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_2 + x_df * (i + 1), y_2 - y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_12 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        } else if ((x_1 <= x_2) && (y_1 >= y_2)) {
          var x_df = (x_2 - x_1) / (line_num + 1);
          var y_df = (y_1 - y_2) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_1 + x_df * (i + 1), y_1 - y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_12 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        } else if ((x_1 <= x_2) && (y_1 <= y_2)) {
          var x_df = (x_2 - x_1) / (line_num + 1);
          var y_df = (y_2 - y_1) / (line_num + 1);
          point_df1 = new mapboxgl.Point(x_1 + x_df * (i + 1), y_1 + y_df * (i + 1));
          if ((x_11 >= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 + y_df1 * (i + 1));
          } else if ((x_11 >= x_12) && (y_12 <= y_12)) {
            var x_df1 = (x_11 - x_12) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_12 + x_df1 * (i + 1), y_12 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 >= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_11 - y_12) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 - y_df1 * (i + 1));
          } else if ((x_11 <= x_12) && (y_11 <= y_12)) {
            var x_df1 = (x_12 - x_11) / (line_num + 1);
            var y_df1 = (y_12 - y_11) / (line_num + 1);
            point_df11 = new mapboxgl.Point(x_11 + x_df1 * (i + 1), y_11 + y_df1 * (i + 1));
          }
        }
        var lineObj = this.show_dl(point_df1, point_df11, tablename, i, line_num, map);
        if (lineObj != null) {
          lineFeatures.features.push(lineObj);
        }
      }
    }
    return lineFeatures;
  };

  //渲染电缆段
  show_dl(point_df1, point_df11, tablename, i, line_num, map) {
    if (line_num == 0) {
      console.log("没有查询到电缆！");
      return null;
    } else {
      var featureObj = {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "LineString",
          "coordinates": []
        }
      };
      featureObj.properties["tablename"] = tablename;
      featureObj.properties["sbmc"] = "";
      featureObj.geometry["coordinates"] = [[point_df1.x, point_df1.y], [point_df11.x, point_df11.y]];
      return featureObj;
    }
  };

  //生成埋设
  createCableLines(point, dot, tablename, line_num, zoomNum, map) {
    return this.drawCircleTangent(point, dot, tablename, line_num, zoomNum, map);
  };

}

export default DrawCableLines;
