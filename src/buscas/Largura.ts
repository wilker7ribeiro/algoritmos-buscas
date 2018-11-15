import { Node } from '../classes/Node'
import { ItemFronteira } from '../classes/ItemFronteira';

export class Largura {
	nodes: Node[]
	nodeInicial: Node
	nodeObjetivo: Node
	options: LarguraOptions;

	private fronteira: ItemFronteira[] = [];
	private explorados: Node[] = [];

	constructor(allNodes: Node[], nodeInicial: Node, nodeObjetivo: Node, options?: LarguraOptions) {
		this.nodes = allNodes;
		this.nodeInicial = nodeInicial;
		this.nodeObjetivo = nodeObjetivo;
		this.options = Object.assign(new LarguraOptions(), options);
	}

	preparar() {
		this.fronteira = [];
		this.explorados = [];
	}

	executar(): ItemFronteira | undefined {
		// Inclui o node inicial na fronteira
		this.fronteira.push(new ItemFronteira([this.nodeInicial], 0));
		while (this.fronteira.length > 0) {
			if (this.options.logPassos) {
				console.log(`F = { ${this.fronteira.map(item => item.print()).join(', ')} }`)
				console.log(`E = { ${this.explorados.map(node => node.label).join()} }`)
				console.log()
			}
			// caso o item da fronteira a ser explorado for o objetivo, retorna ele
			if (this.fronteira[0].cabeca === this.nodeObjetivo) {
				return this.fronteira[0]
			}
			// remove o item a ser explorado da fronteira e adiciona nos explorados
			let cabeca = this.removerCabecaDaFronteiraEAdicionarNosExplorados();
			// expande nodes vizinhas da node a ser explorada
			this.expandirNodesVizinhas(cabeca);
		}
	}

	// expande nodes vizinhas da node a ser explorada
	expandirNodesVizinhas(itemFronteira: ItemFronteira) {
		itemFronteira.cabeca.vizinhos.forEach(vizinho => {
			// verifica se deve incluir node vizinha na fronteira
			if (this.deveIncluirNodeNaFronteira(vizinho.node)) {
				// adiciona o vizinho no fim da fronteira com o caminho atualizado
				let vizinhoCaminho = itemFronteira.nodesCaminho.slice(0);
				vizinhoCaminho.unshift(vizinho.node)
				this.fronteira.push(new ItemFronteira(vizinhoCaminho))
			}
		})
	}
	// verifica se deve incluir node vizinha na fronteira
	deveIncluirNodeNaFronteira(node: Node){
		return !this.explorados.includes(node)
	}
	// remove o item a ser explorado da fronteira e adiciona nos explorados
	removerCabecaDaFronteiraEAdicionarNosExplorados(): ItemFronteira {
		let removido = this.fronteira.shift();
		this.explorados.push(removido!.cabeca)
		return removido!
	}
	

}

export class LarguraOptions {
	public logPassos? = false;
}