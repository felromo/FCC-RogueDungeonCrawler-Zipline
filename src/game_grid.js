export const FLOOR = 'FLOOR';
export const WALL = 'WALL';
export const ENEMY = 'ENEMY';
export const BOSS = 'BOSS';
export const WEAPON = 'WEAPON';
export const HEALTH = 'HEALTH';

function createGrid() {
  const rows = 400;
  const columns = 800;
  let grid = [];
  for(let x = 0; x < columns; x++) {
    grid.push([]);
    for(let y = 0; y < rows; y++) {
      grid[x].push({walkable: true, type: FLOOR});
    }
  }

  grid = generateWalls(grid);

  return grid;
}

function generateWalls(grid) {
  // generate the borders around the game world
  // the border walls are 10px thick
  // left vertical wall
  for(let col = 0; col < 10; col++) {
    for(let row = 0; row < 400; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }
  //right vertical wall
  for(let col = 791; col < 800; col++) {
    for(let row = 0; row < 400; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }

  // top horizontal wall
  for(let col = 0; col < 800; col++) {
    for(let row = 0; row < 10; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }

  // bottom horizontal wall
  for(let col = 0; col < 800; col++) {
    for(let row = 390; row < 400; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }

  // left horizontal block
  for(let col = 10; col < 210; col++) {
    for(let row = 140; row < 190; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }
  // right horizontal block
  for(let col = 260; col < 460; col++) {
    for(let row = 140; row < 190; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }

  // left vertical line
  for(let col = 220; col < 250; col++) {
    for(let row = 230; row < 390; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }
  // right vertical line
  for(let col = 460; col < 490; col++) {
    for(let row = 10; row < 340; row++) {
      grid[col][row] = {
        walkable:false, type: WALL
      };
    }
  }

  return grid;
}

function generateEnemies() {

}

function generateBoss() {

}

function generateWeapons() {

}

function generateHealthDrops() {

}

export const Grid = createGrid();
