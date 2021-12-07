import zipcelx from '../zipcelx.js';

/**
 * WebComponent qui définit la feuille de score.
 */
export default class Scorer extends HTMLElement {
	constructor() {
		super();
	}

	/**
	 * Fonction lancée lorsque le composant est ajouté au DOM.
	 */
	connectedCallback() {
		this.voleeNumber = this.getAttribute('volee-number');
		this.arrowsNumber = this.getAttribute('arrows-number');

		if (this.dataset.score) {
			this.score = JSON.parse(`${this.dataset.score}`);
		}

		this.innerHTML = this.createHTML();

		this.querySelectorAll('.arrow').forEach((element) => {
			element.addEventListener('change', () => {
				this.changeTotalScore(element.dataset.volee);
			});
		});

		this.querySelector('#download-file').addEventListener('click', () => {
			this.createScorerFile();
		});

		this.querySelector('#download-excel-file').addEventListener('click', () => {
			this.createXlsxFile();
		});
	}

	/**
	 * Crée le code HTML du composant.
	 * @returns {string}
	 */
	createHTML() {
		let scorerTableContent = '';
		for (let v = 0; v < this.voleeNumber; v++) {
			scorerTableContent += /* html */ `
                <tr>
                    <th class="text-center">
                        Volée n°${v + 1}
                    </th>
            `;

			for (let a = 0; a < this.arrowsNumber; a++) {
				scorerTableContent += /* html */ `
                    <td>
                        <input
                            type="text"
                            class="form-control arrow arrow-v${v + 1}"
                            data-volee="${v + 1}"
                            ${this.score ? `value="${this.score[v][a]}"` : ''}
                        />
                    </td>
                `;
			}

			scorerTableContent += /* html */ `
                    <td class="font-weight-medium text-center volee-total" id="total-v${v + 1}">
                        0
                    </td>
                </tr>
            `;
		}

		return /* html */ `
            <div class="scorer">
                <table class="table">
                    <tbody>
                        ${scorerTableContent}
                    </tbody>
                </table>
                <div class="alert alert-primary m-10">
                    <h4 class="alert-heading">Total : <span id="scorer-total">0</span></h4>
                </div>
                <div class="container-fluid row row-eq-spacing-sm">
                    <div class="col-sm m-5">
                        <button class="btn btn-primary btn-block" id="download-file">
                            Télécharger la feuille de score
                        </button>
                    </div>
                    <div class="col-sm m-5">
                        <button class="btn btn-success btn-block" id="download-excel-file">
                            Télécharger la feuille de score au format <code>XLSX</code>
                        </button>
                    </div>
                </div>
            </div>
        `;
	}

	/**
	 * Met à jour le score total d'une volée indiquée et le score total du tir.
	 * @param {number} volee Volée où l'on veut mettre à jour le score total.
	 */
	changeTotalScore(volee) {
		let voleeScore = 0;

		this.querySelectorAll(`.arrow-v${volee}`).forEach((element) => {
			if (element.value !== '') {
				voleeScore += parseInt(element.value);
			}
		});

		this.querySelector(`#total-v${volee}`).innerHTML = voleeScore;

		let totalScore = 0;

		this.querySelectorAll('.volee-total').forEach((element) => {
			totalScore += parseInt(element.innerHTML);
		});

		this.querySelector('#scorer-total').innerHTML = totalScore;
	}

	/**
	 * Crée un fichier .archeryscorer et le fait enregistrer à l'utilisateur.
	 */
	createScorerFile() {
		const score = [];
		for (let v = 0; v < this.voleeNumber; v++) {
			let voleeScore = [];

			this.querySelectorAll(`.arrow-v${v + 1}`).forEach((element) => {
				if (element.value !== '') {
					voleeScore.push(parseInt(element.value));
				} else {
					voleeScore.push(0);
				}
			});

			score.push(`[${voleeScore}]`);
		}

		const scorerFileObject = `{
            "volee_number": ${this.voleeNumber},
            "arrow_number": ${this.arrowsNumber},
            "score": [${score}]
        }`;

		const date = new Date();

		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(new Blob([scorerFileObject.toString()]));
		link.download = `tir${date.getDate()}-${
			date.getMonth() + 1
		}-${date.getFullYear()}.archeryscorer`;
		link.click();
	}

	/**
	 * Crée un fichier .xlsx grâce à zipcelx.
	 */
	createXlsxFile() {
		const date = new Date();

		const score = [
			[
				{
					value: 'Archery',
					type: 'string',
				},
				{
					value: 'Scorer',
					type: 'string',
				},
				{
					value: 'Tir du',
					type: 'string',
				},
				{
					value: `${date.getDate()}/${date.getMonth() + 1}`,
					type: 'string',
				},
			],
		];
		let totalScore = 0;

		const totalTitleLine = [
			{
				value: '',
				type: 'string',
			},
		];
		for (let i = 0; i < this.voleeNumber; i++) {
			totalTitleLine.push({
				value: '',
				type: 'string',
			});
		}
		totalTitleLine.push({
			value: 'Total',
			type: 'string',
		});

		score.push(totalTitleLine);

		for (let v = 0; v < this.voleeNumber; v++) {
			const voleeScore = [
				{
					value: `Volée ${v + 1}`,
					type: 'string',
				},
			];
			let voleeTotalScore = 0;

			this.querySelectorAll(`.arrow-v${v + 1}`).forEach((element) => {
				if (element.value !== '') {
					voleeScore.push({
						value: parseInt(element.value),
						type: 'number',
					});

					voleeTotalScore += parseInt(element.value);
				} else {
					voleeScore.push({
						value: 0,
						type: 'number',
					});
				}
			});

			voleeScore.push({
				value: voleeTotalScore,
				type: 'number',
			});

			score.push(voleeScore);

			totalScore += voleeTotalScore;
		}

		const totalScoreLine = [
			{
				value: '',
				type: 'string',
			},
		];
		for (let i = 0; i < this.voleeNumber; i++) {
			totalScoreLine.push({
				value: '',
				type: 'string',
			});
		}
		totalScoreLine.push({
			value: totalScore,
			type: 'number',
		});

		score.push(totalScoreLine);

		const xlsxFile = {
			filename: `tir${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
			sheet: {
				data: score,
			},
		};

		zipcelx(xlsxFile);
	}
}
