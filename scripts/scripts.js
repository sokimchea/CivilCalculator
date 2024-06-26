function showSection(sectionId) {
    // Hide all content sections
    var sections = document.querySelectorAll('.content-section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected section
    var selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}

// Show the home section by default
window.onload = function() {
    showSection('home');
};


function calculateRebar() {
    // Get the input values
    const b = parseFloat(document.getElementById('beamWidth').value);
    const h = parseFloat(document.getElementById('beamHeight').value);
    const Mu = parseFloat(document.getElementById('bendingMoment').value);
    const fck = parseFloat(document.getElementById('concreteStrength').value);
    const fy = parseFloat(document.getElementById('rebarStrength').value);
    const cc = parseFloat(document.getElementById('cover').value);
    const l = parseFloat(document.getElementById('spanLength').value);

    // Check for valid inputs
    if (isNaN(b) || isNaN(h) || isNaN(Mu) || isNaN(fck) || isNaN(fy) || isNaN(cc) || isNaN(l)) {
        document.getElementById('rebarResult').innerText = 'Please enter valid inputs for all fields.';
        return;
    }

    // Calculate effective depth (d)
    const d = h - cc -10;

    // Calculate required rebar area (Ast) using the simplified formula
    const rn= Mu*1000000/(0.9*b*d*d);
	const rho=0.85*fck/fy*(1-Math.sqrt(1-(2*rn/(0.85*fck))));
	const rho_min = Math.max((Math.sqrt(fck)/(4*fy)),(1.4/fy));
	const rho_req = Math.max(rho,rho_min);
	const As_req = b*d*rho_req
	
	
	
    // Display the result
    document.getElementById('rebarResult').innerText = `Required Rebar Area: ${As_req.toFixed(2)} mm²`;
}
function calculateCompaction() {
    // Get the input values
    const maxDryDensity = parseFloat(document.getElementById('maxDryDensity').value);
    const weightTray = parseFloat(document.getElementById('weightTray').value);
    const weightSoilTray = parseFloat(document.getElementById('weightSoilTray').value);
    const weightSandToolBefore = parseFloat(document.getElementById('weightSandToolBefore').value);
    const weightSandToolAfter = parseFloat(document.getElementById('weightSandToolAfter').value);
    const weightVolCone = parseFloat(document.getElementById('weightVolCone').value);
    const densitySand = parseFloat(document.getElementById('densitySand').value);
    const weightTart = parseFloat(document.getElementById('weightTart').value);
    const weightTartSample = parseFloat(document.getElementById('weightTartSample').value);
    const weightTartSampleDry = parseFloat(document.getElementById('weightTartSampleDry').value);

    // Calculate the outputs
    const massSandInHole = weightSandToolBefore - weightSandToolAfter-weightVolCone;
    const volumeSand = massSandInHole / densitySand;
    const massDrySample = weightTartSampleDry - weightTart;
    const waterContentSample = ((weightTartSample - weightTartSampleDry) / massDrySample) * 100;
    const dryMassSoil = (weightSoilTray - weightTray)/(1+waterContentSample/100);
    const dryDensityTestSoil = dryMassSoil / volumeSand;
    const compactionRatioK = (dryDensityTestSoil / maxDryDensity) * 100;

    // Display the results
    document.getElementById('massSandHole').innerText = `Mass of Sand in Hole: ${massSandInHole.toFixed(3)} kg`;
    document.getElementById('volumeSand').innerText = `Volume of Sand: ${volumeSand.toFixed(6)} m³`;
    document.getElementById('massDrySample').innerText = `Mass of Dry Sample: ${massDrySample.toFixed(3)} kg`;
    document.getElementById('waterContentSample').innerText = `Water Content of Sample: ${waterContentSample.toFixed(2)} %`;
    document.getElementById('dryMassSoil').innerText = `Dry Mass of Soil: ${dryMassSoil.toFixed(2)} kg`;
    document.getElementById('dryDensityTestSoil').innerText = `Dry Density of Test Soil: ${dryDensityTestSoil.toFixed(2)} kg/m³`;
    document.getElementById('compactionRatio').innerText = `Compaction Ratio K: ${compactionRatioK.toFixed(2)} %`;
}

function calculateBricks() {
	
    const wallLength = parseFloat(document.getElementById('wallLength').value);
    const wallHeight = parseFloat(document.getElementById('wallHeight').value);
    const wallThickness = parseFloat(document.getElementById('wallThickness').value);
    const brickLength = parseFloat(document.getElementById('Bricklength').value);
    const brickWidth = parseFloat(document.getElementById('Brickwidth').value);
    const brickHeight = parseFloat(document.getElementById('Brickheight').value);

    // Calculate the volume of the wall
    const wallVolume = wallLength * wallHeight * wallThickness;

    // Calculate the volume of one brick including mortar space (usually 10mm)
    const mortarThickness = parseFloat(document.getElementById('Mortarthickness').value);
    const brickWithMortarLength = brickLength + mortarThickness;
    const brickWithMortarWidth = brickWidth + mortarThickness;
    const brickWithMortarHeight = brickHeight + mortarThickness;
    const brickVolumeWithMortar = brickWithMortarLength * brickWithMortarWidth * brickWithMortarHeight;

    // Calculate the number of bricks
    const numBricks = Math.ceil(wallVolume / brickVolumeWithMortar);

    // Assuming a 1:4 ratio of cement to sand for mortar
    const cementRatio = parseFloat(document.getElementById('CementRatio').value);
    const sandRatio = parseFloat(document.getElementById('SandRatio').value);
    const totalRatio = cementRatio + sandRatio;

    // Calculate the total volume of mortar required (assuming 0.3m³ of mortar per 1m³ of brickwork)
    const mortarVolume = numBricks * mortarThickness*(brickLength+brickHeight)*(brickHeight);

    // Calculate the quantities of cement and sand
    const cementVolume = (mortarVolume * cementRatio) / totalRatio;
    const sandVolume = (mortarVolume * sandRatio) / totalRatio;

    // Convert volumes to more practical units (cubic meters)
    const qtyCement = cementVolume;
    const qtySand = sandVolume;

    // Display the results
    document.getElementById('numBricks').innerText = `Number of Bricks: ${numBricks}`;
    document.getElementById('qtySand').innerText = `Quantity of Sand: ${qtySand.toFixed(2)} m³`;
    document.getElementById('qtyCement').innerText = `Quantity of Cement: ${qtyCement.toFixed(2)} m³`;
}


function calculateMix() {
    const strength = parseFloat(document.getElementById('strength').value);
    const quantity = parseFloat(document.getElementById('quantity').value);

    // Assume standard mix ratio for different strength (simplified)
    let cementRatio, sandRatio, gravelRatio, waterRatio;

    if (strength <= 10) {
        cementRatio = 1;
        sandRatio = 3;
        gravelRatio = 6;
        waterRatio = 0.6;
    } else if (strength <= 15) {
        cementRatio = 1;
        sandRatio = 2;
        gravelRatio = 4;
        waterRatio = 0.5;
	} else if (strength <= 20) {
        cementRatio = 1;
        sandRatio = 1.5;
        gravelRatio = 3;
        waterRatio = 0.45;
	} else if (strength <= 25) {
        cementRatio = 1;
        sandRatio = 1;
        gravelRatio = 2;
        waterRatio = 0.4;
    } else {
        cementRatio = 1;
        sandRatio = 1;
        gravelRatio = 2;
        waterRatio = 0.4;
    }

    const totalRatio = cementRatio + sandRatio + gravelRatio;
	
	// Assuming densities (kg/m³):
    const cementDensity = 1440;
    const sandDensity = 1600;
    const gravelDensity = 1500;
    const waterDensity = 1;
	
    const cementVolume = (quantity * cementRatio) / totalRatio;
    const sandVolume = (quantity * sandRatio) / totalRatio;
    const gravelVolume = (quantity * gravelRatio) / totalRatio;
    const waterVolume = cementVolume*cementDensity* waterRatio;

    

    const cementQty = cementVolume * cementDensity;
    const sandQty = sandVolume * sandDensity;
    const gravelQty = gravelVolume * gravelDensity;
    const waterQty = waterVolume * waterDensity;

    document.getElementById('cementQty').innerText = `Cement: ${cementQty.toFixed(2)} kg`;
    document.getElementById('sandQty').innerText = `Sand: ${sandQty.toFixed(2)} kg = ${sandVolume.toFixed(2)} m3`;
    document.getElementById('gravelQty').innerText = `Gravel: ${gravelQty.toFixed(2)} kg = ${gravelVolume.toFixed(2)} m3 `;
    document.getElementById('waterQty').innerText = `Water: ${waterQty.toFixed(2)} L`;
}

function SlabFormworkCalculations() {
    // Retrieve values from inputs
    var dl = parseFloat(document.getElementById('dl').value);
    var ll = parseFloat(document.getElementById('ll').value);
    var uls = 2*dl+2*ll;
    var sls = dl+ll;
	
	//purlin verification
    var b = parseFloat(document.getElementById('b').value);
    var h = parseFloat(document.getElementById('h').value);
    var thicknessPurlin = parseFloat(document.getElementById('thickness_purlin').value);
    var spacingPurlin = parseFloat(document.getElementById('spacing_purlin').value);
    var lengthPurlin = parseFloat(document.getElementById('length_purlin').value);
    var q_uls_purlin = uls*spacingPurlin/1000;
    var mmax_purlin = q_uls_purlin*lengthPurlin*lengthPurlin/8/1000000;
	var purlin_moment_inertie = b*h*h*h/12-(b-2*thicknessPurlin)*Math.pow((h-2*thicknessPurlin),3)/12;
	var stress_max_purlin=mmax_purlin*h/2/purlin_moment_inertie*Math.pow(10,6);
	var	stress_allow_purlin = parseFloat(document.getElementById('strength_purlin').value);
	var safety_ratio_purlin= stress_allow_purlin/stress_max_purlin;
	var Verification_purlin="";
	
	
		// verification of safety_ratio_purlin
	
		if (safety_ratio_purlin >= 1) {
		Verification_purlin= `Purlin is passed with the safety ratio ${safety_ratio_purlin.toFixed(2)}`
		} else {
		Verification_purlin= `Purlin is failed, please revise`
		}
	
	
	// Rafter support rafter verification
	var b_rafter = parseFloat(document.getElementById('b_rafter').value);
	var h_rafter = parseFloat(document.getElementById('h_rafter').value);
	var thicknessRafter = parseFloat(document.getElementById('thickness_rafter').value);
    var spacingRafter = parseFloat(document.getElementById('spacing_rafter').value);
	var lengthRafter = parseFloat(document.getElementById('length_rafter').value);
	var q_uls_rafter = uls*spacingRafter/1000;
	var mmax_rafter = q_uls_rafter*lengthRafter*lengthRafter/8/1000000;
	var rafter_moment_inertie = b_rafter*h_rafter*h_rafter*h_rafter/12-(b_rafter-2*thicknessRafter)*Math.pow((h_rafter-2*thicknessRafter),3)/12;
	var stress_max_rafter=mmax_rafter*h_rafter/2/rafter_moment_inertie*Math.pow(10,6);
	var	stress_allow_rafter =parseFloat(document.getElementById('strength_rafter').value);
	
	var safety_ratio_rafter= stress_allow_rafter/stress_max_rafter;
	var Verification_rafter="";
	
	
		// verification of safety_ratio_rafter
	
		if (safety_ratio_rafter >= 1) {
		Verification_rafter= `Rafter is passed with the safety ratio ${safety_ratio_rafter.toFixed(2)}`
		} else {
		Verification_rafter= `Purlin is failed, please revise`
		}
	
	
	
		//  pipe column verification
	var pipe_column_dia = parseFloat(document.getElementById('dia').value);
	var pipe_column_thickness = parseFloat(document.getElementById('thickness_column').value);
	var column_height_calculation = parseFloat(document.getElementById('height_calculation').value);
    var column_height = parseFloat(document.getElementById('height_column').value);
	var column_module_elastic = parseFloat(document.getElementById('e').value);
	var column_strength = parseFloat(document.getElementById('strength_column_pile').value);
	var column_moment_inertie = 3.14*(Math.pow(pipe_column_dia,4)-Math.pow((pipe_column_dia-2*pipe_column_thickness),4))/64;
	var column_load_area = spacingRafter*lengthRafter;
	var column_axial_load=column_load_area*uls/Math.pow(10,6);
	var column_net_section= 3.14/4*Math.pow(pipe_column_dia,2)-3.14/4*Math.pow((pipe_column_dia-2*pipe_column_thickness),2);
	var	column_axial_strenght=column_strength*column_net_section/1000;
	var column_safety_ratio=column_axial_strenght/column_axial_load;
	
	
	
		// verification of safety_ratio_column
	
		if (column_safety_ratio >= 1) {
		Verification_column= `column is passed with the safety ratio ${column_safety_ratio.toFixed(2)} for section resistance`
		} else {
		Verification_column= `column is failed, please revise`
		}
	
	// verification of the stability of column
	
	var n_cr = Math.pow(3.14,2)*column_module_elastic*column_moment_inertie/Math.pow(column_height_calculation,2)/1000;
	var buckling_curve = 'd';
	var alpha = 0.76;
	var lamda_bar = Math.sqrt(column_net_section*column_strength/1000/n_cr);
	var column_phi = 0.5*(1+alpha*(lamda_bar-0.2)+lamda_bar*lamda_bar);
	var column_khi = 1/(column_phi+Math.sqrt(column_phi*column_phi-lamda_bar*lamda_bar));
	var column_axial_strenght_stability = column_khi*column_axial_strenght;
	var column_stability_safety_ratio = column_axial_strenght_stability/column_axial_load;
	
	// verification of safety_ratio_column_stability
	
		if (column_stability_safety_ratio >= 1) {
		Verification_column_stability= `column is passed with the stability safety ratio ${column_stability_safety_ratio.toFixed(2)} `
		} else {
		Verification_column_stability= `column is failed in stability, please revise`
		}
	
	
	

    // Display results
    document.getElementById('purlin_verification').innerText = Verification_purlin;
    document.getElementById('rafter_verification').innerText = Verification_rafter;
	document.getElementById('column_verification').innerText = Verification_column;
	document.getElementById('stability_verification').innerText = Verification_column_stability;
	
}

async function calculateHauling() {
    const soilVolume = parseFloat(document.getElementById('soilVolume').value);
    const bulkingFactor = parseFloat(document.getElementById('bulkingFactor').value);
    const truckCapacity = parseFloat(document.getElementById('truckCapacity').value);
    const cycleDuration = parseFloat(document.getElementById('cycleDuration').value);
    const finishDuration = parseFloat(document.getElementById('finishDuration').value);
    const workingHoursPerDay = parseFloat(document.getElementById('workingHoursPerDay').value);

    const response = await fetch('http://localhost:3001/calculate-hauling', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            soilVolume,
            bulkingFactor,
            truckCapacity,
            cycleDuration,
            finishDuration,
            workingHoursPerDay
        })
    });

    const data = await response.json();

    document.getElementById('numberOfTrucks').innerText = data.numberOfTrucks;

    const report = `
        <h3>Calculation Report</h3>
        <p>Soil Excavated Volume: ${soilVolume} m³</p>
        <p>Bulking Factor: ${bulkingFactor}</p>
        <p>Total Volume (with bulking): ${data.totalVolume} m³</p>
        <p>Capacity of Each Truck: ${truckCapacity} m³</p>
        <p>Total Number of Cycles: ${data.totalCycles}</p>
        <p>Duration for One Cycle: ${cycleDuration} hours</p>
        <p>Total Working Hours Needed: ${data.totalWorkingHours} hours</p>
        <p>Number of Trucks Required: ${data.numberOfTrucks}</p>
    `;

    document.getElementById('calculationReport').innerHTML = report;
}
