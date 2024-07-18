document.addEventListener("DOMContentLoaded", () => {
  // Initialize the map
  initMap();

  // Fetch and create the City Orders Chart
  fetch("/admin/orders-by-city")
    .then((response) => response.json())
    .then((data) => createCityOrdersChart(data))
    .catch((error) => console.error("Error fetching city orders data:", error));

  // Fetch and create the Product Counts per Brand Chart
  fetch("/admin/products-by-brand")
    .then((response) => response.json())
    .then((data) => createProductsByBrandChart(data))
    .catch((error) =>
      console.error("Error fetching product counts data:", error)
    );

  // Fetch and create the Products by Category Chart
  fetch("/admin/products-by-category")
    .then((response) => response.json())
    .then((data) => createProductsByCategoryChart(data))
    .catch((error) =>
      console.error("Error fetching product counts by category data:", error)
    );
});

function initMap() {
  // Initialize the Google Map
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 0, lng: 0 }, // Default center
    zoom: 2,
  });

  // Initialize the Geocoder
  const geocoder = new google.maps.Geocoder();
  let mapBounds;

  // Fetch addresses and place markers on the map
  fetch("/admin/orders-locations")
    .then((response) => response.json())
    .then((addresses) => geocodeAddresses(addresses, geocoder, map, mapBounds))
    .catch((error) => console.error("Error fetching addresses:", error));
}

function geocodeAddresses(addresses, geocoder, map, mapBounds) {
  // Initialize mapBounds if it doesn't exist
  if (!mapBounds) {
    mapBounds = new google.maps.LatLngBounds();
  }

  addresses.forEach((address) => {
    // Check if all required fields exist in the current address object
    if (address.street && address.city && address.country && address.zipCode) {
      const fullAddress = `${address.street}, ${address.city}, ${address.country}, ${address.zipCode}`;
      console.log("Geocoding address:", fullAddress); // Log address being geocoded

      geocoder.geocode({ address: fullAddress }, (results, status) => {
        console.log("Geocoding results:", results); // Log geocoding results
        console.log("Geocoding status:", status); // Log geocoding status

        if (status === "OK") {
          const location = results[0].geometry.location;
          new google.maps.Marker({
            position: location,
            map: map,
            title: fullAddress,
          });

          // Adjust map bounds to include all markers
          mapBounds.extend(location);
          map.fitBounds(mapBounds);
        } else {
          console.error(
            "Geocode was not successful for the following reason:",
            status
          );
        }
      });
    } else {
      console.error("Address data is incomplete:", address);
    }
  });
}

function createCityOrdersChart(data) {
  // Set dimensions and margins
  const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Remove any existing SVG
  d3.select("#cityOrdersChart").selectAll("*").remove();

  // Append SVG to the container
  const svg = d3
    .select("#cityOrdersChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set x and y scales
  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // Set the domains
  x.domain(data.map((d) => d.city)); // Set domain for x-axis
  y.domain([0, d3.max(data, (d) => d.count)]); // Set domain for y-axis

  // Add x axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y axis with formatting
  svg
    .append("g")
    .call(d3.axisLeft(y).tickFormat((d) => d3.format(".0f")(d))) // Format y-axis ticks as whole numbers
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Orders");

  // Add bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.city))
    .attr("y", (d) => y(d.count))
    .attr("width", x.bandwidth() * 0.6)
    .attr("height", (d) => height - y(d.count))
    .attr("fill", "#69b3a2")
    .attr("rx", 5) // Rounded corners
    .attr("ry", 5); // Rounded corners
}

function createProductsByBrandChart(data) {
  // Set dimensions and margins
  const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Remove any existing SVG
  d3.select("#productsByBrandChart").selectAll("*").remove();

  // Append SVG to the container
  const svg = d3
    .select("#productsByBrandChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set x and y scales
  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // Set the domains
  x.domain(data.map((d) => d.brand)); // Set domain for x-axis
  y.domain([0, d3.max(data, (d) => d.count)]); // Set domain for y-axis

  // Add x axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y axis with formatting
  svg
    .append("g")
    .call(d3.axisLeft(y).tickFormat((d) => d3.format(".0f")(d))) // Format y-axis ticks as whole numbers
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Products");

  // Add bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d.brand))
    .attr("y", (d) => y(d.count))
    .attr("width", x.bandwidth() * 0.6)
    .attr("height", (d) => height - y(d.count))
    .attr("fill", "#69b3a2")
    .attr("rx", 5) // Rounded corners
    .attr("ry", 5); // Rounded corners
}

function createProductsByCategoryChart(data) {
  // Set dimensions and margins
  const margin = { top: 30, right: 30, bottom: 70, left: 60 },
    width = 400 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Remove any existing SVG
  d3.select("#productsByCategoryChart").selectAll("*").remove();

  // Append SVG to the container
  const svg = d3
    .select("#productsByCategoryChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Set x and y scales
  const x = d3.scaleBand().range([0, width]).padding(0.1);
  const y = d3.scaleLinear().range([height, 0]);

  // Set the domains
  x.domain(data.map((d) => d._id)); // Set domain for x-axis
  y.domain([0, d3.max(data, (d) => d.count)]); // Set domain for y-axis

  // Add x axis
  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

  // Add y axis with formatting
  svg
    .append("g")
    .call(d3.axisLeft(y).tickFormat((d) => d3.format(".0f")(d))) // Format y-axis ticks as whole numbers
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Number of Products");

  // Add bars
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => x(d._id))
    .attr("y", (d) => y(d.count))
    .attr("width", x.bandwidth() * 0.6)
    .attr("height", (d) => height - y(d.count))
    .attr("fill", "#69b3a2")
    .attr("rx", 5) // Rounded corners
    .attr("ry", 5); // Rounded corners
}
