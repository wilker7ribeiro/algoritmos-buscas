import { Node } from "../classes/Node";
import { writeFile } from 'fs'
import { join } from 'path';
const { convertFile } = require('convert-svg-to-png');
import * as SVGJS from "svg.js"


const margin = 30

const lineMarkersPointDiameter = 5
const lineSpace = 30;

const nodeLabelColor = '#ff0000'


export class SvgMaker {

	nodes: Node[]
	draw: SVGJS.Doc;
	maxX: number;
	minX: number;
	maxY: number;
	minY: number;

	pontosXMaior0!: number
	pontosXMenor0!: number
	pontosYMaior0!: number
	pontosYMenor0!: number


	linhaXpositionX!: number
	linhaXpositionY!: number
	linhaYpositionX!: number
	linhaYpositionY!: number

	arrowMarker: SVGJS.Marker

	constructor(nodes: Node[]) {
		this.nodes = nodes.slice();
		const window = require('svgdom')
		const SVG = require('svg.js')(window)
		const document = window.document
		this.draw = SVG(document.documentElement)

		this.nodes.sort((a, b) => b.x - a.x)
		this.maxX = this.nodes[0].x
		this.minX = this.nodes[this.nodes.length - 1].x

		this.nodes.sort((a, b) => b.y - a.y)
		this.maxY = this.nodes[0].y
		this.minY = this.nodes[this.nodes.length - 1].y

		this.pontosXMaior0 = this.maxX <= 0 ? 0 : this.maxX
		this.pontosXMenor0 = this.minX >= 0 ? 0 : Math.abs(this.minX);
		this.pontosYMaior0 = this.maxY <= 0 ? 0 : this.maxY
		this.pontosYMenor0 = this.minY >= 0 ? 0 : Math.abs(this.minY);
		// if (this.minX > 0) this.pontosXMaior0++
		// if (this.maxX < 0) this.pontosXMenor0++
		// if (this.minY > 0) this.pontosYMaior0++
		// if (this.maxY < 0) this.pontosYMenor0++

		this.desenharEixoX()
		this.desenharEixoY()
		this.adicionarPontosEixoX()
		this.adicionarPontosEixoY();

		this.arrowMarker = this.draw.marker(20, 20, function (this: any, add) {
			add.path('M0,0 V20 L10,10 Z').stroke({ width: 0.5 })
		})

		this.nodes.forEach(node => {
			this.adicionarNode(node);
		})

	}

	desenharEixoX() {
		// draw linha X
		this.linhaXpositionX = margin
		this.linhaXpositionY = margin + (this.pontosYMaior0 * lineSpace)  //canvasHeight - (margin + (minY * lineSpace));
		const linhaXwidth = ((this.pontosXMaior0 + this.pontosXMenor0) * lineSpace)
		this.draw.line(this.linhaXpositionX, this.linhaXpositionY, this.linhaXpositionX + linhaXwidth, this.linhaXpositionY).stroke({ width: 1 })
		// draw text X
		let xLetter = this.draw.plain("X")
		xLetter.attr({ x: this.linhaXpositionX + linhaXwidth + margin - xLetter.bbox().width, y: this.linhaXpositionY + (xLetter.bbox().height / 2) })
	}

	desenharEixoY() {
		this.linhaYpositionX = margin + (this.pontosXMenor0 * lineSpace)  //canvasHeight - (margin + (minY * lineSpace));
		this.linhaYpositionY = margin
		const linhaYheigth = ((this.pontosYMaior0 + this.pontosYMenor0) * lineSpace)
		this.draw.line(this.linhaYpositionX, this.linhaYpositionY, this.linhaYpositionX, linhaYheigth + this.linhaYpositionY).stroke({ width: 1 })
		// draw text Y
		let yLetter = this.draw.plain("Y");
		yLetter.attr({ x: (this.linhaYpositionX) - (yLetter.bbox().width / 2), y: yLetter.bbox().height })
	}

	adicionarPontosEixoX() {
		// Adicionando pontos e numeração no eixo X
		for (let i = 0; i <= (this.pontosXMaior0 + this.pontosXMenor0); i++) {
			let numberLabel = i.toString();
			if (this.minX <= 0 && numberLabel !== "0" || this.minX > 0 && i !== 0) {
				let numberLetter = this.draw.plain(numberLabel);
				numberLetter.attr({ x: margin + (lineSpace * i) - (numberLetter.bbox().width / 2), y: this.linhaXpositionY + numberLetter.bbox().height })
			}
			this.draw.circle(lineMarkersPointDiameter).attr({
				cx: margin + (lineSpace * i),
				cy: this.linhaXpositionY
			})
		}

	}

	adicionarPontosEixoY() {
		// Adicionando pontos e numeração no eixo Y
		for (let i = 0; i <= (this.pontosYMaior0 + this.pontosYMenor0); i++) {
			let numberLabel = i.toString();
			if (this.minY <= 0 && numberLabel !== "0" || this.minY > 0 && i !== 0) {
				let numberLetter = this.draw.plain(numberLabel);
				numberLetter.attr({ x: this.linhaYpositionX - 8 - numberLetter.bbox().width, y: ((this.pontosYMaior0 + this.pontosYMenor0) * lineSpace) + margin - (lineSpace * i) })
			}
			this.draw.circle(lineMarkersPointDiameter).attr({
				cx: this.linhaYpositionX,
				cy: margin + (lineSpace * i)
			})
		}
	}

	adicionarNode(node: Node): any {
		let nodePositionX = this.getNodePositionX(node.x);
		let nodePositionY = this.getNodePositionY(node.y);

		// Adicionar Circulo do node
		// this.draw.circle(lineMarkersPointDiameter).attr({
		// 	cx: nodePositionX,
		// 	cy: nodePositionY
		// })

		node.vizinhos.forEach(vizinho => {

			// Calcular inicio e final de linha entre node e vizinho (precisa dar o espaçamento)
			let distanciaEntreNodeEVizinho = Math.sqrt(Math.pow(node.x - vizinho.node.x, 2) + Math.pow(node.y - vizinho.node.y, 2));
			let distanceRate = 0.3 / distanciaEntreNodeEVizinho;
			let lineToVizinhoEndX = (1 - distanceRate) * vizinho.node.x + (distanceRate * node.x)
			let lineToVizinhoEndY = (1 - distanceRate) * vizinho.node.y + (distanceRate * node.y)
			let lineToVizinhoStartX = (1 - distanceRate) * node.x + (distanceRate * lineToVizinhoEndX)
			let lineToVizinhoStartY = (1 - distanceRate) * node.y + (distanceRate * lineToVizinhoEndY)
			let lineToVizinhoPositionStartX = this.getNodePositionX(lineToVizinhoStartX);
			let lineToVizinhoPositionStartY = this.getNodePositionY(lineToVizinhoStartY);
			let lineToVizinhoPositionEndX = this.getNodePositionX(lineToVizinhoEndX);
			let lineToVizinhoPositionEndY = this.getNodePositionY(lineToVizinhoEndY);

			// Adicinha linha para Vizinho
			this.draw
				.line(lineToVizinhoPositionStartX, lineToVizinhoPositionStartY, lineToVizinhoPositionEndX, lineToVizinhoPositionEndY)
				.stroke({ width: 0.5 })
				.marker('end', this.arrowMarker)

			// Adicionando Custo
			let custoX = (lineToVizinhoStartX + lineToVizinhoEndX) / 2;
			let custoY = (lineToVizinhoStartY + lineToVizinhoEndY) / 2;
			let custoPositionX = this.getNodePositionX(custoX);
			let custoPositionY = this.getNodePositionY(custoY);
			let custoNumberLetter = this.draw.plain(vizinho.custoCaminho.toString());
			custoNumberLetter.attr({ x: custoPositionX, y: custoPositionY })

		})
		// Adicionar Label do Node
		let numberLetter = this.draw.plain(node.label);
		numberLetter.attr({ x: nodePositionX - (numberLetter.bbox().width / 2), y: nodePositionY + 5, fill: nodeLabelColor })

	}

	getNodePositionX(valorX: number): number {
		return margin + ((valorX - (this.minX >= 0 ? 0 : this.minX)) * lineSpace)
	}

	getNodePositionY(valorY: number): number {
		return margin + ((this.maxY - valorY) * lineSpace)
	}

	write(filePath: string = '/') {
		let svgString = this.draw.svg()
		let fullFileSvgPath = join(process.cwd(), filePath, '/grafo.svg');
		writeFile(fullFileSvgPath, svgString, err => {
			if (err) {
				return console.log(err);
			}
			convertFile(fullFileSvgPath, {
				height: ((this.pontosYMaior0 + this.pontosYMenor0) * lineSpace) + margin * 2,
				width: ((this.pontosXMaior0 + this.pontosXMenor0) * lineSpace) + margin * 2,
			}).then((pngOutPath: string) => {
				console.log("Png com o grafo salvo em: ", pngOutPath);
			})
			console.log("Svg com o grafo salvo em: ", fullFileSvgPath);
		})

	}

}