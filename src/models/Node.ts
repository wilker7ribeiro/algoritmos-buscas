export class Node {
	public label: string;
	public x: number
	public y: number
	public vizinhos: { node: Node, custoCaminho: number }[] = []
	public custoHeuristicas: number = 0;

	constructor(label: string, x: number, y: number) {
		this.x = x;
		this.y = y;
		this.label = label;
	}

	public addVizinho(node: Node, custoCaminho: number) {
		this.vizinhos.push({ node, custoCaminho });
	}

}