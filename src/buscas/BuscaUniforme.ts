import { Node } from '../classes/Node'
import { ItemFronteira } from '../classes/ItemFronteira';

export class BuscaUniforme {
	nodes: Node[]
	nodeInicial: Node
	nodeObjetivo: Node
	options: BuscaUniformeOptions;

	private fronteira: ItemFronteira[] = [];
	private explorados: Node[] = [];

	constructor(allNodes: Node[], nodeInicial: Node, nodeObjetivo: Node, options?: BuscaUniformeOptions) {
		this.nodes = allNodes;
		this.nodeInicial = nodeInicial;
		this.nodeObjetivo = nodeObjetivo;
		this.options = Object.assign(new BuscaUniformeOptions(), options);
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
				console.log(`F = { ${this.fronteira.map(item => item.print(BuscaUniforme.getCustoTotalItemFronteira)).join(', ')} }`)
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
			// ordena a fronteira por custo
			this.sortFronteiraPorCustoTotal();
		}
	}

	// expande nodes vizinhas da node a ser explorada
	expandirNodesVizinhas(itemFronteira: ItemFronteira) {
		itemFronteira.cabeca.vizinhos.forEach(vizinho => {
			// verifica se deve incluir node vizinha na fronteira
			if (this.deveIncluirNodeNaFronteira(vizinho.node)) {
				// adiciona o vizinho na fronteira com o caminho e custo atualizado
				let vizinhoCaminho = itemFronteira.nodesCaminho.slice(0);
				vizinhoCaminho.unshift(vizinho.node)
				let vizinhoCusto = itemFronteira.custoCaminhoCompleto + vizinho.custoCaminho
				this.fronteira.push(new ItemFronteira(vizinhoCaminho, vizinhoCusto))
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
	// ordena a fronteira por custo de caminho
	sortFronteiraPorCustoTotal() {
		this.fronteira.sort((itemA, itemB) => {
			if (BuscaUniforme.getCustoTotalItemFronteira(itemA) < BuscaUniforme.getCustoTotalItemFronteira(itemB)) {
				return -1;
			}
			if (BuscaUniforme.getCustoTotalItemFronteira(itemA) > BuscaUniforme.getCustoTotalItemFronteira(itemB)) {
				return 1;
			}
			return 0;
		})
	}
	// calcula o custo total do item da fronteira
	static getCustoTotalItemFronteira(item: ItemFronteira): number {
		return item.custoCaminhoCompleto
	}

}

export class BuscaUniformeOptions {
	public logPassos? = false;
}