const selectStatistik = document.getElementById('selectStatistikNotes');

selectStatistik.addEventListener('change', (e) => {
	const renderStatistikType = e['target']['value'];
	console.log(renderStatistikType);
	renderKategori(renderStatistikType);
});

console.log('connected');

function renderKategori(statistikType) {
	statistikType = statistikType.toLowerCase();

	if(statistikType === 'kategori') {
		renderStatistikByKategori();
	} else {
		renderAllStatistik();
	}

}

function renderStatistikByKategori() {

	// Bar chart
	new Chart(document.getElementById("statistik-notes"), {
	    type: 'bar',
	    data: {
	      labels: ["Pendidikan", "Programming", "Developer", "Trip", "Refresing", "Nongkrong", "Kegiatan", "Festival", "Tugas", "Web Developer", "Job", "Project", "Latihan", "Ulangan","Pendidikan", "Programming", "Developer", "Trip", "Refresing", "Nongkrong", "Kegiatan", "Festival", "Tugas", "Web Developer", "Job", "Project", "Latihan", "Ulangan"],
	      datasets: [
	        {
	          label: "Banyak Note",
	          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850" ,"#e8c3b9","#c45850","#e8c3b9","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850" ,"#e8c3b9","#c45850","#e8c3b9","#c45850"],
	          data: [2,5,10,21,12,2,5,10,21,12,21,12,21,12,2,5,10,21,12,2,5,10,21,12,21,12,21,12]
	        }
	      ]
	    },
	    options: {
	      legend: { display: false },
	      title: {
	        display: true,
	        text: 'Banyak Notes Berdasarkan Kategori Di Tahun 2020'
	      }
	    }
	});
}

function renderAllStatistik() {
	// Bar chart  
	new Chart(document.getElementById("statistik-notes"), {
	    type: 'bar',
	    data: {
	      labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
	      datasets: [
	        {
	          label: "Banyak Note",
	          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850" ,"#e8c3b9","#c45850"],
	          data: [2,5,10,21,12,2,5,10,21,12,21,12]
	        }
	      ]
	    },
	    options: {
	      legend: { display: false },
	      title: {
	        display: true,
	        text: 'Banyak Notes Di Tahun 2020'
	      }
	    }
	});

}


function renderDefaultStatistik() {
	// Bar chart  
	new Chart(document.getElementById("statistik-notes"), {
	    type: 'bar',
	    data: {
	      labels: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
	      datasets: [
	        {
	          label: "Banyak Note",
	          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850", "#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850" ,"#e8c3b9","#c45850"],
	          data: [2,5,10,21,12,2,5,10,21,12,21,12]
	        }
	      ]
	    },
	    options: {
	      legend: { display: false },
	      title: {
	        display: true,
	        text: 'Banyak Notes Di Tahun 2020'
	      }
	    }
	});

}

renderDefaultStatistik();