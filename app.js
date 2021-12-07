import Scorer from './components/Scorer.js';
import Loader from './components/Loader.js';

console.log('---------------');
console.log('app.js chargé');
console.log('---------------');

const home = document.getElementById('home');
const loader = document.getElementById('loader');
const createScorer = document.getElementById('create-scorer');
const uploadScorer = document.getElementById('upload-scorer');
const scorerContainer = document.getElementById('scorer-container');

function handleCloseScorer() {
	scorerContainer.innerHTML = '';
	home.classList.remove('d-none');
}

loader.classList.add('d-none');
loader.classList.remove('d-flex');
home.classList.remove('d-none');

createScorer.addEventListener('submit', (event) => {
	event.preventDefault();

	const voleeNumberInput = document.getElementById('volee-number');
	const arrowsNumberInput = document.getElementById('arrows-number');

	home.classList.add('d-none');

	scorerContainer.innerHTML = /* html */ `
        <archery-scorer
            volee-number="${voleeNumberInput.value}"
            arrows-number="${arrowsNumberInput.value}"
        >
        </archery-scorer>
		<button id="close_scorer" class="btn btn-primary btn-block">Terminé</button>
    `;

	scorerContainer.querySelector('#close_scorer').addEventListener('click', handleCloseScorer);
});

uploadScorer.addEventListener('submit', async (event) => {
	event.preventDefault();

	const file = document.querySelector('input[type="file"]').files[0];
	const fileText = await file.text();
	const fileContent = JSON.parse(fileText);

	home.classList.add('d-none');

	const score = [];
	fileContent.score.forEach((voleeScore) => {
		score.push(`[${voleeScore}]`);
	});

	scorerContainer.innerHTML = /* html */ `
		<archery-scorer
			volee-number="${fileContent.volee_number}"
			arrows-number="${fileContent.arrow_number}"
			data-score="[${score}]"
		>
		</archery-scorer>
		<button id="close_scorer" class="btn btn-primary btn-block">Terminé</button>
    `;

	scorerContainer.querySelector('#close_scorer').addEventListener('click', handleCloseScorer);
});

customElements.define('archery-scorer', Scorer);
customElements.define('spinning-dots', Loader);
