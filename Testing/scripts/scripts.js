function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.style.display = 'none');

    // Show the selected section
    const selectedSection = document.getElementById(sectionId);
    selectedSection.style.display = 'block';
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
