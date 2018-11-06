import { Node } from '../models/Node'
import { FuncaoHeuristica } from '../models/FuncaoHeuristica';
import { ItemFronteira } from '../models/ItemFronteira';

export class AStar {
	nodes: Node[]
	nodeInicial: Node
	nodeObjetivo: Node
	heuristicas: FuncaoHeuristica[] = []
	options: AStarOptions;

	private fronteira: ItemFronteira[] = [];
	private explorados: Node[] = [];

	constructor(allNodes: Node[], nodeInicial: Node, nodeObjetivo: Node, heuristicas: FuncaoHeuristica[], options: AStarOptions) {
		this.nodes = allNodes;
		this.nodeInicial = nodeInicial;
		this.nodeObjetivo = nodeObjetivo;
		this.heuristicas = heuristicas
		this.options = Object.assign(new AStarOptions(), options);
	}

	preparar() {
		this.fronteira = [];
		this.explorados = [];
		this.nodes.forEach(node => {
			node.custoHeuristicas = 0;
			this.heuristicas.forEach(heuristica => {
				node.custoHeuristicas += heuristica(node)
			})
		})

		if (this.options.logTabelaHeuristica) {
			console.log(`Label \t h(n)`)
			this.nodes.forEach(node => {
				console.log(`${node.label} \t ${node.custoHeuristicas}`)
			})
			console.log()
		}
		
	}
	executar(): ItemFronteira | undefined {
		// Inclui o node inicial na fronteira
		this.fronteira.push(new ItemFronteira([this.nodeInicial], 0));
		while (this.fronteira.length > 0) {
			if (this.options.logPassos) {
				console.log(`F = { ${this.fronteira.map(item => item.print(AStar.getCustoTotalItemFronteira)).join(', ')} }`)
				console.log(`E = { ${this.explorados.map(node => node.label).join()} }`)
				console.log()
			}
			// caso o item da fronteira a ser explorado for o objetivo, retorna ele
			if (this.fronteira[0].cabeca === this.nodeObjetivo) {
				return this.fronteira[0]
			}
			// remove o item a ser explorado da fronteira e adiciona nos explorados
			let cabeca = this.adicionarCabecaNosExplorados();
			// expande nodes vizinhas da node a ser explorada
			this.expendirNodesVizinhas(cabeca);
			// ordena a fronteira por custo
			this.sortFronteiraPorCustoTotal();
		}
	}

	// expande nodes vizinhas da node a ser explorada
	expendirNodesVizinhas(itemFronteira: ItemFronteira) {
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
	deveIncluirNodeNaFronteira(node: Node){
		return !this.explorados.includes(node)
	}
	// remove o item a ser explorado da fronteira e adiciona nos explorados
	adicionarCabecaNosExplorados(): ItemFronteira {
		let removido = this.fronteira.shift();
		this.explorados.push(removido!.cabeca)
		return removido!
	}
	// ordena a fronteira por custo de caminho + valor heuristica
	sortFronteiraPorCustoTotal() {
		this.fronteira.sort((itemA, itemB) => {
			if (AStar.getCustoTotalItemFronteira(itemA) < AStar.getCustoTotalItemFronteira(itemB)) {
				return -1;
			}
			if (AStar.getCustoTotalItemFronteira(itemA) > AStar.getCustoTotalItemFronteira(itemB)) {
				return 1;
			}
			return 0;
		})
	}

	// calcula o custo total do item da fronteira
	static getCustoTotalItemFronteira(item: ItemFronteira): number {
		return item.custoCaminhoCompleto + item.cabeca.custoHeuristicas
	}
}

export class AStarOptions {
	public logTabelaHeuristica? = false;
	public logPassos? = false;
}