// 需要引入 components下的组件   ec-canvas

//html:
// <ec-canvas canvas-id="mychart-line" ec="{{ ec }}"></ec-canvas>


//js:
// data: {
// 	ec:{
// 		onInit: eChartLib(opt)
// 	}
// }
// ec可以整个动态赋值

//echart官方参数   https://echarts.apache.org/examples/zh/index.html
// opt = {
// 	xAxis: {
// 		type: 'category',
// 			data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
// 	},
// 	yAxis: {
// 		type: 'value'
// 	},
// 	series: [
// 		{
// 			data: [150, 230, 224, 218, 135, 147, 260],
// 			type: 'line'
// 		}
// 	]
// }



import * as echarts from '../components/ec-canvas/echarts';
export default function(opt){
	return function(canvas, width, height, dpr){
		const chart = echarts.init(canvas, null, {
			width: width,
			height: height,
			devicePixelRatio: dpr // new
		});
		canvas.setChart(chart);

		chart.setOption(opt);
		return chart;
	}
};