import { Node } from "./classes/Node";
import { FuncaoHeuristica } from "./classes/FuncaoHeuristica";
import { AStar } from "./buscas/AStar";
import { BuscaUniforme } from "./buscas/BuscaUniforme";
import { GBF } from "./buscas/GBF";
import { Largura } from "./buscas/Largura";
import { Profundidade } from "./buscas/Profundidade";
import { SvgMaker } from "./svg/SvgMaker";

// Cria todas as Nodes do Grafo, passando a Label, o X e o Y
const nodeS = new Node("S", 13, 2);
const nodeA = new Node("A", 2, 4);
const nodeB = new Node("B", 5, 6);
const nodeC = new Node("C", 4, 2);
const nodeD = new Node("D", 7, 4);
const nodeF = new Node("F", 7, 8);
const nodeG = new Node("G", 8, 2);
const nodeH = new Node("H", 10, 1);
const nodeM = new Node("M", 9, 6);
const nodeN = new Node("N", 11, 3);
const nodeP = new Node("P", 12, 6);
const nodeQ = new Node("Q", 11, 7);

// Linka as nodes Vizinhas
nodeA.addVizinho(nodeB, 3);
nodeB.addVizinho(nodeC, 6);
nodeB.addVizinho(nodeM, 5);
nodeM.addVizinho(nodeF, 2);
nodeF.addVizinho(nodeQ, 5);
nodeQ.addVizinho(nodeP, 1);
nodeP.addVizinho(nodeN, 3);
nodeP.addVizinho(nodeS, 8);
nodeN.addVizinho(nodeH, 2);
nodeN.addVizinho(nodeS, 2);
nodeH.addVizinho(nodeG, 1);
nodeC.addVizinho(nodeD, 4);
nodeD.addVizinho(nodeG, 2);
nodeD.addVizinho(nodeN, 3);
nodeD.addVizinho(nodeQ, 7);


// Função heuristica de distância euclidiana
let heuristicaDistanciaEuclidiana: FuncaoHeuristica = node => {
	return Math.sqrt(Math.pow(nodeObjetivo.x - node.x, 2) + Math.pow(nodeObjetivo.y - node.y, 2))
}

// Parâmetros passados para as buscas
const allNodes = [nodeS, nodeA, nodeB, nodeC, nodeD, nodeF, nodeG, nodeH, nodeM, nodeN, nodeP, nodeQ]
const nodeInicial = nodeA;
const nodeObjetivo = nodeS;
const logPassos = true;
const heuristicas: FuncaoHeuristica[] = [heuristicaDistanciaEuclidiana];


console.log("Largura\n")
let algoritmoLargura = new Largura(allNodes, nodeInicial, nodeObjetivo, { logPassos });
// Realizas preparações do algorítimo (inicialização de variáveis)
algoritmoLargura.preparar();
// Executa o algorítmo
let caminhoEncontradoLargura = algoritmoLargura.executar();
// Loga o caminho encontrado, caso encontrado:
if (caminhoEncontradoLargura) {
	console.log("Caminho encontrado Largura: " + caminhoEncontradoLargura.print());
} else {
	console.log("Caminho não encontrado Largura");
}

console.log("\n---------------\nProfundidade\n")
let algoritmoProfundidade = new Profundidade(allNodes, nodeInicial, nodeObjetivo, { logPassos });
// Realizas preparações do algorítimo (inicialização de variáveis)
algoritmoProfundidade.preparar();
// Executa o algorítmo
let caminhoEncontradoProfundidade = algoritmoProfundidade.executar();
// Loga o caminho encontrado, caso encontrado:
if (caminhoEncontradoProfundidade) {
	console.log("Caminho encontrado Profundidade: " + caminhoEncontradoProfundidade.print());
} else {
	console.log("Caminho não encontrado Profundidade");
}

console.log("\n---------------\nBusca Uniforme\n")
let algoritmoBuscaUniforme = new BuscaUniforme(allNodes, nodeInicial, nodeObjetivo, { logPassos });
// Realizas preparações do algorítimo (inicialização de variáveis)
algoritmoBuscaUniforme.preparar();
// Executa o algorítmo
let caminhoEncontradoBuscaUniforme = algoritmoBuscaUniforme.executar();
// Loga o caminho encontrado, caso encontrado:
if (caminhoEncontradoBuscaUniforme) {
	console.log("Caminho encontrado BuscaUniforme: " + caminhoEncontradoBuscaUniforme.print(BuscaUniforme.getCustoTotalItemFronteira));
} else {
	console.log("Caminho não encontrado BuscaUniforme");
}

console.log("\n---------------\nGBF\n")
let algoritmoGBF = new GBF(allNodes, nodeInicial, nodeObjetivo, heuristicas, { logPassos });
// Realizas preparações do algorítimo (inicialização de variáveis, calculo das heurísticas)
algoritmoGBF.preparar();
// Executa o algorítmo
let caminhoEncontradoGBF = algoritmoGBF.executar();
// Loga o caminho encontrado, caso encontrado:
if (caminhoEncontradoGBF) {
	console.log("Caminho encontrado GBF: " + caminhoEncontradoGBF.print(GBF.getCustoTotalItemFronteira));
} else {
	console.log("Caminho não encontrado GBF");
}

console.log("\n---------------\nA*\n")
let algoritmoAStar = new AStar(allNodes, nodeInicial, nodeObjetivo, heuristicas, { logPassos });
// Realizas preparações do algorítimo (inicialização de variáveis, calculo das heurísticas)
algoritmoAStar.preparar();
// Executa o algorítmo
let caminhoEncontradoAStar = algoritmoAStar.executar();
// Loga o caminho encontrado, caso encontrado:
if (caminhoEncontradoAStar) {
	console.log("Caminho encontrado A*: " + caminhoEncontradoAStar.print(AStar.getCustoTotalItemFronteira));
} else {
	console.log("Caminho não encontrado A*");
}
console.log("")

new SvgMaker(allNodes).write('/')