document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page; // "custom" or "Sedan" or "SUV" or "Truck"
  const container = document.getElementById("templateContainer");

  if (!container) return;

  let vehicles = [];

  console.log("data-page:", page);

  if (page === "custom") {
    vehicles = [
        { src: "/images/vehicles/dog-car.jpg", alt: "Dog Car", name: "Dog Car", price: "$35,000" },
        { src: "/images/vehicles/batmobile.jpg", alt: "Batmobile Custom", name: "Batmobile Custom", price: "$65,000" },
        { src: "/images/vehicles/model-t.jpg", alt: "Model-T", name: "Model-T", price: "$110,000" },
        { src: "/images/vehicles/aerocar.jpg", alt: "Aero Car", name: "Aero Car", price: "$78,000" },
        { src: "/images/vehicles/monster-truck.jpg", alt: "Monster Truck", name: "Monster Truck", price: "$90,000" },
        { src: "/images/vehicles/mystery-van.jpg", alt: "Mystery Van", name: "Mystery Van", price: "$37,500" }
    ];
  } else if (page === "sedan") {
    vehicles = [
        { src: "/images/vehicles/adventador.jpg", alt: "Adventador", name: "Adventador", price: "$95,000" },
        { src: "/images/vehicles/camaro.jpg", alt: "Camaro", name: "Camaro", price: "$110,000" },
        { src: "/images/vehicles/crwn-vic.jpg", alt: "Crown", name: "Crown", price: "$58,000" },
        { src: "/images/vehicles/mechanic.jpg", alt: "Mechanic", name: "Mechanic", price: "$43,000" },
        { src: "/images/vehicles/survan.jpg", alt: "Survan", name: "Survan", price: "$28,500" },
        { src: "/images/vehicles/no-image.png", alt: "NA", name: "NA", price: "$0" }
    ];
   } else if (page === "suv") {
    vehicles = [
        { src: "/images/vehicles/wrangler.jpg", alt: "Wrangler", name: "Wrandler", price: "$112,000" },
        { src: "/images/vehicles/hummer.jpg", alt: "Hummer", name: "Hummer", price: "$100,000" },
        { src: "/images/vehicles/escalade.jpg", alt: "Escalade", name: "Escalade", price: "$58,000" },
        { src: "/images/vehicles/adventador.jpg", alt: "Adventador", name: "Adventador", price: "$95,000" },
        { src: "/images/vehicles/survan.jpg", alt: "Survan", name: "Survan", price: "$28,500" },
        { src: "/images/vehicles/camaro.jpg", alt: "Camaro", name: "Camaro", price: "$110,000" }
    ];
   } else if (page === "truck") {
    vehicles = [
        { src: "/images/vehicles/monster-truck.jpg", alt: "Monster Truck", name: "Monster Truck", price: "$90,000" },
        { src: "/images/vehicles/fire-truck.jpg", alt: "Fire Truck", name: "Fire Truck", price: "$118,000" },
        { src: "/images/vehicles/mystery-van.jpg", alt: "Mystery Van", name: "Mystery Van", price: "$37,500" },
        { src: "/images/vehicles/mechanic.jpg", alt: "Mechanic", name: "Mechanic", price: "$43,000" },
        { src: "/images/vehicles/no-image.png", alt: "NA", name: "NA", price: "$0" },
        { src: "/images/vehicles/wrangler.jpg", alt: "Wrangler", name: "Wrandler", price: "$112,000" }
    ];
  } 

    container.innerHTML = "";
    
    vehicles.forEach(vehicle => {
    const figure = document.createElement("figure");

    const img = document.createElement("img");
    img.src = vehicle.src;
    img.alt = vehicle.alt;

    const nameCaption = document.createElement("figcaption");
    nameCaption.textContent = vehicle.name;

    const priceP = document.createElement("p");
    priceP.classList.add("price");
    priceP.textContent = vehicle.price;

    figure.appendChild(img);
    figure.appendChild(nameCaption);
    figure.appendChild(priceP);

    container.appendChild(figure);
  });
});



