import { Node } from './Node'
export class ItemFronteira {
	nodesCaminho: Node[];
	custoCaminhoCompleto: number;

	get cabeca() {
		return this.nodesCaminho[0];
	}

	constructor(nodesCaminho: Node[], custoCaminhoCompleto = 0) {
		this.nodesCaminho = nodesCaminho;
		this.custoCaminhoCompleto = custoCaminhoCompleto;
	}


	print(calculadorCustoTotal?: (item: ItemFronteira) => number): string {
		return "[" + this.nodesCaminho.map(node => node.label).join("") + "]" + (calculadorCustoTotal ? "(" + parseFloat(calculadorCustoTotal(this).toPrecision(5)) + ")" : "");
	}
}