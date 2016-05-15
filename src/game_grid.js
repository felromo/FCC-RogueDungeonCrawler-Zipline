import $ from 'jquery';

export const FLOOR = 'FLOOR';
export const WALL = 'WALL';
export const ENEMY = 'ENEMY';
export const BOSS = 'BOSS';
export const WEAPON = 'WEAPON';
export const HEALTH = 'HEALTH';


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

}

export function generatorHelper(grid, origin, walkable, type) {
  const [col, row] = origin;
  for(let enemy_col = 0; enemy_col < 20; enemy_col++) {
    for(let enemy_row = 0; enemy_row < 20; enemy_row++) {
      grid[col+enemy_col][row+enemy_row] = {
        walkable,
        type,
        origin
      };
    }
  }
}

export function generateEnemies(grid) {
  //generate 5 enemmies
  let enemies = [];
  while (enemies.length < 5) {
    // generate 2 random coordinates and check to see if they are 'open'
    const row = Math.floor((Math.random()*350)+10);
    const col = Math.floor((Math.random()*750)+10);
    // needs to check for proximity to a wall
    if(grid[col][row].walkable && grid[col+19][row].walkable && grid[col][row+19].walkable && grid[col+19][row+19].walkable) {
      generatorHelper(grid, [col, row], false, ENEMY);

      // the origin for visual
      enemies.push({col, row, hp: 100});
    }
  }

  return enemies;
}

export function locateEveryone(grid, type) {
  let counter = 0;
  grid.forEach((inner, index1) => {
    inner.forEach((value, index2) => {
      if(value.type === type) {
        console.log(`${index1},${index2}:${value.type};origin:${value.origin}`);
        counter++;
      }
    });
  });
  console.log(`counter: ${counter}`);
}

export function generateBoss(grid) {
  let boss;
  while (!boss) {
    const row = Math.floor((Math.random()*350)+10);
    const col = Math.floor((Math.random()*750)+10);
    if(grid[col][row].walkable && grid[col+19][row].walkable && grid[col][row+19].walkable && grid[col+19][row+19].walkable) {
      generatorHelper(grid, [col, row], false, BOSS);
      boss = {col, row, hp: 100};
    }
  }
  return boss;
}

function generateWeapons(grid) {

}

function generateHealthDrops(grid) {

}

export function createGrid() {
  const rows = 400;
  const columns = 800;
  let grid = [];
  for(let x = 0; x < columns; x++) {
    grid.push([]);
    for(let y = 0; y < rows; y++) {
      grid[x].push({walkable: true, type: FLOOR});
    }
  }

  generateWalls(grid);

  return grid;
}
