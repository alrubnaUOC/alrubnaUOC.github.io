var codigo_pais = "EUR";
var tipo = "diario";

function cambiaVacunas(value){
  update();
}

function cambiaTipo(value) {
  tipo = value;
  update();
}

var margin = { top: 80, right: 80, bottom: 80, left: 80 },
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var svg_bar = d3
  .select("#bar")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x;
var eje_x;
var max_y;
var y;
var y_linea;
var max_y_linea;
var eje_y_bar;
var eje_y_linea;
var barras;
var valueline_total;
var valueline_COM;
var valueline_UNK;
var valueline_MOD;
var valueline_AZ;
var valueline_JANSS;
var linea;


function grafico() {

  d3.csv("datos.csv", (data) => {
    data = data.filter(
      (row) => row["codigo_pais"] == codigo_pais && row["semana"] > "2021"
    );

    nombre_pais = data
      .filter((d) => (d.codigo_pais = codigo_pais))
      .map((d) => d.nombre_pais)[0];

    x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.semana))
      .padding(0.1);

    eje_x = svg_bar
      .append("g")
      .attr("class", "eje_x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    max_y = Math.max(...data.map((d) => parseInt(+d.fallecidos)));

    y = d3.scaleLinear().domain([0, max_y]).range([height, 0]);

    max_y_linea = Math.max(...data.map((d) => d.porc_vacunados_acum));

    if (max_y_linea >= .8) { max_y_linea = 1.0 } 
    else if(max_y_linea >= 0.5) { max_y_linea = 0.8 }
    else if(max_y_linea >= 0.3) { max_y_linea = 0.5 }
    else if(max_y_linea >= 0.2) { max_y_linea = 0.3 }
    else {max_y_linea = 0.2 }

    y_linea = d3.scaleLinear().domain([0, max_y_linea]).range([height, 0]);

    eje_y_bar = svg_bar
      .append("g")
      .attr("class", "axisSteelBlue")
      .call(d3.axisLeft(y));

    var formatPercent = d3.format(".0%");

    eje_y_linea = svg_bar
      .append("g")
      .attr("class", "axisRed")
      .attr("transform", "translate( " + width + ", 0 )")
      .call(d3.axisRight(y_linea).tickFormat(formatPercent));

    barras = svg_bar
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "barras")
      .attr("x", (d) => x(d.semana))
      .attr("y", (d) => y(d.fallecidos))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.fallecidos));

    valueline_COM = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_COM));

    linea_COM = svg_bar
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "line_COM")
      .style("stroke", "orange")
      .style("stroke-width", 2)
      .attr("d", valueline_COM);


    valueline_UNK = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_UNK));

    linea_UNK = svg_bar
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "line_UNK")
      .style("stroke", "red")
      .style("stroke-width", 2)
      .attr("d", valueline_UNK);


    valueline_MOD = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_MOD));

    linea_MOD = svg_bar
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "line_MOD")
      .style("stroke", "purple")
      .style("stroke-width", 2)
      .attr("d", valueline_MOD);

    valueline_AZ = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_AZ));

    linea_AZ = svg_bar
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "line_AZ")
      .style("stroke", "blue")
      .style("stroke-width", 2)
      .attr("d", valueline_AZ);

    valueline_JANSS = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_JANSS));

    linea_JANSS = svg_bar
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "line_JANSS")
      .style("stroke", "green")
      .style("stroke-width", 2)
      .attr("d", valueline_JANSS);

    valueline_total = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_vacunados_acum));

    linea = svg_bar
      .append("path")
      .data([data])
      .attr("class", "line")
      .attr("id", "line_total")
      .style("stroke", "steelblue")
      .style("stroke-width", 3)
      .attr("d", valueline_total);

    svg_bar
      .selectAll("mybar")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "puntos")
      .attr("id", "puntos-total")
      .attr("cx", (d) => x(d.semana) + x.bandwidth() / 2)
      .attr("cy", (d) => y_linea(d.porc_vacunados_acum))
      .attr("r", 4)
      .style("stroke", "red")
      .style("fill", "#2ecfff");

    svg_bar
      .append("circle")
      .attr("cx", width - 35)
      .attr("cy", -25)
      .attr("r", 4)
      .style("stroke", "red")
      .style("fill", "#2ecfff");

    svg_bar
      .append("text")
      .attr("x", width - 25)
      .attr("y", -25)
      .text("vacunados (%)")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");


    svg_bar
      .append("rect")
      .attr("x", -30)
      .attr("y", -25)
      .attr("height", 10)
      .attr("width", 10)
      .style("fill", "#69b3a2");

    svg_bar
      .append("text")
      .attr("x", -15)
      .attr("y", -18)
      .text("fallecidos")
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");


    svg_bar
      .append("text")
      .attr("class", "nombre_pais")
      .attr("x", parseInt(width / 2 - 50))
      .attr("y", -40)
      .text(nombre_pais)
      .style("font-size", "30px")
      .attr("alignment-baseline", "middle");

    svg_bar
      .append("text")
      .attr("x",( width / 2) - 50)
      .attr("y", height + 60)
      .text("año-semana")
      .style("font-size", "20px")
      .attr("alignment-baseline", "middle");

  });
}

grafico();



function update() {

  if (tipo != "diario" && tipo != "acumulado") {
    tipo = "diario";
  }

  d3.csv("datos.csv", (data) => {
    var data_pais = data.filter(
      (row) => row["codigo_pais"] == codigo_pais && row["semana"] > "2021"
    );


    if (data_pais.length === 0) {
      codigo_pais = "EUR";
      data_pais = data.filter((row) => row["codigo_pais"] == codigo_pais && row["semana"] > "2021")
    }

    x.domain(data_pais.map((d) => d.semana));

    nombre_pais = data_pais
      .filter((d) => (d.codigo_pais = codigo_pais))
      .map((d) => d.nombre_pais)[0];

    svg_bar
      .select(".eje_x")
      .transition()
      .duration(2000)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    if (tipo == "diario") {
      max_y = Math.max(...data_pais.map((d) => parseInt(+d.fallecidos)));
    } else {
      max_y = Math.max(...data_pais.map((d) => parseInt(+d.fallecidos_acumulado)));
    }
   
    y.domain([0, max_y]).range([height, 0]);

    max_y_total = Math.max(...data_pais.map((d) => d.porc_vacunados_acum));
    max_y_COM = Math.max(...data_pais.map((d) => d.porc_acum_COM));
    max_y_UNK = Math.max(...data_pais.map((d) => d.porc_acum_UNK));
    max_y_MOD = Math.max(...data_pais.map((d) => d.porc_acum_MOD));
    max_y_AZ = Math.max(...data_pais.map((d) => d.porc_acum_AZ));
    max_y_JANSS = Math.max(...data_pais.map((d) => d.porc_acum_JANSS));

    max_y_linea = 0;

    if (document.getElementById('todas').checked) {
      var max_y_linea = Math.max(max_y_linea, max_y_total);
    }

    if (document.getElementById('COM').checked) {
      var max_y_linea = Math.max(max_y_linea, max_y_COM);
    }

    if (document.getElementById('UNK').checked) {
      var max_y_linea = Math.max(max_y_linea, max_y_UNK);
    }

    if (document.getElementById('MOD').checked) {
      var max_y_linea = Math.max(max_y_linea, max_y_MOD);
    }

    if (document.getElementById('AZ').checked) {
      var max_y_linea = Math.max(max_y_linea, max_y_AZ);
    }

    if (document.getElementById('JANSS').checked) {
      var max_y_linea = Math.max(max_y_linea, max_y_JANSS);
    }


    if (max_y_linea >= 0.8) { max_y_linea = 1.0 } 
    else if(max_y_linea >= 0.5) { max_y_linea = 0.8 }
    else if(max_y_linea >= 0.3) { max_y_linea = 0.5 }
    else if(max_y_linea >= 0.2) { max_y_linea = 0.3 }
    else if(max_y_linea >= 0.1) { max_y_linea = 0.2 }
    else {max_y_linea = 0.1 }

    y_linea = d3.scaleLinear().domain([0, max_y_linea]).range([height, 0]);

    var formatPercent = d3.format(".0%");

    svg_bar
      .select(".axisRed")
      .transition()
      .duration(2000)
      .call(d3.axisRight(y_linea).tickFormat(formatPercent));          

    svg_bar
      .select(".axisSteelBlue")
      .transition()
      .duration(2000)
      .call(d3.axisLeft(y));

    valueline_COM = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_COM));

    linea_COM = svg_bar
      .select("#line_COM")
      .data([data_pais])
      .transition()
      .duration(2000)
      .attr("d", valueline_COM);            

    const vacuna_COM = document.getElementById('COM').checked;

    if (vacuna_COM) {
      svg_bar.selectAll("#line_COM").style("visibility", "visible");
    } else {
      svg_bar.selectAll("#line_COM").style("visibility", "hidden");
    }

    valueline_UNK = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_UNK));

    linea_UNK = svg_bar
      .select("#line_UNK")
      .data([data_pais])
      .transition()
      .duration(2000)
      .attr("d", valueline_UNK);

    const vacuna_UNK = document.getElementById('UNK').checked;

    if (vacuna_UNK) {
      svg_bar.selectAll("#line_UNK").style("visibility", "visible");
    } else {
      svg_bar.selectAll("#line_UNK").style("visibility", "hidden");
    }

    valueline_MOD = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_MOD));

    linea_MOD = svg_bar
      .select("#line_MOD")
      .data([data_pais])
      .transition()
      .duration(2000)
      .attr("d", valueline_MOD);

    const vacuna_MOD = document.getElementById('MOD').checked;

    if (vacuna_MOD) {
      svg_bar.selectAll("#line_MOD").style("visibility", "visible");
    } else {
      svg_bar.selectAll("#line_MOD").style("visibility", "hidden");
    }

    valueline_AZ = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_AZ));

    linea_AZ = svg_bar
      .select("#line_AZ")
      .data([data_pais])
      .transition()
      .duration(2000)
      .attr("d", valueline_AZ);

    const vacuna_AZ = document.getElementById('AZ').checked;

    if (vacuna_AZ) {
      svg_bar.selectAll("#line_AZ").style("visibility", "visible");
    } else {
      svg_bar.selectAll("#line_AZ").style("visibility", "hidden");
    }

    valueline_JANSS = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_acum_JANSS));

    linea_JANSS = svg_bar
      .select("#line_JANSS")
      .data([data_pais])
      .transition()
      .duration(2000)
      .attr("d", valueline_JANSS);

    const vacuna_JANSS = document.getElementById('JANSS').checked;

    if (vacuna_JANSS) {
      svg_bar.selectAll("#line_JANSS").style("visibility", "visible");
    } else {
      svg_bar.selectAll("#line_JANSS").style("visibility", "hidden");
    }

    valueline_total = d3
      .line()
      .x((d) => x(d.semana) + x.bandwidth() / 2)
      .y((d) => y_linea(d.porc_vacunados_acum));

    svg_bar
      .select("#line_total")
      .data([data_pais])
      .transition()
      .duration(2000)
      .attr("d", valueline_total);

    svg_bar
      .selectAll("#puntos-total")
      .data(data_pais)
      .transition()
      .duration(2000)
      .attr("cx", (d) => x(d.semana) + x.bandwidth() / 2)
      .attr("cy", (d) => y_linea(d.porc_vacunados_acum))
      .attr("r", 4)
      .style("stroke", "red")
      .style("fill", "#2ecfff");

    const vacuna_total = document.getElementById('todas').checked;

    if (vacuna_total) {
      svg_bar.selectAll("#line_total").style("visibility", "visible");
      svg_bar.selectAll("#puntos-total").style("visibility", "visible");
    } else {
      svg_bar.selectAll("#line_total").style("visibility", "hidden");
      svg_bar.selectAll("#puntos-total").style("visibility", "hidden");
    }

    if (tipo == "diario") {
      svg_bar
        .selectAll("rect")
        .data(data_pais)
        .transition() 
        .duration(2000)
        .attr("x", (d) => x(d.semana))
        .attr("y", (d) => y(d.fallecidos))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.fallecidos))
        .attr("fill", "#69b3a2");
    } else {
      svg_bar
        .selectAll("rect")
        .data(data_pais)
        .transition()
        .duration(2000)
        .attr("x", (d) => x(d.semana))
        .attr("y", (d) => y(d.fallecidos_acumulado))
        .attr("width", x.bandwidth())
        .attr("height", (d) => height - y(d.fallecidos_acumulado))
        .attr("fill", "#69b3a2");
    }

    svg_bar
      .select(".nombre_pais")
      .attr("x", parseInt(width / 2) - nombre_pais.length*8)
      .attr("y", -40)
      .text(nombre_pais)
      .style("font-size", "30px")
      .attr("alignment-baseline", "middle");

  });
}
