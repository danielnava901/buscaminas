class TreeNode {
    value: number;
    x: number;
    y: number;
    adjacentOnes: number = 0;
    children: TreeNode[] = [];

    constructor(value: number, x: number, y: number, adjacentOnes: number = 0) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.adjacentOnes = adjacentOnes;
    }

    addChild(childNode : TreeNode) {
        this.children.push(childNode);
    }
}

class GridNode {
    id: number;
    grid: number[][];
    tree: TreeNode | null = null;
    nodeMap: Map<string, TreeNode> = new Map<string, TreeNode>();
    level: object = {
        easy: 5,
        medium: 10,
        hard: 15,
        expert: 20,
    }

    constructor(grid: number[][]) {
        this.id = Date.now();
        this.grid = grid;
        this.tree = this.buildTree(grid);
    }

    countAdjacentOnes(grid : number[][], x: number, y: number) {
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0], 
            [1, 1], [-1, -1], [1, -1], [-1, 1]];
        let count = 0;
    
        for(let dir of directions) {
            const newX = x + dir[0];
            const newY = y + dir[1];
    
            if(newX >= 0 && newX < grid.length && newY >= 0 && newY < grid[0].length 
            ) {
                if(grid[newX][newY] === 1) {
                    count++;
                }
            }
        }
    
        return count;
    }

    private getNode(x: number, y: number) : TreeNode {
        const key = `${x},${y}`;
        if(!this.nodeMap.has(key)) {
            let adjacentOnes = this.countAdjacentOnes(this.grid, x, y);
            this.nodeMap.set(key, new TreeNode(this.grid[x][y], x, y, adjacentOnes));
        }

        return this.nodeMap.get(key)!;
    }

    buildTree(grid: number[][]) : TreeNode | null {
        if(!grid || grid.length === 0) {
            return null;
        }
    
        const rows = grid.length;
        const cols = grid[0].length;
    
        let root = this.getNode(0, 0);
        
        for(let i = 0; i < rows; i++) {
            for(let j = 0; j < cols; j++) {
                const node = this.getNode(i, j);
                if (j + 1 < cols) node.addChild(this.getNode(i, j + 1)); // Derecha
                if (i + 1 < rows) node.addChild(this.getNode(i + 1, j)); // Abajo
            }
        }
    
    
        return root;
    }

    getGridToPrint() {
        let grid : object[][] = [];
        for(let i = 0; i < this.grid.length; i++) {
            grid.push([]);
            for(let j = 0; j < this.grid[0].length; j++) {
                let node = this.getNode(i, j);

                grid[i].push({value: node.value , adjacentOnes: node.adjacentOnes});
            }
        }

        return grid;
    }

}



export default GridNode;