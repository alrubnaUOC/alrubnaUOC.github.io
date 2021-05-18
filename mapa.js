d3.csv("datos.csv", (data) => {

    var max_porc = Math.max(...data.map((d) => +d.porc_vacunados_acum));

    var color = d3
      .scaleLinear()
      .domain([0, max_porc])
      .range(["azure", "steelblue"]);


    var svg = d3
      .select("#mapa")
      .append("svg")
      .attr("width", 500)
      .attr("height", 400)
      .attr("class", "mapa");

    var projection = d3.geoMercator().scale(290).center([70, 53]);

    var geoPath = d3.geoPath().projection(projection);

    d3.queue().defer(d3.json, "world-110m.geojson").await(ready);


    function ready(error, countries) {
      svg
        .append("g")
        .selectAll("path")
        .data(countries.features)
        .enter()
        .append("path")
        .attr("d", geoPath)
        .attr("class", "country")
        .attr("fill", (d) => {
          porcentajes = data
            .filter((registro) => registro.codigo_pais === d.id)
            .map((pais) => pais.porc_vacunados_acum);
          porc = porcentajes[porcentajes.length - 1];
          if (porc) {
            return color(porc);
          } else {
            return color(0);
          }
        });

      svg
        .selectAll("path")
        .on("mousedown", function (d) {
          if (codigo_pais !== d.id ) {
            d3.selectAll("path").classed("active", false);
            d3.select(this).classed("active", true);
            codigo_pais = d.id;
            tipo = document.querySelector('input[name="tipo"]:checked').value;
            update();
          } else {
            d3.select(this).classed("active", false);
            codigo_pais = "EUR";
            tipo = document.querySelector('input[name="tipo"]:checked').value;
            update();
          }
        })
        .on("mouseover", function (d) {
          var posX = d3.event.pageX - 50;
          var posY = d3.event.pageY - 30;
          var tooltip = d3
            .select(".detalle")
            .style("left", posX + "px")
            .style("top", posY + "px")
            .transition()
            .duration(300)
            .style("opacity", 0.95);

          var nombre_pais = data
            .filter((registro) => registro.codigo_pais === d.id)
            .map((pais) => pais.nombre_pais);

          nombre_pais = nombre_pais[0]

          var html = "";

          if (nombre_pais) {
            var html = html +  "<div>" + nombre_pais + "</div>";
            var porcentajes = data
              .filter((registro) => registro.codigo_pais === d.id)
              .map((pais) => pais.porc_vacunados_acum);
            var porc = parseInt(porcentajes[porcentajes.length - 1] * 100);

            if (porc) {
              var html = html +  "<div>" + porc + "%</div>";
            } 
            document.querySelector(".detalle").style.display = "block";
            document.querySelector(".nombre-pais").innerHTML = html;
          } else {
            document.querySelector(".detalle").style.display = "none";
            document.querySelector(".nombre-pais").innerHTML = '';
          }             
        })
        .on("mouseout", function (d) {
          d3.select(".detalle")
            .transition()
            .duration(500)
            .style("opacity", 0);
        });
    } // function
  }); // csv
