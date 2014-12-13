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

var currentRadiusTiles = [];

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
    createTower(2,null)//,
    //tower2 = createTower(3,null),
    //tower3 = createTower(4,null)
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
    createPath(1);
    document.getElementById('tower0').onclick = select;
    document.getElementById('tower1').onclick = select;
    document.getElementById('deselect').onclick = function(){deselect(curTower);};

    document.getElementById('start').onclick = start;
};

//Game Functionality -----------------------------------------------------------------------

function start()
{
    var enemy;

    document.getElementById('start').onclick = null;
    for(var i = 0; i < 10; i++)
    {
        enemy = createHTMLElement('div', 'e'+i, 'enemy', '');
        document.getElementById('board').innerHTML = document.getElementById('board').innerHTML + enemy;
        enemies.push({health: 100, speed: 1, id: 'e'+i, interval: null});
    }

    positionEnemies();

    setTimeout(function(){moveEnemy(enemies[0]);},100);
    setTimeout(function(){moveEnemy(enemies[1]);},100);
    setTimeout(function(){moveEnemy(enemies[2]);},100);
    setTimeout(function(){moveEnemy(enemies[3]);},100);
    setTimeout(function(){moveEnemy(enemies[4]);},100);
    setTimeout(function(){moveEnemy(enemies[5]);},100);
    setTimeout(function(){moveEnemy(enemies[6]);},100);
    setTimeout(function(){moveEnemy(enemies[7]);},100);
    setTimeout(function(){moveEnemy(enemies[8]);},100);
    setTimeout(function(){moveEnemy(enemies[9]);},100);

    for(i = 0; i < enemies.length; i++)//enemies.length; i++)
    {
        //setTimeout(function(){moveEnemy(enemies[i]);},100);
    }

    for(i = 0; i < currentTowers.length; i++)
    {
        //setInterval(function(){towerShoot(currentTowers[i])},10*currentTowers[i].speed);
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
        left = -5-(i*3);
        document.getElementById('e'+i).style.top = top+'vh';
        document.getElementById('e'+i).style.left = left+'vh';
        document.getElementById('e'+i).style.visibility = 'hidden';
    }
}

function moveEnemy(enemy)
{
    var dead = false;
    var index = enemyIndex(enemy);
    var element = document.getElementById(enemy.id);
    var left = Number(element.style.left.substring(0,element.style.left.indexOf('vh')));

    if(left === 0){element.style.visibility = 'visible';}
    if(left >= 73)
    {
        enemy.health = 0;
        dead = true;
        lives -= 1;
        document.getElementById('health').innerHTML = "Lives: " + lives;
    }
    if(!dead){setTimeout(function(){moveEnemy(enemy)},100);}
    if(dead)
    {
        //removes enemy from game
        element.remove();
        enemies.splice(index, 1);

        if(enemies.length === 0){document.getElementById('start').onclick = start;}
        return;
    }

    //move enemy
    element.style.left = left+1+'vh';
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
    if(enemyInTowerRange(tower))
    {

    }
}

function enemyInTowerRange(tower)
{
    for(var i = 0; i < enemies.length; i++)
    {
        if(0){}
    }
}

function checkEnemiesStatus()
{
    for(var i = 0; i < enemies.length; i++)
    {
        if(enemies[i].health <= 0){enemies.splice(i);}
    }
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

//Towers -----------------------------------------------------------------------
function showTowerInfo(pos)
{
    var element = document.getElementById('towerInfo');
    var tower;

    //get the tower reference
    for(var i = 0; i < currentTowers.length; i++)
    {
        if(currentTowers[i].position == pos){tower = currentTowers[i];}
    }

    //remove other selections and set selection to current tower
    deselect(null);
    placedTowerSelected = true;

    //set tower info in div
    document.getElementById('info').innerHTML = "<P>DMG: " + tower.damage + "</p>" +
                                                "<P>SPEED: " + tower.speed + "</p>" +
                                                "<P>RANGE: " + tower.range + "</p>" +
                                                "<P>COST: " + tower.cost + "</p>";

    element.style.visibility = 'visible';

    //highlight radius
    setHighlight(pos);
}

function setHighlight(pos)
{
    var row;
    var col;
    var radius;
    var inc;
    var count = 0;
    var element;

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
                    document.getElementById('img'+(row+i)+'-'+(col+j)).src = "res/roadT.png";
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
                document.getElementById('img'+(row)+'-'+(col)).src = "res/road.png";
            }
            count++;
        }
        currentRadiusTiles = [];
    }
}

function createTower(t, pos)
{
    var tower;
    if(t === 1){tower = {cost:100, upgrade_mult: .6, level: 1, radius : 2, damage: 10, speed: 10, position: pos};}
    else if(t === 2){tower = {cost:200, upgrade_mult: .6, level: 1, radius : 1, damage: 15, speed: 5, position: pos};}
    //else if(t === 3){this.cost=100; this.upgrade_mult = .6; this.level = 1; this.radius = 1; this.damage = 10; this.speed = 10; this.position = pos;} //NYI
    //else if(t === 4){this.cost=100; this.upgrade_mult = .6; this.level = 1; this.radius = 1; this.damage = 10; this.speed = 10; this.position = pos;} //NYI

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

        document.getElementById('r'+7+'c'+i).style.backgroundColor = 'sandybrown';
        invalidSpaces.push('r'+7+'c'+i);
    }
    invalidSpaces.push('-');
}

function path2()
{
    //Part 1
    for(var i = 0; i < 4; i++)
    {
        //ri-c7
    }

    //Part 2
    for(var j = 0; j < 3; j++)
    {
        //ri-cj
    }

    //ri+1-cj-1
    //ri+2-cj-1

    i += 3;
    for(; j > 12; j--)
    {
        //ri-cj
    }

    //ri+1-cj+1
    //ri+2-cj+1

    i += 3;
    for(;j<7;j++)
    {
        //ri-cj
    }

    //Part 3
    for(;i < 15; i++)
    {
        //ri-cj
    }

}

//Tiles -----------------------------------------------------------------------

function inInvalidSpaces(element)
{
    for(var i = 0; i < invalidSpaces.length; i++)
    {
        if(element.id == invalidSpaces[i]){return true;}
        if("-" == invalidSpaces[i]){onTowers = true;}
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

    //if its not road or has tower on it and a tower is selected return true
    if(towerSelected && !inInvalidSpaces(element))
    {
        document.getElementById(id).src = "res/grassX.png";
        return true;
    }
    else if(towerSelected)
    {
        document.getElementById(id).src = "res/roadX.png";
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

    if(!inInvalidSpaces(prevElem) && !placedTowerSelected){ document.getElementById(id).src = "res/grass.png";}
    else if(!placedTowerSelected){document.getElementById(id).src = "res/road.png";}
}

//Selection and Deselection ---------------------------------------------------------
function select()
{
    deselect(curTower);
    curTower = this;
    curTowerBorder = curTower.style.backgroundColor;
    curTower.style.borderColor = 'white';
    towerSelected = true;
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