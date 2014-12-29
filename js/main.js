/**
 * Created by Josh on 12/6/2014.
 */
var towerSelected = false;
var placedTowerSelected = false;
var curTower = null;
var curTowerBorder = '#000000';
var onTowers = false;

var money = 300;
var lives = 15;
var round = 1;

var currentRadiusTiles = [];
var corners = [];
var rounds = 3;

/*
* Tower Description
*
* Radius is in tiles for now
* upgrade_mult will determine cost of upgrade (factors in level)
* level is the upgrade level
*
* damage -- self explanatory
* speed is the rate of fire
*/

//Towers
var towerOptions =
[
    createTower(1,null),
    createTower(2,null),
    createTower(3,null),
    createTower(4,null),
    createTower(5,null),
    createTower(6,null),
    createTower(7,null),
    createTower(8,null)
];

//Temporary enemies for testing
var enemies = [];

//current towerOptions on the map
var currentTowers = [];

var invalidSpaces = []; //holds the ids of the elements that aren't valid tower areas
var prevElem = null;

window.onload = function()
{
    createGameBoard();
    //createPath(1);
    createPath(2);

    //set tower selection
    for(var i = 0; i < towerOptions.length; i++)
    {
        document.getElementById('tower'+i).onclick = select;
    }

    document.getElementById('deselect').onclick = function(){deselect(curTower);};

    document.getElementById('start').onclick = start;
};

//Game Functionality -----------------------------------------------------------------------

function start()
{
    var enemy;
    var img;

    document.getElementById('start').onclick = null;
    for(var i = 0; i < 10 /* +(round*3)*/; i++)  //Add 3 every round when moveEnemy is fixed
    {
        enemy = createHTMLElement('div', 'e'+i, 'enemy', '');
        document.getElementById('board').innerHTML += enemy;
        enemies.push({health: 30, speed: 1, id: 'e'+i, money: 25, dir:0, nxtCorner: 0}); //dir - 0: left 1: right 2: up 3: down
    }

    //set image
    for(i = 0; i < 10 /* +(round*3)*/; i++)
    {
        img = document.createElement('IMG');
        img.src = 'res/enemy.png';
        document.getElementById('e'+i).appendChild(img);
    }

    resetBoardOnclicks();

    positionEnemies();

    setTimeout(function(){moveEnemy(enemies[0], false);},100);
    setTimeout(function(){moveEnemy(enemies[1], false);},100);
    setTimeout(function(){moveEnemy(enemies[2], false);},100);
    setTimeout(function(){moveEnemy(enemies[3], false);},100);
    setTimeout(function(){moveEnemy(enemies[4], false);},100);
    setTimeout(function(){moveEnemy(enemies[5], false);},100);
    setTimeout(function(){moveEnemy(enemies[6], false);},100);
    setTimeout(function(){moveEnemy(enemies[7], false);},100);
    setTimeout(function(){moveEnemy(enemies[8], false);},100);
    setTimeout(function(){moveEnemy(enemies[9], false);},100);

    //up to 10 towers for now
    setTimeout(function(){towerShoot(currentTowers[0])},50);
    if(currentTowers.length > 0){setTimeout(function(){towerShoot(currentTowers[1])},50);}
    if(currentTowers.length > 1){setTimeout(function(){towerShoot(currentTowers[2])},50);}
    if(currentTowers.length > 2){setTimeout(function(){towerShoot(currentTowers[3])},50);}
    if(currentTowers.length > 3){setTimeout(function(){towerShoot(currentTowers[4])},50);}
    if(currentTowers.length > 4){setTimeout(function(){towerShoot(currentTowers[5])},50);}
    if(currentTowers.length > 5){setTimeout(function(){towerShoot(currentTowers[6])},50);}
    if(currentTowers.length > 6){setTimeout(function(){towerShoot(currentTowers[7])},50);}
    if(currentTowers.length > 7){setTimeout(function(){towerShoot(currentTowers[8])},50);}

    for(i = 0; i < enemies.length; i++)//enemies.length; i++)
    {
        //setTimeout(function(){moveEnemy(enemies[i]);},100);
    }

    for(i = 0; i < currentTowers.length; i++)
    {
        //setInterval(function(){towerShoot(currentTowers[i])},10*currentTowers[i].speed);
    }

    if(round >= rounds)
    {
        rounds = rounds + 1;
        round = 1;
        document.getElementById('round').innerHTML = 'Round: ' + round + " of " + rounds;
    }
}

function positionEnemies()
{
    var top;
    var left;

    top = (invalidSpaces[0].substring(1, invalidSpaces[0].indexOf('c'))) * 5.2; // * tile height

    //moves the enemy divs to be in a straight line off the board
    for(var i = 0; i < enemies.length; i++)
    {
        left = -5-(i*10);
        document.getElementById('e'+i).style.top = top+'vh';
        document.getElementById('e'+i).style.left = left+'vh';
        document.getElementById('e'+i).style.visibility = 'hidden';
    }
}

function moveEnemy(enemy, up)
{
    var index = enemyIndex(enemy);
    var element = document.getElementById(enemy.id);
    var left = Number(element.style.left.substring(0,element.style.left.indexOf('vh')));
    var top = Number(element.style.top.substring(0,element.style.top.indexOf('vh')));


    //up = inInvalidSpaces('r'+(Math.floor(left/5))+'c'+Math.floor((top/5)+1));


    if(left === 0){element.style.visibility = 'visible';}
    if(left >= 73)
    {
        enemy.health = 0;
        lives -= 1;
        document.getElementById('health').innerHTML = "Lives: " + lives;
    }
    if(enemy.health > 0){setTimeout(function(){moveEnemy(enemy, up)},100);}
    else
    {
        //add money if player killed enemy
        if(left < 73){money += enemy.money; document.getElementById('money').innerHTML = "Gold: " + money;}

        //removes enemy from game
        element.remove();
        enemies.splice(index, 1);

        if(enemies.length === 0)
        {
            if(round <= 5){document.getElementById('start').onclick = start;}
            enemies = [];

            //update rounds
            round++;
            document.getElementById('round').innerHTML = 'Round: ' + round + " of " + rounds;
        }
        return;
    }

    //move enemy
    if(corners[enemy.nxtCorner][1] === Math.floor(top/5) && corners[enemy.nxtCorner][2] === Math.floor(left/5))//at corner
    {
        //change direction
        if(corners[enemy.nxtCorner][2] < corners[enemy.nxtCorner][4]){enemy.dir = 0; }          //left
        else if(corners[enemy.nxtCorner][2] > corners[enemy.nxtCorner][4]){enemy.dir = 1; }     //right
        else if(corners[enemy.nxtCorner][1] > corners[enemy.nxtCorner][3]){enemy.dir = 2; }     //up
        else if(corners[enemy.nxtCorner][1] < corners[enemy.nxtCorner][3]){enemy.dir = 3; }     //down
        enemy.nxtCorner++;
    }

    if(enemy.dir === 0){element.style.left = left+1+'vh';}
    else if(enemy.dir === 1){element.style.left = left-1+'vh';}
    else if(enemy.dir === 2){element.style.top = top-1+'vh';}
    else if(enemy.dir === 3){element.style.top = top+1+'vh';}


}


function enemyIndex(enemy)
{
    var i;

    if(enemy.health <= 0)
    {
        for(i = 0; i < enemies.length; i++)
        {
            if(enemies[i] === enemy){return i;}
        }
    }
}

function towerShoot(tower)
{
    var enemy = enemyInTowerRange(tower);

    if(enemy[0])
    {
        //Attack enemy
        enemy[1].health -= tower.damage;
        //alert(enemy[1].health);
        //projectile
        //NYI ^

        //set timeout to the towers attack speed now
        setTimeout(function(){towerShoot(currentTowers[0])},100*tower.speed);
    }
    else if(enemies.length !== 0)
    {
        setTimeout(function(){towerShoot(currentTowers[0])},50);
    }
}

function enemyInTowerRange(tower)
{
    var leftEdge;
    var rightEdge;
    var topEdge;
    var bottomEdge;
    var enemyTop;
    var enemyLeft;
    var enemyElement;

    leftEdge = (Number(tower.position.substring(Number(tower.position.indexOf('c'))+1))-2)*5;
    rightEdge = (Number(tower.position.substring(Number(tower.position.indexOf('c'))+1))+2)*5;
    topEdge = (Number(tower.position.substring(1,tower.position.indexOf('c')))-2)*5;
    bottomEdge = (Number(tower.position.substring(1,tower.position.indexOf('c')))+2)*5;


    for(var i = 0; i < enemies.length; i++)
    {
        enemyElement = document.getElementById(enemies[i].id);
        enemyTop = Number(enemyElement.style.top.substring(0,enemyElement.style.top.indexOf('vh')))+1;
        enemyLeft = Number(enemyElement.style.left.substring(0,enemyElement.style.left.indexOf('vh')))+1;

        //if in radius of tower
        if((enemyTop > topEdge && enemyTop < bottomEdge) && (enemyLeft > leftEdge && enemyLeft < rightEdge))
        {
            return [true, enemies[i]];
        }
    }

    return [false, null];
}

//Board -----------------------------------------------------------------------

function createGameBoard()
{
    var result = "";
    var element;
    var img;
    var row = 15;
    var col = 15;

    //Create Divs
    for(var i = 0; i < row; i++)
    {
        result += createHTMLElement('div', 'r'+i+'c'+0, 'tile clear', '');
        for(var j = 1; j < col; j++)
        {
            result += createHTMLElement('div', 'r' + i + 'c' + j, 'tile', '');
        }
    }

    //Add to board
    document.getElementById('board').innerHTML = result;

    //Add onclick and onmouseover
    var x = 0;
    var y = 0;
    for(i = 0; i < row; i++)
    {
        for(j = 0; j < col; j++)
        {
            img = document.createElement("IMG");
            img.src = "res/grass.png";
            img.id = "img"+i+"-"+j;

            element = document.getElementById('r'+i+'c'+j);
            element.appendChild(img);
            element.onclick = function() {if(towerSelected){checkTowerSelected(curTower.id.charAt(5), this);}};
            element.onmouseenter = function()
            {
                prevElem = this;
                validTile(prevElem);
            };
            element.onmouseleave = resetColor;

            element.style.left = x+'vh';
            element.style.top = y+'vh';
            x+=5;
        }
        y+=5;
        x = 0;
    }

}

function resetBoardOnclicks()
{
    var element;
    var row = 15;
    var col = 15;
    var count = 0;

    for(var i = 0; i < row; i++)
    {
        for (var j = 0; j < col; j++)
        {
            element = document.getElementById('r' + i + 'c' + j);
            if(currentTowers[count] !== undefined && document.getElementById(currentTowers[count].position) === element)
            {
                element.onclick = function(){showTowerInfo(this.id);};
                count++;
            }
            else
            {
                element.onclick = function() {if(towerSelected){checkTowerSelected(curTower.id.charAt(5), this);}};
                element.onmouseenter = function()
                                        {
                                            prevElem = this;
                                            validTile(prevElem);
                                        };
                element.onmouseleave = resetColor;
            }
        }
    }
}

//Towers -----------------------------------------------------------------------
function showTowerInfo(pos)
{
    var element = document.getElementById('towerInfo');
    var tower;
    var upgradeCost;

    //get the tower reference
    for(var i = 0; i < currentTowers.length; i++)
    {
        if(currentTowers[i].position == pos){tower = currentTowers[i];}
    }

    //remove other selections and set selection to current tower
    deselect(null);
    placedTowerSelected = true;

    //set tower info in div
    upgradeCost = (tower.cost*tower.upgrade_mult*(tower.level/2));
    $('#info').html(
        "<P>DMG: " + tower.damage + "</p>" +
        "<P>SPEED: " + tower.speed + "</p>" +
        "<P>RANGE: " + tower.radius + "</p>" +
        "<P>COST: " + tower.cost + "</p>" +
        "<P>UPGRADE: " + upgradeCost + "</p>"
    );

    element.style.visibility = 'visible';

    //highlight radius
    setHighlight(pos);

    //Set tower upgrade
    document.getElementById('upgrade').onclick = function(){upgrade(tower);};
    //set tower sell
    document.getElementById('sell').onclick = function(){sell(tower);};


}

function showTowerInfo2(tower)
{
    var element = document.getElementById('towerInfo');
    var upgradeCost;

    //set tower info in div
    upgradeCost = (tower.cost*tower.upgrade_mult*(tower.level/2));
    $('#info').html(
        "<P>DMG: " + tower.damage + "</p>" +
        "<P>SPEED: " + tower.speed + "</p>" +
        "<P>RANGE: " + tower.radius + "</p>" +
        "<P>COST: " + tower.cost + "</p>" +
        "<P>UPGRADE: " + upgradeCost + "</p>"
    );

    element.style.visibility = 'visible';
}

function upgrade(tower)
{
    var upgradeCost = (tower.cost*tower.upgrade_mult*(tower.level/2));
    if(money >= upgradeCost)
    {
        //set money
        money -= upgradeCost;
        $('#money').html("Gold: " + money);

        //set Tower level
        tower.level += 1;
        $('#level').html(""+tower.level);

        //update tower stats
        upgradeCost = (tower.cost*tower.upgrade_mult*(tower.level/2));
        tower.damage += (tower.damage*tower.upgrade_mult);
        tower.speed -= tower.upgrade_mult/2;
        $('#info').html(
            "<P>DMG: " + tower.damage + "</p>" +
            "<P>SPEED: " + tower.speed + "</p>" +
            "<P>RANGE: " + tower.radius + "</p>" +
            "<P>COST: " + tower.cost + "</p>" +
            "<P>UPGRADE: " + upgradeCost + "</p>"
        );
    }
}

function sell(tower)
{
    var sellPrice = tower.cost/2;
    var pos = tower.position;

    //Sell price should be half the gold sent on the tower including upgrades
    for(var i = 0; i < tower.level; i++)
    {
        sellPrice += (tower.cost*tower.upgrade_mult*(i/2))/2
    }

    //set money
    money += sellPrice;
    $('#money').html("Gold: " + money);

    //remove tower
    i = 0;
    while(tower !== currentTowers[i]) {i += 1;}
    currentTowers.splice(i, 1);

    i = 0;
    while(pos !== invalidSpaces[i]){i += 1;}
    invalidSpaces.splice(i,1);

    //reset tile for use
    document.getElementById(getImgIdFromElementId(document.getElementById(pos))).src = "res/grass.png";
    resetBoardOnclicks();

    //Undo radius box and towerInfo
    placedTowerSelected = false;
    setHighlight(pos);
    document.getElementById('towerInfo').style.visibility = 'hidden';
}

function setHighlight(pos)
{
    var row;
    var col;
    var radius;
    var inc;
    var count = 0;
    var element;

    //if(curTower !== null){alert(curTower.radius);radius = curTower.radius;}

    if(placedTowerSelected)
    {
        for(var i = 0; i < currentTowers.length; i++)
        {
            if(currentTowers[i].position == pos){radius = currentTowers[i].radius;}
        }

        row = parseInt(pos.substring(1,pos.indexOf('c')))-radius;
        col = parseInt(pos.substring(pos.indexOf('c')+1))-radius;

        inc = radius;
        if(radius === 1){inc = 0;}
        for(i = 0; i < 3+inc; i++) //3 because thats the possible rows around 1 tile
        {
            for(var j = 0; j < 3+inc; j++)//same as above but cols
            {
                element = document.getElementById('r'+(row+i)+'c'+(col+j));
                if(element !== null && (row+radius !== row+i || col+radius !== col+j) && !inInvalidSpaces(element))
                {
                    document.getElementById('img'+(row+i)+'-'+(col+j)).src = "res/grassT.png";
                    currentRadiusTiles.push(element.id);
                }
                else if((row+radius !== row+i || col+radius !== col+j) && inInvalidSpaces(element) && !onTowers)
                {
                    if(inCorners(element)){document.getElementById('img'+(row+i)+'-'+(col+j)).src = "res/roadCT.png"}
                    else{document.getElementById('img'+(row+i)+'-'+(col+j)).src = "res/roadT.png";}
                    currentRadiusTiles.push(element.id);
                }
                onTowers = false;
            }
        }
    }
    else if(!placedTowerSelected)
    {
        for(i = 0; i < currentRadiusTiles.length; i++)
        {
            element = document.getElementById(currentRadiusTiles[i]);
            row = Number(currentRadiusTiles[i].substring(1, currentRadiusTiles[i].indexOf('c')));
            col = Number(currentRadiusTiles[i].substring(Number(currentRadiusTiles[i].indexOf('c'))+1));

            if(!inInvalidSpaces(element))
            {
                document.getElementById('img'+(row)+'-'+(col)).src = "res/grass.png";
            }
            else if(inInvalidSpaces(element))
            {
                if(inCorners(element)){document.getElementById('img'+(row)+'-'+(col)).src = "res/roadC.png";}
                else{document.getElementById('img'+(row)+'-'+(col)).src = "res/road.png";}
            }
            count++;
        }
        currentRadiusTiles = [];
    }
}

function createTower(t, pos)
{
    var tower;
    if(t === 1){tower = {cost:100, upgrade_mult: .6, level: 1, radius : 2, damage: 20, speed: 5, position: pos};}
    else if(t === 2){tower = {cost:200, upgrade_mult: .6, level: 1, radius : 1, damage: 30, speed: 3, position: pos};}
    else if(t === 3){tower = {cost:0, upgrade_mult: .6, level: 1, radius : 1, damage: 30, speed: 3, position: pos};}
    else if(t === 4){tower = {cost:0, upgrade_mult: .6, level: 1, radius : 1, damage: 30, speed: 3, position: pos};}
    else if(t === 5){tower = {cost:0, upgrade_mult: .6, level: 1, radius : 1, damage: 30, speed: 3, position: pos};}
    else if(t === 6){tower = {cost:0, upgrade_mult: .6, level: 1, radius : 1, damage: 30, speed: 3, position: pos};}
    else if(t === 7){tower = {cost:0, upgrade_mult: .6, level: 1, radius : 1, damage: 30, speed: 3, position: pos};}
    else if(t === 8){tower = {cost:0, upgrade_mult: .6, level: 1, radius : 1, damage: 30, speed: 3, position: pos};}

    return tower;
}


//Maps -----------------------------------------------------------------------

function createPath(pathNum)
{
    if(pathNum === 1){path1();}
    if(pathNum === 2){path2();}
}

function path1()
{
    var img;

    for(var i = 0; i < 15; i++)
    {
        img  = document.getElementById("img"+7+"-"+i);
        img.src = "res/road.png";

        document.getElementById('r'+7+'c'+i).style.backgroundColor = 'green';
        invalidSpaces.push('r'+7+'c'+i);
    }
    invalidSpaces.push('-');
}

function path2()
{
    var img;
    var path = ['r7c0','r7c1','r7c2','r7c3','r7c4',
                'r6c4','r5c4','r4c4',
                'r4c5','r4c6',
                'r5c6','r6c6','r7c6','r8c6','r9c6','r10c6',
                'r10c7','r10c8','r10c9','r10c10','r10c11',
                'r9c11','r8c11','r7c11',
                'r7c12','r7c13','r7c14']; //Enter path tiles here




    for(var i = 0; i < path.length; i++)
    {

        img  = document.getElementById(getImgIdFromElementId(document.getElementById(path[i])));

        img.src = "res/road.png";

        document.getElementById(path[i]).style.backgroundColor = 'green';
        invalidSpaces.push(path[i]);

    }
    invalidSpaces.push('-');

    replaceCorners(path);
}

function replaceCorners(path)
{
    var nxtCol;
    var prevCol;
    var nxtRow;
    var prevRow;

    var vert = [];
    var img;

    for(var i = 0; i < path.length-1; i++)
    {
        img  = document.getElementById(getImgIdFromElementId(document.getElementById(path[i])));

        nxtCol = Number(path[i+1].substring(Number(path[i+1].indexOf('c'))+1));
        nxtRow = Number(path[i+1].substring(1,path[i+1].indexOf('c')));

        if(i > 0)
        {
            prevCol = Number(path[i - 1].substring(Number(path[i - 1].indexOf('c')) + 1));
            prevRow = Number(path[i - 1].substring(1, path[i - 1].indexOf('c')));
        }
        else
        {
            prevCol = nxtCol;
            prevRow = nxtRow;
        }

        //The if conditions get the number in the the string: first is row, second is col
        if(nxtCol !== prevCol && nxtRow !== prevRow)
        {
            corners.push([
                path[i],                                                        //id
                Number(path[i].substring(1,path[i].indexOf('c'))),            //corner row
                Number(path[i].substring(Number(path[i].indexOf('c'))+1)),    //corner col
                Number(path[i+1].substring(1,path[i+1].indexOf('c'))),          //next row
                Number(path[i+1].substring(Number(path[i+1].indexOf('c'))+1))   //next col
            ]);

            //change image
            img.src = "res/roadC.png";
        }

        if(nxtRow !== Number(path[i].substring(1,path[i].indexOf('c')))){vert.push(path[i+1]);}
    }

    //add last corner for enemy pathing
    corners.push([
        null,
        Number(path[i].substring(1,path[i].indexOf('c')))+1,            //corner row
        Number(path[i].substring(Number(path[i].indexOf('c'))+1))+1,    //corner col
        Number(path[0].substring(1,path[0].indexOf('c'))),              //next row
        Number(path[0].substring(Number(path[0].indexOf('c'))+1))       //next col
    ]);

    rotate(vert);
}

function rotate(vert)
{
    var img;
    var turn90 = false;

    for(i = 0; i < vert.length; i++)
    {
        img = document.getElementById(getImgIdFromElementId(document.getElementById(vert[i])));
        img.style.transform = "rotate(90deg)";
    }

    for(var i = 0; i < corners.length-1; i++)
    {
        img = document.getElementById(getImgIdFromElementId(document.getElementById(corners[i][0])));

        //rotate img
        if(corners[i][3] > corners[i][1] || corners[i][4] < corners[i][2]){img.style.transform = "rotate(270deg)";}
        if(corners[i][4] > corners[i][2])
        {
            turn90 = inInvalidSpaces(document.getElementById('r'+(Number(corners[i][0].substring(1,corners[i][0].indexOf('c')))-1)+'c'+corners[i][0].substring(Number(corners[i][0].indexOf('c'))+1)));
            img.style.transform =  "rotate(180deg)";
        }
        if(turn90)
        {
            img.style.transform =  "rotate(90deg)";
            turn90 = false;
        }
    }
}

//Tiles -----------------------------------------------------------------------

function inInvalidSpaces(element)
{
    if(element === null || element === undefined){/*alert("Element: " + element);*/}
    else
    {
        for(var i = 0; i < invalidSpaces.length; i++)
        {
            if(element.id == invalidSpaces[i]){return true;}
            if("-" == invalidSpaces[i]){onTowers = true;}
        }
    }
    return false;
}

function inCorners(element)
{
    for(var i = 0; i < corners.length; i++)
    {
        if(element.id == corners[i][0]){return true;}
    }
    return false;
}

function getImgIdFromElementId(element)
{
    var id = element.id.substring(1);
    var cLoc = id.indexOf('c');

    id = "img" + id.substring(0,cLoc) + "-" + id.substring(cLoc+1);
    return id;
}

function validTile(element)
{
    var id = getImgIdFromElementId(element);

    /*//set radius of tile
    placedTowerSelected = true;
    setHighlight(element.id);*/


    //if its not road or has tower on it and a tower is selected return true
    if(towerSelected && !inInvalidSpaces(element))
    {
        document.getElementById(id).src = "res/grassX.png";
        return true;
    }
    else if(towerSelected)
    {
        if(inCorners(element)){document.getElementById(id).src = "res/roadCX.png";}
        else{document.getElementById(id).src = "res/roadX.png";}
    }
    return false;
}

function checkTowerSelected(index, element)
{
    //if validTile and you can afford it place tower
    if(validTile(element) && money >= towerOptions[index].cost)
    {
        var tower;

        //Change mouseover stuff
        element.onmouseenter = null;
        element.onmouseleave = null;

        //replace with tower
        var img = document.getElementById(getImgIdFromElementId(prevElem)).src = "res/tower"+index+".png";
        invalidSpaces.push(element.id);

        //update money
        money -= towerOptions[index].cost;
        document.getElementById('money').innerHTML = "Gold: " + money;

        //add tower to currentTowers
        tower = createTower(Number(index)+1, element.id);
        currentTowers.push(tower);

        element.onclick = function(){showTowerInfo(this.id);};
        //deselect tower
        deselect(curTower);
    }
}

function resetColor()
{
    var id = getImgIdFromElementId(prevElem);

    /*//remove any radii
    placedTowerSelected = false;
    setHighlight(prevElem.id);*/

    if(!inInvalidSpaces(prevElem) && !placedTowerSelected){ document.getElementById(id).src = "res/grass.png";}
    else if(!placedTowerSelected)
    {
        if(inCorners(prevElem)){document.getElementById(id).src = "res/roadC.png";}
        else{document.getElementById(id).src = "res/road.png";}
    }
}

//Selection and Deselection ---------------------------------------------------------
function select()
{
    deselect(curTower);
    curTower = this;
    curTowerBorder = curTower.style.backgroundColor;
    curTower.style.borderColor = 'white';
    towerSelected = true;
    showTowerInfo2(curTower);
}

function deselect(tower)
{
    document.getElementById('towerInfo').style.visibility = 'hidden';
    placedTowerSelected = false;
    //remove radius
    setHighlight(null);

    if(tower !== null)
    {
        tower.style.borderColor = curTowerBorder;
        towerSelected = false;
        curTower = null;
    }
}



//Creates element tags ------------------------------------------------------------
function createHTMLElement(elementType, id, classInfo, content)
{

    //Sets all null values to 0 length strings
    if(elementType === null){elementType = "";}
    if(id === null){id = "";}
    if(classInfo === null){classInfo = "";}
    if(content === null){content = "";}

    //Trims all spaces preceding and succeeding the parameters
    //excluding the content.
    elementType = elementType.trim();
    id = id.trim();
    classInfo = classInfo.trim();

    //If str length is not 0 it adds class=" or id=" plus "
    if(id.length > 0){id = ' id="' + id + '"';}
    if(classInfo.length > 0){classInfo = ' class="' + classInfo + '"';}

    return '<'	+ elementType +
        id 	+ classInfo	  +
        '>'	+ content	  +
        '</' + elementType + '>';
}